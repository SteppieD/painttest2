/**
 * Quote Saving Service
 * 
 * Handles saving quotes to the database
 */

import { createQuote } from './database-simple';

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
      
      const quoteToSave = {
        quote_id,
        customer_name: quoteData.customer_name,
        address: quoteData.address,
        total_revenue: quoteData.quote_amount, // Map quote_amount to total_revenue
        project_type: quoteData.project_type,
        status: quoteData.status || 'pending',
        company_id: quoteData.company_id,
        quote_details: JSON.stringify(quoteData.quote_details),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('📋 Saving quote with data:', quoteToSave);
      
      const result = await createQuote(quoteToSave);

      console.log('📋 Database response:', result);

      if (result && result.lastID) {
        console.log('✅ Quote saved successfully with ID:', result.lastID);
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