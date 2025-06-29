-- Database Migration Scripts
-- Run these in order to update existing database schema

-- Migration 1: Add customers table with proper relationships
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  preferred_contact_method TEXT DEFAULT 'email' CHECK (preferred_contact_method IN ('email', 'phone', 'text')),
  notes TEXT,
  tags TEXT, -- JSON array of tags
  status TEXT DEFAULT 'prospect' CHECK (status IN ('prospect', 'active', 'completed', 'inactive')),
  total_quotes INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  first_quote_date DATETIME,
  last_contact_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Migration 2: Add customer_id to quotes table
ALTER TABLE quotes ADD COLUMN customer_id INTEGER REFERENCES customers(id);

-- Migration 3: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_company_id ON customers(company_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_last_contact ON customers(last_contact_date);

CREATE INDEX IF NOT EXISTS idx_quotes_customer_id ON quotes(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotes_company_id ON quotes(company_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);

-- Migration 4: Add security and audit fields
ALTER TABLE companies ADD COLUMN last_login_at DATETIME;
ALTER TABLE companies ADD COLUMN login_count INTEGER DEFAULT 0;
ALTER TABLE companies ADD COLUMN security_settings TEXT; -- JSON for security preferences

-- Migration 5: Add performance tracking
CREATE TABLE IF NOT EXISTS performance_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  operation_type TEXT NOT NULL,
  operation_details TEXT,
  duration_ms INTEGER NOT NULL,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_performance_logs_operation ON performance_logs(operation_type);
CREATE INDEX IF NOT EXISTS idx_performance_logs_created_at ON performance_logs(created_at);

-- Migration 6: Add session management
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  company_id INTEGER NOT NULL,
  data TEXT NOT NULL, -- Encrypted session data
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address TEXT,
  user_agent_hash TEXT,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_company_id ON sessions(company_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Migration 7: Add error logging
CREATE TABLE IF NOT EXISTS error_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  error_id TEXT UNIQUE NOT NULL,
  session_id TEXT,
  company_id INTEGER,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  component_stack TEXT,
  user_agent TEXT,
  url TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_error_logs_company_id ON error_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON error_logs(resolved);

-- Migration 8: Add data integrity constraints
-- Ensure quotes have valid pricing
CREATE TRIGGER IF NOT EXISTS validate_quote_pricing
  BEFORE INSERT ON quotes
  WHEN NEW.final_price < 0 OR NEW.walls_sqft < 0 OR NEW.ceilings_sqft < 0 OR NEW.trim_sqft < 0
  BEGIN
    SELECT RAISE(ABORT, 'Invalid pricing data: negative values not allowed');
  END;

CREATE TRIGGER IF NOT EXISTS validate_quote_pricing_update
  BEFORE UPDATE ON quotes
  WHEN NEW.final_price < 0 OR NEW.walls_sqft < 0 OR NEW.ceilings_sqft < 0 OR NEW.trim_sqft < 0
  BEGIN
    SELECT RAISE(ABORT, 'Invalid pricing data: negative values not allowed');
  END;

-- Migration 9: Add automatic timestamp updates
CREATE TRIGGER IF NOT EXISTS update_customers_timestamp
  AFTER UPDATE ON customers
  BEGIN
    UPDATE customers SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_quotes_timestamp
  AFTER UPDATE ON quotes
  BEGIN
    UPDATE quotes SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_companies_timestamp
  AFTER UPDATE ON companies
  BEGIN
    UPDATE companies SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- Migration 10: Add customer statistics maintenance
CREATE TRIGGER IF NOT EXISTS update_customer_stats_on_quote_insert
  AFTER INSERT ON quotes
  WHEN NEW.customer_id IS NOT NULL
  BEGIN
    UPDATE customers 
    SET 
      total_quotes = (SELECT COUNT(*) FROM quotes WHERE customer_id = NEW.customer_id),
      total_revenue = (SELECT COALESCE(SUM(final_price), 0) FROM quotes WHERE customer_id = NEW.customer_id AND status = 'approved'),
      last_contact_date = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.customer_id;
  END;

CREATE TRIGGER IF NOT EXISTS update_customer_stats_on_quote_update
  AFTER UPDATE ON quotes
  WHEN NEW.customer_id IS NOT NULL
  BEGIN
    UPDATE customers 
    SET 
      total_quotes = (SELECT COUNT(*) FROM quotes WHERE customer_id = NEW.customer_id),
      total_revenue = (SELECT COALESCE(SUM(final_price), 0) FROM quotes WHERE customer_id = NEW.customer_id AND status = 'approved'),
      last_contact_date = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.customer_id;
  END;

-- Migration 11: Add backup and recovery support
CREATE TABLE IF NOT EXISTS backups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  backup_type TEXT NOT NULL CHECK (backup_type IN ('manual', 'automatic', 'migration')),
  file_path TEXT NOT NULL,
  file_size INTEGER,
  checksum TEXT,
  company_id INTEGER, -- NULL for full database backups
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_backups_created_at ON backups(created_at);
CREATE INDEX IF NOT EXISTS idx_backups_company_id ON backups(company_id);

-- Migration 12: Add feature flags and configuration
CREATE TABLE IF NOT EXISTS feature_flags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  flag_name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT FALSE,
  target_companies TEXT, -- JSON array of company IDs, NULL means all
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default feature flags
INSERT OR IGNORE INTO feature_flags (flag_name, description, is_enabled) VALUES
('offline_support', 'Enable offline functionality', TRUE),
('performance_monitoring', 'Enable performance tracking', TRUE),
('advanced_chat_interface', 'Enable AI-powered chat interface', TRUE),
('error_boundaries', 'Enable React error boundaries', TRUE),
('data_export', 'Enable data export functionality', TRUE);

-- Migration 13: Add configuration table for app settings
CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default configuration
INSERT OR IGNORE INTO app_config (key, value, description) VALUES
('max_file_upload_size', '10485760', 'Maximum file upload size in bytes (10MB)'),
('session_timeout', '86400', 'Session timeout in seconds (24 hours)'),
('rate_limit_window', '900', 'Rate limiting window in seconds (15 minutes)'),
('rate_limit_max_requests', '100', 'Maximum requests per rate limit window'),
('backup_retention_days', '30', 'Number of days to retain backups'),
('performance_log_retention_days', '7', 'Number of days to retain performance logs'),
('error_log_retention_days', '30', 'Number of days to retain error logs');

-- Migration 14: Add data cleanup procedures
-- Procedure to clean old sessions
CREATE TRIGGER IF NOT EXISTS cleanup_expired_sessions
  AFTER INSERT ON sessions
  BEGIN
    DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP;
  END;

-- Create views for common queries to improve performance
CREATE VIEW IF NOT EXISTS customer_summary AS
SELECT 
  c.*,
  COUNT(q.id) as quote_count,
  COALESCE(SUM(CASE WHEN q.status = 'approved' THEN q.final_price ELSE 0 END), 0) as actual_revenue,
  COALESCE(AVG(q.final_price), 0) as avg_quote_value,
  MAX(q.created_at) as last_quote_date
FROM customers c
LEFT JOIN quotes q ON c.id = q.customer_id
GROUP BY c.id;

CREATE VIEW IF NOT EXISTS company_dashboard AS
SELECT 
  c.id,
  c.company_name,
  c.access_code,
  COUNT(DISTINCT cust.id) as total_customers,
  COUNT(q.id) as total_quotes,
  COUNT(CASE WHEN q.status = 'pending' THEN 1 END) as pending_quotes,
  COUNT(CASE WHEN q.status = 'approved' THEN 1 END) as approved_quotes,
  COALESCE(SUM(CASE WHEN q.status = 'approved' THEN q.final_price ELSE 0 END), 0) as total_revenue,
  COALESCE(AVG(CASE WHEN q.status = 'approved' THEN q.final_price END), 0) as avg_quote_value
FROM companies c
LEFT JOIN customers cust ON c.id = cust.company_id
LEFT JOIN quotes q ON c.id = q.company_id
GROUP BY c.id;

-- Migration 15: Add full-text search support
-- Note: SQLite FTS5 may not be available in all environments
-- This is commented out but can be enabled if FTS5 is available
/*
CREATE VIRTUAL TABLE IF NOT EXISTS quotes_fts USING fts5(
  quote_id,
  customer_name,
  address,
  notes,
  content='quotes',
  content_rowid='id'
);

-- Populate FTS table
INSERT INTO quotes_fts(quote_id, customer_name, address, notes)
SELECT id, customer_name, address, notes FROM quotes;

-- Trigger to keep FTS in sync
CREATE TRIGGER IF NOT EXISTS quotes_fts_insert AFTER INSERT ON quotes BEGIN
  INSERT INTO quotes_fts(quote_id, customer_name, address, notes) 
  VALUES (new.id, new.customer_name, new.address, new.notes);
END;

CREATE TRIGGER IF NOT EXISTS quotes_fts_delete AFTER DELETE ON quotes BEGIN
  INSERT INTO quotes_fts(quotes_fts, quote_id, customer_name, address, notes) 
  VALUES('delete', old.id, old.customer_name, old.address, old.notes);
END;

CREATE TRIGGER IF NOT EXISTS quotes_fts_update AFTER UPDATE ON quotes BEGIN
  INSERT INTO quotes_fts(quotes_fts, quote_id, customer_name, address, notes) 
  VALUES('delete', old.id, old.customer_name, old.address, old.notes);
  INSERT INTO quotes_fts(quote_id, customer_name, address, notes) 
  VALUES (new.id, new.customer_name, new.address, new.notes);
END;
*/

-- Migration 16: Add schema version tracking
CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  description TEXT NOT NULL,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Record this migration
INSERT OR IGNORE INTO schema_migrations (version, description) VALUES
(1, 'Initial customers table creation'),
(2, 'Add customer_id to quotes'),
(3, 'Add performance indexes'),
(4, 'Add security and audit fields'),
(5, 'Add performance logging'),
(6, 'Add session management'),
(7, 'Add error logging'),
(8, 'Add data integrity constraints'),
(9, 'Add automatic timestamp updates'),
(10, 'Add customer statistics maintenance'),
(11, 'Add backup and recovery support'),
(12, 'Add feature flags and configuration'),
(13, 'Add app configuration'),
(14, 'Add data cleanup procedures'),
(15, 'Add dashboard views'),
(16, 'Add schema version tracking');

-- Migration complete marker
PRAGMA user_version = 16;