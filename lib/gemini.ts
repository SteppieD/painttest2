import { GoogleGenerativeAI } from '@google/generative-ai'

export interface QuoteRequest {
  projectType: 'interior' | 'exterior' | 'both'
  rooms?: Array<{
    name: string
    length: number
    width: number
    height: number
  }>
  sqft?: number
  paintType: 'basic' | 'premium' | 'luxury'
  prepWork: 'minimal' | 'standard' | 'extensive'
  timeline: 'rush' | 'standard' | 'flexible'
  customerInfo: {
    name: string
    phone?: string
    email?: string
    address?: string
  }
  additionalNotes?: string
}

export interface QuoteResponse {
  quoteId: string
  totalCost: number
  breakdown: {
    labor: number
    materials: number
    markup: number
  }
  timeEstimate: string
  summary: string
  recommendedActions: string[]
}

class GeminiQuoteAssistant {
  private genAI: GoogleGenerativeAI | null = null
  private model: any = null

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey)
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' })
    }
  }

  private getSystemPrompt(): string {
    return `You are a professional painting contractor's AI assistant specializing in creating accurate quotes for residential and commercial painting projects.

Your role is to:
1. Gather project details through natural conversation
2. Calculate accurate quotes based on industry standards
3. Provide professional recommendations
4. Generate detailed estimates with cost breakdowns

Key information to gather:
- Project type (interior, exterior, or both)
- Room dimensions OR total square footage
- Paint quality preferences (basic/premium/luxury)
- Prep work requirements (minimal/standard/extensive)
- Timeline preferences (rush/standard/flexible)
- Customer contact information
- Special requirements or challenges

Pricing guidelines:
- Basic interior: $1.50-2.50 per sq ft
- Premium interior: $2.50-4.00 per sq ft
- Luxury interior: $4.00-6.50 per sq ft
- Exterior adds 20-40% depending on height/complexity
- Prep work: Minimal (+10%), Standard (+25%), Extensive (+50%)
- Rush jobs: +25-50% premium

Always be professional, helpful, and thorough. Ask clarifying questions when needed.`
  }

  async generateResponse(userMessage: string, conversationHistory: Array<{role: string, content: string}>): Promise<string> {
    if (!this.model) {
      return "I'm sorry, but the AI service is not configured. Please check the API key configuration."
    }

    try {
      const context = this.getSystemPrompt()
      const fullPrompt = `${context}\n\nConversation history:\n${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\nCustomer: ${userMessage}\n\nAssistant:`

      const result = await this.model.generateContent(fullPrompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Gemini API error:', error)
      return "I'm having trouble connecting to the AI service right now. Please try again in a moment."
    }
  }

  async extractQuoteData(conversationHistory: Array<{role: string, content: string}>): Promise<Partial<QuoteRequest> | null> {
    if (!this.model) {
      return null
    }

    try {
      const extractionPrompt = `Based on the following conversation, extract and structure the quote information as JSON. Only include information that was explicitly provided:

Conversation:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Return a JSON object with any available fields from this structure:
{
  "projectType": "interior|exterior|both",
  "rooms": [{"name": "string", "length": number, "width": number, "height": number}],
  "sqft": number,
  "paintType": "basic|premium|luxury",
  "prepWork": "minimal|standard|extensive",
  "timeline": "rush|standard|flexible",
  "customerInfo": {
    "name": "string",
    "phone": "string",
    "email": "string",
    "address": "string"
  },
  "additionalNotes": "string"
}

If no relevant information is found, return null.`

      const result = await this.model.generateContent(extractionPrompt)
      const response = await result.response
      const text = response.text()

      try {
        return JSON.parse(text)
      } catch {
        return null
      }
    } catch (error) {
      console.error('Quote extraction error:', error)
      return null
    }
  }
}

export const geminiAssistant = new GeminiQuoteAssistant()