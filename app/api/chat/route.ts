import { NextRequest, NextResponse } from 'next/server'
import { geminiAssistant } from '@/lib/gemini'
import { calculateQuote, type QuoteCalculationInput } from '@/lib/quote-calculator'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  message: string
  history: ChatMessage[]
}

export async function POST(request: NextRequest) {
  try {
    const { message, history }: ChatRequest = await request.json()

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Generate AI response
    const response = await geminiAssistant.generateResponse(message, history)
    
    // Try to extract quote data from the conversation
    const updatedHistory = [...history, { role: 'user', content: message }]
    const quoteData = await geminiAssistant.extractQuoteData(updatedHistory)
    
    let calculatedQuote = null
    
    // If we have enough quote data, calculate the quote
    if (quoteData && (quoteData.sqft || quoteData.rooms) && quoteData.paintType && quoteData.prepWork && quoteData.timeline && quoteData.projectType) {
      try {
        calculatedQuote = calculateQuote(quoteData as QuoteCalculationInput)
      } catch (error) {
        console.error('Quote calculation error:', error)
      }
    }

    return NextResponse.json({
      response,
      quoteData: calculatedQuote,
      extractedData: quoteData
    })

  } catch (error) {
    console.error('Chat API error:', error)
    
    // Fallback response if AI service fails
    const fallbackResponses = [
      "Could you tell me more about your painting project? I'd like to know the room dimensions or total square footage.",
      "What type of paint quality are you looking for - basic, premium, or luxury finish?",
      "Is this an interior or exterior painting project?",
      "How much prep work do you think will be needed - minimal, standard, or extensive?",
      "What's your preferred timeline - do you need it done quickly (rush), standard timing, or are you flexible?"
    ]
    
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    
    return NextResponse.json({
      response: randomResponse,
      quoteData: null,
      extractedData: null
    })
  }
}