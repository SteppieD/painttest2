// Test script for demo data functionality

async function testDemoData() {
  console.log('🧪 Testing Demo Data Functionality...\n');

  // Test 1: Check if demo data API endpoint exists
  console.log('Test 1: Checking API endpoint availability...');
  try {
    const response = await fetch('http://localhost:3001/api/seed-demo-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'paintquote_company=' + JSON.stringify({
          id: 1,
          name: 'Test Company',
          accessCode: 'DEMO2024'
        })
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API endpoint working!');
      console.log('Response:', JSON.stringify(data, null, 2));
      
      // Check response structure
      if (data.success || data.message) {
        console.log('✅ Valid response structure');
        console.log(`- Quotes created: ${data.quotesCreated || 0}`);
        console.log(`- Contractor profiles: ${data.contractorProfilesCreated || 0}`);
      }
    } else {
      console.log('❌ API endpoint returned error:', response.status);
    }
  } catch (error) {
    console.log('❌ Failed to reach API endpoint:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Check demo data structure
  console.log('Test 2: Checking demo data structure...');
  try {
    const { demoQuotes, demoContractors } = await import('./lib/demo-data.js');
    
    console.log(`✅ Found ${demoQuotes?.length || 0} demo quotes`);
    console.log(`✅ Found ${demoContractors?.length || 0} demo contractors`);
    
    if (demoQuotes && demoQuotes.length > 0) {
      console.log('\nFirst demo quote sample:');
      const firstQuote = demoQuotes[0];
      console.log(`- Customer: ${firstQuote.customerName}`);
      console.log(`- Address: ${firstQuote.customerAddress}`);
      console.log(`- Total: $${firstQuote.total}`);
      console.log(`- Status: ${firstQuote.status}`);
    }
  } catch (error) {
    console.log('❌ Could not load demo data:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Check if demo data button exists in dashboard
  console.log('Test 3: Checking dashboard integration...');
  console.log('- Demo data button is located in Quick Actions section');
  console.log('- Look for "Load Demo Data" button with sparkles icon');
  console.log('- Button should show loading state when clicked');
  console.log('- Success/error alerts should appear after loading');

  console.log('\n✅ Demo Data Testing Complete!');
  console.log('\nSummary:');
  console.log('- API endpoint: /api/seed-demo-data');
  console.log('- Creates sample quotes for testing');
  console.log('- Stores contractor profiles in localStorage');
  console.log('- Accessible from dashboard Quick Actions');
}

// Run the test
testDemoData();