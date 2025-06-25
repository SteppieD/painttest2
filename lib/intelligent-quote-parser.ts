// Intelligent Quote Parsing System
// Multi-LLM approach for robust painting quote extraction

interface ParsedQuoteData {
  // Customer Information
  customer_name: string;
  property_address: string;
  
  // Project Scope
  ceiling_included: boolean;
  doors_included: boolean;
  trim_included: boolean;
  windows_included: boolean;
  primer_included: boolean;
  
  // Measurements
  linear_feet?: number;
  wall_height_ft?: number;
  walls_sqft?: number;
  ceilings_sqft?: number;
  trim_sqft?: number;
  doors_count?: number;
  windows_count?: number;
  
  // Paint Specifications
  paint_brand?: string;
  paint_product?: string;
  paint_sheen?: string;
  spread_rate_sqft_per_gallon?: number;
  paint_cost_per_gallon?: number;
  primer_cost_per_sqft?: number;
  
  // Pricing - Enhanced for separate wall/ceiling rates
  wall_labor_rate?: number;      // Rate for wall painting per sqft
  ceiling_labor_rate?: number;   // Rate for ceiling painting per sqft
  labor_cost_per_sqft?: number;  // Legacy combined rate for backward compatibility
  markup_percent?: number;
  
  // Product Changes Detection
  product_changes?: {
    walls?: { brand?: string; product?: string; cost?: number };
    ceilings?: { brand?: string; product?: string; cost?: number };
    trim?: { brand?: string; product?: string; cost?: number };
  };
  
  // Rate Adjustments Detection
  rate_adjustments?: {
    wall_rate?: number;
    ceiling_rate?: number;
    trim_rate?: number;
    door_rate?: number;
    window_rate?: number;
    priming_rate?: number;
  };
  
  // Calculated Fields
  calculated_wall_area_sqft?: number;
  
  // Metadata
  project_type: 'interior' | 'exterior' | 'both';
  project_scope_notes: string;
  confidence_score: number;
  missing_fields: string[];
  assumptions_made: string[];
}

interface ParsingResult {
  success: boolean;
  data: ParsedQuoteData;
  errors: string[];
  warnings: string[];
  needs_clarification: boolean;
  clarification_questions: string[];
}

export class IntelligentQuoteParser {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    this.baseUrl = 'https://openrouter.ai/api/v1';
    
