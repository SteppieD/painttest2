export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { createQuote, getQuotesByCompany } from "@/lib/database-simple";
import { generateQuoteId } from "@/lib/utils";
import { subscriptionManager } from "@/lib/subscription-manager";

// Helper function to clean customer names during quote creation
const cleanCustomerName = (name: string) => {
  if (!name) return 'Customer';
  
  // Handle "It's for [Name]" pattern
  const itsForMatch = name.match(/it'?s\s+for\s+([^.]+)/i);
  if (itsForMatch) {
    return itsForMatch[1].trim();
  }
  
  // Handle "Customer: [Name]" pattern
  const customerMatch = name.match(/customer:\s*([^,]+)/i);
  if (customerMatch) {
    return customerMatch[1].trim();
  }
  
  // Handle "the customer's name is [Name]" or "customers name is [Name]" pattern
  const customerNameIsMatch = name.match(/(?:the\s+)?customers?\s+name\s+is\s+([A-Z][a-z]+)(?:\s+and|$)/i);
  if (customerNameIsMatch) {
    return customerNameIsMatch[1].trim();
  }
  
  // Handle "name is [Name]" pattern
  const nameIsMatch = name.match(/name\s+is\s+([A-Z][a-z]+)/i);
  if (nameIsMatch) {
    return nameIsMatch[1].trim();
  }
  
  // If it looks like raw conversation data, try to extract name
  if (name.length > 50 || name.includes('.') || name.includes('painting')) {
    // Look for name patterns in longer text
    const nameMatch = name.match(/(?:for|customer|client)?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
    if (nameMatch) {
      return nameMatch[1].trim();
    }
  }
  
  return name;
};

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
        customerName: cleanCustomerName(requestData.customer_name),
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

    // Check subscription limits using new subscription manager
    const quotePermission = await subscriptionManager.canCreateQuote(companyId);
    
    if (!quotePermission.allowed) {
      return NextResponse.json(
        { 
          error: "Quote limit reached",
          message: quotePermission.reason,
          quotesRemaining: quotePermission.quotesRemaining,
          planName: quotePermission.planName,
          upgradeRequired: true
        },
        { status: 403 }
      );
    }

    // Generate unique quote ID
    const quoteId = generateQuoteId();

    // Prepare quote data for database
    const quote = {
      company_id: companyId,
      quote_id: quoteId,
      customer_name: cleanCustomerName(quoteData.customerName) || "Unknown Customer",
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
      quote_amount: quoteData.quote_amount || quoteData.finalPrice || quoteData.totalCost || 0,
      walls_sqft: quoteData.sqft || quoteData.dimensions?.wall_linear_feet * (quoteData.dimensions?.ceiling_height || 9) || 0,
      ceilings_sqft: quoteData.dimensions?.ceiling_area || 0,
      trim_sqft: 0,
      total_revenue: quoteData.finalPrice || quoteData.totalCost || 0,
      total_materials: quoteData.breakdown?.materials || 0,
      projected_labor: quoteData.breakdown?.labor || 0,
      conversation_summary: conversationHistory ? JSON.stringify(conversationHistory) : JSON.stringify([{quoteData}]),
      status: 'pending'
    };

    // Save quote using Supabase database adapter
    console.log('💾 Saving quote via Supabase adapter:', {
      customer: quote.customer_name,
      amount: quote.total_revenue,
      company_id: quote.company_id
    });

    const result = await createQuote({
      company_id: quote.company_id,
      quote_id: quote.quote_id,
      customer_name: quote.customer_name,
      customer_email: quote.customer_email,
      customer_phone: quote.customer_phone,
      address: quote.address,
      project_type: quote.project_type,
      rooms: quote.rooms,
      room_data: quote.room_data,
      room_count: quote.room_count,
      paint_quality: quote.paint_quality,
      prep_work: quote.prep_work,
      timeline: quote.timeline,
      special_requests: quote.special_requests,
      base_cost: quote.base_cost,
      markup_percentage: quote.markup_percentage,
      final_price: quote.final_price,
      walls_sqft: quote.walls_sqft,
      ceilings_sqft: quote.ceilings_sqft,
      trim_sqft: quote.trim_sqft,
      total_revenue: quote.total_revenue,
      total_materials: quote.total_materials,
      projected_labor: quote.projected_labor,
      conversation_summary: quote.conversation_summary,
      status: quote.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    // Record quote creation in subscription system
    try {
      await subscriptionManager.recordQuoteCreation(companyId, quoteId);
    } catch (error) {
      console.error('Failed to record quote usage:', error);
      // Don't fail the quote creation if usage tracking fails
    }

    console.log(`✅ Quote created: ${quoteId} for company ${companyId}`);

    const responseData = {
      success: true,
      quoteId,
      quote: {
        ...quote,
        id: result?.lastID || result?.id || quoteId
      }
    };

    console.log('📤 Returning quote response:', responseData);

    return NextResponse.json(responseData);

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
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('company_id');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build safe WHERE clause with parameterized queries
    let whereConditions: string[] = [];
    let params: any[] = [];

    // Input validation and sanitization
    if (companyId) {
      const sanitizedCompanyId = parseInt(companyId);
      if (isNaN(sanitizedCompanyId) || sanitizedCompanyId <= 0) {
        return NextResponse.json({ error: "Invalid company ID" }, { status: 400 });
      }
      whereConditions.push('q.company_id = ?');
      params.push(sanitizedCompanyId);
    }

    if (status) {
      // Validate status against allowed values
      const allowedStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled', 'draft'];
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
      }
      whereConditions.push('q.status = ?');
      params.push(status);
    }

    // Validate and sanitize limit
    const sanitizedLimit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50'), 1), 100);

    // Construct safe WHERE clause
    const whereClause = whereConditions.length > 0 ? whereConditions.join(' AND ') : '1=1';

    // Retrieve quotes using Supabase database adapter
    console.log('🔍 Retrieving quotes via Supabase adapter for company:', companyId);
    
    let quotes = [];
    if (companyId) {
      quotes = await getQuotesByCompany(parseInt(companyId));
    } else {
      // If no company ID, we can't retrieve quotes (security measure)
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    // Filter by status if provided
    if (status && quotes) {
      quotes = quotes.filter((quote: any) => quote.status === status);
    }

    // Limit results
    if (quotes && quotes.length > sanitizedLimit) {
      quotes = quotes.slice(0, sanitizedLimit);
    }

    console.log('📊 Retrieved', quotes?.length || 0, 'quotes from database');

    // Ensure quotes is an array
    const quotesArray = Array.isArray(quotes) ? quotes : [];
    
    // Map quotes to the format expected by the quotes page
    const mappedQuotes = quotesArray.map((quote: any) => {
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
          quote_amount: quote.quote_amount || quote.final_price || quote.total_revenue || 0,
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

    // Import supabaseDb here to avoid circular dependency
    const { supabaseDb } = await import("@/lib/database/supabase-adapter");
    const result = await supabaseDb.updateQuote(id, updates);

    console.log(`✅ Quote updated: ${id}`);

    return NextResponse.json({
      success: true,
      quote: result
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

// DELETE - Delete a quote
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Quote ID is required" },
        { status: 400 }
      );
    }

    // Import supabaseDb here to avoid circular dependency
    const { supabaseDb } = await import("@/lib/database/supabase-adapter");
    const result = await supabaseDb.deleteQuote(id);

    console.log(`✅ Quote deleted: ${id}`);

    return NextResponse.json({
      success: true,
      message: "Quote deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting quote:", error);
    
    if (error.message && error.message.includes('not found')) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to delete quote" },
      { status: 500 }
    );
  }
}