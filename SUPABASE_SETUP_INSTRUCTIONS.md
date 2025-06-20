# Supabase Database Setup Instructions

## Step 1: Run this SQL in Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project (opcbwsfdhergcjjobrip)
3. Click "SQL Editor" on the left sidebar
4. Copy the SQL below and paste it
5. Click "Run" to execute

```sql
-- Supabase PostgreSQL Schema for PaintQuoteApp
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE IF NOT EXISTS public.companies (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quotes table
CREATE TABLE IF NOT EXISTS public.quotes (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quotes_company_id ON public.quotes(company_id);
CREATE INDEX IF NOT EXISTS idx_quotes_quote_id ON public.quotes(quote_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);
CREATE INDEX IF NOT EXISTS idx_companies_access_code ON public.companies(access_code);
CREATE INDEX IF NOT EXISTS idx_companies_email ON public.companies(email);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop triggers if they exist, then recreate
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
DROP TRIGGER IF EXISTS update_quotes_updated_at ON public.quotes;

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON public.quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) policies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate
DROP POLICY IF EXISTS "Allow all for companies" ON public.companies;
DROP POLICY IF EXISTS "Allow all for quotes" ON public.quotes;

-- Allow all operations for now (you can restrict later)
CREATE POLICY "Allow all for companies" ON public.companies FOR ALL USING (true);
CREATE POLICY "Allow all for quotes" ON public.quotes FOR ALL USING (true);

-- Insert demo data
INSERT INTO public.companies (access_code, company_name, phone, email) VALUES
    ('DEMO2024', 'Demo Painting Company', '(555) 123-4567', 'demo@paintingcompany.com'),
    ('PAINTER001', 'Smith Painting LLC', '(555) 987-6543', 'info@smithpainting.com'),
    ('CONTRACTOR123', 'Elite Contractors', '(555) 456-7890', 'quotes@elitecontractors.com')
ON CONFLICT (access_code) DO NOTHING;
```

## Step 2: Verify Environment Variables in Vercel

Make sure these are set in your Vercel dashboard under Settings → Environment Variables:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: `https://opcbwsfdhergcjjobrip.supabase.co`
   - Environment: Production

2. **SUPABASE_SERVICE_ROLE_KEY**
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wY2J3c2ZkaGVyZ2Nqam9icnlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE0NTIxMSwiZXhwIjoyMDYzNzIxMjExfQ.m2yISMmhwQjoEMmPDDN8XTFT5_ojSmlklZJJ49kuMQg`
   - Environment: Production

## Step 3: After Running SQL

1. Go to Supabase Table Editor
2. You should see two tables: `companies` and `quotes`
3. The `companies` table should have 3 demo companies (DEMO2024, PAINTER001, CONTRACTOR123)

## Step 4: Test

After setting up the database and environment variables, try the trial signup again. It should work!

## Troubleshooting

If you still get errors:
1. Check Vercel function logs for specific error messages
2. Verify the SQL ran successfully (no red error messages)
3. Confirm environment variables are set correctly
4. Try redeploying in Vercel after adding environment variables