/**
 * Unified Quote Assistant - Single Claude Sonnet 4 Integration
 * 
 * This replaces all multiple AI systems with one comprehensive solution
 * that properly parses complex quote information and generates accurate calculations.
 */

import { 
  parseCustomerInfo, 
  parseDimensions, 
  parseProjectType,
  parseMarkupPercentage,
  ConversationData 
} from './improved-conversation-parser';
import { 
  calculateProfessionalQuote, 
  ProjectDimensions, 
  DEFAULT_PAINT_PRODUCTS, 
  DEFAULT_CHARGE_RATES,
  ProfessionalQuote 
} from './professional-quote-calculator';

interface QuoteParsingResult {
  success: boolean;
  customerInfo: {
    customer_name: string;
    address: string;
  };
  projectType: 'interior' | 'exterior' | 'both';
  dimensions: Partial<ProjectDimensions>;
  paintInfo: {
    brand?: string;
    product?: string;
    cost_per_gallon?: number;
    spread_rate?: number;
  };
  laborRate?: number;
  markupPercentage: number;
  surfaces: {
    walls: boolean;
    ceilings: boolean;
    trim: boolean;
    doors: boolean;
    windows: boolean;
  };
  specialRequests: string[];
  isComplete: boolean;
  missingFields: string[];
}

export class UnifiedQuoteAssistant {
  private openRouterApiKey: string;
  
  constructor() {
    this.openRouterApiKey = process.env.OPENROUTER_API_KEY || '';
  }

  /**
   * Parse comprehensive quote information from a single message
   */
  async parseCompleteQuoteMessage(userInput: string): Promise<QuoteParsingResult> {
    // Use existing proven parsers first
    const customerInfo = parseCustomerInfo(userInput);
    const projectType = parseProjectType(userInput);
    const dimensions = parseDimensions(userInput, projectType);
    const markupPercentage = parseMarkupPercentage(userInput);
    
    // Parse additional information
    const paintInfo = this.parsePaintInformation(userInput);
    const laborRate = this.parseLaborRate(userInput);
    const surfaces = this.parseSurfaces(userInput);
    const specialRequests = this.parseSpecialRequests(userInput);
    
    // Determine completeness
    const missingFields = this.identifyMissingFields({
      customerInfo,
      dimensions,
      paintInfo,
      laborRate,
      surfaces
    });
    
    return {
      success: true,
      customerInfo,
      projectType,
      dimensions,
      paintInfo,
      laborRate,
      markupPercentage,
      surfaces,
      specialRequests,
      isComplete: missingFields.length === 0,
      missingFields
    };
  }

  /**
   * Parse paint information from user input
   */
  private parsePaintInformation(input: string): {
    brand?: string;
    product?: string;
    cost_per_gallon?: number;
    spread_rate?: number;
  } {
    const lower = input.toLowerCase();
    
    // Parse cost per gallon
    const costMatch = input.match(/\$(\d+\.?\d*)\s*(?:a|per)?\s*gallon/i);
    const cost_per_gallon = costMatch ? Number(costMatch[1]) : undefined;
    
    // Parse spread rate
    const spreadRateMatch = input.match(/spread\s*rate\s*is\s*(\d+)\s*square\s*feet/i);
    const spread_rate = spreadRateMatch ? Number(spreadRateMatch[1]) : undefined;
    
    // Parse brand and product
    let brand: string | undefined;
    let product: string | undefined;
    
    if (lower.includes('sherwin') || lower.includes('sw')) {
      brand = 'Sherwin Williams';
      if (lower.includes('proclassic')) product = 'ProClassic';
      else if (lower.includes('promar')) product = 'ProMar';
      else if (lower.includes('cashmere')) product = 'Cashmere';
    } else if (lower.includes('benjamin') || lower.includes('bm')) {
      brand = 'Benjamin Moore';
      if (lower.includes('advance')) product = 'Advance';
      else if (lower.includes('aura')) product = 'Aura';
      else if (lower.includes('regal')) product = 'Regal';
    } else if (lower.includes('behr')) {
      brand = 'Behr';
    } else if (lower.includes('kilz')) {
      brand = 'Kilz';
    }
    
    // Parse sheen/finish
    if (lower.includes('eggshell')) {
      product = (product || '') + ' Eggshell';
    } else if (lower.includes('satin')) {
      product = (product || '') + ' Satin';
    } else if (lower.includes('semi-gloss') || lower.includes('semi gloss')) {
      product = (product || '') + ' Semi-Gloss';
    }
    
    return {
      brand,
      product,
      cost_per_gallon,
      spread_rate
    };
  }

