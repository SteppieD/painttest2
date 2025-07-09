/**
 * AI Quote Providers
 * 
 * Unified interface for different AI providers (Claude, GPT-4, Gemini)
 * Handles quote data extraction and conversational quote building
 */

import { 
  AIQuoteProvider, 
  QuoteConversationContext, 
  UnifiedQuoteData,
  CustomerInfo,
  ProjectDetails,
  ProjectMeasurements,
  RoomMeasurements
} from './unified-quote-types';

/**
 * Abstract base class for AI providers
 */
abstract class BaseAIProvider implements AIQuoteProvider {
  abstract name: 'claude' | 'gpt4' | 'gemini';

  abstract processMessage(
    message: string, 
    context: QuoteConversationContext
  ): Promise<{
    response: string;
    updatedQuote: Partial<UnifiedQuoteData>;
    nextStep?: string;
    isComplete: boolean;
  }>;

  abstract extractQuoteData(conversationHistory: any[]): Partial<UnifiedQuoteData>;

  abstract generateResponse(quoteData: Partial<UnifiedQuoteData>, missingInfo: string[]): string;

  /**
   * Common helper to determine what information is missing
   */
  protected getMissingInfo(partialQuote: Partial<UnifiedQuoteData>): string[] {
    const missing: string[] = [];
    
    // Customer info
    if (!partialQuote.customer?.name || partialQuote.customer.name === 'Unknown Customer') {
      missing.push('customer_name');
    }
    
    // Project type
    if (!partialQuote.project?.type) {
      missing.push('project_type');
    }
    
    // Measurements
    if (!partialQuote.measurements || 
        (partialQuote.measurements.totalWallsSqft === 0 && 
         partialQuote.measurements.totalCeilingsSqft === 0 &&
         partialQuote.measurements.totalTrimSqft === 0)) {
      missing.push('measurements');
    }
    
    return missing;
  }

  /**
   * Common helper to determine current step
   */
  protected getCurrentStep(partialQuote: Partial<UnifiedQuoteData>): 'customer' | 'project' | 'measurements' | 'products' | 'pricing' | 'review' {
    if (!partialQuote.customer?.name) return 'customer';
    if (!partialQuote.project?.type) return 'project';
    if (!partialQuote.measurements || partialQuote.measurements.totalWallsSqft === 0) return 'measurements';
    if (!partialQuote.products?.paintQuality) return 'products';
    if (!partialQuote.pricing) return 'pricing';
    return 'review';
  }
}

/**
 * OpenRouter AI Provider (replacing Gemini with OpenRouter)
 * Uses OpenRouter API to access various AI models
 */
export class GeminiQuoteProvider extends BaseAIProvider {
  name: 'gemini' = 'gemini'; // Keep name for compatibility
  private openRouterApiKey: string;

  constructor() {
    super();
    this.openRouterApiKey = process.env.OPENROUTER_API_KEY || '';
  }

  async processMessage(
    message: string, 
    context: QuoteConversationContext
  ): Promise<{
    response: string;
    updatedQuote: Partial<UnifiedQuoteData>;
    nextStep?: string;
    isComplete: boolean;
    cost?: number;
    withinBudget?: boolean;
  }> {
    try {
      // Use cost-optimized AI call
      const { makeCostOptimizedAICall, getSessionCostSummary } = await import('./cost-optimized-ai');
      
      const result = await makeCostOptimizedAICall(
        message,
        context.sessionId,
        150 // Limit response to 150 tokens (~$0.002)
      );

      if (!result.withinBudget) {
        return {
          response: result.response,
          updatedQuote: context.partialQuote,
          nextStep: context.currentStep,
          isComplete: false,
          cost: result.cost,
          withinBudget: false
        };
      }

      // Extract quote data from the response (simplified)
      const updatedQuote = this.extractQuoteDataFromResponse(result.response, context.partialQuote);
      
      // Determine if quote is complete
      const missingInfo = this.getMissingInfo(updatedQuote);
      const isComplete = missingInfo.length === 0;
      
      // Determine next step
      const nextStep = isComplete ? 'review' : this.getCurrentStep(updatedQuote);

      const costSummary = getSessionCostSummary(context.sessionId);
      
      // Add cost info and UX guidance based on usage
      let responseWithCost = result.response;
      
      if (result.shouldSuggestManual) {
        responseWithCost += `\n\n⚠️ We're approaching the conversation limit (${result.apiCallsRemaining} messages remaining). You can continue the conversation or switch to manual quote creation for unlimited edits.`;
      } else if (result.shouldWarn) {
        responseWithCost += `\n\n💡 Quote progress: ${costSummary.percentUsed.toFixed(0)}% budget used, ${result.apiCallsRemaining} messages remaining.`;
      }

      return {
        response: responseWithCost,
        updatedQuote,
        nextStep,
        isComplete,
        cost: result.cost,
        withinBudget: result.withinBudget
      };

    } catch (error) {
      console.error('Cost-optimized AI processing error:', error);
      return {
        response: "I'm having trouble processing that request. Please try manual quote creation for the most reliable results.",
        updatedQuote: context.partialQuote,
        nextStep: context.currentStep,
        isComplete: false,
        cost: 0,
        withinBudget: true
      };
    }
  }

