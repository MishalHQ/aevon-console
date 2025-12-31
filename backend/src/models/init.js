// Initialize database tables and default admin user
const db = require('../config/database');
const bcrypt = require('bcryptjs');

function initDatabase() {
  console.log('🔧 Initializing database...');

  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('Business', 'Student', 'Internal Demo')),
      status TEXT NOT NULL CHECK(status IN ('Planned', 'Active', 'Completed')),
      description TEXT,
      tech_stack TEXT,
      is_demo BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Check if admin user exists
  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get(process.env.ADMIN_EMAIL || 'admin@aevon.com');

  if (!adminExists) {
    // Create default admin user
    const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
    db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)').run(
      process.env.ADMIN_EMAIL || 'admin@aevon.com',
      hashedPassword,
      'admin'
    );
    console.log('✅ Default admin user created');
    console.log('   Email:', process.env.ADMIN_EMAIL || 'admin@aevon.com');
    console.log('   Password:', process.env.ADMIN_PASSWORD || 'admin123');
  }

  console.log('✅ Database initialized successfully');
}

module.exports = { initDatabase };