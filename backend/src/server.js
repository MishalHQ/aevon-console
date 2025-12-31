// AEVON Console Backend Server - Production Ready with Business Features
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./models/init');

// Initialize database
initDatabase();

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const dashboardRoutes = require('./routes/dashboard');
const clientRoutes = require('./routes/clients');
const taskRoutes = require('./routes/tasks');
const leadRoutes = require('./routes/leads');
const serviceRoutes = require('./routes/services');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS configuration - Allow multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://aevon-console.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in development
    }
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (only in development)
if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AEVON Console API is running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    features: ['auth', 'projects', 'clients', 'tasks', 'leads', 'services']
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'AEVON Console API',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      projects: '/api/projects',
      dashboard: '/api/dashboard',
      clients: '/api/clients',
      tasks: '/api/tasks',
      leads: '/api/leads',
      services: '/api/services'
    }
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/services', serviceRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  const errorMessage = NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(err.status || 500).json({ 
    error: errorMessage,
    ...(NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('');
  console.log('🚀 AEVON Console Backend v2.0');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log('✨ Features: Projects, Clients, Tasks, Leads, Services');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;