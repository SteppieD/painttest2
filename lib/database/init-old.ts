import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    // Initialize database with new name to avoid conflicts
    db = new Database('painting_contractor.db');
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // Set journal mode to WAL for better performance
    db.pragma('journal_mode = WAL');
    
    // Initialize schema
    initializeSchema();
    
    console.log('Database initialized successfully');
  }
  
  return db;
}

function initializeSchema() {
  if (!db) return;
  
  try {
    // Read and execute schema
    const schemaPath = join(process.cwd(), 'lib', 'database', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    
    // Split schema into individual statements and execute
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      try {
        db.exec(statement + ';');
      } catch (error: any) {
        // Skip statements that might already exist or are not needed
        if (!error.message.includes('already exists')) {
          console.warn('Schema execution warning:', error.message);
        }
      }
    }
    
    console.log('Database schema initialized');
  } catch (error) {
    console.error('Error initializing schema:', error);
    throw error;
  }
}

// Database utility functions
export const dbUtils = {
  // Helper to generate UUID-like strings for SQLite
  generateId(): string {
    return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  },
  
  // Helper to parse JSON fields safely
  parseJson(jsonString: string | null): any {
    if (!jsonString) return null;
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  },
  
  // Helper to stringify JSON fields safely
  stringifyJson(data: any): string {
    try {
      return JSON.stringify(data);
    } catch {
      return '{}';
    }
  },
  
  // Transaction wrapper
  transaction<T>(fn: (db: Database.Database) => T): T {
    const database = getDatabase();
    const transaction = database.transaction(fn);
    return transaction(database);
  }
};

// Prepared statements for common operations
export function getPreparedStatements() {
  const database = getDatabase();
  
  return {
    // Users
    createUser: database.prepare(`
      INSERT INTO users (id, email, company_name)
      VALUES (?, ?, ?)
    `),
    
    getUserById: database.prepare(`
      SELECT * FROM users WHERE id = ?
    `),
    
    getUserByEmail: database.prepare(`
      SELECT * FROM users WHERE email = ?
    `),
    
    // Projects
    createProject: database.prepare(`
      INSERT INTO projects (id, user_id, client_name, property_address, client_email, client_phone, preferred_contact, client_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `),
    
    getProjectsByUserId: database.prepare(`
      SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC
    `),
    
    getProjectById: database.prepare(`
      SELECT * FROM projects WHERE id = ?
    `),
    
    updateProject: database.prepare(`
      UPDATE projects 
      SET client_name = ?, property_address = ?, client_email = ?, client_phone = ?, preferred_contact = ?, client_notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `),
    
    // Chat Messages
    createChatMessage: database.prepare(`
      INSERT INTO chat_messages (id, project_id, role, content, metadata)
      VALUES (?, ?, ?, ?, ?)
    `),
    
    getChatMessagesByProjectId: database.prepare(`
      SELECT * FROM chat_messages WHERE project_id = ? ORDER BY created_at ASC
    `),
    
    // Cost Settings
    createCostSettings: database.prepare(`
      INSERT OR REPLACE INTO cost_settings (
        id, user_id, labor_cost_per_hour, paint_costs, supplies_base_cost, 
        company_name, contact_name, default_labor_percentage, default_spread_rate,
        door_trim_pricing, baseboard_pricing, default_rates, default_paint_costs
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    
    getCostSettingsByUserId: database.prepare(`
      SELECT * FROM cost_settings WHERE user_id = ?
    `),
    
    // Paint Products
    createPaintProduct: database.prepare(`
      INSERT INTO paint_products (id, user_id, product_name, use_case, cost_per_gallon, sheen, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `),
    
    getPaintProductsByUserId: database.prepare(`
      SELECT * FROM paint_products WHERE user_id = ? AND is_active = TRUE ORDER BY product_name
    `),
    
    getPaintProductById: database.prepare(`
      SELECT * FROM paint_products WHERE id = ?
    `),
    
    // Quotes
    createQuote: database.prepare(`
      INSERT INTO quotes (
        id, project_id, base_costs, markup_percentage, final_price, details,
        valid_until, quote_method, job_status, sundries_cost, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    
    getQuotesByProjectId: database.prepare(`
      SELECT * FROM quotes WHERE project_id = ? ORDER BY created_at DESC
    `),
    
    getQuoteById: database.prepare(`
      SELECT * FROM quotes WHERE id = ?
    `),
    
    updateQuoteStatus: database.prepare(`
      UPDATE quotes 
      SET status = ?, sent_at = ?, accepted_at = ?, rejected_at = ?, expires_at = ?
      WHERE id = ?
    `),
    
    // Quote Surfaces
    createQuoteSurface: database.prepare(`
      INSERT INTO quote_surfaces (
        id, quote_id, surface_type, square_footage, rate_per_sqft, 
        paint_product_id, custom_paint_name, paint_cost_per_gallon,
        spread_rate, gallons_needed, paint_cost, surface_total
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    
    getQuoteSurfacesByQuoteId: database.prepare(`
      SELECT * FROM quote_surfaces WHERE quote_id = ?
    `),
    
    // Room Details
    createRoomDetail: database.prepare(`
      INSERT INTO room_details (
        id, project_id, room_name, wall_lengths, ceiling_height,
        door_count, door_types, window_count, baseboard_length,
        ceiling_included, trim_included
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    
    getRoomDetailsByProjectId: database.prepare(`
      SELECT * FROM room_details WHERE project_id = ?
    `),
    
    // Quote Versions
    createQuoteVersion: database.prepare(`
      INSERT INTO quote_versions (id, quote_id, version, base_costs, markup_percentage, final_price, details, changes, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    
    getQuoteVersionsByQuoteId: database.prepare(`
      SELECT * FROM quote_versions WHERE quote_id = ? ORDER BY version DESC
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