/**
 * Professional Friend AI System
 * 
 * IMPORTANT: TypeScript Safety Guidelines
 * ----------------------------------------
 * This module handles contractor data that may be undefined for new users.
 * Always check for undefined values before using numeric properties:
 * 
 * BAD:  contractor.averageJobSize * 1.15
 * GOOD: contractor.averageJobSize && contractor.averageJobSize * 1.15
 * 
 * Common undefined-safe patterns:
 * - Use optional chaining: contractor.averageJobSize?.toFixed(0)
 * - Provide defaults: contractor.winRate || 50
 * - Guard conditions: if (contractor.averageJobSize) { ... }
 * 
 * This ensures the app works for both new contractors (no history)
 * and established contractors (with full analytics).
 */

import { dbGet, dbAll, getPreparedStatements, dbUtils } from './database';

/**
 * ContractorContext contains business intelligence data for the contractor.
 * All numeric fields are optional as they may not have historical data.
 * 
 * @property userId - Unique identifier for the contractor
 * @property name - Contractor's name for personalization
 * @property company - Company name
 * @property averageJobSize - Average quote value (may be undefined for new contractors)
 * @property preferredMargin - Target profit margin percentage
 * @property winRate - Percentage of quotes accepted
 * @property totalQuotesThisMonth - Number of quotes created this month
 * @property revenueThisMonth - Total revenue quoted this month
 * @property recentProjects - Array of recent project data for pattern analysis
 */
export interface ContractorContext {
  userId: string;
  name: string;
  company: string;
  averageJobSize?: number;
  preferredMargin?: number;
  winRate?: number;
  totalQuotesThisMonth?: number;
  revenueThisMonth?: number;
  recentProjects?: Array<{
    clientName: string;
    address: string;
    amount: number;
    status: string;
    daysAgo: number;
  }>;
}

export interface ProjectContext {
  projectId?: string;
  clientName?: string;
  address?: string;
  email?: string;
  phone?: string;
  projectType?: 'interior' | 'exterior' | 'both';
  sqft?: number;
  paintQuality?: 'basic' | 'premium' | 'luxury';
  timeline?: 'rush' | 'standard' | 'flexible';
  rooms?: string[];
  specialRequests?: string;
  currentQuoteAmount?: number;
  margin?: number;
}

export interface ConversationContext {
  contractor: ContractorContext;
  project: ProjectContext;
  stage: 'greeting' | 'gathering' | 'calculating' | 'reviewing' | 'complete';
  lastInteraction?: Date;
  messageCount: number;
}

export class ProfessionalFriendAI {
  private openRouterApiKey: string;
  
  constructor(apiKey: string) {
    // Use OpenRouter API key for Claude 3.5 Sonnet access
    this.openRouterApiKey = process.env.OPENROUTER_API_KEY || apiKey;
  }

  async loadContractorContext(userId: string): Promise<ContractorContext> {
    // Get user and company info
    const user = dbGet("SELECT * FROM users WHERE id = ?", [userId]) as any;
    const costSettings = dbGet("SELECT * FROM cost_settings WHERE user_id = ?", [userId]) as any;
    
    // Get recent quotes for business intelligence
    const recentQuotes = dbAll(`
      SELECT q.*, p.client_name, p.property_address 
      FROM quotes q 
      JOIN projects p ON q.project_id = p.id 
      WHERE p.user_id = ? 
      ORDER BY q.created_at DESC 
      LIMIT 10
    `, [userId]) as any[];
    
    // Calculate stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const monthlyQuotes = recentQuotes.filter(q => 
      new Date(q.created_at) > thirtyDaysAgo
    );
    
    const acceptedQuotes = monthlyQuotes.filter(q => q.status === 'accepted');
    const winRate = monthlyQuotes.length > 0 
      ? (acceptedQuotes.length / monthlyQuotes.length) * 100 
      : 0;
    
    const revenueThisMonth = monthlyQuotes.reduce((sum, q) => sum + (q.final_price || 0), 0);
    const averageJobSize = monthlyQuotes.length > 0 
      ? revenueThisMonth / monthlyQuotes.length 
      : 3500; // Default to $3,500 for new contractors
    
    // Get recent successful projects for context
    const recentProjects = recentQuotes.slice(0, 5).map(q => {
      const daysAgo = Math.floor((Date.now() - new Date(q.created_at).getTime()) / (1000 * 60 * 60 * 24));
      return {
        clientName: q.client_name,
        address: q.property_address,
        amount: q.final_price,
        status: q.status,
        daysAgo
      };
    });
    
