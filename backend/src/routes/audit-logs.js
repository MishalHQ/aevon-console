// Secure Admin Console - Audit Logs Routes
const express = require('express');
const db = require('../config/database');
const { authenticateToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/audit-logs - List all audit logs (All authenticated users, read-only)
router.get('/', authenticateToken, requireAuth, (req, res) => {
  try {
    const { limit = 50, offset = 0, action, user_id } = req.query;

    let query = `
      SELECT 
        al.*,
        u.name as user_name
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;

    const params = [];

    // Filter by action if provided
    if (action) {
      query += ' AND al.action = ?';
      params.push(action);
    }

    // Filter by user_id if provided
    if (user_id) {
      query += ' AND al.user_id = ?';
      params.push(user_id);
    }

    query += ' ORDER BY al.timestamp DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const logs = db.prepare(query).all(...params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM audit_logs WHERE 1=1';
    const countParams = [];

    if (action) {
      countQuery += ' AND action = ?';
      countParams.push(action);
    }

    if (user_id) {
      countQuery += ' AND user_id = ?';
      countParams.push(user_id);
    }

    const { total } = db.prepare(countQuery).get(...countParams);

    res.json({
      logs,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + logs.length < total
      }
    });
  } catch (error) {
    console.error('List audit logs error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// GET /api/audit-logs/actions - Get list of unique actions (for filtering)
router.get('/actions', authenticateToken, requireAuth, (req, res) => {
  try {
    const actions = db.prepare(`
      SELECT DISTINCT action
      FROM audit_logs
      ORDER BY action
    `).all();

    res.json(actions.map(a => a.action));
  } catch (error) {
    console.error('Get actions error:', error);
    res.status(500).json({ error: 'Failed to fetch actions' });
  }
});

// GET /api/audit-logs/stats - Get audit log statistics
router.get('/stats', authenticateToken, requireAuth, (req, res) => {
  try {
    const stats = {
      total: db.prepare('SELECT COUNT(*) as count FROM audit_logs').get().count,
      byAction: db.prepare(`
        SELECT action, COUNT(*) as count
        FROM audit_logs
        GROUP BY action
        ORDER BY count DESC
      `).all(),
      recentActivity: db.prepare(`
        SELECT 
          al.*,
          u.name as user_name
        FROM audit_logs al
        LEFT JOIN users u ON al.user_id = u.id
        ORDER BY al.timestamp DESC
        LIMIT 10
      `).all()
    };

    res.json(stats);
  } catch (error) {
    console.error('Get audit stats error:', error);
    res.status(500).json({ error: 'Failed to fetch audit statistics' });
  }
});

module.exports = router;