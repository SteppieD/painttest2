'use client'

import { User, Bot } from 'lucide-react'
// Simple markdown component for basic formatting
function MarkdownContent({ content }: { content: string }) {
  // Process basic markdown: **bold** and *italic*
  const processMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
  }

  return (
    <div 
      dangerouslySetInnerHTML={{ 
        __html: processMarkdown(content) 
      }}
    />
  )
}

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
      <div>
        <div>
          <Bot />
        </div>
        <div>
          <div>
            <div>
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
    <div>
      <div>
        {isUser ? (
          <User />
        ) : (
          <Bot />
        )}
      </div>
      
      <div>
        <div>
          <div>
            <MarkdownContent content={message.content} />
          </div>
        </div>
        
        <div>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  )
}