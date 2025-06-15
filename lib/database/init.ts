import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';

let db: Database.Database | null = null;
let isInitialized = false;

export function getDatabase(): Database.Database {
  if (!db) {
    try {
      // Use a consistent database file
      const dbPath = join(process.cwd(), 'painting_quotes_app.db');
      console.log(`Initializing database at: ${dbPath}`);
      
      db = new Database(dbPath);
      
      // Enable foreign keys and WAL mode
      db.pragma('foreign_keys = ON');
      db.pragma('journal_mode = WAL');
      
      if (!isInitialized) {
        // Initialize schema only once
        initializeSchema();
        
        // Verify tables were created
        verifyTables();
        
        isInitialized = true;
        console.log('Database initialized and verified successfully');
      }
    } catch (error) {
      console.error('Fatal database initialization error:', error);
      throw error;
    }
  }
  
  return db;
}

function initializeSchema() {
  if (!db) throw new Error('Database not initialized');
  
  console.log('Starting schema initialization...');
  
  try {
    // First, ensure we have the companies table from the legacy system
    db.exec(`
      CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        access_code TEXT UNIQUE NOT NULL,
        company_name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        logo_url TEXT,
        default_walls_rate REAL DEFAULT 3.00,
        default_ceilings_rate REAL DEFAULT 2.00,
        default_trim_rate REAL DEFAULT 1.92,
        default_walls_paint_cost REAL DEFAULT 26.00,
        default_ceilings_paint_cost REAL DEFAULT 25.00,
        default_trim_paint_cost REAL DEFAULT 35.00,
        default_labor_percentage INTEGER DEFAULT 30,
        default_paint_coverage INTEGER DEFAULT 350,
        default_sundries_percentage INTEGER DEFAULT 12,
        tax_rate REAL DEFAULT 0,
        tax_on_materials_only BOOLEAN DEFAULT 0,
        tax_label TEXT DEFAULT 'Tax',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Companies table created/verified');
    
    // Create the quotes table
    db.exec(`
      CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id INTEGER NOT NULL,
        quote_id TEXT UNIQUE NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT,
        customer_phone TEXT,
        address TEXT,
        project_type TEXT,
        rooms TEXT,
        paint_quality TEXT,
        prep_work TEXT,
        timeline TEXT,
        special_requests TEXT,
        walls_sqft INTEGER DEFAULT 0,
        ceilings_sqft INTEGER DEFAULT 0,
        trim_sqft INTEGER DEFAULT 0,
        walls_rate REAL DEFAULT 3.00,
        ceilings_rate REAL DEFAULT 2.00,
        trim_rate REAL DEFAULT 1.92,
        walls_paint_cost REAL DEFAULT 26.00,
        ceilings_paint_cost REAL DEFAULT 25.00,
        trim_paint_cost REAL DEFAULT 35.00,
        total_revenue REAL DEFAULT 0,
        total_materials REAL DEFAULT 0,
        paint_cost REAL DEFAULT 0,
        sundries_cost REAL DEFAULT 0,
        sundries_percentage INTEGER DEFAULT 12,
        projected_labor REAL DEFAULT 0,
        labor_percentage INTEGER DEFAULT 30,
        projected_profit REAL DEFAULT 0,
        paint_coverage INTEGER DEFAULT 350,
        tax_rate REAL DEFAULT 0,
        tax_amount REAL DEFAULT 0,
        subtotal REAL DEFAULT 0,
        base_cost REAL,
        markup_percentage REAL,
        final_price REAL,
        room_data TEXT,
        room_count INTEGER,
        status TEXT DEFAULT 'pending',
        conversation_summary TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id)
      );
    `);
    console.log('✓ Quotes table created/verified');
    
    // Add room_data and room_count columns if they don't exist (for existing databases)
    try {
      db.exec(`ALTER TABLE quotes ADD COLUMN room_data TEXT`);
      console.log('✓ Added room_data column to quotes table');
    } catch (error) {
      // Column already exists, ignore error
    }
    
    try {
      db.exec(`ALTER TABLE quotes ADD COLUMN room_count INTEGER`);
      console.log('✓ Added room_count column to quotes table');
    } catch (error) {
      // Column already exists, ignore error
    }
    
    // Create indexes
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_quotes_company_id ON quotes(company_id);
      CREATE INDEX IF NOT EXISTS idx_quotes_quote_id ON quotes(quote_id);
      CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
    `);
    console.log('✓ Indexes created/verified');
    
    // Now create the new schema tables for the enhanced system
    // Users table (simplified for now)
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        email TEXT UNIQUE NOT NULL,
        company_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Users table created/verified');
    
    // Projects table
    db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT,
        client_name TEXT NOT NULL,
        property_address TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        client_email TEXT,
        client_phone TEXT,
        preferred_contact TEXT DEFAULT 'email' CHECK (preferred_contact IN ('email', 'phone', 'either')),
        client_notes TEXT
      );
    `);
    console.log('✓ Projects table created/verified');
    
    // Chat messages table
    db.exec(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        project_id TEXT,
        company_id INTEGER,
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
        content TEXT NOT NULL,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies(id)
      );
    `);
    
    // Add company_id column to existing chat_messages table if it doesn't exist
    try {
      db.exec(`ALTER TABLE chat_messages ADD COLUMN company_id INTEGER`);
      console.log('✓ Added company_id column to chat_messages table');
    } catch (error) {
      // Column already exists, ignore error
    }
    console.log('✓ Chat messages table created/verified');
    
    // Cost settings table
    db.exec(`
      CREATE TABLE IF NOT EXISTS cost_settings (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        user_id TEXT UNIQUE,
        labor_cost_per_hour DECIMAL DEFAULT 25,
        paint_costs TEXT DEFAULT '{"best": 50, "good": 25, "better": 35}',
        supplies_base_cost DECIMAL DEFAULT 100,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        company_name TEXT,
        contact_name TEXT,
        default_labor_percentage DECIMAL DEFAULT 30,
        default_spread_rate DECIMAL DEFAULT 350,
        door_trim_pricing TEXT DEFAULT '{"door_unit_price": 45, "trim_linear_foot_price": 3}',
        baseboard_pricing TEXT DEFAULT '{"charge_method": "linear_foot", "price_per_linear_foot": 2.5}',
        default_rates TEXT DEFAULT '{"walls": 3.00, "ceilings": 2.00, "trim_doors": 5.00}',
        default_paint_costs TEXT DEFAULT '{"walls": 26, "ceilings": 25, "trim_doors": 35}'
      );
    `);
    console.log('✓ Cost settings table created/verified');
    
    // Admin tables for admin portal
    db.exec(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        full_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login_at DATETIME,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Admin users table created/verified');
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        admin_user_id TEXT NOT NULL,
        session_token TEXT UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE CASCADE
      );
    `);
    console.log('✓ Admin sessions table created/verified');
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS admin_activity_logs (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        admin_user_id TEXT,
        action TEXT NOT NULL,
        details TEXT,
        ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_user_id) REFERENCES admin_users(id) ON DELETE SET NULL
      );
    `);
    console.log('✓ Admin activity logs table created/verified');
    
    // Paint products table for company paint catalog
    db.exec(`
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
    `);
    
    // Create indexes for paint products
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_company_paint_products_user_id ON company_paint_products(user_id);
      CREATE INDEX IF NOT EXISTS idx_company_paint_products_type_category ON company_paint_products(project_type, product_category);
    `);
    
    // Create trigger for paint products
    db.exec(`
      CREATE TRIGGER IF NOT EXISTS update_company_paint_products_updated_at
        AFTER UPDATE ON company_paint_products
        BEGIN
          UPDATE company_paint_products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END;
    `);
    console.log('✓ Company paint products table created/verified');
    
    // Seed demo companies if none exist
    seedDemoCompanies();
    
    // Seed admin user if none exist
    seedAdminUser();
    
    // Seed default paint products for companies
    seedDefaultPaintProducts();
    
  } catch (error) {
    console.error('Schema initialization error:', error);
    throw error;
  }
}

function verifyTables() {
  if (!db) throw new Error('Database not initialized');
  
  console.log('Verifying tables...');
  
  const requiredTables = ['companies', 'quotes', 'users', 'projects', 'chat_messages', 'cost_settings', 'admin_users', 'admin_sessions', 'admin_activity_logs'];
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as any[];
  const tableNames = tables.map(t => t.name);
  
  for (const table of requiredTables) {
    if (!tableNames.includes(table)) {
      throw new Error(`Required table '${table}' was not created`);
    }
    
    // Get row count for debugging
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as any;
    console.log(`✓ Table '${table}' exists with ${count.count} rows`);
  }
}

function seedDemoCompanies() {
  if (!db) return;
  
  try {
    const count = db.prepare("SELECT COUNT(*) as count FROM companies").get() as any;
    
    if (count.count === 0) {
      console.log('Seeding demo companies...');
      
      const companies = [
        ["DEMO2024", "Demo Painting Company", "(555) 123-4567", "demo@paintingcompany.com"],
        ["PAINTER001", "Smith Painting LLC", "(555) 987-6543", "info@smithpainting.com"],
        ["CONTRACTOR123", "Elite Contractors", "(555) 456-7890", "quotes@elitecontractors.com"]
      ];
      
      const insertStmt = db.prepare(`
        INSERT INTO companies (access_code, company_name, phone, email) 
        VALUES (?, ?, ?, ?)
      `);
      
      for (const company of companies) {
        insertStmt.run(...company);
      }
      
      console.log('✓ Demo companies seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding demo companies:', error);
  }
}

function seedAdminUser() {
  if (!db) return;
  
  try {
    const count = db.prepare("SELECT COUNT(*) as count FROM admin_users").get() as any;
    
    if (count.count === 0) {
      console.log('Seeding admin user...');
      
      // Generate a random admin ID
      const adminId = randomBytes(16).toString('hex');
      
      const insertStmt = db.prepare(`
        INSERT INTO admin_users (id, email, full_name, role, is_active) 
        VALUES (?, ?, ?, ?, ?)
      `);
      
      insertStmt.run(adminId, 'admin@paintingapp.com', 'System Administrator', 'super_admin', 1);
      
      console.log('✓ Admin user seeded successfully');
      console.log('  Email: admin@paintingapp.com');
      console.log('  Password: admin123 (handled in login API)');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}

function seedDefaultPaintProducts() {
  if (!db) return;
  
  try {
    // Default paint products - 3 per category with popular brands and realistic pricing
    const defaultProducts = [
      // Interior Primers
      { projectType: 'interior', category: 'primer', supplier: 'Zinsser', productName: 'Bulls Eye 1-2-3', productLine: 'Water-Based', costPerGallon: 28, displayOrder: 1, sheen: 'Flat' },
      { projectType: 'interior', category: 'primer', supplier: 'Kilz', productName: 'Premium Primer', productLine: 'Multi-Surface', costPerGallon: 25, displayOrder: 2, sheen: 'Flat' },
      { projectType: 'interior', category: 'primer', supplier: 'Sherwin-Williams', productName: 'ProBlock', productLine: 'Interior/Exterior', costPerGallon: 32, displayOrder: 3, sheen: 'Flat' },
      
      // Interior Ceiling Paint
      { projectType: 'interior', category: 'ceiling_paint', supplier: 'Benjamin Moore', productName: 'Waterborne Ceiling Paint', productLine: 'Ultra Flat', costPerGallon: 55, displayOrder: 1, sheen: 'Ultra Flat' },
      { projectType: 'interior', category: 'ceiling_paint', supplier: 'Sherwin-Williams', productName: 'ProMar Ceiling Paint', productLine: 'Interior', costPerGallon: 42, displayOrder: 2, sheen: 'Flat' },
      { projectType: 'interior', category: 'ceiling_paint', supplier: 'Behr', productName: 'Premium Plus Ceiling', productLine: 'Interior', costPerGallon: 38, displayOrder: 3, sheen: 'Flat' },
      
      // Interior Wall Paint
      { projectType: 'interior', category: 'wall_paint', supplier: 'Benjamin Moore', productName: 'Regal Select', productLine: 'Interior', costPerGallon: 65, displayOrder: 1, sheen: 'Eggshell' },
      { projectType: 'interior', category: 'wall_paint', supplier: 'Sherwin-Williams', productName: 'ProClassic', productLine: 'Interior Acrylic', costPerGallon: 58, displayOrder: 2, sheen: 'Satin' },
      { projectType: 'interior', category: 'wall_paint', supplier: 'Behr', productName: 'Premium Plus Ultra', productLine: 'Interior', costPerGallon: 45, displayOrder: 3, sheen: 'Eggshell' },
      
      // Interior Trim Paint
      { projectType: 'interior', category: 'trim_paint', supplier: 'Benjamin Moore', productName: 'Advance', productLine: 'Waterborne Alkyd', costPerGallon: 75, displayOrder: 1, sheen: 'Semi-Gloss' },
      { projectType: 'interior', category: 'trim_paint', supplier: 'Sherwin-Williams', productName: 'ProClassic', productLine: 'Waterbased Acrylic-Alkyd', costPerGallon: 68, displayOrder: 2, sheen: 'Semi-Gloss' },
      { projectType: 'interior', category: 'trim_paint', supplier: 'PPG', productName: 'Break-Through!', productLine: 'Interior/Exterior', costPerGallon: 72, displayOrder: 3, sheen: 'Semi-Gloss' },
      
      // Exterior Primers
      { projectType: 'exterior', category: 'primer', supplier: 'Kilz', productName: 'Adhesion Primer', productLine: 'Interior/Exterior', costPerGallon: 35, displayOrder: 1, sheen: 'Flat' },
      { projectType: 'exterior', category: 'primer', supplier: 'Zinsser', productName: 'Cover Stain', productLine: 'Oil-Based', costPerGallon: 38, displayOrder: 2, sheen: 'Flat' },
      { projectType: 'exterior', category: 'primer', supplier: 'Benjamin Moore', productName: 'Fresh Start', productLine: 'High-Hiding', costPerGallon: 42, displayOrder: 3, sheen: 'Flat' },
      
      // Exterior Wall Paint
      { projectType: 'exterior', category: 'wall_paint', supplier: 'Benjamin Moore', productName: 'Aura Exterior', productLine: 'Premium', costPerGallon: 85, displayOrder: 1, sheen: 'Satin' },
      { projectType: 'exterior', category: 'wall_paint', supplier: 'Sherwin-Williams', productName: 'Duration', productLine: 'Exterior Acrylic', costPerGallon: 78, displayOrder: 2, sheen: 'Satin' },
      { projectType: 'exterior', category: 'wall_paint', supplier: 'Behr', productName: 'Marquee', productLine: 'Exterior', costPerGallon: 65, displayOrder: 3, sheen: 'Satin' },
      
      // Exterior Trim Paint
      { projectType: 'exterior', category: 'trim_paint', supplier: 'Benjamin Moore', productName: 'Advance Exterior', productLine: 'Waterborne Alkyd', costPerGallon: 82, displayOrder: 1, sheen: 'Gloss' },
      { projectType: 'exterior', category: 'trim_paint', supplier: 'Sherwin-Williams', productName: 'ProClassic', productLine: 'Exterior', costPerGallon: 75, displayOrder: 2, sheen: 'Gloss' },
      { projectType: 'exterior', category: 'trim_paint', supplier: 'PPG', productName: 'Manor Hall', productLine: 'Exterior', costPerGallon: 70, displayOrder: 3, sheen: 'Semi-Gloss' }
    ];
    
    // Get all companies
    const companies = db.prepare("SELECT id FROM companies").all() as any[];
    
    // For each company, check if they have paint products
    for (const company of companies) {
      const productCount = db.prepare("SELECT COUNT(*) as count FROM company_paint_products WHERE user_id = ?").get(company.id) as any;
      
      if (productCount.count === 0) {
        console.log(`Seeding default paint products for company ${company.id}...`);
        
        const insertStmt = db.prepare(`
          INSERT INTO company_paint_products (
            user_id, project_type, product_category, supplier, product_name,
            product_line, cost_per_gallon, display_order, sheen, coverage_per_gallon
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        for (const product of defaultProducts) {
          insertStmt.run(
            company.id,
            product.projectType,
            product.category,
            product.supplier,
            product.productName,
            product.productLine,
            product.costPerGallon,
            product.displayOrder,
            product.sheen,
            350 // Default coverage
          );
        }
        
        console.log(`✓ Default paint products seeded for company ${company.id}`);
      }
    }
  } catch (error) {
    console.error('Error seeding default paint products:', error);
  }
}

