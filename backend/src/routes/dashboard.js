// Secure Admin Console - Dashboard Routes
const express = require('express');
const db = require('../config/database');
const { authenticateToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', authenticateToken, requireAuth, (req, res) => {
  try {
    // Users statistics
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const activeUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE is_active = 1').get().count;
    const adminUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'ADMIN'").get().count;
    const viewerUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'VIEWER'").get().count;

    // Projects statistics
    const totalProjects = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
    const activeProjects = db.prepare("SELECT COUNT(*) as count FROM projects WHERE status = 'active'").get().count;
    const completedProjects = db.prepare("SELECT COUNT(*) as count FROM projects WHERE status = 'completed'").get().count;
    const archivedProjects = db.prepare("SELECT COUNT(*) as count FROM projects WHERE status = 'archived'").get().count;

    // Audit logs statistics
    const totalAuditLogs = db.prepare('SELECT COUNT(*) as count FROM audit_logs').get().count;
    const todayLogs = db.prepare(`
      SELECT COUNT(*) as count 
      FROM audit_logs 
      WHERE DATE(timestamp) = DATE('now')
    `).get().count;

    // Recent activity
    const recentProjects = db.prepare(`
      SELECT 
        p.*,
        u.name as owner_name
      FROM projects p
      LEFT JOIN users u ON p.owner_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 5
    `).all();

    const recentAuditLogs = db.prepare(`
      SELECT 
        al.*,
        u.name as user_name
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.timestamp DESC
      LIMIT 10
    `).all();

    // Activity by action type
    const activityByAction = db.prepare(`
      SELECT action, COUNT(*) as count
      FROM audit_logs
      GROUP BY action
      ORDER BY count DESC
      LIMIT 5
    `).all();

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        admins: adminUsers,
        viewers: viewerUsers
      },
      projects: {
        total: totalProjects,
        active: activeProjects,
        completed: completedProjects,
        archived: archivedProjects
      },
      auditLogs: {
        total: totalAuditLogs,
        today: todayLogs,
        byAction: activityByAction
      },
      recentActivity: {
        projects: recentProjects,
        auditLogs: recentAuditLogs
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

module.exports = router;