// Services API routes
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Get all services
router.get('/', authenticateToken, (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY price DESC').all();
    
    // Parse features JSON
    const servicesWithFeatures = services.map(service => ({
      ...service,
      features: JSON.parse(service.features || '[]')
    }));
    
    res.json(servicesWithFeatures);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get single service
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    service.features = JSON.parse(service.features || '[]');
    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// Create service
router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, description, price, category, duration, features } = req.body;
    
    const featuresJson = JSON.stringify(features || []);
    
    const result = db.prepare(`
      INSERT INTO services (name, description, price, category, duration, features)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, description, price, category, duration, featuresJson);
    
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(result.lastInsertRowid);
    service.features = JSON.parse(service.features);
    
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Update service
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { name, description, price, category, duration, features, is_active } = req.body;
    
    const featuresJson = JSON.stringify(features || []);
    
    db.prepare(`
      UPDATE services 
      SET name = ?, description = ?, price = ?, category = ?, duration = ?, features = ?, is_active = ?
      WHERE id = ?
    `).run(name, description, price, category, duration, featuresJson, is_active, req.params.id);
    
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    service.features = JSON.parse(service.features);
    
    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete service
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

module.exports = router;