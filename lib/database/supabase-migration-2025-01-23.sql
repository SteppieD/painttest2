-- Supabase Migration for PaintQuoteApp
-- Date: 2025-01-23
-- Purpose: Add missing tables for paint products and company preferences
-- 
-- This migration adds the necessary tables for:
-- 1. Company paint products (favorite paints feature)
-- 2. Company preferences (setup wizard completion tracking)
-- 3. Additional fields that may be missing from the quotes table
--
-- Run this in your Supabase SQL Editor after the initial schema

-- ============================================
-- PART 1: Add missing tables
-- ============================================

-- Drop the table if it exists to ensure clean creation
DROP TABLE IF EXISTS public.company_paint_products CASCADE;

-- Company paint products table (for favorite paints)
CREATE TABLE public.company_paint_products (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    project_type VARCHAR(50) NOT NULL,
    product_category VARCHAR(50) NOT NULL,
    supplier VARCHAR(100) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_line VARCHAR(100),
    cost_per_gallon DECIMAL(10,2) NOT NULL,
    display_order INTEGER DEFAULT 1,
    sheen VARCHAR(50),
    coverage_per_gallon INTEGER DEFAULT 350,
    is_active BOOLEAN DEFAULT TRUE,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company preferences table (for setup completion status)
CREATE TABLE IF NOT EXISTS public.company_preferences (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL UNIQUE REFERENCES public.companies(id) ON DELETE CASCADE,
    default_markup INTEGER DEFAULT 20,
    setup_completed BOOLEAN DEFAULT FALSE,
    favorite_products_selected BOOLEAN DEFAULT FALSE,
    welcome_shown BOOLEAN DEFAULT FALSE,
    project_types_selected TEXT, -- JSON array of selected project types
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company branding table (for logos and colors)
CREATE TABLE IF NOT EXISTS public.company_branding (
    id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL UNIQUE REFERENCES public.companies(id) ON DELETE CASCADE,
    logo_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#3182ce',
    secondary_color VARCHAR(7) DEFAULT '#2d3748',
    accent_color VARCHAR(7) DEFAULT '#38a169',
    text_color VARCHAR(7) DEFAULT '#1a202c',
    background_color VARCHAR(7) DEFAULT '#ffffff',
    button_color VARCHAR(7) DEFAULT '#4299e1',
    company_tagline TEXT,
    email_signature TEXT,
    quote_terms TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PART 2: Add missing columns to existing tables
-- ============================================

-- Add missing columns to quotes table if they don't exist
DO $$ 
BEGIN
    -- Add quote_amount column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'quotes' 
                   AND column_name = 'quote_amount') THEN
        ALTER TABLE public.quotes ADD COLUMN quote_amount DECIMAL(12,2);
    END IF;

    -- Add wall_linear_feet column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'quotes' 
                   AND column_name = 'wall_linear_feet') THEN
        ALTER TABLE public.quotes ADD COLUMN wall_linear_feet INTEGER;
    END IF;

    -- Add ceiling_height column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'quotes' 
                   AND column_name = 'ceiling_height') THEN
        ALTER TABLE public.quotes ADD COLUMN ceiling_height DECIMAL(10,2);
    END IF;

    -- Add ceiling_area column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'quotes' 
                   AND column_name = 'ceiling_area') THEN
        ALTER TABLE public.quotes ADD COLUMN ceiling_area INTEGER;
    END IF;

    -- Add number_of_doors column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'quotes' 
                   AND column_name = 'number_of_doors') THEN
        ALTER TABLE public.quotes ADD COLUMN number_of_doors INTEGER;
    END IF;

    -- Add number_of_windows column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'quotes' 
                   AND column_name = 'number_of_windows') THEN
        ALTER TABLE public.quotes ADD COLUMN number_of_windows INTEGER;
    END IF;

    -- Add notes column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'quotes' 
                   AND column_name = 'notes') THEN
        ALTER TABLE public.quotes ADD COLUMN notes TEXT;
    END IF;

    -- Add payment_terms column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'quotes' 
                   AND column_name = 'payment_terms') THEN
        ALTER TABLE public.quotes ADD COLUMN payment_terms TEXT; -- JSON
    END IF;
END $$;

-- ============================================
-- PART 3: Create indexes for performance
-- ============================================

-- Indexes for company_paint_products
CREATE INDEX IF NOT EXISTS idx_company_paint_products_user_id 
    ON public.company_paint_products(user_id);
CREATE INDEX IF NOT EXISTS idx_company_paint_products_project_type 
    ON public.company_paint_products(project_type);
