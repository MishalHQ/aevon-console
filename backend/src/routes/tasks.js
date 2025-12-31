// Tasks API routes
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get all tasks
router.get('/', authenticateToken, (req, res) => {
  try {
    const { project_id, status } = req.query;
    
    let query = `
      SELECT t.*, p.name as project_name, u.name as assigned_to_name
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE 1=1
    `;
    const params = [];
    
    if (project_id) {
      query += ' AND t.project_id = ?';
      params.push(project_id);
    }
    
    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY t.due_date ASC, t.priority DESC';
    
    const tasks = db.prepare(query).all(...params);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get single task
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const task = db.prepare(`
      SELECT t.*, p.name as project_name, u.name as assigned_to_name
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.id = ?
    `).get(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create task
router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, description, project_id, assigned_to, status, priority, due_date } = req.body;
    
    const result = db.prepare(`
      INSERT INTO tasks (title, description, project_id, assigned_to, status, priority, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(title, description, project_id, assigned_to, status || 'To Do', priority || 'Medium', due_date);
    
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { title, description, assigned_to, status, priority, due_date } = req.body;
    
    db.prepare(`
      UPDATE tasks 
      SET title = ?, description = ?, assigned_to = ?, status = ?, priority = ?, due_date = ?
      WHERE id = ?
    `).run(title, description, assigned_to, status, priority, due_date, req.params.id);
    
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;