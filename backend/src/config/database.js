// Database configuration using better-sqlite3
const Database = require('better-sqlite3');
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log('✅ Database connected:', dbPath);

module.exports = db;