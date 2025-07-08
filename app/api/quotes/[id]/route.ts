import { NextRequest, NextResponse } from "next/server";
import { supabaseDb } from "@/lib/database/supabase-adapter";

// GET - Retrieve a specific quote
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
<<<<<<< HEAD
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
=======
    console.log(`🔍 API: Looking for quote with ID: ${params.id}`);
    
    // First try the new quote creation API
    const newQuoteResponse = await fetch(`${request.nextUrl.origin}/api/quotes/create-from-conversation?id=${params.id}`);
    if (newQuoteResponse.ok) {
      const quote = await newQuoteResponse.json();
      console.log(`✅ Found quote in new system:`, quote.quote_id);
      return NextResponse.json(quote);
    }
    
    // Fallback to old database system with enhanced company data
    const quote: any = await dbGet(`
      SELECT 
        q.*,
        c.company_name,
        c.phone as company_phone,
        c.email as company_email,
        c.logo_url as company_logo_url,
        cp.company_address,
        cp.license_number,
        cp.insurance_info,
        cp.company_website,
        cp.quote_header_text,
        cp.quote_footer_text,
        cp.payment_terms as default_payment_terms
      FROM quotes q
      LEFT JOIN companies c ON q.company_id = c.id
      LEFT JOIN company_profiles cp ON cp.user_id = c.id
      WHERE q.id = ? OR q.quote_id = ?
    `, [params.id, params.id]);
>>>>>>> clean-recovery-deploy

    console.log(`📖 API: Database query result:`, quote ? 'FOUND' : 'NOT FOUND');

    if (!quote) {
<<<<<<< HEAD
      console.log('❌ Quote not found for ID:', params.id);
=======
      console.log(`❌ Quote ${params.id} not found in either system`);
>>>>>>> clean-recovery-deploy
      return NextResponse.json(
        { error: "Quote not found", id: params.id },
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

    // Parse special_requests to get quote_details
    if (quote.special_requests && typeof quote.special_requests === 'string') {
      try {
        const specialRequests = JSON.parse(quote.special_requests);
        // If special_requests contains original_quote, use it as quote_details
        if (specialRequests.original_quote) {
          quote.quote_details = specialRequests.original_quote;
        } else {
          // Otherwise use the whole special_requests as quote_details
          quote.quote_details = specialRequests;
        }
      } catch (e) {
        console.error('Error parsing special_requests:', e);
        // Fallback: create quote_details from available data
        quote.quote_details = {
          walls_sqft: quote.walls_sqft || 0,
          ceilings_sqft: quote.ceilings_sqft || 0,
          trim_sqft: quote.trim_sqft || 0,
          paint_quality: quote.paint_quality || 'standard',
          total_cost: quote.final_price || quote.total_revenue || quote.quote_amount
        };
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