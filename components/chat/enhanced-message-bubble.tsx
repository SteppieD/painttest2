'use client'

import { useState } from 'react'
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
            <li key={i}>
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
          <p key={i}>
            {formattedLine}
          </p>
        )
      })
  }

  return (
    <div
     
    >
      {/* iMessage-style bubble */}
      <div
       
      >
        <div
         
        >
          {formatContent(message.content)}

          {/* Quote data preview - styled more casually */}
          {message.quoteData && message.quoteData.totalCost && (
            <div>
              <div>💰 ${message.quoteData.totalCost.toLocaleString()}</div>
              {message.quoteData.timeEstimate && (
                <div>⏱️ {message.quoteData.timeEstimate}</div>
              )}
            </div>
          )}
        </div>

        {/* Timestamp - only show on hover/tap like iMessage */}
        <div>
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </div>
      </div>
    </div>
  )
}