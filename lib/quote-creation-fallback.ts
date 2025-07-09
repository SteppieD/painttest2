/**
 * Quote Creation Fallback System
 * 
 * Provides graceful fallbacks when OpenRouter API fails
 */

export interface FallbackQuoteData {
  customer_name: string;
  address: string;
  project_type: 'interior' | 'exterior' | 'both';
  surfaces: string[];
  measurements: {
    linear_feet?: number;
    ceiling_height?: number;
    room_count?: number;
    sqft?: number;
  };
  paint_info?: {
    quality: 'good' | 'better' | 'best' | 'premium';
    cost_per_gallon?: number;
  };
  special_requests?: string;
}

export interface FallbackQuoteResult {
  success: boolean;
  quote?: any;
  response: string;
  method: 'ai' | 'fallback' | 'wizard';
}

export class QuoteCreationFallback {
  
  /**
   * Main quote creation with fallback chain
   */
  async createQuoteWithFallback(
    userInput: string, 
    companyId: string, 
    conversationHistory: any[] = []
  ): Promise<FallbackQuoteResult> {
    
    console.log('🔄 Starting quote creation with fallback chain');
    
    // Try AI method first
    try {
      const aiResult = await this.tryAIQuoteCreation(userInput, companyId, conversationHistory);
      if (aiResult.success) {
        return { ...aiResult, method: 'ai' };
      }
    } catch (error) {
      console.warn('🤖 AI quote creation failed:', error);
    }
    
    // Try parsing fallback
    try {
      const fallbackResult = await this.tryFallbackParsing(userInput, companyId);
      if (fallbackResult.success) {
        return { ...fallbackResult, method: 'fallback' };
      }
    } catch (error) {
      console.warn('📝 Fallback parsing failed:', error);
    }
    
    // Last resort: guided wizard
    return this.fallbackToWizard(userInput);
  }

  /**
   * Try AI-powered quote creation
   */
  private async tryAIQuoteCreation(
    userInput: string, 
    companyId: string, 
    conversationHistory: any[]
  ): Promise<FallbackQuoteResult> {
    
    // Check if OpenRouter API key is available
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OpenRouter API key not available');
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
          'X-Title': 'Painting Quote Assistant'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-5-sonnet-20241022',
          messages: [
            {
              role: 'system',
              content: this.getAISystemPrompt()
            },
            {
              role: 'user',
              content: userInput
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('No response from AI');
      }

      // Try to extract structured data from AI response
      const extractedData = this.extractDataFromAIResponse(aiResponse);
      
      if (extractedData) {
        const quote = await this.generateQuoteFromData(extractedData, companyId);
        return {
          success: true,
          quote,
          response: aiResponse,
          method: 'ai' as const
        };
      }

      return {
        success: false,
        response: aiResponse,
        method: 'ai' as const
      };

    } catch (error) {
      console.error('AI API call failed:', error);
      throw error;
    }
  }

  /**
   * Try rule-based parsing as fallback
   */
  private async tryFallbackParsing(userInput: string, companyId: string): Promise<FallbackQuoteResult> {
    
    console.log('📝 Attempting fallback parsing');
    
    const parsedData = this.parseInputWithRules(userInput);
    
    if (this.isDataComplete(parsedData)) {
      const quote = await this.generateQuoteFromData(parsedData as FallbackQuoteData, companyId);
      return {
        success: true,
        quote,
        response: this.generateFallbackResponse(parsedData as FallbackQuoteData, quote),
        method: 'fallback' as const
      };
    }

    // If incomplete, ask for missing information
    const missingFields = this.getMissingFields(parsedData);
    return {
      success: false,
      response: `Got it! Just need: ${missingFields.join(', ')}.`,
      method: 'fallback' as const
    };
  }

