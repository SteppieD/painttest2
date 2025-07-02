/**
 * Secure Database Operations
 * 
 * Provides company-scoped database operations with SQL injection prevention
 */

import { DatabaseCompany, DatabaseQuote, DatabaseCustomer } from './database-types';
import { AuthContext } from './auth-middleware';

export class SecureDatabase {
  private db: any;

  constructor(databaseAdapter: any) {
    this.db = databaseAdapter;
  }

  /**
   * Get quotes for authenticated company only
   */
  async getQuotesByCompany(
    auth: AuthContext,
    options: {
      limit?: number;
      offset?: number;
      status?: string;
      customerId?: number;
      search?: string;
    } = {}
  ): Promise<{
    quotes: DatabaseQuote[];
    total: number;
  }> {
    const { limit = 20, offset = 0, status, customerId, search } = options;

    try {
      // Build WHERE clause with company ID restriction
      const whereConditions = ['q.company_id = ?'];
      const whereValues = [auth.companyId];

      if (status) {
        whereConditions.push('q.status = ?');
        whereValues.push(status);
      }

      if (customerId) {
        whereConditions.push('q.customer_id = ?');
        whereValues.push(customerId);
      }

      if (search) {
        whereConditions.push('(q.customer_name LIKE ? OR q.address LIKE ? OR c.name LIKE ?)');
        const searchPattern = `%${search}%`;
        whereValues.push(searchPattern, searchPattern, searchPattern);
      }

      const whereClause = whereConditions.join(' AND ');

      // Get total count
      const totalResult = await this.db.get(
        `SELECT COUNT(*) as count 
         FROM quotes q 
         LEFT JOIN customers c ON q.customer_id = c.id 
         WHERE ${whereClause}`,
        whereValues
      );

      // Get quotes with pagination
      const quotes = await this.db.all(
        `SELECT q.*, c.name as customer_name_resolved, c.email as customer_email_resolved
         FROM quotes q 
         LEFT JOIN customers c ON q.customer_id = c.id 
         WHERE ${whereClause}
         ORDER BY q.created_at DESC 
         LIMIT ? OFFSET ?`,
        [...whereValues, limit, offset]
      );

      return {
        quotes,
        total: totalResult.count
      };

    } catch (error) {
      console.error('Error getting quotes by company:', error);
      throw new Error('Failed to retrieve quotes');
    }
  }

  /**
   * Get single quote with company access validation
   */
  async getQuoteById(quoteId: number, auth: AuthContext): Promise<DatabaseQuote | null> {
    try {
      const quote = await this.db.get(
        `SELECT q.*, c.name as customer_name_resolved, c.email as customer_email_resolved
         FROM quotes q 
         LEFT JOIN customers c ON q.customer_id = c.id 
         WHERE q.id = ? AND q.company_id = ?`,
        [quoteId, auth.companyId]
      );

      return quote || null;

    } catch (error) {
      console.error('Error getting quote by ID:', error);
      throw new Error('Failed to retrieve quote');
    }
  }

