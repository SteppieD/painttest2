/**
 * Two-Stage AI Quote System
 * Stage 1: Conversation AI (natural flow)
 * Stage 2: Quote Processing AI (structured extraction & calculations)
 */

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ExtractedQuoteData {
  // Client Information
  client_name?: string;
  address?: string;
  date?: string;

  // Project Scope
  rooms?: {
    name: string;
    wall_sqft?: number;
    ceiling_sqft?: number;
    doors_count?: number;
    windows_count?: number;
    floor_sqft?: number;
    trim_linear_feet?: number;
  }[];

  // Materials
  materials?: {
    primer?: { brand: string; gallons: number; cost_per_gallon: number; total_cost: number; };
    wall_paint?: { brand: string; gallons: number; cost_per_gallon: number; total_cost: number; };
    ceiling_paint?: { brand: string; gallons: number; cost_per_gallon: number; total_cost: number; };
    trim_paint?: { brand: string; gallons: number; cost_per_gallon: number; total_cost: number; };
    floor_sealer?: { brand: string; gallons: number; cost_per_gallon: number; total_cost: number; };
  };

  // Labor
  labor?: {
    estimated_hours?: number;
    rate_type: 'hourly' | 'sqft';
    rate_amount: number;
    total_labor_cost: number;
  };

  // Costs
  overhead?: {
    items?: { description: string; amount: number; }[];
    total: number;
  };
  
  subtotal?: number;
  markup_percentage?: number;
  markup_amount?: number;
  total_quote?: number;

  // Meta
  scope_notes?: string;
  validity_days?: number;
}

export class TwoStageAISystem {
  
