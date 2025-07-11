// Test the intelligent parser with the user's exact input
import { IntelligentQuoteParser } from './lib/services/intelligent-quote-parser.js'

const testInput = `It's for Cici at 9090 Hillside Drive. We are not painting the ceilings. The project is a 500 linear feet of interior painting. $50 a gallon bucket eggshell shirwin williams. spread rate is 350 square feet per gallon. Ceilings are 9 feet tall. We are not painting doors, or trim or windows. No primer. labour is included in the cost per square foot at $1.50.`

console.log('Testing intelligent parser with contractor input...\n')
console.log('INPUT:', testInput)
console.log('\n---PARSED DATA---')

const parsed = IntelligentQuoteParser.parse(testInput)
console.log(JSON.stringify(parsed, null, 2))

console.log('\n---CALCULATED QUOTE---')
const result = IntelligentQuoteParser.calculateQuote(parsed)
console.log(result.summary)
console.log('\nBreakdown:', result.breakdown)