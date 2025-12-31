// Dashboard routes - Comprehensive Business Statistics
const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/dashboard/stats - Get comprehensive dashboard statistics
router.get('/stats', authenticateToken, (req, res) => {
  try {
    // Projects statistics
    const totalProjects = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
    const activeProjects = db.prepare("SELECT COUNT(*) as count FROM projects WHERE status = 'Active'").get().count;
    const completedProjects = db.prepare("SELECT COUNT(*) as count FROM projects WHERE status = 'Completed'").get().count;
    const plannedProjects = db.prepare("SELECT COUNT(*) as count FROM projects WHERE status = 'Planned'").get().count;
    const demoProjects = db.prepare('SELECT COUNT(*) as count FROM projects WHERE is_demo = 1').get().count;

    // Clients statistics
    const totalClients = db.prepare('SELECT COUNT(*) as count FROM clients').get().count;
    const activeClients = db.prepare("SELECT COUNT(*) as count FROM clients WHERE status = 'Active'").get().count;
    const inactiveClients = db.prepare("SELECT COUNT(*) as count FROM clients WHERE status = 'Inactive'").get().count;

    // Tasks statistics
    const totalTasks = db.prepare('SELECT COUNT(*) as count FROM tasks').get().count;
    const todoTasks = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'To Do'").get().count;
    const inProgressTasks = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'In Progress'").get().count;
    const doneTasks = db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'Done'").get().count;

    // Leads statistics
    const totalLeads = db.prepare('SELECT COUNT(*) as count FROM leads').get().count;
    const contactedLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE stage = 'Contacted'").get().count;
    const negotiationLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE stage = 'Negotiation'").get().count;
    const closedWonLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE stage = 'Closed Won'").get().count;
    const totalLeadValue = db.prepare('SELECT SUM(potential_value) as total FROM leads').get().total || 0;

    // Services statistics
    const totalServices = db.prepare('SELECT COUNT(*) as count FROM services WHERE is_active = 1').get().count;

    // Revenue statistics (from projects)
    const totalRevenue = db.prepare('SELECT SUM(budget) as total FROM projects WHERE status = "Completed"').get().total || 0;
    const activeRevenue = db.prepare('SELECT SUM(budget) as total FROM projects WHERE status = "Active"').get().total || 0;
    const projectedRevenue = db.prepare('SELECT SUM(budget) as total FROM projects WHERE status = "Planned"').get().total || 0;

    // Recent activity
    const recentProjects = db.prepare(`
      SELECT p.*, c.name as client_name, c.company as client_company
      FROM projects p
      LEFT JOIN clients c ON p.client_id = c.id
      ORDER BY p.created_at DESC
      LIMIT 5
    `).all();

    const recentTasks = db.prepare(`
      SELECT t.*, p.name as project_name
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      ORDER BY t.created_at DESC
      LIMIT 5
    `).all();

    // Project distribution by type
    const businessProjects = db.prepare("SELECT COUNT(*) as count FROM projects WHERE type = 'Business'").get().count;
    const studentProjects = db.prepare("SELECT COUNT(*) as count FROM projects WHERE type = 'Student'").get().count;
    const internalProjects = db.prepare("SELECT COUNT(*) as count FROM projects WHERE type = 'Internal Demo'").get().count;

    // Client distribution by industry
    const clientsByIndustry = db.prepare(`
      SELECT industry, COUNT(*) as count
      FROM clients
      WHERE industry IS NOT NULL
      GROUP BY industry
      ORDER BY count DESC
    `).all();

    res.json({
      // Projects
      projects: {
        total: totalProjects,
        active: activeProjects,
        completed: completedProjects,
        planned: plannedProjects,
        demo: demoProjects,
        byType: {
          business: businessProjects,
          student: studentProjects,
          internal: internalProjects
        }
      },
      
      // Clients
      clients: {
        total: totalClients,
        active: activeClients,
        inactive: inactiveClients,
        byIndustry: clientsByIndustry
      },
      
      // Tasks
      tasks: {
        total: totalTasks,
        todo: todoTasks,
        inProgress: inProgressTasks,
        done: doneTasks,
        completionRate: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0
      },
      
      // Leads
      leads: {
        total: totalLeads,
        contacted: contactedLeads,
        negotiation: negotiationLeads,
        closedWon: closedWonLeads,
        totalValue: totalLeadValue,
        conversionRate: totalLeads > 0 ? Math.round((closedWonLeads / totalLeads) * 100) : 0
      },
      
      // Services
      services: {
        total: totalServices
      },
      
      // Revenue
      revenue: {
        completed: totalRevenue,
        active: activeRevenue,
        projected: projectedRevenue,
        total: totalRevenue + activeRevenue + projectedRevenue
      },
      
      // Recent activity
      recentActivity: {
        projects: recentProjects,
        tasks: recentTasks
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// GET /api/dashboard/charts - Get data for charts
router.get('/charts', authenticateToken, (req, res) => {
  try {
    // Project status distribution
    const projectsByStatus = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM projects
      GROUP BY status
    `).all();

    // Tasks by priority
    const tasksByPriority = db.prepare(`
      SELECT priority, COUNT(*) as count
      FROM tasks
      GROUP BY priority
    `).all();

    // Leads by stage
    const leadsByStage = db.prepare(`
      SELECT stage, COUNT(*) as count, SUM(potential_value) as value
      FROM leads
      GROUP BY stage
    `).all();

    // Monthly project creation (last 6 months)
    const monthlyProjects = db.prepare(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        COUNT(*) as count
      FROM projects
      WHERE created_at >= date('now', '-6 months')
      GROUP BY month
      ORDER BY month
    `).all();

    res.json({
      projectsByStatus,
      tasksByPriority,
      leadsByStage,
      monthlyProjects
    });

  } catch (error) {
    console.error('Dashboard charts error:', error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

module.exports = router;