// Leads API routes
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get all leads
router.get('/', authenticateToken, (req, res) => {
  try {
    const { stage } = req.query;
    
    let query = 'SELECT * FROM leads WHERE 1=1';
    const params = [];
    
    if (stage) {
      query += ' AND stage = ?';
      params.push(stage);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const leads = db.prepare(query).all(...params);
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Get single lead
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    res.json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

// Create lead
router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, email, phone, company, source, stage, potential_value, notes } = req.body;
    
    const result = db.prepare(`
      INSERT INTO leads (name, email, phone, company, source, stage, potential_value, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, email, phone, company, source, stage || 'Contacted', potential_value, notes);
    
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(lead);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// Update lead
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { name, email, phone, company, source, stage, potential_value, notes } = req.body;
    
    db.prepare(`
      UPDATE leads 
      SET name = ?, email = ?, phone = ?, company = ?, source = ?, stage = ?, potential_value = ?, notes = ?
      WHERE id = ?
    `).run(name, email, phone, company, source, stage, potential_value, notes, req.params.id);
    
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
    res.json(lead);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// Delete lead
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

// Convert lead to client
router.post('/:id/convert', authenticateToken, (req, res) => {
  try {
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    
    // Create client from lead
    const result = db.prepare(`
      INSERT INTO clients (name, email, phone, company, status, notes)
      VALUES (?, ?, ?, ?, 'Active', ?)
    `).run(lead.name, lead.email, lead.phone, lead.company, `Converted from lead. ${lead.notes || ''}`);
    
    // Update lead stage
    db.prepare('UPDATE leads SET stage = ? WHERE id = ?').run('Closed Won', req.params.id);
    
    const client = db.prepare('SELECT * FROM clients WHERE id = ?').get(result.lastInsertRowid);
    res.json({ client, message: 'Lead converted to client successfully' });
  } catch (error) {
    console.error('Error converting lead:', error);
    res.status(500).json({ error: 'Failed to convert lead' });
  }
});

module.exports = router;