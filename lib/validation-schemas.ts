/**
 * Comprehensive Zod Validation Schemas
 * 
 * Provides strict validation for all API endpoints and data operations
 * Includes client-side and server-side validation patterns
 */

import { z } from 'zod';

// Common validation patterns
const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const accessCodeRegex = /^[A-Z0-9]{4,20}$/;
const quoteIdRegex = /^QUOTE-[A-Z0-9]{6,20}$/;
const colorHexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

// Base schemas for common fields
export const BaseEntitySchema = z.object({
  id: z.number().int().positive(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const TimestampSchema = z.object({
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Company schemas
export const CompanySchema = BaseEntitySchema.extend({
  access_code: z.string()
    .regex(accessCodeRegex, "Access code must be 4-20 uppercase alphanumeric characters")
    .min(4, "Access code must be at least 4 characters")
    .max(20, "Access code must be at most 20 characters"),
  
  company_name: z.string()
    .min(2, "Company name must be at least 2 characters")
    .max(255, "Company name must be at most 255 characters")
    .trim(),
  
  phone: z.string()
    .regex(phoneRegex, "Invalid phone number format")
    .optional()
    .or(z.literal('')),
  
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email must be at most 255 characters")
    .optional()
    .or(z.literal('')),
  
  logo_url: z.string()
    .url("Invalid logo URL")
    .max(500, "Logo URL must be at most 500 characters")
    .optional()
    .or(z.literal('')),
  
  // Default pricing rates with business validation
  default_walls_rate: z.number()
    .min(0.50, "Walls rate must be at least $0.50")
    .max(50.00, "Walls rate must be at most $50.00")
    .multipleOf(0.01, "Rate must be in cents"),
  
  default_ceilings_rate: z.number()
    .min(0.50, "Ceilings rate must be at least $0.50")
    .max(50.00, "Ceilings rate must be at most $50.00")
    .multipleOf(0.01, "Rate must be in cents"),
  
  default_trim_rate: z.number()
    .min(0.50, "Trim rate must be at least $0.50")
    .max(50.00, "Trim rate must be at most $50.00")
    .multipleOf(0.01, "Rate must be in cents"),
  
  default_walls_paint_cost: z.number()
    .min(10.00, "Paint cost must be at least $10.00")
    .max(200.00, "Paint cost must be at most $200.00")
    .multipleOf(0.01, "Cost must be in cents"),
  
  default_ceilings_paint_cost: z.number()
    .min(10.00, "Paint cost must be at least $10.00")
    .max(200.00, "Paint cost must be at most $200.00")
    .multipleOf(0.01, "Cost must be in cents"),
  
  default_trim_paint_cost: z.number()
    .min(10.00, "Paint cost must be at least $10.00")
    .max(200.00, "Paint cost must be at most $200.00")
    .multipleOf(0.01, "Cost must be in cents"),
  
  // Business settings validation
  default_labor_percentage: z.number()
    .int("Labor percentage must be a whole number")
    .min(10, "Labor percentage must be at least 10%")
    .max(80, "Labor percentage must be at most 80%"),
  
  default_paint_coverage: z.number()
    .int("Paint coverage must be a whole number")
    .min(200, "Paint coverage must be at least 200 sq ft per gallon")
    .max(500, "Paint coverage must be at most 500 sq ft per gallon"),
  
  default_sundries_percentage: z.number()
    .int("Sundries percentage must be a whole number")
    .min(5, "Sundries percentage must be at least 5%")
    .max(25, "Sundries percentage must be at most 25%"),
  
  tax_rate: z.number()
    .min(0, "Tax rate cannot be negative")
    .max(0.20, "Tax rate must be at most 20%")
    .multipleOf(0.0001, "Tax rate precision too high"),
  
  tax_on_materials_only: z.boolean(),
  
  tax_label: z.string()
    .min(1, "Tax label is required")
    .max(50, "Tax label must be at most 50 characters")
    .trim(),
  
  // Trial/subscription validation
  quote_limit: z.number()
    .int("Quote limit must be a whole number")
    .min(1, "Quote limit must be at least 1")
    .max(10000, "Quote limit must be at most 10,000")
    .optional()
    .nullable(),
  
  is_trial: z.boolean(),
});

// Quote schemas
export const QuoteSchema = BaseEntitySchema.extend({
  company_id: z.number().int().positive("Company ID must be a positive integer"),
  
  quote_id: z.string()
    .regex(quoteIdRegex, "Quote ID must follow format QUOTE-XXXXXX")
    .min(10, "Quote ID too short")
    .max(30, "Quote ID too long"),
  
  // Customer information validation
  customer_name: z.string()
    .min(2, "Customer name must be at least 2 characters")
    .max(255, "Customer name must be at most 255 characters")
    .trim()
    .refine(name => !/^\s*$/.test(name), "Customer name cannot be empty or whitespace only"),
  
  customer_email: z.string()
    .email("Invalid customer email address")
    .max(255, "Customer email must be at most 255 characters")
    .optional()
    .or(z.literal('')),
  
  customer_phone: z.string()
    .regex(phoneRegex, "Invalid customer phone number format")
    .optional()
    .or(z.literal('')),
  
  address: z.string()
    .max(1000, "Address must be at most 1000 characters")
    .optional()
    .or(z.literal('')),
  
  // Project details
  project_type: z.enum(['interior', 'exterior', 'both'])
    .optional()
    .or(z.literal('')),
  
  rooms: z.string()
    .max(1000, "Rooms description must be at most 1000 characters")
    .optional()
    .or(z.literal('')),
  
  paint_quality: z.enum(['good', 'better', 'best', 'premium'])
    .optional()
    .or(z.literal('')),
  
  prep_work: z.string()
    .max(1000, "Prep work description must be at most 1000 characters")
    .optional()
    .or(z.literal('')),
  
  timeline: z.string()
    .max(100, "Timeline must be at most 100 characters")
    .optional()
    .or(z.literal('')),
  
  special_requests: z.string()
    .max(2000, "Special requests must be at most 2000 characters")
    .optional()
    .or(z.literal('')),
  
  // Measurements validation
  walls_sqft: z.number()
    .min(0, "Wall square footage cannot be negative")
    .max(50000, "Wall square footage must be at most 50,000")
    .multipleOf(0.01, "Square footage must be precise to nearest 0.01"),
  
  ceilings_sqft: z.number()
    .min(0, "Ceiling square footage cannot be negative")
    .max(50000, "Ceiling square footage must be at most 50,000")
    .multipleOf(0.01, "Square footage must be precise to nearest 0.01"),
  
  trim_sqft: z.number()
    .min(0, "Trim square footage cannot be negative")
    .max(10000, "Trim square footage must be at most 10,000")
    .multipleOf(0.01, "Square footage must be precise to nearest 0.01"),
  
  // Pricing rates (same validation as company defaults)
  walls_rate: z.number()
    .min(0.50, "Walls rate must be at least $0.50")
    .max(50.00, "Walls rate must be at most $50.00")
    .multipleOf(0.01, "Rate must be in cents"),
  
  ceilings_rate: z.number()
    .min(0.50, "Ceilings rate must be at least $0.50")
    .max(50.00, "Ceilings rate must be at most $50.00")
    .multipleOf(0.01, "Rate must be in cents"),
  
  trim_rate: z.number()
    .min(0.50, "Trim rate must be at least $0.50")
    .max(50.00, "Trim rate must be at most $50.00")
    .multipleOf(0.01, "Rate must be in cents"),
  
  walls_paint_cost: z.number()
    .min(10.00, "Paint cost must be at least $10.00")
    .max(200.00, "Paint cost must be at most $200.00")
    .multipleOf(0.01, "Cost must be in cents"),
  
  ceilings_paint_cost: z.number()
    .min(10.00, "Paint cost must be at least $10.00")
    .max(200.00, "Paint cost must be at most $200.00")
    .multipleOf(0.01, "Cost must be in cents"),
  
  trim_paint_cost: z.number()
    .min(10.00, "Paint cost must be at least $10.00")
    .max(200.00, "Paint cost must be at most $200.00")
    .multipleOf(0.01, "Cost must be in cents"),
  
  // Financial calculations
  total_revenue: z.number()
    .min(0, "Total revenue cannot be negative")
    .max(1000000, "Total revenue must be at most $1,000,000")
    .multipleOf(0.01, "Revenue must be in cents"),
  
  total_materials: z.number()
    .min(0, "Total materials cannot be negative")
    .max(500000, "Total materials must be at most $500,000")
    .multipleOf(0.01, "Materials cost must be in cents"),
  
  paint_cost: z.number()
    .min(0, "Paint cost cannot be negative")
    .max(100000, "Paint cost must be at most $100,000")
    .multipleOf(0.01, "Paint cost must be in cents"),
  
  sundries_cost: z.number()
    .min(0, "Sundries cost cannot be negative")
    .max(50000, "Sundries cost must be at most $50,000")
    .multipleOf(0.01, "Sundries cost must be in cents"),
  
  sundries_percentage: z.number()
    .int("Sundries percentage must be a whole number")
    .min(0, "Sundries percentage cannot be negative")
    .max(50, "Sundries percentage must be at most 50%"),
  
  projected_labor: z.number()
    .min(0, "Projected labor cannot be negative")
    .max(500000, "Projected labor must be at most $500,000")
    .multipleOf(0.01, "Labor cost must be in cents"),
  
  labor_percentage: z.number()
    .int("Labor percentage must be a whole number")
    .min(0, "Labor percentage cannot be negative")
    .max(90, "Labor percentage must be at most 90%"),
  
  projected_profit: z.number()
    .min(-100000, "Projected profit must be at least -$100,000") // Allow losses
    .max(500000, "Projected profit must be at most $500,000")
    .multipleOf(0.01, "Profit must be in cents"),
  
  paint_coverage: z.number()
    .int("Paint coverage must be a whole number")
    .min(200, "Paint coverage must be at least 200 sq ft per gallon")
    .max(500, "Paint coverage must be at most 500 sq ft per gallon"),
  
  tax_rate: z.number()
    .min(0, "Tax rate cannot be negative")
    .max(0.20, "Tax rate must be at most 20%")
    .multipleOf(0.0001, "Tax rate precision too high"),
  
  tax_amount: z.number()
    .min(0, "Tax amount cannot be negative")
    .max(100000, "Tax amount must be at most $100,000")
    .multipleOf(0.01, "Tax amount must be in cents"),
  
  subtotal: z.number()
    .min(0, "Subtotal cannot be negative")
    .max(1000000, "Subtotal must be at most $1,000,000")
    .multipleOf(0.01, "Subtotal must be in cents"),
  
  base_cost: z.number()
    .min(0, "Base cost cannot be negative")
    .max(1000000, "Base cost must be at most $1,000,000")
    .multipleOf(0.01, "Base cost must be in cents")
    .optional()
    .nullable(),
  
  markup_percentage: z.number()
    .min(0, "Markup percentage cannot be negative")
    .max(500, "Markup percentage must be at most 500%")
    .multipleOf(0.01, "Markup percentage precision too high")
    .optional()
    .nullable(),
  
  final_price: z.number()
    .min(0, "Final price cannot be negative")
    .max(1000000, "Final price must be at most $1,000,000")
    .multipleOf(0.01, "Final price must be in cents")
    .optional()
    .nullable(),
  
  // Additional data
  room_data: z.string()
    .max(10000, "Room data JSON must be at most 10,000 characters")
    .optional()
    .nullable(),
  
  room_count: z.number()
    .int("Room count must be a whole number")
    .min(0, "Room count cannot be negative")
    .max(100, "Room count must be at most 100")
    .optional()
    .nullable(),
  
  status: z.enum(['pending', 'approved', 'completed', 'cancelled', 'draft']),
  
  conversation_summary: z.string()
    .max(5000, "Conversation summary must be at most 5,000 characters")
    .optional()
    .nullable(),
});

// Customer schemas
export const CustomerSchema = BaseEntitySchema.extend({
  company_id: z.number().int().positive("Company ID must be a positive integer"),
  
  name: z.string()
    .min(2, "Customer name must be at least 2 characters")
    .max(255, "Customer name must be at most 255 characters")
    .trim()
    .refine(name => !/^\s*$/.test(name), "Customer name cannot be empty or whitespace only"),
  
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email must be at most 255 characters")
    .optional()
    .or(z.literal('')),
  
  phone: z.string()
    .regex(phoneRegex, "Invalid phone number format")
    .optional()
    .or(z.literal('')),
  
  address: z.string()
    .max(1000, "Address must be at most 1000 characters")
    .optional()
    .or(z.literal('')),
  
  preferred_contact_method: z.enum(['email', 'phone', 'text'])
    .optional(),
  
  notes: z.string()
    .max(2000, "Notes must be at most 2000 characters")
    .optional()
    .or(z.literal('')),
  
  tags: z.string()
    .max(1000, "Tags JSON must be at most 1000 characters")
    .optional()
    .or(z.literal('')),
  
  status: z.enum(['prospect', 'active', 'completed', 'inactive']),
  
  total_quotes: z.number()
    .int("Total quotes must be a whole number")
    .min(0, "Total quotes cannot be negative"),
  
  total_revenue: z.number()
    .min(0, "Total revenue cannot be negative")
    .max(10000000, "Total revenue must be at most $10,000,000")
    .multipleOf(0.01, "Revenue must be in cents"),
  
  first_quote_date: z.string()
    .datetime()
    .optional()
    .nullable(),
  
  last_contact_date: z.string()
    .datetime()
    .optional()
    .nullable(),
});

// Paint Product schemas
export const PaintProductSchema = BaseEntitySchema.extend({
  company_id: z.number().int().positive("Company ID must be a positive integer"),
  
  project_type: z.enum(['interior', 'exterior']),
  
  product_category: z.enum(['primer', 'walls', 'ceilings', 'trim']),
  
  supplier: z.string()
    .min(2, "Supplier name must be at least 2 characters")
    .max(100, "Supplier name must be at most 100 characters")
    .trim(),
  
  product_name: z.string()
    .min(2, "Product name must be at least 2 characters")
    .max(255, "Product name must be at most 255 characters")
    .trim(),
  
  product_line: z.string()
    .max(100, "Product line must be at most 100 characters")
    .optional()
    .or(z.literal('')),
  
  sheen: z.enum(['flat', 'eggshell', 'satin', 'semi-gloss', 'gloss'])
    .optional()
    .or(z.literal('')),
  
  cost_per_gallon: z.number()
    .min(5.00, "Cost per gallon must be at least $5.00")
    .max(500.00, "Cost per gallon must be at most $500.00")
    .multipleOf(0.01, "Cost must be in cents"),
  
  coverage_per_gallon: z.number()
    .int("Coverage per gallon must be a whole number")
    .min(200, "Coverage must be at least 200 sq ft per gallon")
    .max(500, "Coverage must be at most 500 sq ft per gallon"),
  
  display_order: z.number()
    .int("Display order must be a whole number")
    .min(1, "Display order must be at least 1")
    .max(100, "Display order must be at most 100"),
  
  is_active: z.boolean(),
});

// Company Preferences schemas
export const CompanyPreferencesSchema = BaseEntitySchema.extend({
  company_id: z.number().int().positive("Company ID must be a positive integer"),
  
  setup_completed: z.boolean(),
  
  default_markup: z.number()
    .min(0, "Default markup cannot be negative")
    .max(500, "Default markup must be at most 500%")
    .multipleOf(0.01, "Markup precision too high"),
  
  preferred_paint_brands: z.string()
    .max(1000, "Preferred brands JSON must be at most 1000 characters")
    .optional()
    .or(z.literal('')),
  
  preferred_project_types: z.string()
    .max(500, "Preferred project types JSON must be at most 500 characters")
    .optional()
    .or(z.literal('')),
  
  business_hours: z.string()
    .max(1000, "Business hours JSON must be at most 1000 characters")
    .optional()
    .or(z.literal('')),
  
  service_areas: z.string()
    .max(2000, "Service areas JSON must be at most 2000 characters")
    .optional()
    .or(z.literal('')),
});

// Company Branding schemas
export const CompanyBrandingSchema = BaseEntitySchema.extend({
  company_id: z.number().int().positive("Company ID must be a positive integer"),
  
  logo_url: z.string()
    .url("Invalid logo URL")
    .max(500, "Logo URL must be at most 500 characters")
    .optional()
    .or(z.literal('')),
  
  primary_color: z.string()
    .regex(colorHexRegex, "Primary color must be a valid hex color"),
  
  secondary_color: z.string()
    .regex(colorHexRegex, "Secondary color must be a valid hex color"),
  
  accent_color: z.string()
    .regex(colorHexRegex, "Accent color must be a valid hex color"),
  
  company_name: z.string()
    .min(2, "Company name must be at least 2 characters")
    .max(255, "Company name must be at most 255 characters")
    .trim(),
  
  company_tagline: z.string()
    .max(255, "Company tagline must be at most 255 characters")
    .optional()
    .or(z.literal('')),
});

// Input validation schemas (for API requests)
export const CreateCompanyInputSchema = z.object({
  access_code: z.string()
    .regex(accessCodeRegex, "Access code must be 4-20 uppercase alphanumeric characters")
    .min(4, "Access code must be at least 4 characters")
    .max(20, "Access code must be at most 20 characters"),
  
  company_name: z.string()
    .min(2, "Company name must be at least 2 characters")
    .max(255, "Company name must be at most 255 characters")
    .trim(),
  
  phone: z.string()
    .regex(phoneRegex, "Invalid phone number format")
    .optional()
    .or(z.literal('')),
  
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email must be at most 255 characters")
    .optional()
    .or(z.literal('')),
  
  default_walls_rate: z.number()
    .min(0.50, "Walls rate must be at least $0.50")
    .max(50.00, "Walls rate must be at most $50.00")
    .multipleOf(0.01, "Rate must be in cents")
    .optional(),
  
  default_ceilings_rate: z.number()
    .min(0.50, "Ceilings rate must be at least $0.50")
    .max(50.00, "Ceilings rate must be at most $50.00")
    .multipleOf(0.01, "Rate must be in cents")
    .optional(),
  
  default_trim_rate: z.number()
    .min(0.50, "Trim rate must be at least $0.50")
    .max(50.00, "Trim rate must be at most $50.00")
    .multipleOf(0.01, "Rate must be in cents")
    .optional(),
  
  default_markup: z.number()
    .min(0, "Default markup cannot be negative")
    .max(500, "Default markup must be at most 500%")
    .multipleOf(0.01, "Markup precision too high")
    .optional(),
  
  is_trial: z.boolean().optional(),
  
  quote_limit: z.number()
    .int("Quote limit must be a whole number")
    .min(1, "Quote limit must be at least 1")
    .max(10000, "Quote limit must be at most 10,000")
    .optional(),
});

export const CreateQuoteInputSchema = z.object({
  company_id: z.number().int().positive("Company ID must be a positive integer"),
  
  customer_name: z.string()
    .min(2, "Customer name must be at least 2 characters")
    .max(255, "Customer name must be at most 255 characters")
    .trim()
    .refine(name => !/^\s*$/.test(name), "Customer name cannot be empty or whitespace only"),
  
  customer_email: z.string()
    .email("Invalid customer email address")
    .max(255, "Customer email must be at most 255 characters")
    .optional()
    .or(z.literal('')),
  
  customer_phone: z.string()
    .regex(phoneRegex, "Invalid customer phone number format")
    .optional()
    .or(z.literal('')),
  
  address: z.string()
    .max(1000, "Address must be at most 1000 characters")
    .optional()
    .or(z.literal('')),
  
  project_type: z.enum(['interior', 'exterior', 'both'])
    .optional(),
  
  walls_sqft: z.number()
    .min(0, "Wall square footage cannot be negative")
    .max(50000, "Wall square footage must be at most 50,000")
    .multipleOf(0.01, "Square footage must be precise to nearest 0.01"),
  
  ceilings_sqft: z.number()
    .min(0, "Ceiling square footage cannot be negative")
    .max(50000, "Ceiling square footage must be at most 50,000")
    .multipleOf(0.01, "Square footage must be precise to nearest 0.01"),
  
  trim_sqft: z.number()
    .min(0, "Trim square footage cannot be negative")
    .max(10000, "Trim square footage must be at most 10,000")
    .multipleOf(0.01, "Square footage must be precise to nearest 0.01"),
  
  walls_rate: z.number()
    .min(0.50, "Walls rate must be at least $0.50")
    .max(50.00, "Walls rate must be at most $50.00")
    .multipleOf(0.01, "Rate must be in cents")
    .optional(),
  
  ceilings_rate: z.number()
    .min(0.50, "Ceilings rate must be at least $0.50")
    .max(50.00, "Ceilings rate must be at most $50.00")
    .multipleOf(0.01, "Rate must be in cents")
    .optional(),
  
  trim_rate: z.number()
    .min(0.50, "Trim rate must be at least $0.50")
    .max(50.00, "Trim rate must be at most $50.00")
    .multipleOf(0.01, "Rate must be in cents")
    .optional(),
  
  markup_percentage: z.number()
    .min(0, "Markup percentage cannot be negative")
    .max(500, "Markup percentage must be at most 500%")
    .multipleOf(0.01, "Markup percentage precision too high")
    .optional(),
  
  special_requests: z.string()
    .max(2000, "Special requests must be at most 2000 characters")
    .optional()
    .or(z.literal('')),
  
  room_data: z.any().optional(), // Will be JSON.stringified
  
  status: z.enum(['draft', 'pending']).optional(),
});

export const UpdateQuoteInputSchema = CreateQuoteInputSchema.partial().omit({ company_id: true });

export const CreateCustomerInputSchema = z.object({
  company_id: z.number().int().positive("Company ID must be a positive integer"),
  
  name: z.string()
    .min(2, "Customer name must be at least 2 characters")
    .max(255, "Customer name must be at most 255 characters")
    .trim()
    .refine(name => !/^\s*$/.test(name), "Customer name cannot be empty or whitespace only"),
  
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email must be at most 255 characters")
    .optional()
    .or(z.literal('')),
  
  phone: z.string()
    .regex(phoneRegex, "Invalid phone number format")
    .optional()
    .or(z.literal('')),
  
  address: z.string()
    .max(1000, "Address must be at most 1000 characters")
    .optional()
    .or(z.literal('')),
  
  preferred_contact_method: z.enum(['email', 'phone', 'text']).optional(),
  
  notes: z.string()
    .max(2000, "Notes must be at most 2000 characters")
    .optional()
    .or(z.literal('')),
  
  tags: z.array(z.string().max(50, "Tag must be at most 50 characters")).optional(),
});

export const UpdateCustomerInputSchema = CreateCustomerInputSchema.partial().omit({ company_id: true }).extend({
  status: z.enum(['prospect', 'active', 'completed', 'inactive']).optional(),
});

// API response schemas
export const ApiResponseSchema = <T extends z.ZodSchema>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

export const PaginatedResponseSchema = <T extends z.ZodSchema>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: z.array(dataSchema),
    pagination: z.object({
      page: z.number().int().positive(),
      limit: z.number().int().positive(),
      total: z.number().int().min(0),
      pages: z.number().int().min(0),
    }),
    error: z.string().optional(),
  });

// Query parameter schemas for API endpoints
export const GetQuotesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  status: z.enum(['pending', 'approved', 'completed', 'cancelled', 'draft']).optional(),
  customer_name: z.string().max(255).optional(),
  date_from: z.string().date().optional(),
  date_to: z.string().date().optional(),
  min_amount: z.coerce.number().min(0).optional(),
  max_amount: z.coerce.number().min(0).optional(),
});

export const GetCustomersQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  status: z.enum(['prospect', 'active', 'completed', 'inactive']).optional(),
  search: z.string().max(255).optional(),
  sort_by: z.enum(['name', 'created_at', 'total_revenue', 'last_contact_date']).optional().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
});

