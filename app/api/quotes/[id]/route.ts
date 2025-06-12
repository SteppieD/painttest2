import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbRun } from "@/lib/database";

// GET - Retrieve a specific quote
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quote: any = dbGet(`
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
    
    // Build update query dynamically based on provided fields
    const updateFields = [];
    const updateValues = [];
    
    // Basic quote info
    if (updates.customer_name !== undefined) {
      updateFields.push('customer_name = ?');
      updateValues.push(updates.customer_name);
    }
    if (updates.address !== undefined) {
      updateFields.push('address = ?');
      updateValues.push(updates.address);
    }
    if (updates.project_type !== undefined) {
      updateFields.push('project_type = ?');
      updateValues.push(updates.project_type);
    }
    
    // Dimensions
    if (updates.wall_linear_feet !== undefined) {
      updateFields.push('wall_linear_feet = ?');
      updateValues.push(updates.wall_linear_feet);
    }
    if (updates.ceiling_height !== undefined) {
      updateFields.push('ceiling_height = ?');
      updateValues.push(updates.ceiling_height);
    }
    if (updates.ceiling_area !== undefined) {
      updateFields.push('ceiling_area = ?');
      updateValues.push(updates.ceiling_area);
    }
    if (updates.number_of_doors !== undefined) {
      updateFields.push('number_of_doors = ?');
      updateValues.push(updates.number_of_doors);
    }
    if (updates.number_of_windows !== undefined) {
      updateFields.push('number_of_windows = ?');
      updateValues.push(updates.number_of_windows);
    }
    
    // Financial
    if (updates.markup_percentage !== undefined) {
      updateFields.push('markup_percentage = ?');
      updateValues.push(updates.markup_percentage);
    }
    if (updates.total_cost !== undefined) {
      updateFields.push('total_cost = ?');
      updateValues.push(updates.total_cost);
    }
    if (updates.final_price !== undefined) {
      updateFields.push('final_price = ?');
      updateValues.push(updates.final_price);
    }
    if (updates.quote_amount !== undefined) {
      updateFields.push('quote_amount = ?');
      updateValues.push(updates.quote_amount);
    }
    
    // Always update timestamp
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    
    // Add the ID parameters at the end
    updateValues.push(params.id, params.id);
    
    const result = dbRun(`
      UPDATE quotes 
      SET ${updateFields.join(', ')}
      WHERE id = ? OR quote_id = ?
    `, updateValues);

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