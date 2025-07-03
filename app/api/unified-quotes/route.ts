export const dynamic = "force-dynamic";
/**
 * Unified Quote API
 * 
 * Single endpoint that consolidates all quote creation functionality
 * Replaces the multiple inconsistent quote APIs
 */

import { NextRequest, NextResponse } from "next/server";
import { withSecureApi, createApiResponse } from "@/lib/secure-api-wrapper";
import { optimizedDb } from "@/lib/optimized-database-adapter";
import { UnifiedQuoteCalculator } from "@/lib/unified-quote-calculator";
import { generateQuoteId } from "@/lib/utils";
import { 
  UnifiedQuoteData, 
  CreateQuoteRequest, 
  UpdateQuoteRequest,
  QuoteOperationResponse,
  QuoteConversationContext,
  AIQuoteProvider
} from "@/lib/unified-quote-types";
import { z } from "zod";

// Validation schemas
const CreateQuoteSchema = z.object({
  companyId: z.number().positive(),
  customerName: z.string().min(1).max(255),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  address: z.string().optional(),
  projectType: z.enum(['interior', 'exterior', 'both']).optional(),
  
  // Simple measurements
  wallsSquareFootage: z.number().min(0).optional(),
  ceilingsSquareFootage: z.number().min(0).optional(),
  trimSquareFootage: z.number().min(0).optional(),
  
  // Or detailed room measurements
  rooms: z.array(z.object({
    name: z.string(),
    type: z.enum(['bedroom', 'bathroom', 'kitchen', 'living', 'dining', 'hallway', 'office', 'other']),
    wallsSquareFootage: z.number().min(0),
    ceilingsSquareFootage: z.number().min(0),
    trimSquareFootage: z.number().min(0)
  })).optional(),
  
  paintQuality: z.enum(['good', 'better', 'best', 'premium']).optional(),
  markupPercentage: z.number().min(0).max(100).optional(),
  specialRequests: z.string().optional(),
  timeline: z.string().optional(),
  creationMethod: z.enum(['chat', 'wizard', 'quick', 'import']).optional(),
  aiProvider: z.enum(['claude', 'gpt4', 'gemini']).optional(),
  conversationSummary: z.string().optional()
});

const UpdateQuoteSchema = z.object({
  quoteId: z.string(),
  status: z.enum(['draft', 'pending', 'sent', 'approved', 'accepted', 'rejected', 'expired']).optional(),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  address: z.string().optional(),
  specialRequests: z.string().optional()
});

const AIProcessSchema = z.object({
  message: z.string().min(1),
  sessionId: z.string(),
  provider: z.enum(['claude', 'gpt4', 'gemini']).default('claude'),
  companyId: z.number().positive()
});

/**
 * POST /api/unified-quotes - Create a new quote
 */
