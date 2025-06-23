/**
 * Intelligent Quote Assistant - Claude 3.5 Sonnet Integration
 * 
 * This system integrates Claude 3.5 Sonnet into the main quote creation workflow
 * with full contractor context, settings, and natural conversation capabilities.
 */

interface ContractorContext {
  // Company Information
  companyId: string;
  companyName: string;
  contactName: string;
  businessType: string;
  
  // Settings & Preferences
  settings: {
    default_walls_rate: number;
    default_ceilings_rate: number;
    default_trim_rate: number;
    default_walls_paint_cost: number;
    default_ceilings_paint_cost: number;
    default_trim_paint_cost: number;
    default_labor_percentage: number;
    default_paint_coverage: number;
    default_sundries_percentage: number;
    tax_rate: number;
    tax_on_materials_only: boolean;
    tax_label: string;
    overhead_percentage: number;
    default_markup_percentage: number;
    ceiling_height: number;
    paint_multiplier: number;
    doors_per_gallon: number;
    windows_per_gallon: number;
  };
  
  // Paint Products & Preferences
  paintProducts: Array<{
    id: string;
    projectType: "interior" | "exterior";
    productCategory: string;
    supplier: string;
    productName: string;
    productLine?: string;
    costPerGallon: number;
    displayOrder: number;
    sheen?: string;
  }>;
  
  // Favorite Products (Setup Wizard selections)
  favoriteProducts?: Array<{
    category: string;
    supplier: string;
    productName: string;
    costPerGallon: number;
  }>;
  
  // Business Intelligence
  recentQuotes?: Array<{
    customerName: string;
    address: string;
    amount: number;
    status: string;
    daysAgo: number;
    projectType: string;
  }>;
  
  // Performance Metrics
  metrics?: {
    averageJobSize: number;
    winRate: number;
    totalQuotesThisMonth: number;
    revenueThisMonth: number;
    preferredMargin: number;
  };
}

interface ConversationState {
  stage: string;
  extractedData: any;
  conversationHistory: Array<{ role: string; content: string }>;
  contractorContext: ContractorContext;
}

export class IntelligentQuoteAssistant {
  private openRouterApiKey: string;
  
  constructor() {
    this.openRouterApiKey = process.env.OPENROUTER_API_KEY || '';
  }

