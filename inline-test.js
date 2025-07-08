/**
 * Inline test of quote detection logic
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

// Inline detection logic (simplified from universal-quote-detector.ts)
function detectQuote(content) {
  const lowerContent = content.toLowerCase();
  
  // High confidence indicators
  const highConfidenceIndicators = [
    'total project cost:',
    'quote ready to send!',
    'professional quote complete',
    'final price:',
    'customer pays:'
  ];
  
  // Medium confidence indicators
  const mediumConfidenceIndicators = [
    'total cost:',
    'project total:',
    'estimate:',
    'quote for',
    'painting project',
    'labor:',
    'materials:',
    'total estimate:',
    'project cost:',
    'sq ft',
    'square feet'
  ];
  
  // Check for high confidence
  const highMatches = highConfidenceIndicators.filter(indicator => lowerContent.includes(indicator));
  if (highMatches.length > 0) {
    return { isQuote: true, confidence: 'high', triggers: highMatches };
  }
  
  // Check for medium confidence
  const mediumMatches = mediumConfidenceIndicators.filter(indicator => lowerContent.includes(indicator));
  if (mediumMatches.length >= 3) {
    return { isQuote: true, confidence: 'medium', triggers: mediumMatches };
  }
  
  return { isQuote: false, confidence: 'none', triggers: [] };
}

// Extract customer and cost info
function extractBasicInfo(content) {
  // Extract customer name - look for "for [Name]"
  const customerMatch = content.match(/for\s+([A-Z][a-z]+)/i);
  
  // Extract costs
  const costMatches = content.match(/\$(\d{1,3}(?:,\d{3})*)/g);
  const costs = costMatches ? costMatches.map(match => parseInt(match.replace(/[,$]/g, ''))) : [];
  const maxCost = costs.length > 0 ? Math.max(...costs) : 0;
  
  return {
    customerName: customerMatch ? customerMatch[1] : null,
    totalCost: maxCost,
    allCosts: costs
  };
}

console.log('🎯 Testing Quote Detection for Cici Quote\n');
console.log('Content length:', quoteContent.length);

const detection = detectQuote(quoteContent);
console.log('\n📊 Detection Result:', detection);

const info = extractBasicInfo(quoteContent);
console.log('\n📝 Extracted Info:', info);

// Check auto-save criteria
const meetsAutoSaveCriteria = info.customerName && info.totalCost && info.totalCost > 100;
console.log('\n💾 Auto-save criteria:');
console.log('- Has customer name:', !!info.customerName);
console.log('- Has total cost > $100:', info.totalCost > 100);
console.log('- Meets criteria:', meetsAutoSaveCriteria);

// Check button trigger
const hasButtonTrigger = quoteContent.includes('Quote ready to send!');
console.log('\n🔘 Button trigger:');
console.log('- Contains "Quote ready to send!":', hasButtonTrigger);

console.log('\n🔍 Expected Behavior:');
if (detection.isQuote && hasButtonTrigger) {
  console.log('✅ Should show buttons (quote detected + trigger phrase)');
  if (meetsAutoSaveCriteria) {
    console.log('✅ Should auto-save quote');
  } else {
    console.log('⚠️  Should show buttons but not auto-save (missing customer/cost data)');
  }
} else {
  console.log('❌ Should not show buttons');
}