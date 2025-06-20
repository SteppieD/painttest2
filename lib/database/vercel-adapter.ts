import { sql } from '@vercel/postgres';

// Vercel Postgres adapter for the painting quote app
export class VercelDatabaseAdapter {
  async initializeSchema() {
    try {
      console.log('Initializing Vercel Postgres schema...');

      // Create companies table
      await sql`
        CREATE TABLE IF NOT EXISTS companies (
          id SERIAL PRIMARY KEY,
          access_code VARCHAR(50) UNIQUE NOT NULL,
          company_name VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          email VARCHAR(255),
          logo_url VARCHAR(500),
          default_walls_rate DECIMAL(10,2) DEFAULT 3.00,
          default_ceilings_rate DECIMAL(10,2) DEFAULT 2.00,
          default_trim_rate DECIMAL(10,2) DEFAULT 1.92,
          default_walls_paint_cost DECIMAL(10,2) DEFAULT 26.00,
          default_ceilings_paint_cost DECIMAL(10,2) DEFAULT 25.00,
          default_trim_paint_cost DECIMAL(10,2) DEFAULT 35.00,
          default_labor_percentage INTEGER DEFAULT 30,
          default_paint_coverage INTEGER DEFAULT 350,
          default_sundries_percentage INTEGER DEFAULT 12,
          tax_rate DECIMAL(10,2) DEFAULT 0,
          tax_on_materials_only BOOLEAN DEFAULT FALSE,
          tax_label VARCHAR(50) DEFAULT 'Tax',
          quote_limit INTEGER DEFAULT NULL,
          is_trial BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;

      // Create quotes table
      await sql`
        CREATE TABLE IF NOT EXISTS quotes (
          id SERIAL PRIMARY KEY,
          company_id INTEGER NOT NULL REFERENCES companies(id),
          quote_id VARCHAR(50) UNIQUE NOT NULL,
          customer_name VARCHAR(255) NOT NULL,
          customer_email VARCHAR(255),
          customer_phone VARCHAR(50),
          address TEXT,
          project_type VARCHAR(100),
          rooms TEXT,
          paint_quality VARCHAR(100),
          prep_work TEXT,
          timeline VARCHAR(100),
          special_requests TEXT,
          walls_sqft INTEGER DEFAULT 0,
          ceilings_sqft INTEGER DEFAULT 0,
          trim_sqft INTEGER DEFAULT 0,
          walls_rate DECIMAL(10,2) DEFAULT 3.00,
          ceilings_rate DECIMAL(10,2) DEFAULT 2.00,
          trim_rate DECIMAL(10,2) DEFAULT 1.92,
          walls_paint_cost DECIMAL(10,2) DEFAULT 26.00,
          ceilings_paint_cost DECIMAL(10,2) DEFAULT 25.00,
          trim_paint_cost DECIMAL(10,2) DEFAULT 35.00,
          total_revenue DECIMAL(12,2) DEFAULT 0,
          total_materials DECIMAL(12,2) DEFAULT 0,
          paint_cost DECIMAL(12,2) DEFAULT 0,
          sundries_cost DECIMAL(12,2) DEFAULT 0,
          sundries_percentage INTEGER DEFAULT 12,
          projected_labor DECIMAL(12,2) DEFAULT 0,
          labor_percentage INTEGER DEFAULT 30,
          projected_profit DECIMAL(12,2) DEFAULT 0,
          paint_coverage INTEGER DEFAULT 350,
          tax_rate DECIMAL(10,2) DEFAULT 0,
          tax_amount DECIMAL(12,2) DEFAULT 0,
          subtotal DECIMAL(12,2) DEFAULT 0,
          base_cost DECIMAL(12,2),
          markup_percentage DECIMAL(10,2),
          final_price DECIMAL(12,2),
          room_data TEXT,
          room_count INTEGER,
          status VARCHAR(50) DEFAULT 'pending',
          conversation_summary TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;

      // Create indexes
      await sql`CREATE INDEX IF NOT EXISTS idx_quotes_company_id ON quotes(company_id);`;
      await sql`CREATE INDEX IF NOT EXISTS idx_quotes_quote_id ON quotes(quote_id);`;
      await sql`CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);`;

      console.log('✓ Vercel Postgres schema initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize Vercel Postgres schema:', error);
      return false;
    }
  }

  async createTrialCompany(data: {
    accessCode: string;
    companyName: string;
    email: string;
    phone?: string;
  }) {
    const result = await sql`
      INSERT INTO companies (
        access_code, company_name, phone, email,
        default_walls_rate, default_ceilings_rate, default_trim_rate,
        default_walls_paint_cost, default_ceilings_paint_cost, default_trim_paint_cost,
        default_labor_percentage, default_paint_coverage, default_sundries_percentage,
        tax_rate, tax_on_materials_only, tax_label,
        quote_limit, is_trial
      ) VALUES (
        ${data.accessCode}, ${data.companyName}, ${data.phone || null}, ${data.email},
        3.00, 2.00, 1.92,
        26.00, 25.00, 35.00,
        30, 350, 12,
        0, false, 'Tax',
        1, true
      ) RETURNING id
    `;
    
    return result.rows[0];
  }

  async checkExistingCompany(accessCode: string, email: string) {
    const codeCheck = await sql`SELECT id FROM companies WHERE access_code = ${accessCode}`;
    const emailCheck = await sql`SELECT id FROM companies WHERE email = ${email}`;
    
    return {
      codeExists: codeCheck.rows.length > 0,
      emailExists: emailCheck.rows.length > 0
    };
  }

  async seedDemoCompanies() {
    try {
      const count = await sql`SELECT COUNT(*) as count FROM companies`;
      
      if (parseInt(count.rows[0].count) === 0) {
        console.log('Seeding demo companies...');
        
        const companies = [
          ["DEMO2024", "Demo Painting Company", "(555) 123-4567", "demo@paintingcompany.com"],
          ["PAINTER001", "Smith Painting LLC", "(555) 987-6543", "info@smithpainting.com"],
          ["CONTRACTOR123", "Elite Contractors", "(555) 456-7890", "quotes@elitecontractors.com"]
        ];
        
        for (const [accessCode, companyName, phone, email] of companies) {
          await sql`
            INSERT INTO companies (access_code, company_name, phone, email) 
            VALUES (${accessCode}, ${companyName}, ${phone}, ${email})
          `;
        }
        
        console.log('✓ Demo companies seeded successfully');
      }
    } catch (error) {
      console.error('Error seeding demo companies:', error);
    }
  }
}

export const vercelDb = new VercelDatabaseAdapter();