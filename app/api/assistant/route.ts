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
    let updatedContext = { ...context, ...extractedInfo };
    
    // If the parse function returned empty extractedInfo with a reset question, reset context
    if (Object.keys(extractedInfo).length === 0 && nextQuestion === "What's the client's name and address?") {
      updatedContext = {};
    }
    
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
        timeline: updatedContext.timeline,
        totalCost: quote.total,
        timeEstimate: updatedContext.timeline === 'rush' ? '2-3 days' : 
                     updatedContext.timeline === 'flexible' ? '5-7 days' : '3-5 days'
      };
      
      // Store quote in context for later reference
      updatedContext.lastQuote = quote;
      
      response = `Your quote is $${quote.total.toLocaleString()}. Click 'View Quote Details' above to see the full breakdown and generate a customer quote.`;
    } else if (nextQuestion === 'PROVIDE_BREAKDOWN' && context.lastQuote) {
      // Provide breakdown when asked
      const quote = context.lastQuote;
      response = `Here's the breakdown:\n\nLabour: $${quote.breakdown.labor.toLocaleString()}\nPaint & Materials: $${quote.breakdown.materials.toLocaleString()}\nPrep Work: $${quote.breakdown.prepWork.toLocaleString()}\nMarkup: $${quote.breakdown.markup.toLocaleString()}\n\nTotal: $${quote.total.toLocaleString()}`;
    } else {
      // Acknowledge what we got and ask the next question
      const acknowledgments = [];
      
      // Only acknowledge new information
      if (extractedInfo.clientName && !context.clientName) {
        acknowledgments.push(`Got it, ${extractedInfo.clientName}.`);
      }
      if (extractedInfo.address && !context.address) {
        acknowledgments.push(`${extractedInfo.address} - noted.`);
      }
      if (extractedInfo.quoteType && !context.quoteType) {
        acknowledgments.push(`${extractedInfo.quoteType === 'quick' ? 'Quick quote' : 'Advanced quote'} - perfect.`);
      }
      if (extractedInfo.projectType && !context.projectType) {
        const projectDesc = extractedInfo.projectType === 'both' ? 'Interior and exterior' : 
                           extractedInfo.projectType.charAt(0).toUpperCase() + extractedInfo.projectType.slice(1);
        acknowledgments.push(`${projectDesc} painting.`);
      }
      if (extractedInfo.sqft && !context.sqft) {
        acknowledgments.push(`${extractedInfo.sqft} square feet.`);
      }
      if (extractedInfo.paintQuality && !context.paintQuality) {
        acknowledgments.push(`${extractedInfo.paintQuality.charAt(0).toUpperCase() + extractedInfo.paintQuality.slice(1)} paint.`);
      }
      if (extractedInfo.timeline && !context.timeline) {
        const timelineDesc = extractedInfo.timeline === 'rush' ? 'Rush job' : 
                           extractedInfo.timeline === 'flexible' ? 'Flexible timeline' : 
                           'Standard timeline';
        acknowledgments.push(`${timelineDesc}.`);
      }

      // Build response with acknowledgments
      if (acknowledgments.length > 0) {
        // Join up to 2 acknowledgments for brevity
        const ackText = acknowledgments.slice(0, 2).join(' ');
        response = ackText + ' ' + nextQuestion;
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