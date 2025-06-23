-- Supabase Migration Final for PaintQuoteApp
-- Date: 2025-01-23
-- Purpose: Safely add all missing columns and data without errors
-- 
-- This migration handles all edge cases and existing structures

-- ============================================
-- PART 1: Add missing columns to existing tables
-- ============================================

-- Add is_favorite column to company_paint_products if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'company_paint_products' 
                   AND column_name = 'is_favorite') THEN
        ALTER TABLE public.company_paint_products ADD COLUMN is_favorite BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Add missing columns to quotes table
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
-- PART 2: Create missing tables (if they don't exist)
-- ============================================

-- Company preferences table
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

-- Company branding table
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
-- PART 3: Create indexes (if they don't exist)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_company_paint_products_user_id 
    ON public.company_paint_products(user_id);
CREATE INDEX IF NOT EXISTS idx_company_paint_products_project_type 
    ON public.company_paint_products(project_type);
CREATE INDEX IF NOT EXISTS idx_company_paint_products_product_category 
    ON public.company_paint_products(product_category);
CREATE INDEX IF NOT EXISTS idx_company_paint_products_is_favorite 
    ON public.company_paint_products(is_favorite) WHERE is_favorite = true;

CREATE INDEX IF NOT EXISTS idx_company_preferences_company_id 
    ON public.company_preferences(company_id);
CREATE INDEX IF NOT EXISTS idx_company_preferences_setup_completed 
    ON public.company_preferences(setup_completed);

CREATE INDEX IF NOT EXISTS idx_company_branding_company_id 
    ON public.company_branding(company_id);

-- ============================================
-- PART 4: Insert/Update data
-- ============================================

-- Insert default preferences for companies that don't have them
INSERT INTO public.company_preferences (company_id, default_markup, setup_completed)
SELECT id, 20, false FROM public.companies
WHERE id NOT IN (SELECT company_id FROM public.company_preferences)
ON CONFLICT (company_id) DO NOTHING;

-- Add sample paint products for DEMO2024 if they don't exist
DO $$
DECLARE
    demo_company_id INTEGER;
    existing_count INTEGER;
BEGIN
    -- Get DEMO2024 company ID
    SELECT id INTO demo_company_id FROM public.companies WHERE access_code = 'DEMO2024';
    
    IF demo_company_id IS NOT NULL THEN
        -- Check if paint products already exist for this company
        SELECT COUNT(*) INTO existing_count 
        FROM public.company_paint_products 
        WHERE user_id = demo_company_id;
        
        -- Only insert if no products exist
        IF existing_count = 0 THEN
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
                (demo_company_id, 'interior', 'ceilings', 'PPG', 'Speedhide', 'Ceiling White', 32.00, false, 2),
                (demo_company_id, 'interior', 'trim', 'Benjamin Moore', 'Advance', 'Waterborne Alkyd', 72.00, false, 2),
                -- Exterior favorites
                (demo_company_id, 'exterior', 'siding', 'Sherwin-Williams', 'Duration', 'Exterior Acrylic', 65.00, true, 1),
                (demo_company_id, 'exterior', 'trim', 'Benjamin Moore', 'Advance', 'Waterborne Alkyd', 72.00, true, 1),
                (demo_company_id, 'exterior', 'doors', 'Sherwin-Williams', 'ProClassic', 'Alkyd Enamel', 68.00, true, 1),
                -- Additional exterior options
                (demo_company_id, 'exterior', 'siding', 'Benjamin Moore', 'Aura', 'Exterior', 75.00, false, 2),
                (demo_company_id, 'exterior', 'siding', 'PPG', 'Manor Hall', 'Exterior', 55.00, false, 3);
                
            -- Update setup status for DEMO2024
            UPDATE public.company_preferences 
            SET setup_completed = true, 
                favorite_products_selected = true,
                project_types_selected = '["interior", "exterior"]'
            WHERE company_id = demo_company_id;
        ELSE
            -- Just ensure is_favorite is set for at least 3 products per category
            UPDATE public.company_paint_products
            SET is_favorite = true
            WHERE user_id = demo_company_id
            AND id IN (
                SELECT id FROM (
                    SELECT id, 
                           ROW_NUMBER() OVER (PARTITION BY project_type, product_category ORDER BY cost_per_gallon DESC) as rn
                    FROM public.company_paint_products
                    WHERE user_id = demo_company_id
                ) ranked
                WHERE rn = 1
            );
        END IF;
    END IF;
END $$;

-- ============================================
-- PART 5: Verification queries
-- ============================================

-- Show migration results
DO $$
BEGIN
    RAISE NOTICE '=== Migration Complete ===';
END $$;

-- Check paint products
SELECT 'Paint Products Summary:' as info;
SELECT 
    COUNT(*) as total_products,
    COUNT(CASE WHEN is_favorite THEN 1 END) as favorite_products,
    COUNT(DISTINCT user_id) as companies_with_products
FROM public.company_paint_products;

-- Check company setup status
SELECT 'Company Setup Status:' as info;
SELECT 
    c.access_code,
    c.company_name,
    COALESCE(cp.setup_completed, false) as setup_completed,
    COALESCE(cp.favorite_products_selected, false) as favorites_selected,
    COUNT(pp.id) as product_count,
    COUNT(CASE WHEN pp.is_favorite THEN 1 END) as favorite_count
FROM public.companies c
LEFT JOIN public.company_preferences cp ON c.id = cp.company_id
LEFT JOIN public.company_paint_products pp ON c.id = pp.user_id
GROUP BY c.id, c.access_code, c.company_name, cp.setup_completed, cp.favorite_products_selected
ORDER BY c.access_code;

-- Show sample favorites for DEMO2024
SELECT 'DEMO2024 Favorite Products:' as info;
SELECT 
    pp.project_type,
    pp.product_category,
    pp.supplier || ' ' || pp.product_name as product,
    pp.cost_per_gallon,
    pp.is_favorite
FROM public.company_paint_products pp
JOIN public.companies c ON pp.user_id = c.id
WHERE c.access_code = 'DEMO2024'
AND pp.is_favorite = true
ORDER BY pp.project_type, pp.product_category;

-- ============================================
-- END OF MIGRATION
-- ============================================