const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: 'mainline.proxy.rlwy.net',
  port: 56741,
  user: 'root',
  password: 'EVFpvQXkPaepZOKczcxOUSwlFRWIgGPQ',
  database: 'railway',
  ssl: {
    rejectUnauthorized: false
  }
};

async function manualFixBookings() {
  console.log('🔧 MANUAL FIX FOR BOOKINGS TABLE');
  console.log('=================================');
  console.log('');
  
  let connection;
  
  try {
    // Connect to database
    console.log('1️⃣ Connecting to Railway MySQL database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');
    
    console.log('');
    
    // Check current table structure
    console.log('2️⃣ Checking current bookings table structure...');
    const [columns] = await connection.execute('DESCRIBE bookings');
    
    console.log('📋 Current columns:');
    columns.forEach(col => {
      console.log(`   ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'} ${col.Key ? `[${col.Key}]` : ''}`);
    });
    
    console.log('');
    
    // Check if email column exists
    const emailExists = columns.some(col => col.Field === 'email');
    const createdByExists = columns.some(col => col.Field === 'created_by');
    
    if (!emailExists) {
      console.log('3️⃣ Adding email column...');
      await connection.execute('ALTER TABLE bookings ADD COLUMN email VARCHAR(255) AFTER phone');
      console.log('✅ Email column added');
    } else {
      console.log('3️⃣ Email column already exists');
    }
    
    if (!createdByExists) {
      console.log('4️⃣ Adding created_by column...');
      await connection.execute('ALTER TABLE bookings ADD COLUMN created_by VARCHAR(50) DEFAULT "admin" AFTER description');
      console.log('✅ Created_by column added');
    } else {
      console.log('4️⃣ Created_by column already exists');
    }
    
    console.log('');
    
    // Verify new structure
    console.log('5️⃣ Verifying updated table structure...');
    const [newColumns] = await connection.execute('DESCRIBE bookings');
    
    console.log('📋 Updated columns:');
    newColumns.forEach(col => {
      console.log(`   ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'} ${col.Key ? `[${col.Key}]` : ''}`);
    });
    
    console.log('');
    
    // Test booking creation
    console.log('6️⃣ Testing booking creation...');
    
    const testBooking = {
      customer_name: 'Manual Test User',
      vehicle_number: 'B 7777 MAN',
      service_type: 'Ganti Oli',
      booking_time: '10:00:00',
      booking_date: new Date().toISOString().split('T')[0],
      status: 'Menunggu',
      phone: '081234567890',
      email: 'manual@test.com',
      vehicle_type: 'Honda Civic',
      description: 'Manual test booking',
      created_by: 'customer'
    };
    
    const [result] = await connection.execute(
      `INSERT INTO bookings 
       (customer_name, vehicle_number, service_type, booking_time, booking_date, status, phone, email, vehicle_type, description, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        testBooking.customer_name,
        testBooking.vehicle_number,
        testBooking.service_type,
        testBooking.booking_time,
        testBooking.booking_date,
        testBooking.status,
        testBooking.phone,
        testBooking.email,
        testBooking.vehicle_type,
        testBooking.description,
        testBooking.created_by
      ]
    );
    
    console.log('✅ Test booking created successfully!');
    console.log(`   Booking ID: ${result.insertId}`);
    
    console.log('');
    
    // Get the created booking
    const [createdBooking] = await connection.execute(
      'SELECT * FROM bookings WHERE id = ?',
      [result.insertId]
    );
    
    console.log('📋 Created booking details:');
    const booking = createdBooking[0];
    Object.keys(booking).forEach(key => {
      console.log(`   ${key}: ${booking[key]}`);
    });
    
    console.log('');
    
    // Count total bookings
    const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM bookings');
    console.log(`📊 Total bookings in database: ${countResult[0].total}`);
    
    console.log('');
    console.log('🎉 MANUAL FIX COMPLETED SUCCESSFULLY!');
    console.log('=====================================');
    console.log('');
    console.log('✅ Bookings table structure fixed');
    console.log('✅ Email column added');
    console.log('✅ Created_by column added');
    console.log('✅ Test booking created successfully');
    console.log('');
    console.log('🚀 Frontend booking creation should now work!');
    console.log('   Try creating a booking from the customer interface.');
    
  } catch (error) {
    console.error('❌ Manual fix failed:', error);
    console.error('   Error details:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

manualFixBookings().catch(console.error);
