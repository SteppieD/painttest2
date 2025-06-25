import { NextRequest, NextResponse } from 'next/server';
import { unifiedQuoteAssistant } from '@/lib/unified-quote-assistant';

export async function POST(request: NextRequest) {
  try {
    const { 
      userInput, 
      companyId, 
      conversationHistory = []
    } = await request.json();

    if (!userInput || !companyId) {
      return NextResponse.json({ 
        error: 'Missing required fields: userInput and companyId' 
      }, { status: 400 });
    }

    // Process with unified assistant
    const result = await unifiedQuoteAssistant.processUserInput(
      userInput,
      companyId,
      conversationHistory
    );

    return NextResponse.json({
      success: result.success,
      response: result.response,
      extractedData: result.extractedData,
      quote: result.quote,
      confidence: result.confidence,
      model: 'claude-sonnet-4-unified'
    });

  } catch (error) {
    console.error('Unified quote API error:', error);
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to process quote request',
      response: "I'm having trouble right now. Could you tell me the customer's name and address to get started?",
      confidence: 0.1
    }, { status: 500 });
  }
}