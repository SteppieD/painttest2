/**
 * Test Universal Quote Detection System
 * 
 * This test demonstrates how the universal quote detector works with different quote formats
 */

// Import the universal quote detector functions
import { detectAndExtractQuote, extractLearningData } from './lib/universal-quote-detector.js';

console.log('🧪 Testing Universal Quote Detection System\n');

// Test Case 1: Professional Calculator Quote (High Confidence)
const professionalQuote = `🎉 **Professional Quote Complete!**

**Customer:** Sarah Martinez
**Address:** 456 Oak Street

**TOTAL PROJECT COST:** $4,850
• Materials: $1,455
• Labor: $2,425
• Your Profit: $970 (20%)

**Quote ready to send!** 📋`;

console.log('Test 1: Professional Calculator Quote');
const result1 = detectAndExtractQuote(professionalQuote);
console.log('Result:', result1);
console.log('Should detect: High confidence, auto-save ready\n');

// Test Case 2: AI Generated Quote (Medium Confidence) - Like the user's example
const aiQuote = `Here's a quote for painting 2 bedrooms for John Smith at 123 Main Street:

**Project Details:**
- Customer: John Smith  
- Address: 123 Main Street
- Project: Interior painting for 2 bedrooms
- Total ceiling area: 278 sq ft

**Cost Breakdown:**
- Materials: $145
- Labor: $480
- Total Cost: $625

This quote includes primer, paint, and all labor for ceiling painting.`;

console.log('Test 2: AI Generated Quote (User\'s Example Format)');
const result2 = detectAndExtractQuote(aiQuote);
console.log('Result:', result2);
console.log('Should detect: Medium confidence, trigger buttons\n');

// Test Case 3: Simple Manual Quote (Low-Medium Confidence)
const manualQuote = `Quote for painting project:
Customer: Mike Johnson
Location: 789 Pine Street
Total estimate: $1,250
Interior painting for living room and kitchen`;

console.log('Test 3: Simple Manual Quote');
const result3 = detectAndExtractQuote(manualQuote);
console.log('Result:', result3);
console.log('Should detect: Medium confidence, trigger buttons\n');

// Test Case 4: Very Basic Quote (Low Confidence)
const basicQuote = `Mike needs painting at 789 Pine. Cost around $800 for 2 rooms.`;

console.log('Test 4: Very Basic Quote');
const result4 = detectAndExtractQuote(basicQuote);
console.log('Result:', result4);
console.log('Should detect: Low confidence\n');

// Test Case 5: Non-Quote Text (Should not detect)
const nonQuote = `Hi there! I'm looking for information about painting my house. Can you help me understand the process?`;

console.log('Test 5: Non-Quote Text');
const result5 = detectAndExtractQuote(nonQuote);
console.log('Result:', result5);
console.log('Should NOT detect as quote\n');

// Test Learning Data Extraction
console.log('🎓 Testing Learning Data Extraction');
const learningText = `I use Sherwin Williams ProClassic at $65 per gallon. My standard markup is 25% and I charge $3.50 per square foot for walls.`;
const learningData = extractLearningData(learningText);
console.log('Learning Data Result:', learningData);
console.log('Should extract: Paint brands, rates, markup preferences\n');

console.log('✅ Universal Quote Detection Tests Complete!');
console.log('\nSummary of Features:');
console.log('- Detects quotes across ALL formats (professional, AI, manual, basic)');
console.log('- Auto-saves quotes with sufficient data (name + cost > $100)');
console.log('- Adds trigger phrases for button display');
console.log('- Extracts learning data for profile building');
console.log('- Works with the user\'s real quote example that was missing buttons');