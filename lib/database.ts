// Import the simplified database system for deployment
import { 
  getCompanyByAccessCode as getCompanyByAccessCodeSimple,
  createQuote as createQuoteSimple,
  createCompany as createCompanySimple,
  dbGet as dbGetSimple,
  dbAll as dbAllSimple,
  dbRun as dbRunSimple,
  updateQuote as updateQuoteSimple,
  initializeDatabase
} from './database-simple';

// Initialize database on import
initializeDatabase().catch(err => console.log('Database initialization warning:', err));

// Legacy compatibility - simplified mock database
function getDb() {
  return {
    prepare: (sql: string) => ({
      get: (...params: any[]) => dbGetSimple(sql, params),
      all: (...params: any[]) => dbAllSimple(sql, params),
      run: (...params: any[]) => dbRunSimple(sql, params)
    })
  };
}

// Simplified data initialization
console.log('Database initialized with simplified adapter');

export const dbGet = dbGetSimple;
export const dbAll = dbAllSimple;
export const dbRun = dbRunSimple;

// Legacy compatibility functions using simplified adapter
export const getCompanyByAccessCode = getCompanyByAccessCodeSimple;

export const createCompany = createCompanySimple;

// Legacy quote functions using simplified adapter
export const createQuote = createQuoteSimple;
export const updateQuote = updateQuoteSimple;

export default getDb;