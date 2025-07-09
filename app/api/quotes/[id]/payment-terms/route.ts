import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbRun } from "@/lib/database";

// GET - Retrieve payment terms for a quote
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quote: any = dbGet(`
      SELECT payment_terms
      FROM quotes 
      WHERE id = ? OR quote_id = ?
    `, [params.id, params.id]);

    if (!quote) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }

    // Parse payment terms if they exist
    let paymentTerms = null;
    if (quote.payment_terms && typeof quote.payment_terms === 'string') {
      try {
        paymentTerms = JSON.parse(quote.payment_terms);
      } catch (e) {
        console.error("Error parsing payment terms:", e);
      }
    }

    return NextResponse.json({ payment_terms: paymentTerms });

  } catch (error) {
    console.error("Error fetching payment terms:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment terms" },
      { status: 500 }
    );
  }
}

// POST - Set payment terms for a quote
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { schedule, terms } = await request.json();
    
    // Validate input
    if (!terms || typeof terms !== 'string') {
      return NextResponse.json(
        { error: "Payment terms are required" },
        { status: 400 }
      );
    }

    const paymentTerms = {
      schedule: schedule || null,
      terms: terms,
      updated_at: new Date().toISOString()
    };

    // Update quote with payment terms
    const result = await dbRun(`
      UPDATE quotes 
      SET payment_terms = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? OR quote_id = ?
    `, [JSON.stringify(paymentTerms), params.id, params.id]);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment terms updated successfully",
      payment_terms: paymentTerms
    });

  } catch (error) {
    console.error("Error updating payment terms:", error);
    return NextResponse.json(
      { error: "Failed to update payment terms" },
      { status: 500 }
    );
  }
}

// DELETE - Remove payment terms from a quote
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await dbRun(`
      UPDATE quotes 
      SET payment_terms = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? OR quote_id = ?
    `, [params.id, params.id]);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment terms removed successfully"
    });

  } catch (error) {
    console.error("Error removing payment terms:", error);
    return NextResponse.json(
      { error: "Failed to remove payment terms" },
      { status: 500 }
    );
  }
}