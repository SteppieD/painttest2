-- Migration to add company profiles and detailed paint products
-- This extends the existing schema for comprehensive company setup

-- Company profiles table with logo and business details
CREATE TABLE IF NOT EXISTS company_profiles (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  company_address TEXT,
  company_phone TEXT,
  company_email TEXT,
  company_website TEXT,
  license_number TEXT,
  insurance_info TEXT,
  -- Quote display settings
  quote_header_text TEXT,
  quote_footer_text TEXT,
  payment_terms TEXT DEFAULT 'Net 30',
  -- Onboarding status
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step TEXT DEFAULT 'company_info',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Detailed paint products with supplier info
CREATE TABLE IF NOT EXISTS company_paint_products (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  -- Product categorization
  project_type TEXT NOT NULL CHECK (project_type IN ('interior', 'exterior')),
  product_category TEXT NOT NULL CHECK (product_category IN ('primer', 'ceiling_paint', 'wall_paint', 'trim_paint')),
  -- Product details
  supplier TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_line TEXT, -- e.g., "ProClassic", "Duration", etc.
  cost_per_gallon DECIMAL NOT NULL,
  -- Display order (1-3 for each category)
  display_order INTEGER DEFAULT 1 CHECK (display_order BETWEEN 1 AND 3),
  -- Additional info
  coverage_per_gallon INTEGER DEFAULT 350,
  sheen TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Paint colors that can be used with products
CREATE TABLE IF NOT EXISTS paint_colors (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  color_name TEXT NOT NULL,
  color_code TEXT,
  color_brand TEXT,
  hex_color TEXT, -- For visual display
  is_custom BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Quote line items that reference specific products and colors
CREATE TABLE IF NOT EXISTS quote_line_items (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  quote_id TEXT NOT NULL,
  room_name TEXT NOT NULL,
  surface_type TEXT NOT NULL,
  -- Product selection
  paint_product_id TEXT,
  paint_color_id TEXT,
  -- Measurements and calculations
  square_footage DECIMAL NOT NULL,
  coats_count INTEGER DEFAULT 2,
  gallons_needed DECIMAL NOT NULL,
  -- Costs
  material_cost DECIMAL NOT NULL,
  labor_cost DECIMAL NOT NULL,
  total_cost DECIMAL NOT NULL,
  -- Additional info
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
  FOREIGN KEY (paint_product_id) REFERENCES company_paint_products(id) ON DELETE SET NULL,
  FOREIGN KEY (paint_color_id) REFERENCES paint_colors(id) ON DELETE SET NULL
);

-- Update quotes table to include new fields
-- Note: room_data, room_count, and payment_terms already exist, only adding includes_color_details
ALTER TABLE quotes ADD COLUMN includes_color_details BOOLEAN DEFAULT FALSE;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_company_profiles_user_id ON company_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_company_paint_products_user_id ON company_paint_products(user_id);
CREATE INDEX IF NOT EXISTS idx_company_paint_products_type_category ON company_paint_products(project_type, product_category);
CREATE INDEX IF NOT EXISTS idx_paint_colors_user_id ON paint_colors(user_id);
CREATE INDEX IF NOT EXISTS idx_quote_line_items_quote_id ON quote_line_items(quote_id);

-- Triggers for updated_at
CREATE TRIGGER IF NOT EXISTS update_company_profiles_updated_at
  AFTER UPDATE ON company_profiles
  BEGIN
    UPDATE company_profiles SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_company_paint_products_updated_at
  AFTER UPDATE ON company_paint_products
  BEGIN
    UPDATE company_paint_products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;