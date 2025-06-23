/**
 * Test the Universal Quote Detector with the Cici quote
 */

import { detectAndExtractQuote, extractLearningData } from './lib/universal-quote-detector.js';

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

console.log('🎯 Testing Universal Quote Detection with Cici Quote\n');

try {
  const detectedQuote = detectAndExtractQuote(quoteContent);
  console.log('Detection Result:', JSON.stringify(detectedQuote, null, 2));
  
  if (detectedQuote.isQuote) {
    console.log('\n✅ Quote detected successfully!');
    console.log(`Confidence: ${detectedQuote.confidence}`);
    console.log(`Customer: ${detectedQuote.customerName || 'Not extracted'}`);
    console.log(`Total Cost: ${detectedQuote.totalCost || 'Not extracted'}`);
    console.log(`Address: ${detectedQuote.address || 'Not extracted'}`);
    
    // Check if it meets auto-save criteria
    const hasCustomerAndCost = detectedQuote.customerName && detectedQuote.totalCost && detectedQuote.totalCost > 100;
    console.log(`\nMeets auto-save criteria: ${hasCustomerAndCost ? 'YES' : 'NO'}`);
    
    if (!hasCustomerAndCost) {
      console.log('Reason: Missing customer name or cost < $100');
    }
  } else {
    console.log('\n❌ Quote not detected');
  }
  
  // Test learning data extraction
  const learningData = extractLearningData(quoteContent);
  console.log('\n📚 Learning Data:', JSON.stringify(learningData, null, 2));
  
} catch (error) {
  console.error('Error testing detection:', error);
}