async function createQuote(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = CreateQuoteSchema.parse(body);
    
    // Get company information for defaults
    const companyData = await optimizedDb.getCompanyDashboard(validatedData.companyId);
    if (!companyData) {
      return createApiResponse(
        { error: 'Company not found' },
        { success: false, status: 404 }
      );
    }
    
    // Build measurements
    let measurements;
    if (validatedData.rooms && validatedData.rooms.length > 0) {
      // Use detailed room measurements
      measurements = {
        totalWallsSqft: validatedData.rooms.reduce((sum, room) => sum + room.wallsSquareFootage, 0),
        totalCeilingsSqft: validatedData.rooms.reduce((sum, room) => sum + room.ceilingsSquareFootage, 0),
        totalTrimSqft: validatedData.rooms.reduce((sum, room) => sum + room.trimSquareFootage, 0),
        rooms: validatedData.rooms
      };
    } else if (validatedData.wallsSquareFootage || validatedData.ceilingsSquareFootage || validatedData.trimSquareFootage) {
      // Use simple measurements
      measurements = {
        totalWallsSqft: validatedData.wallsSquareFootage || 0,
        totalCeilingsSqft: validatedData.ceilingsSquareFootage || 0,
        totalTrimSqft: validatedData.trimSquareFootage || 0,
        rooms: [{
          name: 'Main Area',
          type: 'other' as const,
          wallsSquareFootage: validatedData.wallsSquareFootage || 0,
          ceilingsSquareFootage: validatedData.ceilingsSquareFootage || 0,
          trimSquareFootage: validatedData.trimSquareFootage || 0
        }]
      };
    } else {
      return createApiResponse(
        { error: 'Measurements are required' },
        { success: false, status: 400 }
      );
    }
    
    // Validate measurements
    const measurementValidation = UnifiedQuoteCalculator.validateMeasurements(measurements);
    if (!measurementValidation.isValid) {
      return createApiResponse(
        { error: 'Invalid measurements', details: measurementValidation.errors },
        { success: false, status: 400 }
      );
    }
    
    // Build product selections
    const products = {
      paintQuality: validatedData.paintQuality || 'better'
    };
    
    // Calculate pricing using company defaults
    const companyDefaults = {
      wallsRate: companyData.company.default_walls_rate || 3.00,
      ceilingsRate: companyData.company.default_ceilings_rate || 2.00,
      trimRate: companyData.company.default_trim_rate || 5.00,
      markupPercentage: validatedData.markupPercentage || 45,
      taxRate: companyData.company.tax_rate || 0
    };
    
    const pricing = UnifiedQuoteCalculator.calculateQuote({
      measurements,
      products,
      companyDefaults
    });
    
    // Generate quote ID
    const quoteId = generateQuoteId();
    
    // Create unified quote data structure
    const unifiedQuote: UnifiedQuoteData = {
      customer: {
        name: validatedData.customerName,
        email: validatedData.customerEmail,
        phone: validatedData.customerPhone,
        address: validatedData.address
      },
      project: {
        type: validatedData.projectType || 'interior',
        specialRequests: validatedData.specialRequests,
        timeline: validatedData.timeline
      },
      measurements,
      products,
      pricing,
      metadata: {
        quoteId,
        companyId: validatedData.companyId,
        status: 'draft',
        createdBy: validatedData.aiProvider ? 'ai' : 'manual',
        aiProvider: validatedData.aiProvider,
        creationMethod: validatedData.creationMethod || 'manual',
        conversationSummary: validatedData.conversationSummary,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    
    // Save to database using the existing quote creation logic
    const legacyFormat = convertToLegacyFormat(unifiedQuote);
    
    // Create quote in database (using existing createQuote function)
    const { createQuote: dbCreateQuote } = await import('@/lib/database');
    const dbResult = await dbCreateQuote(legacyFormat);
    
    // Create or link customer
    if (validatedData.customerName && validatedData.customerName !== 'Unknown Customer') {
      // Import customer manager for proper customer handling
      const { CustomerManager } = await import('@/lib/customer-management');
      const { supabaseDb } = await import('@/lib/database/supabase-adapter');
      const customerManager = new CustomerManager({ 
        get: () => null, 
        run: () => {}, 
        all: () => [] 
      }); // Simplified for this context
      
      // Link quote to customer
      await customerManager.linkQuoteToCustomer(
        validatedData.companyId,
        dbResult.id,
        validatedData.customerName,
        validatedData.customerEmail,
        validatedData.customerPhone,
        validatedData.address
      );
    }
    
    return createApiResponse(unifiedQuote, {
      message: `Quote ${quoteId} created successfully`,
      status: 201
    });
    
  } catch (error) {
    console.error('Quote creation error:', error);
    
    if (error instanceof z.ZodError) {
      return createApiResponse(
        { error: 'Validation failed', details: error.errors },
        { success: false, status: 400 }
      );
    }
    
    return createApiResponse(
      { error: 'Failed to create quote', details: error instanceof Error ? error.message : 'Unknown error' },
      { success: false, status: 500 }
    );
  }
}

/**
 * PUT /api/unified-quotes - Update an existing quote
 */
async function updateQuote(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = UpdateQuoteSchema.parse(body);
    
    // Fetch existing quote from database
    const { dbGet } = await import('@/lib/database');
    const existingQuote = await dbGet('SELECT * FROM quotes WHERE quote_id = ?', [validatedData.quoteId]);
    
    if (!existingQuote) {
      return createApiResponse(
        { error: 'Quote not found' },
        { success: false, status: 404 }
      );
    }
    
    // Convert existing quote to unified format
    const unifiedQuote = convertFromLegacyFormat(existingQuote);
    
    // Apply updates
    if (validatedData.customerName) {
      unifiedQuote.customer.name = validatedData.customerName;
    }
    if (validatedData.customerEmail) {
      unifiedQuote.customer.email = validatedData.customerEmail;
    }
    if (validatedData.customerPhone) {
      unifiedQuote.customer.phone = validatedData.customerPhone;
    }
    if (validatedData.address) {
      unifiedQuote.customer.address = validatedData.address;
    }
    if (validatedData.specialRequests) {
      unifiedQuote.project.specialRequests = validatedData.specialRequests;
    }
    if (validatedData.status) {
      unifiedQuote.metadata.status = validatedData.status;
    }
    
    unifiedQuote.metadata.updatedAt = new Date().toISOString();
    
    // Convert back to legacy format for database update
    const legacyUpdate = convertToLegacyFormat(unifiedQuote);
    
    // Update database
    const { updateQuote: dbUpdateQuote } = await import('@/lib/database');
    await dbUpdateQuote(existingQuote.id, {
      customer_name: legacyUpdate.customer_name,
      customer_email: legacyUpdate.customer_email,
      customer_phone: legacyUpdate.customer_phone,
      address: legacyUpdate.address,
      special_requests: legacyUpdate.special_requests,
      status: legacyUpdate.status,
      updated_at: new Date().toISOString()
    });
    
    return createApiResponse(unifiedQuote, {
      message: `Quote ${validatedData.quoteId} updated successfully`
    });
    
  } catch (error) {
    console.error('Quote update error:', error);
    
    if (error instanceof z.ZodError) {
      return createApiResponse(
        { error: 'Validation failed', details: error.errors },
        { success: false, status: 400 }
      );
    }
    
    return createApiResponse(
      { error: 'Failed to update quote' },
      { success: false, status: 500 }
    );
  }
}

