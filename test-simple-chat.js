// Simple test to check if chat remembers context
const baseUrl = 'http://localhost:3001';

async function testSimpleConversation() {
  console.log('=== Simple Chat Test ===\n');
  
  // First message - establish context
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
  console.log('Message 1 - Establish context');
  console.log('USER: I need a quote for John Smith at 123 Main Street');
  console.log('BOT:', data1.response.substring(0, 100) + '...');
  
  // Second message - bot should remember John Smith
  const conversationHistory = [
    { role: 'user', content: 'I need a quote for John Smith at 123 Main Street' },
    { role: 'assistant', content: data1.response }
  ];
  
  const response2 = await fetch(`${baseUrl}/api/unified-quote`, {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userInput: "It's interior painting, 200 linear feet",
      companyId: '1',
      conversationHistory
    })
  });
  
  const data2 = await response2.json();
  console.log('\nMessage 2 - Should remember John Smith');
  console.log('USER: It\'s interior painting, 200 linear feet');
  console.log('BOT:', data2.response.substring(0, 150) + '...');
  console.log('\nDoes bot ask for name again?', data2.response.toLowerCase().includes('name') || data2.response.toLowerCase().includes('who'));
}

testSimpleConversation().catch(console.error);