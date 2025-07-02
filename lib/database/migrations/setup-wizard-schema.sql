-- Setup Wizard Database Schema
-- Creates tables for persistent user setup progress and rate cards

-- Company setup progress tracking
CREATE TABLE IF NOT EXISTS company_setup_progress (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Progress tracking
  setup_started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  setup_completed_at TIMESTAMP NULL,
  last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Section completion status
  labor_rates_completed BOOLEAN DEFAULT FALSE,
  paint_preferences_completed BOOLEAN DEFAULT FALSE,
  business_settings_completed BOOLEAN DEFAULT FALSE,
  
  -- Bonus tracking
  bonus_quotes_awarded BOOLEAN DEFAULT FALSE,
  bonus_quotes_amount INTEGER DEFAULT 0,
  
  UNIQUE(company_id)
);

-- Company rate cards (user's pricing data)
CREATE TABLE IF NOT EXISTS company_rate_cards (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Labor rates (per square foot)
  interior_wall_rate_min DECIMAL(8,2) NULL, -- Slider range minimum
  interior_wall_rate_max DECIMAL(8,2) NULL, -- Slider range maximum  
  interior_wall_rate DECIMAL(8,2) NULL,     -- User's actual rate
  
  ceiling_rate_min DECIMAL(8,2) NULL,
  ceiling_rate_max DECIMAL(8,2) NULL,
  ceiling_rate DECIMAL(8,2) NULL,
  
  trim_rate_min DECIMAL(8,2) NULL,
  trim_rate_max DECIMAL(8,2) NULL,
  trim_rate DECIMAL(8,2) NULL,
  
  -- Special pricing
  door_rate DECIMAL(8,2) NULL,
  window_rate DECIMAL(8,2) NULL,
  
  -- Paint preferences
  preferred_wall_paint VARCHAR(100) NULL,
  wall_paint_cost DECIMAL(8,2) NULL,
  wall_paint_coverage INTEGER NULL, -- sq ft per gallon
  
  preferred_ceiling_paint VARCHAR(100) NULL,
  ceiling_paint_cost DECIMAL(8,2) NULL,
  ceiling_paint_coverage INTEGER NULL,
  
  preferred_primer VARCHAR(100) NULL,
  primer_cost DECIMAL(8,2) NULL,
  primer_coverage INTEGER NULL,
  
  preferred_trim_paint VARCHAR(100) NULL,
  trim_paint_cost DECIMAL(8,2) NULL,
  trim_paint_coverage INTEGER NULL,
  
  -- Business model settings
  labor_included_in_paint BOOLEAN DEFAULT FALSE,
  material_markup_percent DECIMAL(5,2) DEFAULT 0.00,
  separate_prep_charge BOOLEAN DEFAULT FALSE,
  default_prep_rate DECIMAL(8,2) NULL,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(company_id)
);

-- Update company quotas when setup is completed (bonus quotes)
CREATE OR REPLACE FUNCTION award_setup_bonus() 
RETURNS TRIGGER AS $$
BEGIN
  -- If setup just completed and bonus not already awarded
  IF NEW.setup_completed_at IS NOT NULL 
     AND OLD.setup_completed_at IS NULL 
     AND NEW.bonus_quotes_awarded = FALSE THEN
    
    -- Award 6 bonus quotes (bringing total to 10 for first month)
    UPDATE companies 
    SET quote_limit = COALESCE(quote_limit, 4) + 6
    WHERE id = NEW.company_id;
    
    -- Mark bonus as awarded
    UPDATE company_setup_progress 
    SET bonus_quotes_awarded = TRUE,
        bonus_quotes_amount = 6
    WHERE company_id = NEW.company_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to award bonus quotes
DROP TRIGGER IF EXISTS setup_completion_bonus ON company_setup_progress;
CREATE TRIGGER setup_completion_bonus
  AFTER UPDATE ON company_setup_progress
  FOR EACH ROW
  EXECUTE FUNCTION award_setup_bonus();

-- Industry default rate ranges for sliders
CREATE TABLE IF NOT EXISTS industry_rate_defaults (
  id SERIAL PRIMARY KEY,
  service_type VARCHAR(50) NOT NULL, -- 'interior_wall', 'ceiling', 'trim', etc.
  
  -- Rate ranges for sliders
  low_rate DECIMAL(8,2) NOT NULL,
  avg_rate DECIMAL(8,2) NOT NULL, 
  high_rate DECIMAL(8,2) NOT NULL,
  
  -- Geographic data (future expansion)
  region VARCHAR(50) DEFAULT 'national',
  
  -- Metadata
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  source VARCHAR(100) DEFAULT 'industry_research',
  
  UNIQUE(service_type, region)
);

-- Insert default rate ranges
INSERT INTO industry_rate_defaults (service_type, low_rate, avg_rate, high_rate) VALUES
('interior_wall', 0.75, 1.50, 3.00),
('ceiling', 0.50, 1.25, 2.50),
('trim', 1.00, 2.00, 4.00),
('door', 15.00, 35.00, 75.00),
('window', 10.00, 25.00, 50.00)
ON CONFLICT (service_type, region) DO UPDATE SET
  low_rate = EXCLUDED.low_rate,
  avg_rate = EXCLUDED.avg_rate,
  high_rate = EXCLUDED.high_rate,
  last_updated = CURRENT_TIMESTAMP;