  /**
   * Load comprehensive contractor context from all settings and data sources
   */
  async loadContractorContext(companyId: string): Promise<ContractorContext> {
    try {
      // Load all contractor data in parallel
      const [companyResponse, settingsResponse, paintsResponse, quotesResponse] = await Promise.all([
        fetch(`/api/companies/${companyId}`).catch(() => ({ json: () => ({}) })),
        fetch(`/api/companies/settings?companyId=${companyId}`).catch(() => ({ json: () => ({}) })),
        fetch(`/api/companies/paints?companyId=${companyId}`).catch(() => ({ json: () => ({ paints: [] }) })),
        fetch(`/api/quotes?companyId=${companyId}&limit=10`).catch(() => ({ json: () => ({ quotes: [] }) }))
      ]);

      const [companyData, settings, paintsData, quotesData] = await Promise.all([
        companyResponse.json?.() || {},
        settingsResponse.json?.() || {},
        paintsResponse.json?.() || { paints: [] },
        quotesData.json?.() || { quotes: [] }
      ]);

      // Calculate business metrics from recent quotes
      const recentQuotes = quotesData.quotes || [];
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const monthlyQuotes = recentQuotes.filter((q: any) => 
        new Date(q.created_at) > thirtyDaysAgo
      );
      
      const acceptedQuotes = monthlyQuotes.filter((q: any) => q.status === 'accepted');
      const winRate = monthlyQuotes.length > 0 ? (acceptedQuotes.length / monthlyQuotes.length) * 100 : 0;
      const revenueThisMonth = monthlyQuotes.reduce((sum: number, q: any) => sum + (q.final_price || 0), 0);
      const averageJobSize = monthlyQuotes.length > 0 ? revenueThisMonth / monthlyQuotes.length : 0;

      // Process recent quotes for context
      const processedQuotes = recentQuotes.slice(0, 5).map((q: any) => ({
        customerName: q.customer_name || q.client_name,
        address: q.address || q.property_address,
        amount: q.final_price || q.total_revenue || 0,
        status: q.status,
        daysAgo: Math.floor((Date.now() - new Date(q.created_at).getTime()) / (1000 * 60 * 60 * 24)),
        projectType: q.project_type
      }));

      return {
        companyId,
        companyName: companyData.company_name || companyData.name || 'Your Company',
        contactName: companyData.contact_name || companyData.contactName || 'there',
        businessType: companyData.business_type || 'painting contractor',
        
        settings: {
          default_walls_rate: settings.default_walls_rate || 25,
          default_ceilings_rate: settings.default_ceilings_rate || 22,
          default_trim_rate: settings.default_trim_rate || 35,
          default_walls_paint_cost: settings.default_walls_paint_cost || 45,
          default_ceilings_paint_cost: settings.default_ceilings_paint_cost || 42,
          default_trim_paint_cost: settings.default_trim_paint_cost || 55,
          default_labor_percentage: settings.default_labor_percentage || 30,
          default_paint_coverage: settings.default_paint_coverage || 350,
          default_sundries_percentage: settings.default_sundries_percentage || 8,
          tax_rate: settings.tax_rate || 8.5,
          tax_on_materials_only: settings.tax_on_materials_only ?? true,
          tax_label: settings.tax_label || 'Sales Tax',
          overhead_percentage: settings.overhead_percentage || 15,
          default_markup_percentage: settings.default_markup_percentage || 20,
          ceiling_height: settings.ceiling_height || 9,
          paint_multiplier: settings.paint_multiplier || 2,
          doors_per_gallon: settings.doors_per_gallon || 8,
          windows_per_gallon: settings.windows_per_gallon || 12
        },
        
        paintProducts: paintsData.paints || [],
        
        recentQuotes: processedQuotes,
        
        metrics: {
          averageJobSize,
          winRate,
          totalQuotesThisMonth: monthlyQuotes.length,
          revenueThisMonth,
          preferredMargin: settings.default_markup_percentage || 20
        }
      };
      
    } catch (error) {
      console.error('Error loading contractor context:', error);
      // Return minimal context as fallback
      return {
        companyId,
        companyName: 'Your Company',
        contactName: 'there',
        businessType: 'painting contractor',
        settings: {
          default_walls_rate: 25,
          default_ceilings_rate: 22,
          default_trim_rate: 35,
          default_walls_paint_cost: 45,
          default_ceilings_paint_cost: 42,
          default_trim_paint_cost: 55,
          default_labor_percentage: 30,
          default_paint_coverage: 350,
          default_sundries_percentage: 8,
          tax_rate: 8.5,
          tax_on_materials_only: true,
          tax_label: 'Sales Tax',
          overhead_percentage: 15,
          default_markup_percentage: 20,
          ceiling_height: 9,
          paint_multiplier: 2,
          doors_per_gallon: 8,
          windows_per_gallon: 12
        },
        paintProducts: [],
        recentQuotes: [],
        metrics: {
          averageJobSize: 0,
          winRate: 0,
          totalQuotesThisMonth: 0,
          revenueThisMonth: 0,
          preferredMargin: 20
        }
      };
    }
  }

