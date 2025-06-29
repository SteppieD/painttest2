/**
 * Unified Quote Types
 * 
 * Standardized data structures for all quote creation interfaces
 * Replaces the multiple inconsistent formats across the codebase
 */

export interface CustomerInfo {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  preferredContact?: 'email' | 'phone' | 'text';
  notes?: string;
}

export interface ProjectDetails {
  type: 'interior' | 'exterior' | 'both';
  description?: string;
  timeline?: string;
  specialRequests?: string;
  prepWork?: string[];
  accessibility?: 'easy' | 'moderate' | 'difficult';
}

export interface RoomMeasurements {
  name: string;
  type: 'bedroom' | 'bathroom' | 'kitchen' | 'living' | 'dining' | 'hallway' | 'office' | 'other';
  
  // Measurements in square feet
  wallsSquareFootage: number;
  ceilingsSquareFootage: number;
  trimSquareFootage: number;
  
  // Additional details
  ceilingHeight?: number;
  doors?: number;
  windows?: number;
  notes?: string;
}

export interface ProjectMeasurements {
  totalWallsSqft: number;
  totalCeilingsSqft: number;
  totalTrimSqft: number;
  rooms: RoomMeasurements[];
}

export interface PaintProduct {
  id?: string;
  category: 'primer' | 'wall_paint' | 'ceiling_paint' | 'trim_paint';
  supplier: string; // Brand name
  productName: string;
  costPerGallon: number;
  coverage: number;
  sheen?: string;
  quality: 'good' | 'better' | 'best' | 'premium';
}

export interface ProductSelections {
  primer?: PaintProduct;
  wallPaint?: PaintProduct;
  ceilingPaint?: PaintProduct;
  trimPaint?: PaintProduct;
  
  // Fallback for simple quotes
  paintQuality?: 'good' | 'better' | 'best' | 'premium';
}

export interface PricingDetails {
  // Labor rates per sq ft
  wallsRate: number;
  ceilingsRate: number;
  trimRate: number;
  
  // Material costs
  totalMaterialCost: number;
  totalLaborCost: number;
  
  // Business calculations
  subtotal: number;
  markupPercentage: number;
  markupAmount: number;
  taxRate: number;
  taxAmount: number;
  finalPrice: number;
  
  // Detailed breakdown
  breakdown: {
    wallsCost: number;
    ceilingsCost: number;
    trimCost: number;
    sundries: number;
    profit: number;
  };
}

export interface QuoteMetadata {
  id?: number;
  quoteId: string; // Human-readable ID like "QUOTE-ABC123"
  companyId: number;
  customerId?: number;
  
  status: 'draft' | 'pending' | 'sent' | 'approved' | 'accepted' | 'rejected' | 'expired';
  
  // Creation info
  createdBy: 'ai' | 'manual' | 'import';
  aiProvider?: 'claude' | 'gpt4' | 'gemini';
  creationMethod: 'chat' | 'wizard' | 'quick' | 'import';
  
  // Conversation data (for AI-created quotes)
  conversationSummary?: string;
  messageHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  validUntil?: string;
  sentAt?: string;
  acceptedAt?: string;
}

/**
 * Main unified quote data structure
 * All quote creation interfaces should use this format
 */
export interface UnifiedQuoteData {
  customer: CustomerInfo;
  project: ProjectDetails;
  measurements: ProjectMeasurements;
  products: ProductSelections;
  pricing: PricingDetails;
  metadata: QuoteMetadata;
}

/**
 * Quote creation request (what we accept from frontend)
 */
export interface CreateQuoteRequest {
  companyId: number;
  
  // Customer info
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  
  // Project basics
  projectType?: 'interior' | 'exterior' | 'both';
  
  // Measurements (either simple or detailed)
  wallsSquareFootage?: number;
  ceilingsSquareFootage?: number;
  trimSquareFootage?: number;
  rooms?: RoomMeasurements[];
  
  // Paint selections
  paintQuality?: 'good' | 'better' | 'best' | 'premium';
  products?: ProductSelections;
  
