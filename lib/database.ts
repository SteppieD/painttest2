import Database from "better-sqlite3";
import path from "path";

let db: Database.Database | null = null;

// Seed demo companies if they don't exist
const seedDemoCompanies = (database: Database.Database) => {
  const stmt = database.prepare("SELECT COUNT(*) as count FROM companies");
  const companyExists = stmt.get() as any;
  
  if (companyExists.count === 0) {
    const companies = [
      ["DEMO2024", "Demo Painting Company", "(555) 123-4567", "demo@paintingcompany.com"],
      ["PAINTER001", "Smith Painting LLC", "(555) 987-6543", "info@smithpainting.com"],
      ["CONTRACTOR123", "Elite Contractors", "(555) 456-7890", "quotes@elitecontractors.com"],
      ["CUSTOM789", "Custom Paint Works", "(555) 234-5678", "hello@custompaintworks.com"],
      ["BUILDER456", "Premier Builders", "(555) 345-6789", "contact@premierbuilders.com"],
      ["PAINT2025", "Modern Paint Solutions", "(555) 567-8901", "info@modernpaint.com"]
    ];

    const insertStmt = database.prepare(`
      INSERT INTO companies (access_code, company_name, phone, email) 
      VALUES (?, ?, ?, ?)
    `);

    companies.forEach(company => insertStmt.run(...company));
    console.log("✅ Demo companies seeded successfully");
  }
};

// Lazy database initialization
function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), "quotes.db");
    db = new Database(dbPath);
    
    // Initialize database tables
    db.exec(`
  CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    access_code TEXT UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    logo_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    quote_id TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT,
    address TEXT,
    rooms TEXT,
    paint_quality TEXT,
    prep_work TEXT,
    timeline TEXT,
    special_requests TEXT,
    base_cost REAL,
    markup_percentage REAL,
    final_price REAL,
    status TEXT DEFAULT 'pending',
    conversation_summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
  );

  CREATE INDEX IF NOT EXISTS idx_quotes_company_id ON quotes(company_id);
  CREATE INDEX IF NOT EXISTS idx_quotes_quote_id ON quotes(quote_id);
  CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
`);

    // Seed demo companies
    seedDemoCompanies(db);
  }
  
  return db;
}

export const dbGet = (sql: string, params: any[] = []) => {
  const db = getDb();
  const stmt = db.prepare(sql);
  return stmt.get(...params);
};

export const dbAll = (sql: string, params: any[] = []) => {
  const db = getDb();
  const stmt = db.prepare(sql);
  return stmt.all(...params);
};

export const dbRun = (sql: string, params: any[] = []) => {
  const db = getDb();
  const stmt = db.prepare(sql);
  const result = stmt.run(...params);
  return { lastID: result.lastInsertRowid, changes: result.changes };
};

// Helper functions for common operations
export const getCompanyByAccessCode = (accessCode: string) => {
  return dbGet("SELECT * FROM companies WHERE access_code = ?", [accessCode]);
};

export const createCompany = (data: {
  access_code: string;
  company_name: string;
  phone?: string;
  email?: string;
  logo_url?: string;
}) => {
  return dbRun(
    `INSERT INTO companies (access_code, company_name, phone, email, logo_url) 
     VALUES (?, ?, ?, ?, ?)`,
    [data.access_code, data.company_name, data.phone || null, data.email || null, data.logo_url || null]
  );
};

export const createQuote = (data: any) => {
  const columns = Object.keys(data).join(", ");
  const placeholders = Object.keys(data).map(() => "?").join(", ");
  const values = Object.values(data);
  
  return dbRun(
    `INSERT INTO quotes (${columns}) VALUES (${placeholders})`,
    values
  );
};

export const updateQuote = (id: number, data: any) => {
  const updates = Object.keys(data).map(key => `${key} = ?`).join(", ");
  const values = [...Object.values(data), id];
  
  return dbRun(
    `UPDATE quotes SET ${updates}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    values
  );
};

export default getDb;