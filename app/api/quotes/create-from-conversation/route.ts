import { NextRequest, NextResponse } from "next/server";
import { QuoteCreationRequest, StandardQuote } from "@/types/quote";
import { generateQuoteId } from "@/lib/utils";
import { createQuote } from "@/lib/database";

export const dynamic = 'force-dynamic';

// Simple in-memory storage for development (fallback only)
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

    // Save to database using the proper createQuote function
    try {
      console.log('💾 Saving quote to database:', quote);
      const dbResult = await createQuote({
        quote_id: quoteId,
        customer_name: quote.customer_name,
        customer_email: quote.customer_email,
        customer_phone: quote.customer_phone,
        address: quote.address,
        project_type: quote.project_type,
        surfaces: JSON.stringify(quote.surfaces), // Store as JSON string
        total_sqft: quote.total_sqft,
        room_count: quote.room_count,
        quote_amount: quote.quote_amount,
        timeline: quote.timeline,
        notes: quote.notes,
        status: quote.status,
        company_id: quote.company_id,
        conversation_data: JSON.stringify(requestData.conversation_data || []) // Store conversation
      });
      
      console.log('✅ Quote saved to database with result:', dbResult);
      
    } catch (dbError) {
      console.error('❌ Database save failed, storing in memory as fallback:', dbError);
      // Fallback to memory storage if database fails
      quotes.set(quoteId, quote);
    }
    
    // Prepare storage data for response
    const storageData = {
      ...quote,
      conversation_data: requestData.conversation_data
    };

    console.log('✅ Quote created successfully with ID:', quoteId);

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

// GET endpoint to retrieve quotes (checks database first, then memory)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get('id');
    
    if (quoteId) {
      // First try database
      try {
        const { dbGet } = await import("@/lib/database");
        const dbQuote = await dbGet(`
          SELECT * FROM quotes 
          WHERE quote_id = ? OR id = ?
        `, [quoteId, quoteId]);
        
        if (dbQuote) {
          console.log('📖 Retrieved quote from database:', quoteId);
          // Parse JSON fields back to objects
          const parsedQuote = {
            ...dbQuote,
            surfaces: dbQuote.surfaces ? JSON.parse(dbQuote.surfaces) : [],
            conversation_data: dbQuote.conversation_data ? JSON.parse(dbQuote.conversation_data) : []
          };
          return NextResponse.json(parsedQuote);
        }
      } catch (dbError) {
        console.log('Database retrieval failed, checking memory:', dbError);
      }
      
      // Fallback to memory
      const quote = quotes.get(quoteId);
      if (quote) {
        console.log('📖 Retrieved quote from memory:', quoteId);
        return NextResponse.json(quote);
      } else {
        console.log('❌ Quote not found in database or memory:', quoteId);
        return NextResponse.json(
          { error: "Quote not found" },
          { status: 404 }
        );
      }
    }
    
    // Return all quotes if no ID specified (memory only for now)
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