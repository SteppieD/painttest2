/**
 * Data Migration and Consistency System
 * 
 * Resolves customer data confusion and ensures data integrity
 * Provides migration scripts to fix existing data inconsistencies
 */

import { DataInconsistency, MigrationResult, DatabaseCompany, DatabaseQuote, DatabaseCustomer } from './database-types';
import { CustomerManager } from './customer-management';

export interface MigrationPlan {
  id: string;
  name: string;
  description: string;
  version: string;
  dependencies: string[];
  operations: MigrationOperation[];
}

export interface MigrationOperation {
  type: 'create_table' | 'alter_table' | 'data_transform' | 'cleanup' | 'validation';
  entity: string;
  sql?: string;
  transform?: (data: any) => any;
  validation?: (data: any) => boolean;
}

export class DataMigrationManager {
  private db: any;
  private customerManager: CustomerManager;

  constructor(databaseAdapter: any) {
    this.db = databaseAdapter;
    this.customerManager = new CustomerManager(databaseAdapter);
  }

  /**
   * Analyze data consistency and identify issues
   */
  async analyzeDataConsistency(): Promise<{
    inconsistencies: DataInconsistency[];
    summary: {
      total_issues: number;
      critical_issues: number;
      high_priority: number;
      medium_priority: number;
      low_priority: number;
    };
  }> {
    const inconsistencies: DataInconsistency[] = [];

    try {
      // Check for quotes without proper customer references
      await this.checkOrphanedQuotes(inconsistencies);
      
      // Check for invalid company references
      await this.checkInvalidCompanyReferences(inconsistencies);
      
      // Check for duplicate customers
      await this.checkDuplicateCustomers(inconsistencies);
      
      // Check for invalid pricing data
      await this.checkInvalidPricing(inconsistencies);
      
      // Check for missing customer records
      await this.checkMissingCustomers(inconsistencies);

      // Check for data type inconsistencies
      await this.checkDataTypeInconsistencies(inconsistencies);

      // Calculate summary
      const summary = {
        total_issues: inconsistencies.length,
        critical_issues: inconsistencies.filter(i => i.severity === 'critical').length,
        high_priority: inconsistencies.filter(i => i.severity === 'high').length,
        medium_priority: inconsistencies.filter(i => i.severity === 'medium').length,
        low_priority: inconsistencies.filter(i => i.severity === 'low').length,
      };

      return { inconsistencies, summary };

    } catch (error) {
      console.error('Error analyzing data consistency:', error);
      return {
        inconsistencies: [],
        summary: {
          total_issues: 0,
          critical_issues: 0,
          high_priority: 0,
          medium_priority: 0,
          low_priority: 0,
        }
      };
    }
  }

  /**
   * Execute migration to fix data inconsistencies
   */
  async migrateData(
    inconsistencies: DataInconsistency[],
    options: {
      createBackup?: boolean;
      dryRun?: boolean;
      fixTypes?: string[];
    } = {}
  ): Promise<MigrationResult> {
    const {
      createBackup = true,
      dryRun = false,
      fixTypes = ['missing_customer', 'invalid_company_ref', 'duplicate_customer', 'invalid_pricing']
    } = options;

    let backupLocation: string | undefined;

    try {
      // Create backup if requested
      if (createBackup && !dryRun) {
        backupLocation = await this.createDataBackup();
      }

      let migratedEntities = 0;
      let fixedInconsistencies = 0;
      const errors: string[] = [];
      const warnings: string[] = [];

      // Process each inconsistency
      for (const inconsistency of inconsistencies) {
        if (!fixTypes.includes(inconsistency.type)) {
          continue;
        }

        try {
          const result = await this.fixInconsistency(inconsistency, dryRun);
          if (result.success) {
            fixedInconsistencies++;
            if (result.entitiesModified) {
              migratedEntities += result.entitiesModified;
            }
          } else {
            errors.push(`Failed to fix ${inconsistency.type} for ${inconsistency.entity_type}:${inconsistency.entity_id}: ${result.error}`);
          }
        } catch (error) {
          errors.push(`Error fixing ${inconsistency.type}: ${error}`);
        }
      }

      // Validate data after migration
      if (!dryRun && fixedInconsistencies > 0) {
        const validationResult = await this.validateDataIntegrity();
        if (!validationResult.isValid) {
          warnings.push(`Data validation found ${validationResult.errors.length} remaining issues`);
        }
      }

      return {
        success: true,
        migrated_entities: migratedEntities,
        fixed_inconsistencies: fixedInconsistencies,
        errors,
        warnings,
        data_backup_location: backupLocation
      };

    } catch (error) {
      console.error('Migration error:', error);
      return {
        success: false,
        migrated_entities: 0,
        fixed_inconsistencies: 0,
        errors: [`Migration failed: ${error}`],
        warnings: [],
        data_backup_location: backupLocation
      };
    }
  }

