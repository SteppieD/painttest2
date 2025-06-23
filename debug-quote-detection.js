/**
 * Debug the Universal Quote Detection for the Cici quote
 */

// Simulate the quote content from the conversation
const quoteContent = `Great! So we're looking at interior walls only, no ceilings.

Let me calculate this quote for you:

QUOTE SUMMARY:
- Wall Area: 500 LNFT × 9 ft = 4,500 sqft
- Paint Needed: 4,500 sqft ÷ 350 spread rate × 1.8 (2 coats) = 23.1 gallons
- Paint Cost: 23.1 gallons ÷ gallons per bucket × $50 = [Need to know gallons per bucket]
- Labor: 4,500 sqft × $1.50 = $6,750
- Subtotal + 20% markup = Final Quote

Quick question - how many gallons are in each $50 Sherwin Williams bucket? Is that a 5-gallon bucket?

Once I get that, I can give you the complete quote breakdown for Cici!

Quote ready to send! 📋`;

// Test the detection patterns from the button logic
const buttonPatterns = [
  'TOTAL PROJECT COST:',
  'Quote ready to send!',
  'total cost:',
  'total estimate:',
  'project total:'
];

console.log('🧪 Testing Quote Detection for Cici Quote\n');
console.log('Quote Content:');
console.log(quoteContent);
console.log('\n📝 Button Pattern Tests:');

buttonPatterns.forEach(pattern => {
  const matches = quoteContent.includes(pattern);
  console.log(`  "${pattern}": ${matches ? '✅ MATCH' : '❌ NO MATCH'}`);
});

// Test the complex pattern
const hasLongContentWithTotal = quoteContent.toLowerCase().includes('$') && 
                                quoteContent.toLowerCase().includes('total') && 
                                quoteContent.length > 100;

console.log(`  Complex pattern ($+total+length>100): ${hasLongContentWithTotal ? '✅ MATCH' : '❌ NO MATCH'}`);

console.log('\n🔍 Analysis:');
console.log(`Content length: ${quoteContent.length} characters`);
console.log(`Contains customer info: ${quoteContent.toLowerCase().includes('cici') ? 'Yes' : 'No'}`);
console.log(`Contains cost info: ${quoteContent.includes('$') ? 'Yes' : 'No'}`);
console.log(`Contains "Quote ready to send!": ${quoteContent.includes('Quote ready to send!') ? 'Yes' : 'No'}`);

console.log('\n💡 Expected Result:');
console.log('This quote should trigger buttons because:');
console.log('1. Contains "Quote ready to send!" trigger phrase');
console.log('2. Has customer info (Cici)');
console.log('3. Has cost information ($1.50, $6,750)');
console.log('4. Length > 100 characters');

// Test manual extraction
console.log('\n🎯 Manual Data Extraction Test:');
const customerMatch = quoteContent.match(/(?:customer|client|for)\s+([A-Za-z]+)/i);
console.log(`Customer extracted: ${customerMatch ? customerMatch[1] : 'Not found'}`);

const costMatches = quoteContent.match(/\$(\d{1,3}(?:,\d{3})*)/g);
console.log(`Costs found: ${costMatches ? costMatches.join(', ') : 'None'}`);

console.log('\n🔧 Recommendation:');
console.log('The detection should work. If buttons are not appearing, check:');
console.log('1. Is savedQuoteId being set properly?');
console.log('2. Is the message role === "assistant"?');
console.log('3. Are there any JavaScript errors in the console?');