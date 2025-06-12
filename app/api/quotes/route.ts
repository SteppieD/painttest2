import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbRun, dbAll, createQuote, updateQuote } from "@/lib/database";
import { generateQuoteId } from "@/lib/utils";

// POST - Create a new quote
export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    
    // Handle both old format (direct data) and new format (nested structure)
    let quoteData, companyId, conversationHistory;
    
    if (requestData.quoteData && requestData.companyId) {
      // New nested format
      ({ quoteData, companyId, conversationHistory } = requestData);
    } else if (requestData.company_id || requestData.companyId) {
      // Old flat format - convert to new format
      companyId = requestData.company_id || requestData.companyId;
      conversationHistory = requestData.conversation_summary ? 
        (typeof requestData.conversation_summary === 'string' ? 
          JSON.parse(requestData.conversation_summary) : requestData.conversation_summary) : [];
      
      // Map flat structure to nested quoteData
      quoteData = {
        customerName: requestData.customer_name,
        customerEmail: requestData.customer_email,
        customerPhone: requestData.customer_phone,
        address: requestData.address,
        projectType: requestData.project_type,
        rooms: requestData.room_data ? (typeof requestData.room_data === 'string' ? JSON.parse(requestData.room_data) : requestData.room_data) : [],
        roomCount: requestData.room_count,
        paintQuality: requestData.paint_quality,
        prepWork: requestData.prep_work,
        timeEstimate: requestData.timeline,
        specialRequests: requestData.special_requests || requestData.notes,
        totalCost: requestData.total_cost,
        finalPrice: requestData.final_price || requestData.total_revenue,
        markupPercentage: requestData.markup_percentage,
        sqft: requestData.walls_sqft,
        breakdown: {
          materials: requestData.total_materials,
          labor: requestData.total_labor,
          markup: requestData.markup_amount
        },
        // Professional calculator fields
        dimensions: {
          wall_linear_feet: requestData.wall_linear_feet,
          ceiling_height: requestData.ceiling_height,
          ceiling_area: requestData.ceiling_area,
          number_of_doors: requestData.number_of_doors,
          number_of_windows: requestData.number_of_windows,
          floor_area: requestData.floor_area
        },
        rates: {
          wall_rate_per_sqft: requestData.wall_rate_per_sqft,
          ceiling_rate_per_sqft: requestData.ceiling_rate_per_sqft,
          primer_rate_per_sqft: requestData.primer_rate_per_sqft,
          door_rate_each: requestData.door_rate_each,
          window_rate_each: requestData.window_rate_each
        },
        materials: {
          primer_gallons: requestData.primer_gallons,
          wall_paint_gallons: requestData.wall_paint_gallons,
          ceiling_paint_gallons: requestData.ceiling_paint_gallons,
          trim_paint_gallons: requestData.trim_paint_gallons
        }
      };
    } else {
      return NextResponse.json(
        { error: "Quote data and company ID are required" },
        { status: 400 }
      );
    }

    if (!quoteData || !companyId) {
      return NextResponse.json(
        { error: "Quote data and company ID are required" },
        { status: 400 }
      );
    }

    // Generate unique quote ID
    const quoteId = generateQuoteId();

    // Prepare quote data for database
    const quote = {
      company_id: companyId,
      quote_id: quoteId,
      customer_name: quoteData.customerName || "Unknown Customer",
      customer_email: quoteData.customerEmail || null,
      customer_phone: quoteData.customerPhone || null,
      address: quoteData.address || null,
      project_type: quoteData.projectType || 'interior',
      rooms: JSON.stringify(quoteData.rooms || []),
      room_data: quoteData.rooms && quoteData.rooms.length > 0 ? JSON.stringify(quoteData.rooms) : null,
      room_count: quoteData.roomCount || (quoteData.rooms ? quoteData.rooms.length : null),
      paint_quality: quoteData.paintQuality || null,
      prep_work: quoteData.prepWork || null,
      timeline: quoteData.timeEstimate || quoteData.timeline || null,
      special_requests: quoteData.specialRequests || null,
      base_cost: quoteData.totalCost || 0,
      markup_percentage: quoteData.markupPercentage || 0,
      final_price: quoteData.finalPrice || quoteData.totalCost || 0,
      walls_sqft: quoteData.sqft || quoteData.dimensions?.wall_linear_feet * (quoteData.dimensions?.ceiling_height || 9) || 0,
      ceilings_sqft: quoteData.dimensions?.ceiling_area || 0,
      trim_sqft: 0,
      total_revenue: quoteData.finalPrice || quoteData.totalCost || 0,
      total_materials: quoteData.breakdown?.materials || 0,
      projected_labor: quoteData.breakdown?.labor || 0,
      conversation_summary: conversationHistory ? JSON.stringify(conversationHistory) : JSON.stringify([{quoteData}]),
      status: 'pending'
    };

    const result = createQuote(quote);

    console.log(`✅ Quote created: ${quoteId} for company ${companyId}`);

    return NextResponse.json({
      success: true,
      quoteId,
      quote: {
        ...quote,
        id: result.lastID
      }
    });

  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "Failed to create quote" },
      { status: 500 }
    );
  }
}

