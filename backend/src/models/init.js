// Initialize database tables with business features and demo data
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
      name TEXT DEFAULT 'Admin User',
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create projects table (enhanced)
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('Business', 'Student', 'Internal Demo')),
      status TEXT NOT NULL CHECK(status IN ('Planned', 'Active', 'Completed')),
      description TEXT,
      tech_stack TEXT,
      is_demo BOOLEAN DEFAULT 0,
      client_id INTEGER,
      start_date TEXT,
      end_date TEXT,
      budget REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
    )
  `);

  // Create clients table
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      company TEXT,
      industry TEXT,
      status TEXT DEFAULT 'Active',
      address TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create tasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      project_id INTEGER NOT NULL,
      assigned_to INTEGER,
      status TEXT DEFAULT 'To Do',
      priority TEXT DEFAULT 'Medium',
      due_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Create leads table
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      source TEXT,
      stage TEXT DEFAULT 'Contacted',
      potential_value REAL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create services table
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT,
      duration TEXT,
      features TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create notifications table
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('✅ Database tables created');

  // Check if admin user exists
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@aevon.com';
  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);

  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
    db.prepare('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)').run(
      adminEmail,
      hashedPassword,
      'Admin User',
      'admin'
    );
    console.log('✅ Default admin user created');
    console.log('   Email:', adminEmail);
    console.log('   Password:', process.env.ADMIN_PASSWORD || 'admin123');
  }

  // Seed demo data
  seedDemoData();

  console.log('✅ Database initialized successfully');
}

function seedDemoData() {
  // Check if demo data already exists
  const existingClients = db.prepare('SELECT COUNT(*) as count FROM clients').get();
  if (existingClients.count > 0) {
    console.log('ℹ️  Demo data already exists');
    return;
  }

  console.log('🌱 Seeding demo data...');

  // Seed Clients
  const clients = [
    ['Sarah Johnson', 'sarah.johnson@techcorp.com', '+91 98765 43210', 'TechCorp Solutions', 'Technology', 'Active', 'Cyber City, Gurgaon, Haryana 122002', 'Key decision maker'],
    ['Michael Chen', 'michael.chen@innovate.io', '+91 98765 43211', 'Innovate Digital', 'Marketing', 'Active', 'Bandra West, Mumbai, Maharashtra 400050', 'Long-term partnership'],
    ['Emily Rodriguez', 'emily.r@healthplus.com', '+91 98765 43212', 'HealthPlus Medical', 'Healthcare', 'Active', 'Koramangala, Bangalore, Karnataka 560034', 'HIPAA compliance required'],
    ['David Kim', 'david.kim@financegroup.com', '+91 98765 43213', 'Finance Group LLC', 'Finance', 'Active', 'Nariman Point, Mumbai, Maharashtra 400021', 'High-value client'],
    ['Lisa Anderson', 'lisa.a@ecommhub.com', '+91 98765 43214', 'EcommHub Inc', 'E-commerce', 'Active', 'Whitefield, Bangalore, Karnataka 560066', 'Rapid growth company'],
    ['James Wilson', 'james.w@edutech.org', '+91 98765 43215', 'EduTech Academy', 'Education', 'Inactive', 'Sector 62, Noida, Uttar Pradesh 201301', 'Project completed'],
    ['Maria Garcia', 'maria.garcia@realestate.com', '+91 98765 43216', 'Prime Real Estate', 'Real Estate', 'Active', 'Andheri East, Mumbai, Maharashtra 400069', 'Referral client']
  ];

  const insertClient = db.prepare('INSERT INTO clients (name, email, phone, company, industry, status, address, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const clientIds = clients.map(c => insertClient.run(...c).lastInsertRowid);
  console.log('✅ Seeded 7 clients');

  // Seed Business Projects (Budget in INR)
  const projects = [
    ['Enterprise CRM System', 'Custom CRM solution with advanced analytics', 'Business', 'Active', 'React, Node.js, PostgreSQL, AWS', 1, clientIds[0], '2024-01-15', '2024-06-30', 3735000],
    ['Digital Marketing Platform', 'Marketing automation with campaign management', 'Business', 'Active', 'Vue.js, Python, MongoDB, Google Cloud', 1, clientIds[1], '2024-02-01', '2024-07-15', 3154000],
    ['Healthcare Patient Portal', 'HIPAA-compliant patient portal with telemedicine', 'Business', 'Completed', 'React, .NET Core, SQL Server, Azure', 1, clientIds[2], '2023-09-01', '2024-03-31', 4316000],
    ['Financial Trading Dashboard', 'Real-time trading dashboard with market data', 'Business', 'Active', 'Angular, Java Spring, Oracle, WebSocket', 1, clientIds[3], '2024-03-01', '2024-09-30', 5644000],
    ['E-commerce Platform Redesign', 'Complete redesign with improved UX', 'Business', 'Active', 'Next.js, Node.js, Redis, Stripe, Vercel', 1, clientIds[4], '2024-01-20', '2024-05-30', 3486000],
    ['Learning Management System', 'Custom LMS with video streaming', 'Business', 'Completed', 'React, Django, PostgreSQL, AWS S3', 1, clientIds[5], '2023-08-01', '2024-02-28', 2905000],
    ['Property Management System', 'Comprehensive property management solution', 'Business', 'Planned', 'React Native, Node.js, MongoDB, Stripe', 1, clientIds[6], '2024-05-01', '2024-11-30', 3984000]
  ];

  const insertProject = db.prepare('INSERT INTO projects (name, description, type, status, tech_stack, is_demo, client_id, start_date, end_date, budget) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const projectIds = projects.map(p => insertProject.run(...p).lastInsertRowid);
  console.log('✅ Seeded 7 business projects');

  // Get admin ID
  const admin = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
  const adminId = admin.id;

  // Seed Tasks (3 per project)
  const tasks = [
    ['Design database schema', 'Create ERD and design structure', projectIds[0], adminId, 'Done', 'High', '2024-02-01'],
    ['Implement authentication', 'JWT auth with RBAC', projectIds[0], adminId, 'Done', 'High', '2024-02-15'],
    ['Build analytics dashboard', 'Interactive charts and KPIs', projectIds[0], adminId, 'In Progress', 'Medium', '2024-04-30'],
    ['Campaign builder UI', 'Drag-and-drop interface', projectIds[1], adminId, 'In Progress', 'High', '2024-04-15'],
    ['Social media integration', 'Connect social APIs', projectIds[1], adminId, 'To Do', 'Medium', '2024-05-30'],
    ['Analytics reporting', 'Generate PDF reports', projectIds[1], adminId, 'To Do', 'Low', '2024-06-30'],
    ['HIPAA compliance audit', 'Security audit', projectIds[2], adminId, 'Done', 'High', '2024-03-15'],
    ['Video integration', 'Telemedicine video calls', projectIds[2], adminId, 'Done', 'High', '2024-03-25'],
    ['Real-time data streaming', 'WebSocket connections', projectIds[3], adminId, 'In Progress', 'High', '2024-05-15'],
    ['Risk calculator', 'Risk analysis algorithms', projectIds[3], adminId, 'To Do', 'Medium', '2024-06-30'],
    ['Mobile-first redesign', 'Responsive design', projectIds[4], adminId, 'In Progress', 'High', '2024-04-01'],
    ['Checkout optimization', 'Improve conversion', projectIds[4], adminId, 'In Progress', 'High', '2024-04-15'],
    ['Video streaming setup', 'AWS S3 and CloudFront', projectIds[5], adminId, 'Done', 'High', '2024-01-15'],
    ['Assessment engine', 'Quiz with auto-grading', projectIds[5], adminId, 'Done', 'High', '2024-02-15'],
    ['Requirements gathering', 'Finalize features', projectIds[6], adminId, 'To Do', 'High', '2024-05-15'],
    ['Wireframe design', 'Create wireframes', projectIds[6], adminId, 'To Do', 'High', '2024-05-30']
  ];

  const insertTask = db.prepare('INSERT INTO tasks (title, description, project_id, assigned_to, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)');
  tasks.forEach(t => insertTask.run(...t));
  console.log('✅ Seeded 16 tasks');

  // Seed Leads (Potential value in INR)
  const leads = [
    ['Robert Martinez', 'robert.m@startup.io', '+91 98765 43220', 'StartupHub Ventures', 'Website', 'Contacted', 2075000, 'MVP development interest'],
    ['Jennifer Lee', 'jennifer.lee@retailco.com', '+91 98765 43221', 'RetailCo Chain', 'LinkedIn', 'Negotiation', 4565000, 'Inventory system, budget approved'],
    ['Thomas Brown', 'thomas.b@consulting.com', '+91 98765 43222', 'Brown Consulting', 'Referral', 'Proposal Sent', 2656000, 'Client portal needed'],
    ['Amanda White', 'amanda.white@nonprofit.org', '+91 98765 43223', 'Community Nonprofit', 'Conference', 'Contacted', 1494000, 'Limited budget'],
    ['Christopher Davis', 'chris.davis@manufacturing.com', '+91 98765 43224', 'Davis Manufacturing', 'Cold Outreach', 'Closed Won', 5976000, 'Contract signed']
  ];

  const insertLead = db.prepare('INSERT INTO leads (name, email, phone, company, source, stage, potential_value, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  leads.forEach(l => insertLead.run(...l));
  console.log('✅ Seeded 5 leads');

  // Seed Services (Price in INR)
  const services = [
    ['Custom Web Application', 'Full-stack web development', 2905000, 'Development', '3-6 months', '["Custom Design","Responsive Frontend","Backend API","Database","Cloud Deploy","3mo Support"]'],
    ['Mobile App Development', 'iOS and Android apps', 3735000, 'Development', '4-8 months', '["iOS & Android","Native Performance","Push Notifications","Offline Mode","App Store","6mo Support"]'],
    ['System Integration', 'API and system integration', 2324000, 'Integration', '2-4 months', '["API Development","Third-party Integration","Data Migration","Optimization","Documentation","2mo Support"]']
  ];

  const insertService = db.prepare('INSERT INTO services (name, description, price, category, duration, features) VALUES (?, ?, ?, ?, ?, ?)');
  services.forEach(s => insertService.run(...s));
  console.log('✅ Seeded 3 services');

  // Seed Notifications
  const notifications = [
    [adminId, 'Project Completed', 'Healthcare Patient Portal delivered successfully', 'success'],
    [adminId, 'New Lead Converted', 'Christopher Davis signed contract!', 'success'],
    [adminId, 'Task Due Soon', 'Real-time streaming task due in 3 days', 'warning'],
    [adminId, 'Payment Received', '₹43,16,000 from HealthPlus Medical', 'success']
  ];

  const insertNotification = db.prepare('INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)');
  notifications.forEach(n => insertNotification.run(...n));
  console.log('✅ Seeded 4 notifications');

  console.log('🎉 Demo data seeding complete!');
}

module.exports = { initDatabase };