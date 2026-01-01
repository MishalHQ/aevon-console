// Secure Admin Console - Authentication Routes
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login - User login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      // Log failed login attempt
      db.prepare(
        'INSERT INTO audit_logs (action, user_id, user_email, details, ip_address) VALUES (?, ?, ?, ?, ?)'
      ).run('LOGIN_FAILED', 0, email, 'User not found', req.ip || req.connection.remoteAddress);

      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.is_active) {
      // Log failed login attempt
      db.prepare(
        'INSERT INTO audit_logs (action, user_id, user_email, details, ip_address) VALUES (?, ?, ?, ?, ?)'
      ).run('LOGIN_FAILED', user.id, email, 'Account disabled', req.ip || req.connection.remoteAddress);

      return res.status(403).json({ error: 'Account is disabled' });
    }

    // Verify password
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      // Log failed login attempt
      db.prepare(
        'INSERT INTO audit_logs (action, user_id, user_email, details, ip_address) VALUES (?, ?, ?, ?, ?)'
      ).run('LOGIN_FAILED', user.id, email, 'Invalid password', req.ip || req.connection.remoteAddress);

      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log successful login
    db.prepare(
      'INSERT INTO audit_logs (action, user_id, user_email, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run('USER_LOGIN', user.id, email, 'Successful login', req.ip || req.connection.remoteAddress);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/logout - User logout
router.post('/logout', authenticateToken, (req, res) => {
  try {
    // Log logout
    db.prepare(
      'INSERT INTO audit_logs (action, user_id, user_email, details, ip_address) VALUES (?, ?, ?, ?, ?)'
    ).run('USER_LOGOUT', req.user.id, req.user.email, 'User logged out', req.ip || req.connection.remoteAddress);

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// GET /api/auth/me - Get current user info
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, email, name, role, is_active, created_at
      FROM users
      WHERE id = ?
    `).get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

module.exports = router;