// GET - Retrieve quotes (with optional company filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company_id');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let whereClause = '1=1';
    let params: any[] = [];

    if (companyId) {
      whereClause += ' AND company_id = ?';
      params.push(companyId);
    }

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    const quotes = dbAll(`
      SELECT 
        q.*,
        c.company_name,
        c.access_code
      FROM quotes q
      LEFT JOIN companies c ON q.company_id = c.id
      WHERE ${whereClause}
      ORDER BY q.created_at DESC
      LIMIT ?
    `, [...params, limit]);

    // Map quotes to the format expected by the quotes page
    const mappedQuotes = (quotes as any[]).map((quote: any) => {
        // Parse conversation summary for breakdown
        let breakdown = null;
        if (quote && quote.conversation_summary && typeof quote.conversation_summary === 'string' && quote.conversation_summary.trim() !== '') {
          try {
            const messages = JSON.parse(quote.conversation_summary);
            if (Array.isArray(messages) && messages.length > 0) {
              const lastMessage = messages[messages.length - 1];
              if (lastMessage && lastMessage.quoteData) {
                breakdown = lastMessage.quoteData.breakdown;
              }
            }
          } catch (e) {
            console.error("Error parsing conversation summary:", e);
          }
        }

        // If no breakdown exists, create it from stored values
        if (!breakdown) {
          breakdown = {
            labor: quote.projected_labor || Math.round((quote.total_revenue || 0) * 0.45),
            materials: quote.total_materials || Math.round((quote.total_revenue || 0) * 0.35),
            prepWork: Math.round((quote.total_revenue || 0) * 0.05),
            markup: Math.round((quote.final_price || quote.total_revenue || 0) - (quote.total_revenue || 0))
          };
        }

        return {
          // Dashboard format fields
          id: quote.id,
          quote_id: quote.quote_id || `Q${quote.id}`,
          customer_name: quote.customer_name || 'Unknown Client',
          customer_email: quote.customer_email || '',
          customer_phone: quote.customer_phone || '',
          address: quote.address || 'No address provided',
          quote_amount: quote.final_price || quote.total_revenue || 0,
          final_price: quote.final_price || quote.total_revenue || 0,
          notes: quote.special_requests || '',
          status: quote.status || 'pending',
          created_at: quote.created_at,
          company_id: quote.company_id,
          company_name: quote.company_name,
          project_type: quote.project_type || 'interior',
          time_estimate: quote.timeline,
          
          // Additional fields for compatibility
          projectId: quote.id,
          clientName: quote.customer_name || 'Unknown Client',
          propertyAddress: quote.address || 'No address provided',
          projectType: quote.project_type || 'interior',
          baseCosts: breakdown,
          markupPercentage: quote.markup_percentage || 0,
          finalPrice: quote.final_price || quote.total_revenue || 0,
          createdAt: quote.created_at,
          updatedAt: quote.updated_at,
          
          // Additional fields for internal use
          breakdown,
          total_cost: quote.final_price || quote.total_revenue || 0,
          sqft: (quote.walls_sqft || 0) + (quote.ceilings_sqft || 0) + (quote.trim_sqft || 0),
          
          // Parse arrays consistently
          rooms: (quote && quote.rooms && typeof quote.rooms === 'string' && quote.rooms.trim() !== '') ? 
            (() => {
              try {
                return JSON.parse(quote.rooms);
              } catch (e) {
                console.error("Error parsing rooms:", e);
                return [];
              }
            })() : [],
          room_data: (quote && quote.room_data && typeof quote.room_data === 'string' && quote.room_data.trim() !== '') ? 
            (() => {
              try {
                return JSON.parse(quote.room_data);
              } catch (e) {
                console.error("Error parsing room_data:", e);
                return [];
              }
            })() : null,
          room_count: quote.room_count || null,
          conversation_summary: (quote && quote.conversation_summary && typeof quote.conversation_summary === 'string' && quote.conversation_summary.trim() !== '') ? 
            (() => {
              try {
                return JSON.parse(quote.conversation_summary);
              } catch (e) {
                console.error("Error parsing conversation summary:", e);
                return null;
              }
            })() : null
        };
      });

    // Return in the format expected by the quotes page
    return NextResponse.json({
      quotes: mappedQuotes
    });

  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}

// PUT - Update a quote
export async function PUT(request: NextRequest) {
  try {
    const { id, updates } = await request.json();

    if (!id || !updates) {
      return NextResponse.json(
        { error: "Quote ID and updates are required" },
        { status: 400 }
      );
    }

    const result = updateQuote(id, updates);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }

    console.log(`✅ Quote updated: ${id}`);

    return NextResponse.json({
      success: true,
      changes: result.changes
    });

  } catch (error) {
    console.error("Error updating quote:", error);
    return NextResponse.json(
      { error: "Failed to update quote" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a quote
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Quote ID is required" },
        { status: 400 }
      );
    }

    const result = dbRun("DELETE FROM quotes WHERE id = ?", [id]);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }

    console.log(`✅ Quote deleted: ${id}`);

    return NextResponse.json({
      success: true,
      changes: result.changes
    });

  } catch (error) {
    console.error("Error deleting quote:", error);
    return NextResponse.json(
      { error: "Failed to delete quote" },
      { status: 500 }
    );
  }
}