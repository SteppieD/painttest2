-- Supabase Simple Migration for PaintQuoteApp
-- Date: 2025-01-23
-- Purpose: Only add the essential missing pieces
-- 
-- Based on current state: All tables exist, just need missing columns

-- ============================================
-- PART 1: Add is_favorite column to company_paint_products
-- ============================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'company_paint_products' 
                   AND column_name = 'is_favorite') THEN
        ALTER TABLE public.company_paint_products ADD COLUMN is_favorite BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added is_favorite column to company_paint_products';
    ELSE
        RAISE NOTICE 'is_favorite column already exists';
    END IF;
END $$;

-- ============================================
-- PART 2: Add missing columns to quotes table
-- ============================================

DO $$ 
BEGIN
    -- Add quote_amount if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'quotes' AND column_name = 'quote_amount') THEN
        ALTER TABLE public.quotes ADD COLUMN quote_amount DECIMAL(12,2);
    END IF;
    
    -- Add notes if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'quotes' AND column_name = 'notes') THEN
        ALTER TABLE public.quotes ADD COLUMN notes TEXT;
    END IF;
    
    -- Add payment_terms if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'quotes' AND column_name = 'payment_terms') THEN
        ALTER TABLE public.quotes ADD COLUMN payment_terms TEXT;
    END IF;
END $$;

-- ============================================
-- PART 3: Set some products as favorites
-- ============================================

-- Mark the first product in each category as favorite for existing data
UPDATE public.company_paint_products
SET is_favorite = true
WHERE id IN (
    SELECT DISTINCT ON (user_id, project_type, product_category) id
    FROM public.company_paint_products
    ORDER BY user_id, project_type, product_category, id
);

-- ============================================
-- PART 4: Add missing company preferences
-- ============================================

-- Add preferences for companies that don't have them (using only existing columns)
INSERT INTO public.company_preferences (company_id, default_markup, setup_completed)
SELECT c.id, 20, false
FROM public.companies c
WHERE NOT EXISTS (
    SELECT 1 FROM public.company_preferences cp 
    WHERE cp.company_id = c.id
);

-- ============================================
-- PART 5: Simple verification
-- ============================================

SELECT '=== Migration Complete ===' as status;

-- Show paint products summary
SELECT 
    'Paint Products:' as info,
    COUNT(*) as total,
    COUNT(CASE WHEN is_favorite THEN 1 END) as favorites
FROM public.company_paint_products;

-- Show companies with preferences
SELECT 
    'Companies:' as info,
    COUNT(c.id) as total_companies,
    COUNT(cp.id) as with_preferences
FROM public.companies c
LEFT JOIN public.company_preferences cp ON c.id = cp.company_id;

-- Show which companies have favorite products
SELECT 
    c.access_code,
    COUNT(pp.id) as total_products,
    COUNT(CASE WHEN pp.is_favorite THEN 1 END) as favorites
FROM public.companies c
LEFT JOIN public.company_paint_products pp ON c.id = pp.user_id
GROUP BY c.id, c.access_code
ORDER BY c.access_code;

-- ============================================
-- END OF MIGRATION
-- ============================================