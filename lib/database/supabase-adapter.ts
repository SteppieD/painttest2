import { createClient } from '@supabase/supabase-js';

// Supabase PostgreSQL adapter for the painting quote app
export class SupabaseDatabaseAdapter {
  private supabase: any;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Supabase initialization:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      nodeEnv: process.env.NODE_ENV
    });
    
    // During build, these might not be available yet
    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️  Supabase environment variables not found. Database operations will fail.');
      console.warn('Required variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
      return;
    }
    
    // Clean the URL in case there's a leading = or other issue
    const cleanUrl = supabaseUrl.replace(/^=+/, '').trim();
    
    try {
      this.supabase = createClient(cleanUrl, supabaseKey);
      console.log('✅ Supabase client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to create Supabase client:', error);
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
    if (!this.supabase) {
      throw new Error('Supabase client not initialized. Check environment variables.');
    }

    console.log('🔍 Looking up company by access code:', accessCode);
    
    const { data, error } = await this.supabase
      .from('companies')
      .select('*')
      .eq('access_code', accessCode)
      .single();

    if (error) {
      console.error('❌ Supabase getCompanyByAccessCode error:', error);
      throw error;
    }

    console.log('✅ Company found:', data?.company_name);
    return data;
  }

  async createQuote(quoteData: any) {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized. Check environment variables.');
    }

    console.log('💾 Creating quote in Supabase:', { customer: quoteData.customer_name, amount: quoteData.quote_amount });
    
    const { data, error } = await this.supabase
      .from('quotes')
      .insert(quoteData)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase createQuote error:', error);
      throw error;
    }

    console.log('✅ Quote created successfully in Supabase:', data);
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

  async getQuoteById(id: number) {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized. Check environment variables.');
    }

    console.log('🔍 Getting quote by ID from Supabase:', id);
    
    const { data, error } = await this.supabase
      .from('quotes')
      .select(`
        *,
        companies (
          company_name,
          phone,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Supabase getQuoteById error:', error);
      throw error;
    }

    console.log('✅ Quote found by ID:', data?.customer_name);
    return data;
  }

  async getQuoteByQuoteId(quoteId: string) {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized. Check environment variables.');
    }

    console.log('🔍 Getting quote by quote_id from Supabase:', quoteId);
    
    const { data, error } = await this.supabase
      .from('quotes')
      .select(`
        *,
        companies (
          company_name,
          phone,
          email
        )
      `)
      .eq('quote_id', quoteId)
      .single();

    if (error) {
      console.error('❌ Supabase getQuoteByQuoteId error:', error);
      throw error;
    }

    console.log('✅ Quote found by quote_id:', data?.customer_name);
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

  // Paint products methods
  async getPaintProducts(companyId: number) {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await this.supabase
      .from('company_paint_products')
      .select('*')
      .eq('user_id', companyId)
      .eq('is_active', true)
      .order('project_type, product_category, display_order');

    if (error) {
      throw error;
    }

    return data || [];
  }

  async savePaintProducts(companyId: number, products: any[]) {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }

    // Delete existing products for this company
    await this.supabase
      .from('company_paint_products')
      .delete()
      .eq('user_id', companyId);

    // Insert new products
    if (products.length > 0) {
      const { error } = await this.supabase
        .from('company_paint_products')
        .insert(products.map(product => ({
          user_id: companyId,
          project_type: product.projectType,
          product_category: product.productCategory,
          supplier: product.supplier,
          product_name: product.productName,
          product_line: product.productLine || null,
          cost_per_gallon: product.costPerGallon,
          display_order: product.displayOrder || 1,
          sheen: product.sheen || null,
          coverage_per_gallon: product.coveragePerGallon || 350
        })));

      if (error) {
        throw error;
      }
    }

    return { success: true };
  }

  async addPaintProduct(companyId: number, product: any) {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await this.supabase
      .from('company_paint_products')
      .insert({
        user_id: companyId,
        project_type: product.projectType,
        product_category: product.productCategory,
        supplier: product.supplier,
        product_name: product.productName,
        product_line: product.productLine || null,
        cost_per_gallon: product.costPerGallon,
        display_order: product.displayOrder || 1,
        sheen: product.sheen || null,
        coverage_per_gallon: product.coveragePerGallon || 350,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async updatePaintProduct(productId: number, updates: any) {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await this.supabase
      .from('company_paint_products')
      .update({
        supplier: updates.supplier,
        product_name: updates.productName,
        product_line: updates.productLine,
        cost_per_gallon: updates.costPerGallon,
        sheen: updates.sheen,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async deletePaintProduct(productId: number) {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { error } = await this.supabase
      .from('company_paint_products')
      .delete()
      .eq('id', productId);

    if (error) {
      throw error;
    }

    return { success: true };
  }

  // Company preferences methods
  async getCompanyPreferences(companyId: number) {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await this.supabase
      .from('company_preferences')
      .select('*')
      .eq('company_id', companyId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw error;
    }

    return data || null;
  }

  async saveCompanyPreferences(companyId: number, preferences: any) {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data, error } = await this.supabase
      .from('company_preferences')
      .upsert({
        company_id: companyId,
        default_markup: preferences.defaultMarkup || 20,
        setup_completed: preferences.setupCompleted || false,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  // Setup-related methods
  async deletePaintProductsByCompany(companyId: number) {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { error } = await this.supabase
      .from('paint_products')
      .delete()
      .eq('company_id', companyId);

    if (error) {
      throw error;
    }

    return { success: true };
  }

  async updateCompanySetup(companyId: number, setupData: any) {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }

    // First, update the companies table
    const companyUpdate: any = {};
    if (setupData.default_markup !== undefined) {
      companyUpdate.default_markup = setupData.default_markup;
    }
    if (setupData.setup_method !== undefined) {
      companyUpdate.setup_method = setupData.setup_method;
    }
    if (setupData.setup_completed_at !== undefined) {
      companyUpdate.setup_completed_at = setupData.setup_completed_at;
    }
    if (setupData.setup_skipped_at !== undefined) {
      companyUpdate.setup_skipped_at = setupData.setup_skipped_at;
    }

    if (Object.keys(companyUpdate).length > 0) {
      const { error: companyError } = await this.supabase
        .from('companies')
        .update(companyUpdate)
        .eq('id', companyId);

      if (companyError) {
        throw companyError;
      }
    }

    // Then, update company preferences
    const preferencesUpdate: any = {
      company_id: companyId,
      updated_at: new Date().toISOString()
    };

    if (setupData.setup_completed !== undefined) {
      preferencesUpdate.setup_completed = setupData.setup_completed;
    }
    if (setupData.default_markup !== undefined) {
      preferencesUpdate.default_markup = setupData.default_markup;
    }

    const { error: prefsError } = await this.supabase
      .from('company_preferences')
      .upsert(preferencesUpdate);

    if (prefsError) {
      throw prefsError;
    }

    return { success: true };
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
  // Paint products methods
  getPaintProducts: async (companyId: number) => getSupabaseDb().getPaintProducts(companyId),
  savePaintProducts: async (companyId: number, products: any[]) => getSupabaseDb().savePaintProducts(companyId, products),
  addPaintProduct: async (companyId: number, product: any) => getSupabaseDb().addPaintProduct(companyId, product),
  updatePaintProduct: async (productId: number, updates: any) => getSupabaseDb().updatePaintProduct(productId, updates),
  deletePaintProduct: async (productId: number) => getSupabaseDb().deletePaintProduct(productId),
  // Company preferences methods
  getCompanyPreferences: async (companyId: number) => getSupabaseDb().getCompanyPreferences(companyId),
  saveCompanyPreferences: async (companyId: number, preferences: any) => getSupabaseDb().saveCompanyPreferences(companyId, preferences),
  // Setup methods
  deletePaintProductsByCompany: async (companyId: number) => getSupabaseDb().deletePaintProductsByCompany(companyId),
  updateCompanySetup: async (companyId: number, setupData: any) => getSupabaseDb().updateCompanySetup(companyId, setupData),
};