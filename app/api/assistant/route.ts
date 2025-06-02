import { NextRequest, NextResponse } from 'next/server';
import { parseMessage, calculateSimpleQuote } from '@/lib/simple-assistant';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AssistantRequest {
  message: string;
  history: ChatMessage[];
  context?: any;
}

export async function POST(request: NextRequest) {
  try {
    const { message, history, context = {} }: AssistantRequest = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Parse the message and extract information
    const { extractedInfo, nextQuestion, isComplete } = parseMessage(message, context);
    
    // Update context with new information
    const updatedContext = { ...context, ...extractedInfo };
    
    let response = '';
    let quoteData = null;

    if (isComplete) {
      // Calculate the quote
      const quote = calculateSimpleQuote(updatedContext);
      quoteData = {
        ...quote,
        customerName: updatedContext.clientName,
        address: updatedContext.address,
        projectType: updatedContext.projectType,
        sqft: updatedContext.sqft,
        paintQuality: updatedContext.paintQuality,
        prepWork: updatedContext.prepWork,
        timeline: updatedContext.timeline,
        totalCost: quote.total,
        timeEstimate: updatedContext.timeline === 'rush' ? '2-3 days' : 
                     updatedContext.timeline === 'flexible' ? '5-7 days' : '3-5 days'
      };
      
      response = `Perfect! Your quote is $${quote.total.toLocaleString()}. I'll save this for you.`;
    } else {
      // Acknowledge what we got and ask the next question
      const acknowledgments = [
        extractedInfo.clientName && `Got it, ${extractedInfo.clientName}.`,
        extractedInfo.address && `${extractedInfo.address} - noted.`,
        extractedInfo.projectType && `${extractedInfo.projectType === 'both' ? 'Interior and exterior' : extractedInfo.projectType} painting.`,
        extractedInfo.sqft && `${extractedInfo.sqft} square feet.`,
        extractedInfo.paintQuality && `${extractedInfo.paintQuality} quality paint.`,
        extractedInfo.prepWork && `${extractedInfo.prepWork} prep work.`,
        extractedInfo.timeline && `${extractedInfo.timeline === 'rush' ? 'Rush job' : extractedInfo.timeline === 'flexible' ? 'Flexible timeline' : 'Standard timeline'}.`
      ].filter(Boolean);

      if (acknowledgments.length > 0) {
        response = acknowledgments.join(' ') + ' ' + nextQuestion;
      } else {
        response = nextQuestion;
      }
    }

    return NextResponse.json({
      response,
      quoteData,
      context: updatedContext,
      isComplete
    });

  } catch (error) {
    console.error('Assistant API error:', error);
    
    return NextResponse.json({
      response: "Sorry, what was that?",
      quoteData: null,
      context: {},
      isComplete: false
    });
  }
}