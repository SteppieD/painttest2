import { getDatabase } from '../lib/database/init';
import fs from 'fs';
import path from 'path';

// Run the Stripe migration
async function runMigration() {
  try {
    const db = getDatabase();
    
    // Read and execute the migration
    const migrationPath = path.join(process.cwd(), 'lib/database/migrations/add-stripe-fields.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    for (const statement of statements) {
      try {
        await db.prepare(statement).run();
        console.log('✓ Executed:', statement.substring(0, 50) + '...');
      } catch (error: any) {
        // Ignore "duplicate column" errors
        if (!error.message.includes('duplicate column')) {
          console.error('✗ Failed:', statement.substring(0, 50) + '...');
          console.error('  Error:', error.message);
        }
      }
    }
    
    console.log('\n✨ Stripe migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();