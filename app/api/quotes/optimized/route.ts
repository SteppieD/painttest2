export const dynamic = "force-dynamic";
/**
 * Optimized Quotes API
 * 
 * High-performance quotes endpoint with optimized queries and caching
 * Replaces the existing N+1 query patterns with efficient JOINs
 */

import { NextRequest, NextResponse } from 'next/server';
import { withSecureApi, createApiResponse } from '@/lib/secure-api-wrapper';
import { performanceDb } from '@/lib/performance-database-adapter';
import { z } from 'zod';

const QuotesQuerySchema = z.object({
  company_id: z.coerce.number().positive(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
  page: z.coerce.number().min(1).optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['created_at', 'customer_name', 'final_price', 'status']).default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  includeBreakdown: z.coerce.boolean().default(true),
  includeCustomerInfo: z.coerce.boolean().default(true)
});

async function getOptimizedQuotes(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse and validate query parameters
    const queryData = Object.fromEntries(searchParams.entries());
    
    // Handle page-based pagination
    if (queryData.page && !queryData.offset) {
      const page = parseInt(queryData.page);
      const limit = parseInt(queryData.limit) || 50;
      queryData.offset = ((page - 1) * limit).toString();
    }

    const validatedData = QuotesQuerySchema.parse(queryData);
    const startTime = performance.now();

    // Get quotes with optimized query
    const quotesData = performanceDb.getQuotesWithDetails(validatedData.company_id, {
      limit: validatedData.limit,
      offset: validatedData.offset,
      status: validatedData.status,
      search: validatedData.search
    });

    // Transform quotes data for frontend compatibility
    const transformedQuotes = quotesData.quotes.map(quote => {
      const final_price = quote.final_price || quote.total_revenue || quote.quote_amount || 0;
      
      // Build breakdown object
      const breakdown = validatedData.includeBreakdown ? {
        materials: quote.materials_cost || Math.round(final_price * 0.35),
        labor: quote.labor_cost || Math.round(final_price * 0.45),
        prepWork: quote.prep_work_cost || Math.round(final_price * 0.05),
        markup: quote.markup_amount || Math.round(final_price * 0.15)
      } : undefined;

      // Parse room data if it exists
      let rooms = [];
      if (quote.room_data) {
        try {
          rooms = typeof quote.room_data === 'string' ? 
            JSON.parse(quote.room_data) : quote.room_data;
        } catch (e) {
          console.warn('Failed to parse room data for quote', quote.id);
        }
      }

      // Parse conversation summary if it exists
      let conversation_summary = null;
      if (quote.conversation_summary) {
        try {
          conversation_summary = typeof quote.conversation_summary === 'string' ? 
            JSON.parse(quote.conversation_summary) : quote.conversation_summary;
        } catch (e) {
          console.warn('Failed to parse conversation summary for quote', quote.id);
        }
      }

      return {
        // Core quote data
        id: quote.id,
        quote_id: quote.quote_id || `Q${quote.id}`,
        customer_name: quote.customer_name || 'Unknown Client',
        customer_email: quote.customer_email || '',
        customer_phone: quote.customer_phone || '',
        address: quote.address || 'No address provided',
        
        // Pricing
        quote_amount: final_price,
        final_price,
        total_revenue: quote.total_revenue || final_price,
        
        // Project details
        project_type: quote.project_type || 'interior',
        status: quote.status || 'pending',
        special_requests: quote.special_requests || '',
        timeline: quote.timeline,
        
        // Measurements
        walls_sqft: quote.walls_sqft || 0,
        ceilings_sqft: quote.ceilings_sqft || 0,
        trim_sqft: quote.trim_sqft || 0,
        sqft: (quote.walls_sqft || 0) + (quote.ceilings_sqft || 0) + (quote.trim_sqft || 0),
        
        // Calculated fields
        breakdown,
        rooms,
        conversation_summary,
        
        // Metadata
        created_at: quote.created_at,
        updated_at: quote.updated_at,
        company_id: quote.company_id,
        company_name: quote.company_name,
        
        // Customer info (if linked customer exists)
        ...(validatedData.includeCustomerInfo && quote.linked_customer_name ? {
          linkedCustomer: {
            name: quote.linked_customer_name,
            email: quote.linked_customer_email,
            phone: quote.linked_customer_phone
          }
        } : {}),
        
        // Legacy compatibility fields
        projectId: quote.id,
        clientName: quote.customer_name || 'Unknown Client',
        propertyAddress: quote.address || 'No address provided',
        baseCosts: breakdown,
        markupPercentage: quote.markup_percentage || 0,
        finalPrice: final_price,
        createdAt: quote.created_at,
        updatedAt: quote.updated_at,
        notes: quote.special_requests || '',
        time_estimate: quote.timeline
      };
    });

    // Apply sorting if needed (database already sorts by created_at DESC)
    if (validatedData.sortBy !== 'created_at' || validatedData.sortOrder !== 'desc') {
      transformedQuotes.sort((a, b) => {
        let aValue = a[validatedData.sortBy as keyof typeof a];
        let bValue = b[validatedData.sortBy as keyof typeof b];

        // Handle different data types
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = (bValue as string).toLowerCase();
        }

        if (validatedData.sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    const loadTime = performance.now() - startTime;

    return createApiResponse({
      quotes: transformedQuotes,
      pagination: {
        total: quotesData.total,
        page: quotesData.page,
        pages: quotesData.pages,
        limit: validatedData.limit,
        offset: validatedData.offset
      },
      performance: {
        loadTime: Math.round(loadTime * 100) / 100,
        queryCount: 1, // Single optimized query
        cacheUsed: loadTime < 50 // Assume cache if very fast
      },
      databaseMetrics: performanceDb.getPerformanceMetrics()
    }, {
      message: `Loaded ${transformedQuotes.length} quotes in ${Math.round(loadTime)}ms`
    });

  } catch (error) {
    console.error('Optimized quotes API error:', error);

    if (error instanceof z.ZodError) {
      return createApiResponse(
        { error: 'Invalid query parameters', details: error.errors },
        { success: false, status: 400 }
      );
    }

    return createApiResponse(
      { error: 'Failed to load quotes', details: error instanceof Error ? error.message : 'Unknown error' },
      { success: false, status: 500 }
    );
  }
}

/**
 * Create optimized quote with batch processing support
 */
async function createOptimizedQuote(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    
    // Support both single quote and batch creation
    const quotes = Array.isArray(body) ? body : [body];
    const startTime = performance.now();

    if (quotes.length === 1) {
      // Single quote creation (use existing logic)
      const { createQuote } = await import('@/lib/database');
      const result = await createQuote(quotes[0]);
      
      return createApiResponse({
        quote: result,
        performance: {
          loadTime: performance.now() - startTime,
          method: 'single'
        }
      }, {
        message: 'Quote created successfully'
      });
      
    } else {
      // Batch creation
      const results = performanceDb.batchCreateQuotes(quotes);
      
      return createApiResponse({
        quotesCreated: quotes.length,
        performance: {
          loadTime: performance.now() - startTime,
          method: 'batch'
        }
      }, {
        message: `${quotes.length} quotes created successfully`
      });
    }

  } catch (error) {
    console.error('Optimized quote creation error:', error);
    
    return createApiResponse(
      { error: 'Failed to create quote(s)', details: error instanceof Error ? error.message : 'Unknown error' },
      { success: false, status: 500 }
    );
  }
}

/**
 * Batch update quote statuses for admin operations
 */
async function batchUpdateQuotes(request: NextRequest): Promise<NextResponse> {
  try {
    const { updates } = await request.json();
    
    if (!Array.isArray(updates) || updates.length === 0) {
      return createApiResponse(
        { error: 'Updates array is required' },
        { success: false, status: 400 }
      );
    }

    const startTime = performance.now();
    performanceDb.batchUpdateQuoteStatuses(updates);

    return createApiResponse({
      updatedCount: updates.length,
      performance: {
        loadTime: performance.now() - startTime
      }
    }, {
      message: `${updates.length} quotes updated successfully`
    });

  } catch (error) {
    console.error('Batch update error:', error);
    
    return createApiResponse(
      { error: 'Failed to update quotes', details: error instanceof Error ? error.message : 'Unknown error' },
      { success: false, status: 500 }
    );
  }
}

// Export route handlers with security
export const GET = withSecureApi({
  requireAuth: false,
  allowedMethods: ['GET'],
  sanitizeInput: true,
  rateLimit: {
    max: 100,
    windowMs: 60000 // 1 minute
  }
})(getOptimizedQuotes);

export const POST = withSecureApi({
  requireAuth: false,
  allowedMethods: ['POST'],
  sanitizeInput: true,
  rateLimit: {
    max: 20,
    windowMs: 60000 // 1 minute
  }
})(createOptimizedQuote);

export const PUT = withSecureApi({
  requireAuth: false,
  allowedMethods: ['PUT'],
  sanitizeInput: true,
  rateLimit: {
    max: 50,
    windowMs: 60000 // 1 minute
  }
})(batchUpdateQuotes);