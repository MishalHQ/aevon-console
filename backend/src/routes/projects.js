// Secure Admin Console - Projects Management Routes
const express = require('express');
const db = require('../config/database');
const { authenticateToken, requireAdmin, requireAuth, logAudit } = require('../middleware/auth');

const router = express.Router();

// GET /api/projects - List all projects (All authenticated users)
router.get('/', authenticateToken, requireAuth, (req, res) => {
  try {
    const projects = db.prepare(`
      SELECT 
        p.*,
        u.name as owner_name,
        u.email as owner_email
      FROM projects p
      LEFT JOIN users u ON p.owner_id = u.id
      ORDER BY p.created_at DESC
    `).all();

    res.json(projects);
  } catch (error) {
    console.error('List projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id - Get single project (All authenticated users)
router.get('/:id', authenticateToken, requireAuth, (req, res) => {
  try {
    const project = db.prepare(`
      SELECT 
        p.*,
        u.name as owner_name,
        u.email as owner_email
      FROM projects p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE p.id = ?
    `).get(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST /api/projects - Create new project (ADMIN only)
router.post('/', authenticateToken, requireAdmin, logAudit('PROJECT_CREATED'), (req, res) => {
  try {
    const { name, status, description } = req.body;

    // Validation
    if (!name || !status) {
      return res.status(400).json({ 
        error: 'Name and status are required' 
      });
    }

    if (!['active', 'completed', 'archived'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be active, completed, or archived' 
      });
    }

    // Create project with current user as owner
    const result = db.prepare(`
      INSERT INTO projects (name, status, description, owner_id)
      VALUES (?, ?, ?, ?)
    `).run(name, status, description || '', req.user.id);

    // Get created project
    const project = db.prepare(`
      SELECT 
        p.*,
        u.name as owner_name,
        u.email as owner_email
      FROM projects p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE p.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT /api/projects/:id - Update project (ADMIN only)
router.put('/:id', authenticateToken, requireAdmin, logAudit('PROJECT_UPDATED'), (req, res) => {
  try {
    const { name, status, description } = req.body;

    // Check if project exists
    const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Validate status if provided
    if (status && !['active', 'completed', 'archived'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be active, completed, or archived' 
      });
    }

    // Update project
    db.prepare(`
      UPDATE projects
      SET name = ?, status = ?, description = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name !== undefined ? name : existing.name,
      status !== undefined ? status : existing.status,
      description !== undefined ? description : existing.description,
      req.params.id
    );

    // Get updated project
    const project = db.prepare(`
      SELECT 
        p.*,
        u.name as owner_name,
        u.email as owner_email
      FROM projects p
      LEFT JOIN users u ON p.owner_id = u.id
      WHERE p.id = ?
    `).get(req.params.id);

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id - Delete project (ADMIN only)
router.delete('/:id', authenticateToken, requireAdmin, logAudit('PROJECT_DELETED'), (req, res) => {
  try {
    // Check if project exists
    const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete project
    db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;