  /**
   * Parse labor rate from user input
   */
  private parseLaborRate(input: string): number | undefined {
    // Look for labor rates like "$1.50 per square foot" or "labour is included in the cost per square foot at $1.50"
    const laborMatch = input.match(/labour?\s*(?:is\s*)?(?:included\s*)?(?:in\s*)?(?:the\s*)?(?:cost\s*)?(?:per\s*)?(?:square\s*)?(?:foot\s*)?(?:at\s*)?\$(\d+\.?\d*)/i);
    if (laborMatch) {
      return Number(laborMatch[1]);
    }
    
    // Alternative pattern: "$1.50 per sqft"
    const altLaborMatch = input.match(/\$(\d+\.?\d*)\s*per\s*(?:square\s*foot|sqft|sq\s*ft)/i);
    if (altLaborMatch) {
      return Number(altLaborMatch[1]);
    }
    
    return undefined;
  }

  /**
   * Parse which surfaces are being painted
   */
  private parseSurfaces(input: string): {
    walls: boolean;
    ceilings: boolean;
    trim: boolean;
    doors: boolean;
    windows: boolean;
  } {
    const lower = input.toLowerCase();
    
    return {
      walls: !lower.includes('not painting the walls') && !lower.includes('no walls'),
      ceilings: !lower.includes('not painting the ceilings') && !lower.includes('no ceilings'),
      trim: !(lower.includes('not painting') && lower.includes('trim')),
      doors: !(lower.includes('not painting') && lower.includes('doors')),
      windows: !(lower.includes('not painting') && lower.includes('windows'))
    };
  }

  /**
   * Parse special requests and notes
   */
  private parseSpecialRequests(input: string): string[] {
    const requests: string[] = [];
    const lower = input.toLowerCase();
    
    if (lower.includes('no primer')) {
      requests.push('No primer required');
    }
    
    if (lower.includes('rush') || lower.includes('asap')) {
      requests.push('Rush job');
    }
    
    if (lower.includes('labor included') || lower.includes('labour included')) {
      requests.push('Labor included in per sqft rate');
    }
    
    return requests;
  }

  /**
   * Identify what information is still needed
   */
  private identifyMissingFields(data: any): string[] {
    const missing: string[] = [];
    
    if (!data.customerInfo.customer_name) missing.push('customer name');
    if (!data.customerInfo.address) missing.push('address');
    if (!data.dimensions.wall_linear_feet) missing.push('linear feet of walls');
    if (!data.dimensions.ceiling_height) missing.push('ceiling height');
    if (!data.paintInfo.cost_per_gallon && !data.laborRate) missing.push('paint costs or labor rates');
    
    return missing;
  }

