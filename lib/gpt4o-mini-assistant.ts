interface GPTResponse {
  understanding: {
    intent: string;
    extracted: any;
    confidence: number;
    nextAction?: string;
  };
  response: string;
  error?: string;
}

class GPT4oMiniAssistant {
  private apiKey: string | undefined;
  private baseUrl = 'https://openrouter.ai/api/v1';
  
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
  }

  async processContractorMessage(
    message: string,
    context: {
      stage: string;
      category?: string;
      conversationHistory: Array<{ role: string; content: string }>;
      currentData: any;
      expectedInfo?: string[];
    }
  ): Promise<GPTResponse> {
    if (!this.apiKey) {
      return { 
        understanding: { intent: 'error', extracted: {}, confidence: 0 },
        response: "I can help you with your painting quote! What surfaces are we painting today?",
        error: 'OpenRouter API key not configured' 
      };
    }

    try {
      const systemPrompt = `You are a friendly painting contractor helping create quotes. You understand how contractors naturally communicate.

CURRENT CONTEXT:
Stage: ${context.stage}
${context.category ? `Currently measuring: ${context.category}` : ''}
Data collected so far: ${JSON.stringify(context.currentData, null, 2)}
${context.expectedInfo ? `Looking for: ${context.expectedInfo.join(', ')}` : ''}

YOUR JOB:
1. Understand what the contractor is telling you (measurements, counts, preferences)
2. Extract any relevant information naturally - don't be rigid about format
3. Respond conversationally in 1-2 sentences with ONE emoji
4. Guide them to provide missing information naturally

UNDERSTANDING GUIDELINES:
- "500 by 9" = 500 linear feet, 9 foot ceilings
- "just 3" when asking about doors = 3 doors
- "9" when asking for ceiling height = 9 feet
- "no windows" = 0 windows
- Be smart about context - if you're asking for X and they give a number, it's probably X

RESPONSE STYLE:
- Super casual, like texting a contractor buddy
- Acknowledge what you understood
- Ask for what's missing in a natural way
- Use contractor lingo (sqft, linear feet, etc.)

Return JSON with:
{
  "understanding": {
    "intent": "providing_measurement|asking_question|confirming|other",
    "extracted": { /* any data you found */ },
    "confidence": 0.0-1.0,
    "nextAction": "need_more_info|ready_for_paint|calculate_quote|etc"
  },
  "response": "Your 1-2 sentence casual response with emoji"
}`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...context.conversationHistory.slice(-6), // Keep last 6 messages for context
        { role: 'user', content: message }
      ];

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://paintingquoteapp.com',
          'X-Title': 'Painting Quote App'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 200,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      try {
        return JSON.parse(content);
      } catch {
        // Fallback if JSON parsing fails
        return {
          understanding: { intent: 'other', extracted: {}, confidence: 0.5 },
          response: "Got it! What else can you tell me about the project?",
          error: 'Failed to parse LLM response'
        };
      }
    } catch (error) {
      console.error('GPT-4o mini error:', error);
      return {
        understanding: { intent: 'error', extracted: {}, confidence: 0 },
        response: "Let me help you with that quote. What are we painting?",
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Simplified method for direct chat without heavy parsing
  async chat(
    message: string,
    context: {
      stage: string;
      recentMessages?: Array<{ role: string; content: string }>;
    }
  ): Promise<string> {
    if (!this.apiKey) {
      // Fallback responses for common stages
      const fallbacks: Record<string, string> = {
        'customer_info': "Hey! Let's get started. What's the customer's name and address?",
        'project_type': "What kind of painting are we doing - interior, exterior, or both?",
        'surface_selection': "What surfaces need painting? Walls, ceilings, trim, doors?",
        'category_measurement_collection': "What are the measurements for that?",
        'paint_selection': "What kind of paint quality do you want - good, better, or best?"
      };
      return fallbacks[context.stage] || "Tell me about your painting project!";
    }

    try {
      const systemPrompt = `You're a friendly painting contractor creating quotes. 
Keep responses SHORT (1-2 sentences), CASUAL (like texting), and include ONE emoji.
Current stage: ${context.stage}`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...(context.recentMessages || []).slice(-4),
        { role: 'user', content: message }
      ];

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://paintingquoteapp.com',
          'X-Title': 'Painting Quote App'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages,
          temperature: 0.8,
          max_tokens: 100
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "Got it! Tell me more about the project.";
      
    } catch (error) {
      console.error('Chat error:', error);
      // Return context-appropriate fallback
      return "I understand! What else do you need for the quote?";
    }
  }
}

export const gpt4oMiniAssistant = new GPT4oMiniAssistant();