  /**
   * Parse specific information from user input using targeted AI
   */
  async parseInformation(
    userInput: string, 
    instruction: string, 
    contractorContext: ContractorContext
  ): Promise<any> {
    if (!this.openRouterApiKey) {
      // Fallback parsing logic
      if (instruction.includes('customer name and address')) {
        const parseCustomerInfo = (input: string) => {
          const trimmed = input.trim();
          
          // Try to detect name and address patterns
          if (trimmed.includes(' and ') && (trimmed.includes('address') || trimmed.includes('at '))) {
            const parts = trimmed.split(/\s+and\s+/i);
            const name = parts[0].trim();
            const addressPart = parts[1].replace(/^(the\s+)?(property\s+)?address\s+(is\s+)?/i, '').trim();
            return { customer_name: name, address: addressPart };
          }
          
          // Try "Name at Address" pattern
          if (trimmed.includes(' at ')) {
            const parts = trimmed.split(' at ');
            return { customer_name: parts[0].trim(), address: parts[1].trim() };
          }
          
          // Check if it looks like an address (has numbers and street words)
          const addressKeywords = ['street', 'st', 'avenue', 'ave', 'road', 'rd', 'drive', 'dr', 'lane', 'ln'];
          const hasAddress = addressKeywords.some(keyword => trimmed.toLowerCase().includes(keyword));
          
          if (hasAddress && /\d/.test(trimmed)) {
            return { address: trimmed };
          } else {
            return { customer_name: trimmed };
          }
        };
        
        return parseCustomerInfo(userInput);
      } else if (instruction.includes('interior, exterior, or both')) {
        const lower = userInput.toLowerCase();
        if (lower.includes('both') || (lower.includes('interior') && lower.includes('exterior'))) {
          return { type: 'both' };
        } else if (lower.includes('exterior') || lower.includes('outside')) {
          return { type: 'exterior' };
        } else if (lower.includes('interior') || lower.includes('inside')) {
          return { type: 'interior' };
        }
        return {};
      }
      return {};
    }

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openRouterApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'system',
              content: `You are a data extraction assistant for a painting quote system. ${instruction}

Your task: Extract ONLY the requested information and return it as a JSON object.

Company Context:
- Company: ${contractorContext.companyName}
- Contact: ${contractorContext.contactName}

Instructions:
- Return ONLY valid JSON with the extracted data
- Do not include explanations or additional text
- If information is not found, return empty object {}

Examples:
For "Extract customer name and address":
{"customer_name": "John Smith", "address": "123 Main Street"}

For "Determine if this is interior, exterior, or both":
{"type": "interior"}`
            },
            {
              role: 'user',
              content: userInput
            }
          ],
          temperature: 0.1,
          max_tokens: 200
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '{}';
      
      try {
        return JSON.parse(content);
      } catch {
        return {};
      }
    } catch (error) {
      console.error('Parse AI error:', error);
      return {};
    }
  }

  /**
   * Generate intelligent response using Claude 3.5 Sonnet with full contractor context
   */
  async generateResponse(
    userInput: string,
    conversationState: ConversationState
  ): Promise<{
    response: string;
    extractedData: any;
    nextStage?: string;
    confidence: number;
    paintActions?: any[];
  }> {
    if (!this.openRouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const context = conversationState.contractorContext;
    
    // Build comprehensive system prompt with all contractor context
    const systemPrompt = this.buildIntelligentSystemPrompt(context, conversationState);
    
    // Build conversation context
    const conversationContext = conversationState.conversationHistory
      .slice(-8) // Last 8 messages for context
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const userPrompt = `${conversationContext ? 'Recent conversation:\n' + conversationContext + '\n\n' : ''}Customer just said: "${userInput}"\n\nPlease respond naturally as ${context.contactName}'s painting quote assistant, staying focused on painting and quotes. Extract any relevant project information and guide the conversation forward.`;

    try {
      // Call Claude 3.5 Sonnet
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
          'X-Title': 'Intelligent Painting Quote Assistant'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-sonnet-4',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: 0.8,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || '';

      // Extract structured data from user input
      const extractedData = await this.extractProjectData(userInput, conversationState.extractedData, context);

      // Handle paint-related actions
      const paintActions = await this.handlePaintActions(extractedData, context);

      // Save conversation data to settings (if AI learning is enabled)
      const settingsSave = await this.saveToSettings(extractedData, context);

      return {
        response: aiResponse,
        extractedData,
        paintActions,
        settingsSave,
        confidence: 0.9
      };

    } catch (error) {
      console.error('Claude AI error:', error);
      
      // Intelligent fallback response based on context
      const fallbackResponse = this.generateFallbackResponse(userInput, conversationState);
      
      return {
        response: fallbackResponse,
        extractedData: {},
        confidence: 0.3
      };
    }
  }

  /**
   * Save conversation data to contractor settings
   */
  private async saveToSettings(extractedData: any, context: ContractorContext): Promise<any> {
    try {
      // Check if AI learning is enabled first
      const learningCheck = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/ai/save-preferences?companyId=${context.companyId}`);
      
      if (!learningCheck.ok) {
        return { success: false, message: 'Could not check learning settings' };
      }

      const learningSettings = await learningCheck.json();
      if (!learningSettings.learningEnabled) {
        return { success: false, message: 'AI learning disabled' };
      }

      // Build preferences object from extracted data
      const preferences: any = {};

      // Extract spread rates
      if (extractedData.paint_products?.primer?.spread_rate) {
        preferences.primer_spread_rate = extractedData.paint_products.primer.spread_rate;
      }
      if (extractedData.paint_products?.wall?.spread_rate) {
        preferences.wall_paint_spread_rate = extractedData.paint_products.wall.spread_rate;
      }
      if (extractedData.paint_products?.ceiling?.spread_rate) {
        preferences.ceiling_paint_spread_rate = extractedData.paint_products.ceiling.spread_rate;
      }

      // Extract all-in labor rates
      if (extractedData.rates?.wall_rate_per_sqft) {
        preferences.wall_allin_rate_per_sqft = extractedData.rates.wall_rate_per_sqft;
      }
      if (extractedData.rates?.ceiling_rate_per_sqft) {
        preferences.ceiling_allin_rate_per_sqft = extractedData.rates.ceiling_rate_per_sqft;
      }
      if (extractedData.rates?.primer_rate_per_sqft) {
        preferences.primer_allin_rate_per_sqft = extractedData.rates.primer_rate_per_sqft;
      }
      if (extractedData.rates?.door_rate_each) {
        preferences.door_allin_rate_each = extractedData.rates.door_rate_each;
      }
      if (extractedData.rates?.window_rate_each) {
        preferences.window_allin_rate_each = extractedData.rates.window_rate_each;
      }

      // Extract product preferences
      if (extractedData.paint_products?.primer?.brand) {
        preferences.preferred_primer_brand = extractedData.paint_products.primer.brand;
      }
      if (extractedData.paint_products?.primer?.product) {
        preferences.preferred_primer_product = extractedData.paint_products.primer.product;
      }
      if (extractedData.paint_products?.wall?.brand) {
        preferences.preferred_wall_paint_brand = extractedData.paint_products.wall.brand;
      }
      if (extractedData.paint_products?.wall?.product) {
        preferences.preferred_wall_paint_product = extractedData.paint_products.wall.product;
      }
      if (extractedData.paint_products?.ceiling?.brand) {
        preferences.preferred_ceiling_paint_brand = extractedData.paint_products.ceiling.brand;
      }
      if (extractedData.paint_products?.ceiling?.product) {
        preferences.preferred_ceiling_paint_product = extractedData.paint_products.ceiling.product;
      }
      if (extractedData.paint_products?.trim?.brand) {
        preferences.preferred_trim_paint_brand = extractedData.paint_products.trim.brand;
      }
      if (extractedData.paint_products?.trim?.product) {
        preferences.preferred_trim_paint_product = extractedData.paint_products.trim.product;
      }

      // Only save if we have something to save
      if (Object.keys(preferences).length === 0) {
        return { success: false, message: 'No preferences to save' };
      }

      // Save to settings
      const saveResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/ai/save-preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: context.companyId,
          preferences,
          askForConfirmation: learningSettings.askBeforeSaving,
          source: 'ai_conversation'
        })
      });

      if (saveResponse.ok) {
        const result = await saveResponse.json();
        return result;
      } else {
        return { success: false, message: 'Failed to save preferences' };
      }

    } catch (error) {
      console.error('Save to settings error:', error);
      return { success: false, message: 'Error saving preferences' };
    }
  }

  /**
   * Handle paint-related actions like updating prices or saving favorites
   */
  private async handlePaintActions(extractedData: any, context: ContractorContext): Promise<any[]> {
    const actions: any[] = [];

    try {
      // Handle price updates
      if (extractedData.price_update && extractedData.price_update.new_price) {
        const updateAction = {
          type: 'price_update',
          data: extractedData.price_update,
          status: 'pending'
        };
        actions.push(updateAction);

        // Find the product ID to update
        const productToUpdate = context.paintProducts.find(p => 
          p.productName.toLowerCase().includes(extractedData.price_update.product.toLowerCase()) ||
          p.supplier.toLowerCase().includes(extractedData.price_update.product.toLowerCase())
        );

        if (productToUpdate) {
          try {
            const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/paint-products/favorites`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                companyId: context.companyId,
                productId: productToUpdate.id,
                newPrice: extractedData.price_update.new_price,
                action: 'update_price'
              })
            });

            if (updateResponse.ok) {
              updateAction.status = 'success';
            } else {
              updateAction.status = 'failed';
            }
          } catch (error) {
            console.error('Price update failed:', error);
            updateAction.status = 'failed';
          }
        }
      }

      // Handle saving new favorites
      if (extractedData.save_new_favorite && extractedData.save_new_favorite.brand) {
        const saveAction = {
          type: 'save_favorite',
          data: extractedData.save_new_favorite,
          status: 'pending'
        };
        actions.push(saveAction);

        try {
          const saveResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/paint-products/favorites`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              companyId: context.companyId,
              paintProduct: extractedData.save_new_favorite,
              category: extractedData.save_new_favorite.category || 'wall_paint'
            })
          });

          if (saveResponse.ok) {
            saveAction.status = 'success';
          } else {
            saveAction.status = 'failed';
          }
        } catch (error) {
          console.error('Save favorite failed:', error);
          saveAction.status = 'failed';
        }
      }

    } catch (error) {
      console.error('Paint actions error:', error);
    }

    return actions;
  }

  /**
   * Build comprehensive system prompt with all contractor context
   */
  private buildIntelligentSystemPrompt(context: ContractorContext, state: ConversationState): string {
    // Group paint products by category for better organization
    const paintProductsByCategory = context.paintProducts.reduce((acc, p) => {
      if (!acc[p.productCategory]) acc[p.productCategory] = [];
      acc[p.productCategory].push(p);
      return acc;
    }, {} as Record<string, typeof context.paintProducts>);

    const paintInventoryDisplay = Object.entries(paintProductsByCategory)
      .map(([category, products]) => {
        const productList = products
          .slice(0, 3) // Show top 3 per category
          .map(p => `  • ${p.supplier} ${p.productName} - $${p.costPerGallon}/gal`)
          .join('\n');
        return `${category.replace('_', ' ').toUpperCase()}:\n${productList}`;
      })
      .join('\n\n');

    const recentProjectsContext = context.recentQuotes?.slice(0, 3)
      .map(q => `${q.customerName} (${q.daysAgo} days ago): $${q.amount} ${q.projectType}`)
      .join('\n') || 'No recent projects';

    return `You are a friendly painting contractor helping to create professional quotes through natural conversation.

CONVERSATION STYLE:
• Chat like an experienced contractor friend
• Natural, relaxed tone but stay professional  
• Extract ANY information you can from each message
• Ask the next logical question to move forward
• One question at a time, don't overwhelm

QUOTE INFORMATION TO COLLECT (in this order):

1. PROJECT BASICS:
   • Customer name and address
   • Interior, exterior, or both project

2. DIMENSIONS (collect systematically):
   • Wall linear footage (LNFT) - perimeter of walls to paint
   • Ceiling height (in feet)
   • Ceiling area or room area (sqft)
   • Number of doors and windows

3. PAINT PRODUCT PREFERENCES (contractor's go-to products):
   PRIMER:
   • "What drywall primer do you typically use?"
   • "What's its spread rate?" (typical: 200-300 sqft/gallon)
   
   WALL PAINT:
   • "What are your 3 go-to interior wall paints?"
   • "What's the spread rate for each?" (typical: 350-400 sqft/gallon)
   
   CEILING PAINT:
   • "What ceiling paint do you use?"
   • "What's its spread rate?" (typical: 350 sqft/gallon)
   
   TRIM/DOORS/WINDOWS:
   • "What trim paint do you use for doors and windows?"
   • "Coverage rate?" (typical: 4-5 doors per gallon, 2-3 windows per gallon)

4. ALL-IN LABOR RATES (includes materials + labor):
   • "What do you charge per sqft for walls (2 coats, including paint)?" (example: $1.50)
   • "Per sqft for ceilings (2 coats, including paint)?" (example: $1.25)
   • "Per door + trim (2 coats)?" (example: $150)
   • "Per window?" (example: $100)
   • "Primer application per sqft (1 coat)?" (example: $0.45)

5. MARKUP: When ready, suggest markup buttons (15%, 20%, 25%, 30%, Custom)

EXACT CALCULATION FORMULAS:
• PRIMER: LNFT × ceiling_height ÷ primer_spread_rate = gallons (1 coat)
• WALLS: LNFT × ceiling_height ÷ wall_spread_rate × 1.8 = gallons (2 coats)
• CEILINGS: ceiling_area ÷ ceiling_spread_rate × 1.8 = gallons (2 coats)
• DOORS: door_count ÷ 4.5 = gallons (2 coats both sides, ~20 sqft per door)
• WINDOWS: window_count ÷ 2.5 = gallons (2 coats, ~15 sqft per window)

CONTRACTOR CONTEXT:
Working with ${context.contactName} at ${context.companyName}
Recent projects: ${recentProjectsContext}

CONTRACTOR'S SAVED PREFERENCES (use these as defaults):
• Preferred Primer: ${context.settings.preferred_primer_brand || 'Not set'} ${context.settings.preferred_primer_product || ''} (${context.settings.primer_spread_rate || 250} sqft/gal)
• Preferred Wall Paint: ${context.settings.preferred_wall_paint_brand || 'Not set'} ${context.settings.preferred_wall_paint_product || ''} (${context.settings.wall_paint_spread_rate || 375} sqft/gal)
• Preferred Ceiling Paint: ${context.settings.preferred_ceiling_paint_brand || 'Not set'} ${context.settings.preferred_ceiling_paint_product || ''} (${context.settings.ceiling_paint_spread_rate || 350} sqft/gal)
• Preferred Trim Paint: ${context.settings.preferred_trim_paint_brand || 'Not set'} ${context.settings.preferred_trim_paint_product || ''}

ALL-IN LABOR RATES (includes materials + labor):
• Walls: $${context.settings.wall_allin_rate_per_sqft || 1.50}/sqft
• Ceilings: $${context.settings.ceiling_allin_rate_per_sqft || 1.25}/sqft
• Primer: $${context.settings.primer_allin_rate_per_sqft || 0.45}/sqft
• Doors: $${context.settings.door_allin_rate_each || 150} each
• Windows: $${context.settings.window_allin_rate_each || 100} each

AI LEARNING: ${context.settings.ai_learning_enabled ? 'ENABLED - Save new preferences' : 'DISABLED - Do not save preferences'}

CONVERSATION EXAMPLES:
• "Hey! Tell me about your painting project."
• "Got the basics! What are the wall linear feet and ceiling height?"
• If no saved preferences: "What's your go-to primer and its spread rate?"
• If saved preferences: "I see you usually use ${context.settings.preferred_primer_brand || 'Kilz'} ${context.settings.preferred_primer_product || 'PVA Primer'}. Use that for this quote?"
• "What do you typically charge per sqft for walls, including paint?"

SMART PREFERENCE USAGE:
• When asking about products, mention their saved preferences first
• If they give different info, ask: "Should I update your preferences to use [new product] instead of [saved product]?"
• Pre-fill quotes with their standard rates and products
• Learn and save new preferences when AI learning is enabled

HELPFUL GUIDANCE:
• Mention typical spread rates to help contractors estimate
• Use real contractor terminology (LNFT, spread rate, etc.)
• Ask for their actual go-to products, not generic brands
• All-in pricing includes both materials and labor

Remember: This is how contractors actually think - collect their standard products and rates, then apply to this specific job!`;
  }

  /**
   * Extract structured project data using Claude 3.5 Sonnet
   */
  private async extractProjectData(
    userInput: string, 
    existingData: any, 
    context: ContractorContext
  ): Promise<any> {
    if (!this.openRouterApiKey) return {};

    try {
      const extractionPrompt = `Extract painting project data from this input. Return only valid JSON.

User said: "${userInput}"
Current data: ${JSON.stringify(existingData)}

PARSING PATTERNS:
• "Cici at 2020 hillside drive" → {"customer_name": "Cici", "address": "2020 hillside drive"}
• "120 linear feet, 9 foot ceilings" → {"dimensions": {"wall_linear_feet": 120, "ceiling_height": 9}}
• "Sherwin Williams ProClassic, white, $65/gal, 400 sqft coverage" → {"paint_products": {"wall": {"brand": "Sherwin Williams", "product": "ProClassic", "color": "white", "cost_per_gallon": 65, "spread_rate": 400}}}

Extract any mentioned information into this structure:
{
  "customer_name": "string",
  "address": "string", 
  "project_type": "interior|exterior|both",
  "dimensions": {
    "wall_linear_feet": number,
    "ceiling_height": number,
    "ceiling_area": number,
    "number_of_doors": number,
    "number_of_windows": number
  },
  "paint_products": {
    "primer": {"brand": "string", "product": "string", "cost_per_gallon": number, "spread_rate": number},
    "wall": {"brand": "string", "product": "string", "color": "string", "cost_per_gallon": number, "spread_rate": number},
    "ceiling": {"brand": "string", "product": "string", "color": "string", "cost_per_gallon": number, "spread_rate": number},
    "trim": {"brand": "string", "product": "string", "color": "string", "cost_per_gallon": number, "spread_rate": number}
  },
  "rates": {
    "wall_rate_per_sqft": number,
    "ceiling_rate_per_sqft": number,
    "primer_rate_per_sqft": number,
    "door_rate_each": number,
    "window_rate_each": number
  },
  "markup_percentage": number,
  "showMarkupButtons": boolean,
  "quoteComplete": boolean
}

Return {} if nothing relevant found.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
          'X-Title': 'Intelligent Painting Quote Assistant'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-sonnet-4',
          messages: [
            {
              role: 'user',
              content: extractionPrompt
            }
          ],
          temperature: 0.1,
          max_tokens: 400
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices[0]?.message?.content || '{}';
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    } catch (error) {
      console.error('Data extraction error:', error);
    }

    return {};
  }

  /**
   * Generate intelligent fallback response when AI is unavailable
   */
  private generateFallbackResponse(userInput: string, state: ConversationState): string {
    const context = state.contractorContext;
    const lowerInput = userInput.toLowerCase();

    // Intelligent fallbacks based on input content
    if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('quote')) {
      return `I'd be happy to help you get an accurate quote! To give you ${context.contactName}'s best pricing, I'll need to know about your project. What rooms or areas need painting?`;
    }
    
    if (lowerInput.includes('paint') || lowerInput.includes('color')) {
      return `Great! ${context.contactName} works with quality brands like ${context.paintProducts.slice(0, 2).map(p => p.supplier).join(' and ')}. What type of project are we painting - interior or exterior?`;
    }
    
    if (lowerInput.includes('room') || lowerInput.includes('house') || lowerInput.includes('wall')) {
      return `Perfect! Let's get the details for your painting project. Could you tell me the approximate square footage or room dimensions?`;
    }

    // Default fallback
    return `I'm here to help you get a professional painting quote from ${context.contactName}. What can you tell me about your painting project?`;
  }
}

export const intelligentQuoteAssistant = new IntelligentQuoteAssistant();