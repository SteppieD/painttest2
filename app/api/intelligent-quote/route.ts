import { NextRequest, NextResponse } from 'next/server';
import { intelligentQuoteAssistant } from '@/lib/intelligent-quote-assistant';

export async function POST(request: NextRequest) {
  try {
    const { 
      userInput, 
      companyId, 
      conversationHistory = [], 
      extractedData = {},
      stage = 'information_gathering',
      instruction = '',
      parseOnly = false
    } = await request.json();

    if (!userInput || !companyId) {
      return NextResponse.json({ 
        error: 'Missing required fields: userInput and companyId' 
      }, { status: 400 });
    }

    // Load comprehensive contractor context
    const contractorContext = await intelligentQuoteAssistant.loadContractorContext(companyId);

    // Build conversation state
    const conversationState = {
      stage,
      extractedData,
      conversationHistory,
      contractorContext
    };

    // Handle parsing-only requests
    if (parseOnly && instruction) {
      const parseResult = await intelligentQuoteAssistant.parseInformation(userInput, instruction, contractorContext);
      
      return NextResponse.json({
        success: true,
        response: '',
        extractedData: parseResult,
        nextStage: stage,
        confidence: 0.9,
        parseOnly: true,
        model: 'claude-sonnet-4'
      });
    }

    // Generate intelligent response
    const result = await intelligentQuoteAssistant.generateResponse(userInput, conversationState);

    return NextResponse.json({
      success: true,
      response: result.response,
      extractedData: result.extractedData,
      nextStage: result.nextStage,
      confidence: result.confidence,
      paintActions: result.paintActions || [],
      contractorName: contractorContext.contactName,
      companyName: contractorContext.companyName,
      model: 'claude-sonnet-4'
    });

  } catch (error) {
    console.error('Intelligent quote API error:', error);
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to generate response',
      response: "I'm having trouble right now, but I'm still here to help with your painting quote. Could you tell me about your project?",
      confidence: 0.1
    }, { status: 500 });
  }
}