  /**
   * Rule-based input parsing
   */
  private parseInputWithRules(input: string): Partial<FallbackQuoteData> {
    const lower = input.toLowerCase();
    const data: Partial<FallbackQuoteData> = {};

    // Extract customer name
    const namePatterns = [
      /(?:customer|client|for)\s*:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*(?:at|address)/i,
      /it'?s\s+for\s+([A-Z][a-z]+)/i
    ];

    for (const pattern of namePatterns) {
      const match = input.match(pattern);
      if (match) {
        data.customer_name = match[1].trim();
        break;
      }
    }

    // Extract address
    const addressPatterns = [
      /(\d+\s+[A-Za-z\s]+(?:Street|Drive|Road|Avenue|Lane|Boulevard|Circle|Court|Place|Way))/i,
      /address:?\s*([^\n,]+)/i,
      /at\s+(\d+[^,\n]+)/i
    ];

    for (const pattern of addressPatterns) {
      const match = input.match(pattern);
      if (match) {
        data.address = match[1].trim();
        break;
      }
    }

    // Extract project type
    if (lower.includes('interior') && lower.includes('exterior')) {
      data.project_type = 'both';
    } else if (lower.includes('exterior')) {
      data.project_type = 'exterior';
    } else {
      data.project_type = 'interior'; // Default
    }

    // Extract surfaces
    const surfaces: string[] = [];
    if (lower.includes('wall') || !lower.includes('no wall')) surfaces.push('walls');
    if (lower.includes('ceiling') && !lower.includes('no ceiling')) surfaces.push('ceilings');
    if (lower.includes('trim') && !lower.includes('no trim')) surfaces.push('trim');
    if (lower.includes('door') && !lower.includes('no door')) surfaces.push('doors');
    if (lower.includes('window') && !lower.includes('no window')) surfaces.push('windows');

    if (surfaces.length === 0) surfaces.push('walls'); // Default
    data.surfaces = surfaces;

    // Extract measurements
    const measurements: any = {};
    
    const linearFeetMatch = input.match(/(\d+)\s*linear\s*feet/i);
    if (linearFeetMatch) {
      measurements.linear_feet = parseInt(linearFeetMatch[1]);
    }

    const ceilingHeightMatch = input.match(/(\d+)\s*(?:foot|feet|ft)\s*(?:ceiling|high)/i);
    if (ceilingHeightMatch) {
      measurements.ceiling_height = parseInt(ceilingHeightMatch[1]);
    }

    const sqftMatch = input.match(/(\d+)\s*(?:sqft|square\s*feet|sq\s*ft)/i);
    if (sqftMatch) {
      measurements.sqft = parseInt(sqftMatch[1]);
    }

    const roomMatch = input.match(/(\d+)\s*(?:room|bedroom)/i);
    if (roomMatch) {
      measurements.room_count = parseInt(roomMatch[1]);
    }

    data.measurements = measurements;

    // Extract paint info
    const costMatch = input.match(/\$(\d+(?:\.\d{2})?)\s*(?:per\s*)?gallon/i);
    if (costMatch) {
      data.paint_info = {
        quality: 'better', // Default
        cost_per_gallon: parseFloat(costMatch[1])
      };
    }

    return data;
  }

  /**
   * Check if parsed data is complete enough for quote generation
   */
  private isDataComplete(data: Partial<FallbackQuoteData>): boolean {
    return !!(
      data.customer_name &&
      data.address &&
      data.measurements &&
      (data.measurements.linear_feet || data.measurements.sqft || data.measurements.room_count)
    );
  }

  /**
   * Get missing required fields
   */
  private getMissingFields(data: Partial<FallbackQuoteData>): string[] {
    const missing: string[] = [];

    if (!data.customer_name) missing.push('customer name');
    if (!data.address) missing.push('property address');
    if (!data.measurements?.linear_feet && !data.measurements?.sqft && !data.measurements?.room_count) {
      missing.push('measurements (linear feet, square footage, or room count)');
    }

    return missing;
  }

