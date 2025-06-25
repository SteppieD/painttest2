// Test script to debug parsing issues
const { parseCustomerInfo, parseDimensions, parseProjectType } = require('./lib/improved-conversation-parser.ts');

// Test the problematic input
const testInput = "It's for Cici at 9090 Hillside Drive. We are not painting the ceilings. The project is a 500 linear feet of interior painting. $50 a gallon bucket eggshell shirwin williams. spread rate is 350 square feet ceilings are 9 feet tall. We are not painting doors, or trim or windows. No primer. labour is included in the cost per square foot at $1.50. add 20% markup.";

console.log('=== PARSING DEBUG TEST ===');
console.log('Input:', testInput);
console.log('');

// Test customer info parsing
console.log('1. Customer Info Parsing:');
try {
  const customerInfo = parseCustomerInfo(testInput);
  console.log('Result:', customerInfo);
} catch (error) {
  console.log('Error:', error.message);
}
console.log('');

// Test project type parsing
console.log('2. Project Type Parsing:');
try {
  const projectType = parseProjectType(testInput);
  console.log('Result:', projectType);
} catch (error) {
  console.log('Error:', error.message);
}
console.log('');

// Test dimensions parsing
console.log('3. Dimensions Parsing:');
try {
  const dimensions = parseDimensions(testInput, 'interior');
  console.log('Result:', dimensions);
} catch (error) {
  console.log('Error:', error.message);
}
console.log('');

// Test individual parsing components
console.log('4. Individual Component Tests:');

// Test linear feet extraction
const linearFeetTest = testInput.match(/(\d+)\s*linear\s*feet/i);
console.log('Linear feet match:', linearFeetTest);

// Test ceiling height extraction
const ceilingHeightTest = testInput.match(/ceilings?\s+are\s+(\d+)\s*feet?\s+tall/i);
console.log('Ceiling height match:', ceilingHeightTest);

// Test paint cost extraction
const paintCostTest = testInput.match(/\$(\d+)\s*a\s*gallon/i);
console.log('Paint cost match:', paintCostTest);

// Test spread rate extraction
const spreadRateTest = testInput.match(/spread\s+rate\s+is\s+(\d+)\s*square\s*feet/i);
console.log('Spread rate match:', spreadRateTest);

// Test labor rate extraction
const laborRateTest = testInput.match(/\$(\d+\.?\d*)\s*(?:per\s+)?(?:square\s+)?foot/i);
console.log('Labor rate match:', laborRateTest);

// Test markup extraction
const markupTest = testInput.match(/(\d+)%?\s*markup/i);
console.log('Markup match:', markupTest);