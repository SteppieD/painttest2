import { NextRequest, NextResponse } from 'next/server';
import { parseMessage, calculateSimpleQuote } from '@/lib/simple-assistant';
import { enhancedParseMessage } from '@/lib/enhanced-assistant';
import { ProfessionalFriendAI } from '@/lib/professional-friend-ai';
import { dbGet, getPreparedStatements, dbUtils } from '@/lib/database';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AssistantRequest {
  message: string;
  history: ChatMessage[];
  context?: any;
  companyId?: string;
  userId?: string;
  useProfessionalAI?: boolean;
}

// Initialize AI (use environment variable for API key)
const professionalAI = process.env.GOOGLE_AI_API_KEY 
  ? new ProfessionalFriendAI(process.env.GOOGLE_AI_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    const { 
      message, 
      history, 
      context = {}, 
      companyId,
      userId,
      useProfessionalAI = true // Default to new AI when available
    }: AssistantRequest = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Use Professional AI if available and requested
    if (useProfessionalAI && professionalAI && userId) {
      try {
        // Load contractor context
        const contractorContext = await professionalAI.loadContractorContext(userId);
        
        // Build conversation context
        const conversationContext = {
          contractor: contractorContext,
          project: context.project || {},
          stage: context.stage || 'greeting' as const,
          lastInteraction: context.lastInteraction ? new Date(context.lastInteraction) : new Date(),
          messageCount: context.messageCount || 0
        };
        
        // Generate response
        const aiResponse = await professionalAI.generateResponse(message, conversationContext);
        
        // Handle any required actions
        let quoteData = null;
        if (aiResponse.actionRequired === 'calculate_quote') {
          // Get company settings for calculation
          const companySettings = userId ? dbGet(`
            SELECT * FROM cost_settings WHERE user_id = ?
          `, [userId]) : null;
          
          // Calculate quote
          const quote = calculateSimpleQuote({
            clientName: aiResponse.updatedContext.project.clientName,
            address: aiResponse.updatedContext.project.address,
            projectType: aiResponse.updatedContext.project.projectType,
            sqft: aiResponse.updatedContext.project.sqft,
            paintQuality: aiResponse.updatedContext.project.paintQuality,
            timeline: aiResponse.updatedContext.project.timeline,
          }, companySettings);
          
          quoteData = {
            ...quote,
            customerName: aiResponse.updatedContext.project.clientName,
            address: aiResponse.updatedContext.project.address,
            projectType: aiResponse.updatedContext.project.projectType,
            sqft: aiResponse.updatedContext.project.sqft,
            paintQuality: aiResponse.updatedContext.project.paintQuality,
            timeline: aiResponse.updatedContext.project.timeline,
            totalCost: quote.total,
            timeEstimate: aiResponse.updatedContext.project.timeline === 'rush' ? '2-3 days' : 
                         aiResponse.updatedContext.project.timeline === 'flexible' ? '5-7 days' : '3-5 days',
            needsMarkupConfirmation: quote.needsMarkupConfirmation
          };
          
          // Update context with quote amount and margin
          aiResponse.updatedContext.project.currentQuoteAmount = quote.total;
          aiResponse.updatedContext.project.margin = Math.round((quote.breakdown.markup / quote.subtotal) * 100);
        }
        
        return NextResponse.json({
          response: aiResponse.response,
          quoteData,
          context: aiResponse.updatedContext,
          isComplete: aiResponse.updatedContext.stage === 'complete',
          extractedInfo: aiResponse.extractedInfo
        });
        
      } catch (aiError) {
        console.error('Professional AI error, falling back to simple assistant:', aiError);
        // Fall through to simple assistant
      }
    }

    // Fallback to simple assistant (original logic)
    let companySettings = null;
    if (companyId) {
      companySettings = dbGet(`
        SELECT * FROM companies WHERE id = ?
      `, [companyId]);
    } else if (userId) {
      companySettings = dbGet(`
        SELECT * FROM cost_settings WHERE user_id = ?
      `, [userId]);
    }

    // Use enhanced parser for better pattern matching
    console.log('Using enhanced parser for message:', message);
    const { extractedInfo, nextQuestion, isComplete } = enhancedParseMessage(message, context);
    
    // Update context with new information
    let updatedContext = { ...context, ...extractedInfo };
    
    // If the parse function returned empty extractedInfo with a reset question, reset context
    if (Object.keys(extractedInfo).length === 0 && nextQuestion === "What's the client's name and address?") {
      updatedContext = {};
    }
    
    let response = '';
    let quoteData = null;

    if (isComplete) {
      // Calculate the quote with company settings
      const quote = calculateSimpleQuote(updatedContext, companySettings);
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
                     updatedContext.timeline === 'flexible' ? '5-7 days' : '3-5 days',
        needsMarkupConfirmation: quote.needsMarkupConfirmation
      };
      
      // Store quote in context for later reference
      updatedContext.lastQuote = quote;
      
      // Different response based on quote type
      if (updatedContext.quoteType === 'quick') {
        response = `Your quick quote is $${quote.total.toLocaleString()}. Your base costs are $${quote.subtotal.toLocaleString()}.`;
      } else {
        response = `Your detailed quote is $${quote.total.toLocaleString()}.\n\nPaint: $${quote.breakdown.paint.toLocaleString()}\nSundries: $${quote.breakdown.sundries.toLocaleString()}\nLabor: $${quote.breakdown.labor.toLocaleString()}\nYour Profit: $${quote.breakdown.markup.toLocaleString()}${quote.tax > 0 ? `\nTax: $${quote.tax.toLocaleString()}` : ''}`;
      }
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
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Provide more helpful error response
    let errorMessage = "Sorry, I didn't catch that. Could you try again?";
    if (error instanceof Error && error.message.includes('pattern')) {
      errorMessage = "I couldn't understand that format. Try saying something like 'Koko and the address is 9090 hill drive' or 'Koko at 9090 Hill Drive'.";
    }
    
    return NextResponse.json({
      response: errorMessage,
      quoteData: null,
      context: {},
      isComplete: false
    });
  }
}