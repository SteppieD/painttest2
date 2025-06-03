// Import the new comprehensive database system
import { getDatabase, getPreparedStatements, dbUtils } from './database/init';
import Database from "better-sqlite3";

// Re-export the new database utilities for use throughout the app
export { getDatabase, getPreparedStatements, dbUtils };

// Legacy compatibility - get the database instance
function getDb() {
  return getDatabase();
}

// Legacy data migration for existing quotes
const migrateLegacyData = () => {
  const db = getDatabase();
  
  try {
    // Check if legacy companies table exists
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='companies'
    `).get();
    
    if (tableExists) {
      console.log('Legacy companies table found, migrating data...');
      
      // Get all companies from legacy table
      const companies = db.prepare('SELECT * FROM companies').all();
      
      // Migrate to new users and cost_settings tables
      for (const company of companies as any[]) {
        // Create user record
        const userId = dbUtils.generateId();
        const stmt = getPreparedStatements();
        
        try {
          stmt.createUser.run(userId, company.email || `${company.access_code}@temp.com`, company.company_name);
          
          // Create cost settings
          const costSettingsId = dbUtils.generateId();
          stmt.createCostSettings.run(
            costSettingsId,
            userId,
            25, // default labor rate
            JSON.stringify({"best": 50, "good": 25, "better": 35}),
            100, // supplies base cost
            company.company_name,
            company.company_name,
            company.default_labor_percentage || 30,
            company.default_paint_coverage || 350,
            JSON.stringify({"door_unit_price": 45, "trim_linear_foot_price": 3}),
            JSON.stringify({"charge_method": "linear_foot", "price_per_linear_foot": 2.5}),
            JSON.stringify({
              "walls": company.default_walls_rate || 3.00,
              "ceilings": company.default_ceilings_rate || 2.00,
              "trim_doors": company.default_trim_rate || 5.00
            }),
            JSON.stringify({
              "walls": company.default_walls_paint_cost || 26,
              "ceilings": company.default_ceilings_paint_cost || 25,
              "trim_doors": company.default_trim_paint_cost || 35
            })
          );
          
          console.log(`Migrated company: ${company.company_name}`);
        } catch (error: any) {
          console.log(`Company ${company.company_name} already migrated or error:`, error.message);
        }
      }
    }
  } catch (error) {
    console.log('No legacy data to migrate or migration complete');
  }
};

// Run migration on startup
migrateLegacyData();

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

// Legacy compatibility functions that now use the new schema
export const getCompanyByAccessCode = (accessCode: string) => {
  // For legacy compatibility, look up user by email or access code simulation
  const user = dbGet("SELECT * FROM users WHERE email LIKE ? OR company_name = ?", [`%${accessCode}%`, accessCode]) as any;
  if (user) {
    // Get cost settings for this user
    const costSettings = dbGet("SELECT * FROM cost_settings WHERE user_id = ?", [user.id]) as any;
    return {
      id: user.id,
      access_code: accessCode,
      company_name: user.company_name,
      email: user.email,
      ...costSettings
    };
  }
  return null;
};

export const createCompany = (data: {
  access_code: string;
  company_name: string;
  phone?: string;
  email?: string;
  logo_url?: string;
}) => {
  const userId = dbUtils.generateId();
  const stmt = getPreparedStatements();
  
  // Create user
  stmt.createUser.run(userId, data.email || `${data.access_code}@temp.com`, data.company_name);
  
  // Create default cost settings
  const costSettingsId = dbUtils.generateId();
  stmt.createCostSettings.run(
    costSettingsId,
    userId,
    25, // default labor rate
    JSON.stringify({"best": 50, "good": 25, "better": 35}),
    100, // supplies base cost
    data.company_name,
    data.company_name,
    30, // default labor percentage
    350, // default spread rate
    JSON.stringify({"door_unit_price": 45, "trim_linear_foot_price": 3}),
    JSON.stringify({"charge_method": "linear_foot", "price_per_linear_foot": 2.5}),
    JSON.stringify({"walls": 3.00, "ceilings": 2.00, "trim_doors": 5.00}),
    JSON.stringify({"walls": 26, "ceilings": 25, "trim_doors": 35})
  );
  
  return { lastID: userId, changes: 1 };
};

// Legacy quote functions - use legacy quotes table for compatibility
export const createQuote = (data: any) => {
  const stmt = getPreparedStatements();
  
  // Use the legacy createQuote prepared statement with correct parameters
  // The prepared statement expects these 17 parameters in order:
  // company_id, quote_id, customer_name, customer_email, customer_phone,
  // address, project_type, paint_quality, timeline, special_requests,
  // walls_sqft, ceilings_sqft, trim_sqft, total_revenue, subtotal,
  // conversation_summary, status
  
  const result = stmt.createQuote.run(
    data.company_id,
    data.quote_id,
    data.customer_name,
    data.customer_email || null,
    data.customer_phone || null,
    data.address || null,
    data.project_type || null,
    data.paint_quality || null,
    data.timeline || null,
    data.special_requests || null,
    data.walls_sqft || 0,
    data.ceilings_sqft || 0,
    data.trim_sqft || 0,
    data.total_revenue || 0,
    data.subtotal || data.total_revenue || 0,
    data.conversation_summary || '[]',
    data.status || 'pending'
  );
  
  return { lastID: result.lastInsertRowid, changes: result.changes };
};

export const updateQuote = (id: string, data: any) => {
  // Update quote in new schema
  const updates = Object.keys(data).map(key => `${key} = ?`).join(", ");
  const values = [...Object.values(data), id];
  
  return dbRun(
    `UPDATE quotes SET ${updates} WHERE id = ?`,
    values
  );
};

export default getDb;