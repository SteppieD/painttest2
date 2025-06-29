import { NextRequest, NextResponse } from "next/server";
import { supabaseDb } from "@/lib/database/supabase-adapter";

// GET - Retrieve a specific quote
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Fetching quote by ID:', params.id);

    // Retrieve quote using Supabase database adapter
    let quote: any = null;
    
    try {
      // Try to get quote by ID first
      if (!isNaN(parseInt(params.id))) {
        quote = await supabaseDb.getQuoteById(parseInt(params.id));
      } else {
        // If not a number, try to get by quote_id
        quote = await supabaseDb.getQuoteByQuoteId(params.id);
      }
    } catch (error) {
      console.error('Error fetching quote from Supabase:', error);
      // Try the other method if first fails
      try {
        if (isNaN(parseInt(params.id))) {
          quote = await supabaseDb.getQuoteById(parseInt(params.id));
        } else {
          quote = await supabaseDb.getQuoteByQuoteId(params.id);
        }
      } catch (secondError) {
        console.error('Both quote lookup methods failed:', secondError);
      }
    }

    console.log('📊 Raw quote from database:', quote);

    if (!quote) {
      console.log('❌ Quote not found for ID:', params.id);
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }

    console.log('✅ Found quote:', { id: quote.id, customer: quote.customer_name });

    // Parse the breakdown if it's stored as JSON string
    if (quote && quote.conversation_summary && typeof quote.conversation_summary === 'string' && quote.conversation_summary.trim() !== '') {
      try {
        const messages = JSON.parse(quote.conversation_summary);
        // Extract breakdown from messages if available
        if (Array.isArray(messages) && messages.length > 0) {
          const lastMessage = messages[messages.length - 1];
          if (lastMessage && lastMessage.quoteData) {
            quote.breakdown = lastMessage.quoteData.breakdown;
          }
        }
      } catch (e) {
        console.error("Error parsing conversation summary:", e);
        // If parsing fails, create breakdown from stored values
      }
    }

    // If no breakdown exists, create it from the stored values
    if (!quote.breakdown) {
      quote.breakdown = {
        labor: quote.projected_labor || Math.round(quote.total_revenue * 0.45),
        materials: quote.total_materials || Math.round(quote.total_revenue * 0.35),
        prepWork: Math.round(quote.total_revenue * 0.05),
        markup: Math.round((quote.final_price || quote.total_revenue) - quote.total_revenue)
      };
    }

    // Parse payment terms if they exist
    if (quote.payment_terms && typeof quote.payment_terms === 'string') {
      try {
        quote.payment_terms = JSON.parse(quote.payment_terms);
      } catch (e) {
        console.error('Error parsing payment terms:', e);
        quote.payment_terms = null;
      }
    }

    // Ensure we have the necessary fields
    quote.total_cost = quote.final_price || quote.total_revenue || quote.quote_amount;
    quote.sqft = (quote.walls_sqft || 0) + (quote.ceilings_sqft || 0) + (quote.trim_sqft || 0);
    quote.paint_quality = quote.paint_quality || 'premium';
    quote.timeline = quote.timeline || 'standard';

    return NextResponse.json(quote);

  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json(
      { error: "Failed to fetch quote" },
      { status: 500 }
    );
  }
}

// PATCH - Update a quote (mainly for markup adjustments)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    console.log('🔄 Updating quote via API:', { id: params.id, updates: Object.keys(updates) });
    
    // Use Supabase adapter to update the quote
    const updatedQuote = await supabaseDb.updateQuote(params.id, updates);

    return NextResponse.json({
      success: true,
      message: "Quote updated successfully",
      quote: updatedQuote
    });

  } catch (error) {
    console.error("Error updating quote:", error);
    
    if (error.message && error.message.includes('not found')) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update quote" },
      { status: 500 }
    );
  }
}