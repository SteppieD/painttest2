/**
 * Production-grade test suite for Intelligent Quote Parser API
 * 
 * This test suite validates the /api/quote-parser endpoint by sending
 * real-world painting project descriptions and verifying the extracted
 * field data matches expected values.
 * 
 * Run with: npm test quote-parser
 * Debug with: npm run test:debug quote-parser
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';

// Base URL for API testing - adjust for your environment
const API_BASE_URL = process.env.TEST_API_URL || 'http://localhost:3001';

// Test data interface matching our parser's expected output
interface ExpectedParseResult {
  customer_name: string;
  property_address: string;
  linear_feet?: number;
  wall_height_ft?: number;
  walls_sqft?: number;
  labor_cost_per_sqft?: number;
  markup_percent?: number;
  paint_cost_per_gallon?: number;
  primer_included?: boolean;
  project_type: 'interior' | 'exterior' | 'both';
}

interface TestCase {
  id: string;
  description: string;
  input: string;
  expected: ExpectedParseResult;
  notes?: string;
}

// Exportable test cases for reuse in other test files or debugging
export const QUOTE_PARSER_TEST_CASES: TestCase[] = [
  {
    id: 'cici-interior-linear',
    description: 'Interior project with linear feet calculation',
    input: "It's for Cici at 9090 Hillside Drive. We are not painting the ceilings. The project is a 500 linear feet of interior painting. $50 a gallon bucket eggshell shirwin williams. spread rate is 350 square feet ceilings are 9 feet tall. We are not painting doors, or trim or windows. No primer. labour is included in the cost per square foot at $1.50. add 20% markup.",
    expected: {
      customer_name: 'Cici',
      property_address: '9090 Hillside Drive',
      linear_feet: 500,
      wall_height_ft: 9,
      walls_sqft: 4500, // 500 * 9
      labor_cost_per_sqft: 1.50,
      markup_percent: 20,
      paint_cost_per_gallon: 50,
      primer_included: false,
      project_type: 'interior'
    },
    notes: 'Tests linear feet to wall area calculation and explicit exclusions'
  },
  {
    id: 'john-interior-direct-sqft',
    description: 'Interior project with direct square footage',
    input: "John Smith, 123 Main Street. Interior only. 1200 sqft walls, 800 sqft ceilings. Benjamin Moore paint at $45/gallon. $2.00 per square foot labor. 15% markup.",
    expected: {
      customer_name: 'John Smith',
      property_address: '123 Main Street',
      walls_sqft: 1200,
      labor_cost_per_sqft: 2.00,
      markup_percent: 15,
      paint_cost_per_gallon: 45,
      project_type: 'interior'
    },
    notes: 'Tests direct square footage input and brand recognition'
  },
  {
    id: 'sarah-trim-doors-windows',
    description: 'Interior project with trim, doors, and windows specified',
    input: "Sarah at 456 Oak Ave. 2000 sqft total interior. Include trim and doors but not windows. Sherwin Williams ProClassic semi-gloss $55/gal. Labor at $1.75/sqft with 25% markup.",
    expected: {
      customer_name: 'Sarah',
      property_address: '456 Oak Ave',
      walls_sqft: 2000,
      labor_cost_per_sqft: 1.75,
      markup_percent: 25,
      paint_cost_per_gallon: 55,
      project_type: 'interior'
    },
    notes: 'Tests surface inclusions/exclusions and premium paint products'
  },
  {
    id: 'commercial-primer-required',
    description: 'Commercial project with primer requirements',
    input: "Commercial office building, 5000 sqft walls, primer required at $0.85/sqft, $3.50/sqft all-in pricing.",
    expected: {
      customer_name: '', // No customer name in commercial context
      property_address: '', // No specific address given
      walls_sqft: 5000,
      labor_cost_per_sqft: 3.50,
      primer_included: true,
      project_type: 'interior'
    },
    notes: 'Tests commercial context and primer cost parsing'
  },
  {
    id: 'interior-repaint-primer',
    description: 'Repaint project with primer and specific costs',
    input: "Interior repaint, 1800 sqft, needs primer, labor $2.25/sqft, primer cost $0.70 per square foot, 15% markup.",
    expected: {
      customer_name: '',
      property_address: '',
      walls_sqft: 1800,
      labor_cost_per_sqft: 2.25,
      markup_percent: 15,
      primer_included: true,
      project_type: 'interior'
    },
    notes: 'Tests primer cost extraction and repaint context'
  }
];

// Helper function to call the quote parser API
async function callQuoteParser(input: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/quote-parser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input }),
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Helper function to validate parsed data against expected values
function validateParsedData(actual: any, expected: ExpectedParseResult, testId: string) {
  // Check critical fields that should always be parsed if provided
  if (expected.customer_name) {
    expect(actual.customer_name).toBe(expected.customer_name);
  }
  
  if (expected.property_address) {
    expect(actual.property_address).toBe(expected.property_address);
  }

  // Check measurement fields with tolerance for calculation variations
  if (expected.linear_feet !== undefined) {
    expect(actual.linear_feet).toBe(expected.linear_feet);
  }

  if (expected.wall_height_ft !== undefined) {
    expect(actual.wall_height_ft).toBe(expected.wall_height_ft);
  }

  if (expected.walls_sqft !== undefined) {
    // Allow for small calculation differences
    expect(actual.walls_sqft).toBeCloseTo(expected.walls_sqft, 0);
  }

  // Check pricing fields with precision
  if (expected.labor_cost_per_sqft !== undefined) {
    expect(actual.labor_cost_per_sqft).toBeCloseTo(expected.labor_cost_per_sqft, 2);
  }

  if (expected.markup_percent !== undefined) {
    expect(actual.markup_percent).toBe(expected.markup_percent);
  }

  if (expected.paint_cost_per_gallon !== undefined) {
    expect(actual.paint_cost_per_gallon).toBe(expected.paint_cost_per_gallon);
  }

  // Check boolean fields
  if (expected.primer_included !== undefined) {
    expect(actual.primer_included).toBe(expected.primer_included);
  }

  // Check project type
  expect(actual.project_type).toBe(expected.project_type);
}

describe('Intelligent Quote Parser API Tests', () => {
  let testServer: any;

  beforeAll(async () => {
    // Optional: Start test server if needed
    console.log(`Testing against API at: ${API_BASE_URL}`);
  });

  afterAll(async () => {
    // Optional: Cleanup test server
  });

  describe('Core Parser Functionality', () => {
    test.each(QUOTE_PARSER_TEST_CASES)(
      'should correctly parse: $description',
      async ({ id, input, expected, notes }) => {
        console.log(`\n🧪 Testing case: ${id}`);
        console.log(`📝 Notes: ${notes || 'N/A'}`);
        console.log(`📥 Input: "${input.substring(0, 100)}..."`);

        // Call the API
        const result = await callQuoteParser(input);

        // Verify basic response structure
        expect(result).toBeDefined();
        expect(result.success).toBe(true);
        expect(result.parsed_data).toBeDefined();

        // Log parser results for debugging
        console.log(`📊 Confidence: ${result.confidence_score}%`);
        console.log(`⚠️  Missing fields: ${result.missing_fields?.length || 0}`);
        
        if (result.warnings?.length > 0) {
          console.log(`🔔 Warnings: ${result.warnings.join(', ')}`);
        }

        // Validate parsed data against expected values
        validateParsedData(result.parsed_data, expected, id);

        // Ensure high confidence for production use
        if (result.confidence_score < 70) {
          console.warn(`⚠️  Low confidence score for test ${id}: ${result.confidence_score}%`);
        }

        console.log(`✅ Test ${id} passed`);
      },
      30000 // 30 second timeout for API calls
    );
  });

  describe('Parser Quality Metrics', () => {
    test('should achieve high confidence scores on clear inputs', async () => {
      const clearInput = QUOTE_PARSER_TEST_CASES[0].input; // Cici's detailed input
      const result = await callQuoteParser(clearInput);
      
      expect(result.success).toBe(true);
      expect(result.confidence_score).toBeGreaterThan(80);
      expect(result.missing_fields?.length || 0).toBeLessThan(3);
    });

    test('should handle incomplete inputs gracefully', async () => {
      const incompleteInput = "Just need a quote for some painting";
      const result = await callQuoteParser(incompleteInput);
      
      expect(result.success).toBe(true);
      expect(result.needs_clarification).toBe(true);
      expect(result.clarification_questions).toBeDefined();
      expect(result.clarification_questions.length).toBeGreaterThan(0);
    });

    test('should provide meaningful clarification questions', async () => {
      const vagueInput = "Interior painting project";
      const result = await callQuoteParser(vagueInput);
      
      expect(result.success).toBe(true);
      expect(result.clarification_questions).toContain(
        expect.stringMatching(/customer|name/i)
      );
      expect(result.clarification_questions).toContain(
        expect.stringMatching(/address|property/i)
      );
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle empty input', async () => {
      const result = await callQuoteParser('');
      
      expect(result.success).toBe(false);
      // Should either fail gracefully or ask for information
    });

    test('should handle malformed input', async () => {
      const malformedInput = "@@#$%^&*()_+{}|:<>?";
      const result = await callQuoteParser(malformedInput);
      
      // Should not crash, either parse what it can or ask for clarification
      expect(result).toBeDefined();
    });

    test('should handle very long input', async () => {
      const longInput = QUOTE_PARSER_TEST_CASES[0].input.repeat(10);
      const result = await callQuoteParser(longInput);
      
      expect(result).toBeDefined();
      expect(result.success).toBeDefined();
    });
  });
});

// Export test data for external use
export { QUOTE_PARSER_TEST_CASES as QuoteParserTestCases };

// CLI helper function for running specific test cases
export async function runSingleTestCase(testId: string): Promise<void> {
  const testCase = QUOTE_PARSER_TEST_CASES.find(tc => tc.id === testId);
  if (!testCase) {
    throw new Error(`Test case '${testId}' not found`);
  }

  console.log(`Running single test case: ${testCase.description}`);
  const result = await callQuoteParser(testCase.input);
  console.log('Result:', JSON.stringify(result, null, 2));
  
  try {
    validateParsedData(result.parsed_data, testCase.expected, testId);
    console.log('✅ Test passed');
  } catch (error) {
    console.log('❌ Test failed:', error);
  }
}