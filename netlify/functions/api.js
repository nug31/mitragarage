const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const { initializeDatabase } = require('./config/database');

// Import routes
const inventoryRoutes = require('../../backend/routes/inventory');
const bookingsRoutes = require('../../backend/routes/bookings');
const vehiclesRoutes = require('../../backend/routes/vehicles');
const vehicleHistoryRoutes = require('../../backend/routes/vehicle-history');
const testimonialsRoutes = require('../../backend/routes/testimonials');
const authRoutes = require('../../backend/routes/auth');

const app = express();

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://mitragarage-app.netlify.app',
    /\.netlify\.app$/,
    'file://',
    null
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Mitra Garage API (Netlify Functions)',
    version: '1.0.0'
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/bookings', bookingsRoutes);
app.use('/vehicles', vehiclesRoutes);
app.use('/vehicle-history', vehicleHistoryRoutes);
app.use('/testimonials', testimonialsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Mitra Garage API Server (Netlify Functions)',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      health: '/health',
      auth: '/auth',
      inventory: '/inventory',
      bookings: '/bookings',
      vehicles: '/vehicles',
      vehicleHistory: '/vehicle-history',
      testimonials: '/testimonials'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    path: req.path 
  });
});

// Initialize database before handling requests
let dbInitialized = false;

const handler = async (event, context) => {
  // Initialize database on cold start
  if (!dbInitialized) {
    try {
      await initializeDatabase();
      dbInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Database initialization failed' })
      };
    }
  }

  // Handle the request
  const serverlessHandler = serverless(app);
  return serverlessHandler(event, context);
};

module.exports.handler = handler;
