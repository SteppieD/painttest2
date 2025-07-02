/**
 * Optimized Database Adapter
 * 
 * Fixes N+1 query performance issues and provides efficient data access patterns
 * Eliminates the string-matching adapter pattern with proper query optimization
 */

import { DatabaseCustomer, DatabaseQuote, DatabaseCompany, CustomerWithQuotes } from './database-types';
import { supabaseDb } from './database/supabase-adapter';

export class OptimizedDatabaseAdapter {
  
  /**
   * Get customer with all related data in a single optimized query
   * Eliminates N+1 queries by JOINing all related tables
   */
  async getCustomerWithDetails(customerId: number): Promise<CustomerWithQuotes | null> {
    try {
      const result = await supabaseDb.query(`
        SELECT 
          c.*,
          comp.company_name,
          comp.access_code as company_access_code,
          
          -- Aggregate quote statistics
          COUNT(q.id) as total_quotes,
          COUNT(CASE WHEN q.status = 'approved' THEN 1 END) as approved_quotes,
          COUNT(CASE WHEN q.status = 'pending' THEN 1 END) as pending_quotes,
          COALESCE(SUM(CASE WHEN q.status = 'approved' THEN q.final_price ELSE 0 END), 0) as total_revenue,
          COALESCE(AVG(CASE WHEN q.status = 'approved' THEN q.final_price END), 0) as avg_quote_value,
          MAX(q.created_at) as last_quote_date,
          MIN(q.created_at) as first_quote_date,
          
          -- Calculate conversion rate
          CASE 
            WHEN COUNT(q.id) = 0 THEN 0
            ELSE ROUND((COUNT(CASE WHEN q.status = 'approved' THEN 1 END) * 100.0 / COUNT(q.id)), 2)
          END as conversion_rate
          
        FROM customers c
        JOIN companies comp ON c.company_id = comp.id
        LEFT JOIN quotes q ON c.id = q.customer_id
        WHERE c.id = ?
        GROUP BY c.id
      `, [customerId]);

      if (result.length === 0) return null;

      const customerData = result[0];

      // Get recent quotes for this customer (limit to last 10)
      const quotes = await supabaseDb.query(`
        SELECT * FROM quotes 
        WHERE customer_id = ? 
        ORDER BY created_at DESC 
        LIMIT 10
      `, [customerId]);

      return {
        ...customerData,
        quotes,
        recent_quote: quotes[0] || undefined,
        lifetime_value: customerData.total_revenue,
        average_quote_value: customerData.avg_quote_value
      };

    } catch (error) {
      console.error('Error getting customer with details:', error);
      return null;
    }
  }

