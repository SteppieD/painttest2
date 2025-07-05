// Test the parsing directly without AI
const { unifiedQuoteAssistant } = require('./lib/unified-quote-assistant');

async function testParsing() {
  console.log('=== Testing Direct Parsing (without AI) ===\n');
  
  // Simulate conversation state
  const existingData = {
    customerInfo: {
      customer_name: 'Lina',
      address: '2828 Hillside Drive'
    },
    projectType: 'interior',
    measurements: {
      ceiling_height: 9
    }
  };
  
  // Test parsing with existing data
  const result = await unifiedQuoteAssistant.parseCompleteQuoteMessage(
    "only walls, 2 rooms, ceiling is 9 feet high, paint colour is eggshell. No special requests",
    existingData
  );
  
  console.log('Parsed Result:', JSON.stringify(result, null, 2));
}

testParsing().catch(console.error);