// Authentication routes - Login/Logout
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const router = express.Router();

// POST /api/auth/login - User login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return token and user info (without password)
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// POST /api/auth/logout - User logout (client-side token removal)
router.post('/logout', (req, res) => {
  // In a simple JWT setup, logout is handled client-side by removing the token
  // This endpoint exists for consistency and future enhancements
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;