  extractQuoteData(conversationHistory: any[]): Partial<UnifiedQuoteData> {
    // Simple extraction from conversation history
    const quoteData: Partial<UnifiedQuoteData> = {
      customer: { name: '' },
      project: { type: 'interior' },
      measurements: { totalWallsSqft: 0, totalCeilingsSqft: 0, totalTrimSqft: 0, rooms: [] },
      products: {}
    };

    // Extract data from conversation messages
    for (const message of conversationHistory) {
      if (typeof message.content === 'string') {
        const content = message.content.toLowerCase();
        
        // Extract customer name
        const nameMatch = content.match(/(?:customer|client|name|for)\s+(?:is\s+)?([a-z]+(?:\s+[a-z]+)?)/i);
        if (nameMatch && !quoteData.customer?.name) {
          quoteData.customer!.name = nameMatch[1];
        }

        // Extract project type
        if (content.includes('exterior') && !content.includes('interior')) {
          quoteData.project!.type = 'exterior';
        } else if (content.includes('interior')) {
          quoteData.project!.type = 'interior';
        }

        // Extract measurements
        const sqftMatch = content.match(/(\d+)\s*(?:sq\s?ft|square\s+feet)/i);
        if (sqftMatch) {
          const sqft = parseInt(sqftMatch[1]);
          if (content.includes('wall')) {
            quoteData.measurements!.totalWallsSqft = sqft;
          } else if (content.includes('ceiling')) {
            quoteData.measurements!.totalCeilingsSqft = sqft;
          } else if (content.includes('trim')) {
            quoteData.measurements!.totalTrimSqft = sqft;
          } else {
            // Default to walls if not specified
            quoteData.measurements!.totalWallsSqft = sqft;
          }
        }
      }
    }

    return quoteData;
  }

  generateResponse(quoteData: Partial<UnifiedQuoteData>, missingInfo: string[]): string {
    if (missingInfo.length === 0) {
      return "Great! I have all the information needed to create your quote. Let me calculate the pricing for you.";
    }

    const responses = {
      customer_name: "What's the customer's name for this quote?",
      project_type: "Is this an interior or exterior painting project?",
      measurements: "What are the measurements? I need to know the square footage of walls, ceilings, and trim to be painted.",
    };

    const firstMissing = missingInfo[0];
    return responses[firstMissing as keyof typeof responses] || 
           "I need a bit more information to create an accurate quote. Could you provide more details?";
  }

  /**
   * Build the conversation prompt for Gemini
   */
  private buildConversationPrompt(message: string, context: QuoteConversationContext): string {
    const { partialQuote, currentStep, companyDefaults } = context;
    
    return `You are a professional painting estimator helping create a quote. 
    
Current quote progress:
- Customer: ${partialQuote.customer?.name || 'Not specified'}
- Project Type: ${partialQuote.project?.type || 'Not specified'}
- Measurements: Walls: ${partialQuote.measurements?.totalWallsSqft || 0} sq ft, Ceilings: ${partialQuote.measurements?.totalCeilingsSqft || 0} sq ft, Trim: ${partialQuote.measurements?.totalTrimSqft || 0} sq ft
- Current Step: ${currentStep}

Company defaults:
- Wall rate: $${companyDefaults.paintRates.walls}/sq ft
- Ceiling rate: $${companyDefaults.paintRates.ceilings}/sq ft  
- Trim rate: $${companyDefaults.paintRates.trim}/sq ft
- Markup: ${companyDefaults.markupPercentage}%

Customer message: "${message}"

Please respond naturally and conversationally while gathering any missing information. If measurements are provided, acknowledge them and ask for the next needed information. Keep responses concise and professional.`;
  }

