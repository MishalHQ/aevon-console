// Dashboard routes - Statistics
const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', authenticateToken, (req, res) => {
  try {
    // Get total projects count
    const totalProjects = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;

    // Get active projects count
    const activeProjects = db.prepare("SELECT COUNT(*) as count FROM projects WHERE status = 'Active'").get().count;

    // Get completed projects count
    const completedProjects = db.prepare("SELECT COUNT(*) as count FROM projects WHERE status = 'Completed'").get().count;

    // Get demo projects count
    const demoProjects = db.prepare('SELECT COUNT(*) as count FROM projects WHERE is_demo = 1').get().count;

    res.json({
      totalProjects,
      activeProjects,
      completedProjects,
      demoProjects
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

module.exports = router;