/**
 * POST /api/unified-quotes/ai-process - Process AI conversation
 */
async function processAIMessage(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = AIProcessSchema.parse(body);
    
    // Rate limiting to prevent excessive API calls
    const { rateLimiter } = await import('@/lib/rate-limiter');
    const clientKey = `ai_${validatedData.sessionId}_${validatedData.companyId}`;
    
    if (!rateLimiter.isAllowed(clientKey, 20, 60000)) { // 20 requests per minute
      return createApiResponse(
        { 
          error: 'Rate limit exceeded', 
          message: 'Too many AI requests. Please wait a moment and try again.',
          remaining: rateLimiter.getRemaining(clientKey, 20)
        },
        { success: false, status: 429 }
      );
    }
    
    // Import AI providers
    const { getAIProvider, conversationManager } = await import('@/lib/ai-quote-providers');
    
    // Get company data for defaults
    const companyData = await optimizedDb.getCompanyDashboard(validatedData.companyId);
    if (!companyData) {
      return createApiResponse(
        { error: 'Company not found' },
        { success: false, status: 404 }
      );
    }
    
    // Get or create conversation session
    let session = conversationManager.getSession(validatedData.sessionId, validatedData.companyId);
    
    // Update session with company defaults if not already set
    if (!session.companyDefaults.paintRates.walls) {
      session.companyDefaults = {
        paintRates: {
          walls: companyData.company.default_walls_rate || 3.00,
          ceilings: companyData.company.default_ceilings_rate || 2.00,
          trim: companyData.company.default_trim_rate || 5.00
        },
        markupPercentage: 45,
        preferredProducts: []
      };
    }
    
    // Get AI provider
    const aiProvider = getAIProvider(validatedData.provider);
    
    // Process the message
    const result = await aiProvider.processMessage(validatedData.message, session);
    
    // Update session with new quote data
    conversationManager.updateSession(validatedData.sessionId, {
      partialQuote: result.updatedQuote,
      currentStep: result.nextStep as any,
      missingInfo: [] // Will be calculated by session context
    });
    
    // If quote is complete, optionally auto-save it
    let savedQuote = null;
    if (result.isComplete && result.updatedQuote.customer?.name && result.updatedQuote.measurements?.totalWallsSqft) {
      try {
        // Calculate pricing
        const companyDefaults = {
          wallsRate: session.companyDefaults.paintRates.walls,
          ceilingsRate: session.companyDefaults.paintRates.ceilings,
          trimRate: session.companyDefaults.paintRates.trim,
          markupPercentage: session.companyDefaults.markupPercentage,
          taxRate: companyData.company.tax_rate || 0
        };
        
        const pricing = UnifiedQuoteCalculator.calculateQuote({
          measurements: result.updatedQuote.measurements!,
          products: result.updatedQuote.products || { paintQuality: 'better' },
          companyDefaults
        });
        
        // Create complete quote
        const quoteId = generateQuoteId();
        const completeQuote: UnifiedQuoteData = {
          customer: result.updatedQuote.customer!,
          project: result.updatedQuote.project || { type: 'interior' },
          measurements: result.updatedQuote.measurements!,
          products: result.updatedQuote.products || { paintQuality: 'better' },
          pricing,
          metadata: {
            quoteId,
            companyId: validatedData.companyId,
            status: 'draft',
            createdBy: 'ai',
            aiProvider: validatedData.provider,
            creationMethod: 'chat',
            conversationSummary: `AI conversation with ${validatedData.provider}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        };
        
        // Save to database
        const legacyFormat = convertToLegacyFormat(completeQuote);
        const { createQuote: dbCreateQuote } = await import('@/lib/database');
        const dbResult = await dbCreateQuote(legacyFormat);
        
        savedQuote = {
          ...completeQuote,
          metadata: { ...completeQuote.metadata, id: dbResult.lastID }
        };
        
        // Clear the session since quote is complete
        conversationManager.clearSession(validatedData.sessionId);
        
      } catch (saveError) {
        console.error('Failed to auto-save completed quote:', saveError);
        // Don't fail the AI response if save fails
      }
    }
    
    return createApiResponse({
      response: result.response,
      needsMoreInfo: !result.isComplete,
      suggestedNext: result.nextStep,
      conversationContinue: !result.isComplete,
      partialQuote: result.updatedQuote,
      savedQuote,
      isComplete: result.isComplete
    });
    
  } catch (error) {
    console.error('AI processing error:', error);
    
    if (error instanceof z.ZodError) {
      return createApiResponse(
        { error: 'Validation failed', details: error.errors },
        { success: false, status: 400 }
      );
    }
    
    return createApiResponse(
      { error: 'Failed to process AI message', details: error instanceof Error ? error.message : 'Unknown error' },
      { success: false, status: 500 }
    );
  }
}

/**
 * Convert unified quote format to legacy format for database compatibility
 */
function convertToLegacyFormat(quote: UnifiedQuoteData): any {
  return {
    company_id: quote.metadata.companyId,
    quote_id: quote.metadata.quoteId,
    customer_name: quote.customer.name,
    customer_email: quote.customer.email || null,
    customer_phone: quote.customer.phone || null,
    address: quote.customer.address || null,
    project_type: quote.project.type,
    special_requests: quote.project.specialRequests || null,
    walls_sqft: quote.measurements.totalWallsSqft,
    ceilings_sqft: quote.measurements.totalCeilingsSqft,
    trim_sqft: quote.measurements.totalTrimSqft,
    walls_rate: quote.pricing.wallsRate,
    ceilings_rate: quote.pricing.ceilingsRate,
    trim_rate: quote.pricing.trimRate,
    total_revenue: quote.pricing.finalPrice,
    total_materials: quote.pricing.totalMaterialCost,
    markup_percentage: quote.pricing.markupPercentage,
    final_price: quote.pricing.finalPrice,
    room_data: JSON.stringify(quote.measurements.rooms),
    conversation_summary: quote.metadata.conversationSummary || null,
    status: quote.metadata.status,
    created_at: quote.metadata.createdAt
  };
}

/**
 * Convert legacy quote format to unified format
 */
function convertFromLegacyFormat(legacyQuote: any): UnifiedQuoteData {
  // Parse room data if it exists
  let rooms: any[] = [];
  if (legacyQuote.room_data) {
    try {
      rooms = typeof legacyQuote.room_data === 'string' ? 
        JSON.parse(legacyQuote.room_data) : legacyQuote.room_data;
    } catch (e) {
      console.warn('Failed to parse room data:', e);
    }
  }
  
  // Parse conversation summary for additional context
  let conversationSummary = null;
  if (legacyQuote.conversation_summary) {
    try {
      conversationSummary = typeof legacyQuote.conversation_summary === 'string' ? 
        legacyQuote.conversation_summary : JSON.stringify(legacyQuote.conversation_summary);
    } catch (e) {
      console.warn('Failed to parse conversation summary:', e);
    }
  }
  
  return {
    customer: {
      name: legacyQuote.customer_name || 'Unknown Customer',
      email: legacyQuote.customer_email || undefined,
      phone: legacyQuote.customer_phone || undefined,
      address: legacyQuote.address || undefined
    },
    project: {
      type: legacyQuote.project_type || 'interior',
      specialRequests: legacyQuote.special_requests || undefined,
      timeline: legacyQuote.timeline || undefined
    },
    measurements: {
      totalWallsSqft: legacyQuote.walls_sqft || 0,
      totalCeilingsSqft: legacyQuote.ceilings_sqft || 0,
      totalTrimSqft: legacyQuote.trim_sqft || 0,
      rooms: rooms.length > 0 ? rooms : [{
        name: 'Main Area',
        type: 'other' as const,
        wallsSquareFootage: legacyQuote.walls_sqft || 0,
        ceilingsSquareFootage: legacyQuote.ceilings_sqft || 0,
        trimSquareFootage: legacyQuote.trim_sqft || 0
      }]
    },
    products: {
      paintQuality: 'better' // Default fallback
    },
    pricing: {
      wallsRate: legacyQuote.walls_rate || 3.00,
      ceilingsRate: legacyQuote.ceilings_rate || 2.00,
      trimRate: legacyQuote.trim_rate || 5.00,
      totalMaterialCost: legacyQuote.total_materials || 0,
      totalLaborCost: legacyQuote.projected_labor || 0,
      subtotal: (legacyQuote.total_materials || 0) + (legacyQuote.projected_labor || 0),
      markupPercentage: legacyQuote.markup_percentage || 45,
      markupAmount: ((legacyQuote.final_price || legacyQuote.total_revenue || 0) - 
                    ((legacyQuote.total_materials || 0) + (legacyQuote.projected_labor || 0))),
      taxRate: 0,
      taxAmount: 0,
      finalPrice: legacyQuote.final_price || legacyQuote.total_revenue || 0,
      breakdown: {
        wallsCost: (legacyQuote.walls_sqft || 0) * (legacyQuote.walls_rate || 3.00),
        ceilingsCost: (legacyQuote.ceilings_sqft || 0) * (legacyQuote.ceilings_rate || 2.00),
        trimCost: (legacyQuote.trim_sqft || 0) * (legacyQuote.trim_rate || 5.00),
        sundries: (legacyQuote.total_materials || 0) * 0.12,
        profit: ((legacyQuote.final_price || legacyQuote.total_revenue || 0) - 
                ((legacyQuote.total_materials || 0) + (legacyQuote.projected_labor || 0)))
      }
    },
    metadata: {
      id: legacyQuote.id,
      quoteId: legacyQuote.quote_id || `Q${legacyQuote.id}`,
      companyId: legacyQuote.company_id,
      status: legacyQuote.status || 'draft',
      createdBy: conversationSummary ? 'ai' : 'manual',
      creationMethod: 'import', // Since we're converting from legacy
      conversationSummary,
      createdAt: legacyQuote.created_at || new Date().toISOString(),
      updatedAt: legacyQuote.updated_at || new Date().toISOString()
    }
  };
}

// Export route handlers with proper security
export const POST = withSecureApi({
  requireAuth: false, // Temporarily disabled during development
  allowedMethods: ['POST'],
  sanitizeInput: true
})(async (request: NextRequest) => {
  const url = request.nextUrl;
  const action = url.searchParams.get('action');
  
  switch (action) {
    case 'ai-process':
      return processAIMessage(request);
    default:
      return createQuote(request);
  }
});

export const PUT = withSecureApi({
  requireAuth: false,
  allowedMethods: ['PUT'],
  sanitizeInput: true
})(updateQuote);