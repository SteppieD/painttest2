import { NextRequest, NextResponse } from "next/server";
import { QuoteCreationRequest, StandardQuote } from "@/types/quote";
import { generateQuoteId } from "@/lib/utils";

// Simple in-memory storage for development
const quotes = new Map<string, StandardQuote>();

export async function POST(request: NextRequest) {
  try {
    const requestData: QuoteCreationRequest = await request.json();
    
    console.log('📝 Creating quote from conversation:', requestData);
    
    // Validation
    if (!requestData.customer_name || !requestData.quote_amount || requestData.quote_amount <= 0) {
      return NextResponse.json(
        { error: "Customer name and valid quote amount are required" },
        { status: 400 }
      );
    }

    if (!requestData.company_id) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Generate unique quote ID
    const quoteId = generateQuoteId();
    const now = new Date().toISOString();

    // Create standardized quote object
    const quote: StandardQuote = {
      id: quoteId,
      quote_id: quoteId,
      customer_name: requestData.customer_name,
      customer_email: requestData.customer_email || undefined,
      customer_phone: requestData.customer_phone || undefined,
      address: requestData.address || 'Address not specified',
      project_type: requestData.project_type || 'interior',
      surfaces: requestData.surfaces || [],
      total_sqft: requestData.total_sqft || undefined,
      room_count: requestData.room_count || undefined,
      quote_amount: requestData.quote_amount,
      notes: requestData.notes || undefined,
      timeline: requestData.timeline || undefined,
      status: 'pending',
      created_at: now,
      company_id: requestData.company_id
    };

    // Store in memory (for development)
    quotes.set(quoteId, quote);
    
    // Also store in localStorage for client-side access
    const storageData = {
      ...quote,
      conversation_data: requestData.conversation_data
    };

    console.log('✅ Quote created successfully:', quote);
    console.log('📦 Storing quote in memory with ID:', quoteId);

    return NextResponse.json({
      success: true,
      quote_id: quoteId,
      quote: quote,
      storage_data: storageData // Include this for client-side storage
    });

  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "Failed to create quote", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve quotes (for development)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get('id');
    
    if (quoteId) {
      const quote = quotes.get(quoteId);
      if (quote) {
        console.log('📖 Retrieved quote from memory:', quoteId);
        return NextResponse.json(quote);
      } else {
        console.log('❌ Quote not found in memory:', quoteId);
        return NextResponse.json(
          { error: "Quote not found" },
          { status: 404 }
        );
      }
    }
    
    // Return all quotes if no ID specified
    const allQuotes = Array.from(quotes.values());
    console.log('📖 Retrieved all quotes from memory:', allQuotes.length);
    return NextResponse.json({ quotes: allQuotes });
    
  } catch (error) {
    console.error("Error retrieving quotes:", error);
    return NextResponse.json(
      { error: "Failed to retrieve quotes" },
      { status: 500 }
    );
  }
}