  /**
   * Stage 1: Conversation AI
   * Handles natural conversation flow and question asking
   */
  async processConversationMessage(
    userMessage: string, 
    conversationHistory: ConversationMessage[],
    companyId: string
  ): Promise<{ response: string; isReadyForQuoting: boolean }> {
    
    try {
      const response = await fetch('/api/ai/conversation-stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage,
          conversationHistory,
          companyId,
          instruction: `You are a friendly painting contractor having a natural conversation about a potential project.

CONVERSATION FLOW (Progressive Information Gathering):
1. **Client & Basic Info** - Get name, address, interior/exterior
2. **Project Scope** - Rooms/areas, what surfaces to paint  
3. **Measurements** - Dimensions for accurate estimates
4. **Paint Preferences** - Quality level, brand preferences
5. **Labor & Timeline** - When they want it done, special requirements

CONVERSATION RULES:
- Ask ONE question at a time - don't overwhelm
- Be conversational and helpful, not robotic  
- Build on their previous answers naturally
- If they give partial info, acknowledge it and ask for what's missing
- Use contractor language they'd understand

INFORMATION TO COLLECT PROGRESSIVELY:
**Client & Project Basics:**
- Client name and project address
- Interior, exterior, or both
- Which rooms/areas to paint

**Surfaces & Scope:**
- What surfaces: walls, ceilings, trim, doors, windows
- Room dimensions (length, width, height)
- Number of doors and windows per room

**Paint Details:**
- Quality preference (good/better/premium)
- Brand preferences (if any)
- Any existing paint issues (peeling, prep work needed)

**Labor & Logistics:**
- Timeline/when they want it done
- Any special requirements or constraints
- Access considerations

READY SIGNAL:
When you have enough core information for a meaningful quote (client name, basic scope, approximate measurements, paint quality level), end your response with "READY_FOR_QUOTING"

EXAMPLE CONVERSATION STYLE:
"Great! So this is for interior painting at your home on Oak Street. Which rooms are we looking at painting - just the living room, or are there other areas too?"`
        })
      });

      const result = await response.json();
      
      return {
        response: result.response,
        isReadyForQuoting: result.response.includes('READY_FOR_QUOTING')
      };
      
    } catch (error) {
      console.error('Stage 1 AI Error:', error);
      return {
        response: "I'm having trouble processing that. Could you tell me more about your painting project?",
        isReadyForQuoting: false
      };
    }
  }

  /**
   * Stage 2: Quote Processing AI
   * Takes full conversation and generates structured quote
   */
  async processQuoteGeneration(
    conversationHistory: ConversationMessage[],
    companyId: string
  ): Promise<ExtractedQuoteData> {
    
    const conversationText = conversationHistory
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const quotePrompt = `You are a quoting assistant for a painting contractor.

From the conversation provided below, extract all relevant information and generate a **clean, professional quote** using a standardized format.

Conversation:
${conversationText}

Your task is to:
1. Identify and extract:
   - Project details (client name, address, room names, sizes)
   - Paint products selected (brand/type, spread rate)
   - Surface areas (walls, ceilings, doors, windows, trim, floor)
   - Number of coats
   - Labor rates and estimated time
   - Overhead costs (if mentioned)
   - Any extras (prep work, patching, travel, etc.)

2. Use formulas to calculate:
   - Square footage of each surface type
   - Gallons of each product needed (use 350 sqft/gallon default if not specified)
   - Material costs
   - Labor cost (per hour or per sqft, based on info)
   - Overhead (if provided or use default 10%)

3. Add markup and calculate the final price

Return ONLY a JSON object with this exact structure:
{
  "client_name": "string",
  "address": "string or null", 
  "date": "YYYY-MM-DD",
  "rooms": [
    {
      "name": "string",
      "wall_sqft": number,
      "ceiling_sqft": number,
      "doors_count": number,
      "windows_count": number,
      "floor_sqft": number,
      "trim_linear_feet": number
    }
  ],
  "materials": {
    "primer": { "brand": "string", "gallons": number, "cost_per_gallon": number, "total_cost": number },
    "wall_paint": { "brand": "string", "gallons": number, "cost_per_gallon": number, "total_cost": number },
    "ceiling_paint": { "brand": "string", "gallons": number, "cost_per_gallon": number, "total_cost": number }
  },
  "labor": {
    "estimated_hours": number,
    "rate_type": "hourly" or "sqft",
    "rate_amount": number,
    "total_labor_cost": number
  },
  "overhead": {
    "total": number
  },
  "subtotal": number,
  "markup_percentage": number,
  "markup_amount": number,
  "total_quote": number,
  "scope_notes": "string",
  "validity_days": 30
}

If information is missing, use null or reasonable defaults. Calculate all costs accurately.`;

    try {
      const response = await fetch('/api/ai/quote-processing-stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: quotePrompt,
          companyId
        })
      });

      const result = await response.json();
      
      // Parse the AI response as JSON
      const extractedData: ExtractedQuoteData = JSON.parse(result.response);
      
      console.log('🎯 Stage 2 AI extracted quote data:', extractedData);
      
      return extractedData;
      
    } catch (error) {
      console.error('Stage 2 AI Error:', error);
      throw new Error('Failed to process quote generation');
    }
  }

  /**
   * Generate professional quote display
   */
  generateQuoteDisplay(data: ExtractedQuoteData): string {
    const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
    
    let quoteDisplay = `**PROJECT QUOTE**

**Client:** ${data.client_name || '[Not Provided]'}
**Address:** ${data.address || '[Not Provided]'}
**Date:** ${data.date || new Date().toISOString().split('T')[0]}

**Scope of Work:**`;

    // Add rooms
    if (data.rooms && data.rooms.length > 0) {
      data.rooms.forEach(room => {
        quoteDisplay += `\n- ${room.name}: ${room.wall_sqft || 0} sq ft walls, ${room.ceiling_sqft || 0} sq ft ceiling`;
        if (room.doors_count) quoteDisplay += `, ${room.doors_count} doors`;
        if (room.windows_count) quoteDisplay += `, ${room.windows_count} windows`;
      });
    }

    quoteDisplay += `\n\n**Materials:**`;
    
    // Add materials
    if (data.materials) {
      Object.entries(data.materials).forEach(([type, material]) => {
        if (material) {
          const typeName = type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
          quoteDisplay += `\n- ${typeName}: ${material.brand} – ${material.gallons} gallons @ ${formatCurrency(material.cost_per_gallon)}/gal = ${formatCurrency(material.total_cost)}`;
        }
      });
    }

    // Add labor
    if (data.labor) {
      quoteDisplay += `\n\n**Labor:**`;
      quoteDisplay += `\n- Estimated Hours: ${data.labor.estimated_hours || 'TBD'}`;
      quoteDisplay += `\n- Rate: ${formatCurrency(data.labor.rate_amount)}/${data.labor.rate_type}`;
      quoteDisplay += `\n- Total Labor Cost: ${formatCurrency(data.labor.total_labor_cost)}`;
    }

    // Add overhead
    if (data.overhead) {
      quoteDisplay += `\n\n**Overhead:** ${formatCurrency(data.overhead.total)}`;
    }

    // Add totals
    quoteDisplay += `\n\n**Subtotal:** ${formatCurrency(data.subtotal || 0)}`;
    if (data.markup_percentage) {
      quoteDisplay += `\n**Markup:** ${data.markup_percentage}% = ${formatCurrency(data.markup_amount || 0)}`;
    }
    quoteDisplay += `\n**Total Quote:** **${formatCurrency(data.total_quote || 0)}**`;

    if (data.scope_notes) {
      quoteDisplay += `\n\n*${data.scope_notes}*`;
    }
    
    quoteDisplay += `\n\n*This quote is valid for ${data.validity_days || 30} days.*`;

    return quoteDisplay;
  }
}