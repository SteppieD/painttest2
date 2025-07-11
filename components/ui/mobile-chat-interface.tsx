"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Bot, User, Send, Sparkles, Calculator, Clock, FileText, Mail, Download, ChevronLeft, MoreVertical, RefreshCw } from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface QuoteEstimate {
  area?: number
  paintGallons?: number
  paintCost?: number
  laborCost?: number
  total?: number
}

interface MobileChatInterfaceProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isLoading: boolean
  quoteEstimate: QuoteEstimate | null
  showQuoteActions: boolean
  quotaInfo?: { used: number; limit: number } | null
  onQuoteAction?: (action: 'download' | 'email' | 'new') => void
  progressStage?: number
}

export function MobileChatInterface({
  messages,
  onSendMessage,
  isLoading,
  quoteEstimate,
  showQuoteActions,
  quotaInfo,
  onQuoteAction,
  progressStage = 1
}: MobileChatInterfaceProps) {
  const [input, setInput] = useState('')
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Pull to refresh setup
  const handleRefresh = async () => {
    // Simulate refresh - in real app, this would reload quotes or sync data
    await new Promise(resolve => setTimeout(resolve, 1000))
    onQuoteAction?.('new')
  }
  
  const { containerRef, pullDistance, isRefreshing, canRefresh } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle keyboard detection
  useEffect(() => {
    const handleResize = () => {
      // Detect if keyboard is open by viewport height change
      const viewportHeight = window.visualViewport?.height || window.innerHeight
      const windowHeight = window.innerHeight
      setIsKeyboardOpen(viewportHeight < windowHeight * 0.75)
    }

    window.visualViewport?.addEventListener('resize', handleResize)
    window.addEventListener('resize', handleResize)

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    onSendMessage(input)
    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Quick action buttons based on conversation stage
  const getQuickActions = () => {
    if (progressStage === 1) return ['Interior painting', 'Exterior painting', 'Both']
    if (progressStage === 2) return ['Walls only', 'Walls and ceiling', 'Everything']
    if (progressStage === 3) return ['1 room', '2-3 rooms', '4+ rooms', 'Whole house']
    if (progressStage === 4) return ['Standard size', 'Large rooms', 'Mixed sizes']
    return []
  }

  const quickActions = getQuickActions()

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Quote Assistant</h3>
              <p className="text-xs text-gray-500">Always here to help</p>
            </div>
          </div>
        </div>
        
        {/* Quota Display */}
        {quotaInfo && (
          <div className="flex items-center gap-2">
            <div className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              quotaInfo.limit === -1 ? "bg-green-100 text-green-700" :
              quotaInfo.used >= quotaInfo.limit * 0.8 ? "bg-red-100 text-red-700" :
              quotaInfo.used >= quotaInfo.limit * 0.5 ? "bg-yellow-100 text-yellow-700" :
              "bg-gray-100 text-gray-700"
            )}>
              {quotaInfo.limit === -1 ? "∞" : `${quotaInfo.used}/${quotaInfo.limit}`}
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {progressStage > 0 && (
        <div className="px-4 py-2 bg-white border-b">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Creating your quote</span>
            <span>{Math.round((progressStage / 5) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <motion.div 
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(progressStage / 5) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Messages Area with Pull to Refresh */}
      <div className="flex-1 relative">
        {/* Pull to Refresh Indicator */}
        <motion.div
          className="absolute top-0 left-0 right-0 flex items-center justify-center overflow-hidden"
          style={{ 
            height: pullDistance,
            opacity: pullDistance / 80
          }}
        >
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : pullDistance * 4 }}
            transition={{ duration: isRefreshing ? 1 : 0, repeat: isRefreshing ? Infinity : 0 }}
          >
            <RefreshCw 
              className={cn(
                "w-6 h-6",
                canRefresh ? "text-primary-500" : "text-gray-400"
              )}
            />
          </motion.div>
        </motion.div>
        
        <div 
          ref={containerRef}
          className="h-full overflow-y-auto px-4 py-4 space-y-4" 
          style={{ 
            paddingBottom: isKeyboardOpen ? '20px' : '80px',
            transform: `translateY(${pullDistance}px)`
          }}
        >
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                drag={message.role === 'user' ? "x" : false}
                dragConstraints={{ left: -100, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, { offset }) => {
                  if (offset.x < -50) {
                    setShowDeleteConfirm(message.id)
                  }
                }}
                className={cn(
                  "flex gap-3 relative",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-600" />
                </div>
              )}
              
              <div className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3",
                message.role === 'user'
                  ? "bg-gradient-to-br from-primary-500 to-accent-500 text-white"
                  : "bg-white shadow-sm border"
              )}>
                <div 
                  className={cn(
                    "text-sm",
                    message.role === 'user' ? 'text-white' : 'text-gray-800'
                  )}
                  dangerouslySetInnerHTML={{ 
                    __html: message.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br />')
                  }}
                />
                <div className={cn(
                  "text-xs mt-1",
                  message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                )}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Loading Animation */}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Bot className="w-4 h-4 text-gray-600" />
            </div>
            <div className="bg-white shadow-sm border rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <motion.div 
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                />
                <motion.div 
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                />
                <motion.div 
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quote Actions */}
      {showQuoteActions && quoteEstimate && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 bg-green-50 border-t border-green-200"
        >
          <p className="text-sm font-medium text-green-800 mb-2">Quote Ready!</p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => onQuoteAction?.('download')}
            >
              <Download className="w-4 h-4 mr-1" />
              PDF
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => onQuoteAction?.('email')}
            >
              <Mail className="w-4 h-4 mr-1" />
              Email
            </Button>
            <Button 
              size="sm" 
              className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white"
              onClick={() => onQuoteAction?.('new')}
            >
              <Calculator className="w-4 h-4 mr-1" />
              New
            </Button>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      {quickActions.length > 0 && !isLoading && (
        <div className="px-4 py-2 bg-white border-t">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                size="sm"
                variant="outline"
                className="flex-shrink-0 text-xs"
                onClick={() => {
                  setInput(action)
                  onSendMessage(action)
                }}
              >
                {action}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t shadow-lg">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          />
          <Button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
          <Sparkles className="w-3 h-3 mr-1" />
          <span>AI-powered instant estimates</span>
        </div>
      </div>

      {/* Add custom scrollbar hiding styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}