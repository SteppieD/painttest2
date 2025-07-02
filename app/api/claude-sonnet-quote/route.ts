import { NextRequest, NextResponse } from 'next/server';

interface QuoteContext {
  stage: string;
  userInput: string;
  projectData?: any;
  conversationHistory?: Array<{ role: string; content: string }>;
}

// Claude 3.5 Sonnet Quote Assistant via OpenRouter
export async function POST(request: NextRequest) {
  try {
    const { stage, userInput, projectData, conversationHistory }: QuoteContext = await request.json();
    
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      return NextResponse.json({ error: 'OpenRouter API key not configured' }, { status: 500 });
    }

    // Build context-aware prompt for Claude 3.5 Sonnet
    const systemPrompt = `You are an expert painting contractor assistant helping create professional quotes. You excel at:

1. **Natural Conversation**: Speak like a experienced contractor who's friendly but professional
2. **Information Extraction**: Parse measurements, paint needs, and project details from casual input
3. **Smart Guidance**: Ask the right follow-up questions based on what's missing
4. **Cost Awareness**: Understand typical painting costs and help optimize pricing

Current stage: ${stage}
Project data so far: ${JSON.stringify(projectData, null, 2)}

Guidelines:
- Keep responses conversational and concise (1-3 sentences)
- Extract specific measurements and details from user input
- Ask for missing critical information in a natural way
- Use contractor terminology (linear feet, coverage, prep work)
- Be encouraging and professional
- Include relevant emojis sparingly for warmth

Respond naturally to help move the quote forward.`;

    const conversationContext = conversationHistory?.map(msg => 
      `${msg.role}: ${msg.content}`
    ).join('\n') || '';

    const userPrompt = `${conversationContext ? 'Conversation so far:\n' + conversationContext + '\n\n' : ''}User just said: "${userInput}"

Please respond naturally to help create their painting quote.`;

    // Call Claude 3.5 Sonnet via OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
        'X-Title': 'Professional Painting Quote Assistant'
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
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', errorText);
      return NextResponse.json({ 
        error: 'AI service temporarily unavailable',
        fallback: "I understand you're working on a painting quote. Could you tell me more about the project - like the square footage or what rooms need painting?"
      }, { status: 500 });
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || '';

    // Extract any structured data from the response if needed
    const extractedData = await extractProjectData(userInput, projectData);

    return NextResponse.json({
      response: aiResponse,
      extractedData,
      model: 'claude-3.5-sonnet',
      stage: stage
    });

  } catch (error) {
    console.error('Claude Sonnet API error:', error);
    return NextResponse.json({ 
      error: 'Failed to process request',
      fallback: "I understand you're working on a painting quote. Could you tell me more about the project?"
    }, { status: 500 });
  }
}

// Helper function to extract structured data from user input
async function extractProjectData(userInput: string, existingData: any) {
  const openRouterApiKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterApiKey) return {};

  try {
    const extractionPrompt = `Extract structured data from this painting contractor input. Return only valid JSON.

User input: "${userInput}"
Existing data: ${JSON.stringify(existingData)}

Extract any mentioned:
- customer_name: string
- address: string  
- project_type: "interior" | "exterior" | "both"
- wall_linear_feet: number
- ceiling_height: number
- number_of_doors: number
- number_of_windows: number
- rooms: string[]
- paint_quality: "basic" | "premium" | "luxury"
- timeline: "rush" | "standard" | "flexible"
- special_requests: string

Return empty object {} if nothing relevant found.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
        'X-Title': 'Professional Painting Quote Assistant'
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
        max_tokens: 300
      })
    });

    if (response.ok) {
      const data = await response.json();
      const text = data.choices[0]?.message?.content || '{}';
      
      // Extract JSON from response
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