
// Admin & Owner Login Test Script
// Run this to test different user roles

const testUsers = [
  { username: 'owner', password: 'owner123', role: 'owner', expected: 8 },
  { username: 'admin', password: 'admin123', role: 'admin', expected: 6 },
  { username: 'manager', password: 'manager123', role: 'admin', expected: 6 },
  { username: 'supervisor', password: 'supervisor123', role: 'admin', expected: 6 },
  { username: 'customer1', password: 'customer123', role: 'customer', expected: 4 }
];

async function testUserLogin(user) {
  console.log(`🧪 Testing ${user.role} login: ${user.username}`);
  
  // Fill login form
  document.querySelector('input[name="username"]').value = user.username;
  document.querySelector('input[name="password"]').value = user.password;
  
  // Submit form
  document.querySelector('form').submit();
  
  // Wait for login
  setTimeout(() => {
    const menuItems = document.querySelectorAll('[role="menuitem"], .menu-item, nav a');
    console.log(`📊 Menu items found: ${menuItems.length} (expected: ${user.expected})`);
    
    if (user.role === 'owner') {
      const userMgmt = document.querySelector('[href*="users"], [data-tab="users"]');
      const reports = document.querySelector('[href*="reports"], [data-tab="reports"]');
      console.log(`👥 User Management: ${userMgmt ? '✅ Found' : '❌ Missing'}`);
      console.log(`📈 Reports: ${reports ? '✅ Found' : '❌ Missing'}`);
    }
  }, 2000);
}

// Test all users
testUsers.forEach((user, index) => {
  setTimeout(() => testUserLogin(user), index * 5000);
});

console.log('🎯 Login tests started. Check results above.');