    return {
      userId,
      name: costSettings?.contact_name || user?.company_name || 'there',
      company: costSettings?.company_name || user?.company_name || 'Your Company',
      averageJobSize,
      preferredMargin: costSettings?.default_labor_percentage || 30,
      winRate,
      totalQuotesThisMonth: monthlyQuotes.length,
      revenueThisMonth,
      recentProjects
    };
  }

  async generateResponse(
    message: string, 
    context: ConversationContext
  ): Promise<{
    response: string;
    updatedContext: ConversationContext;
    extractedInfo?: Partial<ProjectContext>;
    actionRequired?: 'calculate_quote' | 'send_quote' | 'save_project';
  }> {
    // Extract information from the message
    const extractedInfo = await this.extractInformation(message, context);
    
    // Update project context
    const updatedProject = { ...context.project, ...extractedInfo };
    
    // Determine conversation stage
    const stage = this.determineStage(updatedProject);
    
    // Generate contextual prompt
    const prompt = await this.buildPrompt(message, context, extractedInfo, stage);
    
    // Get AI response using Claude 3.5 Sonnet via OpenRouter
    const result = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
        'X-Title': 'Professional Painting Quote Assistant'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 1024
      })
    });
    
    if (!result.ok) {
      throw new Error(`OpenRouter API error: ${result.status}`);
    }
    
    const data = await result.json();
    const response = data.choices[0]?.message?.content || '';
    
    // Clean up response
    const cleanedResponse = this.cleanResponse(response);
    
    // Determine if any action is needed
    const actionRequired = this.determineAction(updatedProject, stage);
    
    return {
      response: cleanedResponse,
      updatedContext: {
        ...context,
        project: updatedProject,
        stage,
        messageCount: context.messageCount + 1,
        lastInteraction: new Date()
      },
      extractedInfo,
      actionRequired
    };
  }

  private async extractInformation(
    message: string, 
    context: ConversationContext
  ): Promise<Partial<ProjectContext>> {
    const prompt = `
    Extract relevant information from this message for a painting quote.
    Current context: ${JSON.stringify(context.project)}
    
    Message: "${message}"
    
    Extract any of these if mentioned:
    - Client name
    - Property address
    - Email or phone
    - Project type (interior/exterior/both)
    - Square footage
    - Paint quality (basic/premium/luxury)
    - Timeline (rush/standard/flexible)
    - Room details
    - Special requests
    
    Return ONLY a JSON object with extracted fields. If nothing relevant found, return {}
    `;
    
    try {
      const result = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
          'X-Title': 'Professional Painting Quote Assistant'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-sonnet-4',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        })
      });
      
      if (!result.ok) {
        throw new Error(`OpenRouter API error: ${result.status}`);
      }
      
      const data = await result.json();
      const text = data.choices[0]?.message?.content || '';
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error extracting information:', error);
    }
    
    return {};
  }

  private determineStage(project: ProjectContext): ConversationContext['stage'] {
    if (!project.clientName || !project.address) {
      return 'greeting';
    }
    if (!project.projectType || !project.sqft || !project.paintQuality) {
      return 'gathering';
    }
    if (!project.currentQuoteAmount) {
      return 'calculating';
    }
    if (project.currentQuoteAmount && !project.projectId) {
      return 'reviewing';
    }
    return 'complete';
  }

  private async buildPrompt(
    message: string,
    context: ConversationContext,
    extractedInfo: Partial<ProjectContext>,
    stage: ConversationContext['stage']
  ): Promise<string> {
    const { contractor, project } = context;
    
    let stageContext = '';
    let smartSuggestion = '';
    
    switch (stage) {
      case 'greeting':
        stageContext = `Start a new quote. Be warm and professional. Ask for client name and property address.`;
        break;
      case 'gathering':
        stageContext = `Gather missing information efficiently. Need: ${this.getMissingFields(project).join(', ')}`;
        break;
      case 'calculating':
        stageContext = `All information gathered. Acknowledge and indicate you'll calculate the quote.`;
        break;
      case 'reviewing':
        stageContext = `Quote calculated at $${project.currentQuoteAmount}. Help optimize if needed.`;
        // Generate smart suggestion for this stage
        const suggestion = await this.generateSmartSuggestion(project, contractor);
        if (suggestion) {
          smartSuggestion = `\n\nSmart Suggestion to mention if appropriate: ${suggestion}`;
        }
        break;
      case 'complete':
        stageContext = `Quote is complete. Offer to send it or make adjustments.`;
        break;
    }
    
    // Get business insight
    const businessInsight = await this.generateBusinessInsight(contractor);
    
    return `
    You are a professional friend and assistant to ${contractor.name}, a painting contractor at ${contractor.company}.
    Be warm, supportive, and knowledgeable. Use their name occasionally but naturally.
    
    Contractor Context:
    - Average job size: $${contractor.averageJobSize?.toFixed(0) || '3,500'}
    - Win rate: ${contractor.winRate?.toFixed(0) || '50'}%
    - Quotes this month: ${contractor.totalQuotesThisMonth || 0}
    - Revenue this month: $${contractor.revenueThisMonth?.toFixed(0) || '0'}
    
    Recent successful projects:
    ${contractor.recentProjects?.slice(0, 3).map(p => 
      `- ${p.clientName} (${p.daysAgo} days ago): $${p.amount}`
    ).join('\n') || 'None yet this month'}
    
    Current Project:
    ${JSON.stringify(project, null, 2)}
    
    Stage: ${stageContext}
    ${smartSuggestion}
    
    ${businessInsight ? `Business Insight: ${businessInsight}` : ''}
    
    User just said: "${message}"
    They extracted: ${JSON.stringify(extractedInfo)}
    
    Guidelines:
    - Keep responses concise and natural
    - Reference past successes when relevant
    - Provide gentle guidance on pricing based on their history
    - Be encouraging but professional
    - Don't over-explain or lecture
    - If they seem to be underpricing, gently suggest based on their average
    - Mention business insights naturally when relevant
    
    Respond naturally as their professional friend:`;
  }

  private getMissingFields(project: ProjectContext): string[] {
    const required = [];
    if (!project.projectType) required.push('project type (interior/exterior)');
    if (!project.sqft) required.push('square footage');
    if (!project.paintQuality) required.push('paint quality');
    return required;
  }

  private cleanResponse(response: string): string {
    // Remove any JSON artifacts or system instructions
    return response
      .replace(/```json[\s\S]*?```/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/\*\*/g, '')
      .trim();
  }

  private determineAction(
    project: ProjectContext, 
    stage: ConversationContext['stage']
  ): 'calculate_quote' | 'send_quote' | 'save_project' | undefined {
    if (stage === 'calculating' && !project.currentQuoteAmount) {
      return 'calculate_quote';
    }
    if (stage === 'complete' && project.currentQuoteAmount) {
      return 'save_project';
    }
    return undefined;
  }

  async generateBusinessInsight(context: ContractorContext): Promise<string> {
    const insights = [];
    
    // Win rate insight
    if (context.winRate && context.winRate > 60) {
      insights.push(`Your ${context.winRate.toFixed(0)}% win rate is excellent - you're pricing well!`);
    } else if (context.winRate && context.winRate < 40) {
      insights.push(`Your win rate is ${context.winRate.toFixed(0)}% - might be worth reviewing your pricing strategy.`);
    }
    
    // Revenue insight
    if (context.revenueThisMonth && context.revenueThisMonth > 20000) {
      insights.push(`Strong month with $${context.revenueThisMonth.toLocaleString()} quoted!`);
    }
    
    // Recent project patterns
    const recentAmounts = context.recentProjects?.map(p => p.amount) || [];
    if (recentAmounts.length > 3) {
      const trend = recentAmounts[0] > recentAmounts[recentAmounts.length - 1] ? 'up' : 'down';
      insights.push(`Your quote values are trending ${trend}.`);
    }
    
    return insights.length > 0 ? insights[0] : '';
  }
  
  /**
   * Generates smart pricing suggestions based on contractor's history.
   * Safely handles undefined values for new contractors without history.
   * 
   * @param project - Current project context
   * @param contractor - Contractor's business context
   * @returns Suggestion string or null if no relevant suggestion
   */
  async generateSmartSuggestion(
    project: ProjectContext,
    contractor: ContractorContext
  ): Promise<string | null> {
    // Find similar recent projects
    const similarProjects = contractor.recentProjects?.filter(p => {
      // Similar size (within 20%)
      if (project.sqft && p.amount) {
        const estimatedSqft = p.amount / 3; // Rough estimate
        return Math.abs(estimatedSqft - project.sqft) / project.sqft < 0.2;
      }
      return false;
    });
    
    if (similarProjects && similarProjects.length > 0) {
      const avgAmount = similarProjects.reduce((sum, p) => sum + p.amount, 0) / similarProjects.length;
      const acceptedProjects = similarProjects.filter(p => p.status === 'accepted');
      const highestAccepted = acceptedProjects.length > 0 
        ? Math.max(...acceptedProjects.map(p => p.amount))
        : avgAmount;
      
      if (project.currentQuoteAmount && project.currentQuoteAmount < avgAmount * 0.9) {
        return `I noticed this quote is lower than your recent similar projects (averaging $${avgAmount.toFixed(0)}). You successfully charged $${highestAccepted.toFixed(0)} for a similar job. Want to adjust?`;
      }
    }
    
    // Margin suggestions
    if (project.margin && contractor.preferredMargin) {
      if (project.margin < contractor.preferredMargin - 5) {
        return `Your margin is ${project.margin}%, below your usual ${contractor.preferredMargin}%. Want me to recalculate to hit your target?`;
      }
    }
    
    // Timeline-based suggestions
    if (project.timeline === 'rush' && contractor.averageJobSize && (!project.currentQuoteAmount || project.currentQuoteAmount < contractor.averageJobSize * 1.15)) {
      return `This is a rush job - don't forget to add your rush premium. I'd suggest at least 15% extra.`;
    }
    
    return null;
  }
}