const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join('/tmp', 'mitragarage.db');

let db = null;

// Initialize database connection
function initializeDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }

    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        return reject(err);
      }
      console.log('Connected to SQLite database');
      
      // Initialize tables
      initializeTables()
        .then(() => resolve(db))
        .catch(reject);
    });
  });
}

// Initialize database tables
function initializeTables() {
  return new Promise((resolve, reject) => {
    const tables = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'customer') DEFAULT 'customer',
        email VARCHAR(100),
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Inventory table
      `CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50),
        quantity INTEGER DEFAULT 0,
        price DECIMAL(10,2),
        supplier VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Bookings table
      `CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name VARCHAR(100) NOT NULL,
        customer_phone VARCHAR(20),
        customer_email VARCHAR(100),
        vehicle_type VARCHAR(50),
        vehicle_brand VARCHAR(50),
        vehicle_model VARCHAR(50),
        vehicle_year INTEGER,
        license_plate VARCHAR(20),
        service_type VARCHAR(100),
        booking_date DATE,
        booking_time TIME,
        status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Vehicle history table
      `CREATE TABLE IF NOT EXISTS vehicle_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        license_plate VARCHAR(20) NOT NULL,
        customer_name VARCHAR(100),
        service_date DATE,
        service_type VARCHAR(100),
        description TEXT,
        cost DECIMAL(10,2),
        mechanic VARCHAR(100),
        status ENUM('completed', 'in_progress', 'cancelled') DEFAULT 'completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Testimonials table
      `CREATE TABLE IF NOT EXISTS testimonials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name VARCHAR(100) NOT NULL,
        rating INTEGER CHECK(rating >= 1 AND rating <= 5),
        comment TEXT,
        service_type VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    let completed = 0;
    const total = tables.length;

    tables.forEach((sql, index) => {
      db.run(sql, (err) => {
        if (err) {
          console.error(`Error creating table ${index}:`, err);
          return reject(err);
        }
        
        completed++;
        if (completed === total) {
          console.log('All tables initialized successfully');
          
          // Insert default users
          insertDefaultUsers()
            .then(() => resolve())
            .catch(reject);
        }
      });
    });
  });
}

// Insert default users
function insertDefaultUsers() {
  return new Promise((resolve, reject) => {
    const bcrypt = require('bcrypt');
    
    const defaultUsers = [
      {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        email: 'admin@mitragarage.com'
      },
      {
        username: 'customer_new',
        password: 'customer123',
        role: 'customer',
        email: 'customer@example.com'
      }
    ];

    let completed = 0;
    const total = defaultUsers.length;

    defaultUsers.forEach(async (user) => {
      try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        db.run(
          'INSERT OR IGNORE INTO users (username, password, role, email) VALUES (?, ?, ?, ?)',
          [user.username, hashedPassword, user.role, user.email],
          (err) => {
            if (err) {
              console.error('Error inserting user:', err);
            }
            
            completed++;
            if (completed === total) {
              console.log('Default users inserted successfully');
              resolve();
            }
          }
        );
      } catch (error) {
        console.error('Error hashing password:', error);
        completed++;
        if (completed === total) {
          resolve();
        }
      }
    });
  });
}

// Get database instance
function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

// Test database connection
function testConnection() {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('Database not initialized'));
    }
    
    db.get('SELECT 1 as test', (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
}

module.exports = {
  initializeDatabase,
  initializeTables,
  getDatabase,
  testConnection
};