  /**
   * Extract quote data from AI response
   */
  private extractQuoteDataFromResponse(response: string, currentQuote: Partial<UnifiedQuoteData>): Partial<UnifiedQuoteData> {
    const updatedQuote = { ...currentQuote };
    
    // This is a simple extraction - in a real implementation, you'd use more sophisticated NLP
    const responseLower = response.toLowerCase();
    
    // Extract any mentioned measurements
    const sqftMatches = response.match(/(\d+)\s*(?:sq\s?ft|square\s+feet)/gi);
    if (sqftMatches) {
      for (const match of sqftMatches) {
        const num = parseInt(match);
        if (responseLower.includes('wall') && num > 0) {
          if (!updatedQuote.measurements) updatedQuote.measurements = { totalWallsSqft: 0, totalCeilingsSqft: 0, totalTrimSqft: 0, rooms: [] };
          updatedQuote.measurements.totalWallsSqft = num;
        }
      }
    }

    return updatedQuote;
  }
}

/**
 * Claude AI Provider
 */
export class ClaudeQuoteProvider extends BaseAIProvider {
  name: 'claude' = 'claude';

  async processMessage(
    message: string, 
    context: QuoteConversationContext
  ): Promise<{
    response: string;
    updatedQuote: Partial<UnifiedQuoteData>;
    nextStep?: string;
    isComplete: boolean;
  }> {
    // For now, return a simple response since Claude integration would require API setup
    const response = "I'm processing your quote request. Could you provide the square footage of walls to be painted?";
    
    return {
      response,
      updatedQuote: context.partialQuote,
      nextStep: this.getCurrentStep(context.partialQuote),
      isComplete: false
    };
  }

  extractQuoteData(conversationHistory: any[]): Partial<UnifiedQuoteData> {
    return {
      customer: { name: '' },
      project: { type: 'interior' },
      measurements: { totalWallsSqft: 0, totalCeilingsSqft: 0, totalTrimSqft: 0, rooms: [] },
      products: {}
    };
  }

  generateResponse(quoteData: Partial<UnifiedQuoteData>, missingInfo: string[]): string {
    return "I need more information to create your quote.";
  }
}

/**
 * GPT-4 AI Provider  
 */
export class GPT4QuoteProvider extends BaseAIProvider {
  name: 'gpt4' = 'gpt4';

  async processMessage(
    message: string, 
    context: QuoteConversationContext
  ): Promise<{
    response: string;
    updatedQuote: Partial<UnifiedQuoteData>;
    nextStep?: string;
    isComplete: boolean;
  }> {
    // For now, return a simple response since GPT-4 integration would require OpenAI API setup
    const response = "I'm here to help create your painting quote. What information can you provide about the project?";
    
    return {
      response,
      updatedQuote: context.partialQuote,
      nextStep: this.getCurrentStep(context.partialQuote),
      isComplete: false
    };
  }

  extractQuoteData(conversationHistory: any[]): Partial<UnifiedQuoteData> {
    return {
      customer: { name: '' },
      project: { type: 'interior' },
      measurements: { totalWallsSqft: 0, totalCeilingsSqft: 0, totalTrimSqft: 0, rooms: [] },
      products: {}
    };
  }

  generateResponse(quoteData: Partial<UnifiedQuoteData>, missingInfo: string[]): string {
    return "I need more information to create your quote.";
  }
}

/**
 * Factory function to get the appropriate AI provider
 */
export function getAIProvider(providerName: 'claude' | 'gpt4' | 'gemini'): AIQuoteProvider {
  switch (providerName) {
    case 'claude':
      return new ClaudeQuoteProvider();
    case 'gpt4':
      return new GPT4QuoteProvider();
    case 'gemini':
      return new GeminiQuoteProvider();
    default:
      return new GeminiQuoteProvider(); // Default to Gemini
  }
}

/**
 * Conversation session manager
 */
export class QuoteConversationManager {
  private sessions: Map<string, QuoteConversationContext> = new Map();

  /**
   * Initialize or get existing conversation session
   */
  getSession(sessionId: string, companyId: number): QuoteConversationContext {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        companyId,
        sessionId,
        partialQuote: {
          customer: { name: '' },
          project: { type: 'interior' },
          measurements: { totalWallsSqft: 0, totalCeilingsSqft: 0, totalTrimSqft: 0, rooms: [] },
          products: {}
        },
        currentStep: 'customer',
        missingInfo: ['customer_name', 'project_type', 'measurements'],
        provider: 'gemini',
        temperature: 0.7,
        maxTokens: 1000,
        companyDefaults: {
          paintRates: { walls: 3.00, ceilings: 2.00, trim: 5.00 },
          markupPercentage: 45,
          preferredProducts: []
        }
      });
    }

    return this.sessions.get(sessionId)!;
  }

  /**
   * Update session with new quote data
   */
  updateSession(sessionId: string, updates: Partial<QuoteConversationContext>): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      Object.assign(session, updates);
    }
  }

  /**
   * Clear session (when quote is completed)
   */
  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}

// Export singleton instance
export const conversationManager = new QuoteConversationManager();