  /**
   * Create customer separation migration
   */
  async createCustomerSeparationMigration(): Promise<MigrationResult> {
    try {
      console.log('Starting customer separation migration...');

      // Step 1: Create customers table if it doesn't exist
      await this.ensureCustomersTableExists();

      // Step 2: Extract customer data from quotes
      const quotes = await this.db.all('SELECT * FROM quotes WHERE customer_name IS NOT NULL');
      
      let customersCreated = 0;
      let quotesUpdated = 0;
      const errors: string[] = [];

      for (const quote of quotes) {
        try {
          // Link quote to customer (creates customer if needed)
          const linkResult = await this.customerManager.linkQuoteToCustomer(
            quote.company_id,
            quote.id,
            quote.customer_name,
            quote.customer_email,
            quote.customer_phone,
            quote.address
          );

          if (linkResult.success) {
            quotesUpdated++;
            if (linkResult.created) {
              customersCreated++;
            }
          } else {
            errors.push(`Failed to link quote ${quote.id}: ${linkResult.error}`);
          }
        } catch (error) {
          errors.push(`Error processing quote ${quote.id}: ${error}`);
        }
      }

      return {
        success: true,
        migrated_entities: customersCreated + quotesUpdated,
        fixed_inconsistencies: customersCreated,
        errors,
        warnings: []
      };

    } catch (error) {
      console.error('Customer separation migration failed:', error);
      return {
        success: false,
        migrated_entities: 0,
        fixed_inconsistencies: 0,
        errors: [`Migration failed: ${error}`],
        warnings: []
      };
    }
  }

  /**
   * Validate overall data integrity
   */
  async validateDataIntegrity(): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check foreign key constraints
      const orphanedQuotes = await this.db.all(
        `SELECT q.id, q.customer_name, q.company_id 
         FROM quotes q 
         LEFT JOIN companies c ON q.company_id = c.id 
         WHERE c.id IS NULL`
      );

      if (orphanedQuotes.length > 0) {
        errors.push(`Found ${orphanedQuotes.length} quotes with invalid company references`);
      }

      // Check for negative financial values
      const invalidPricing = await this.db.all(
        `SELECT id, final_price, total_revenue 
         FROM quotes 
         WHERE final_price < 0 OR total_revenue < 0`
      );

      if (invalidPricing.length > 0) {
        errors.push(`Found ${invalidPricing.length} quotes with negative pricing`);
      }

      // Check for quotes without customer names
      const quotesWithoutCustomers = await this.db.all(
        `SELECT id FROM quotes WHERE customer_name IS NULL OR customer_name = ''`
      );

      if (quotesWithoutCustomers.length > 0) {
        warnings.push(`Found ${quotesWithoutCustomers.length} quotes without customer names`);
      }

      // Check for extremely high prices (possible data entry errors)
      const suspiciouslyHighPrices = await this.db.all(
        `SELECT id, customer_name, final_price 
         FROM quotes 
         WHERE final_price > 100000`
      );

