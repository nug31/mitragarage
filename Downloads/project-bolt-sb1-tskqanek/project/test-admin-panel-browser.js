
// Admin Panel Update Test Script
// Run this in browser console to verify changes

function testAdminPanelTabs() {
  console.log('🧪 Testing Admin Panel Tabs...');
  
  // Check for tab elements
  const tabs = document.querySelectorAll('[role="tab"], .tab-item, [data-tab]');
  console.log(`📊 Found ${tabs.length} tabs`);
  
  // Look for specific tabs
  const overviewTab = document.querySelector('[data-tab="overview"], [href*="overview"]');
  const requestsTab = document.querySelector('[data-tab="requests"], [href*="requests"]');
  const settingsTab = document.querySelector('[data-tab="settings"], [href*="settings"]');
  const usersTab = document.querySelector('[data-tab="users"], [href*="users"]');
  
  console.log(`📊 Overview Tab: ${overviewTab ? '✅ Found' : '❌ Missing'}`);
  console.log(`📦 Requests Tab: ${requestsTab ? '✅ Found' : '❌ Missing'}`);
  console.log(`⚙️ Settings Tab: ${settingsTab ? '✅ Found' : '❌ Missing'}`);
  console.log(`👥 Users Tab: ${usersTab ? '❌ Found (should be removed)' : '✅ Removed'}`);
  
  // Check for "Kelola User" text
  const kelolaUserText = document.body.innerText.includes('Kelola User');
  console.log(`👥 "Kelola User" text: ${kelolaUserText ? '❌ Found (should be removed)' : '✅ Removed'}`);
}

function testUserManagementAccess() {
  console.log('🧪 Testing User Management Access...');
  
  // Check for User Management menu
  const userMgmtMenu = document.querySelector('[href*="users"], [data-tab="users"]');
  console.log(`👥 User Management Menu: ${userMgmtMenu ? '✅ Found' : '❌ Missing'}`);
  
  // Check current user role
  const userRole = localStorage.getItem('user_data');
  if (userRole) {
    const user = JSON.parse(userRole);
    console.log(`👤 Current Role: ${user.role}`);
    
    if (user.role === 'owner') {
      console.log('👑 Owner should have User Management access');
    } else {
      console.log('🔧 Non-owner should NOT have User Management access');
    }
  }
}

// Run tests
console.log('🎯 Starting Admin Panel Tests...');
setTimeout(() => testAdminPanelTabs(), 1000);
setTimeout(() => testUserManagementAccess(), 2000);

console.log('✅ Admin Panel tests completed. Check results above.');
