/**
 * Customer Management System
 * 
 * Fixes the customer data confusion by providing a clear separation between:
 * - Companies (painting contractors)
 * - Customers (people who hire the contractors)
 * - Quotes (work estimates for customers)
 */

import { DatabaseCustomer, DatabaseQuote, DatabaseCompany, CreateCustomerInput, UpdateCustomerInput } from './database-types';
import { validateInput, CreateCustomerInputSchema, UpdateCustomerInputSchema } from './validation-schemas';

export interface CustomerWithQuotes extends DatabaseCustomer {
  quotes: DatabaseQuote[];
  recent_quote?: DatabaseQuote;
  lifetime_value: number;
  average_quote_value: number;
  conversion_rate: number; // percentage of quotes that were accepted
}

export interface CustomerSummary {
  total_customers: number;
  active_customers: number;
  prospects: number;
  completed_customers: number;
  total_lifetime_value: number;
  average_customer_value: number;
  top_customers: CustomerWithQuotes[];
}

export class CustomerManager {
  private db: any; // Database adapter

  constructor(databaseAdapter: any) {
    this.db = databaseAdapter;
  }

  /**
   * Create a new customer for a painting company
   */
  async createCustomer(companyId: number, customerData: CreateCustomerInput): Promise<{
    success: boolean;
    customer?: DatabaseCustomer;
    error?: string;
  }> {
    // Validate input
    const validation = validateInput(CreateCustomerInputSchema, customerData);
    if (!validation.success) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors?.join(', ')}`
      };
    }

    try {
      // Check if company exists
      const company = await this.getCompanyById(companyId);
      if (!company) {
        return {
          success: false,
          error: 'Company not found'
        };
      }

      // Check for duplicate customer (same name + email or phone for this company)
      const existingCustomer = await this.findDuplicateCustomer(companyId, customerData.name, customerData.email, customerData.phone);
      if (existingCustomer) {
        return {
          success: false,
          error: `Customer already exists: ${existingCustomer.name} (${existingCustomer.email || existingCustomer.phone})`
        };
      }

      // Create customer record
      const customerRecord = {
        company_id: companyId,
        name: this.cleanCustomerName(customerData.name),
        email: customerData.email || null,
        phone: customerData.phone || null,
        address: customerData.address || null,
        preferred_contact_method: customerData.preferred_contact_method || 'email',
        notes: customerData.notes || null,
        tags: customerData.tags ? JSON.stringify(customerData.tags) : null,
        status: 'prospect' as const,
        total_quotes: 0,
        total_revenue: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const result = await this.db.run(
        `INSERT INTO customers (
          company_id, name, email, phone, address, preferred_contact_method,
          notes, tags, status, total_quotes, total_revenue, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          customerRecord.company_id,
          customerRecord.name,
          customerRecord.email,
          customerRecord.phone,
          customerRecord.address,
          customerRecord.preferred_contact_method,
          customerRecord.notes,
          customerRecord.tags,
          customerRecord.status,
          customerRecord.total_quotes,
          customerRecord.total_revenue,
          customerRecord.created_at,
          customerRecord.updated_at
        ]
      );

      const customer: DatabaseCustomer = {
        id: result.lastID,
        ...customerRecord
      };

      return {
        success: true,
        customer
      };

    } catch (error) {
      console.error('Error creating customer:', error);
      return {
        success: false,
        error: 'Failed to create customer'
      };
    }
  }

  /**
   * Update an existing customer
   */
  async updateCustomer(customerId: number, updates: UpdateCustomerInput): Promise<{
    success: boolean;
    customer?: DatabaseCustomer;
    error?: string;
  }> {
    // Validate input
    const validation = validateInput(UpdateCustomerInputSchema, updates);
    if (!validation.success) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors?.join(', ')}`
      };
    }

    try {
      // Get existing customer
      const existingCustomer = await this.getCustomerById(customerId);
      if (!existingCustomer) {
        return {
          success: false,
          error: 'Customer not found'
        };
      }

      // Build update query dynamically
      const updateFields: string[] = [];
      const updateValues: any[] = [];

      if (updates.name !== undefined) {
        updateFields.push('name = ?');
        updateValues.push(this.cleanCustomerName(updates.name));
      }

      if (updates.email !== undefined) {
        updateFields.push('email = ?');
        updateValues.push(updates.email || null);
      }

      if (updates.phone !== undefined) {
        updateFields.push('phone = ?');
        updateValues.push(updates.phone || null);
      }

      if (updates.address !== undefined) {
        updateFields.push('address = ?');
        updateValues.push(updates.address || null);
      }

      if (updates.preferred_contact_method !== undefined) {
        updateFields.push('preferred_contact_method = ?');
        updateValues.push(updates.preferred_contact_method);
      }

      if (updates.notes !== undefined) {
        updateFields.push('notes = ?');
        updateValues.push(updates.notes || null);
      }

      if (updates.tags !== undefined) {
        updateFields.push('tags = ?');
        updateValues.push(updates.tags ? JSON.stringify(updates.tags) : null);
      }

      if (updates.status !== undefined) {
        updateFields.push('status = ?');
        updateValues.push(updates.status);
      }

      if (updateFields.length === 0) {
        return {
          success: true,
          customer: existingCustomer
        };
      }

      // Add updated_at timestamp
      updateFields.push('updated_at = ?');
      updateValues.push(new Date().toISOString());

      // Add customer ID for WHERE clause
      updateValues.push(customerId);

      await this.db.run(
        `UPDATE customers SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      // Return updated customer
      const updatedCustomer = await this.getCustomerById(customerId);

      return {
        success: true,
        customer: updatedCustomer!
      };

    } catch (error) {
      console.error('Error updating customer:', error);
      return {
        success: false,
        error: 'Failed to update customer'
      };
    }
  }

  /**
   * Get customer by ID with optional quote history
   */
  async getCustomerById(customerId: number, includeQuotes: boolean = false): Promise<CustomerWithQuotes | null> {
    try {
      const customer = await this.db.get(
        'SELECT * FROM customers WHERE id = ?',
        [customerId]
      );

      if (!customer) {
        return null;
      }

      let quotes: DatabaseQuote[] = [];
      let recentQuote: DatabaseQuote | undefined;

      if (includeQuotes) {
        quotes = await this.db.all(
          'SELECT * FROM quotes WHERE customer_id = ? ORDER BY created_at DESC',
          [customerId]
        );
        recentQuote = quotes[0];
      }

      return this.enrichCustomerData(customer, quotes, recentQuote);

    } catch (error) {
      console.error('Error getting customer:', error);
      return null;
    }
  }

  /**
   * Get all customers for a company with pagination and filtering
   */
  async getCustomersByCompany(
    companyId: number,
    options: {
      page?: number;
      limit?: number;
      status?: 'prospect' | 'active' | 'completed' | 'inactive';
      search?: string;
      includeQuotes?: boolean;
    } = {}
  ): Promise<{
    customers: CustomerWithQuotes[];
    total: number;
    page: number;
    pages: number;
  }> {
    const {
      page = 1,
      limit = 20,
      status,
      search,
      includeQuotes = false
    } = options;

    try {
      // Build WHERE clause
      const whereConditions = ['company_id = ?'];
      const whereValues: any[] = [companyId];

      if (status) {
        whereConditions.push('status = ?');
        whereValues.push(status);
      }

      if (search) {
        whereConditions.push('(name LIKE ? OR email LIKE ? OR phone LIKE ? OR address LIKE ?)');
        const searchPattern = `%${search}%`;
        whereValues.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }

      const whereClause = whereConditions.join(' AND ');

      // Get total count
      const totalResult = await this.db.get(
        `SELECT COUNT(*) as count FROM customers WHERE ${whereClause}`,
        whereValues
      );
      const total = totalResult.count;

      // Get customers with pagination
      const offset = (page - 1) * limit;
      const customers = await this.db.all(
        `SELECT * FROM customers WHERE ${whereClause} 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [...whereValues, limit, offset]
      );

      // Enrich with quote data if requested
      const enrichedCustomers: CustomerWithQuotes[] = [];
      for (const customer of customers) {
        let quotes: DatabaseQuote[] = [];
        let recentQuote: DatabaseQuote | undefined;

        if (includeQuotes) {
          quotes = await this.db.all(
            'SELECT * FROM quotes WHERE customer_id = ? ORDER BY created_at DESC',
            [customer.id]
          );
          recentQuote = quotes[0];
        }

        enrichedCustomers.push(this.enrichCustomerData(customer, quotes, recentQuote));
      }

      return {
        customers: enrichedCustomers,
        total,
        page,
        pages: Math.ceil(total / limit)
      };

    } catch (error) {
      console.error('Error getting customers:', error);
      return {
        customers: [],
        total: 0,
        page: 1,
        pages: 0
      };
    }
  }

  /**
   * Get customer summary statistics for a company
   */
  async getCustomerSummary(companyId: number): Promise<CustomerSummary> {
    try {
      // Get customer counts by status
      const statusCounts = await this.db.all(
        `SELECT status, COUNT(*) as count, SUM(total_revenue) as revenue 
         FROM customers 
         WHERE company_id = ? 
         GROUP BY status`,
        [companyId]
      );

      // Get top customers by revenue
      const topCustomers = await this.db.all(
        `SELECT * FROM customers 
         WHERE company_id = ? AND total_revenue > 0 
         ORDER BY total_revenue DESC 
         LIMIT 5`,
        [companyId]
      );

      // Calculate summary metrics
      let totalCustomers = 0;
      let activeCustomers = 0;
      let prospects = 0;
      let completedCustomers = 0;
      let totalLifetimeValue = 0;

      for (const statusCount of statusCounts) {
        totalCustomers += statusCount.count;
        totalLifetimeValue += statusCount.revenue || 0;

        switch (statusCount.status) {
          case 'active':
            activeCustomers = statusCount.count;
            break;
          case 'prospect':
            prospects = statusCount.count;
            break;
          case 'completed':
            completedCustomers = statusCount.count;
            break;
        }
      }

      const averageCustomerValue = totalCustomers > 0 ? totalLifetimeValue / totalCustomers : 0;

      // Enrich top customers with quotes
      const enrichedTopCustomers: CustomerWithQuotes[] = [];
      for (const customer of topCustomers) {
        const quotes = await this.db.all(
          'SELECT * FROM quotes WHERE customer_id = ? ORDER BY created_at DESC',
          [customer.id]
        );
        enrichedTopCustomers.push(this.enrichCustomerData(customer, quotes, quotes[0]));
      }

      return {
        total_customers: totalCustomers,
        active_customers: activeCustomers,
        prospects,
        completed_customers: completedCustomers,
        total_lifetime_value: totalLifetimeValue,
        average_customer_value: averageCustomerValue,
        top_customers: enrichedTopCustomers
      };

    } catch (error) {
      console.error('Error getting customer summary:', error);
      return {
        total_customers: 0,
        active_customers: 0,
        prospects: 0,
        completed_customers: 0,
        total_lifetime_value: 0,
        average_customer_value: 0,
        top_customers: []
      };
    }
  }

  /**
   * Link a quote to a customer (creates customer if needed)
   */
  async linkQuoteToCustomer(
    companyId: number,
    quoteId: number,
    customerName: string,
    customerEmail?: string,
    customerPhone?: string,
    customerAddress?: string
  ): Promise<{
    success: boolean;
    customer?: DatabaseCustomer;
    created?: boolean;
    error?: string;
  }> {
    try {
      // Clean the customer name
      const cleanName = this.cleanCustomerName(customerName);

      // Try to find existing customer
      let customer = await this.findCustomerByNameAndContact(companyId, cleanName, customerEmail, customerPhone);
      let created = false;

      if (!customer) {
        // Create new customer
        const createResult = await this.createCustomer(companyId, {
          company_id: companyId,
          name: cleanName,
          email: customerEmail,
          phone: customerPhone,
          address: customerAddress
        });

        if (!createResult.success) {
          return createResult;
        }

        customer = createResult.customer!;
        created = true;
      }

      // Update quote with customer_id
      await this.db.run(
        'UPDATE quotes SET customer_id = ? WHERE id = ?',
        [customer.id, quoteId]
      );

      // Update customer statistics
      await this.updateCustomerStatistics(customer.id);

      return {
        success: true,
        customer,
        created
      };

    } catch (error) {
      console.error('Error linking quote to customer:', error);
      return {
        success: false,
        error: 'Failed to link quote to customer'
      };
    }
  }

  /**
   * Update customer statistics after quote changes
   */
  async updateCustomerStatistics(customerId: number): Promise<void> {
    try {
      const stats = await this.db.get(
        `SELECT 
          COUNT(*) as total_quotes,
          SUM(CASE WHEN status = 'approved' THEN final_price ELSE 0 END) as total_revenue,
          MIN(created_at) as first_quote_date
         FROM quotes 
         WHERE customer_id = ?`,
        [customerId]
      );

      let status: 'prospect' | 'active' | 'completed' | 'inactive' = 'prospect';
      
      if (stats.total_revenue > 0) {
        status = 'completed';
      } else if (stats.total_quotes > 1) {
        status = 'active';
      }

      await this.db.run(
        `UPDATE customers SET 
          total_quotes = ?,
          total_revenue = ?,
          first_quote_date = ?,
          status = ?,
          last_contact_date = ?,
          updated_at = ?
         WHERE id = ?`,
        [
          stats.total_quotes,
          stats.total_revenue || 0,
          stats.first_quote_date,
          status,
          new Date().toISOString(),
          new Date().toISOString(),
          customerId
        ]
      );

    } catch (error) {
      console.error('Error updating customer statistics:', error);
    }
  }

  /**
   * Helper: Clean customer name (removes conversation artifacts)
   */
  private cleanCustomerName(name: string): string {
    if (!name) return 'Unknown Customer';

    // Handle "It's for [Name]" or "its for [Name]" pattern
    const itsForMatch = name.match(/it'?s\s+for\s+([^.]+)/i);
    if (itsForMatch) {
      return itsForMatch[1].trim();
    }

    // Handle "Customer: [Name]" pattern
    const customerMatch = name.match(/customer:\s*([^,]+)/i);
    if (customerMatch) {
      return customerMatch[1].trim();
    }

    // Handle "the customers name is [Name]" or "customers name is [Name]"
    const customerNameMatch = name.match(/(?:the\s+)?customers?\s+name\s+is\s+([A-Z][a-z]+)(?:\s+and|$)/i);
    if (customerNameMatch) {
      return customerNameMatch[1].trim();
    }

    // Handle "name is [Name]"
    const nameIsMatch = name.match(/name\s+is\s+([A-Z][a-z]+)/i);
    if (nameIsMatch) {
      return nameIsMatch[1].trim();
    }

    // If it looks like raw conversation data, try to extract name
    if (name.length > 50 || name.includes('.') || name.includes('painting')) {
      // Look for name patterns in longer text
      const nameMatch = name.match(/(?:for|customer|client)?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
      if (nameMatch) {
        return nameMatch[1].trim();
      }
    }

    return name.trim();
  }

  /**
   * Helper: Find duplicate customer
   */
  private async findDuplicateCustomer(
    companyId: number,
    name: string,
    email?: string,
    phone?: string
  ): Promise<DatabaseCustomer | null> {
    if (email) {
      const emailMatch = await this.db.get(
        'SELECT * FROM customers WHERE company_id = ? AND email = ? AND email IS NOT NULL',
        [companyId, email]
      );
      if (emailMatch) return emailMatch;
    }

    if (phone) {
      const phoneMatch = await this.db.get(
        'SELECT * FROM customers WHERE company_id = ? AND phone = ? AND phone IS NOT NULL',
        [companyId, phone]
      );
      if (phoneMatch) return phoneMatch;
    }

    // Check for exact name match
    const nameMatch = await this.db.get(
      'SELECT * FROM customers WHERE company_id = ? AND LOWER(name) = LOWER(?)',
      [companyId, name]
    );

    return nameMatch || null;
  }

  /**
   * Helper: Find customer by name and contact info
   */
  private async findCustomerByNameAndContact(
    companyId: number,
    name: string,
    email?: string,
    phone?: string
  ): Promise<DatabaseCustomer | null> {
    // Try email first if provided
    if (email) {
      const customer = await this.db.get(
        'SELECT * FROM customers WHERE company_id = ? AND email = ?',
        [companyId, email]
      );
      if (customer) return customer;
    }

    // Try phone if provided
    if (phone) {
      const customer = await this.db.get(
        'SELECT * FROM customers WHERE company_id = ? AND phone = ?',
        [companyId, phone]
      );
      if (customer) return customer;
    }

    // Try name match
    const customer = await this.db.get(
      'SELECT * FROM customers WHERE company_id = ? AND LOWER(name) = LOWER(?)',
      [companyId, name]
    );

    return customer || null;
  }

  /**
   * Helper: Get company by ID
   */
  private async getCompanyById(companyId: number): Promise<DatabaseCompany | null> {
    try {
      return await this.db.get('SELECT * FROM companies WHERE id = ?', [companyId]);
    } catch (error) {
      return null;
    }
  }

  /**
   * Helper: Enrich customer data with calculated metrics
   */
  private enrichCustomerData(
    customer: DatabaseCustomer,
    quotes: DatabaseQuote[] = [],
    recentQuote?: DatabaseQuote
  ): CustomerWithQuotes {
    const totalQuotes = quotes.length;
    const approvedQuotes = quotes.filter(q => q.status === 'approved').length;
    const totalRevenue = quotes
      .filter(q => q.status === 'approved')
      .reduce((sum, q) => sum + (q.final_price || 0), 0);

    const averageQuoteValue = totalQuotes > 0 
      ? quotes.reduce((sum, q) => sum + (q.final_price || 0), 0) / totalQuotes 
      : 0;

    const conversionRate = totalQuotes > 0 ? (approvedQuotes / totalQuotes) * 100 : 0;

    return {
      ...customer,
      quotes,
      recent_quote: recentQuote,
      lifetime_value: totalRevenue,
      average_quote_value: averageQuoteValue,
      conversion_rate: conversionRate
    };
  }
}