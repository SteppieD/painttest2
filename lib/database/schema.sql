-- SQLite Database Schema for Professional Painting Contractor Management System
-- Converted from PostgreSQL to SQLite while maintaining all relationships and business logic

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Users table (replaces auth.users - simplified for SQLite)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT UNIQUE NOT NULL,
  company_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Access codes table for multi-tenant access control
CREATE TABLE IF NOT EXISTS access_codes (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  code TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  uses_count INTEGER DEFAULT 0,
  max_uses INTEGER,
  expires_at DATETIME,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_used_at DATETIME,
  notes TEXT
);

-- Access code sessions for tracking user sessions
CREATE TABLE IF NOT EXISTS access_code_sessions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  access_code_id TEXT,
  user_id TEXT,
  session_data TEXT DEFAULT '{}', -- JSON stored as TEXT in SQLite
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME DEFAULT (datetime('now', '+7 days')),
  FOREIGN KEY (access_code_id) REFERENCES access_codes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User profiles with business information
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  company_name TEXT,
  phone TEXT,
  business_info TEXT DEFAULT '{}', -- JSON stored as TEXT
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- Cost settings per user/contractor
CREATE TABLE IF NOT EXISTS cost_settings (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL UNIQUE,
  labor_cost_per_hour DECIMAL DEFAULT 25,
  paint_costs TEXT DEFAULT '{"best": 50, "good": 25, "better": 35}', -- JSON
  supplies_base_cost DECIMAL DEFAULT 100,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  company_name TEXT,
  contact_name TEXT,
  default_labor_percentage DECIMAL DEFAULT 30,
  default_spread_rate DECIMAL DEFAULT 350,
  door_trim_pricing TEXT DEFAULT '{"door_unit_price": 100, "trim_linear_foot_price": 3}', -- JSON
  baseboard_pricing TEXT DEFAULT '{"charge_method": "linear_foot", "price_per_linear_foot": 2.5}', -- JSON
  default_rates TEXT DEFAULT '{"walls": 3.00, "ceilings": 2.00, "trim_doors": 5.00}', -- JSON
  default_paint_costs TEXT DEFAULT '{"walls": 26, "ceilings": 25, "trim_doors": 35}', -- JSON
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Custom paint products catalog per user
CREATE TABLE IF NOT EXISTS paint_products (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  use_case TEXT NOT NULL,
  cost_per_gallon DECIMAL NOT NULL,
  sheen TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Projects - central hub for client work
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  client_name TEXT NOT NULL,
  property_address TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  client_email TEXT,
  client_phone TEXT,
  preferred_contact TEXT DEFAULT 'email' CHECK (preferred_contact IN ('email', 'phone', 'either')),
  client_notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chat messages linked to projects
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  project_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata TEXT, -- JSON stored as TEXT
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Room details for detailed project specification
CREATE TABLE IF NOT EXISTS room_details (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  project_id TEXT,
  room_name TEXT NOT NULL,
  wall_lengths TEXT NOT NULL, -- JSON array of wall measurements
  ceiling_height DECIMAL DEFAULT 8,
  door_count INTEGER DEFAULT 0,
  door_types TEXT DEFAULT '[]', -- JSON array
  window_count INTEGER DEFAULT 0,
  baseboard_length DECIMAL DEFAULT 0,
  ceiling_included BOOLEAN DEFAULT FALSE,
  trim_included BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Main quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  project_id TEXT NOT NULL,
  base_costs TEXT NOT NULL, -- JSON with detailed cost breakdown
  markup_percentage DECIMAL NOT NULL,
  final_price DECIMAL NOT NULL,
  details TEXT NOT NULL, -- JSON with quote specifications
  valid_until DATE DEFAULT (date('now', '+30 days')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  quote_method TEXT DEFAULT 'simple',
  job_status TEXT DEFAULT 'quoted',
  actual_labor_cost DECIMAL,
  actual_materials_cost DECIMAL,
  actual_supplies_cost DECIMAL,
  actual_profit_loss DECIMAL,
  job_notes TEXT,
  completed_at DATETIME,
  sundries_cost DECIMAL DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  sent_at DATETIME,
  accepted_at DATETIME,
  rejected_at DATETIME,
  expires_at DATETIME,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Quote versioning for tracking changes
CREATE TABLE IF NOT EXISTS quote_versions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  quote_id TEXT,
  version INTEGER NOT NULL,
  base_costs TEXT, -- JSON
  markup_percentage INTEGER,
  final_price DECIMAL,
  details TEXT, -- JSON
  changes TEXT, -- JSON describing what changed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT,
  FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Surface-level quote breakdown
CREATE TABLE IF NOT EXISTS quote_surfaces (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  quote_id TEXT,
  surface_type TEXT NOT NULL,
  square_footage DECIMAL NOT NULL,
  rate_per_sqft DECIMAL NOT NULL,
  paint_product_id TEXT,
  custom_paint_name TEXT,
  paint_cost_per_gallon DECIMAL NOT NULL,
  spread_rate DECIMAL DEFAULT 350,
  gallons_needed INTEGER NOT NULL,
  paint_cost DECIMAL NOT NULL,
  surface_total DECIMAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
  FOREIGN KEY (paint_product_id) REFERENCES paint_products(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_access_code_sessions_access_code_id ON access_code_sessions(access_code_id);
CREATE INDEX IF NOT EXISTS idx_access_code_sessions_user_id ON access_code_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_access_codes_code ON access_codes(code);
CREATE INDEX IF NOT EXISTS idx_chat_messages_project_id ON chat_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_cost_settings_user_id ON cost_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_paint_products_user_id ON paint_products(user_id);
CREATE INDEX IF NOT EXISTS idx_paint_products_use_case ON paint_products(use_case);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_room_details_project_id ON room_details(project_id);
CREATE INDEX IF NOT EXISTS idx_quotes_project_id ON quotes(project_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);
CREATE INDEX IF NOT EXISTS idx_quote_versions_quote_id ON quote_versions(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_surfaces_quote_id ON quote_surfaces(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_surfaces_surface_type ON quote_surfaces(surface_type);

-- Triggers to update timestamps
CREATE TRIGGER IF NOT EXISTS update_users_updated_at
  AFTER UPDATE ON users
  BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_profiles_updated_at
  AFTER UPDATE ON profiles
  BEGIN
    UPDATE profiles SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_cost_settings_updated_at
  AFTER UPDATE ON cost_settings
  BEGIN
    UPDATE cost_settings SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_paint_products_updated_at
  AFTER UPDATE ON paint_products
  BEGIN
    UPDATE paint_products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

CREATE TRIGGER IF NOT EXISTS update_projects_updated_at
  AFTER UPDATE ON projects
  BEGIN
    UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

-- Company branding table for professional quote customization
CREATE TABLE IF NOT EXISTS company_branding (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  company_id TEXT NOT NULL UNIQUE, -- Can reference access_codes.id or users.id
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3182ce',
  secondary_color TEXT DEFAULT '#2d3748',
  accent_color TEXT DEFAULT '#38a169',
  company_name TEXT NOT NULL,
  company_tagline TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for company branding
CREATE INDEX IF NOT EXISTS idx_company_branding_company_id ON company_branding(company_id);

-- Trigger to update company branding timestamps
CREATE TRIGGER IF NOT EXISTS update_company_branding_updated_at
  AFTER UPDATE ON company_branding
  BEGIN
    UPDATE company_branding SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;