CREATE INDEX IF NOT EXISTS idx_company_paint_products_product_category 
    ON public.company_paint_products(product_category);
CREATE INDEX IF NOT EXISTS idx_company_paint_products_is_favorite 
    ON public.company_paint_products(is_favorite);

-- Indexes for company_preferences
CREATE INDEX IF NOT EXISTS idx_company_preferences_company_id 
    ON public.company_preferences(company_id);
CREATE INDEX IF NOT EXISTS idx_company_preferences_setup_completed 
    ON public.company_preferences(setup_completed);

-- Indexes for company_branding
CREATE INDEX IF NOT EXISTS idx_company_branding_company_id 
    ON public.company_branding(company_id);

-- ============================================
-- PART 4: Enable Row Level Security (RLS)
-- ============================================

ALTER TABLE public.company_paint_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_branding ENABLE ROW LEVEL SECURITY;

-- Create policies (permissive for now, can be restricted later)
CREATE POLICY "Allow all for company_paint_products" 
    ON public.company_paint_products FOR ALL USING (true);
CREATE POLICY "Allow all for company_preferences" 
    ON public.company_preferences FOR ALL USING (true);
CREATE POLICY "Allow all for company_branding" 
    ON public.company_branding FOR ALL USING (true);

-- ============================================
-- PART 5: Add update triggers
-- ============================================

-- Create update triggers for new tables
CREATE TRIGGER update_company_paint_products_updated_at 
    BEFORE UPDATE ON public.company_paint_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_preferences_updated_at 
    BEFORE UPDATE ON public.company_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_branding_updated_at 
    BEFORE UPDATE ON public.company_branding
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PART 6: Insert default paint products for demo companies
-- ============================================

-- Insert default preferences for existing companies
INSERT INTO public.company_preferences (company_id, default_markup, setup_completed)
SELECT id, 20, false FROM public.companies
WHERE id NOT IN (SELECT company_id FROM public.company_preferences)
ON CONFLICT (company_id) DO NOTHING;

-- Insert some sample paint products for DEMO2024 company
DO $$
DECLARE
    demo_company_id INTEGER;
BEGIN
    -- Get DEMO2024 company ID
    SELECT id INTO demo_company_id FROM public.companies WHERE access_code = 'DEMO2024';
    
    IF demo_company_id IS NOT NULL THEN
        -- Insert sample interior paint products
        INSERT INTO public.company_paint_products 
            (user_id, project_type, product_category, supplier, product_name, product_line, cost_per_gallon, is_favorite, display_order)
        VALUES 
            -- Interior favorites
            (demo_company_id, 'interior', 'walls', 'Sherwin-Williams', 'ProClassic', 'Interior Acrylic', 58.00, true, 1),
            (demo_company_id, 'interior', 'ceilings', 'Benjamin Moore', 'Waterborne Ceiling Paint', 'Ultra Flat', 45.00, true, 1),
            (demo_company_id, 'interior', 'trim', 'Sherwin-Williams', 'ProClassic', 'Alkyd Enamel', 68.00, true, 1),
            -- Additional interior options
            (demo_company_id, 'interior', 'walls', 'Benjamin Moore', 'Regal Select', 'Interior', 54.00, false, 2),
            (demo_company_id, 'interior', 'walls', 'PPG', 'Diamond', 'Interior Satin', 42.00, false, 3),
            -- Exterior favorites
            (demo_company_id, 'exterior', 'siding', 'Sherwin-Williams', 'Duration', 'Exterior Acrylic', 65.00, true, 1),
            (demo_company_id, 'exterior', 'trim', 'Benjamin Moore', 'Advance', 'Waterborne Alkyd', 72.00, true, 1),
            (demo_company_id, 'exterior', 'doors', 'Sherwin-Williams', 'ProClassic', 'Alkyd Enamel', 68.00, true, 1)
        ON CONFLICT DO NOTHING;
        
        -- Mark setup as completed for DEMO2024
        UPDATE public.company_preferences 
        SET setup_completed = true, favorite_products_selected = true 
        WHERE company_id = demo_company_id;
    END IF;
END $$;

-- ============================================
-- PART 7: Verification queries (optional)
-- ============================================

-- Run these to verify the migration was successful:
-- SELECT COUNT(*) FROM public.company_paint_products;
-- SELECT COUNT(*) FROM public.company_preferences;
-- SELECT COUNT(*) FROM public.company_branding;
-- SELECT * FROM public.company_preferences WHERE company_id IN (SELECT id FROM public.companies WHERE access_code = 'DEMO2024');

-- ============================================
-- END OF MIGRATION
-- ============================================