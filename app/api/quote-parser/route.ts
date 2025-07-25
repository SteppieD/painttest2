import { NextRequest, NextResponse } from 'next/server';
import { IntelligentQuoteParser, ModularQuoteCalculator } from '@/lib/intelligent-quote-parser';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input) {
      return NextResponse.json(
        { error: 'Input text is required' },
        { status: 400 }
      );
    }

    console.log('API Key available:', !!process.env.OPENROUTER_API_KEY);
    console.log('Parsing input:', input.substring(0, 100) + '...');

    const parser = new IntelligentQuoteParser();
    const calculator = new ModularQuoteCalculator();

    // Stage 1: Parse the input
    const parsingResult = await parser.parseQuoteInput(input);

    if (!parsingResult.success) {
      return NextResponse.json({
        success: false,
        errors: parsingResult.errors,
        needs_clarification: true,
        clarification_questions: parsingResult.clarification_questions
      });
    }

    // Stage 2: Calculate quote if we have enough information
    let quoteCalculation = null;
    let canCalculate = false;

    // Enhanced calculation check for separate wall/ceiling rates
    const hasBasicInfo = parsingResult.data.walls_sqft || 
                        (parsingResult.data.linear_feet && parsingResult.data.wall_height_ft);
    
    const hasRates = parsingResult.data.labor_cost_per_sqft || 
                    (parsingResult.data.wall_labor_rate || parsingResult.data.ceiling_labor_rate);
    
    if (hasBasicInfo && hasRates) {
      canCalculate = true;
      quoteCalculation = calculator.calculateQuote(parsingResult.data);
    }

    return NextResponse.json({
      success: true,
      parsed_data: parsingResult.data,
      warnings: parsingResult.warnings,
      needs_clarification: parsingResult.needs_clarification,
      clarification_questions: parsingResult.clarification_questions,
      can_calculate: canCalculate,
      quote_calculation: quoteCalculation,
      confidence_score: parsingResult.data.confidence_score,
      missing_fields: parsingResult.data.missing_fields,
      assumptions_made: parsingResult.data.assumptions_made,
      // Enhanced parsing results
      product_changes: parsingResult.data.product_changes || null,
      rate_adjustments: parsingResult.data.rate_adjustments || null,
      has_enhancements: !!(parsingResult.data.product_changes || parsingResult.data.rate_adjustments),
      separate_rates: {
        wall_rate: parsingResult.data.wall_labor_rate,
        ceiling_rate: parsingResult.data.ceiling_labor_rate,
        has_separate_rates: !!(parsingResult.data.wall_labor_rate || parsingResult.data.ceiling_labor_rate)
      }
    });

  } catch (error) {
    console.error('Quote parsing error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to parse quote input',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Test endpoint to validate parsing with test cases
export async function GET(req: NextRequest) {
  try {
    const { generateTestCases } = await import('@/lib/intelligent-quote-parser');
    const testCases = generateTestCases();
    
    return NextResponse.json({
      test_cases: testCases,
      total_cases: testCases.length,
      description: 'Use POST /api/quote-parser with { "input": "..." } to test parsing'
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate test cases' },
      { status: 500 }
    );
  }
}