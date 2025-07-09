/**
 * Cost-Optimized AI Functions for 10-Cent Quote Target
 * 
 * Target: $0.10 per quote
 * Claude 3.5 Sonnet: $3 input / $15 output per 1M tokens
 * Budget: ~33k input + 6.6k output tokens per quote
 */

interface CostOptimizedConfig {
  maxInputTokens: number;
  maxOutputTokens: number;
  maxApiCalls: number;
  budgetCents: number;
}

export const COST_CONFIG: CostOptimizedConfig = {
  maxInputTokens: 50000,    // ~15 cents input budget
  maxOutputTokens: 1000,    // ~1.5 cents output budget  
  maxApiCalls: 12,          // Realistic number for quote conversations (5-12 messages typical)
  budgetCents: 25           // 25-cent reasonable limit
};

/**
 * Lightweight quote prompt - minimal tokens
 */
export function createMinimalQuotePrompt(userMessage: string, context?: any): string {
  // Minimal system prompt - ~100 tokens
  return `You are a painting quote assistant. Extract these details from the user's message:
- Customer name
- Project type (interior/exterior)  
- Square footage or room dimensions
- Paint preferences
- Special requests

User: "${userMessage}"

Respond with quote details in under 150 words.`;
}

/**
 * Cost tracking per session
 */
class QuoteCostTracker {
  private sessions = new Map<string, {
    tokenCount: number;
    apiCalls: number;
    estimatedCost: number;
  }>();

  trackUsage(sessionId: string, inputTokens: number, outputTokens: number): { 
    withinBudget: boolean; 
    shouldWarn: boolean; 
    shouldSuggestManual: boolean;
    apiCallsRemaining: number;
    percentUsed: number;
  } {
    const session = this.sessions.get(sessionId) || { 
      tokenCount: 0, 
      apiCalls: 0, 
      estimatedCost: 0 
    };

    // Calculate cost (Claude Sonnet 4 via OpenRouter)
    const inputCost = (inputTokens / 1000000) * 3.00;   // $3 per 1M input tokens
    const outputCost = (outputTokens / 1000000) * 15.00; // $15 per 1M output tokens
    const callCost = inputCost + outputCost;

    session.tokenCount += inputTokens + outputTokens;
    session.apiCalls += 1;
    session.estimatedCost += callCost;

    this.sessions.set(sessionId, session);

    const budgetLimit = COST_CONFIG.budgetCents / 100;
    const warningThreshold = budgetLimit * 0.7; // Warn at 70% of budget
    const percentUsed = (session.estimatedCost / budgetLimit) * 100;
    const apiCallsRemaining = Math.max(0, COST_CONFIG.maxApiCalls - session.apiCalls);

    // Log usage for monitoring
    console.log(`Session ${sessionId}: $${session.estimatedCost.toFixed(3)} (${session.apiCalls}/${COST_CONFIG.maxApiCalls} calls)`);

    return {
      withinBudget: session.estimatedCost <= budgetLimit && session.apiCalls <= COST_CONFIG.maxApiCalls,
      shouldWarn: session.estimatedCost > warningThreshold || session.apiCalls >= (COST_CONFIG.maxApiCalls * 0.8),
      shouldSuggestManual: session.apiCalls >= (COST_CONFIG.maxApiCalls * 0.9) || session.estimatedCost > (budgetLimit * 0.9),
      apiCallsRemaining,
      percentUsed
    };
  }

  getSessionCost(sessionId: string): number {
    return this.sessions.get(sessionId)?.estimatedCost || 0;
  }

  getSession(sessionId: string) {
    return this.sessions.get(sessionId);
  }

  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}

export const costTracker = new QuoteCostTracker();

/**
 * Cost-optimized OpenRouter API call
 */
export async function makeCostOptimizedAICall(
  message: string,
  sessionId: string,
  maxTokens: number = 300,
  context?: string
): Promise<{ 
  response: string; 
  cost: number; 
  withinBudget: boolean; 
  shouldWarn: boolean;
  shouldSuggestManual: boolean;
  apiCallsRemaining: number;
}> {
  
  const openRouterApiKey = process.env.OPENROUTER_API_KEY;
  
  if (!openRouterApiKey) {
    return {
      response: "AI features require API configuration. Please use manual quote creation.",
      cost: 0,
      withinBudget: true,
      shouldWarn: false,
      shouldSuggestManual: true,
      apiCallsRemaining: 0
    };
  }

  // Check if we're at the API call limit before making the call
  const session = costTracker.getSession(sessionId);
  if (session && session.apiCalls >= COST_CONFIG.maxApiCalls) {
    return {
      response: `I've reached the conversation limit for this quote session (${COST_CONFIG.maxApiCalls} messages). Here's what I can suggest:\n\n• **Continue with manual quote creation** - You have all the flexibility you need\n• **Start a new conversation** - Begin fresh if you want to try a different approach\n• **Use the quick quote calculator** - For fast estimates\n\nWould you like me to save what we've discussed so far?`,
      cost: session.estimatedCost,
      withinBudget: false,
      shouldWarn: false,
      shouldSuggestManual: true,
      apiCallsRemaining: 0
    };
  }

  // Create optimized prompt (still minimal but more useful)
  const prompt = context ? 
    `${context}\n\nUser: "${message}"\n\nRespond helpfully and concisely:` :
    createMinimalQuotePrompt(message);
  
  const estimatedInputTokens = Math.ceil(prompt.length / 4); // Rough estimate

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
        'X-Title': 'Painting Quote Assistant'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-sonnet-4', // Claude Sonnet 4 via OpenRouter
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7, // Good balance for conversational responses
        max_tokens: maxTokens,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "Please provide more details for your quote.";
    
    // Track actual usage if available in response
    const usage = data.usage;
    const inputTokens = usage?.prompt_tokens || estimatedInputTokens;
    const outputTokens = usage?.completion_tokens || Math.ceil(aiResponse.length / 4);
    
    const trackResult = costTracker.trackUsage(sessionId, inputTokens, outputTokens);
    const totalCost = costTracker.getSessionCost(sessionId);

    console.log(`AI Call - Session: ${sessionId}, Input: ${inputTokens}, Output: ${outputTokens}, Cost: $${totalCost.toFixed(4)}`);

    return {
      response: aiResponse,
      cost: totalCost,
      withinBudget: trackResult.withinBudget,
      shouldWarn: trackResult.shouldWarn,
      shouldSuggestManual: trackResult.shouldSuggestManual,
      apiCallsRemaining: trackResult.apiCallsRemaining
    };

  } catch (error) {
    console.error('Cost-optimized AI call failed:', error);
    return {
      response: "I'm having trouble processing that request. Please try manual quote creation.",
      cost: costTracker.getSessionCost(sessionId),
      withinBudget: true,
      shouldWarn: false,
      shouldSuggestManual: true,
      apiCallsRemaining: 0
    };
  }
}

/**
 * Estimate tokens in text (rough approximation)
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Get cost summary for session
 */
export function getSessionCostSummary(sessionId: string) {
  const session = costTracker.getSessionCost(sessionId);
  const percentOfBudget = (session / (COST_CONFIG.budgetCents / 100)) * 100;
  
  return {
    cost: session,
    budgetCents: COST_CONFIG.budgetCents,
    percentUsed: percentOfBudget,
    withinBudget: session <= (COST_CONFIG.budgetCents / 100)
  };
}