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
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const handleCopy = () => {
    if (onCopy) {
      onCopy()
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

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
        "flex gap-3 animate-in fade-in-50 slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start",
        isLatest && "mb-4"
      )}
    >
      {/* Avatar for assistant */}
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Bot className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      )}

      {/* Message bubble */}
      <div
        className={cn(
          "group relative max-w-[80%] md:max-w-[70%]",
          isUser ? "order-1" : "order-2"
        )}
      >
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-sm",
            isUser
              ? "bg-blue-600 text-white rounded-br-md"
              : "bg-white text-gray-900 border border-gray-200 rounded-bl-md"
          )}
        >
          <div className="text-sm leading-relaxed">
            {formatContent(message.content)}
          </div>

          {/* Quote data preview */}
          {message.quoteData && message.quoteData.totalCost && (
            <div className={cn(
              "mt-3 pt-3 border-t text-xs",
              isUser ? "border-blue-500" : "border-gray-200"
            )}>
              <div className="font-semibold mb-1">Quote Preview:</div>
              <div className="space-y-1">
                <div>Total: ${message.quoteData.totalCost.toLocaleString()}</div>
                {message.quoteData.timeEstimate && (
                  <div>Timeline: {message.quoteData.timeEstimate}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Timestamp and actions */}
        <div className={cn(
          "flex items-center gap-2 mt-1 text-xs",
          isUser ? "justify-end" : "justify-start"
        )}>
          <span className="text-gray-500">
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </span>
          
          {/* Copy button (hidden on mobile, shown on hover on desktop) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className={cn(
              "h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
              "hover:bg-gray-100 rounded-md",
              copied && "opacity-100"
            )}
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3 text-gray-500" />
            )}
          </Button>
        </div>
      </div>

      {/* Avatar for user */}
      {isUser && (
        <div className="flex-shrink-0 mt-1 order-2">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
    </div>
  )
}