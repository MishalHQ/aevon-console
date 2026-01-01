// Secure Admin Console - Users Management Routes
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { authenticateToken, requireAdmin, logAudit } = require('../middleware/auth');

const router = express.Router();

// GET /api/users - List all users (ADMIN only)
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const users = db.prepare(`
      SELECT id, email, name, role, is_active, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `).all();

    res.json(users);
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/:id - Get single user (ADMIN only)
router.get('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, email, name, role, is_active, created_at, updated_at
      FROM users
      WHERE id = ?
    `).get(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST /api/users - Create new user (ADMIN only)
router.post('/', authenticateToken, requireAdmin, logAudit('USER_CREATED'), (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validation
    if (!email || !password || !name || !role) {
      return res.status(400).json({ 
        error: 'Email, password, name, and role are required' 
      });
    }

    if (!['ADMIN', 'VIEWER'].includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role. Must be ADMIN or VIEWER' 
      });
    }

    // Check if email already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user
    const result = db.prepare(`
      INSERT INTO users (email, password, name, role)
      VALUES (?, ?, ?, ?)
    `).run(email, hashedPassword, name, role);

    // Get created user
    const user = db.prepare(`
      SELECT id, email, name, role, is_active, created_at
      FROM users
      WHERE id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json(user);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT /api/users/:id - Update user (ADMIN only)
router.put('/:id', authenticateToken, requireAdmin, logAudit('USER_UPDATED'), (req, res) => {
  try {
    const { name, role, is_active } = req.body;

    // Check if user exists
    const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate role if provided
    if (role && !['ADMIN', 'VIEWER'].includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role. Must be ADMIN or VIEWER' 
      });
    }

    // Prevent disabling own account
    if (req.user.id === parseInt(req.params.id) && is_active === 0) {
      return res.status(400).json({ 
        error: 'Cannot disable your own account' 
      });
    }

    // Update user
    db.prepare(`
      UPDATE users
      SET name = ?, role = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name !== undefined ? name : existing.name,
      role !== undefined ? role : existing.role,
      is_active !== undefined ? is_active : existing.is_active,
      req.params.id
    );

    // Get updated user
    const user = db.prepare(`
      SELECT id, email, name, role, is_active, created_at, updated_at
      FROM users
      WHERE id = ?
    `).get(req.params.id);

    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/users/:id - Disable user (soft delete, ADMIN only)
router.delete('/:id', authenticateToken, requireAdmin, logAudit('USER_DISABLED'), (req, res) => {
  try {
    // Check if user exists
    const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent disabling own account
    if (req.user.id === parseInt(req.params.id)) {
      return res.status(400).json({ 
        error: 'Cannot disable your own account' 
      });
    }

    // Soft delete (disable user)
    db.prepare(`
      UPDATE users
      SET is_active = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(req.params.id);

    res.json({ message: 'User disabled successfully' });
  } catch (error) {
    console.error('Disable user error:', error);
    res.status(500).json({ error: 'Failed to disable user' });
  }
});

module.exports = router;