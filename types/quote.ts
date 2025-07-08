/**
 * Standardized Quote Interface
 * Single source of truth for all quote-related data structures
 */

export interface StandardQuote {
  // Core identifiers
  id: string;
  quote_id: string;
  
  // Customer information (always required)
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  address: string;
  
  // Project details
  project_type: 'interior' | 'exterior' | 'both';
  surfaces: string[];
  total_sqft?: number;
  room_count?: number;
  
  // Pricing (simplified to single field)
  quote_amount: number;
  
  // Additional details
  notes?: string;
  timeline?: string;
  
  // Meta information
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at?: string;
  company_id: string;
  company_name?: string;
}

export interface QuoteCreationRequest {
  // Required fields
  customer_name: string;
  quote_amount: number;
  company_id: string;
  
  // Optional fields with sensible defaults
  customer_email?: string;
  customer_phone?: string;
  address?: string;
  project_type?: 'interior' | 'exterior' | 'both';
  surfaces?: string[];
  total_sqft?: number;
  room_count?: number;
  notes?: string;
  timeline?: string;
  
  // Conversation context for reference
  conversation_data?: any;
}

export interface ConversationExtractedData {
  customer_name?: string;
  address?: string;
  project_type?: 'interior' | 'exterior' | 'both';
  surfaces?: string[];
  total_sqft?: number;
  room_count?: number;
  quote_amount?: number;
  timeline?: string;
  confidence: 'high' | 'medium' | 'low';
}