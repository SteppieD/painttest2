/**
 * Quote Saving Service
 * 
 * Handles saving quotes to the database
 */

import { createQuote } from './database-simple';
import { trackQuoteSaved, trackQuoteCalculated } from './analytics/tracking';

export interface QuoteData {
  customer_name: string;
  address: string;
  quote_amount: number;
  project_type: 'interior' | 'exterior' | 'both';
  status: 'pending' | 'accepted' | 'rejected';
  company_id: number;
  quote_details: any; // Full quote object
}

export class QuoteSaver {
  /**
   * Save a quote to the database
   */
  async saveQuote(quoteData: QuoteData): Promise<{ success: boolean; quoteId?: string; error?: string }> {
    try {
      console.log('💾 QuoteSaver: Saving quote to database:', {
        customer: quoteData.customer_name,
        amount: quoteData.quote_amount,
        company_id: quoteData.company_id,
        nodeEnv: process.env.NODE_ENV
      });

      // Generate quote_id if not provided
      const quote_id = quoteData.quote_id || this.generateQuoteId();
      
      // Extract details from quote_details if available
      const details = quoteData.quote_details || {};
      const projectInfo = details.project_info || {};
      const measurements = projectInfo.measurements || {};
      
      // Extract square footage from measurements
      let walls_sqft = 0;
      let ceilings_sqft = 0;
      
      if (measurements.linear_feet && projectInfo.ceiling_height) {
        walls_sqft = measurements.linear_feet * (projectInfo.ceiling_height || 9);
      } else if (measurements.sqft) {
        walls_sqft = measurements.sqft;
      }
      
      const quoteToSave = {
        quote_id,
        customer_name: quoteData.customer_name,
        address: quoteData.address,
        total_revenue: quoteData.quote_amount, // Map quote_amount to total_revenue
        project_type: quoteData.project_type,
        status: quoteData.status || 'pending',
        company_id: quoteData.company_id,
        // Map quote details to actual database columns
        walls_sqft: walls_sqft || 0,
        ceilings_sqft: ceilings_sqft || 0,
        trim_sqft: 0, // Not painting trim
        paint_quality: 'standard',
        // Store the full details as JSON in special_requests
        special_requests: JSON.stringify({
          original_quote: quoteData.quote_details,
          linear_feet: measurements.linear_feet,
          ceiling_height: projectInfo.ceiling_height,
          paint_details: details.materials
        }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('📋 Saving quote with data:', quoteToSave);
      
      const result = await createQuote(quoteToSave);

      console.log('📋 Database response:', result);

      if (result && result.lastID) {
        console.log('✅ Quote saved successfully with ID:', result.lastID);
        
        // Track quote saved event
        trackQuoteSaved(
          result.lastID.toString(),
          quoteData.quote_amount,
          quoteData.customer_name
        );
        
        // Track quote calculation
        trackQuoteCalculated(
          quoteData.quote_amount,
          quoteData.project_type
        );
        
        return {
          success: true,
          quoteId: result.lastID.toString()
        };
      } else {
        console.log('❌ Quote save failed - no ID returned, result:', result);
        return {
          success: false,
          error: 'Failed to save quote - no ID returned'
        };
      }
    } catch (error) {
      console.error('❌ Quote save error (detailed):', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        type: typeof error,
        quoteData: {
          customer: quoteData.customer_name,
          amount: quoteData.quote_amount,
          company_id: quoteData.company_id
        }
      });
      
      return {
        success: false,
        error: `Quote save failed: ${error instanceof Error ? error.message : JSON.stringify(error)}`
      };
    }
  }

  /**
   * Generate a user-friendly quote ID
   */
  generateQuoteId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `QUOTE-${timestamp.toUpperCase()}-${random.toUpperCase()}`;
  }
}

export const quoteSaver = new QuoteSaver();