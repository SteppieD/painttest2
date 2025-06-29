/**
 * Comprehensive Database Types for Painting Contractor SaaS
 * 
 * This file defines all database entities with proper TypeScript types
 * and eliminates customer data confusion between companies/users/customers
 */

export interface DatabaseCompany {
  id: number;
  access_code: string;
  company_name: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  
  // Default pricing rates
  default_walls_rate: number;
  default_ceilings_rate: number;
  default_trim_rate: number;
  default_walls_paint_cost: number;
  default_ceilings_paint_cost: number;
  default_trim_paint_cost: number;
  
  // Business settings
  default_labor_percentage: number;
  default_paint_coverage: number;
  default_sundries_percentage: number;
  tax_rate: number;
  tax_on_materials_only: boolean;
  tax_label: string;
  
  // Trial/subscription settings
  quote_limit?: number;
  is_trial: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface DatabaseQuote {
  id: number;
  company_id: number;
  quote_id: string; // Unique identifier like "QUOTE-ABC123"
  
  // Customer information (NOT company info)
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  address?: string;
  
  // Project details
  project_type?: string;
  rooms?: string;
  paint_quality?: string;
  prep_work?: string;
  timeline?: string;
  special_requests?: string;
  
  // Measurements
  walls_sqft: number;
  ceilings_sqft: number;
  trim_sqft: number;
  
  // Pricing rates for this specific quote
  walls_rate: number;
  ceilings_rate: number;
  trim_rate: number;
  walls_paint_cost: number;
  ceilings_paint_cost: number;
  trim_paint_cost: number;
  
  // Cost breakdown
  total_revenue: number;
  total_materials: number;
  paint_cost: number;
  sundries_cost: number;
  sundries_percentage: number;
  projected_labor: number;
  labor_percentage: number;
  projected_profit: number;
  paint_coverage: number;
  tax_rate: number;
  tax_amount: number;
  subtotal: number;
  base_cost?: number;
  markup_percentage?: number;
  final_price?: number;
  
  // Additional data
  room_data?: string; // JSON string
  room_count?: number;
  status: 'pending' | 'approved' | 'completed' | 'cancelled' | 'draft';
  conversation_summary?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface DatabaseCustomer {
  // Separate customer entity to eliminate confusion
  id: number;
  company_id: number; // Which painting company this customer belongs to
  
  // Customer contact info
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  
  // Customer preferences and history
  preferred_contact_method?: 'email' | 'phone' | 'text';
  notes?: string;
  tags?: string; // JSON array of tags
  
  // Customer status
  status: 'prospect' | 'active' | 'completed' | 'inactive';
  total_quotes: number;
  total_revenue: number;
  
  // Timestamps
  first_quote_date?: string;
  last_contact_date?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabasePaintProduct {
  id: number;
  company_id: number; // Changed from user_id to company_id for clarity
  
  // Product details
  project_type: 'interior' | 'exterior';
  product_category: 'primer' | 'walls' | 'ceilings' | 'trim';
  supplier: string; // Brand name (Sherwin-Williams, Benjamin Moore, etc.)
  product_name: string;
  product_line?: string;
  sheen?: string;
  
  // Pricing and specs
  cost_per_gallon: number;
  coverage_per_gallon: number;
  display_order: number;
  is_active: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface DatabaseCompanyPreferences {
  id: number;
  company_id: number;
  
  // Setup and configuration
  setup_completed: boolean;
  default_markup: number;
  
  // Business preferences
  preferred_paint_brands?: string; // JSON array
  preferred_project_types?: string; // JSON array
  business_hours?: string; // JSON object
  service_areas?: string; // JSON array
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface DatabaseCompanyBranding {
  id: number;
  company_id: number;
  
  // Visual branding
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  
  // Company identity
  company_name: string;
  company_tagline?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Utility types for API responses
export interface CompanyWithStats extends DatabaseCompany {
  total_quotes: number;
  total_revenue: number;
  active_customers: number;
  pending_quotes: number;
}

export interface QuoteWithCustomer extends DatabaseQuote {
  customer?: DatabaseCustomer;
  company?: DatabaseCompany;
}

export interface CustomerWithStats extends DatabaseCustomer {
  quotes: DatabaseQuote[];
  recent_quote?: DatabaseQuote;
}

// Input types for API operations (what we accept from frontend)
export interface CreateCompanyInput {
  access_code: string;
  company_name: string;
  phone?: string;
  email?: string;
  
  // Optional defaults (will use system defaults if not provided)
  default_walls_rate?: number;
  default_ceilings_rate?: number;
  default_trim_rate?: number;
  default_markup?: number;
  is_trial?: boolean;
  quote_limit?: number;
}

export interface CreateQuoteInput {
  company_id: number;
  
  // Customer info (NOT company info)
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  address?: string;
  
  // Project details
  project_type?: string;
  walls_sqft: number;
  ceilings_sqft: number;
  trim_sqft: number;
  
  // Pricing (can override company defaults)
  walls_rate?: number;
  ceilings_rate?: number;
  trim_rate?: number;
  markup_percentage?: number;
  
  // Additional details
  special_requests?: string;
  room_data?: any; // Will be JSON.stringified
  status?: 'draft' | 'pending';
}

export interface UpdateQuoteInput {
  // All fields optional for updates
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  address?: string;
  
  walls_sqft?: number;
  ceilings_sqft?: number;
  trim_sqft?: number;
  
  walls_rate?: number;
  ceilings_rate?: number;
  trim_rate?: number;
  markup_percentage?: number;
  
  status?: 'pending' | 'approved' | 'completed' | 'cancelled' | 'draft';
  special_requests?: string;
}

export interface CreateCustomerInput {
  company_id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  preferred_contact_method?: 'email' | 'phone' | 'text';
  notes?: string;
  tags?: string[];
}

export interface UpdateCustomerInput {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  preferred_contact_method?: 'email' | 'phone' | 'text';
  notes?: string;
  tags?: string[];
  status?: 'prospect' | 'active' | 'completed' | 'inactive';
}

// Response types for API operations
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: string;
}

// Business logic types
export interface QuoteCalculation {
  // Base costs
  materials_cost: number;
  labor_cost: number;
  sundries_cost: number;
  base_cost: number;
  
  // Markup and final
  markup_amount: number;
  markup_percentage: number;
  tax_amount: number;
  final_price: number;
  
  // Profit analysis
  profit_margin: number;
  profit_amount: number;
  
  // Breakdown by surface
  walls_cost: number;
  ceilings_cost: number;
  trim_cost: number;
}

export interface ProjectDimensions {
  wall_linear_feet: number;
  ceiling_height: number;
  ceiling_area?: number;
  floor_area?: number;
  number_of_doors?: number;
  number_of_windows?: number;
}

// Validation status for data integrity
export interface DataValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  entity_type: 'company' | 'quote' | 'customer' | 'product';
  entity_id: number | string;
}

// Migration and consistency types
export interface DataInconsistency {
  type: 'missing_customer' | 'invalid_company_ref' | 'orphaned_quote' | 'duplicate_customer' | 'invalid_pricing';
  entity_type: 'company' | 'quote' | 'customer';
  entity_id: number;
  description: string;
  suggested_fix: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface MigrationResult {
  success: boolean;
  migrated_entities: number;
  fixed_inconsistencies: number;
  errors: string[];
  warnings: string[];
  data_backup_location?: string;
}

// Lock management for race conditions
export interface EntityLock {
  entity_type: 'quote' | 'customer' | 'company';
  entity_id: number | string;
  locked_by: string; // session ID or user ID
  locked_at: string;
  expires_at: string;
  operation: 'read' | 'write' | 'delete';
}

export interface LockResult {
  success: boolean;
  lock?: EntityLock;
  error?: string;
  retry_after?: number; // seconds
}