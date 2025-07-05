// Test script to simulate a chat conversation
const baseUrl = 'http://localhost:3001';

async function sendMessage(userInput, conversationHistory = []) {
  console.log('\n📤 USER:', userInput);
  
  const response = await fetch(`${baseUrl}/api/unified-quote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userInput,
      companyId: '1',
      conversationHistory
    })
  });

  const data = await response.json();
  console.log('🤖 BOT:', data.response);
  console.log('📊 Extracted:', JSON.stringify(data.extractedData, null, 2));
  
  return data;
}

async function testConversation() {
  console.log('=== Testing Chat Conversation ===');
  
  const conversationHistory = [];
  
  // Message 1: Initial request
  const msg1 = await sendMessage(
    "A indoor painting quote for Lina at 2828 Hillside Drive",
    conversationHistory
  );
  
  conversationHistory.push(
    { role: 'user', content: "A indoor painting quote for Lina at 2828 Hillside Drive" },
    { role: 'assistant', content: msg1.response }
  );
  
  // Message 2: Provide more details
  const msg2 = await sendMessage(
    "only walls, 2 rooms, ceiling is 9 feet high, paint colour is eggshell. No special requests",
    conversationHistory
  );
  
  conversationHistory.push(
    { role: 'user', content: "only walls, 2 rooms, ceiling is 9 feet high, paint colour is eggshell. No special requests" },
    { role: 'assistant', content: msg2.response }
  );
  
  // Message 3: See if it asks for info already provided
  const msg3 = await sendMessage(
    "15 feet by 12 feet for each room",
    conversationHistory
  );
  
  console.log('\n=== Test Complete ===');
  console.log('Final quote generated:', !!msg3.quote);
}

testConversation().catch(console.error);