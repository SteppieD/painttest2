const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Open the database
const db = new Database('./painting_quotes_app.db');

try {
  console.log('Setting up admin tables...');

  // Create admin_users table
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
  console.log('✓ Admin users table created');

  // Create admin_sessions table
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
  console.log('✓ Admin sessions table created');

  // Create admin_activity_logs table
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
  console.log('✓ Admin activity logs table created');

  // Check if admin user already exists
  const existingAdmin = db.prepare('SELECT * FROM admin_users WHERE email = ?').get('admin@paintingapp.com');
  
  if (!existingAdmin) {
    // Create default admin user
    const adminId = crypto.randomBytes(16).toString('hex');
    const passwordHash = bcrypt.hashSync('admin123', 10);
    
    db.prepare(`
      INSERT INTO admin_users (id, email, password_hash, full_name, role, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(adminId, 'admin@paintingapp.com', passwordHash, 'System Administrator', 'super_admin', 1);
    
    console.log('✓ Default admin user created');
    console.log('   Email: admin@paintingapp.com');
    console.log('   Password: admin123');
  } else {
    console.log('✓ Admin user already exists');
  }

  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
    CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON admin_sessions(admin_user_id);
    CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_user_id ON admin_activity_logs(admin_user_id);
  `);
  console.log('✓ Admin indexes created');

  console.log('\nAdmin setup completed successfully!');

} catch (error) {
  console.error('Error setting up admin tables:', error);
} finally {
  db.close();
}