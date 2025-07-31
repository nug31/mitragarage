const http = require('http');

function makeRequestWithCORS(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: 'localhost',
      port: 3003,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173',
        'Referer': 'http://localhost:5173/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    
    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: response, headers: res.headers });
        } catch (error) {
          resolve({ status: res.statusCode, data: responseData, headers: res.headers });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function simulateFrontendBooking() {
  console.log('🌐 SIMULATING FRONTEND BOOKING REQUEST');
  console.log('======================================');
  console.log('');
  
  try {
    // Test CORS preflight first
    console.log('1️⃣ Testing CORS Preflight...');
    const corsResult = await makeRequestWithCORS('OPTIONS', '/api/bookings');
    console.log(`CORS Status: ${corsResult.status}`);
    console.log(`CORS Headers:`, corsResult.headers);
    
    console.log('');
    
    // Simulate exact frontend booking data
    console.log('2️⃣ Simulating Frontend Booking Request...');
    
    // This is the exact structure that CustomerBooking.tsx sends
    const frontendBookingData = {
      customer_name: 'John Doe',
      vehicle_number: 'B1234ABC',
      vehicle_type: 'Mobil',
      service_type: 'Service Rutin',
      booking_date: '2025-07-25',
      booking_time: '10:00',
      status: 'Menunggu',
      phone: '081234567890',
      email: 'customer@test.com',
      description: 'Regular maintenance service'
    };
    
    console.log('📝 Frontend booking data:', JSON.stringify(frontendBookingData, null, 2));
    
    const bookingResult = await makeRequestWithCORS('POST', '/api/bookings', frontendBookingData);
    console.log(`Booking Status: ${bookingResult.status}`);
    console.log(`Response Headers:`, bookingResult.headers);
    
    if (bookingResult.status === 201) {
      console.log(`✅ Booking Success: ${JSON.stringify(bookingResult.data, null, 2)}`);
    } else {
      console.log(`❌ Booking Failed: ${JSON.stringify(bookingResult.data, null, 2)}`);
    }
    
    console.log('');
    
    // Test with fetch-like request (more similar to frontend)
    console.log('3️⃣ Testing with Fetch-like Headers...');
    
    const fetchLikeData = {
      customer_name: 'Jane Smith',
      vehicle_number: 'B5678XYZ',
      vehicle_type: 'Motor',
      service_type: 'Ganti Oli',
      booking_date: '2025-07-26',
      booking_time: '14:00',
      status: 'Menunggu',
      phone: '081987654321',
      email: 'jane@test.com',
      description: 'Oil change service'
    };
    
    const fetchResult = await makeRequestWithCORS('POST', '/api/bookings', fetchLikeData);
    console.log(`Fetch-like Status: ${fetchResult.status}`);
    
    if (fetchResult.status === 201) {
      console.log(`✅ Fetch-like Success: ${JSON.stringify(fetchResult.data, null, 2)}`);
    } else {
      console.log(`❌ Fetch-like Failed: ${JSON.stringify(fetchResult.data, null, 2)}`);
    }
    
    console.log('');
    
    // Test bookings list
    console.log('4️⃣ Testing Bookings List...');
    const listResult = await makeRequestWithCORS('GET', '/api/bookings');
    console.log(`List Status: ${listResult.status}`);
    
    if (listResult.status === 200) {
      console.log(`✅ Found ${listResult.data.length} bookings`);
      listResult.data.forEach((booking, index) => {
        console.log(`   ${index + 1}. ${booking.customer_name} - ${booking.service_type}`);
      });
    } else {
      console.log(`❌ List Failed: ${JSON.stringify(listResult.data)}`);
    }
    
    console.log('');
    console.log('🎯 SIMULATION RESULTS');
    console.log('=====================');
    
    if (corsResult.status === 200 || corsResult.status === 204) {
      console.log('✅ CORS is working properly');
    } else {
      console.log('❌ CORS might have issues');
    }
    
    if (bookingResult.status === 201 && fetchResult.status === 201) {
      console.log('✅ Backend accepts frontend-style requests');
      console.log('❓ The issue might be in the frontend code itself');
      console.log('');
      console.log('🔧 NEXT STEPS:');
      console.log('1. Check browser developer tools for exact error');
      console.log('2. Verify frontend is sending correct data format');
      console.log('3. Check if there are any JavaScript errors in frontend');
      console.log('4. Ensure frontend is using correct API endpoint');
    } else {
      console.log('❌ Backend has issues with frontend-style requests');
      console.log('   This explains the frontend booking errors');
    }
    
  } catch (error) {
    console.error('❌ Simulation failed:', error);
    console.error('   Error details:', error.message);
  }
}

simulateFrontendBooking().catch(console.error);
