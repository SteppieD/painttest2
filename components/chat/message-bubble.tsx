'use client'

import { User, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  quoteData?: any
}

interface MessageBubbleProps {
  message: Message
  isLoading?: boolean
}

export function MessageBubble({ message, isLoading }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  if (isLoading) {
    return (
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "flex items-start gap-3",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
        isUser 
          ? "bg-blue-600 text-white" 
          : "bg-blue-100 text-blue-600"
      )}>
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>
      
      <div className={cn(
        "flex-1 space-y-2",
        isUser ? "flex flex-col items-end" : ""
      )}>
        <div className={cn(
          "rounded-lg p-3 max-w-[80%] break-words",
          isUser 
            ? "bg-blue-600 text-white ml-12" 
            : "bg-gray-100 text-gray-900 mr-12"
        )}>
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </div>
        </div>
        
        <div className={cn(
          "text-xs text-gray-500",
          isUser ? "text-right mr-12" : "ml-0"
        )}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  )
}