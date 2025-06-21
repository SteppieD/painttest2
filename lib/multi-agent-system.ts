/**
 * Multi-Agent AI System - Premium Features ($100/1000 quotes)
 * 
 * Specialized AI agents working together for superior quote assistance:
 * - Understanding Agent (GPT-4o) - Master conversation
 * - Validation Agent (Claude 3.5 Sonnet) - Error detection  
 * - Strategy Agent (GPT-4o) - Business optimization
 * - Pricing Agent (Claude 3.5 Haiku) - Market intelligence
 */

interface AgentResponse {
  response: string;
  confidence: number;
  metadata?: any;
  next_action?: string;
}

interface ConversationContext {
  stage: string;
  category?: string;
  conversationHistory: Array<{ role: string; content: string }>;
  currentData: any;
  expectedInfo?: string[];
  customerProfile?: any;
  projectContext?: any;
}

export class MultiAgentSystem {
  private openRouterApiKey: string;

  constructor() {
    this.openRouterApiKey = process.env.OPENROUTER_API_KEY || '';
    if (!this.openRouterApiKey) {
      throw new Error('OpenRouter API key required for multi-agent system');
    }
  }

  // Understanding Agent - GPT-4o (Master conversation & natural language processing)
  async understandingAgent(message: string, context: ConversationContext): Promise<AgentResponse> {
    const prompt = `You are the Understanding Agent - the master conversationalist for a painting quote assistant.

Your job: Understand what the contractor is saying and extract relevant information naturally.

Current context:
- Stage: ${context.stage}
- Category: ${context.category || 'none'}
- Current data: ${JSON.stringify(context.currentData)}

Contractor message: "${message}"

Extract information and respond naturally. Focus on:
1. What measurements/info did they provide?
2. What should we ask next?
3. Keep the conversation flowing naturally

Response format:
{
  "understanding": {
    "intent": "what they want to do",
    "extracted": {extracted_data_object},
    "confidence": 0.95,
    "missing_info": ["what we still need"]
  },
  "response": "friendly conversational response",
  "next_action": "what to do next"
}`;

    return await this.callOpenRouter('openai/gpt-4o', prompt, {
      temperature: 0.7,
      max_tokens: 800
    });
  }

  // Validation Agent - Claude 3.5 Sonnet (Expert error detection & quality control)
  async validationAgent(data: any, context: ConversationContext): Promise<AgentResponse> {
    const prompt = `You are the Validation Agent - an expert quality control specialist for painting quotes.

Your job: Analyze data for errors, inconsistencies, and potential issues.

Data to validate: ${JSON.stringify(data)}
Project context: ${JSON.stringify(context.currentData)}

Check for:
1. Unusual measurements (6-foot ceilings, 1000+ linear feet, etc.)
2. Missing logical connections (walls without doors/windows)
3. Unrealistic proportions (tiny rooms with huge ceilings)
4. Incomplete information that could cause problems
5. Price inconsistencies or calculation errors

Response format:
{
  "validation": {
    "is_valid": true/false,
    "confidence": 0.95,
    "concerns": ["list of potential issues"],
    "suggestions": ["recommended corrections"],
    "severity": "low/medium/high"
  },
  "response": "friendly explanation of any concerns",
  "next_action": "clarify_measurements|continue|flag_issue"
}`;

    return await this.callOpenRouter('anthropic/claude-3.5-sonnet', prompt, {
      temperature: 0.3,
      max_tokens: 600
    });
  }

  // Strategy Agent - GPT-4o (Business optimization & recommendations)
  async strategyAgent(projectData: any, context: ConversationContext): Promise<AgentResponse> {
    const prompt = `You are the Strategy Agent - a business optimization expert for painting contractors.

Your job: Analyze projects and suggest profit-maximizing strategies.

Project data: ${JSON.stringify(projectData)}
Customer context: ${JSON.stringify(context.customerProfile)}

Analyze for:
1. Upsell opportunities (trim, ceilings, additional rooms)
2. Optimal pricing strategy for this customer/area
3. Material recommendations for best profit margins
4. Timeline optimization for efficiency
5. Risk factors that need pricing buffers

Response format:
{
  "strategy": {
    "recommended_upsells": ["specific suggestions with prices"],
    "pricing_insights": "market positioning advice",
    "risk_factors": ["potential issues to address"],
    "profit_optimization": "margin improvement suggestions"
  },
  "response": "conversational recommendations for contractor",
  "next_action": "suggest_upsell|optimize_pricing|continue"
}`;

    return await this.callOpenRouter('openai/gpt-4o', prompt, {
      temperature: 0.6,
      max_tokens: 700
    });
  }

