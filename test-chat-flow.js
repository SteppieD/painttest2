// Test the complete chat flow
const baseUrl = 'http://localhost:3001';

async function testChatFlow() {
  console.log('=== Testing Complete Chat Flow ===\n');
  
  const conversationHistory = [];
  
  // Step 1: Initial message with customer info
  console.log('STEP 1: Customer provides name and address');
  const response1 = await fetch(`${baseUrl}/api/unified-quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userInput: "I need a quote for John Smith at 123 Main Street",
      companyId: '1',
      conversationHistory: []
    })
  });
  
  const data1 = await response1.json();
  console.log('USER: I need a quote for John Smith at 123 Main Street');
  console.log('BOT:', data1.response.split('\n')[0]);
  
  conversationHistory.push(
    { role: 'user', content: 'I need a quote for John Smith at 123 Main Street' },
    { role: 'assistant', content: data1.response }
  );
  
  // Step 2: Add project details
  console.log('\nSTEP 2: Add project type and measurements');
  const response2 = await fetch(`${baseUrl}/api/unified-quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userInput: "Interior painting, 200 linear feet, 9 foot ceilings",
      companyId: '1',
      conversationHistory
    })
  });
  
  const data2 = await response2.json();
  console.log('USER: Interior painting, 200 linear feet, 9 foot ceilings');
  console.log('BOT:', data2.response.split('\n')[0]);
  console.log('Still asking for name?', data2.response.toLowerCase().includes('customer name'));
  
  conversationHistory.push(
    { role: 'user', content: 'Interior painting, 200 linear feet, 9 foot ceilings' },
    { role: 'assistant', content: data2.response }
  );
  
  // Step 3: Add surfaces
  console.log('\nSTEP 3: Specify surfaces');
  const response3 = await fetch(`${baseUrl}/api/unified-quote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userInput: "Just walls, no ceilings or trim",
      companyId: '1',
      conversationHistory
    })
  });
  
  const data3 = await response3.json();
  console.log('USER: Just walls, no ceilings or trim');
  console.log('BOT:', data3.response.split('\n')[0]);
  console.log('Quote generated?', !!data3.quote);
  
  if (data3.quote) {
    console.log('\n✅ SUCCESS: Quote generated!');
    console.log('Customer:', data3.quote.project_info?.customer_name);
    console.log('Total Price: $' + data3.quote.final_price);
  } else {
    console.log('\n❌ FAILED: No quote generated');
  }
}

testChatFlow().catch(console.error);