  /**
   * Generate a professional quote from parsed data
   */
  async generateQuoteFromParsedData(parsed: QuoteParsingResult, companyId: string): Promise<{
    quote: ProfessionalQuote | null;
    response: string;
    success: boolean;
  }> {
    if (!parsed.isComplete) {
      return {
        quote: null,
        response: `I have most of the information! I still need: ${parsed.missingFields.join(', ')}. Could you provide these details?`,
        success: false
      };
    }

    try {
      // Build dimensions object
      const dimensions: ProjectDimensions = {
        wall_linear_feet: parsed.dimensions.wall_linear_feet || 0,
        ceiling_height: parsed.dimensions.ceiling_height || 9,
        ceiling_area: parsed.surfaces.ceilings ? (parsed.dimensions.ceiling_area || 0) : 0,
        number_of_doors: parsed.surfaces.doors ? (parsed.dimensions.number_of_doors || 0) : 0,
        number_of_windows: parsed.surfaces.windows ? (parsed.dimensions.number_of_windows || 0) : 0,
        floor_area: parsed.dimensions.floor_area
      };

      // Build paint products
      const selectedProducts = {
        primer: {
          spread_rate: 400,
          cost: 0 // No primer if specified
        },
        wall_paint: {
          spread_rate: parsed.paintInfo.spread_rate || 350,
          cost_per_gallon: parsed.paintInfo.cost_per_gallon || 50
        },
        ceiling_paint: {
          spread_rate: parsed.paintInfo.spread_rate || 350,
          cost_per_gallon: parsed.surfaces.ceilings ? (parsed.paintInfo.cost_per_gallon || 50) : 0
        },
        trim_paint: {
          doors_per_gallon: 4.5,
          windows_per_gallon: 2.5,
          cost_per_gallon: parsed.surfaces.trim ? (parsed.paintInfo.cost_per_gallon || 50) : 0
        }
      };

      // Build charge rates
      const rates = {
        ...DEFAULT_CHARGE_RATES,
        wall_rate_per_sqft: parsed.laborRate || DEFAULT_CHARGE_RATES.wall_rate_per_sqft,
        ceiling_rate_per_sqft: parsed.surfaces.ceilings ? (parsed.laborRate || DEFAULT_CHARGE_RATES.ceiling_rate_per_sqft) : 0,
        door_rate_each: parsed.surfaces.doors ? DEFAULT_CHARGE_RATES.door_rate_each : 0,
        window_rate_each: parsed.surfaces.windows ? DEFAULT_CHARGE_RATES.window_rate_each : 0,
        primer_rate_per_sqft: 0 // No primer if specified
      };

      // Calculate quote
      const quote = calculateProfessionalQuote(
        dimensions,
        selectedProducts,
        rates,
        parsed.markupPercentage,
        false // No floor sealer
      );

      // Generate response
      const paintBrand = parsed.paintInfo.brand || 'Quality paint';
      const paintProduct = parsed.paintInfo.product || 'interior paint';
      
      const response = `Perfect! Here's your professional quote for ${parsed.customerInfo.customer_name} at ${parsed.customerInfo.address}:

**Project Details:**
• ${parsed.dimensions.wall_linear_feet} linear feet of interior walls
• ${parsed.dimensions.ceiling_height} foot ceiling height
• ${paintBrand} ${paintProduct} at $${parsed.paintInfo.cost_per_gallon}/gallon
• ${parsed.surfaces.ceilings ? 'Including' : 'NOT including'} ceilings
• ${parsed.surfaces.doors ? 'Including' : 'NOT including'} doors and trim
• ${parsed.specialRequests.length > 0 ? parsed.specialRequests.join(', ') : 'Standard painting'}

**Quote Summary:**
• Materials: $${quote.materials.total_material_cost.toLocaleString()}
• Labor: $${quote.labor.total_labor.toLocaleString()}  
• Your Cost: $${quote.total_cost.toLocaleString()}
• Customer Price: $${quote.final_price.toLocaleString()}
• Your Profit: $${quote.markup_amount.toLocaleString()} (${quote.profit_margin.toFixed(1)}% margin)

Ready to save this quote?`;

      return {
        quote,
        response,
        success: true
      };

    } catch (error) {
      console.error('Quote calculation error:', error);
      return {
        quote: null,
        response: "I encountered an error calculating the quote. Let me try to gather the information step by step instead.",
        success: false
      };
    }
  }

