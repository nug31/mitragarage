const http = require('http');

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: 'localhost',
      port: 3003,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
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
          resolve({ status: res.statusCode, data: response });
        } catch (error) {
          resolve({ status: res.statusCode, data: responseData });
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

async function addTestRecords() {
  console.log('➕ ADDING TEST RECORDS FOR B5432KCR');
  console.log('===================================');
  console.log('');
  
  try {
    const testRecords = [
      {
        vehicle_number: 'B5432KCR',
        customer_name: 'Customer Test',
        service_type: 'Ganti Ban',
        service_date: '2025-07-23',
        cost: 800000,
        notes: 'Ganti ban depan dan belakang. Menggunakan ban Michelin.'
      },
      {
        vehicle_number: 'B5432KCR',
        customer_name: 'Customer Test',
        service_type: 'Service AC',
        service_date: '2025-07-20',
        cost: 250000,
        notes: 'Service AC lengkap. Cuci evaporator dan isi freon.'
      }
    ];
    
    for (const record of testRecords) {
      console.log(`📝 Adding: ${record.service_type} for ${record.vehicle_number}...`);
      console.log(`   Cost: Rp ${record.cost.toLocaleString()}`);
      console.log(`   Data:`, JSON.stringify(record, null, 2));
      
      const result = await makeRequest('POST', '/api/vehicle-history', record);
      
      console.log(`   Response status: ${result.status}`);
      console.log(`   Response data:`, result.data);
      
      if (result.status === 201) {
        console.log(`   ✅ Successfully added!`);
      } else {
        console.log(`   ❌ Failed to add. Status: ${result.status}`);
        console.log(`   Error details:`, result.data);
      }
      console.log('');
    }
    
    // Verify the records were added
    console.log('🔍 VERIFYING RECORDS...');
    console.log('=======================');
    
    const historyResult = await makeRequest('GET', '/api/vehicle-history');
    
    if (historyResult.status === 200) {
      const b5432Records = historyResult.data.filter(record => record.vehicle_number === 'B5432KCR');
      
      console.log(`📊 Found ${b5432Records.length} records for B5432KCR:`);
      b5432Records.forEach((record, index) => {
        console.log(`   ${index + 1}. ${record.service_type} - Rp ${Number(record.cost).toLocaleString()}`);
        console.log(`      Date: ${new Date(record.service_date).toLocaleDateString('id-ID')}`);
        console.log(`      Notes: ${record.notes}`);
      });
      
      if (b5432Records.length === 0) {
        console.log('❌ No records found for B5432KCR. Vehicle will not appear in the list.');
        console.log('');
        console.log('🔧 TROUBLESHOOTING:');
        console.log('1. Check if the POST API endpoint is working correctly');
        console.log('2. Verify database connection');
        console.log('3. Check for any validation errors');
      } else {
        console.log('');
        console.log('✅ SUCCESS! B5432KCR now has proper records with valid costs.');
        console.log('📱 You can now refresh the Vehicle History page and see the correct costs.');
      }
    }
    
  } catch (error) {
    console.error('❌ Failed to add test records:', error);
  }
}

addTestRecords().catch(console.error);
