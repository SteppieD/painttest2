import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbRun } from "@/lib/database";

// GET - Retrieve a specific quote
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quote = dbGet(`
      SELECT 
        q.*,
        c.company_name,
        c.phone as company_phone,
        c.email as company_email
      FROM quotes q
      LEFT JOIN companies c ON q.company_id = c.id
      WHERE q.id = ? OR q.quote_id = ?
    `, [params.id, params.id]);

    if (!quote) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }

    // Parse the breakdown if it's stored as JSON string
    if (quote.conversation_summary) {
      try {
        const messages = JSON.parse(quote.conversation_summary);
        // Extract breakdown from messages if available
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.quoteData) {
          quote.breakdown = lastMessage.quoteData.breakdown;
        }
      } catch (e) {
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

    // Ensure we have the necessary fields
    quote.total_cost = quote.final_price || quote.total_revenue || quote.quote_amount;
    quote.sqft = quote.walls_sqft + quote.ceilings_sqft + quote.trim_sqft;
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
    
    const result = dbRun(`
      UPDATE quotes 
      SET 
        markup_percentage = COALESCE(?, markup_percentage),
        final_price = COALESCE(?, final_price),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? OR quote_id = ?
    `, [
      updates.markup_percentage,
      updates.total_cost,
      params.id,
      params.id
    ]);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Quote updated successfully"
    });

  } catch (error) {
    console.error("Error updating quote:", error);
    return NextResponse.json(
      { error: "Failed to update quote" },
      { status: 500 }
    );
  }
}