  // Pricing Agent - Claude 3.5 Haiku (Market intelligence & competitive analysis)
  async pricingAgent(quote: any, location: string = ''): Promise<AgentResponse> {
    const prompt = `You are the Pricing Agent - a market intelligence specialist for painting quotes.

Your job: Analyze pricing for market competitiveness and optimization.

Quote details: ${JSON.stringify(quote)}
Location: ${location}

Analyze:
1. Price per square foot vs. market standards
2. Material costs vs. alternatives
3. Labor rates for the area
4. Competitive positioning
5. Price optimization opportunities

Response format:
{
  "pricing_analysis": {
    "market_position": "competitive/high/low",
    "price_per_sqft": "$X.XX",
    "optimization_potential": "$XXX savings/profit opportunity",
    "competitive_factors": ["reasons for pricing position"]
  },
  "response": "pricing insights and recommendations",
  "next_action": "adjust_pricing|add_value|continue"
}`;

    return await this.callOpenRouter('anthropic/claude-3.5-haiku', prompt, {
      temperature: 0.4,
      max_tokens: 500
    });
  }

  // Paint Expert Agent - GPT-4o mini (Product knowledge & recommendations)
  async paintExpertAgent(surfaces: string[], environment: string, customerNeeds: any): Promise<AgentResponse> {
    const prompt = `You are the Paint Expert Agent - a specialist in paint products and application.

Your job: Recommend optimal paint products for specific situations.

Project details:
- Surfaces: ${surfaces.join(', ')}
- Environment: ${environment}
- Customer needs: ${JSON.stringify(customerNeeds)}

Recommend:
1. Best paint types for each surface
2. Primer requirements
3. Coverage estimates
4. Application tips for contractors
5. Upgrade opportunities (premium finishes, etc.)

Response format:
{
  "paint_recommendations": {
    "primary_products": ["specific paint recommendations"],
    "primer_needs": "primer requirements",
    "coverage_estimate": "gallons needed",
    "application_notes": ["tips for contractor"]
  },
  "response": "conversational paint advice",
  "next_action": "select_products|discuss_upgrades|continue"
}`;

    return await this.callOpenRouter('openai/gpt-4o-mini', prompt, {
      temperature: 0.5,
      max_tokens: 600
    });
  }

  // Coordinator - Orchestrates multiple agents for complex decisions
  async coordinateAgents(message: string, context: ConversationContext): Promise<{
    primary_response: string;
    validation_notes?: string;
    strategy_suggestions?: string;
    pricing_insights?: string;
    next_action: string;
    confidence: number;
  }> {
    // Step 1: Understanding Agent processes the message
    const understanding = await this.understandingAgent(message, context);
    
    // Step 2: If we have data to validate, use Validation Agent
    let validation = null;
    if (understanding.metadata?.extracted && Object.keys(understanding.metadata.extracted).length > 0) {
      validation = await this.validationAgent(understanding.metadata.extracted, context);
    }

    // Step 3: If we have enough project data, get strategy insights
    let strategy = null;
    if (context.currentData && (context.currentData.surfaces?.length > 0 || context.currentData.dimensions)) {
      strategy = await this.strategyAgent(context.currentData, context);
    }

    // Step 4: If we have pricing data, get market insights
    let pricing = null;
    if (context.currentData?.quote_amount || context.currentData?.dimensions) {
      pricing = await this.pricingAgent(context.currentData, context.currentData?.address || '');
    }

    // Coordinate the responses
    return {
      primary_response: understanding.response,
      validation_notes: validation?.response,
      strategy_suggestions: strategy?.response,
      pricing_insights: pricing?.response,
      next_action: understanding.metadata?.next_action || 'continue',
      confidence: understanding.confidence
    };
  }

  // OpenRouter API helper
  private async callOpenRouter(model: string, prompt: string, options: any = {}): Promise<AgentResponse> {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001',
          'X-Title': 'Painting Quote AI Assistant'
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 600
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';

      // Try to parse JSON response, fallback to plain text
      try {
        const parsed = JSON.parse(content);
        return {
          response: parsed.response || content,
          confidence: parsed.confidence || 0.8,
          metadata: parsed,
          next_action: parsed.next_action
        };
      } catch {
        return {
          response: content,
          confidence: 0.7,
          next_action: 'continue'
        };
      }
    } catch (error) {
      console.error(`${model} agent error:`, error);
      return {
        response: 'I need a moment to process that. Could you repeat what you said?',
        confidence: 0.1,
        next_action: 'retry'
      };
    }
  }

  // Cost estimation for the multi-agent system
  static estimateCost(interactions: number): number {
    // Conservative estimates per interaction:
    // Understanding Agent (GPT-4o): $0.03
    // Validation Agent (Claude 3.5 Sonnet): $0.02  
    // Strategy Agent (GPT-4o): $0.03
    // Paint Expert (GPT-4o mini): $0.01
    // Pricing Agent (Claude 3.5 Haiku): $0.01
    // Total: ~$0.10 per interaction
    
    return interactions * 0.10;
  }
}

export const multiAgentSystem = new MultiAgentSystem();