  /**
   * Create quote with company scoping
   */
  async createQuote(
    auth: AuthContext,
    quoteData: {
      customer_name: string;
      customer_email?: string;
      customer_phone?: string;
      address?: string;
      walls_sqft: number;
      ceilings_sqft: number;
      trim_sqft: number;
      walls_rate?: number;
      ceilings_rate?: number;
      trim_rate?: number;
      customer_id?: number;
    }
  ): Promise<{
    success: boolean;
    quote?: DatabaseQuote;
    error?: string;
  }> {
    try {
      // Validate customer belongs to company if customer_id provided
      if (quoteData.customer_id) {
        const customer = await this.db.get(
          'SELECT id FROM customers WHERE id = ? AND company_id = ?',
          [quoteData.customer_id, auth.companyId]
        );

        if (!customer) {
          return {
            success: false,
            error: 'Customer not found or access denied'
          };
        }
      }

      // Get company rates for defaults
      const company = await this.db.get(
        'SELECT default_walls_rate, default_ceilings_rate, default_trim_rate FROM companies WHERE id = ?',
        [auth.companyId]
      );

      if (!company) {
        return {
          success: false,
          error: 'Company not found'
        };
      }

      const walls_rate = quoteData.walls_rate || company.default_walls_rate || 2.00;
      const ceilings_rate = quoteData.ceilings_rate || company.default_ceilings_rate || 3.50;
      const trim_rate = quoteData.trim_rate || company.default_trim_rate || 1.50;

      const walls_cost = quoteData.walls_sqft * walls_rate;
      const ceilings_cost = quoteData.ceilings_sqft * ceilings_rate;
      const trim_cost = quoteData.trim_sqft * trim_rate;
      const final_price = walls_cost + ceilings_cost + trim_cost;

      const result = await this.db.run(
        `INSERT INTO quotes (
          company_id, customer_id, customer_name, customer_email, customer_phone,
          address, walls_sqft, ceilings_sqft, trim_sqft, walls_rate, ceilings_rate,
          trim_rate, walls_cost, ceilings_cost, trim_cost, final_price,
          status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          auth.companyId,
          quoteData.customer_id || null,
          quoteData.customer_name,
          quoteData.customer_email || null,
          quoteData.customer_phone || null,
          quoteData.address || null,
          quoteData.walls_sqft,
          quoteData.ceilings_sqft,
          quoteData.trim_sqft,
          walls_rate,
          ceilings_rate,
          trim_rate,
          walls_cost,
          ceilings_cost,
          trim_cost,
          final_price,
          'pending',
          new Date().toISOString(),
          new Date().toISOString()
        ]
      );

      const quote = await this.getQuoteById(result.lastID, auth);

      return {
        success: true,
        quote: quote!
      };

    } catch (error) {
      console.error('Error creating quote:', error);
      return {
        success: false,
        error: 'Failed to create quote'
      };
    }
  }

  /**
   * Update quote with company scoping
   */
  async updateQuote(
    quoteId: number,
    auth: AuthContext,
    updates: Partial<DatabaseQuote>
  ): Promise<{
    success: boolean;
    quote?: DatabaseQuote;
    error?: string;
  }> {
    try {
      // Verify quote belongs to company
      const existingQuote = await this.getQuoteById(quoteId, auth);
      if (!existingQuote) {
        return {
          success: false,
          error: 'Quote not found or access denied'
        };
      }

      // Build dynamic update query
      const updateFields: string[] = [];
      const updateValues: any[] = [];

      const allowedFields = [
        'customer_name', 'customer_email', 'customer_phone', 'address',
        'walls_sqft', 'ceilings_sqft', 'trim_sqft', 'walls_rate', 'ceilings_rate',
        'trim_rate', 'status', 'notes'
      ];

      for (const field of allowedFields) {
        if (updates[field as keyof DatabaseQuote] !== undefined) {
          updateFields.push(`${field} = ?`);
          updateValues.push(updates[field as keyof DatabaseQuote]);
        }
      }

      if (updateFields.length === 0) {
        return {
          success: true,
          quote: existingQuote
        };
      }

      // Recalculate costs if sqft or rates changed
      if (['walls_sqft', 'ceilings_sqft', 'trim_sqft', 'walls_rate', 'ceilings_rate', 'trim_rate'].some(f => updates[f as keyof DatabaseQuote] !== undefined)) {
        const walls_sqft = updates.walls_sqft ?? existingQuote.walls_sqft;
        const ceilings_sqft = updates.ceilings_sqft ?? existingQuote.ceilings_sqft;
        const trim_sqft = updates.trim_sqft ?? existingQuote.trim_sqft;
        const walls_rate = updates.walls_rate ?? existingQuote.walls_rate;
        const ceilings_rate = updates.ceilings_rate ?? existingQuote.ceilings_rate;
        const trim_rate = updates.trim_rate ?? existingQuote.trim_rate;

        const walls_cost = walls_sqft * walls_rate;
        const ceilings_cost = ceilings_sqft * ceilings_rate;
        const trim_cost = trim_sqft * trim_rate;
        const final_price = walls_cost + ceilings_cost + trim_cost;

        updateFields.push('walls_cost = ?', 'ceilings_cost = ?', 'trim_cost = ?', 'final_price = ?');
        updateValues.push(walls_cost, ceilings_cost, trim_cost, final_price);
      }

      // Add updated_at timestamp
      updateFields.push('updated_at = ?');
      updateValues.push(new Date().toISOString());

      // Add WHERE conditions
      updateValues.push(quoteId, auth.companyId);

      await this.db.run(
        `UPDATE quotes SET ${updateFields.join(', ')} WHERE id = ? AND company_id = ?`,
        updateValues
      );

      const updatedQuote = await this.getQuoteById(quoteId, auth);

      return {
        success: true,
        quote: updatedQuote!
      };

    } catch (error) {
      console.error('Error updating quote:', error);
      return {
        success: false,
        error: 'Failed to update quote'
      };
    }
  }

  /**
   * Delete quote with company scoping
   */
  async deleteQuote(quoteId: number, auth: AuthContext): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Verify quote belongs to company first
      const quote = await this.getQuoteById(quoteId, auth);
      if (!quote) {
        return {
          success: false,
          error: 'Quote not found or access denied'
        };
      }

      await this.db.run(
        'DELETE FROM quotes WHERE id = ? AND company_id = ?',
        [quoteId, auth.companyId]
      );

      return { success: true };

    } catch (error) {
      console.error('Error deleting quote:', error);
      return {
        success: false,
        error: 'Failed to delete quote'
      };
    }
  }

  /**
   * Get customers for authenticated company only
   */
  async getCustomersByCompany(
    auth: AuthContext,
    options: {
      limit?: number;
      offset?: number;
      status?: string;
      search?: string;
    } = {}
  ): Promise<{
    customers: DatabaseCustomer[];
    total: number;
  }> {
    const { limit = 20, offset = 0, status, search } = options;

    try {
      const whereConditions = ['company_id = ?'];
      const whereValues = [auth.companyId];

      if (status) {
        whereConditions.push('status = ?');
        whereValues.push(status);
      }

      if (search) {
        whereConditions.push('(name LIKE ? OR email LIKE ? OR phone LIKE ?)');
        const searchPattern = `%${search}%`;
        whereValues.push(searchPattern, searchPattern, searchPattern);
      }

      const whereClause = whereConditions.join(' AND ');

      // Get total count
      const totalResult = await this.db.get(
        `SELECT COUNT(*) as count FROM customers WHERE ${whereClause}`,
        whereValues
      );

      // Get customers
      const customers = await this.db.all(
        `SELECT * FROM customers WHERE ${whereClause} 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [...whereValues, limit, offset]
      );

      return {
        customers,
        total: totalResult.count
      };

    } catch (error) {
      console.error('Error getting customers by company:', error);
      throw new Error('Failed to retrieve customers');
    }
  }

