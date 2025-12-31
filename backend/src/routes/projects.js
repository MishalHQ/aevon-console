// Projects routes - CRUD operations
const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/projects - Get all projects (protected)
router.get('/', authenticateToken, (req, res) => {
  try {
    const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/demos - Get demo projects (public)
router.get('/demos', (req, res) => {
  try {
    const demos = db.prepare('SELECT * FROM projects WHERE is_demo = 1 ORDER BY created_at DESC').all();
    res.json(demos);
  } catch (error) {
    console.error('Get demos error:', error);
    res.status(500).json({ error: 'Failed to fetch demo projects' });
  }
});

// GET /api/projects/:id - Get single project (protected)
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST /api/projects - Create new project (protected)
router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, type, status, description, tech_stack, is_demo } = req.body;

    // Validate required fields
    if (!name || !type || !status) {
      return res.status(400).json({ error: 'Name, type, and status are required' });
    }

    // Validate type
    const validTypes = ['Business', 'Student', 'Internal Demo'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid project type' });
    }

    // Validate status
    const validStatuses = ['Planned', 'Active', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid project status' });
    }

    // Insert project
    const result = db.prepare(`
      INSERT INTO projects (name, type, status, description, tech_stack, is_demo)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, type, status, description || '', tech_stack || '', is_demo ? 1 : 0);

    // Get created project
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(project);

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT /api/projects/:id - Update project (protected)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { name, type, status, description, tech_stack, is_demo } = req.body;

    // Check if project exists
    const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Validate type if provided
    if (type) {
      const validTypes = ['Business', 'Student', 'Internal Demo'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid project type' });
      }
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['Planned', 'Active', 'Completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid project status' });
      }
    }

    // Update project
    db.prepare(`
      UPDATE projects 
      SET name = ?, type = ?, status = ?, description = ?, tech_stack = ?, is_demo = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name || existing.name,
      type || existing.type,
      status || existing.status,
      description !== undefined ? description : existing.description,
      tech_stack !== undefined ? tech_stack : existing.tech_stack,
      is_demo !== undefined ? (is_demo ? 1 : 0) : existing.is_demo,
      req.params.id
    );

    // Get updated project
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);

    res.json(project);

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id - Delete project (protected)
router.delete('/:id', authenticateToken, (req, res) => {
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