/**
 * Debug labor cost extraction specifically
 */

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

console.log('🔍 Debugging Labor Cost Extraction\n');

// Test the improved labor pattern specifically
const laborPattern = /labor:.*?=\s*\$?([,\d]+)/i;
const laborMatch = quoteContent.match(laborPattern);

console.log('Labor Pattern Result:');
console.log('Pattern:', laborPattern.toString());
console.log('Match:', laborMatch);
if (laborMatch) {
  console.log('Extracted labor cost:', laborMatch[1]);
  console.log('Parsed labor cost:', parseInt(laborMatch[1].replace(/,/g, '')));
}

// Test all cost patterns
console.log('\n📊 All Cost Pattern Tests:');
const costPatterns = [
  { name: 'Total Cost', pattern: /total cost:\s*\$?([,\d]+)/i },
  { name: 'Labor', pattern: /labor:\s*\$?([,\d]+)/i },
  { name: 'All Dollar Amounts', pattern: /\$([,\d]+)/g }
];

costPatterns.forEach(({ name, pattern }) => {
  const matches = quoteContent.match(pattern);
  console.log(`${name}:`, matches);
});

// Test the exact logic that should work
console.log('\n🔧 Step-by-step Logic:');

// 1. Try explicit totals
const totalPatterns = [
  /total cost:\s*\$?([,\d]+)/i,
  /total estimate:\s*\$?([,\d]+)/i,
  /project total:\s*\$?([,\d]+)/i
];

let foundTotal = false;
for (const pattern of totalPatterns) {
  const match = quoteContent.match(pattern);
  if (match) {
    console.log('Found explicit total:', match[1]);
    foundTotal = true;
    break;
  }
}

// 2. If no explicit total, try labor
if (!foundTotal) {
  console.log('No explicit total found, checking labor...');
  const laborMatch = quoteContent.match(/labor:\s*\$?([,\d]+)/i);
  if (laborMatch) {
    const laborCost = parseInt(laborMatch[1].replace(/,/g, ''));
    console.log('Found labor cost:', laborCost);
    if (laborCost > 100) {
      console.log('✅ Using labor cost as total:', laborCost);
    }
  }
}

console.log('\n💡 The labor pattern should find: $6,750');
console.log('Let\'s trace through the exact line:');
console.log('Text: "- Labor: 4,500 sqft × $1.50 = $6,750"');
console.log('Pattern: /labor:\\s*\\$?([,\\d]+)/i');

// Test with the exact line
const laborLine = '- Labor: 4,500 sqft × $1.50 = $6,750';
const laborLineMatch = laborLine.match(/labor:\s*.*?\$([,\d]+)/i);
console.log('Labor line match:', laborLineMatch);