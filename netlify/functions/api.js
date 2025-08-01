const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const { initializeDatabase, getDatabase } = require('./config/database');

// Simple hash function for demo (not secure for production)
function simpleHash(password) {
  return Buffer.from(password).toString('base64');
}

function verifyPassword(password, hash) {
  return simpleHash(password) === hash;
}

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

// Auth Routes
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = getDatabase();

    const user = db.users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token: 'demo-token-' + user.id
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/auth/users', (req, res) => {
  try {
    const db = getDatabase();
    const users = db.users.map(({ password, ...user }) => user);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Inventory Routes
app.get('/inventory', (req, res) => {
  try {
    const db = getDatabase();
    res.json(db.inventory);
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/inventory', (req, res) => {
  try {
    const db = getDatabase();
    const newItem = {
      id: db.inventory.length + 1,
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.inventory.push(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Create inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bookings Routes
app.get('/bookings', (req, res) => {
  try {
    const db = getDatabase();
    res.json(db.bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/bookings', (req, res) => {
  try {
    const db = getDatabase();
    const newBooking = {
      id: db.bookings.length + 1,
      ...req.body,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.bookings.push(newBooking);
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Testimonials Routes
app.get('/testimonials', (req, res) => {
  try {
    const db = getDatabase();
    res.json(db.testimonials);
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/testimonials', (req, res) => {
  try {
    const db = getDatabase();
    const newTestimonial = {
      id: db.testimonials.length + 1,
      ...req.body,
      created_at: new Date().toISOString()
    };
    db.testimonials.push(newTestimonial);
    res.status(201).json(newTestimonial);
  } catch (error) {
    console.error('Create testimonial error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Vehicle History Routes
app.get('/vehicle-history', (req, res) => {
  try {
    const db = getDatabase();
    res.json(db.vehicle_history);
  } catch (error) {
    console.error('Get vehicle history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/vehicle-history', (req, res) => {
  try {
    const db = getDatabase();
    const newHistory = {
      id: db.vehicle_history.length + 1,
      ...req.body,
      created_at: new Date().toISOString()
    };
    db.vehicle_history.push(newHistory);
    res.status(201).json(newHistory);
  } catch (error) {
    console.error('Create vehicle history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
