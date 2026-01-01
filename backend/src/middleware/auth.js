// Secure Admin Console - Authentication & Authorization Middleware
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Verify JWT token and attach user to request
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Verify user still exists and is active
    const user = db.prepare(
      'SELECT id, email, name, role, is_active FROM users WHERE id = ?'
    ).get(decoded.id);

    if (!user || !user.is_active) {
      return res.status(403).json({ error: 'User account is inactive' });
    }

    req.user = user;
    next();
  });
}

// Require ADMIN role
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Admin access required',
      message: 'You do not have permission to perform this action'
    });
  }

  next();
}

// Require ADMIN or VIEWER role (any authenticated user)
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

// Log audit event
function logAudit(action, details = null) {
  return (req, res, next) => {
    if (req.user) {
      try {
        db.prepare(
          'INSERT INTO audit_logs (action, user_id, user_email, details, ip_address) VALUES (?, ?, ?, ?, ?)'
        ).run(
          action,
          req.user.id,
          req.user.email,
          details || JSON.stringify(req.body),
          req.ip || req.connection.remoteAddress
        );
      } catch (error) {
        console.error('Audit log error:', error);
      }
    }
    next();
  };
}

module.exports = { 
  authenticateToken, 
  requireAdmin, 
  requireAuth,
  logAudit
};