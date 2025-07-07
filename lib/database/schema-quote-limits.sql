-- Quote Usage Tracking for Free Tier Limits
-- This schema tracks monthly quote usage to enforce the 10 quote/month limit for free plans

-- Monthly quote usage tracking
CREATE TABLE IF NOT EXISTS quote_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  quote_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_id, month),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_quote_usage_company_month ON quote_usage(company_id, month);

-- Add subscription plan to companies table if not exists
ALTER TABLE companies ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(50) DEFAULT 'free';
-- Plans: free, professional, business

-- Function to check if company can create more quotes
-- This would be implemented in application code, but here's the logic:
-- 1. If subscription_plan != 'free', return true (unlimited)
-- 2. If subscription_plan = 'free', check quote_usage for current month
-- 3. If quote_count < 10, return true
-- 4. Otherwise, return false