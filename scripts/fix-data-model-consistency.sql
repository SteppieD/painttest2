-- Data Model Consistency Fix Migration
-- Fixes the confusion between companies (contractors) and customers (people hiring contractors)
-- Creates proper foreign key relationships and data model consistency

-- =====================================================
-- STEP 1: Create the missing customers table
-- =====================================================

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  
  -- Customer contact info
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  
  -- Customer preferences and history
  preferred_contact_method VARCHAR(10) DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'phone', 'text')),
  notes TEXT,
  tags TEXT, -- JSON array of tags
  
  -- Customer status and metrics
  status VARCHAR(20) DEFAULT 'prospect' CHECK (status IN ('prospect', 'active', 'completed', 'inactive')),
  total_quotes INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  
  -- Timestamps
  first_quote_date DATETIME,
  last_contact_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- =====================================================
-- STEP 2: Update quotes table structure
-- =====================================================

-- Add customer_id foreign key to quotes table
ALTER TABLE quotes ADD COLUMN customer_id INTEGER;

-- Create index for the new foreign key
CREATE INDEX IF NOT EXISTS idx_quotes_customer_id ON quotes(customer_id);

-- =====================================================
-- STEP 3: Migrate existing quote data to create customers
-- =====================================================

-- Insert unique customers based on existing quote data
INSERT INTO customers (company_id, name, email, phone, address, status, created_at)
SELECT DISTINCT
  q.company_id,
  q.customer_name as name,
  q.customer_email as email,
  q.customer_phone as phone,
  q.address,
  CASE 
    WHEN SUM(CASE WHEN q.status = 'approved' THEN 1 ELSE 0 END) > 0 THEN 'completed'
    WHEN COUNT(*) > 1 THEN 'active'
    ELSE 'prospect'
  END as status,
  MIN(q.created_at) as created_at
FROM quotes q
WHERE q.customer_name IS NOT NULL 
  AND q.customer_name != ''
  AND q.customer_name != 'Unknown Customer'
GROUP BY q.company_id, q.customer_name, q.customer_email, q.customer_phone, q.address
HAVING COUNT(*) > 0;

-- =====================================================
-- STEP 4: Link quotes to customers
-- =====================================================

-- Update quotes with customer_id based on matching customer data
UPDATE quotes 
SET customer_id = (
  SELECT c.id 
  FROM customers c 
  WHERE c.company_id = quotes.company_id 
    AND c.name = quotes.customer_name
    AND (c.email = quotes.customer_email OR (c.email IS NULL AND quotes.customer_email IS NULL))
    AND (c.phone = quotes.customer_phone OR (c.phone IS NULL AND quotes.customer_phone IS NULL))
  LIMIT 1
)
WHERE customer_name IS NOT NULL 
  AND customer_name != ''
  AND customer_name != 'Unknown Customer';

-- =====================================================
-- STEP 5: Update customer statistics
-- =====================================================

-- Update customer metrics based on their quotes
UPDATE customers 
SET 
  total_quotes = (
    SELECT COUNT(*) 
    FROM quotes q 
    WHERE q.customer_id = customers.id
  ),
  total_revenue = (
    SELECT COALESCE(SUM(q.final_price), 0)
    FROM quotes q 
    WHERE q.customer_id = customers.id 
      AND q.status = 'approved'
  ),
  first_quote_date = (
    SELECT MIN(q.created_at)
    FROM quotes q 
    WHERE q.customer_id = customers.id
  ),
  last_contact_date = (
    SELECT MAX(q.created_at)
    FROM quotes q 
    WHERE q.customer_id = customers.id
  ),
  updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- STEP 6: Create proper indexes for performance
-- =====================================================

