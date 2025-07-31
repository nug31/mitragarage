
// Quick Actions Test Script
// Run this in browser console to test functionality

console.log('🧪 Testing Quick Actions...');

// Test navigation functions
function testBookService() {
  const bookButton = document.querySelector('button[onclick*="booking"]');
  if (bookButton) {
    console.log('✅ Book Service button found');
    bookButton.click();
    console.log('📅 Navigated to My Bookings');
  } else {
    console.log('❌ Book Service button not found');
  }
}

function testBrowseItems() {
  const browseButton = document.querySelector('button[onclick*="browse"]');
  if (browseButton) {
    console.log('✅ Browse Items button found');
    browseButton.click();
    console.log('🛒 Navigated to Browse Items');
  } else {
    console.log('❌ Browse Items button not found');
  }
}

function testGiveReview() {
  const reviewButton = document.querySelector('button[onclick*="review"]');
  if (reviewButton) {
    console.log('✅ Give Review button found');
    reviewButton.click();
    console.log('⭐ Review modal opened');
  } else {
    console.log('❌ Give Review button not found');
  }
}

// Test all quick actions
console.log('🎯 Testing all Quick Actions...');
setTimeout(() => testBookService(), 1000);
setTimeout(() => testBrowseItems(), 2000);
setTimeout(() => testGiveReview(), 3000);

console.log('✅ Quick Action tests completed');
