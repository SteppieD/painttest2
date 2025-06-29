-- Migration for Setup UX Improvements
-- Add columns to track setup method and completion status

-- Add setup tracking columns to companies table
ALTER TABLE companies ADD COLUMN setup_method VARCHAR(20) DEFAULT NULL;
ALTER TABLE companies ADD COLUMN setup_completed_at DATETIME DEFAULT NULL;
ALTER TABLE companies ADD COLUMN setup_skipped_at DATETIME DEFAULT NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_setup_method ON companies(setup_method);
CREATE INDEX IF NOT EXISTS idx_companies_setup_completed ON companies(setup_completed_at);

-- Create paint_products table if it doesn't exist (for new installations)
CREATE TABLE IF NOT EXISTS paint_products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL,
  project_type VARCHAR(20) NOT NULL,
  supplier VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  cost_per_gallon DECIMAL(8,2) NOT NULL,
  tier VARCHAR(20) DEFAULT 'standard',
  display_order INTEGER DEFAULT 1,
  is_favorite BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Add indexes for paint_products table
CREATE INDEX IF NOT EXISTS idx_paint_products_company_id ON paint_products(company_id);
CREATE INDEX IF NOT EXISTS idx_paint_products_category ON paint_products(category);
CREATE INDEX IF NOT EXISTS idx_paint_products_project_type ON paint_products(project_type);
CREATE INDEX IF NOT EXISTS idx_paint_products_display_order ON paint_products(company_id, category, project_type, display_order);

-- Add trigger to update paint_products timestamp
CREATE TRIGGER IF NOT EXISTS update_paint_products_timestamp
  AFTER UPDATE ON paint_products
  BEGIN
    UPDATE paint_products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- Update schema version
INSERT OR IGNORE INTO schema_migrations (version, description) VALUES
(17, 'Setup UX improvements - flexible setup paths and paint products');

PRAGMA user_version = 17;