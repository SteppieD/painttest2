"use client"

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Bot, User, Send, Sparkles, Calculator, Clock } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface QuoteEstimate {
  rooms: number
  sqft: number
  paintCost: number
  laborCost: number
  total: number
}

export default function GetQuotePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI painting assistant. I'll help you get an instant quote for your painting project. Let's start with some basic information:\n\n• What type of project is this? (interior, exterior, or both)\n• How many rooms or which areas need painting?\n• What's the approximate size of the space?\n\nJust describe your project in your own words!",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [quoteEstimate, setQuoteEstimate] = useState<QuoteEstimate | null>(null)

  const sendMessage = async () => {
    if (!input.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(input)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      
      if (aiResponse.quote) {
        setQuoteEstimate(aiResponse.quote)
      }
      
      setIsLoading(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): { message: string; quote?: QuoteEstimate } => {
    const input_lower = userInput.toLowerCase()
    
    // Simple AI simulation based on keywords
    if (input_lower.includes('bedroom') || input_lower.includes('room')) {
      const roomCount = extractNumber(input_lower) || 2
      const sqft = roomCount * 150 // Average room size
      const quote: QuoteEstimate = {
        rooms: roomCount,
        sqft,
        paintCost: sqft * 0.85,
        laborCost: sqft * 1.50,
        total: sqft * 2.75
      }
      
      return {
        message: `Great! Based on your description of ${roomCount} bedroom${roomCount > 1 ? 's' : ''}, I've calculated an estimate for approximately ${sqft} square feet.\n\nHere's your instant quote:\n• Paint & Materials: ${formatCurrency(quote.paintCost)}\n• Labor: ${formatCurrency(quote.laborCost)}\n• **Total Estimate: ${formatCurrency(quote.total)}**\n\nWould you like to adjust any details or get a more detailed breakdown?`,
        quote
      }
    }
    
    if (input_lower.includes('kitchen')) {
      const quote: QuoteEstimate = {
        rooms: 1,
        sqft: 200,
        paintCost: 170,
        laborCost: 300,
        total: 550
      }
      
      return {
        message: `Perfect! For a kitchen painting project (approximately 200 sq ft), here's your estimate:\n\n• Paint & Materials: ${formatCurrency(quote.paintCost)}\n• Labor: ${formatCurrency(quote.laborCost)}\n• **Total Estimate: ${formatCurrency(quote.total)}**\n\nKitchens require special paint that's moisture and grease resistant. Would you like to know more about paint options?`,
        quote
      }
    }
    
    if (input_lower.includes('exterior') || input_lower.includes('outside')) {
      const quote: QuoteEstimate = {
        rooms: 1,
        sqft: 1500,
        paintCost: 600,
        laborCost: 1200,
        total: 2100
      }
      
      return {
        message: `Excellent! For exterior painting (approximately 1,500 sq ft), here's your estimate:\n\n• Paint & Materials: ${formatCurrency(quote.paintCost)}\n• Labor: ${formatCurrency(quote.laborCost)}\n• **Total Estimate: ${formatCurrency(quote.total)}**\n\nThis includes pressure washing, primer, and two coats of premium exterior paint. What type of siding do you have?`,
        quote
      }
    }
    
    // Default responses for gathering more info
    const responses = [
      "That sounds like a great project! Can you tell me more about the size of the space? For example, how many bedrooms or the square footage?",
      "Perfect! To give you the most accurate quote, I need a bit more detail. Are we talking about interior walls, ceilings, or exterior surfaces?",
      "Great! Let me help you get an accurate estimate. What's the approximate size of the area you want painted?",
      "Wonderful! I can definitely help with that. Could you describe the rooms or areas in more detail?"
    ]
    
    return {
      message: responses[Math.floor(Math.random() * responses.length)]
    }
  }

  const extractNumber = (text: string): number | null => {
    const match = text.match(/(\d+)/)
    return match ? parseInt(match[1]) : null
  }

  return (
    <>
      <Header />
      
      <main className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl text-white">
                  <Sparkles className="w-8 h-8" />
                </div>
              </div>
              <h1 className="font-display text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-4">
                AI-Powered Quote Assistant
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get an instant, accurate painting quote by simply describing your project. 
                Our AI assistant will ask the right questions and provide a detailed estimate.
              </p>
            </div>

            {/* Chat Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chat Messages */}
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="border-b bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-5 h-5" />
                      Paint Quote Assistant
                    </CardTitle>
                    <CardDescription className="text-primary-100">
                      Powered by AI • Instant Quotes • Professional Accuracy
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.role === 'assistant' && (
                          <div className="p-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full text-white">
                            <Bot className="w-4 h-4" />
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-secondary-500 to-purple-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        
                        {message.role === 'user' && (
                          <div className="p-2 bg-gradient-to-r from-secondary-500 to-purple-500 rounded-full text-white">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="p-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full text-white">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-gray-100 p-4 rounded-2xl">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe your painting project..."
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={sendMessage} disabled={isLoading}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quote Summary & Features */}
              <div className="space-y-6">
                {/* Current Quote */}
                {quoteEstimate && (
                  <Card className="bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200">
                    <CardHeader>
                      <CardTitle className="text-primary-700">Your Quote</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Rooms:</span>
                          <span className="font-medium">{quoteEstimate.rooms}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Square Feet:</span>
                          <span className="font-medium">{quoteEstimate.sqft}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Paint & Materials:</span>
                          <span className="font-medium">{formatCurrency(quoteEstimate.paintCost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Labor:</span>
                          <span className="font-medium">{formatCurrency(quoteEstimate.laborCost)}</span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between text-xl font-bold text-primary-700">
                            <span>Total:</span>
                            <span>{formatCurrency(quoteEstimate.total)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-3">
                        <Button className="w-full" variant="kofi">
                          Book Consultation
                        </Button>
                        <Button className="w-full" variant="outline">
                          Email Quote
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Features */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Why Choose AI Quotes?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-primary-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Instant Results</p>
                        <p className="text-sm text-gray-600">Get accurate quotes in seconds, not days</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calculator className="w-5 h-5 text-primary-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Professional Accuracy</p>
                        <p className="text-sm text-gray-600">Based on real contractor pricing data</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-primary-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Smart Questions</p>
                        <p className="text-sm text-gray-600">AI asks the right questions for accuracy</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}