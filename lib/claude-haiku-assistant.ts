import { ConversationData } from './improved-conversation-parser';

interface ClaudeResponse {
  parsed?: any;
  response?: string;
  error?: string;
}

class ClaudeHaikuAssistant {
  private apiKey: string | undefined;
  private baseUrl = 'https://openrouter.ai/api/v1';
  
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
  }

  async parseContractorInput(
    input: string, 
    context: {
      stage: string;
      category?: string;
      existingData: Partial<ConversationData>;
      needsInfo?: string[];
    }
  ): Promise<ClaudeResponse> {
    if (!this.apiKey) {
      return { error: 'OpenRouter API key not configured' };
    }

    try {
      const systemPrompt = `You are a parsing assistant for a painting quote app. Extract information from contractor input and return structured JSON data.

Current stage: ${context.stage}
${context.category ? `Current category: ${context.category}` : ''}
Existing data: ${JSON.stringify(context.existingData, null, 2)}

Parse the user input and extract relevant information. Be flexible with how contractors express measurements:
- "500 by 9" means 500 linear feet with 9-foot ceilings
- "9" alone when asking for ceiling height means 9 feet
- "Just 3" when asking for doors means 3 doors
- "No windows" or "0 windows" both mean 0
- Accept partial information and note what's still needed

Return JSON with:
{
  "extracted": { /* any new data extracted */ },
  "stillNeeds": [ /* list of what's still missing */ ],
  "confidence": 0.0-1.0
}`;

      const userPrompt = `User input: "${input}"`;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://paintingquoteapp.com',
          'X-Title': 'Painting Quote App'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-haiku',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3, // Lower for consistent parsing
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      try {
        const parsed = JSON.parse(content);
        return { parsed };
      } catch {
        // If JSON parsing fails, return the raw content
        return { response: content };
      }
    } catch (error) {
      console.error('Claude Haiku parsing error:', error);
      return { error: error instanceof Error ? error.message : 'Failed to parse input' };
    }
  }

  async generateContractorResponse(
    context: {
      stage: string;
      category?: string;
      parsedData: any;
      existingData: Partial<ConversationData>;
    }
  ): Promise<ClaudeResponse> {
    if (!this.apiKey) {
      return { error: 'OpenRouter API key not configured' };
    }

    try {
      const systemPrompt = `You are a friendly painting contractor helping create a quote. 

CRITICAL INSTRUCTIONS:
- Respond in 1-2 sentences max
- Use casual, contractor-friendly language
- Include ONE relevant emoji
- Sound like texting with a friend, not a formal business
- Acknowledge what you understood and ask for what's missing
- Be specific about measurements needed

Examples of good responses:
- "Got it! 500 linear feet with 9 foot ceilings 👍 Time to pick paint for your walls!"
- "Perfect! 3 doors to paint 🚪 How many windows we doing?"
- "Sweet! Living room walls it is 🎨 What's the wall situation? Just need linear feet and ceiling height!"

Current context:
Stage: ${context.stage}
Category: ${context.category || 'N/A'}
Just parsed: ${JSON.stringify(context.parsedData, null, 2)}
Full data so far: ${JSON.stringify(context.existingData, null, 2)}`;

      const userPrompt = `Generate a natural response based on what was just parsed and what we still need.`;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://paintingquoteapp.com',
          'X-Title': 'Painting Quote App'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-haiku',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7, // Higher for more natural responses
          max_tokens: 150
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      return { response: content };
    } catch (error) {
      console.error('Claude Haiku response error:', error);
      return { error: error instanceof Error ? error.message : 'Failed to generate response' };
    }
  }

  async compareWithGemini(
    input: string,
    stage: string,
    category?: string
  ): Promise<{
    geminiResponse: string;
    claudeResponse: string;
    comparison: string;
  }> {
    // Mock Gemini response based on current hardcoded logic
    const geminiResponses: Record<string, string> = {
      'walls_500by9': "I need the wall measurements. Just tell me like \"300 linear feet, 9 foot ceilings\" or \"300 by 9\"",
      'ceiling_9': "I still need the ceiling height to calculate the wall area.",
      'doors_3': "How many doors are we painting? Just tell me like:\n\n• \"3 doors\"\n• \"Just 2\"\n• \"No doors\" or \"0 doors\"",
      'windows_5': "How many windows are we painting? Just tell me like:\n\n• \"5 windows\"\n• \"Just 3\"\n• \"No windows\" or \"0 windows\""
    };

    // Get Claude's response
    const claudeResult = await this.generateContractorResponse({
      stage,
      category,
      parsedData: { input },
      existingData: {}
    });

    // Generate comparison
    const comparison = `
**Input:** "${input}"
**Stage:** ${stage}
**Category:** ${category || 'N/A'}

**Current Gemini Response:**
${geminiResponses[`${category}_${input.replace(/\s+/g, '')}`] || 'I need more information...'}

**Claude 3.5 Haiku Response:**
${claudeResult.response || 'Error generating response'}

**Analysis:**
- Gemini: Formal, template-based, sometimes misses context
- Claude: Natural, conversational, understands contractor language
`;

    return {
      geminiResponse: geminiResponses[`${category}_${input.replace(/\s+/g, '')}`] || 'I need more information...',
      claudeResponse: claudeResult.response || 'Error generating response',
      comparison
    };
  }
}

export const claudeHaikuAssistant = new ClaudeHaikuAssistant();