import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

const db = new Database('./painting_quotes_app.db');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create migrations table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL UNIQUE,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Run migration
function runMigration(filename: string) {
  const applied = db.prepare('SELECT 1 FROM migrations WHERE filename = ?').get(filename);
  
  if (!applied) {
    console.log(`Running migration: ${filename}`);
    const migrationPath = join(__dirname, 'migrations', filename);
    const migration = readFileSync(migrationPath, 'utf8');
    
    try {
      db.exec(migration);
      db.prepare('INSERT INTO migrations (filename) VALUES (?)').run(filename);
      console.log(`✓ Migration ${filename} applied successfully`);
    } catch (error) {
      console.error(`✗ Error applying migration ${filename}:`, error);
      throw error;
    }
  } else {
    console.log(`⏭️  Migration ${filename} already applied`);
  }
}

// Run all migrations
try {
  runMigration('001_company_profile_products.sql');
  console.log('All migrations completed successfully');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
} finally {
  db.close();
}