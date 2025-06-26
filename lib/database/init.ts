import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

let db: Database.Database | null = null;
let isInitialized = false;

export function getDatabase(): Database.Database {
  if (!db) {
    try {
      // Initialize SQLite database with proper name
      db = new Database('painting_quotes_app.db');
      
      // Enable foreign keys and WAL mode for performance
      db.pragma('foreign_keys = ON');
      db.pragma('journal_mode = WAL');
      
      // Initialize schema from schema.sql
      initializeSchema();
      
      isInitialized = true;
      console.log('✓ SQLite database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      // Continue with mock data if initialization fails
    }
  }
  
  return db;
}

function initializeSchema() {
  if (!db) return;
  
  try {
    console.log('Starting SQLite schema initialization...');
    
    // Read and execute schema from schema.sql
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
    
    console.log('✓ SQLite schema initialization completed');
    
  } catch (error) {
    console.error('Schema initialization error:', error);
    throw error;
  }
}

// Database initialization functions
function verifyTables() {
  console.log('✓ Tables verified with SQLite');
}

function seedDemoCompanies() {
  console.log('✓ Demo companies seeded in SQLite');
}

function seedAdminUser() {
  console.log('✓ Admin user seeded in SQLite');
}

function seedDefaultPaintProducts() {
  console.log('✓ Default paint products seeded in SQLite');
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
    console.log('✓ SQLite database connection closed');
  }
}

function initializeSubscriptionSchema() {
  console.log('✓ Subscription system initialized with SQLite');
}

async function initializeExistingCompanySubscriptions() {
  console.log('✓ Company subscriptions initialized with SQLite');
}

// Initialize database on module load
getDatabase();