  // Pricing overrides
  markupPercentage?: number;
  customRates?: {
    walls?: number;
    ceilings?: number;
    trim?: number;
  };
  
  // Additional details
  specialRequests?: string;
  timeline?: string;
  
  // Creation metadata
  creationMethod?: 'chat' | 'wizard' | 'quick' | 'import';
  aiProvider?: 'claude' | 'gpt4' | 'gemini';
  conversationSummary?: string;
  messageHistory?: any[];
}

/**
 * Quote update request (for editing existing quotes)
 */
export interface UpdateQuoteRequest {
  quoteId: string;
  
  // Optional updates to any field
  customer?: Partial<CustomerInfo>;
  project?: Partial<ProjectDetails>;
  measurements?: Partial<ProjectMeasurements>;
  products?: Partial<ProductSelections>;
  pricing?: Partial<PricingDetails>;
  
  status?: 'draft' | 'pending' | 'sent' | 'approved' | 'accepted' | 'rejected' | 'expired';
}

/**
 * AI quote processing context
 * Used by AI providers to understand conversation state
 */
export interface QuoteConversationContext {
  companyId: number;
  sessionId: string;
  
  // Current quote data being built
  partialQuote: Partial<UnifiedQuoteData>;
  
  // Conversation state
  currentStep: 'customer' | 'project' | 'measurements' | 'products' | 'pricing' | 'review';
  missingInfo: string[];
  
  // AI provider settings
  provider: 'claude' | 'gpt4' | 'gemini';
  temperature: number;
  maxTokens: number;
  
  // Company defaults for fallbacks
  companyDefaults: {
    paintRates: { walls: number; ceilings: number; trim: number };
    markupPercentage: number;
    preferredProducts: PaintProduct[];
  };
}

/**
 * Response format for all quote operations
 */
export interface QuoteOperationResponse {
  success: boolean;
  data?: UnifiedQuoteData;
  error?: string;
  warnings?: string[];
  
  // AI-specific responses
  needsMoreInfo?: boolean;
  suggestedNext?: string;
  conversationContinue?: boolean;
}

/**
 * Validation result for quote data
 */
export interface QuoteValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
  }>;
  completeness: {
    customer: number; // 0-100%
    project: number;
    measurements: number;
    products: number;
    pricing: number;
    overall: number;
  };
}

/**
 * Quote calculation request
 * Input for the unified calculation engine
 */
export interface QuoteCalculationRequest {
  measurements: ProjectMeasurements;
  products: ProductSelections;
  companyDefaults: {
    wallsRate: number;
    ceilingsRate: number;
    trimRate: number;
    markupPercentage: number;
    taxRate: number;
  };
  overrides?: {
    wallsRate?: number;
    ceilingsRate?: number;
    trimRate?: number;
    markupPercentage?: number;
  };
}

/**
 * Standardized error types for quote operations
 */
export type QuoteErrorType = 
  | 'validation_error'
  | 'calculation_error'
  | 'ai_provider_error'
  | 'database_error'
  | 'permission_error'
  | 'quote_not_found'
  | 'company_not_found'
  | 'customer_not_found';

export interface QuoteError {
  type: QuoteErrorType;
  message: string;
  details?: Record<string, any>;
  code?: string;
}

/**
 * Legacy format conversion helpers
 * For backwards compatibility with existing quote data
 */
export interface LegacyQuoteFormat {
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  address?: string;
  walls_sqft: number;
  ceilings_sqft: number;
  trim_sqft: number;
  final_price: number;
  total_revenue: number;
  // ... other legacy fields
}

/**
 * Helper type for AI provider interface
 */
export interface AIQuoteProvider {
  name: 'claude' | 'gpt4' | 'gemini';
  processMessage(
    message: string, 
    context: QuoteConversationContext
  ): Promise<{
    response: string;
    updatedQuote: Partial<UnifiedQuoteData>;
    nextStep?: string;
    isComplete: boolean;
  }>;
  extractQuoteData(conversationHistory: any[]): Partial<UnifiedQuoteData>;
  generateResponse(quoteData: Partial<UnifiedQuoteData>, missingInfo: string[]): string;
}