  /**
   * Get customers for a company with optimized pagination
   * Single query with all needed data instead of multiple round trips
   */
  async getCustomersByCompany(
    companyId: number,
    options: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    } = {}
  ): Promise<{
    customers: CustomerWithQuotes[];
    total: number;
    page: number;
    pages: number;
  }> {
    const { page = 1, limit = 20, status, search } = options;
    const offset = (page - 1) * limit;

    try {
      // Build dynamic WHERE clause
      let whereClause = 'WHERE c.company_id = ?';
      const queryParams = [companyId];

      if (status) {
        whereClause += ' AND c.status = ?';
        queryParams.push(status);
      }

      if (search) {
        whereClause += ' AND (c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ?)';
        const searchPattern = `%${search}%`;
        queryParams.push(searchPattern, searchPattern, searchPattern);
      }

      // Get total count with same filters
      const totalResult = await supabaseDb.query(`
        SELECT COUNT(DISTINCT c.id) as total
        FROM customers c
        ${whereClause}
      `, queryParams);

      const total = totalResult[0].total;

      // Get customers with all related data in one query
      const customers = await supabaseDb.query(`
        SELECT 
          c.*,
          comp.company_name,
          
          -- Quote statistics
          COUNT(q.id) as total_quotes,
          COUNT(CASE WHEN q.status = 'approved' THEN 1 END) as approved_quotes,
          COALESCE(SUM(CASE WHEN q.status = 'approved' THEN q.final_price ELSE 0 END), 0) as total_revenue,
          COALESCE(AVG(q.final_price), 0) as avg_quote_value,
          MAX(q.created_at) as last_quote_date,
          
          -- Conversion rate
          CASE 
            WHEN COUNT(q.id) = 0 THEN 0
            ELSE ROUND((COUNT(CASE WHEN q.status = 'approved' THEN 1 END) * 100.0 / COUNT(q.id)), 2)
          END as conversion_rate

        FROM customers c
        JOIN companies comp ON c.company_id = comp.id
        LEFT JOIN quotes q ON c.id = q.customer_id
        ${whereClause}
        GROUP BY c.id
        ORDER BY c.created_at DESC
        LIMIT ? OFFSET ?
      `, [...queryParams, limit, offset]);

      // Transform to CustomerWithQuotes format
      const enrichedCustomers: CustomerWithQuotes[] = customers.map(customer => ({
        ...customer,
        quotes: [], // We'll populate this only if specifically requested
        lifetime_value: customer.total_revenue,
        average_quote_value: customer.avg_quote_value
      }));

      return {
        customers: enrichedCustomers,
        total,
        page,
        pages: Math.ceil(total / limit)
      };

    } catch (error) {
      console.error('Error getting customers by company:', error);
      return {
        customers: [],
        total: 0,
        page: 1,
        pages: 0
      };
    }
  }

  /**
   * Get company dashboard data with all metrics in optimized queries
   * Replaces multiple API calls with efficient batch queries
   */
  async getCompanyDashboard(companyId: number): Promise<{
    company: DatabaseCompany;
    metrics: {
      total_customers: number;
      active_customers: number;
      prospects: number;
      total_quotes: number;
      pending_quotes: number;
      approved_quotes: number;
      total_revenue: number;
      monthly_revenue: number;
      avg_quote_value: number;
      conversion_rate: number;
    };
    recent_quotes: DatabaseQuote[];
    top_customers: CustomerWithQuotes[];
  } | null> {
    try {
      // Get company info
      const company = await supabaseDb.getCompanyById(companyId);
      if (!company) return null;

      // Get comprehensive metrics in one query
      const metricsResult = await supabaseDb.query(`
        SELECT 
          -- Customer metrics
          COUNT(DISTINCT c.id) as total_customers,
          COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.id END) as active_customers,
          COUNT(DISTINCT CASE WHEN c.status = 'prospect' THEN c.id END) as prospects,
          
          -- Quote metrics
          COUNT(q.id) as total_quotes,
          COUNT(CASE WHEN q.status = 'pending' THEN 1 END) as pending_quotes,
          COUNT(CASE WHEN q.status = 'approved' THEN 1 END) as approved_quotes,
          
          -- Revenue metrics
          COALESCE(SUM(CASE WHEN q.status = 'approved' THEN q.final_price ELSE 0 END), 0) as total_revenue,
          COALESCE(SUM(CASE WHEN q.status = 'approved' AND q.created_at >= date('now', 'start of month') THEN q.final_price ELSE 0 END), 0) as monthly_revenue,
          COALESCE(AVG(CASE WHEN q.status = 'approved' THEN q.final_price END), 0) as avg_quote_value,
          
          -- Conversion rate
          CASE 
            WHEN COUNT(q.id) = 0 THEN 0
            ELSE ROUND((COUNT(CASE WHEN q.status = 'approved' THEN 1 END) * 100.0 / COUNT(q.id)), 2)
          END as conversion_rate
          
        FROM customers c
        LEFT JOIN quotes q ON c.id = q.customer_id
        WHERE c.company_id = ?
      `, [companyId]);

      // Get recent quotes (last 10)
      const recentQuotes = await supabaseDb.query(`
        SELECT q.*, c.name as customer_name
        FROM quotes q
        LEFT JOIN customers c ON q.customer_id = c.id
        WHERE q.company_id = ?
        ORDER BY q.created_at DESC
        LIMIT 10
      `, [companyId]);

      // Get top customers by revenue
      const topCustomers = await supabaseDb.query(`
        SELECT 
          c.*,
          COUNT(q.id) as total_quotes,
          COALESCE(SUM(CASE WHEN q.status = 'approved' THEN q.final_price ELSE 0 END), 0) as total_revenue,
          COALESCE(AVG(q.final_price), 0) as avg_quote_value,
          MAX(q.created_at) as last_quote_date,
          CASE 
            WHEN COUNT(q.id) = 0 THEN 0
            ELSE ROUND((COUNT(CASE WHEN q.status = 'approved' THEN 1 END) * 100.0 / COUNT(q.id)), 2)
          END as conversion_rate
        FROM customers c
        LEFT JOIN quotes q ON c.id = q.customer_id
        WHERE c.company_id = ?
        GROUP BY c.id
        HAVING total_revenue > 0
        ORDER BY total_revenue DESC
        LIMIT 5
      `, [companyId]);

      // Transform top customers to CustomerWithQuotes format
      const enrichedTopCustomers: CustomerWithQuotes[] = topCustomers.map(customer => ({
        ...customer,
        quotes: [], // Populated on demand
        lifetime_value: customer.total_revenue,
        average_quote_value: customer.avg_quote_value
      }));

      return {
        company,
        metrics: metricsResult[0],
        recent_quotes: recentQuotes,
        top_customers: enrichedTopCustomers
      };

    } catch (error) {
      console.error('Error getting company dashboard:', error);
      return null;
    }
  }

  /**
   * Bulk update customer statistics (for batch operations)
   * More efficient than updating customers one by one
   */
  async updateCustomerStatistics(customerIds: number[]): Promise<void> {
    if (customerIds.length === 0) return;

    try {
      // Use a single UPDATE with subqueries to update all customers at once
      const placeholders = customerIds.map(() => '?').join(',');
      
      await supabaseDb.run(`
        UPDATE customers 
        SET 
          total_quotes = (
            SELECT COUNT(*) 
            FROM quotes q 
            WHERE q.customer_id = customers.id
          ),
          total_revenue = (
            SELECT COALESCE(SUM(q.final_price), 0)
            FROM quotes q 
            WHERE q.customer_id = customers.id 
              AND q.status = 'approved'
          ),
          last_contact_date = (
            SELECT MAX(q.created_at)
            FROM quotes q 
            WHERE q.customer_id = customers.id
          ),
          status = CASE 
            WHEN (SELECT COUNT(*) FROM quotes q WHERE q.customer_id = customers.id AND q.status = 'approved') > 0 THEN 'completed'
            WHEN (SELECT COUNT(*) FROM quotes q WHERE q.customer_id = customers.id) > 1 THEN 'active'
            ELSE 'prospect'
          END,
          updated_at = CURRENT_TIMESTAMP
        WHERE id IN (${placeholders})
      `, customerIds);

    } catch (error) {
      console.error('Error updating customer statistics:', error);
    }
  }

  /**
   * Search across customers, quotes, and companies with full-text search
   * Single optimized query instead of multiple searches
   */
  async globalSearch(
    query: string,
    options: {
      limit?: number;
      companyId?: number;
    } = {}
  ): Promise<{
    customers: CustomerWithQuotes[];
    quotes: DatabaseQuote[];
    companies: DatabaseCompany[];
  }> {
    const { limit = 10, companyId } = options;
    const searchPattern = `%${query}%`;

    try {
      let companyFilter = '';
      let queryParams = [searchPattern, searchPattern, searchPattern];
      
      if (companyId) {
        companyFilter = 'AND c.company_id = ?';
        queryParams.push(companyId);
      }

      // Search customers
      const customers = await supabaseDb.query(`
        SELECT 
          c.*,
          comp.company_name,
          COUNT(q.id) as total_quotes,
          COALESCE(SUM(CASE WHEN q.status = 'approved' THEN q.final_price ELSE 0 END), 0) as total_revenue
        FROM customers c
        JOIN companies comp ON c.company_id = comp.id
        LEFT JOIN quotes q ON c.id = q.customer_id
        WHERE (c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ?)
        ${companyFilter}
        GROUP BY c.id
        ORDER BY c.name
        LIMIT ?
      `, [...queryParams, limit]);

      // Search quotes
      const quotes = await supabaseDb.query(`
        SELECT q.*, c.name as customer_name, comp.company_name
        FROM quotes q
        LEFT JOIN customers c ON q.customer_id = c.id
        LEFT JOIN companies comp ON q.company_id = comp.id
        WHERE (q.customer_name LIKE ? OR q.address LIKE ? OR q.special_requests LIKE ?)
        ${companyId ? 'AND q.company_id = ?' : ''}
        ORDER BY q.created_at DESC
        LIMIT ?
      `, [
        searchPattern, 
        searchPattern, 
        searchPattern,
        ...(companyId ? [companyId] : []),
        limit
      ]);

      // Search companies (only if not filtering by company)
      const companies = companyId ? [] : await supabaseDb.query(`
        SELECT * FROM companies
        WHERE company_name LIKE ? OR email LIKE ? OR access_code LIKE ?
        ORDER BY company_name
        LIMIT ?
      `, [searchPattern, searchPattern, searchPattern, limit]);

      // Transform customers to CustomerWithQuotes format
      const enrichedCustomers: CustomerWithQuotes[] = customers.map(customer => ({
        ...customer,
        quotes: [],
        lifetime_value: customer.total_revenue,
        average_quote_value: customer.total_quotes > 0 ? customer.total_revenue / customer.total_quotes : 0,
        conversion_rate: 0 // Would need additional query to calculate
      }));

      return {
        customers: enrichedCustomers,
        quotes,
        companies
      };

    } catch (error) {
      console.error('Error performing global search:', error);
      return {
        customers: [],
        quotes: [],
        companies: []
      };
    }
  }
}

// Export singleton instance
export const optimizedDb = new OptimizedDatabaseAdapter();