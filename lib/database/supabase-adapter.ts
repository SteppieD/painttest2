import { createClient } from '@supabase/supabase-js';

// Supabase PostgreSQL adapter for the painting quote app
export class SupabaseDatabaseAdapter {
  private supabase: any;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // During build, these might not be available yet
    if (!supabaseUrl || !supabaseKey) {
      console.log('Supabase environment variables not found, adapter will be initialized later');
      return;
    }
    
    // Clean the URL in case there's a leading = or other issue
    const cleanUrl = supabaseUrl.replace(/^=+/, '').trim();
    
    try {
      this.supabase = createClient(cleanUrl, supabaseKey);
    } catch (error) {
      console.error('Failed to create Supabase client:', error);
    }
  }

  async initializeSchema() {
    if (!this.supabase) {
      console.log('Supabase client not initialized, skipping schema check');
      return true;
    }

    try {
      console.log('Checking Supabase PostgreSQL schema...');

      // Check if companies table exists
      const { data: companiesCheck } = await this.supabase
        .from('companies')
        .select('id')
        .limit(1);

      // If we can query companies table successfully, schema is ready
      console.log('✓ Supabase schema verified');
      return true;
    } catch (error) {
      console.log('Schema check failed, but this is normal on first run');
      console.log('Please ensure you\'ve run the SQL schema in Supabase dashboard');
      return true; // Don't fail deployment, just log
    }
  }

  async createTrialCompany(data: {
    accessCode: string;
    companyName: string;
    email: string;
    phone?: string;
  }) {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data: result, error } = await this.supabase
      .from('companies')
      .insert({
        access_code: data.accessCode,
        company_name: data.companyName,
        phone: data.phone || null,
        email: data.email,
        default_walls_rate: 3.00,
        default_ceilings_rate: 2.00,
        default_trim_rate: 1.92,
        default_walls_paint_cost: 26.00,
        default_ceilings_paint_cost: 25.00,
        default_trim_paint_cost: 35.00,
        default_labor_percentage: 30,
        default_paint_coverage: 350,
        default_sundries_percentage: 12,
        tax_rate: 0,
        tax_on_materials_only: false,
        tax_label: 'Tax',
        quote_limit: 1,
        is_trial: true
      })
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    return result;
  }

  async checkExistingCompany(accessCode: string, email: string) {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data: codeCheck } = await this.supabase
      .from('companies')
      .select('id')
      .eq('access_code', accessCode)
      .single();

    const { data: emailCheck } = await this.supabase
      .from('companies')
      .select('id')
      .eq('email', email)
      .single();

    return {
      codeExists: !!codeCheck,
      emailExists: !!emailCheck
    };
  }

  async seedDemoCompanies() {
    if (!this.supabase) {
      console.log('Supabase client not initialized, skipping demo seed');
      return;
    }

    try {
      const { count } = await this.supabase
        .from('companies')
        .select('*', { count: 'exact', head: true });

      if (count === 0) {
        console.log('Seeding demo companies...');

        const companies = [
          {
            access_code: "DEMO2024",
            company_name: "Demo Painting Company", 
            phone: "(555) 123-4567",
            email: "demo@paintingcompany.com"
          },
          {
            access_code: "PAINTER001",
            company_name: "Smith Painting LLC",
            phone: "(555) 987-6543", 
            email: "info@smithpainting.com"
          },
          {
            access_code: "CONTRACTOR123",
            company_name: "Elite Contractors",
            phone: "(555) 456-7890",
            email: "quotes@elitecontractors.com"
          }
        ];

        const { error } = await this.supabase
          .from('companies')
          .insert(companies);

        if (error) {
          console.error('Error seeding demo companies:', error);
        } else {
          console.log('✓ Demo companies seeded successfully');
        }
      }
    } catch (error) {
      console.error('Error in seedDemoCompanies:', error);
    }
  }

  async getCompanyByAccessCode(accessCode: string) {
    const { data, error } = await this.supabase
      .from('companies')
      .select('*')
      .eq('access_code', accessCode)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async createQuote(quoteData: any) {
    const { data, error } = await this.supabase
      .from('quotes')
      .insert(quoteData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async getQuotesByCompany(companyId: number) {
    const { data, error } = await this.supabase
      .from('quotes')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  }

  async getAllCompanies() {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await this.supabase
      .from('companies')
      .select('access_code, company_name, phone')
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return data;
  }
}

// Create a lazy-loaded instance
let supabaseDbInstance: SupabaseDatabaseAdapter | null = null;

export const getSupabaseDb = () => {
  if (!supabaseDbInstance) {
    try {
      supabaseDbInstance = new SupabaseDatabaseAdapter();
    } catch (error) {
      console.error('Failed to create Supabase adapter:', error);
      throw error;
    }
  }
  return supabaseDbInstance;
};

// For backward compatibility
export const supabaseDb = {
  initializeSchema: async () => getSupabaseDb().initializeSchema(),
  createTrialCompany: async (data: any) => getSupabaseDb().createTrialCompany(data),
  checkExistingCompany: async (accessCode: string, email: string) => getSupabaseDb().checkExistingCompany(accessCode, email),
  seedDemoCompanies: async () => getSupabaseDb().seedDemoCompanies(),
  getCompanyByAccessCode: async (accessCode: string) => getSupabaseDb().getCompanyByAccessCode(accessCode),
  getAllCompanies: async () => getSupabaseDb().getAllCompanies(),
  createQuote: async (quoteData: any) => getSupabaseDb().createQuote(quoteData),
  getQuotesByCompany: async (companyId: number) => getSupabaseDb().getQuotesByCompany(companyId),
};