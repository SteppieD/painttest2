'use client'

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

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
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
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

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
    </div>
  )
}