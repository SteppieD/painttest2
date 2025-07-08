'use client'

<<<<<<< HEAD
import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Loader2, ArrowLeft, Save, Calculator } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { 
  RoomConfirmationButton, 
  SurfaceButton, 
  AddRoomButton, 
  ConfirmQuoteButton,
  ButtonGroup 
} from '@/components/ui/quote-confirmation-buttons'
import { Room } from '@/lib/professional-quote-calculator'
=======
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
>>>>>>> clean-recovery-deploy

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
<<<<<<< HEAD
  timestamp: string
}

interface ExtractedData {
  customerName?: string
  customerAddress?: string
  projectType?: 'interior' | 'exterior' | 'both'
  rooms?: Room[]
  paintQuality?: 0 | 1 | 2
  markupPercentage?: number
  [key: string]: any
}

interface IntelligentChatInterfaceProps {
  companyId: string
  companyData: any
  onQuoteGenerated?: (quoteData: any) => void
  onBack?: () => void
  editQuoteId?: string | null
}

// Helper function to render markdown text
const renderMarkdown = (text: string) => {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

export function IntelligentChatInterface({ 
  companyId,
  companyData,
  onQuoteGenerated,
  onBack,
  editQuoteId
}: IntelligentChatInterfaceProps) {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm here to help you create a professional painting quote. Let me gather some information to provide an accurate estimate.\n\n**First, what's your customer's name?**`,
      timestamp: new Date().toISOString()
=======
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
>>>>>>> clean-recovery-deploy
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
<<<<<<< HEAD
  const [isThinking, setIsThinking] = useState(false)
  const [conversationStage, setConversationStage] = useState('information_gathering')
  const [extractedData, setExtractedData] = useState<ExtractedData>({})
  const [showRoomConfirmation, setShowRoomConfirmation] = useState(false)
  const [pendingRoomConfirmation, setPendingRoomConfirmation] = useState<Room | null>(null)
  const [confirmedRooms, setConfirmedRooms] = useState<Room[]>([])
  const [showQuoteConfirmation, setShowQuoteConfirmation] = useState(false)
  
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

  const processWithIntelligentAI = async (userInput: string) => {
    try {
      const response = await fetch('/api/intelligent-quote', {
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
          })),
          extractedData,
          stage: conversationStage
        })
      })

      if (!response.ok) {
        throw new Error('Failed to process message')
      }

      const data = await response.json()

      // Update extracted data
      if (data.extractedData) {
        setExtractedData(prev => ({ ...prev, ...data.extractedData }))
      }

      // Update conversation stage
      if (data.nextStage) {
        setConversationStage(data.nextStage)
      }

      // Handle paint actions (room confirmations, etc.)
      if (data.paintActions && data.paintActions.length > 0) {
        for (const action of data.paintActions) {
          if (action.action === 'confirmRoom' && action.room) {
            setPendingRoomConfirmation(action.room)
            setShowRoomConfirmation(true)
          } else if (action.action === 'showQuoteConfirmation') {
            setShowQuoteConfirmation(true)
          }
        }
      }

      return {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: data.response,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error processing with AI:', error)
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

    try {
      // Simulate thinking delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const aiResponse = await processWithIntelligentAI(textToSend)
      
      setIsThinking(false)
      setMessages(prev => [...prev, aiResponse])

      // Check if we should generate a quote
      if (conversationStage === 'quote_ready' && extractedData.rooms && extractedData.rooms.length > 0) {
        generateQuote()
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
=======
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
>>>>>>> clean-recovery-deploy
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

<<<<<<< HEAD
  const confirmRoom = () => {
    if (pendingRoomConfirmation) {
      const confirmedRoom = {
        ...pendingRoomConfirmation,
        id: confirmedRooms.length + 1
      }
      
      setConfirmedRooms(prev => [...prev, confirmedRoom])
      setExtractedData(prev => ({
        ...prev,
        rooms: [...(prev.rooms || []), confirmedRoom]
      }))
      
      setShowRoomConfirmation(false)
      setPendingRoomConfirmation(null)

      // Send confirmation message
      sendMessage(`✅ Confirmed: ${confirmedRoom.name}`)
    }
  }

  const editRoom = () => {
    setShowRoomConfirmation(false)
    setPendingRoomConfirmation(null)
    sendMessage("Let me edit the room details")
  }

  const generateQuote = async () => {
    if (!extractedData.rooms || extractedData.rooms.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please add at least one room before generating a quote.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      // Prepare quote data
      const quoteData = {
        customer_name: extractedData.customerName || 'Customer',
        address: extractedData.customerAddress || '',
        project_type: extractedData.projectType || 'interior',
        rooms: extractedData.rooms,
        markup_percentage: extractedData.markupPercentage || companyData?.markup_percentage || 50,
        company_id: companyId,
        paint_quality: extractedData.paintQuality || 1
      }

      // Save quote
      const response = await fetch('/api/quotes', {
        method: editQuoteId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editQuoteId ? { ...quoteData, id: editQuoteId } : quoteData)
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

      // Navigate to quote review
      window.location.href = `/quotes/${result.id || editQuoteId}/review`
    } catch (error) {
      console.error('Error generating quote:', error)
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
            <h1 className="text-lg font-semibold flex-1">Create Quote</h1>
            {conversationStage === 'quote_ready' && (
              <Button 
                variant="default" 
                size="sm"
                onClick={generateQuote}
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
          </div>
        </div>
      </header>

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
                <div 
                  className="whitespace-pre-wrap text-sm" 
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(message.content)
                  }}
                />
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
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          {/* Room Confirmation */}
          {showRoomConfirmation && pendingRoomConfirmation && (
            <div className="flex gap-3 justify-start">
              <div className="max-w-[80%]">
                <RoomConfirmationButton
                  room={{
                    name: pendingRoomConfirmation.name || 'Room',
                    dimensions: `${pendingRoomConfirmation.length || 0}x${pendingRoomConfirmation.width || 0}`,
                    height: pendingRoomConfirmation.height || 9,
                    surfaces: pendingRoomConfirmation.surfaces || []
                  }}
                  onConfirm={confirmRoom}
                  onEdit={editRoom}
                />
              </div>
            </div>
          )}

          {/* Confirmed Rooms Display */}
          {confirmedRooms.length > 0 && (
            <div className="flex gap-3 justify-start">
              <div className="max-w-[80%]">
                <ButtonGroup title="Confirmed Rooms">
                  {confirmedRooms.map((room, index) => (
                    <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="font-medium text-green-900">{room.name}</div>
                      <div className="text-sm text-green-700">
                        {room.length}x{room.width} ft, {room.height} ft ceiling
                      </div>
                    </div>
                  ))}
                  <AddRoomButton 
                    onClick={() => sendMessage("I'd like to add another room")}
                  />
                </ButtonGroup>
              </div>
            </div>
          )}

          {/* Quote Confirmation */}
          {showQuoteConfirmation && (
            <div className="flex gap-3 justify-start">
              <div className="max-w-[80%]">
                <ConfirmQuoteButton
                  onClick={generateQuote}
                  disabled={isLoading}
                />
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
              placeholder="Type your response..."
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
=======
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
>>>>>>> clean-recovery-deploy
    </div>
  )
}