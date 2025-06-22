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

      return {
        response: aiResponse,
        extractedData,
        paintActions,
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

    return `You are a painting quote assistant for ${context.contactName} at ${context.companyName}. Collect structured quote data through natural conversation using a systematic category-by-category approach.

CORE GOAL: Collect all vital information first. NO calculations or price estimates until all data is gathered.

SYSTEMATIC PROCESS:
1. Customer Info: name, address, contact details
2. Project Scope: interior/exterior, surface selection, timeline
3. For each selected surface category:
   - Collect measurements (smart unit detection)
   - Paint selection from favorites or new products
4. Final details: special requests, markup confirmation
5. ONLY THEN: Show complete quote with all calculations

CONVERSATION RULES:
• Stay focused on painting quotes only - politely redirect other topics
• Be natural and conversational, not robotic
• Smart unit detection: 1200 = sq ft area, 50 = linear feet, 9 = ceiling height
• When rooms are similar: "Are the other 2 bedrooms the same size?" 
• Use contractor's favorites for quick paint selection
• Parse customer info carefully: "John and the address is 123 Main St" = Name: John, Address: 123 Main St
• Ask for clarification if name/address parsing seems unclear

CONTRACTOR CONTEXT:
${context.contactName} at ${context.companyName}
Default rates: $${context.settings.default_walls_rate}/hr walls, $${context.settings.default_ceilings_rate}/hr ceiling, $${context.settings.default_trim_rate}/hr trim
Markup: ${context.settings.default_markup_percentage}%

PAINT FAVORITES AVAILABLE:
${paintInventoryDisplay || 'Standard interior/exterior paints available'}

CURRENT STAGE: ${state.stage}
COLLECTED DATA: ${JSON.stringify(state.extractedData, null, 2)}

MEASUREMENT COLLECTION PATTERNS:
• Walls: Linear feet of walls, ceiling height
• Ceilings: Room dimensions OR total ceiling area  
• Trim: Linear feet of trim work
• Multi-room: Get one room, ask if others are same size

PAINT SELECTION FLOW:
1. Show favorites: "I see you have [product] at $[price]/gal for [surface]. Use this or different paint?"
2. If new paint: Get brand, product, cost per gallon
3. Ask to save as new favorite if needed

Remember: Collect everything systematically, confirm with UI buttons, calculate at the end. Guide naturally toward complete data collection.`;
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
• "John and the address is 123 Main St" → {"customer_name": "John", "address": "123 Main St"}
• "Sarah, address 456 Oak Ave" → {"customer_name": "Sarah", "address": "456 Oak Ave"}
• "Mike and address is downtown" → {"customer_name": "Mike", "address": "downtown"}

Extract any mentioned:
{
  "customer_name": "string",
  "address": "string",
  "phone": "string", 
  "email": "string",
  "project_type": "interior|exterior|both",
  "wall_linear_feet": number,
  "ceiling_height": number,
  "ceiling_sqft": number,
  "number_of_doors": number,
  "number_of_windows": number,
  "rooms": ["array", "of", "rooms"],
  "surfaces": ["walls", "ceilings", "trim", "doors", "windows"],
  "paint_quality": "basic|premium|luxury",
  "timeline": "rush|standard|flexible",
  "special_requests": "string",
  "budget_range": "string",
  "preferred_brands": ["array"],
  "paint_products": [{"category": "string", "brand": "string", "product": "string", "cost": number}],
  "paint_selection_action": "use_saved|use_new|update_price|save_as_favorite",
  "selected_paint": {"brand": "string", "product": "string", "cost": number, "category": "string"},
  "price_update": {"old_price": number, "new_price": number, "product": "string"},
  "save_new_favorite": {"brand": "string", "product": "string", "cost": number, "category": "string"}
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