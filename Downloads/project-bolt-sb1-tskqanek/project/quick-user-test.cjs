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
        'Content-Type': 'application/json'
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

async function quickUserTest() {
  console.log('🔍 QUICK USER TEST');
  console.log('==================');
  
  try {
    // Get all users
    console.log('👥 Fetching users...');
    const users = await makeRequest('GET', '/api/auth/users');
    
    if (users.status === 200) {
      console.log(`✅ Found ${users.data.length} users:`);
      users.data.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.username} (${user.role}) - ${user.full_name}`);
      });
    } else {
      console.log('❌ Failed to get users:', users.status, users.data);
    }
    
    // Test login
    console.log('\n🔐 Testing admin login...');
    const login = await makeRequest('POST', '/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    if (login.status === 200) {
      console.log('✅ Admin login successful!');
      console.log(`   Role: ${login.data.user.role}`);
      console.log(`   Name: ${login.data.user.full_name}`);
    } else {
      console.log('❌ Admin login failed:', login.status, login.data);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

quickUserTest();
