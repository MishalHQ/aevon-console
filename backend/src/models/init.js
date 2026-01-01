// Secure Admin Console - Database Initialization
const db = require('../config/database');
const bcrypt = require('bcryptjs');

function initDatabase() {
  console.log('🔧 Initializing Secure Admin Console database...');

  // Users table with role-based access
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('ADMIN', 'VIEWER')),
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('active', 'completed', 'archived')),
      description TEXT,
      owner_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Audit logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      user_email TEXT NOT NULL,
      details TEXT,
      ip_address TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Database tables created');

  // Create default admin user if not exists
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@secureadmin.local';
  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);

  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
    const result = db.prepare(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)'
    ).run(adminEmail, hashedPassword, 'System Administrator', 'ADMIN');

    // Log admin creation
    db.prepare(
      'INSERT INTO audit_logs (action, user_id, user_email, details) VALUES (?, ?, ?, ?)'
    ).run('USER_CREATED', result.lastInsertRowid, adminEmail, 'Initial admin user created');

    console.log('✅ Default admin user created');
    console.log('   Email:', adminEmail);
    console.log('   Password:', process.env.ADMIN_PASSWORD || 'admin123');
  }

  // Seed demo data for showcase
  seedDemoData();

  console.log('✅ Database initialized successfully');
}

function seedDemoData() {
  const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (existingUsers.count > 1) {
    console.log('ℹ️  Demo data already exists');
    return;
  }

  console.log('🌱 Seeding demo data...');

  // Get admin user
  const admin = db.prepare('SELECT id, email FROM users WHERE role = ?').get('ADMIN');

  // Create demo viewer user
  const hashedPassword = bcrypt.hashSync('viewer123', 10);
  const viewerResult = db.prepare(
    'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)'
  ).run('viewer@secureadmin.local', hashedPassword, 'Demo Viewer', 'VIEWER');

  // Log viewer creation
  db.prepare(
    'INSERT INTO audit_logs (action, user_id, user_email, details) VALUES (?, ?, ?, ?)'
  ).run('USER_CREATED', admin.id, admin.email, `Created viewer user: viewer@secureadmin.local`);

  console.log('✅ Created demo viewer user');
  console.log('   Email: viewer@secureadmin.local');
  console.log('   Password: viewer123');

  // Create demo projects
  const projects = [
    ['Authentication System', 'active', 'JWT-based authentication with role management', admin.id],
    ['API Gateway', 'active', 'Centralized API gateway with rate limiting', admin.id],
    ['Monitoring Dashboard', 'completed', 'Real-time system monitoring and alerts', admin.id],
    ['Database Migration Tool', 'archived', 'Automated database schema migration system', admin.id],
    ['User Management Portal', 'active', 'Internal user administration interface', admin.id]
  ];

  const insertProject = db.prepare(
    'INSERT INTO projects (name, status, description, owner_id) VALUES (?, ?, ?, ?)'
  );

  projects.forEach(project => {
    const result = insertProject.run(...project);
    
    // Log project creation
    db.prepare(
      'INSERT INTO audit_logs (action, user_id, user_email, details) VALUES (?, ?, ?, ?)'
    ).run('PROJECT_CREATED', admin.id, admin.email, `Created project: ${project[0]}`);
  });

  console.log('✅ Seeded 5 demo projects');

  // Add some demo audit logs
  const demoLogs = [
    ['USER_LOGIN', admin.id, admin.email, 'Successful login from dashboard'],
    ['PROJECT_UPDATED', admin.id, admin.email, 'Updated project: Authentication System'],
    ['USER_LOGIN', viewerResult.lastInsertRowid, 'viewer@secureadmin.local', 'Successful login'],
    ['PROJECT_VIEWED', viewerResult.lastInsertRowid, 'viewer@secureadmin.local', 'Viewed project: API Gateway']
  ];

  const insertLog = db.prepare(
    'INSERT INTO audit_logs (action, user_id, user_email, details) VALUES (?, ?, ?, ?)'
  );

  demoLogs.forEach(log => insertLog.run(...log));

  console.log('✅ Seeded demo audit logs');
  console.log('🎉 Demo data seeding complete!');
}

module.exports = { initDatabase };