// Database utility functions
export const dbUtils = {
  generateId(): string {
    return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  },
  
  parseJson(jsonString: string | null): any {
    if (!jsonString) return null;
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('JSON parse error:', error);
      return null;
    }
  },
  
  stringifyJson(data: any): string {
    try {
      return JSON.stringify(data);
    } catch (error) {
      console.error('JSON stringify error:', error);
      return '{}';
    }
  },
  
  transaction<T>(fn: (db: Database.Database) => T): T {
    const database = getDatabase();
    const transaction = database.transaction(fn);
    return transaction(database);
  }
};

// Prepared statements
export function getPreparedStatements() {
  const database = getDatabase();
  
  return {
    // Legacy quote operations
    createQuote: database.prepare(`
      INSERT INTO quotes (
        company_id, quote_id, customer_name, customer_email, customer_phone,
        address, project_type, paint_quality, timeline, special_requests,
        walls_sqft, ceilings_sqft, trim_sqft, total_revenue, subtotal,
        conversation_summary, status, room_data, room_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    
    getQuoteById: database.prepare(`
      SELECT q.*, c.company_name, c.phone as company_phone, c.email as company_email
      FROM quotes q
      LEFT JOIN companies c ON q.company_id = c.id
      WHERE q.quote_id = ?
    `),
    
    updateQuote: database.prepare(`
      UPDATE quotes 
      SET customer_name = ?, customer_email = ?, customer_phone = ?,
          address = ?, project_type = ?, paint_quality = ?, timeline = ?,
          special_requests = ?, walls_sqft = ?, ceilings_sqft = ?, trim_sqft = ?,
          total_revenue = ?, subtotal = ?, conversation_summary = ?, status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE quote_id = ?
    `),
    
    // New schema operations
    createUser: database.prepare(`
      INSERT INTO users (id, email, company_name)
      VALUES (?, ?, ?)
    `),
    
    createProject: database.prepare(`
      INSERT INTO projects (id, user_id, client_name, property_address, client_email, client_phone, preferred_contact, client_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `),
    
    createChatMessage: database.prepare(`
      INSERT INTO chat_messages (id, project_id, role, content, metadata)
      VALUES (?, ?, ?, ?, ?)
    `),
    
    getChatMessagesByProjectId: database.prepare(`
      SELECT * FROM chat_messages WHERE project_id = ? ORDER BY created_at ASC
    `),
    
    createCostSettings: database.prepare(`
      INSERT OR REPLACE INTO cost_settings (
        id, user_id, labor_cost_per_hour, paint_costs, supplies_base_cost, 
        company_name, contact_name, default_labor_percentage, default_spread_rate,
        door_trim_pricing, baseboard_pricing, default_rates, default_paint_costs
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
  };
}

// Close database connection
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    console.log('Database connection closed');
  }
}

// Initialize database on module load
getDatabase();