  /**
   * Format missing fields for user prompt
   */
  private formatMissingFields(missing: string[], data: Partial<FallbackQuoteData>): string {
    const found: string[] = [];
    
    if (data.customer_name) found.push(`Customer: ${data.customer_name}`);
    if (data.address) found.push(`Address: ${data.address}`);
    if (data.project_type) found.push(`Project: ${data.project_type} painting`);
    if (data.surfaces?.length) found.push(`Surfaces: ${data.surfaces.join(', ')}`);

    let result = '';
    
    if (found.length > 0) {
      result += '**Information I found:**\n' + found.map(f => `• ${f}`).join('\n') + '\n\n';
    }
    
    result += '**Still needed:**\n' + missing.map(m => `• ${m}`).join('\n');
    
    return result;
  }

  /**
   * Generate quote from parsed data
   */
  private async generateQuoteFromData(data: FallbackQuoteData, companyId: string): Promise<any> {
    
    // Use simple calculation logic
    const { measurements } = data;
    
    // Estimate wall area
    let wallArea = 0;
    if (measurements.linear_feet && measurements.ceiling_height) {
      wallArea = measurements.linear_feet * measurements.ceiling_height;
    } else if (measurements.sqft) {
      wallArea = measurements.sqft;
    } else if (measurements.room_count) {
      // Estimate 250 sqft per room
      wallArea = measurements.room_count * 250;
    }

    // Basic cost calculation
    const costPerSqft = 3.50; // Default rate
    const paintCost = (data.paint_info?.cost_per_gallon || 45) * Math.ceil(wallArea / 350);
    const laborCost = wallArea * costPerSqft;
    const materialsCost = paintCost + (wallArea * 0.20); // 20 cents per sqft for supplies
    const overhead = (laborCost + materialsCost) * 0.10; // 10% overhead
    const total = laborCost + materialsCost + overhead;

    return {
      project_info: data,
      materials: {
        total_material_cost: Math.round(materialsCost),
        walls: { cost: paintCost, sqft_needed: wallArea }
      },
      labor: {
        total_labor: Math.round(laborCost)
      },
      overhead: Math.round(overhead),
      total_cost: Math.round(total),
      final_price: Math.round(total),
      breakdown_summary: `${wallArea} sqft @ $${costPerSqft}/sqft + materials + overhead`
    };
  }

  /**
   * Generate response for fallback quote
   */
  private generateFallbackResponse(data: FallbackQuoteData, quote: any): string {
    return `✅ **Quote for ${data.customer_name}**

**Total: $${quote.final_price.toLocaleString()}**
• Materials: $${quote.materials.total_material_cost.toLocaleString()}
• Labor: $${quote.labor.total_labor.toLocaleString()}`;
  }

  /**
   * Last resort: guide user to wizard
   */
  private fallbackToWizard(userInput: string): FallbackQuoteResult {
    return {
      success: false,
      response: `Need more info. Try: "John Smith at 123 Main St, interior 200 linear feet, 9ft ceilings"`,
      method: 'wizard'
    };
  }

  /**
   * Extract structured data from AI response
   */
  private extractDataFromAIResponse(response: string): FallbackQuoteData | null {
    try {
      // Try to find JSON in the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // If no JSON, try to parse structured text
      return this.parseInputWithRules(response) as FallbackQuoteData;
    } catch (error) {
      console.warn('Failed to extract data from AI response:', error);
      return null;
    }
  }

  /**
   * AI system prompt for quote generation
   */
  private getAISystemPrompt(): string {
    return `You are a helpful painting quote assistant. Extract customer information from user input and help create professional painting quotes.

Please extract the following information when available:
- Customer name
- Property address
- Project type (interior/exterior/both)
- Surfaces to paint (walls, ceilings, trim, doors, windows)
- Measurements (linear feet, ceiling height, room count, square footage)
- Paint preferences (quality level, cost per gallon)
- Special requests

Respond conversationally and ask for missing critical information. If you have enough information to generate a quote, clearly indicate that in your response.`;
  }
}

// Export singleton instance
export const quoteCreationFallback = new QuoteCreationFallback();