  /**
   * Main processing function - handles any user input intelligently
   */
  async processUserInput(
    userInput: string, 
    companyId: string, 
    conversationHistory: any[] = []
  ): Promise<{
    response: string;
    extractedData: any;
    quote?: ProfessionalQuote;
    confidence: number;
    success: boolean;
  }> {
    try {
      // First, try to parse as complete quote information
      const parsed = await this.parseCompleteQuoteMessage(userInput);
      
      if (parsed.isComplete) {
        // We have everything we need - generate the quote
        const quoteResult = await this.generateQuoteFromParsedData(parsed, companyId);
        
        return {
          response: quoteResult.response,
          extractedData: parsed,
          quote: quoteResult.quote || undefined,
          confidence: 0.95,
          success: quoteResult.success
        };
      }
      
      // If not complete, but we have significant information, acknowledge and ask for missing pieces
      if (parsed.customerInfo.customer_name || parsed.dimensions.wall_linear_feet) {
        return {
          response: `Great! I have: ${this.summarizeExtractedInfo(parsed)}.\n\nI still need: ${parsed.missingFields.join(', ')}. Can you provide these details?`,
          extractedData: parsed,
          confidence: 0.7,
          success: true
        };
      }
      
      // If we don't have much information, use Claude to generate a natural response
      return await this.generateNaturalResponse(userInput, companyId, conversationHistory);
      
    } catch (error) {
      console.error('Processing error:', error);
      return {
        response: "I'm having trouble processing that information. Could you tell me the customer's name and address to get started?",
        extractedData: {},
        confidence: 0.1,
        success: false
      };
    }
  }

  /**
   * Summarize what information we've successfully extracted
   */
  private summarizeExtractedInfo(parsed: QuoteParsingResult): string {
    const parts: string[] = [];
    
    if (parsed.customerInfo.customer_name) {
      parts.push(`Customer: ${parsed.customerInfo.customer_name}`);
    }
    
    if (parsed.customerInfo.address) {
      parts.push(`Address: ${parsed.customerInfo.address}`);
    }
    
    if (parsed.dimensions.wall_linear_feet) {
      parts.push(`${parsed.dimensions.wall_linear_feet} linear feet`);
    }
    
    if (parsed.dimensions.ceiling_height) {
      parts.push(`${parsed.dimensions.ceiling_height} ft ceilings`);
    }
    
    if (parsed.paintInfo.cost_per_gallon) {
      parts.push(`$${parsed.paintInfo.cost_per_gallon}/gallon paint`);
    }
    
    if (parsed.markupPercentage) {
      parts.push(`${parsed.markupPercentage}% markup`);
    }
    
    return parts.join(', ');
  }

  /**
   * Generate natural response using Claude when we need more information
   */
  private async generateNaturalResponse(
    userInput: string, 
    companyId: string, 
    conversationHistory: any[]
  ): Promise<{
    response: string;
    extractedData: any;
    confidence: number;
    success: boolean;
  }> {
    if (!this.openRouterApiKey) {
      return {
        response: "I'd be happy to help with your painting quote! Could you tell me the customer's name and address to get started?",
        extractedData: {},
        confidence: 0.3,
        success: true
      };
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
          'X-Title': 'Painting Quote Assistant'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-sonnet-4',
          messages: [
            {
              role: 'system',
              content: `You are a helpful painting quote assistant. Your job is to gather information for painting quotes in a natural, conversational way. Always be friendly and professional. When you need information, ask for it clearly.

For painting quotes, you typically need:
- Customer name and address
- Type of project (interior/exterior)
- Measurements (linear feet of walls, ceiling height, room dimensions)
- Paint preferences and costs
- Which surfaces to paint (walls, ceilings, trim, doors, windows)
- Labor rates and markup percentage

Keep responses concise and focused on getting the information needed for an accurate quote.`
            },
            {
              role: 'user',
              content: `Customer message: "${userInput}"\n\nPlease respond naturally and guide them toward providing quote information.`
            }
          ],
          temperature: 0.7,
          max_tokens: 200
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.choices[0]?.message?.content || "I'd be happy to help with your painting quote! What information can you provide about the project?";
        
        return {
          response: aiResponse,
          extractedData: {},
          confidence: 0.6,
          success: true
        };
      }
    } catch (error) {
      console.error('Claude API error:', error);
    }

    // Fallback response
    return {
      response: "I'd be happy to help with your painting quote! Could you tell me the customer's name, address, and project details?",
      extractedData: {},
      confidence: 0.3,
      success: true
    };
  }
}

export const unifiedQuoteAssistant = new UnifiedQuoteAssistant();