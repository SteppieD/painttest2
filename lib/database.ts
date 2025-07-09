// Import the Supabase database system for production deployment
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

// Supabase-only database adapter
function getDb() {
  return {
    prepare: (sql: string) => ({
      get: (...params: any[]) => dbGetSimple(sql, params),
      all: (...params: any[]) => dbAllSimple(sql, params),
      run: (...params: any[]) => dbRunSimple(sql, params)
    })
  };
}

// Supabase data initialization
console.log('Database initialized with Supabase adapter');

export const dbGet = dbGetSimple;
export const dbAll = dbAllSimple;
export const dbRun = dbRunSimple;

// Functions using Supabase adapter
export const getCompanyByAccessCode = getCompanyByAccessCodeSimple;
export const createCompany = createCompanySimple;
export const createQuote = createQuoteSimple;
export const updateQuote = updateQuoteSimple;

export default getDb;