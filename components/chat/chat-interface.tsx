'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, User, Bot, Calculator, FileText } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { MessageBubble } from './message-bubble'
import { PricePreview } from './price-preview'
import { QuoteResult } from '@/lib/quote-calculator'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  quoteData?: Partial<QuoteResult>
}

interface ChatInterfaceProps {
  onQuoteGenerated?: (quote: QuoteResult) => void
  initialMessages?: Message[]
}

export function ChatInterface({ onQuoteGenerated, initialMessages = [] }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages.length > 0 ? initialMessages : [
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI painting quote assistant. I'll help you create an accurate estimate for your painting project. To get started, could you tell me:\n\n• What type of project is this (interior, exterior, or both)?\n• What space are you looking to paint?\n• Do you have room dimensions or total square footage?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuote, setCurrentQuote] = useState<Partial<QuoteResult> | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          history: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || "I'm sorry, I didn't understand that. Could you please rephrase?",
        timestamp: new Date(),
        quoteData: data.quoteData
      }

      setMessages(prev => [...prev, assistantMessage])

      if (data.quoteData && data.quoteData.totalCost) {
        setCurrentQuote(data.quoteData)
        if (onQuoteGenerated) {
          onQuoteGenerated(data.quoteData as QuoteResult)
        }
      }

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const generateQuote = async () => {
    if (!currentQuote) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteData: currentQuote,
          conversationHistory: messages
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate quote')
      }

      const data = await response.json()
      
      const quoteMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Perfect! I've generated your detailed quote. Here's your estimate:\n\n**Quote ID:** ${data.quoteId}\n**Total Cost:** ${formatCurrency(data.totalCost)}\n**Time Estimate:** ${data.timeEstimate}\n\nWould you like me to email this quote to you, or would you prefer to copy the details?`,
        timestamp: new Date(),
        quoteData: data
      }

      setMessages(prev => [...prev, quoteMessage])
      
      if (onQuoteGenerated) {
        onQuoteGenerated(data)
      }

    } catch (error) {
      console.error('Error generating quote:', error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I had trouble generating the final quote. Let me try to gather a bit more information to provide you with an accurate estimate.",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full max-h-screen">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            AI Quote Assistant
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mobile-scroll">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLoading={false}
              />
            ))}
            
            {isLoading && (
              <MessageBubble
                message={{
                  id: 'loading',
                  role: 'assistant',
                  content: '',
                  timestamp: new Date()
                }}
                isLoading={true}
              />
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {currentQuote && currentQuote.totalCost && (
            <div className="mt-4 mb-4">
              <PricePreview
                quote={currentQuote as QuoteResult}
                onGenerateQuote={generateQuote}
                isGenerating={isLoading}
              />
            </div>
          )}

          <div className="flex gap-2 pt-3 border-t">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your painting project..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!input.trim() || isLoading}
              size="icon"
              className="shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}