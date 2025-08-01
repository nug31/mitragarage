const bcrypt = require('bcrypt');

// In-memory database simulation
let database = {
  users: [],
  inventory: [],
  bookings: [],
  vehicle_history: [],
  testimonials: []
};

let dbInitialized = false;

// Initialize database connection
async function initializeDatabase() {
  if (dbInitialized) {
    return database;
  }

  try {
    console.log('Initializing in-memory database...');
    await initializeTables();
    dbInitialized = true;
    console.log('In-memory database initialized successfully');
    return database;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Initialize database tables
async function initializeTables() {
  try {
    console.log('Initializing in-memory tables...');

    // Clear existing data
    database.users = [];
    database.inventory = [];
    database.bookings = [];
    database.vehicle_history = [];
    database.testimonials = [];

    // Insert default users
    await insertDefaultUsers();

    // Insert sample data
    await insertSampleData();

    console.log('All tables initialized successfully');
  } catch (error) {
    console.error('Error initializing tables:', error);
    throw error;
  }
}

// Insert default users
async function insertDefaultUsers() {
  try {
    const defaultUsers = [
      {
        id: 1,
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        email: 'admin@mitragarage.com',
        phone: '081234567890',
        address: 'Jl. Admin No. 1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        username: 'customer_new',
        password: 'customer123',
        role: 'customer',
        email: 'customer@example.com',
        phone: '081234567891',
        address: 'Jl. Customer No. 2',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const user of defaultUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      database.users.push({
        ...user,
        password: hashedPassword
      });
    }

    console.log('Default users inserted successfully');
  } catch (error) {
    console.error('Error inserting default users:', error);
    throw error;
  }
}

// Insert sample data
async function insertSampleData() {
  try {
    // Sample inventory
    database.inventory = [
      {
        id: 1,
        name: 'Oli Mesin 10W-40',
        category: 'Oli',
        quantity: 50,
        price: 75000,
        supplier: 'PT Oli Indonesia',
        description: 'Oli mesin berkualitas tinggi',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Ban Michelin 185/65R15',
        category: 'Ban',
        quantity: 20,
        price: 850000,
        supplier: 'PT Ban Nusantara',
        description: 'Ban berkualitas untuk mobil sedan',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    // Sample bookings
    database.bookings = [
      {
        id: 1,
        customer_name: 'John Doe',
        customer_phone: '081234567892',
        customer_email: 'john@example.com',
        vehicle_type: 'Mobil',
        vehicle_brand: 'Toyota',
        vehicle_model: 'Avanza',
        vehicle_year: 2020,
        license_plate: 'B 1234 ABC',
        service_type: 'Service Rutin',
        booking_date: '2025-08-02',
        booking_time: '09:00',
        status: 'pending',
        notes: 'Service rutin 10.000 km',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    // Sample testimonials
    database.testimonials = [
      {
        id: 1,
        customer_name: 'Jane Smith',
        rating: 5,
        comment: 'Pelayanan sangat memuaskan, mekanik profesional!',
        service_type: 'Ganti Oli',
        created_at: new Date().toISOString()
      }
    ];

    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error inserting sample data:', error);
    throw error;
  }
}

// Get database instance
function getDatabase() {
  if (!dbInitialized) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return database;
}

// Test database connection
async function testConnection() {
  if (!dbInitialized) {
    throw new Error('Database not initialized');
  }
  return { test: 1 };
}

module.exports = {
  initializeDatabase,
  initializeTables,
  getDatabase,
  testConnection
};