    if (!this.apiKey) {
      console.warn('OPENROUTER_API_KEY not found. Parser will use mock mode.');
    }
  }

  async parseQuoteInput(userInput: string): Promise<ParsingResult> {
    try {
      // Check if we have API key, otherwise use mock mode
      if (!this.apiKey) {
        return this.mockParse(userInput);
      }
      
      // Stage 1: Primary extraction with Claude 3.5 Sonnet
      const primaryResult = await this.primaryExtraction(userInput);
      
      // Stage 2: Validation with GPT-4o
      const validatedResult = await this.validateExtraction(userInput, primaryResult);
      
      // Stage 3: Calculate derived fields
      const enrichedResult = this.enrichWithCalculations(validatedResult);
      
      // Stage 4: Quality assessment
      const finalResult = this.assessQuality(enrichedResult);
      
      return {
        success: true,
        data: finalResult,
        errors: [],
        warnings: finalResult.missing_fields.map(field => `Missing: ${field}`),
        needs_clarification: finalResult.missing_fields.length > 0,
        clarification_questions: this.generateClarificationQuestions(finalResult)
      };
      
    } catch (error) {
      return {
        success: false,
        data: this.getEmptyQuoteData(),
        errors: [error instanceof Error ? error.message : 'Unknown parsing error'],
        warnings: [],
        needs_clarification: true,
        clarification_questions: ['Please provide more details about your painting project.']
      };
    }
  }

  private async primaryExtraction(input: string): Promise<ParsedQuoteData> {
    const prompt = `You are an expert at extracting structured information from painting project descriptions with enhanced capabilities for product changes and rate adjustments.

CRITICAL RULES:
1. Only extract explicitly stated information - never make assumptions
2. If a value isn't clearly stated, leave it null/undefined
3. Be extremely precise with numbers and measurements
4. Distinguish between different types of measurements (linear feet vs square feet)
5. Detect separate wall and ceiling labor rates when specified
6. Identify product changes (brand switches, product upgrades, cost adjustments)
7. Parse rate adjustments for specific surface types

SPECIAL DETECTION PATTERNS:
- Wall rates: "walls at $1.50", "wall painting $1.50/sqft", "$1.50 for walls"
- Ceiling rates: "ceilings at $1.25", "ceiling rate $1.25", "$1.25 for ceilings"
- Product changes: "switch to Sherwin Williams", "use Benjamin Moore instead", "change wall paint to ProClassic"
- Rate adjustments: "increase door rate to $175", "trim should be $2.00", "priming at $0.50"

Extract information from this input into the specified JSON structure:

INPUT: "${input}"

ENHANCED JSON format with separate wall/ceiling rates:
{
  "customer_name": string | null,
  "property_address": string | null,
  "ceiling_included": boolean,
  "doors_included": boolean, 
  "trim_included": boolean,
  "windows_included": boolean,
  "primer_included": boolean,
  "linear_feet": number | null,
  "wall_height_ft": number | null,
  "walls_sqft": number | null,
  "ceilings_sqft": number | null,
  "trim_sqft": number | null,
  "doors_count": number | null,
  "windows_count": number | null,
  "paint_brand": string | null,
  "paint_product": string | null,
  "paint_sheen": string | null,
  "spread_rate_sqft_per_gallon": number | null,
  "paint_cost_per_gallon": number | null,
  "primer_cost_per_sqft": number | null,
  "wall_labor_rate": number | null,
  "ceiling_labor_rate": number | null,
  "labor_cost_per_sqft": number | null,
  "markup_percent": number | null,
  "product_changes": {
    "walls": {"brand": string | null, "product": string | null, "cost": number | null},
    "ceilings": {"brand": string | null, "product": string | null, "cost": number | null},
    "trim": {"brand": string | null, "product": string | null, "cost": number | null}
  } | null,
  "rate_adjustments": {
    "wall_rate": number | null,
    "ceiling_rate": number | null,
    "trim_rate": number | null,
    "door_rate": number | null,
    "window_rate": number | null,
    "priming_rate": number | null
  } | null,
  "project_type": "interior" | "exterior" | "both",
  "project_scope_notes": string
}

Return ONLY the raw JSON object. Do not include markdown formatting, code fences, or any explanation. Response must start with { and end with }`;

    const response = await this.callLLM('anthropic/claude-3.5-sonnet', prompt);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse LLM response as JSON:', response);
      console.error('Parse error:', error);
      throw new Error(`Invalid JSON response from LLM: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async validateExtraction(originalInput: string, extracted: ParsedQuoteData): Promise<ParsedQuoteData> {
    const prompt = `You are validating extracted data for accuracy and consistency.

ORIGINAL INPUT: "${originalInput}"

EXTRACTED DATA: ${JSON.stringify(extracted, null, 2)}

Your tasks:
1. Check if extracted values match what was actually stated
2. Identify any assumptions or interpretations
3. Flag inconsistencies or errors
4. Return corrected JSON with same structure

Return ONLY the raw corrected JSON object. Do not include markdown formatting, code fences, or any explanation. Response must start with { and end with }`;

    const response = await this.callLLM('openai/gpt-4o', prompt);
    
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse validation response as JSON:', response);
      console.error('Parse error:', error);
      // Return original extraction if validation fails
      return extracted;
    }
  }

  private enrichWithCalculations(data: ParsedQuoteData): ParsedQuoteData {
    const enriched = { ...data };

    // Calculate wall area from linear feet + height
    if (data.linear_feet && data.wall_height_ft && !data.walls_sqft) {
      enriched.calculated_wall_area_sqft = data.linear_feet * data.wall_height_ft;
      enriched.walls_sqft = enriched.calculated_wall_area_sqft;
    }

    return enriched;
  }

  private assessQuality(data: ParsedQuoteData): ParsedQuoteData {
    const enriched = { ...data };
    
    // Calculate confidence score
    const totalFields = 20; // Approximate important fields
    const filledFields = Object.values(data).filter(v => v !== null && v !== undefined).length;
    enriched.confidence_score = Math.round((filledFields / totalFields) * 100);

    // Identify missing critical fields
    const criticalFields = [
      { key: 'customer_name', label: 'Customer name' },
      { key: 'property_address', label: 'Property address' },
      { key: 'walls_sqft', label: 'Wall square footage' },
      { key: 'labor_cost_per_sqft', label: 'Labor cost per square foot' }
    ];

    enriched.missing_fields = criticalFields
      .filter(field => !data[field.key as keyof ParsedQuoteData])
      .map(field => field.label);

    // Track assumptions made
    enriched.assumptions_made = [];
    if (enriched.calculated_wall_area_sqft) {
      enriched.assumptions_made.push(`Calculated wall area: ${enriched.calculated_wall_area_sqft} sqft from ${data.linear_feet} linear feet × ${data.wall_height_ft} ft height`);
    }

    return enriched;
  }

  private generateClarificationQuestions(data: ParsedQuoteData): string[] {
    const questions: string[] = [];

    if (!data.customer_name) questions.push("What is the customer's name?");
    if (!data.property_address) questions.push("What is the property address?");
    if (!data.walls_sqft && !data.linear_feet) questions.push("What are the wall measurements (square feet or linear feet)?");
    if (!data.labor_cost_per_sqft) questions.push("What is your labor rate per square foot?");
    if (!data.paint_cost_per_gallon) questions.push("What is the cost per gallon of paint?");

    return questions;
  }

  private async callLLM(model: string, prompt: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL || 'https://painttest2.vercel.app',
        'X-Title': 'Painting Quote Parser'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1 // Low temperature for precision
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`LLM API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected API response:', data);
      throw new Error('Invalid response from LLM API');
    }
    
    let content = data.choices[0].message.content;
    
    // Strip markdown code fences if present
    content = content.trim();
    if (content.startsWith('```')) {
      // Remove opening fence with optional language identifier
      content = content.replace(/^```[a-zA-Z]*\n?/, '');
      // Remove closing fence
      content = content.replace(/\n?```$/, '');
      content = content.trim();
    }
    
    return content;
  }

  private getEmptyQuoteData(): ParsedQuoteData {
    return {
      customer_name: '',
      property_address: '',
      ceiling_included: false,
      doors_included: false,
      trim_included: false,
      windows_included: false,
      primer_included: false,
      project_type: 'interior',
      project_scope_notes: '',
      confidence_score: 0,
      missing_fields: [],
      assumptions_made: []
    };
  }

  private mockParse(input: string): ParsingResult {
    // Simple regex-based parsing for testing without API key
    const data: ParsedQuoteData = this.getEmptyQuoteData();
    
    // Extract customer name
    const nameMatch = input.match(/(?:for|customer:|name:)\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
    if (nameMatch) data.customer_name = nameMatch[1];
    
    // Extract address
    const addressMatch = input.match(/(?:at|address:)\s*(\d+\s+[^,.]+(?:Street|St|Avenue|Ave|Drive|Dr|Road|Rd|Lane|Ln|Boulevard|Blvd)[^,]*)/i);
    if (addressMatch) data.property_address = addressMatch[1];
    
    // Extract square footage
    const sqftMatch = input.match(/(\d+(?:,\d{3})*)\s*(?:sqft|sq\.?\s*ft|square\s*feet)/i);
    if (sqftMatch) data.walls_sqft = parseInt(sqftMatch[1].replace(/,/g, ''));
    
    // Extract linear feet and height
    const linearMatch = input.match(/(\d+)\s*(?:linear|lin\.?)\s*(?:feet|ft)/i);
    if (linearMatch) data.linear_feet = parseInt(linearMatch[1]);
    
    const heightMatch = input.match(/(\d+)\s*(?:feet|ft|')\s*(?:tall|high|height|ceilings?)/i);
    if (heightMatch) data.wall_height_ft = parseInt(heightMatch[1]);
    
    // Extract paint cost
    const paintCostMatch = input.match(/\$(\d+(?:\.\d{2})?)\s*(?:per|a|\/)\s*gal/i);
    if (paintCostMatch) data.paint_cost_per_gallon = parseFloat(paintCostMatch[1]);
    
    // Extract separate wall and ceiling labor rates
    const wallRateMatch = input.match(/(?:walls?|wall\s+(?:painting|labor)).*?\$(\d+(?:\.\d{2})?)\s*(?:per|\/)?\s*(?:sqft|sq\.?\s*ft)?/i);
    if (wallRateMatch) data.wall_labor_rate = parseFloat(wallRateMatch[1]);
    
    const ceilingRateMatch = input.match(/(?:ceilings?|ceiling\s+(?:painting|labor)).*?\$(\d+(?:\.\d{2})?)\s*(?:per|\/)?\s*(?:sqft|sq\.?\s*ft)?/i);
    if (ceilingRateMatch) data.ceiling_labor_rate = parseFloat(ceilingRateMatch[1]);
    
    // Extract general labor cost (fallback)
    const laborMatch = input.match(/(?:labor|labour).*?\$(\d+(?:\.\d{2})?)\s*(?:per|\/)\s*(?:sqft|sq\.?\s*ft)/i);
    if (laborMatch) data.labor_cost_per_sqft = parseFloat(laborMatch[1]);
    
    // Extract primer cost
    const primerCostMatch = input.match(/primer.*?\$(\d+(?:\.\d{2})?)\s*(?:per|\/)\s*(?:sqft|sq\.?\s*ft|square\s*foot)/i);
    if (primerCostMatch) data.primer_cost_per_sqft = parseFloat(primerCostMatch[1]);
    
    // Extract markup
    const markupMatch = input.match(/(\d+)\s*%\s*markup/i);
    if (markupMatch) data.markup_percent = parseInt(markupMatch[1]);
    
    // Check inclusions
    data.ceiling_included = /(?:including|include|with)\s*ceiling/i.test(input) || 
                           !/(?:not|no|excluding|exclude|without)\s*(?:painting\s*)?ceiling/i.test(input);
    data.primer_included = /primer\s*(?:is\s*)?(?:required|needed|included)/i.test(input);
    data.doors_included = /(?:including|include|with)\s*doors?/i.test(input);
    data.trim_included = /(?:including|include|with)\s*trim/i.test(input);
    data.windows_included = /(?:including|include|with)\s*windows?/i.test(input);
    
    // Project type
    if (/exterior/i.test(input)) data.project_type = 'exterior';
    else if (/both|interior\s*and\s*exterior/i.test(input)) data.project_type = 'both';
    
    // Extract paint brand
    const brandMatch = input.match(/(?:sherwin\s*williams?|benjamin\s*moore?|behr|kilz|zinsser)/i);
    if (brandMatch) data.paint_brand = brandMatch[0];
    
    // Enhanced: Detect product changes
    const productChangePatterns = [
      /(?:switch|change|use).*?(?:to|instead).*?(sherwin\s*williams?|benjamin\s*moore?|behr|kilz|zinsser)/i,
      /(?:wall\s+paint).*?(?:to|instead).*?([a-z]+\s*[a-z]*)/i,
      /(?:ceiling\s+paint).*?(?:to|instead).*?([a-z]+\s*[a-z]*)/i
    ];
    
    for (const pattern of productChangePatterns) {
      const match = input.match(pattern);
      if (match) {
        if (!data.product_changes) data.product_changes = {};
        if (/wall/i.test(input)) {
          data.product_changes.walls = { brand: match[1], product: null, cost: null };
        } else if (/ceiling/i.test(input)) {
          data.product_changes.ceilings = { brand: match[1], product: null, cost: null };
        }
      }
    }
    
    // Enhanced: Detect rate adjustments
    const rateAdjustmentPatterns = [
      { pattern: /(?:wall\s+rate|walls?).*?\$(\d+(?:\.\d{2})?)/i, type: 'wall_rate' },
      { pattern: /(?:ceiling\s+rate|ceilings?).*?\$(\d+(?:\.\d{2})?)/i, type: 'ceiling_rate' },
      { pattern: /(?:trim\s+rate|trim).*?\$(\d+(?:\.\d{2})?)/i, type: 'trim_rate' },
      { pattern: /(?:door\s+rate|doors?).*?\$(\d+(?:\.\d{2})?)/i, type: 'door_rate' },
      { pattern: /(?:window\s+rate|windows?).*?\$(\d+(?:\.\d{2})?)/i, type: 'window_rate' },
      { pattern: /(?:prim(?:ing|er)\s+rate|prim(?:ing|er)).*?\$(\d+(?:\.\d{2})?)/i, type: 'priming_rate' }
    ];
    
    for (const { pattern, type } of rateAdjustmentPatterns) {
      const match = input.match(pattern);
      if (match) {
        if (!data.rate_adjustments) data.rate_adjustments = {};
        (data.rate_adjustments as any)[type] = parseFloat(match[1]);
      }
    }
    
    // Calculate derived fields
    const enriched = this.enrichWithCalculations(data);
    const final = this.assessQuality(enriched);
    
    return {
      success: true,
      data: final,
      errors: [],
      warnings: ['Using mock parser - results may be less accurate than with OpenRouter API'],
      needs_clarification: final.missing_fields.length > 0,
      clarification_questions: this.generateClarificationQuestions(final)
    };
  }
}

// Modular Quote Calculator
export class ModularQuoteCalculator {
  calculateQuote(data: ParsedQuoteData): {
    paint_gallons_needed: number;
    materials_cost: number;
    primer_cost: number;
    labor_cost: number;
    subtotal: number;
    markup_amount: number;
    final_quote: number;
    breakdown: any;
  } {
    const wallArea = data.walls_sqft || data.calculated_wall_area_sqft || 0;
    const ceilingArea = data.ceiling_included ? (data.ceilings_sqft || 0) : 0;
    const trimArea = data.trim_included ? (data.trim_sqft || 0) : 0;
    
    const totalPaintableArea = wallArea + ceilingArea + trimArea;
    
    // Calculate paint needed
    const spreadRate = data.spread_rate_sqft_per_gallon || 350;
    const paintGallons = Math.ceil(totalPaintableArea / spreadRate);
    
    // Calculate materials cost only
    const materialsCost = paintGallons * (data.paint_cost_per_gallon || 50);
    const primerCost = data.primer_included ? 
      (totalPaintableArea * (data.primer_cost_per_sqft || 0.45)) : 0;
    
    // Total materials (paint + primer)
    const totalMaterialsCost = materialsCost + primerCost;
    
    // NEW CALCULATION MODEL: Labor = 30% of Total
    // If Labor = 30% of Total, then:
    // Total = Materials + Labor
    // Labor = 0.30 × Total
    // Total = Materials + (0.30 × Total)
    // Total - (0.30 × Total) = Materials
    // 0.70 × Total = Materials
    // Total = Materials ÷ 0.70
    
    const laborPercentage = 0.30; // 30% of total
    const subtotalWithLabor = totalMaterialsCost / (1 - laborPercentage);
    const laborCost = subtotalWithLabor * laborPercentage;
    
    // Apply markup to the subtotal (materials + labor)
    const markupAmount = subtotalWithLabor * ((data.markup_percent || 0) / 100);
    const finalQuote = subtotalWithLabor + markupAmount;

    return {
      paint_gallons_needed: paintGallons,
      materials_cost: materialsCost,
      primer_cost: primerCost,
      labor_cost: laborCost,
      subtotal: subtotalWithLabor,
      markup_amount: markupAmount,
      final_quote: finalQuote,
      breakdown: {
        wall_area: wallArea,
        ceiling_area: ceilingArea,
        trim_area: trimArea,
        total_paintable_area: totalPaintableArea,
        paint_cost_per_gallon: data.paint_cost_per_gallon || 50,
        primer_cost_per_sqft: data.primer_cost_per_sqft || 0.45,
        primer_included: data.primer_included,
        // NEW: Labor as percentage model
        labor_percentage: laborPercentage * 100, // 30%
        total_materials_cost: totalMaterialsCost,
        labor_calculation_method: "30% of subtotal",
        markup_percent: data.markup_percent || 0,
        // Product and rate changes detected
        product_changes: data.product_changes || null,
        rate_adjustments: data.rate_adjustments || null
      }
    };
  }
}

// Test Case Generator
export function generateTestCases(): Array<{input: string, expectedFields: string[]}> {
  return [
    {
      input: "It's for Cici at 9090 Hillside Drive. We are not painting the ceilings. The project is a 500 linear feet of interior painting. $50 a gallon bucket eggshell shirwin williams. spread rate is 350 square feet ceilings are 9 feet tall. We are not painting doors, or trim or windows. No primer. labour is included in the cost per square foot at $1.50. add 20% markup.",
      expectedFields: ['customer_name: Cici', 'property_address: 9090 Hillside Drive', 'linear_feet: 500', 'wall_height_ft: 9', 'ceiling_included: false', 'labor_cost_per_sqft: 1.50', 'markup_percent: 20']
    },
    {
      input: "John Smith, 123 Main Street. Interior only. 1200 sqft walls, 800 sqft ceilings. Benjamin Moore paint at $45/gallon. $2.00 per square foot labor. 15% markup.",
      expectedFields: ['customer_name: John Smith', 'walls_sqft: 1200', 'ceilings_sqft: 800', 'paint_brand: Benjamin Moore', 'labor_cost_per_sqft: 2.00']
    },
    {
      input: "Need quote for exterior house painting. No specific measurements given yet.",
      expectedFields: ['project_type: exterior', 'missing many fields']
    },
    {
      input: "Sarah at 456 Oak Ave. 2000 sqft total interior. Include trim and doors but not windows. Sherwin Williams ProClassic semi-gloss $55/gal. Labor at $1.75/sqft with 25% markup.",
      expectedFields: ['customer_name: Sarah', 'trim_included: true', 'doors_included: true', 'windows_included: false']
    },
    {
      input: "Commercial office building, 5000 sqft walls, primer required at $0.85/sqft, $3.50/sqft all-in pricing.",
      expectedFields: ['walls_sqft: 5000', 'primer_included: true', 'primer_cost_per_sqft: 0.85', 'labor_cost_per_sqft: 3.50']
    },
    {
      input: "Interior repaint, 1800 sqft, needs primer, labor $2.25/sqft, primer cost $0.70 per square foot, 15% markup.",
      expectedFields: ['walls_sqft: 1800', 'primer_included: true', 'primer_cost_per_sqft: 0.70', 'labor_cost_per_sqft: 2.25', 'markup_percent: 15']
    },
    // Enhanced test cases for new features
    {
      input: "Mike Johnson, 555 Pine St. 1000 sqft walls at $1.60, 400 sqft ceilings at $1.30. Switch to Benjamin Moore for walls. Doors should be $175 each.",
      expectedFields: ['customer_name: Mike Johnson', 'wall_labor_rate: 1.60', 'ceiling_labor_rate: 1.30', 'product_changes.walls.brand: Benjamin Moore', 'rate_adjustments.door_rate: 175']
    },
    {
      input: "Update quote: change wall paint to Sherwin ProClassic, increase trim rate to $2.25, primer at $0.55 per sqft.",
      expectedFields: ['product_changes.walls.product: ProClassic', 'rate_adjustments.trim_rate: 2.25', 'rate_adjustments.priming_rate: 0.55']
    },
    {
      input: "Emma at 789 Oak Drive. 800 sqft walls, 300 sqft ceilings. Wall painting $1.75/sqft, ceiling painting $1.45/sqft. Use Behr Premium Plus for ceilings instead.",
      expectedFields: ['customer_name: Emma', 'wall_labor_rate: 1.75', 'ceiling_labor_rate: 1.45', 'product_changes.ceilings.brand: Behr']
    }
  ];
}

// Enhanced parsing function for chat integration
export async function parseQuoteEnhancements(input: string): Promise<{
  productChanges?: any;
  rateAdjustments?: any;
  hasChanges: boolean;
  confidence: number;
}> {
  const parser = new IntelligentQuoteParser();
  const result = await parser.parseQuoteInput(input);
  
  if (result.success) {
    const hasProductChanges = !!result.data.product_changes;
    const hasRateAdjustments = !!result.data.rate_adjustments;
    
    return {
      productChanges: result.data.product_changes,
      rateAdjustments: result.data.rate_adjustments,
      hasChanges: hasProductChanges || hasRateAdjustments,
      confidence: result.data.confidence_score
    };
  }
  
  return {
    hasChanges: false,
    confidence: 0
  };
}