// Validation helper functions
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Unknown validation error']
    };
  }
}

export function validatePartialInput<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: Partial<T>;
  errors?: string[];
} {
  try {
    // Check if schema is a ZodObject before calling partial
    let partialSchema: z.ZodSchema<any>;
    if ((schema as any)._def?.typeName === z.ZodFirstPartyTypeKind.ZodObject) {
      partialSchema = (schema as any).partial();
    } else {
      partialSchema = schema;
    }
    const result = partialSchema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Unknown validation error']
    };
  }
}

// Export type inference helpers
export type Company = z.infer<typeof CompanySchema>;
export type Quote = z.infer<typeof QuoteSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
export type PaintProduct = z.infer<typeof PaintProductSchema>;
export type CompanyPreferences = z.infer<typeof CompanyPreferencesSchema>;
export type CompanyBranding = z.infer<typeof CompanyBrandingSchema>;

export type CreateCompanyInput = z.infer<typeof CreateCompanyInputSchema>;
export type CreateQuoteInput = z.infer<typeof CreateQuoteInputSchema>;
export type UpdateQuoteInput = z.infer<typeof UpdateQuoteInputSchema>;
export type CreateCustomerInput = z.infer<typeof CreateCustomerInputSchema>;
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerInputSchema>;

export type GetQuotesQuery = z.infer<typeof GetQuotesQuerySchema>;
export type GetCustomersQuery = z.infer<typeof GetCustomersQuerySchema>;