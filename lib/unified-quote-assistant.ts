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
  conversationStateManager,
  ConversationStateManager 
} from './conversation-state';
import { 
  enhancedConversationStateManager,
  EnhancedConversationStateManager 
} from './conversation-state-enhanced';
import { quoteCreationFallback } from './quote-creation-fallback';
import { quoteSaver } from './quote-saver';
import { subscriptionManager } from './subscription-manager';
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
    console.log('🔍 PARSING INPUT:', userInput);
    
    // Use existing proven parsers first
    const customerInfo = parseCustomerInfo(userInput);
    console.log('👤 Customer Info:', customerInfo);
    
    const projectType = parseProjectType(userInput);
    console.log('🏠 Project Type:', projectType);
    
    const dimensions = parseDimensions(userInput, projectType);
    console.log('📏 Dimensions:', dimensions);
    
    const markupPercentage = parseMarkupPercentage(userInput);
    console.log('💰 Markup Percentage:', markupPercentage);
    
    // Parse additional information
    const paintInfo = this.parsePaintInformation(userInput);
    console.log('🎨 Paint Info:', paintInfo);
    
    const laborRate = this.parseLaborRate(userInput);
    console.log('👷 Labor Rate:', laborRate);
    
    const surfaces = this.parseSurfaces(userInput);
    console.log('🏗️ Surfaces:', surfaces);
    
    const specialRequests = this.parseSpecialRequests(userInput);
    console.log('📋 Special Requests:', specialRequests);
    
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
    
    // Check for explicit exclusions
    const notWalls = lower.includes('not painting the walls') || lower.includes('no walls') || lower.includes('walls not included');
    const notCeilings = lower.includes('not painting the ceilings') || lower.includes('no ceilings') || lower.includes('ceilings not included');
    const notTrim = (lower.includes('not painting') && lower.includes('trim')) || lower.includes('no trim') || lower.includes('trim not included');
    const notDoors = (lower.includes('not painting') && lower.includes('doors')) || lower.includes('no doors') || lower.includes('doors not included');
    const notWindows = (lower.includes('not painting') && lower.includes('windows')) || lower.includes('no windows') || lower.includes('windows not included');
    
    // Check for explicit inclusions
    const includesDoors = lower.includes('including doors') || lower.includes('paint doors') || lower.includes('doors included') || 
                         (lower.includes('doors') && lower.includes('trim'));
    const includesWindows = lower.includes('including windows') || lower.includes('paint windows') || lower.includes('windows included') ||
                           (lower.includes('windows') && lower.includes('trim'));
    const includesTrim = lower.includes('including trim') || lower.includes('paint trim') || lower.includes('trim included') ||
                        includesDoors || includesWindows; // If doors/windows included, usually trim is too
    
    return {
      walls: !notWalls,
      ceilings: !notCeilings,
      trim: !notTrim || includesTrim,
      doors: !notDoors || includesDoors,
      windows: !notWindows || includesWindows
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
    
    // Check for door/window counts if painting doors/windows
    if (data.surfaces && (data.surfaces.doors || data.surfaces.windows || data.surfaces.trim)) {
      if (!data.dimensions.number_of_doors && (data.surfaces.doors || data.surfaces.trim)) {
        missing.push('number of doors');
      }
      if (!data.dimensions.number_of_windows && (data.surfaces.windows || data.surfaces.trim)) {
        missing.push('number of windows');
      }
    }
    
    return missing;
  }

  /**
   * Generate a professional quote from parsed data
   */
  async generateQuoteFromParsedData(parsed: QuoteParsingResult, companyId: string, userInput: string = ''): Promise<{
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
      console.log('🏗️ Final Dimensions:', dimensions);

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
      console.log('🎨 Selected Products:', selectedProducts);

      // Build charge rates - check if labor is "included" in the rate
      const laborIncluded = parsed.specialRequests.some(req => req.toLowerCase().includes('labor included')) ||
                           (userInput && userInput.toLowerCase().includes('labour is included')) ||
                           (userInput && userInput.toLowerCase().includes('labor is included'));
      
      console.log('🔧 Labor Included?', laborIncluded);
      console.log('🔧 Parsed Labor Rate:', parsed.laborRate);
      
      // If labor is included, we need to handle this differently
      if (laborIncluded && parsed.laborRate) {
        // Calculate total using the all-inclusive rate
        const wallSqft = dimensions.wall_linear_feet * dimensions.ceiling_height;
        const totalCostWithLaborIncluded = wallSqft * parsed.laborRate;
        
        console.log('🧮 Wall Sqft:', wallSqft);
        console.log('🧮 Total Cost (labor included):', totalCostWithLaborIncluded);
        
        // Return a simplified quote structure
        const quote = {
          project_info: dimensions,
          materials: {
            total_material_cost: 0, // Included in per-sqft rate
            walls: { cost: 0, sqft_needed: wallSqft, gallons_needed: 0 },
            ceilings: { cost: 0, sqft_needed: 0, gallons_needed: 0 },
            trim_doors_windows: { cost: 0, doors_count: 0, windows_count: 0, gallons_needed: 0 },
            primer: { cost: 0, sqft_needed: 0, gallons_needed: 0 }
          },
          labor: {
            total_labor: 0, // Included in per-sqft rate
            wall_labor: 0,
            ceiling_labor: 0,
            door_labor: 0,
            window_labor: 0,
            primer_labor: 0
          },
          overhead: 0,
          total_cost: totalCostWithLaborIncluded,
          markup_percentage: parsed.markupPercentage,
          markup_amount: totalCostWithLaborIncluded * (parsed.markupPercentage / 100),
          final_price: totalCostWithLaborIncluded * (1 + parsed.markupPercentage / 100),
          profit_margin: parsed.markupPercentage,
          breakdown_summary: `All-inclusive rate: $${parsed.laborRate}/sqft × ${wallSqft} sqft = $${totalCostWithLaborIncluded.toLocaleString()}`
        };
        
        console.log('📊 Labor-Included Quote Result:', quote);
        return {
          quote,
          response: this.generateLaborIncludedResponse(parsed, quote),
          success: true
        };
      }
      
      const rates = {
        ...DEFAULT_CHARGE_RATES,
        wall_rate_per_sqft: parsed.laborRate || DEFAULT_CHARGE_RATES.wall_rate_per_sqft,
        ceiling_rate_per_sqft: parsed.surfaces.ceilings ? (parsed.laborRate || DEFAULT_CHARGE_RATES.ceiling_rate_per_sqft) : 0,
        door_rate_each: parsed.surfaces.doors ? DEFAULT_CHARGE_RATES.door_rate_each : 0,
        window_rate_each: parsed.surfaces.windows ? DEFAULT_CHARGE_RATES.window_rate_each : 0,
        primer_rate_per_sqft: 0 // No primer if specified
      };
      console.log('💼 Charge Rates:', rates);
      console.log('💰 Markup Percentage for Calculation:', parsed.markupPercentage);

      // Calculate quote
      const quote = calculateProfessionalQuote(
        dimensions,
        selectedProducts,
        rates,
        parsed.markupPercentage,
        false // No floor sealer
      );
      console.log('📊 Final Quote Result:', quote);

      // Generate response
      const paintBrand = parsed.paintInfo.brand || 'Quality paint';
      const paintProduct = parsed.paintInfo.product || 'interior paint';
      
      // Build detailed surface information
      let surfaceDetails = [];
      if (parsed.surfaces.doors && dimensions.number_of_doors) {
        surfaceDetails.push(`${dimensions.number_of_doors} doors`);
      }
      if (parsed.surfaces.windows && dimensions.number_of_windows) {
        surfaceDetails.push(`${dimensions.number_of_windows} windows`);
      }
      
      const response = `Perfect! Here's your professional quote for ${parsed.customerInfo.customer_name} at ${parsed.customerInfo.address}:

**Project Details:**
• ${parsed.dimensions.wall_linear_feet} linear feet of interior walls
• ${parsed.dimensions.ceiling_height} foot ceiling height
• ${paintBrand} ${paintProduct} at $${parsed.paintInfo.cost_per_gallon}/gallon
• ${parsed.surfaces.ceilings ? 'Including' : 'NOT including'} ceilings
• ${parsed.surfaces.doors || parsed.surfaces.trim ? 'Including' : 'NOT including'} doors and trim${surfaceDetails.length > 0 ? ` (${surfaceDetails.join(', ')})` : ''}
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
      // Generate session ID for enhanced conversation state
      const sessionId = enhancedConversationStateManager.generateSessionId(companyId);
      
      // Check for conversation loops and stuck states
      const loopCheck = enhancedConversationStateManager.checkForLoop(sessionId, userInput);
      if (!loopCheck.shouldProcess) {
        if (loopCheck.newStage) {
          enhancedConversationStateManager.setState(sessionId, { stage: loopCheck.newStage });
        }
        return {
          response: loopCheck.responseOverride || "Let's try a different approach.",
          extractedData: { action: 'loop_recovery' },
          confidence: 0.9,
          success: true
        };
      }
      
      // Check for ambiguous responses
      const ambiguousCheck = enhancedConversationStateManager.handleAmbiguousResponse(sessionId, userInput);
      if (!ambiguousCheck.shouldProcess) {
        if (ambiguousCheck.newStage) {
          enhancedConversationStateManager.setState(sessionId, { stage: ambiguousCheck.newStage });
        }
        return {
          response: ambiguousCheck.responseOverride || "Could you please clarify?",
          extractedData: { action: 'clarification_needed' },
          confidence: 0.8,
          success: true
        };
      }
      
      const conversationState = enhancedConversationStateManager.getState(sessionId);
      
      console.log('💭 Conversation State:', conversationState);
      console.log('🗣️ User Input:', userInput);
      
      // Check if user is responding to a quote that was just generated
      if (conversationState && conversationState.stage === 'awaiting_confirmation') {
        
        if (enhancedConversationStateManager.isConfirmationResponse(userInput, conversationState)) {
          // User confirmed - save the quote
          console.log('✅ User confirmed quote saving');
          
          try {
            // Clean customer name before saving
            const cleanCustomerName = (name: string): string => {
              if (!name) return 'Unknown';
              
              // Handle "It's for [Name]" or "its for [Name]" pattern
              const itsForMatch = name.match(/it'?s\s+for\s+([^.]+)/i);
              if (itsForMatch) {
                return itsForMatch[1].trim();
              }
              
              // Handle "Customer: [Name]" pattern
              const customerMatch = name.match(/customer:\s*([^,]+)/i);
              if (customerMatch) {
                return customerMatch[1].trim();
              }
              
              // Handle "the customers name is [Name]" or "customers name is [Name]"
              const customerNameMatch = name.match(/(?:the\s+)?customers?\s+name\s+is\s+([A-Z][a-z]+)(?:\s+and|$)/i);
              if (customerNameMatch) {
                return customerNameMatch[1].trim();
              }
              
              // Handle "name is [Name]"
              const nameIsMatch = name.match(/name\s+is\s+([A-Z][a-z]+)/i);
              if (nameIsMatch) {
                return nameIsMatch[1].trim();
              }
              
              // If it looks like raw conversation data, try to extract name
              if (name.length > 50 || name.includes('.') || name.includes('painting')) {
                // Look for name patterns in longer text
                const nameMatch = name.match(/(?:for|customer|client)?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
                if (nameMatch) {
                  return nameMatch[1].trim();
                }
              }
              
              return name;
            };

            const rawCustomerName = conversationState.customerInfo?.customer_name || 'Unknown';
            const cleanedName = rawCustomerName === 'Unknown' ? 'Unknown' : cleanCustomerName(rawCustomerName);
            
            console.log('🔍 Customer name processing:', {
              raw: rawCustomerName,
              cleaned: cleanedName,
              conversationState: conversationState.customerInfo
            });
            
            const saveResult = await quoteSaver.saveQuote({
              customer_name: cleanedName,
              address: conversationState.customerInfo?.address || '',
              quote_amount: conversationState.lastQuote?.final_price || 0,
              project_type: 'interior', // Default for now
              status: 'pending',
              company_id: parseInt(companyId),
              quote_details: conversationState.lastQuote
            });
            
            if (saveResult.success) {
              enhancedConversationStateManager.setState(sessionId, { stage: 'quote_saved' });
              
              return {
                response: `🎉 **Quote Saved Successfully!**\n\n**Quote ID:** ${saveResult.quoteId}\n**Customer:** ${conversationState.customerInfo?.customer_name}\n**Total:** $${conversationState.lastQuote?.final_price?.toLocaleString()}\n\n**What's Next?**\n• **Preview Quote** - View the professional client-facing quote\n• **Send to Client** - Email or text the quote directly\n• **Download PDF** - Get a printable version\n• **Create Another** - Start a new quote\n\nReady to preview and send this quote to your client?`,
                extractedData: { 
                  action: 'quote_saved', 
                  quoteId: saveResult.quoteId,
                  showQuoteActions: true,
                  previewUrl: `/quotes/${saveResult.quoteId}/preview`,
                  sendUrl: `/quotes/${saveResult.quoteId}/send`
                },
                quote: conversationState.lastQuote,
                confidence: 0.95,
                success: true
              };
            } else {
              return {
                response: `I generated the quote successfully, but had trouble saving it to the database. Error: ${saveResult.error}\n\nThe quote details are:\n\n${conversationState.lastQuoteSummary}\n\nPlease try again or contact support.`,
                extractedData: { action: 'save_failed', error: saveResult.error },
                quote: conversationState.lastQuote,
                confidence: 0.8,
                success: false
              };
            }
          } catch (error) {
            console.error('❌ Error saving quote:', error);
            return {
              response: `I generated the quote successfully, but encountered an error saving it. Please try again or contact support.\n\nQuote details:\n\n${conversationState.lastQuoteSummary}`,
              extractedData: { action: 'save_error' },
              quote: conversationState.lastQuote,
              confidence: 0.7,
              success: false
            };
          }
        }
        
        if (enhancedConversationStateManager.isRejectionResponse(userInput)) {
          // User wants to edit or cancel
          console.log('❌ User rejected quote, returning to editing');
          
          enhancedConversationStateManager.setState(sessionId, { stage: 'gathering_info' });
          
          return {
            response: "No problem! What would you like to change about the quote? You can provide updated information or tell me what needs to be different.",
            extractedData: { action: 'edit_quote' },
            confidence: 0.9,
            success: true
          };
        }
      }
      
      // Check quota before generating final quotes
      const quotaCheck = await subscriptionManager.canCreateQuote(parseInt(companyId));
      
      if (!quotaCheck.allowed && (userInput.includes('save') || userInput.includes('final') || userInput.includes('generate'))) {
        return {
          response: `🚫 **Quote Limit Reached**\n\n${quotaCheck.reason}\n\nTo continue creating quotes, please upgrade your plan or contact sales@propaintquote.com.\n\n**Current Plan:** ${quotaCheck.planName}\n**Quotes Remaining:** ${quotaCheck.quotesRemaining || 0}`,
          extractedData: { 
            action: 'quota_exceeded',
            quotesRemaining: quotaCheck.quotesRemaining,
            planName: quotaCheck.planName,
            upgradeRequired: true
          },
          confidence: 0.95,
          success: false
        };
      }

      // Try enhanced quote creation with fallback
      try {
        const fallbackResult = await quoteCreationFallback.createQuoteWithFallback(
          userInput, 
          companyId, 
          conversationHistory
        );
        
        if (fallbackResult.success && fallbackResult.quote) {
          // Save conversation state with generated quote
          enhancedConversationStateManager.setState(sessionId, {
            stage: 'awaiting_confirmation',
            lastQuote: fallbackResult.quote,
            lastQuoteSummary: fallbackResult.response,
            customerInfo: {
              customer_name: fallbackResult.quote.project_info?.customer_name || 'Unknown',
              address: fallbackResult.quote.project_info?.address || ''
            }
          });
          
          return {
            response: fallbackResult.response + "\n\nWould you like me to save this quote?",
            extractedData: { action: 'quote_generated', method: fallbackResult.method },
            quote: fallbackResult.quote,
            confidence: fallbackResult.method === 'ai' ? 0.95 : 0.85,
            success: true
          };
        } else {
          return {
            response: fallbackResult.response,
            extractedData: { action: 'incomplete_data', method: fallbackResult.method },
            confidence: 0.7,
            success: true
          };
        }
      } catch (fallbackError) {
        console.warn('Fallback system failed, trying original parser:', fallbackError);
      }
      
      // Fallback to original parsing if all else fails
      const parsed = await this.parseCompleteQuoteMessage(userInput);
      
      if (parsed.isComplete) {
        // We have everything we need - generate the quote
        const quoteResult = await this.generateQuoteFromParsedData(parsed, companyId, userInput);
        
        if (quoteResult.success && quoteResult.quote) {
          // Save conversation state with generated quote
          enhancedConversationStateManager.setState(sessionId, {
            stage: 'awaiting_confirmation',
            lastQuote: quoteResult.quote,
            lastQuoteSummary: quoteResult.response,
            customerInfo: parsed.customerInfo
          });
          
          console.log('💾 Saved quote to conversation state, awaiting confirmation');
        }
        
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
        enhancedConversationStateManager.setState(sessionId, { 
          stage: 'gathering_info',
          collectedData: {
            customerInfo: parsed.customerInfo,
            measurements: parsed.dimensions
          }
        });
        
        // Create a more natural response for missing fields
        let missingFieldsResponse = `Great! I have: ${this.summarizeExtractedInfo(parsed)}.\n\n`;
        
        // Handle door/window counts specially for better clarity
        if (parsed.missingFields.includes('number of doors') || parsed.missingFields.includes('number of windows')) {
          const needsDoors = parsed.missingFields.includes('number of doors');
          const needsWindows = parsed.missingFields.includes('number of windows');
          
          if (needsDoors && needsWindows) {
            missingFieldsResponse += `Since we're painting doors and trim, I need to know:\n• How many doors need painting?\n• How many windows need painting?`;
          } else if (needsDoors) {
            missingFieldsResponse += `Since we're painting doors and trim, how many doors need painting?`;
          } else if (needsWindows) {
            missingFieldsResponse += `Since we're painting windows and trim, how many windows need painting?`;
          }
          
          // Remove door/window from missing fields list
          const otherMissing = parsed.missingFields.filter(f => f !== 'number of doors' && f !== 'number of windows');
          if (otherMissing.length > 0) {
            missingFieldsResponse += `\n\nI also need: ${otherMissing.join(', ')}.`;
          }
        } else {
          missingFieldsResponse += `I still need: ${parsed.missingFields.join(', ')}. Can you provide these details?`;
        }
        
        return {
          response: missingFieldsResponse,
          extractedData: parsed,
          confidence: 0.7,
          success: true
        };
      }
      
      // If we don't have much information, check conversation health and respond appropriately
      const health = enhancedConversationStateManager.getConversationHealth(sessionId);
      
      if (!health.isHealthy) {
        console.log('🏥 Conversation health issues detected:', health.issues);
        const recoveryResponse = enhancedConversationStateManager.recoverConversation(sessionId);
        return {
          response: recoveryResponse,
          extractedData: { action: 'conversation_recovery' },
          confidence: 0.8,
          success: true
        };
      }
      
      enhancedConversationStateManager.setState(sessionId, { stage: 'gathering_info' });
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
   * Generate response for labor-included quotes
   */
  private generateLaborIncludedResponse(parsed: QuoteParsingResult, quote: any): string {
    const paintBrand = parsed.paintInfo.brand || 'Quality paint';
    const paintProduct = parsed.paintInfo.product || 'interior paint';
    
    return `Perfect! Here's your quote for ${parsed.customerInfo.customer_name} at ${parsed.customerInfo.address}:

**Project Details:**
• ${parsed.dimensions.wall_linear_feet} linear feet of interior walls
• ${parsed.dimensions.ceiling_height} foot ceiling height  
• ${paintBrand} ${paintProduct} at $${parsed.paintInfo.cost_per_gallon}/gallon
• NOT including ceilings
• NOT including doors and trim
• Labor included in per-sqft rate

**All-Inclusive Quote:**
• Wall Area: ${quote.materials.walls.sqft_needed.toLocaleString()} sqft
• Rate: $${parsed.laborRate}/sqft (materials + labor included)
• Total Project Cost: $${quote.final_price.toLocaleString()}
${quote.markup_amount > 0 ? `• Markup: $${quote.markup_amount.toLocaleString()} (${quote.markup_percentage}%)` : ''}

Ready to save this quote?`;
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
          model: 'anthropic/claude-3-5-sonnet-20241022',
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
- If painting doors/trim: Number of doors
- If painting windows/trim: Number of windows
- Labor rates and markup percentage

Keep responses concise and focused on getting the information needed for an accurate quote. When doors or windows are included, always ask for specific counts.`
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