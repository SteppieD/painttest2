'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Mic, MicOff, Image, Loader2 } from 'lucide-react'
import { EnhancedMessageBubble } from './enhanced-message-bubble'
import { TypingIndicator } from './typing-indicator'
import { ChatInput } from './chat-input'
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
  markupPercentage: number
  companyData: any
  isMobile: boolean
}

export function ChatInterface({ 
  onQuoteGenerated, 
  markupPercentage,
  companyData,
  isMobile 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey! 👋 Ready to get you a painting quote! What are we painting today?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuote, setCurrentQuote] = useState<Partial<QuoteResult> | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom with smooth animation
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Focus input on mount (desktop only)
  useEffect(() => {
    if (!isMobile && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isMobile])

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim()
    if (!textToSend || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setShowSuggestions(false)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          companyId: companyData.id
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

  const handleVoiceInput = () => {
    // Voice input implementation would go here
    setIsRecording(!isRecording)
    // For now, just toggle the state
    setTimeout(() => setIsRecording(false), 2000)
  }

  const handleImageUpload = () => {
    // Image upload implementation would go here
    console.log('Image upload clicked')
  }

  // Quick reply suggestions
  const suggestions = [
    "Just my living room",
    "Whole house interior",
    "Kitchen & bathroom",
    "Just need a bedroom done",
  ]

  return (
    <div>
      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
       
       
      >

        {/* Messages */}
        {messages.map((message, index) => (
          <EnhancedMessageBubble
            key={message.id}
            message={message}
            isLatest={index === messages.length - 1}
            onCopy={() => {
              navigator.clipboard.writeText(message.content)
              // Could add toast notification here
            }}
          />
        ))}
        
        {/* Typing Indicator */}
        {isLoading && <TypingIndicator />}
        
        {/* Quick Suggestions - styled like iOS quick replies */}
        {showSuggestions && messages.length === 1 && (
          <div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => sendMessage(suggestion)}
               
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* iMessage-style Input Area */}
      <div>
        <div>
          <div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="iMessage"
             
              disabled={isLoading}
            />
          </div>
          {input.trim() && (
            <button
              onClick={() => sendMessage()}
              disabled={isLoading}
             
            >
              ↑
            </button>
          )}
        </div>
      </div>
    </div>
  )
}