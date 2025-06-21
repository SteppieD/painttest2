'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Mic, MicOff, Image, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
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
      content: "Hi! I'm your AI painting quote assistant. I'll help you create an accurate estimate for your painting project. To get started, could you tell me:\n\n• What type of project is this (interior, exterior, or both)?\n• What space are you looking to paint?\n• Do you have room dimensions or total square footage?",
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
    "Interior painting",
    "3 bedrooms, 2 bathrooms",
    "About 2,000 sq ft",
    "Need it done within 2 weeks",
  ]

  return (
    <div className="flex flex-col h-full bg-flat-gray-50">
      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 enhanced-scroll"
        style={{ 
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch' // Better iOS scrolling
        }}
      >
        {/* Welcome message with company branding */}
        <div className="text-center py-4 mb-4">
          <div className="inline-flex items-center gap-2 card-flat px-4 py-2 rounded-flat-full shadow-flat">
            <div className="w-2 h-2 bg-business-success rounded-full animate-pulse"></div>
            <span className="text-flat-body">
              Connected to {companyData.company_name}
            </span>
          </div>
        </div>

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
        
        {/* Quick Suggestions */}
        {showSuggestions && messages.length === 1 && (
          <div className="flex flex-wrap gap-2 justify-center py-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => sendMessage(suggestion)}
                className="btn-flat text-flat-caption hover:bg-business-primary/10 hover:text-business-primary hover:border-business-primary/30 transition-colors interactive-flat"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="bg-white border-t border-flat-gray-200 shadow-flat">
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={sendMessage}
          onKeyPress={handleKeyPress}
          onVoiceInput={handleVoiceInput}
          onImageUpload={handleImageUpload}
          isLoading={isLoading}
          isRecording={isRecording}
          isMobile={isMobile}
          inputRef={inputRef}
        />
      </div>
    </div>
  )
}