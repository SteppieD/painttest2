import { NextRequest, NextResponse } from "next/server";
import { LangChainQuoteAssistant, QuoteInfo } from "@/lib/langchain-quote-assistant";
import { calculateProfessionalQuote, ProjectDimensions } from "@/lib/professional-quote-calculator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      message, 
      conversationHistory = [], 
      existingQuoteData = {},
      companyId 
    } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Initialize LangChain assistant
    const assistant = new LangChainQuoteAssistant();

    // Extract comprehensive quote information
    const extractedInfo = await assistant.extractQuoteInformation(
      message,
      conversationHistory,
      existingQuoteData
    );

    // Generate appropriate response
    const responseMessage = await assistant.generateResponse(
      extractedInfo,
      message,
      conversationHistory
    );

    // Check if we have enough information to calculate a quote
    let quote = null;
    let canCalculateQuote = false;

    if (extractedInfo.customer_name && 
        extractedInfo.address && 
        extractedInfo.dimensions.linear_feet && 
        extractedInfo.dimensions.ceiling_height) {
      
      try {
        // Convert to format expected by calculator
        const dimensions: ProjectDimensions = {
          wall_linear_feet: extractedInfo.dimensions.linear_feet!,
          ceiling_height: extractedInfo.dimensions.ceiling_height!,
          number_of_doors: 3, // Default values - could be improved
          number_of_windows: 5,
          ceiling_area: extractedInfo.dimensions.total_area || undefined,
        };

        // Calculate quote with extracted information
        quote = calculateProfessionalQuote(
          dimensions,
          extractedInfo.project_type || 'interior',
          {
            primer_level: extractedInfo.paint_specs.primer_needed ? 1 : 0,
            wall_paint_level: 1, // Default to mid-level
            ceiling_paint_level: extractedInfo.surfaces.ceilings ? 1 : 0,
            trim_paint_level: extractedInfo.surfaces.trim ? 1 : 0,
            include_floor_sealer: false,
          },
          20 // Default markup - could be extracted or company-specific
        );

        canCalculateQuote = true;
      } catch (calculationError) {
        console.error("Quote calculation error:", calculationError);
      }
    }

    // Determine next stage based on completeness
    let nextStage = "gathering_info";
    let stageComplete = false;

    if (extractedInfo.confidence_level === "high" && canCalculateQuote) {
      nextStage = "quote_ready";
      stageComplete = true;
    } else if (extractedInfo.customer_name && extractedInfo.address) {
      if (extractedInfo.dimensions.linear_feet && extractedInfo.dimensions.ceiling_height) {
        nextStage = "paint_selection";
      } else {
        nextStage = "dimensions";
      }
    } else {
      nextStage = "customer_info";
    }

    return NextResponse.json({
      success: true,
      response: responseMessage,
      extractedInfo,
      quote,
      canCalculateQuote,
      nextStage,
      stageComplete,
      conversationHistory: [...conversationHistory, message, responseMessage],
      suggestions: extractedInfo.next_questions,
    });

  } catch (error) {
    console.error("Error in quote assistant API:", error);
    return NextResponse.json(
      { 
        error: "Failed to process message",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}