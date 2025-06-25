'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, User, Bot, Calculator, FileText, Brain, AlertCircle } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { MessageBubble } from './message-bubble'
import { PricePreview } from './price-preview'
import { QuoteResult } from '@/lib/quote-calculator'
import { ParsedQuoteConfirmation } from '@/components/ui/parsed-quote-confirmation'
import { useToast } from '@/components/ui/use-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  parsedData?: any
  quoteData?: Partial<QuoteResult>
  confidence?: number
}

interface ChatInterfaceProps {
  onQuoteGenerated?: (quote: QuoteResult) => void
  initialMessages?: Message[]
  companyId?: string
}

export function IntelligentChatInterface({ onQuoteGenerated, initialMessages = [], companyId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages.length > 0 ? initialMessages : [
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI painting quote assistant. Tell me about your painting project in your own words - I'll understand what you need and create an accurate estimate. For example, you could say something like 'I need to paint a 2-bedroom apartment' or 'exterior painting for a two-story house'.",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuote, setCurrentQuote] = useState<Partial<QuoteResult> | null>(null)
  const [parsedResult, setParsedResult] = useState<any>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

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
      // First, try to parse the input using the intelligent parser
      const parseResponse = await fetch('/api/quote-parser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: input.trim()
        }),
      })

      if (!parseResponse.ok) {
        throw new Error('Failed to parse message')
      }

      const parseData = await parseResponse.json()
      console.log('Parser result:', parseData) // For debugging

      // Check if parsing was successful and confidence is high enough
      if (parseData.success && parseData.confidence_score >= 70 && !parseData.needs_clarification) {
        // We have enough information to calculate the quote
        setParsedResult(parseData)
        
        // Show what we understood
        const understandingMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `💡 **What I understood so far:**\n${formatParsedData(parseData.parsed_data)}\n\nI'm calculating your quote now...`,
          timestamp: new Date(),
          parsedData: parseData.parsed_data,
          confidence: parseData.confidence_score
        }
        setMessages(prev => [...prev, understandingMessage])

        // If we can calculate, show the quote
        if (parseData.can_calculate && parseData.quote_calculation) {
          setCurrentQuote(parseData.quote_calculation)
          setShowConfirmation(true)
          
          const quoteMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: `🎯 **Quote Ready!**\n\nBased on your project details, here's your estimate:\n\n**Total: ${formatCurrency(parseData.quote_calculation.final_quote)}**\n\nThis includes:\n- Materials: ${formatCurrency(parseData.quote_calculation.materials_cost)}\n- Labor: ${formatCurrency(parseData.quote_calculation.labor_cost)}\n${parseData.quote_calculation.primer_cost > 0 ? `- Primer: ${formatCurrency(parseData.quote_calculation.primer_cost)}\n` : ''}${parseData.quote_calculation.markup_amount > 0 ? `- Markup: ${formatCurrency(parseData.quote_calculation.markup_amount)}\n` : ''}\nWould you like to save this quote?`,
            timestamp: new Date(),
            quoteData: parseData.quote_calculation
          }
          setMessages(prev => [...prev, quoteMessage])
        }
      } else if (parseData.needs_clarification) {
        // Need more information
        setParsedResult(parseData)
        
        let clarificationContent = `I understood most of your project! Just need a few more details:\n\n`
        if (parseData.clarification_questions && parseData.clarification_questions.length > 0) {
          parseData.clarification_questions.forEach((question: string, index: number) => {
            clarificationContent += `${index + 1}. ${question}\n`
          })
        } else {
          clarificationContent += `Could you provide more details about your project? For example:\n- Project type (interior/exterior)\n- Room dimensions or square footage\n- Labor rate per square foot\n- Paint cost per gallon`
        }

        const clarificationMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: clarificationContent,
          timestamp: new Date(),
          parsedData: parseData.parsed_data,
          confidence: parseData.confidence_score
        }
        setMessages(prev => [...prev, clarificationMessage])
      } else {
        // Parsing failed or confidence too low - fall back to conversational mode
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm having trouble understanding all the details. Let's go through this step by step. What type of project is this - interior or exterior painting?",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, fallbackMessage])
      }

    } catch (error) {
      console.error('Error processing message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble processing that. Could you please try rephrasing your project details?",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const formatParsedData = (data: any) => {
    let formatted = ''
    if (data.customer_name) formatted += `• Customer: ${data.customer_name}\n`
    if (data.property_address) formatted += `• Address: ${data.property_address}\n`
    if (data.project_type) formatted += `• Project Type: ${data.project_type}\n`
    if (data.walls_sqft) formatted += `• Wall Area: ${data.walls_sqft} sq ft\n`
    if (data.linear_feet && data.wall_height_ft) formatted += `• Dimensions: ${data.linear_feet} linear ft × ${data.wall_height_ft} ft height\n`
    if (data.ceiling_included !== undefined) formatted += `• Ceilings: ${data.ceiling_included ? 'Included' : 'Not included'}\n`
    if (data.paint_brand) formatted += `• Paint Brand: ${data.paint_brand}\n`
    if (data.labor_cost_per_sqft) formatted += `• Labor Rate: $${data.labor_cost_per_sqft}/sq ft\n`
    if (data.markup_percent) formatted += `• Markup: ${data.markup_percent}%\n`
    return formatted || 'Processing your project details...'
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleFieldUpdate = (field: string, value: any) => {
    if (parsedResult) {
      setParsedResult({
        ...parsedResult,
        parsed_data: {
          ...parsedResult.parsed_data,
          [field]: value
        }
      })
      
      toast({
        title: "Field Updated",
        description: `${field} has been updated`,
      })
    }
  }

  const handleConfirm = () => {
    toast({
      title: "Quote Confirmed",
      description: "Quote has been generated and saved",
    })
    
    if (onQuoteGenerated && currentQuote) {
      onQuoteGenerated(currentQuote as QuoteResult)
    }
  }

  const handleRequestClarification = (questions: string[]) => {
    const clarificationMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I need a bit more information:\n\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, clarificationMessage])
    setShowConfirmation(false)
  }

  return (
    <div className="flex flex-col h-full max-h-screen">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            Intelligent Quote Assistant
            <span className="text-xs text-gray-500 ml-2">Powered by Multi-LLM Parser</span>
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

          {showConfirmation && parsedResult && (
            <div className="mt-4 mb-4">
              <ParsedQuoteConfirmation
                parsedData={parsedResult.parsed_data}
                canCalculate={parsedResult.can_calculate}
                quoteCalculation={parsedResult.quote_calculation}
                onFieldUpdate={handleFieldUpdate}
                onConfirm={handleConfirm}
                onRequestClarification={handleRequestClarification}
                clarificationQuestions={parsedResult.clarification_questions || []}
              />
            </div>
          )}

          <div className="flex gap-2 pt-3 border-t">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your painting project in detail..."
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