'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Copy, Check, Bot, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  quoteData?: any
}

interface EnhancedMessageBubbleProps {
  message: Message
  isLatest?: boolean
  onCopy?: () => void
}

export function EnhancedMessageBubble({ 
  message, 
  isLatest = false,
  onCopy 
}: EnhancedMessageBubbleProps) {
  const isUser = message.role === 'user'

  // Format message content with markdown support
  const formatContent = (content: string) => {
    // Simple markdown parsing for bold, italic, and bullet points
    return content
      .split('\n')
      .map((line, i) => {
        // Handle bullet points
        if (line.trim().startsWith('•')) {
          return (
            <li key={i} className="ml-4 list-disc">
              {line.replace('•', '').trim()}
            </li>
          )
        }
        
        // Handle bold text
        let formattedLine: any = line
        if (line.includes('**')) {
          const parts = line.split('**')
          formattedLine = parts.map((part, index) => 
            index % 2 === 1 ? <strong key={index}>{part}</strong> : part
          )
        }
        
        return (
          <p key={i} className={cn(i > 0 && "mt-2")}>
            {formattedLine}
          </p>
        )
      })
  }

  return (
    <div
      className={cn(
        "flex mb-1 px-4 fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* iMessage-style bubble */}
      <div
        className={cn(
          "relative max-w-[85%] group",
          isUser ? "ml-12" : "mr-12"
        )}
      >
        <div
          className={cn(
            "px-4 py-2 rounded-[18px] text-[16px] leading-[1.4]",
            isUser
              ? "bg-[#007AFF] text-white" // iMessage blue
              : "bg-[#E5E5EA] text-black" // iMessage gray
          )}
        >
          {formatContent(message.content)}

          {/* Quote data preview - styled more casually */}
          {message.quoteData && message.quoteData.totalCost && (
            <div className={cn(
              "mt-2 pt-2 border-t border-opacity-20",
              isUser ? "border-white" : "border-gray-400"
            )}>
              <div className="font-medium">💰 ${message.quoteData.totalCost.toLocaleString()}</div>
              {message.quoteData.timeEstimate && (
                <div className="text-sm opacity-90">⏱️ {message.quoteData.timeEstimate}</div>
              )}
            </div>
          )}
        </div>

        {/* Timestamp - only show on hover/tap like iMessage */}
        <div className={cn(
          "text-[11px] text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          isUser ? "text-right" : "text-left"
        )}>
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </div>
      </div>
    </div>
  )
}