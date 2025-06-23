-- Supabase Targeted Migration for PaintQuoteApp
-- Date: 2025-01-23
-- Purpose: Only add what's actually missing based on current state
-- 
-- Current state: All tables exist with data
-- - companies: 9 rows
-- - quotes: 5 rows  
-- - company_paint_products: 8 rows
-- - company_preferences: 3 rows

-- ============================================
-- PART 1: Add missing columns only
-- ============================================

-- Add is_favorite column to company_paint_products if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'company_paint_products' 
                   AND column_name = 'is_favorite') THEN
        ALTER TABLE public.company_paint_products ADD COLUMN is_favorite BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added is_favorite column to company_paint_products';
    ELSE
        RAISE NOTICE 'is_favorite column already exists in company_paint_products';
    END IF;
END $$;

-- Add missing columns to quotes table if they don't exist
DO $$ 
DECLARE
    missing_columns TEXT[] := ARRAY[
        'quote_amount', 'wall_linear_feet', 'ceiling_height', 'ceiling_area',
        'number_of_doors', 'number_of_windows', 'notes', 'payment_terms'
    ];
    col TEXT;
BEGIN
    FOREACH col IN ARRAY missing_columns
    LOOP
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_schema = 'public' 
                       AND table_name = 'quotes' 
                       AND column_name = col) THEN
            CASE col
                WHEN 'quote_amount' THEN
                    ALTER TABLE public.quotes ADD COLUMN quote_amount DECIMAL(12,2);
                WHEN 'wall_linear_feet' THEN
                    ALTER TABLE public.quotes ADD COLUMN wall_linear_feet INTEGER;
                WHEN 'ceiling_height' THEN
                    ALTER TABLE public.quotes ADD COLUMN ceiling_height DECIMAL(10,2);
                WHEN 'ceiling_area' THEN
                    ALTER TABLE public.quotes ADD COLUMN ceiling_area INTEGER;
                WHEN 'number_of_doors' THEN
                    ALTER TABLE public.quotes ADD COLUMN number_of_doors INTEGER;
                WHEN 'number_of_windows' THEN
                    ALTER TABLE public.quotes ADD COLUMN number_of_windows INTEGER;
                WHEN 'notes' THEN
                    ALTER TABLE public.quotes ADD COLUMN notes TEXT;
                WHEN 'payment_terms' THEN
                    ALTER TABLE public.quotes ADD COLUMN payment_terms TEXT;
            END CASE;
            RAISE NOTICE 'Added % column to quotes table', col;
        ELSE
            RAISE NOTICE '% column already exists in quotes table', col;
        END IF;
    END LOOP;
END $$;

-- ============================================
-- PART 2: Create missing indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_company_paint_products_is_favorite 
    ON public.company_paint_products(is_favorite) WHERE is_favorite = true;

CREATE INDEX IF NOT EXISTS idx_company_preferences_setup_completed 
    ON public.company_preferences(setup_completed);

-- ============================================
-- PART 3: Update existing data intelligently
-- ============================================

-- Set some existing paint products as favorites (1 per category for existing data)
UPDATE public.company_paint_products
SET is_favorite = true
WHERE id IN (
    SELECT DISTINCT ON (user_id, project_type, product_category) id
    FROM public.company_paint_products
    ORDER BY user_id, project_type, product_category, cost_per_gallon DESC
);

-- Update company_preferences for companies that don't have preferences yet
INSERT INTO public.company_preferences (company_id, default_markup, setup_completed, favorite_products_selected)
SELECT 
    c.id, 
    20, 
    CASE WHEN EXISTS(SELECT 1 FROM public.company_paint_products WHERE user_id = c.id) THEN true ELSE false END,
    CASE WHEN EXISTS(SELECT 1 FROM public.company_paint_products WHERE user_id = c.id) THEN true ELSE false END
FROM public.companies c
WHERE NOT EXISTS (
    SELECT 1 FROM public.company_preferences cp 
    WHERE cp.company_id = c.id
);

-- ============================================
-- PART 4: Verification
-- ============================================

-- Show what we accomplished
SELECT '=== Migration Results ===' as status;

-- Show column additions
SELECT 
    'Added Columns Check:' as info,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.columns 
                     WHERE table_schema = 'public' 
                     AND table_name = 'company_paint_products' 
                     AND column_name = 'is_favorite') 
         THEN 'is_favorite column exists' 
         ELSE 'is_favorite column missing' END as paint_products_status;

-- Show paint products with favorites
SELECT 'Paint Products Status:' as info;
SELECT 
    COUNT(*) as total_products,
    COUNT(CASE WHEN is_favorite THEN 1 END) as favorite_products,
    COUNT(DISTINCT user_id) as companies_with_products
FROM public.company_paint_products;

-- Show company preferences coverage
SELECT 'Company Preferences Coverage:' as info;
SELECT 
    COUNT(c.id) as total_companies,
    COUNT(cp.id) as companies_with_preferences,
    COUNT(CASE WHEN cp.setup_completed THEN 1 END) as setup_completed_count
FROM public.companies c
LEFT JOIN public.company_preferences cp ON c.id = cp.company_id;

-- Show sample data for verification
SELECT 'Sample Favorite Products:' as info;
SELECT 
    c.access_code,
    pp.project_type,
    pp.product_category,
    pp.supplier || ' ' || pp.product_name as product,
    pp.cost_per_gallon,
    pp.is_favorite
FROM public.company_paint_products pp
JOIN public.companies c ON pp.user_id = c.id
WHERE pp.is_favorite = true
ORDER BY c.access_code, pp.project_type, pp.product_category
LIMIT 10;

-- ============================================
-- END OF MIGRATION
-- ============================================