'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Loader2, ArrowLeft, Save, Eye, Mail, Download, ExternalLink, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { QuoteTrainingModal } from './quote-training-modal'
import { QuotaCounter } from '@/components/ui/quota-counter'
import { MarkdownMessage } from './markdown-message'
import { trackChatMessage, trackChatQuoteReady, trackQuoteSaved, trackQuoteCalculated } from '@/lib/analytics/tracking'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  extractedData?: any
}

interface FixedChatInterfaceProps {
  companyId: string
  onQuoteGenerated?: (quoteData: any) => void
  onBack?: () => void
}

function QuoteActions({ extractedData }: { extractedData: any }) {
  const router = useRouter()
  
  if (!extractedData?.showQuoteActions) return null

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="font-semibold text-blue-900 mb-3">🎉 Quote Ready!</h4>
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={() => router.push(extractedData.previewUrl)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview Quote
        </Button>
        <Button 
          variant="outline"
          onClick={() => router.push(extractedData.sendUrl)}
        >
          <Mail className="h-4 w-4 mr-2" />
          Send to Client
        </Button>
        <Button 
          variant="outline"
          onClick={() => window.open(`/quotes/${extractedData.quoteId}/view`, '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Public Link
        </Button>
        <Button 
          variant="outline"
          onClick={() => router.push('/create-quote')}
        >
          Create Another
        </Button>
      </div>
    </div>
  )
}

export function FixedChatInterface({ 
  companyId,
  onQuoteGenerated,
  onBack
}: FixedChatInterfaceProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! Ready to create a quote.\n\nTell me the customer name and project details.`,
      timestamp: new Date().toISOString()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [currentQuote, setCurrentQuote] = useState<any>(null)
  const [customerName, setCustomerName] = useState<string>('')
  const [showTrainingModal, setShowTrainingModal] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isThinking, scrollToBottom])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Check if user is first-time and show training modal
  useEffect(() => {
    const checkIfShowTraining = async () => {
      // First check if they've explicitly dismissed the training before
      const hasSeenTraining = localStorage.getItem(`paintquote_training_${companyId}`)
      if (hasSeenTraining) {
        return // They've seen it and dismissed it
      }

      // Check if they have created quotes before
      try {
        const response = await fetch(`/api/company-quota?company_id=${companyId}`)
        if (response.ok) {
          const data = await response.json()
          // Only show training modal if they haven't created any quotes
          if (data.quotes_used === 0) {
            setShowTrainingModal(true)
          }
        }
      } catch (error) {
        console.error('Error checking quote count:', error)
      }
    }

    if (companyId) {
      checkIfShowTraining()
    }
  }, [companyId])

  const processMessage = async (userInput: string) => {
    try {
      const response = await fetch('/api/unified-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userInput,
          companyId,
          conversationHistory: messages.slice(-6).map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Failed to process message')
      }

      const data = await response.json()

      // If we got a complete quote, store it
      if (data.quote) {
        setCurrentQuote(data.quote)
      }

      // Extract customer name from response for header display
      if (data.response) {
        // Try different patterns to extract customer name
        const patterns = [
          /Customer Name:\s*([^\n\r]+)/,
          /- Customer Name:\s*([^\n\r]+)/,
          /Customer:\s*([^\n\r]+)/,
          /It's for\s+([^,\n\r]+)/i,
          /Quote for\s+([^,\n\r]+)/i,
          /Information Collected:[\s\S]*?Customer Name:\s*([^\n\r]+)/
        ];
        
        for (const pattern of patterns) {
          const match = data.response.match(pattern);
          if (match) {
            setCustomerName(match[1].trim());
            break;
          }
        }
      }
      
      if (data.quote?.project_info?.customer_name) {
        setCustomerName(data.quote.project_info.customer_name);
      }

      return {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: data.response,
        timestamp: new Date().toISOString(),
        extractedData: data.extractedData || null
      }
    } catch (error) {
      console.error('Error processing message:', error)
      return {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: "I'm sorry, I encountered an error. Please try again or contact support.",
        timestamp: new Date().toISOString()
      }
    }
  }

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim()
    if (!textToSend || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsThinking(true)
    
    // Track user message
    trackChatMessage('user', textToSend.length)

    // Try to extract customer name from user input immediately
    if (!customerName) {
      const userPatterns = [
        /It's for\s+([^,\.\n\r]+)/i,
        /Customer:\s*([^,\.\n\r]+)/i,
        /Name:\s*([^,\.\n\r]+)/i,
        /for\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/
      ];
      
      for (const pattern of userPatterns) {
        const match = textToSend.match(pattern);
        if (match) {
          const extractedName = match[1].trim();
          if (extractedName.length > 1 && extractedName.length < 50) {
            setCustomerName(extractedName);
            break;
          }
        }
      }
    }

    try {
      // Simulate thinking delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const aiResponse = await processMessage(textToSend)
      
      setIsThinking(false)
      setMessages(prev => [...prev, aiResponse])
      
      // Track AI response
      trackChatMessage('assistant', aiResponse.content.length)
      
      // Check if quote is ready
      if (aiResponse.extractedData?.showQuoteActions) {
        trackChatQuoteReady(messages.length + 2) // +2 for user and assistant messages
      }

    } catch (error) {
      console.error('Error sending message:', error)
      setIsThinking(false)
      toast({
        title: "Error",
        description: "Failed to process message. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleUseExample = (example: string) => {
    setInput(example)
    // Auto-focus the input so user can modify if needed
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const saveQuote = async () => {
    if (!currentQuote) {
      toast({
        title: "No Quote Available",
        description: "Please complete the quote information first.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      // Extract customer info from the quote or messages
      const customerName = currentQuote.project_info?.customer_name || 'Customer'
      const address = currentQuote.project_info?.address || ''

      const quoteData = {
        company_id: companyId,
        customer_name: customerName,
        address: address,
        project_type: 'interior',
        final_price: currentQuote.final_price,
        total_revenue: currentQuote.final_price,
        total_materials: currentQuote.materials.total_material_cost,
        projected_labor: currentQuote.labor.total_labor,
        markup_percentage: currentQuote.markup_percentage,
        conversation_summary: JSON.stringify(messages)
      }

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quoteData)
      })

      if (!response.ok) {
        throw new Error('Failed to save quote')
      }

      const result = await response.json()
      
      toast({
        title: "Success!",
        description: "Quote has been saved successfully."
      })

      if (onQuoteGenerated) {
        onQuoteGenerated(result)
      }

      // Navigate to quote review - check multiple possible locations for quoteId
      const quoteId = result.quoteId || result.extractedData?.quoteId || result.quote?.id;
      
      if (quoteId) {
        console.log('Redirecting to quote review:', quoteId);
        window.location.href = `/quotes/${quoteId}/review`;
      } else {
        console.error('No quote ID found in response:', result);
        toast({
          title: "Warning",
          description: "Quote saved but couldn't redirect to review page."
        });
      }
    } catch (error) {
      console.error('Error saving quote:', error)
      toast({
        title: "Error",
        description: "Failed to save quote. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Create Quote</h1>
              {customerName && (
                <p className="text-sm text-gray-600">for {customerName}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <QuotaCounter 
                companyId={companyId}
                variant="header"
                className="hidden sm:flex"
              />
              {currentQuote && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={saveQuote}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Quote
                    </>
                  )}
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowTrainingModal(true)}
                title="Show training examples"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Quota Counter */}
      <div className="sm:hidden px-4 py-2 bg-gray-50 border-b">
        <QuotaCounter 
          companyId={companyId}
          variant="badge"
          className="w-full justify-center"
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] p-4 rounded-lg shadow-sm",
                  message.role === 'user'
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white border rounded-bl-sm"
                )}
              >
                {message.role === 'user' ? (
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                ) : (
                  <MarkdownMessage content={message.content} className="text-sm" />
                )}
                {message.role === 'assistant' && (message.content.includes('Total Quote:') || message.content.includes('Customer Price:')) && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500 mb-3">Quote is ready!</div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        onClick={saveQuote}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save Quote
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => inputRef.current?.focus()}
                      >
                        Continue Editing
                      </Button>
                    </div>
                  </div>
                )}
                {message.role === 'assistant' && message.extractedData && (
                  <QuoteActions extractedData={message.extractedData} />
                )}
              </div>
            </div>
          ))}

          {/* Thinking Indicator */}
          {isThinking && (
            <div className="flex gap-3 justify-start">
              <div className="bg-white border p-4 rounded-lg rounded-bl-sm shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-gray-500">Processing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or complete quote information..."
              disabled={isLoading || isThinking}
              className="flex-1"
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading || isThinking}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Training Modal */}
      <QuoteTrainingModal
        isOpen={showTrainingModal}
        onClose={() => {
          setShowTrainingModal(false)
          // Save that they've seen the training modal
          localStorage.setItem(`paintquote_training_${companyId}`, 'true')
        }}
        onUseExample={handleUseExample}
      />
    </div>
  )
}