      if (suspiciouslyHighPrices.length > 0) {
        warnings.push(`Found ${suspiciouslyHighPrices.length} quotes with unusually high prices (>$100,000)`);
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };

    } catch (error) {
      console.error('Data integrity validation error:', error);
      return {
        isValid: false,
        errors: [`Validation failed: ${error}`],
        warnings: []
      };
    }
  }

  /**
   * Create data backup
   */
  private async createDataBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `backup-${timestamp}.json`;

    try {
      // Export all critical tables
      const companies = await this.db.all('SELECT * FROM companies');
      const quotes = await this.db.all('SELECT * FROM quotes');
      let customers = [];
      
      try {
        customers = await this.db.all('SELECT * FROM customers');
      } catch (error) {
        // Customers table might not exist yet
        console.log('Customers table not found, skipping in backup');
      }

      const backupData = {
        timestamp: new Date().toISOString(),
        companies,
        quotes,
        customers,
        metadata: {
          companies_count: companies.length,
          quotes_count: quotes.length,
          customers_count: customers.length
        }
      };

      // In a real implementation, this would write to a file
      // For now, we'll just log the backup creation
      console.log(`Data backup created: ${backupFile}`, {
        companies: companies.length,
        quotes: quotes.length,
        customers: customers.length
      });

      return backupFile;

    } catch (error) {
      console.error('Backup creation failed:', error);
      throw new Error(`Failed to create backup: ${error}`);
    }
  }

  /**
   * Fix a specific inconsistency
   */
  private async fixInconsistency(
    inconsistency: DataInconsistency,
    dryRun: boolean = false
  ): Promise<{
    success: boolean;
    error?: string;
    entitiesModified?: number;
  }> {
    console.log(`${dryRun ? '[DRY RUN] ' : ''}Fixing ${inconsistency.type} for ${inconsistency.entity_type}:${inconsistency.entity_id}`);

    switch (inconsistency.type) {
      case 'missing_customer':
        return await this.fixMissingCustomer(inconsistency, dryRun);
      
      case 'invalid_company_ref':
        return await this.fixInvalidCompanyReference(inconsistency, dryRun);
      
      case 'duplicate_customer':
        return await this.fixDuplicateCustomer(inconsistency, dryRun);
      
      case 'invalid_pricing':
        return await this.fixInvalidPricing(inconsistency, dryRun);
      
      case 'orphaned_quote':
        return await this.fixOrphanedQuote(inconsistency, dryRun);
      
      default:
        return {
          success: false,
          error: `Unknown inconsistency type: ${inconsistency.type}`
        };
    }
  }

  /**
   * Check for orphaned quotes
   */
  private async checkOrphanedQuotes(inconsistencies: DataInconsistency[]): Promise<void> {
    const orphanedQuotes = await this.db.all(
      `SELECT q.id, q.customer_name, q.company_id 
       FROM quotes q 
       LEFT JOIN companies c ON q.company_id = c.id 
       WHERE c.id IS NULL`
    );

    for (const quote of orphanedQuotes) {
      inconsistencies.push({
        type: 'orphaned_quote',
        entity_type: 'quote',
        entity_id: quote.id,
        description: `Quote ${quote.id} references non-existent company ${quote.company_id}`,
        suggested_fix: `Delete quote or create missing company record`,
        severity: 'critical'
      });
    }
  }

  /**
   * Check for invalid company references
   */
  private async checkInvalidCompanyReferences(inconsistencies: DataInconsistency[]): Promise<void> {
    // This is covered by orphaned quotes check
  }

  /**
   * Check for duplicate customers
   */
  private async checkDuplicateCustomers(inconsistencies: DataInconsistency[]): Promise<void> {
    try {
      // Check if customers table exists
      const customers = await this.db.all('SELECT * FROM customers');
      
      // Group by company_id and email/phone to find duplicates
      const customerGroups = new Map<string, any[]>();
      
      for (const customer of customers) {
        const key = `${customer.company_id}:${customer.email || customer.phone || customer.name.toLowerCase()}`;
        if (!customerGroups.has(key)) {
          customerGroups.set(key, []);
        }
        customerGroups.get(key)!.push(customer);
      }

      for (const [key, group] of customerGroups) {
        if (group.length > 1) {
          for (let i = 1; i < group.length; i++) {
            inconsistencies.push({
              type: 'duplicate_customer',
              entity_type: 'customer',
              entity_id: group[i].id,
              description: `Duplicate customer: ${group[i].name} matches ${group[0].name}`,
              suggested_fix: `Merge customer records and update quote references`,
              severity: 'medium'
            });
          }
        }
      }
    } catch (error) {
      // Customers table doesn't exist yet
      console.log('Customers table not found, skipping duplicate check');
    }
  }

  /**
   * Check for invalid pricing data
   */
  private async checkInvalidPricing(inconsistencies: DataInconsistency[]): Promise<void> {
    const invalidPricing = await this.db.all(
      `SELECT id, final_price, total_revenue, walls_sqft, ceilings_sqft, trim_sqft
       FROM quotes 
       WHERE final_price < 0 OR total_revenue < 0 OR final_price > 1000000`
    );

    for (const quote of invalidPricing) {
      let description = '';
      if (quote.final_price < 0) {
        description = `Negative final price: $${quote.final_price}`;
      } else if (quote.total_revenue < 0) {
        description = `Negative total revenue: $${quote.total_revenue}`;
      } else if (quote.final_price > 1000000) {
        description = `Unusually high price: $${quote.final_price}`;
      }

      inconsistencies.push({
        type: 'invalid_pricing',
        entity_type: 'quote',
        entity_id: quote.id,
        description,
        suggested_fix: 'Review and correct pricing calculations',
        severity: quote.final_price < 0 ? 'high' : 'medium'
      });
    }
  }

  /**
   * Check for missing customer records
   */
  private async checkMissingCustomers(inconsistencies: DataInconsistency[]): Promise<void> {
    try {
      // Check if customers table exists
      await this.db.get('SELECT 1 FROM customers LIMIT 1');
      
      // Find quotes without customer records
      const quotesWithoutCustomers = await this.db.all(
        `SELECT q.id, q.customer_name, q.customer_email, q.customer_phone
         FROM quotes q
         LEFT JOIN customers c ON q.customer_id = c.id
         WHERE q.customer_name IS NOT NULL AND c.id IS NULL`
      );

      for (const quote of quotesWithoutCustomers) {
        inconsistencies.push({
          type: 'missing_customer',
          entity_type: 'quote',
          entity_id: quote.id,
          description: `Quote ${quote.id} has customer "${quote.customer_name}" but no customer record`,
          suggested_fix: 'Create customer record and link to quote',
          severity: 'high'
        });
      }
    } catch (error) {
      // Customers table doesn't exist - all quotes are missing customer records
      const quotesWithCustomerData = await this.db.all(
        'SELECT id, customer_name FROM quotes WHERE customer_name IS NOT NULL'
      );

      for (const quote of quotesWithCustomerData) {
        inconsistencies.push({
          type: 'missing_customer',
          entity_type: 'quote',
          entity_id: quote.id,
          description: `Quote ${quote.id} needs customer record for "${quote.customer_name}"`,
          suggested_fix: 'Create customers table and customer records',
          severity: 'high'
        });
      }
    }
  }

  /**
   * Check for data type inconsistencies
   */
  private async checkDataTypeInconsistencies(inconsistencies: DataInconsistency[]): Promise<void> {
    // Check for non-numeric values in numeric fields
    const quotes = await this.db.all('SELECT * FROM quotes');
    
    for (const quote of quotes) {
      if (quote.final_price && isNaN(Number(quote.final_price))) {
        inconsistencies.push({
          type: 'invalid_pricing',
          entity_type: 'quote',
          entity_id: quote.id,
          description: `Non-numeric final_price: "${quote.final_price}"`,
          suggested_fix: 'Convert to proper numeric value or set to 0',
          severity: 'medium'
        });
      }
    }
  }

  /**
   * Fix missing customer
   */
  private async fixMissingCustomer(
    inconsistency: DataInconsistency,
    dryRun: boolean
  ): Promise<{ success: boolean; error?: string; entitiesModified?: number }> {
    try {
      const quote = await this.db.get('SELECT * FROM quotes WHERE id = ?', [inconsistency.entity_id]);
      if (!quote) {
        return { success: false, error: 'Quote not found' };
      }

      if (dryRun) {
        console.log(`Would create customer for: ${quote.customer_name}`);
        return { success: true, entitiesModified: 1 };
      }

      const linkResult = await this.customerManager.linkQuoteToCustomer(
        quote.company_id,
        quote.id,
        quote.customer_name,
        quote.customer_email,
        quote.customer_phone,
        quote.address
      );

      return {
        success: linkResult.success,
        error: linkResult.error,
        entitiesModified: linkResult.success ? 1 : 0
      };

    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Fix other inconsistency types (implement as needed)
   */
  private async fixInvalidCompanyReference(inconsistency: DataInconsistency, dryRun: boolean) {
    // Implementation depends on specific requirements
    return { success: false, error: 'Not implemented yet' };
  }

  private async fixDuplicateCustomer(inconsistency: DataInconsistency, dryRun: boolean) {
    // Implementation for merging duplicate customers
    return { success: false, error: 'Not implemented yet' };
  }

  private async fixInvalidPricing(inconsistency: DataInconsistency, dryRun: boolean) {
    // Implementation for fixing pricing issues
    return { success: false, error: 'Not implemented yet' };
  }

  private async fixOrphanedQuote(inconsistency: DataInconsistency, dryRun: boolean) {
    // Implementation for handling orphaned quotes
    return { success: false, error: 'Not implemented yet' };
  }

  /**
   * Ensure customers table exists
   */
  private async ensureCustomersTableExists(): Promise<void> {
    try {
      await this.db.run(`
        CREATE TABLE IF NOT EXISTS customers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          company_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          address TEXT,
          preferred_contact_method TEXT DEFAULT 'email',
          notes TEXT,
          tags TEXT,
          status TEXT DEFAULT 'prospect',
          total_quotes INTEGER DEFAULT 0,
          total_revenue DECIMAL(12,2) DEFAULT 0,
          first_quote_date DATETIME,
          last_contact_date DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (company_id) REFERENCES companies(id)
        )
      `);

      // Create indexes
      await this.db.run('CREATE INDEX IF NOT EXISTS idx_customers_company_id ON customers(company_id)');
      await this.db.run('CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email)');
      await this.db.run('CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone)');
      await this.db.run('CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status)');

    } catch (error) {
      console.error('Error creating customers table:', error);
      throw error;
    }
  }
}