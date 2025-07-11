"use client"

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Bot, User, Send, Sparkles, Calculator, Clock, FileText, Mail, Download } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { IntelligentQuoteParser } from '@/lib/services/intelligent-quote-parser'
import { QuotePDFGenerator } from '@/lib/services/quote-pdf-generator'
import { QuoteEmailTemplates } from '@/lib/services/quote-email-templates'

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
  const [showQuoteActions, setShowQuoteActions] = useState(false)

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
    
    // Process with intelligent parser
    setTimeout(() => {
      const aiResponse = processWithIntelligentParser(input, messages)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
      
      if (aiResponse.quote) {
        setQuoteEstimate(aiResponse.quote)
        setShowQuoteActions(true)
      }
      
      setIsLoading(false)
    }, 1500)
  }

  const processWithIntelligentParser = (userInput: string, previousMessages: Message[]): { message: string; quote?: QuoteEstimate } => {
    try {
      // Parse the input with intelligent parser
      const parsedData = IntelligentQuoteParser.parse(userInput)
      
      // Check if we have enough information to generate a quote
      const hasWallInfo = parsedData.surfaces.walls?.squareFeet || 
                         (parsedData.surfaces.walls?.linearFeet && parsedData.surfaces.walls?.height)
      const hasPaintInfo = parsedData.paint?.pricePerGallon && parsedData.paint?.coveragePerGallon
      const hasLaborInfo = parsedData.laborRate || parsedData.chargeRates?.walls
      
      if (hasWallInfo && (hasPaintInfo || hasLaborInfo)) {
        // We have enough info to calculate a quote
        const result = IntelligentQuoteParser.calculateQuote(parsedData)
        return {
          message: result.summary,
          quote: result.breakdown
        }
      }
      
      // We need more information - ask for what's missing
      let missingInfo = []
      
      if (!hasWallInfo) {
        if (!parsedData.surfaces.walls?.linearFeet) {
          missingInfo.push('linear feet of walls')
        }
        if (!parsedData.surfaces.walls?.height) {
          missingInfo.push('ceiling height')
        }
      }
      
      if (!hasPaintInfo && !hasLaborInfo) {
        missingInfo.push('paint cost per gallon and coverage rate, or your charge rate per square foot')
      }
      
      if (missingInfo.length > 0) {
        let response = 'Got it! '
        if (parsedData.customerName) {
          response += `I'm preparing a quote for ${parsedData.customerName}. `
        }
        response += `I just need: ${missingInfo.join(', ')}.`
        
        return { message: response }
      }
      
    } catch (error) {
      // Fallback to simple responses if parsing fails
      console.error('Parser error:', error)
    }
    
    // Fallback responses for edge cases
    const input_lower = userInput.toLowerCase()
    
    if (input_lower.includes('bedroom') || input_lower.includes('room')) {
      const roomCount = extractNumber(input_lower) || 2
      const sqft = roomCount * 150 // Average room size
      const quote: QuoteEstimate = {
        area: sqft,
        paintGallons: Math.ceil(sqft / 350),
        paintCost: sqft * 0.85,
        laborCost: sqft * 1.50,
        total: sqft * 2.75
      }
      
      return {
        message: `Great! Based on your description of ${roomCount} bedroom${roomCount > 1 ? 's' : ''}, I've calculated an estimate for approximately ${sqft} square feet.\n\n**Quote Summary:**\n• Area: ${sqft} sq ft\n• Paint & Materials: ${formatCurrency(quote.paintCost!)}\n• Labor: ${formatCurrency(quote.laborCost!)}\n• **Total Estimate: ${formatCurrency(quote.total!)}**\n\nWould you like to adjust any details or get a more detailed breakdown?`,
        quote
      }
    }
    
    // Default response for gathering more info
    return {
      message: "That sounds like a great project! To give you the most accurate quote, I need a bit more detail. Could you provide:\n• Linear feet of walls or room dimensions\n• Ceiling height\n• Paint preferences and cost per gallon\n• Whether you're including labor or just materials?"
    }
  }

  const extractNumber = (text: string): number | null => {
    const match = text.match(/(\d+)/)
    return match ? parseInt(match[1]) : null
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <Header />
      
      <main className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-4">
                Paint Quote Assistant
              </h1>
              <p className="text-lg text-gray-600">
                Powered by AI • Instant Quotes • Professional Accuracy
              </p>
            </div>

            {/* Chat Container */}
            <Card className="shadow-xl">
              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-br from-primary-500 to-accent-500' 
                          : 'bg-gray-200'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Bot className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      
                      <div className={`flex-1 ${
                        message.role === 'user' ? 'text-right' : ''
                      }`}>
                        <div className={`inline-block p-4 rounded-2xl max-w-[80%] ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <div 
                            className="whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ 
                              __html: message.content
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\n/g, '<br />')
                            }}
                          />
                          <div className={`text-xs mt-2 ${
                            message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 p-4 rounded-2xl">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex gap-3">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Describe your painting project..."
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button 
                      onClick={sendMessage} 
                      disabled={isLoading || !input.trim()}
                      className="bg-gradient-to-r from-primary-500 to-accent-500 text-white"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>AI-powered instant estimates</span>
                    </div>
                    <button
                      onClick={() => setInput("It's for Sarah at 123 Oak Street. 400 linear feet of interior walls, 10ft ceilings, $65/gal premium paint with 400 sqft coverage. Labor included at $1.75/sqft. No ceilings, doors, or trim.")}
                      className="text-primary-600 hover:underline text-xs"
                    >
                      Try example →
                    </button>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Average response: 2 seconds</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quote Actions */}
            {showQuoteActions && quoteEstimate && (
              <Card className="mt-6 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Quote Ready!
                  </CardTitle>
                  <CardDescription>
                    Your professional quote has been generated. What would you like to do next?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => {
                        const quoteData = JSON.parse(sessionStorage.getItem('latestQuote') || '{}')
                        const html = QuotePDFGenerator.generateHTML({
                          id: `QUOTE-${Date.now()}`,
                          ...quoteData,
                          customerEmail: ''
                        })
                        const blob = new Blob([html], { type: 'text/html' })
                        const url = URL.createObjectURL(blob)
                        window.open(url, '_blank')
                      }}
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => {
                        const quoteData = JSON.parse(sessionStorage.getItem('latestQuote') || '{}')
                        const emailData = QuoteEmailTemplates.quoteDelivery({
                          customerName: quoteData.customerName || 'Customer',
                          customerEmail: 'customer@example.com',
                          quoteId: `QUOTE-${Date.now()}`,
                          total: quoteData.total,
                          projectType: quoteData.projectType,
                          area: quoteData.area,
                          quoteUrl: window.location.origin + '/quote/view'
                        })
                        // In a real app, this would send the email
                        alert('Email template ready! Subject: ' + emailData.subject)
                      }}
                    >
                      <Mail className="w-4 h-4" />
                      Email Quote
                    </Button>
                    
                    <Button 
                      variant="kofi" 
                      className="flex items-center gap-2"
                      onClick={() => {
                        setInput("Let's create another quote")
                        setShowQuoteActions(false)
                      }}
                    >
                      <Calculator className="w-4 h-4" />
                      New Quote
                    </Button>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Tip:</strong> You can add the customer's email address by saying "Send to john@example.com"
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Tips */}
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-800">Pro Tip</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-700">
                    Include linear feet, ceiling height, and paint preferences for instant quotes
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-green-50 border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-800">Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-700">
                    "500 linear feet of walls, 9ft ceilings, $50/gal paint, labor at $1.50/sqft"
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-800">Save Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-purple-700">
                    Our AI understands contractor terminology and pricing structures
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}