  /**
   * Get company data for authenticated company only
   */
  async getCompanyData(auth: AuthContext): Promise<DatabaseCompany | null> {
    try {
      const company = await this.db.get(
        'SELECT * FROM companies WHERE id = ?',
        [auth.companyId]
      );

      return company || null;

    } catch (error) {
      console.error('Error getting company data:', error);
      throw new Error('Failed to retrieve company data');
    }
  }

  /**
   * Update company data with validation
   */
  async updateCompanyData(
    auth: AuthContext,
    updates: Partial<DatabaseCompany>
  ): Promise<{
    success: boolean;
    company?: DatabaseCompany;
    error?: string;
  }> {
    try {
      // Build update query for allowed fields only
      const updateFields: string[] = [];
      const updateValues: any[] = [];

      const allowedFields = [
        'company_name', 'phone', 'email', 'address', 'website',
        'default_walls_rate', 'default_ceilings_rate', 'default_trim_rate'
      ];

      for (const field of allowedFields) {
        if (updates[field as keyof DatabaseCompany] !== undefined) {
          updateFields.push(`${field} = ?`);
          updateValues.push(updates[field as keyof DatabaseCompany]);
        }
      }

      if (updateFields.length === 0) {
        const company = await this.getCompanyData(auth);
        return {
          success: true,
          company: company!
        };
      }

      // Add updated_at timestamp
      updateFields.push('updated_at = ?');
      updateValues.push(new Date().toISOString());

      // Add company ID for WHERE clause
      updateValues.push(auth.companyId);

      await this.db.run(
        `UPDATE companies SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      const updatedCompany = await this.getCompanyData(auth);

      return {
        success: true,
        company: updatedCompany!
      };

    } catch (error) {
      console.error('Error updating company:', error);
      return {
        success: false,
        error: 'Failed to update company'
      };
    }
  }
}