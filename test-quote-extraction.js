/**
 * Test what data the universal quote detector extracts from the Cici quote
 */

// Simulate the exact quote content from the conversation
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

// Simulate the universal quote detector logic
function detectAndExtractQuote(content) {
  const lowerContent = content.toLowerCase();
  
  // Check for high confidence indicators
  const highConfidenceIndicators = [
    'total project cost:',
    'quote ready to send!',
    'professional quote complete',
    'final price:',
    'customer pays:'
  ];
  
  const hasHighConfidence = highConfidenceIndicators.some(indicator => 
    lowerContent.includes(indicator)
  );
  
  if (!hasHighConfidence) {
    return { isQuote: false, confidence: 'none' };
  }
  
  // Extract data like the actual detector does
  const data = {};
  
  // Extract customer name - flexible patterns
  const customerPatterns = [
    /(?:customer|client):\s*([^\n,]+)/i,
    /for\s+([A-Z][a-z]+)(?:\s+at\s+)/i, // "for Cici at"
    /breakdown for\s+([A-Z][a-z]+)/i, // "breakdown for Cici"
    /quote for\s+([^,\n]+)/i,
    /^([A-Z][a-z]+\s+[A-Z][a-z]+)/m // Name pattern at start of line
  ];
  
  for (const pattern of customerPatterns) {
    const match = content.match(pattern);
    if (match && match[1].trim().length > 2) {
      data.customerName = match[1].trim();
      break;
    }
  }
  
  // Extract costs with labor priority
  const costPatterns = [
    /total cost:\s*\$?([,\d]+)/i,
    /total estimate:\s*\$?([,\d]+)/i,
    /project total:\s*\$?([,\d]+)/i,
    /estimate:\s*\$?([,\d]+)/i,
    /total.*:\s*\$?([,\d]+)/i,
    /\$?([,\d]+)\s*total/i
  ];
  
  // Also check for labor costs as potential total
  const laborCostMatch = content.match(/labor:\s*\$?([,\d]+)/i);
  
  // Try to find explicit total first
  for (const pattern of costPatterns) {
    const match = content.match(pattern);
    if (match) {
      const cost = parseInt(match[1].replace(/,/g, ''));
      if (cost > 100) {
        data.totalCost = cost;
        break;
      }
    }
  }
  
  // If no explicit total found but labor cost exists, use that
  if (!data.totalCost && laborCostMatch) {
    const laborCost = parseInt(laborCostMatch[1].replace(/,/g, ''));
    if (laborCost > 100) {
      data.totalCost = laborCost;
    }
  }
  
  // Extract square footage
  const sqftMatch = content.match(/([,\d]+)\s*sqft/i);
  if (sqftMatch) {
    data.sqft = parseInt(sqftMatch[1].replace(/,/g, ''));
  }
  
  // Extract address - flexible patterns
  const addressPatterns = [
    /address:\s*([^\n]+)/i,
    /at\s+(\d+[^\n,]+)/i,
    /location:\s*([^\n]+)/i
  ];
  
  for (const pattern of addressPatterns) {
    const match = content.match(pattern);
    if (match) {
      data.address = match[1].trim();
      break;
    }
  }
  
  // Project type
  if (content.toLowerCase().includes('interior')) {
    data.projectType = 'interior';
  } else if (content.toLowerCase().includes('exterior')) {
    data.projectType = 'exterior';
  }
  
  return {
    isQuote: true,
    confidence: 'high',
    ...data,
    extractedData: data
  };
}

console.log('🎯 Testing Quote Data Extraction for Cici Quote\n');

const detectedQuote = detectAndExtractQuote(quoteContent);
console.log('Detected Quote Data:');
console.log(JSON.stringify(detectedQuote, null, 2));

console.log('\n📝 Expected vs Actual:');
console.log('Customer Name:', detectedQuote.customerName || 'NOT EXTRACTED');
console.log('Total Cost:', detectedQuote.totalCost || 'NOT EXTRACTED');
console.log('Square Footage:', detectedQuote.sqft || 'NOT EXTRACTED');
console.log('Address:', detectedQuote.address || 'NOT EXTRACTED');
console.log('Project Type:', detectedQuote.projectType || 'NOT EXTRACTED');

console.log('\n🔧 Issues Found:');
if (!detectedQuote.customerName) {
  console.log('❌ Customer name not extracted - quote says "for Cici" but detector pattern may not match');
}
if (!detectedQuote.totalCost) {
  console.log('❌ Total cost not extracted - quote has "$6,750" labor cost but not marked as total');
}
if (!detectedQuote.address) {
  console.log('❌ Address not extracted - quote doesn\'t contain address, only mentions "Cici" name');
}

console.log('\n💡 Recommendations:');
console.log('1. Extract labor cost ($6,750) as the main cost');
console.log('2. Get customer name "Cici" from the "for Cici" pattern');
console.log('3. Use conversation context for address (9090 Hillside Drive)');
console.log('4. Extract 4,500 sqft as the project size');