-- Customer indexes
CREATE INDEX IF NOT EXISTS idx_customers_company_id ON customers(company_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_customers_company_status ON customers(company_id, status);
CREATE INDEX IF NOT EXISTS idx_quotes_company_customer ON quotes(company_id, customer_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status_created ON quotes(status, created_at);

-- =====================================================
-- STEP 7: Create optimized views for common queries
-- =====================================================

-- Customer dashboard view (eliminates N+1 queries)
CREATE VIEW IF NOT EXISTS customer_dashboard AS
SELECT 
  c.*,
  COUNT(q.id) as quote_count,
  SUM(CASE WHEN q.status = 'approved' THEN q.final_price ELSE 0 END) as approved_revenue,
  SUM(CASE WHEN q.status = 'pending' THEN q.final_price ELSE 0 END) as pending_revenue,
  MAX(q.created_at) as last_quote_date,
  MIN(q.created_at) as first_quote_date,
  CASE 
    WHEN COUNT(q.id) = 0 THEN 0
    ELSE ROUND((SUM(CASE WHEN q.status = 'approved' THEN 1 ELSE 0 END) * 100.0 / COUNT(q.id)), 2)
  END as conversion_rate
FROM customers c
LEFT JOIN quotes q ON c.id = q.customer_id
GROUP BY c.id;

-- Company summary view (eliminates multiple queries)
CREATE VIEW IF NOT EXISTS company_summary AS
SELECT 
  comp.*,
  COUNT(DISTINCT c.id) as total_customers,
  COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.id END) as active_customers,
  COUNT(DISTINCT CASE WHEN c.status = 'prospect' THEN c.id END) as prospects,
  COUNT(DISTINCT CASE WHEN c.status = 'completed' THEN c.id END) as completed_customers,
  COUNT(q.id) as total_quotes,
  COUNT(CASE WHEN q.status = 'pending' THEN 1 END) as pending_quotes,
  COUNT(CASE WHEN q.status = 'approved' THEN 1 END) as approved_quotes,
  COALESCE(SUM(CASE WHEN q.status = 'approved' THEN q.final_price ELSE 0 END), 0) as total_revenue,
  COALESCE(AVG(CASE WHEN q.status = 'approved' THEN q.final_price END), 0) as average_quote_value
FROM companies comp
LEFT JOIN customers c ON comp.id = c.company_id
LEFT JOIN quotes q ON c.id = q.customer_id
GROUP BY comp.id;

-- =====================================================
-- STEP 8: Add data validation constraints
-- =====================================================

-- Ensure quotes have valid customer references (where possible)
-- Note: Some quotes might not have customers if they're incomplete

-- Ensure customer names are not empty
CREATE TRIGGER IF NOT EXISTS validate_customer_name
  BEFORE INSERT ON customers
  WHEN NEW.name IS NULL OR TRIM(NEW.name) = ''
  BEGIN
    SELECT RAISE(ABORT, 'Customer name cannot be empty');
  END;

-- Update timestamps trigger for customers
CREATE TRIGGER IF NOT EXISTS update_customers_updated_at
  AFTER UPDATE ON customers
  BEGIN
    UPDATE customers SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- =====================================================
-- STEP 9: Clean up data inconsistencies
-- =====================================================

-- Fix quotes with invalid customer names
UPDATE quotes 
SET customer_name = 'Unknown Customer'
WHERE customer_name IS NULL 
   OR TRIM(customer_name) = ''
   OR customer_name IN ('undefined', 'null', 'Customer', 'customer');

-- Remove duplicate spaces and fix formatting in customer names
UPDATE quotes 
SET customer_name = TRIM(REPLACE(REPLACE(REPLACE(customer_name, '  ', ' '), char(10), ' '), char(13), ' '))
WHERE customer_name LIKE '%  %' 
   OR customer_name LIKE '%' || char(10) || '%'
   OR customer_name LIKE '%' || char(13) || '%';

-- =====================================================
-- STEP 10: Performance optimizations
-- =====================================================

-- Add computed columns for better performance (if supported)
-- Note: SQLite doesn't support computed columns, but we can use triggers

CREATE TRIGGER IF NOT EXISTS update_customer_metrics
  AFTER INSERT ON quotes
  WHEN NEW.customer_id IS NOT NULL
  BEGIN
    UPDATE customers 
    SET 
      total_quotes = (SELECT COUNT(*) FROM quotes WHERE customer_id = NEW.customer_id),
      total_revenue = (SELECT COALESCE(SUM(final_price), 0) FROM quotes WHERE customer_id = NEW.customer_id AND status = 'approved'),
      last_contact_date = NEW.created_at,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.customer_id;
  END;

CREATE TRIGGER IF NOT EXISTS update_customer_metrics_on_quote_update
  AFTER UPDATE ON quotes
  WHEN NEW.customer_id IS NOT NULL
  BEGIN
    UPDATE customers 
    SET 
      total_quotes = (SELECT COUNT(*) FROM quotes WHERE customer_id = NEW.customer_id),
      total_revenue = (SELECT COALESCE(SUM(final_price), 0) FROM quotes WHERE customer_id = NEW.customer_id AND status = 'approved'),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.customer_id;
  END;

-- =====================================================
-- VERIFICATION QUERIES (run these to verify migration)
-- =====================================================

-- Count of customers created from quotes
-- SELECT COUNT(*) as customers_created FROM customers;

-- Count of quotes linked to customers  
-- SELECT COUNT(*) as quotes_linked FROM quotes WHERE customer_id IS NOT NULL;

-- Count of quotes without customers (should be minimal)
-- SELECT COUNT(*) as orphaned_quotes FROM quotes WHERE customer_id IS NULL;

-- Sample customer data
-- SELECT * FROM customer_dashboard LIMIT 5;

-- Sample company summary
-- SELECT * FROM company_summary LIMIT 3;

COMMIT;