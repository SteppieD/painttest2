// Supabase-only database initialization
import { supabaseDb } from './supabase-adapter';

// Export functions that other files expect
export function getDatabase() {
  // Return a mock database object that uses Supabase under the hood
  return {
    prepare: (sql: string) => ({
      get: async (...params: any[]) => {
        // This would need to be implemented per query
        console.warn('SQLite-style query not implemented for Supabase:', sql);
        return null;
      },
      all: async (...params: any[]) => {
        console.warn('SQLite-style query not implemented for Supabase:', sql);
        return [];
      },
      run: async (...params: any[]) => {
        console.warn('SQLite-style query not implemented for Supabase:', sql);
        return { changes: 0 };
      }
    }),
    transaction: (fn: Function) => {
      // Mock transaction - just execute the function
      console.warn('Transaction not implemented for Supabase - executing directly');
      return fn();
    }
  };
}

export function closeDatabase() {
  // No-op for Supabase
}

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
  
  transaction<T>(fn: (db: any) => T): T {
    const database = getDatabase();
    return fn(database);
  }
};

// Mock prepared statements for compatibility
export function getPreparedStatements() {
  return {
    createQuote: {
      run: async (...params: any[]) => {
        console.warn('SQLite-style prepared statement not implemented for Supabase');
        return { changes: 0 };
      }
    },
    getQuoteById: {
      get: async (...params: any[]) => {
        console.warn('SQLite-style prepared statement not implemented for Supabase');
        return null;
      }
    },
    updateQuote: {
      run: async (...params: any[]) => {
        console.warn('SQLite-style prepared statement not implemented for Supabase');
        return { changes: 0 };
      }
    }
  };
}