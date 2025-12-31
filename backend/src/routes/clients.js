// Clients API routes
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get all clients
router.get('/', authenticateToken, (req, res) => {
  try {
    const clients = db.prepare(`
      SELECT c.*, 
        COUNT(DISTINCT p.id) as project_count,
        SUM(CASE WHEN p.status = 'Active' THEN 1 ELSE 0 END) as active_projects
      FROM clients c
      LEFT JOIN projects p ON c.id = p.client_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `).all();
    
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Get single client
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    // Get client's projects
    const projects = db.prepare('SELECT * FROM projects WHERE client_id = ?').all(req.params.id);
    
    res.json({ ...client, projects });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// Create client
router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, email, phone, company, industry, status, address, notes } = req.body;
    
    const result = db.prepare(`
      INSERT INTO clients (name, email, phone, company, industry, status, address, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, email, phone, company, industry, status || 'Active', address, notes);
    
    const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// Update client
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { name, email, phone, company, industry, status, address, notes } = req.body;
    
    db.prepare(`
      UPDATE clients 
      SET name = ?, email = ?, phone = ?, company = ?, industry = ?, status = ?, address = ?, notes = ?
      WHERE id = ?
    `).run(name, email, phone, company, industry, status, address, notes, req.params.id);
    
    const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
    res.json(client);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// Delete client
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM clients WHERE id = ?').run(req.params.id);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

module.exports = router;