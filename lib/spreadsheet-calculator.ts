// Exact spreadsheet calculation engine matching provided formulas

export interface ProjectAreas {
  walls_sqft: number;
  ceilings_sqft: number;
  trim_sqft: number;
  doors_count: number;
  windows_count: number;
  priming_sqft: number;  // Square footage requiring primer
}

export interface ChargeRates {
  wall_rate: number;      // Rate for wall painting (2 coats, paint included)
  ceiling_rate: number;   // Rate for ceiling painting (2 coats, paint included)
  priming_rate: number;   // Rate for primer application (1 coat, primer included) - applied to walls + ceilings combined
  trim_rate: number;
  door_rate: number;
  window_rate: number;
}

export interface PaintCosts {
  walls_paint_cost: number;
  ceilings_paint_cost: number;
  trim_paint_cost: number;
}

export interface ContractorDefaults {
  primer: {
    product_name: string;
    spread_rate: number; // sqft per gallon
    cost_per_gallon: number;
  };
  wall_paint: {
    product_name: string;
    spread_rate: number;
    cost_per_gallon: number;
  };
  ceiling_paint: {
    product_name: string;
    spread_rate: number;
    cost_per_gallon: number;
  };
  trim_paint: {
    product_name: string;
    doors_windows_per_gallon: number; // doors OR windows per gallon
    cost_per_gallon: number;
  };
  labor_rates: {
    primer_rate: number;    // per sqft (walls + ceilings combined)
    wall_rate: number;      // per sqft
    ceiling_rate: number;   // per sqft
    door_rate: number;      // per door
    window_rate: number;    // per window
  };
}

export interface MaterialsBreakdown {
  walls: { gallons: number; cost: number };
  ceilings: { gallons: number; cost: number };
  trim: { gallons: number; cost: number };
  total: number;
}

export interface RevenueBreakdown {
  walls: number;       // Wall painting revenue
  ceilings: number;    // Ceiling painting revenue
  priming: number;     // Primer application (walls + ceilings combined)
  trim: number;
  doors: number;
  windows: number;
  total: number;
}

export interface LaborCalculation {
  revenue_after_materials: number;
  projected_labor: number;
  labor_percentage: number;
}

export interface QuoteCalculation {
  revenue: RevenueBreakdown;
  materials: MaterialsBreakdown;
  labor: LaborCalculation;
  profit: number;
}

// Revenue Calculation: SQFT × Charge Rate = Total Price
export const calculateRevenue = (areas: ProjectAreas, rates: ChargeRates): RevenueBreakdown => {
  // Separate wall and ceiling painting revenue
  const wallsRevenue = areas.walls_sqft * rates.wall_rate; // e.g., 1200 × $1.50 = $1,800
  const ceilingsRevenue = areas.ceilings_sqft * rates.ceiling_rate; // e.g., 400 × $1.25 = $500
  
  // Primer revenue (walls + ceilings combined when primer is needed)
  const primingRevenue = areas.priming_sqft * rates.priming_rate; // e.g., 1600 × $0.45 = $720
  
  const trimRevenue = areas.trim_sqft * rates.trim_rate; // e.g., 520 × $1.92 = $1,000
  const doorsRevenue = areas.doors_count * rates.door_rate; // e.g., 6 × $150.00 = $900
  const windowsRevenue = areas.windows_count * rates.window_rate; // e.g., 8 × $100.00 = $800
  
  return {
    walls: wallsRevenue,
    ceilings: ceilingsRevenue,
    priming: primingRevenue,
    trim: trimRevenue,
    doors: doorsRevenue,
    windows: windowsRevenue,
    total: wallsRevenue + ceilingsRevenue + primingRevenue + trimRevenue + doorsRevenue + windowsRevenue
  };
};

// Materials Calculation: SQFT ÷ Coverage × Paint Cost = Materials Cost
export const calculateMaterials = (areas: ProjectAreas, paintCosts: PaintCosts, coverage: number = 350): MaterialsBreakdown => {
  // Round up to nearest whole gallon
  const wallsGallons = Math.ceil(areas.walls_sqft / coverage);
  const ceilingsGallons = Math.ceil(areas.ceilings_sqft / coverage);
  const trimGallons = Math.ceil(areas.trim_sqft / coverage);
  
  const wallsMaterialCost = wallsGallons * paintCosts.walls_paint_cost; // e.g., 3 × $26 = $78
  const ceilingsMaterialCost = ceilingsGallons * paintCosts.ceilings_paint_cost; // e.g., 3 × $25 = $75
  const trimMaterialCost = trimGallons * paintCosts.trim_paint_cost; // e.g., 1 × $35 = $35
  
  return {
    walls: { gallons: wallsGallons, cost: wallsMaterialCost },
    ceilings: { gallons: ceilingsGallons, cost: ceilingsMaterialCost },
    trim: { gallons: trimGallons, cost: trimMaterialCost },
    total: wallsMaterialCost + ceilingsMaterialCost + trimMaterialCost
  };
};

// Enhanced Materials Calculation with Product-Specific Spread Rates and 2-Coat Logic
export const calculateMaterialsEnhanced = (areas: ProjectAreas, contractorDefaults: ContractorDefaults): {
  primer: { gallons: number; cost: number; product: string };
  walls: { gallons: number; cost: number; product: string };
  ceilings: { gallons: number; cost: number; product: string };
  trim: { gallons: number; cost: number; product: string };
  total_cost: number;
} => {
  // Primer calculation (1 coat on walls + ceilings combined)
  const primerGallons = Math.ceil(areas.priming_sqft / contractorDefaults.primer.spread_rate);
  const primerCost = primerGallons * contractorDefaults.primer.cost_per_gallon;
  
  // Wall painting (2 coats) - multiply by 1.8 for coverage
  const wallsGallons = Math.ceil((areas.walls_sqft / contractorDefaults.wall_paint.spread_rate) * 1.8);
  const wallsCost = wallsGallons * contractorDefaults.wall_paint.cost_per_gallon;
  
  // Ceiling painting (2 coats) - multiply by 1.8 for coverage
  const ceilingsGallons = Math.ceil((areas.ceilings_sqft / contractorDefaults.ceiling_paint.spread_rate) * 1.8);
  const ceilingsCost = ceilingsGallons * contractorDefaults.ceiling_paint.cost_per_gallon;
  
  // Trim calculation based on doors + windows count
  const trimGallons = Math.ceil((areas.doors_count + areas.windows_count) / contractorDefaults.trim_paint.doors_windows_per_gallon);
  const trimCost = trimGallons * contractorDefaults.trim_paint.cost_per_gallon;
  
  return {
    primer: { 
      gallons: primerGallons, 
      cost: primerCost, 
      product: contractorDefaults.primer.product_name 
    },
    walls: { 
      gallons: wallsGallons, 
      cost: wallsCost, 
      product: contractorDefaults.wall_paint.product_name 
    },
    ceilings: { 
      gallons: ceilingsGallons, 
      cost: ceilingsCost, 
      product: contractorDefaults.ceiling_paint.product_name 
    },
    trim: { 
      gallons: trimGallons, 
      cost: trimCost, 
      product: contractorDefaults.trim_paint.product_name 
    },
    total_cost: primerCost + wallsCost + ceilingsCost + trimCost
  };
};

// Labor Calculation: (Revenue - Materials) × Labor Percentage
export const calculateLabor = (revenue: number, materials: number, laborPercent: number = 30): LaborCalculation => {
  const revenueAfterMaterials = revenue - materials;
  const projectedLabor = revenueAfterMaterials * (laborPercent / 100);
  
  return {
    revenue_after_materials: revenueAfterMaterials,
    projected_labor: projectedLabor,
    labor_percentage: laborPercent
  };
};

// Final Profit Calculation: Revenue - Materials - Labor = Profit
export const calculateProfit = (revenue: number, materials: number, labor: number): number => {
  return revenue - materials - labor;
};

// Complete quote calculation matching spreadsheet exactly
export const calculateQuote = (
  areas: ProjectAreas, 
  rates: ChargeRates, 
  paintCosts: PaintCosts, 
  laborPercent: number = 30,
  coverage: number = 350
): QuoteCalculation => {
  // Step 1: Calculate revenue (SQFT × Rate)
  const revenue = calculateRevenue(areas, rates);
  
  // Step 2: Calculate materials (Gallons × Paint Cost)
  const materials = calculateMaterials(areas, paintCosts, coverage);
  
  // Step 3: Calculate labor ((Revenue - Materials) × Labor %)
  const labor = calculateLabor(revenue.total, materials.total, laborPercent);
  
  // Step 4: Calculate final profit
  const profit = calculateProfit(revenue.total, materials.total, labor.projected_labor);
  
  return {
    revenue,
    materials,
    labor,
    profit
  };
};

// Helper functions for natural language parsing
export const parseCustomerInfo = (input: string): { customer_name: string; address: string } => {
  // Enhanced parsing for real contractor language
  const patterns = [
    // "The project is for Cici at 9090 Hillside Drive"
    /(?:project\s+is\s+)?for\s+(\w+)\s+at\s+(.+?)(?:\.|$)/i,
    // "It's for Cici at 9090 Hillside Drive"
    /it's\s+for\s+(\w+)\s+at\s+(.+?)(?:\.|$)/i,
    // "Cici, 123 Main St" or "John Smith, 123 Main St"
    /^([^,]+),\s*(.+)$/,
    // "John Smith and address is 123 Main St" 
    /^(.+?)\s+(?:and\s+)?(?:address\s+is\s+|at\s+)(.+)$/i,
    // "Customer: John Smith Address: 123 Main St"
    /customer:?\s*(.+?)\s+address:?\s*(.+)/i,
    // Just name - will ask for address next
    /^(.+)$/
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      const name = match[1]?.trim() || '';
      const address = match[2]?.trim() || '';
      
      // Clean up common prefixes from extracted text
      const cleanName = name.replace(/^(the\s+project\s+is\s+|customer\s+is\s+|this\s+is\s+)/i, '').trim();
      
      return {
        customer_name: cleanName || input.trim(),
        address: address
      };
    }
  }
  
  return { customer_name: input.trim(), address: '' };
};

export const parseProjectType = (input: string): string => {
  const lower = input.toLowerCase();
  if (lower.includes('interior')) return 'interior';
  if (lower.includes('exterior')) return 'exterior';
  if (lower.includes('both')) return 'both';
  return 'interior'; // default
};

export const parseAreas = (input: string, projectType: string = 'interior'): ProjectAreas => {
  // Enhanced parsing for real contractor language including linear feet
  const wallsMatch = input.match(/(\d+)\s*(?:sqft\s+)?(?:walls?|wall)/i);
  const ceilingsMatch = input.match(/(\d+)\s*(?:sqft\s+)?(?:ceilings?|ceiling)/i);
  const trimMatch = input.match(/(\d+)\s*(?:sqft\s+)?(?:trim|doors?|door|windows?)/i);
  
  // Parse doors and windows count
  const doorsMatch = input.match(/(\d+)\s*doors?/i);
  const windowsMatch = input.match(/(\d+)\s*windows?/i);
  
  // Parse linear feet with height conversion: "500 linear feet... 9 feet tall"
  const linearFeetMatch = input.match(/(\d+)\s*linear\s*feet?/i);
  const heightMatch = input.match(/(\d+)\s*feet?\s*tall|ceilings?\s+are\s+(\d+)\s*feet?|height\s+(?:is\s+)?(\d+)/i);
  
  let wallsSqft = 0;
  let ceilingsSqft = 0;
  let trimSqft = 0;
  let doorsCount = 0;
  let windowsCount = 0;
  
  // Handle linear feet conversion
  if (linearFeetMatch && heightMatch) {
    const linearFeet = parseInt(linearFeetMatch[1]);
    const height = parseInt(heightMatch[1] || heightMatch[2] || heightMatch[3]);
    wallsSqft = linearFeet * height;
    console.log(`Linear feet conversion: ${linearFeet} LF × ${height} ft = ${wallsSqft} sq ft`);
  }
  
  // Override with specific measurements if provided
  if (wallsMatch) wallsSqft = parseInt(wallsMatch[1]);
  if (ceilingsMatch) ceilingsSqft = parseInt(ceilingsMatch[1]);
  if (trimMatch) trimSqft = parseInt(trimMatch[1]);
  if (doorsMatch) doorsCount = parseInt(doorsMatch[1]);
  if (windowsMatch) windowsCount = parseInt(windowsMatch[1]);
  
  // Check for explicit exclusions
  const excludeCeilings = /not\s+painting\s+(?:the\s+)?ceilings?|no\s+ceilings?/i.test(input);
  const excludeTrim = /not\s+painting\s+(?:doors?|trim|windows?)|no\s+(?:doors?|trim|windows?)/i.test(input);
  const excludeWalls = /not\s+painting\s+(?:the\s+)?walls?|no\s+walls?/i.test(input);
  
  if (excludeCeilings) ceilingsSqft = 0;
  if (excludeTrim) trimSqft = 0;
  if (excludeWalls) wallsSqft = 0;
  
  // Special case: "We are only doing walls"
  if (/only\s+(?:doing\s+)?walls?/i.test(input)) {
    ceilingsSqft = 0;
    trimSqft = 0;
  }
  
  // If no specific breakdown and no linear feet, try to parse total sqft and estimate
  if (!wallsMatch && !ceilingsMatch && !trimMatch && !linearFeetMatch) {
    const totalMatch = input.match(/(\d+)\s*(?:sqft|square\s*feet?)/i);
    if (totalMatch) {
      const total = parseInt(totalMatch[1]);
      if (projectType === 'interior') {
        // Interior estimate: walls and ceilings roughly equal, trim 30% of walls
        return {
          walls_sqft: Math.round(total * 0.6),
          ceilings_sqft: excludeCeilings ? 0 : Math.round(total * 0.6), 
          trim_sqft: excludeTrim ? 0 : Math.round(total * 0.3),
          doors_count: doorsCount,
          windows_count: windowsCount,
          priming_sqft: 0
        };
      } else {
        // Exterior: mostly walls, no ceilings, some trim
        return {
          walls_sqft: Math.round(total * 0.8),
          ceilings_sqft: 0,
          trim_sqft: excludeTrim ? 0 : Math.round(total * 0.2),
          doors_count: doorsCount,
          windows_count: windowsCount,
          priming_sqft: 0
        };
      }
    }
  }

  return {
    walls_sqft: wallsSqft,
    ceilings_sqft: ceilingsSqft,
    trim_sqft: trimSqft,
    doors_count: doorsCount,
    windows_count: windowsCount,
    priming_sqft: 0  // Default to 0, can be set during conversation if priming needed
  };
};

// Parse adjustment requests like "change walls to $3.50" or "use 25% labor"
export const parseAdjustments = (input: string): Partial<{
  rates: Partial<ChargeRates>;
  paintCosts: Partial<PaintCosts>;
  laborPercent: number;
  areas: Partial<ProjectAreas>;
}> => {
  const adjustments: any = {};
  const lower = input.toLowerCase();

  // Rate adjustments - separate wall and ceiling rates
  const wallRateMatch = input.match(/walls?\s+(?:to\s+|at\s+)?\$?(\d+\.?\d*)/i);
  if (wallRateMatch) {
    const rate = parseFloat(wallRateMatch[1]);
    adjustments.rates = { ...adjustments.rates, wall_rate: rate };
  }

  const ceilingRateMatch = input.match(/ceilings?\s+(?:to\s+|at\s+)?\$?(\d+\.?\d*)/i);
  if (ceilingRateMatch) {
    const rate = parseFloat(ceilingRateMatch[1]);
    adjustments.rates = { ...adjustments.rates, ceiling_rate: rate };
  }

  const primingRateMatch = input.match(/prim(?:ing|er)\s+(?:to\s+|at\s+)?\$?(\d+\.?\d*)/i);
  if (primingRateMatch) {
    adjustments.rates = { ...adjustments.rates, priming_rate: parseFloat(primingRateMatch[1]) };
  }

  const trimRateMatch = input.match(/trim\s+(?:to\s+|at\s+)?\$?(\d+\.?\d*)/i);
  if (trimRateMatch) {
    adjustments.rates = { ...adjustments.rates, trim_rate: parseFloat(trimRateMatch[1]) };
  }

  // Labor percentage adjustments
  const laborMatch = input.match(/(\d+)%?\s*labor/i);
  if (laborMatch) {
    adjustments.laborPercent = parseInt(laborMatch[1]);
  }

  // Area adjustments
  const newWallsMatch = input.match(/(\d+)\s+(?:sqft\s+)?walls?/i);
  if (newWallsMatch) {
    adjustments.areas = { ...adjustments.areas, walls_sqft: parseInt(newWallsMatch[1]) };
  }

  return adjustments;
};

// Parse custom rates and pricing from contractor input
export const parseCustomPricing = (input: string): {
  customRate?: number;
  customMarkup?: number;
  customPaintCost?: number;
  laborIncluded?: boolean;
  coverage?: number;
} => {
  const result: any = {};
  
  // Parse custom rate per square foot: "$1.50 per square foot", "$2.00/sqft", "at $1.50"
  const rateMatch = input.match(/\$?([\d.]+)\s*(?:per\s*)?(?:sq\s*ft|square\s*foot|\/sqft)/i);
  if (rateMatch) {
    result.customRate = parseFloat(rateMatch[1]);
  }
  
  // Parse markup percentage: "20% markup", "add 20%", "25 percent markup"
  const markupMatch = input.match(/(?:add\s+)?(\d+)%?\s*(?:markup|percent)/i);
  if (markupMatch) {
    result.customMarkup = parseInt(markupMatch[1]);
  }
  
  // Parse paint cost: "$50 a gallon", "$45 per gallon"
  const paintCostMatch = input.match(/\$?([\d.]+)\s*(?:a\s+|per\s+)?gallon/i);
  if (paintCostMatch) {
    result.customPaintCost = parseFloat(paintCostMatch[1]);
  }
  
  // Check if labor is included in the rate
  const laborIncluded = /labor\s+(?:is\s+)?included/i.test(input);
  if (laborIncluded) {
    result.laborIncluded = true;
  }
  
  // Parse coverage: "350 square feet" spread rate
  const coverageMatch = input.match(/spread\s+rate\s+(?:is\s+)?(\d+)\s*(?:square\s*feet?|sqft)/i);
  if (coverageMatch) {
    result.coverage = parseInt(coverageMatch[1]);
  }
  
  return result;
};

// Format currency consistently
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

// Generate detailed breakdown text
export const generateQuoteDisplay = (
  calc: QuoteCalculation, 
  areas: ProjectAreas, 
  rates: ChargeRates, 
  paintCosts: PaintCosts
): string => {
  const revenueLines = [];
  
  // Separate wall and ceiling painting lines
  if (areas.walls_sqft > 0) {
    revenueLines.push(`- Wall Painting: ${areas.walls_sqft} sqft × ${formatCurrency(rates.wall_rate)}/sqft = ${formatCurrency(calc.revenue.walls)}`);
  }
  if (areas.ceilings_sqft > 0) {
    revenueLines.push(`- Ceiling Painting: ${areas.ceilings_sqft} sqft × ${formatCurrency(rates.ceiling_rate)}/sqft = ${formatCurrency(calc.revenue.ceilings)}`);
  }
  
  if (areas.priming_sqft > 0) {
    revenueLines.push(`- Priming: ${areas.priming_sqft} sqft × ${formatCurrency(rates.priming_rate)}/sqft = ${formatCurrency(calc.revenue.priming)}`);
  }
  if (areas.trim_sqft > 0) {
    revenueLines.push(`- Trim: ${areas.trim_sqft} sqft × ${formatCurrency(rates.trim_rate)}/sqft = ${formatCurrency(calc.revenue.trim)}`);
  }
  if (areas.doors_count > 0) {
    revenueLines.push(`- Doors: ${areas.doors_count} doors × ${formatCurrency(rates.door_rate)}/door = ${formatCurrency(calc.revenue.doors)}`);
  }
  if (areas.windows_count > 0) {
    revenueLines.push(`- Windows: ${areas.windows_count} windows × ${formatCurrency(rates.window_rate)}/window = ${formatCurrency(calc.revenue.windows)}`);
  }

  return `Here's your quote calculation:

💰 **REVENUE BREAKDOWN**
${revenueLines.join('\n')}
**Total Revenue: ${formatCurrency(calc.revenue.total)}**

🎨 **MATERIALS**
- Total Materials Cost: ${formatCurrency(calc.materials.total)}

👷 **LABOR ESTIMATE**
- Projected Labor (${calc.labor.labor_percentage}%): ${formatCurrency(calc.labor.projected_labor)}

📊 **FINAL QUOTE**
**Total Quote: ${formatCurrency(calc.revenue.total)}**
**Projected Profit: ${formatCurrency(calc.profit)}**

Ready to save this quote? Say "save" to finalize, or "breakdown" to see detailed calculations.`;
};

export const generateDetailedBreakdown = (
  calc: QuoteCalculation, 
  areas: ProjectAreas, 
  rates: ChargeRates, 
  paintCosts: PaintCosts
): string => {
  const revenueLines = [];
  
  // Separate wall and ceiling painting lines
  if (areas.walls_sqft > 0) {
    revenueLines.push(`- Wall Painting: ${areas.walls_sqft} sqft × ${formatCurrency(rates.wall_rate)} = ${formatCurrency(calc.revenue.walls)}`);
  }
  if (areas.ceilings_sqft > 0) {
    revenueLines.push(`- Ceiling Painting: ${areas.ceilings_sqft} sqft × ${formatCurrency(rates.ceiling_rate)} = ${formatCurrency(calc.revenue.ceilings)}`);
  }
  
  if (areas.priming_sqft > 0) {
    revenueLines.push(`- Priming: ${areas.priming_sqft} sqft × ${formatCurrency(rates.priming_rate)} = ${formatCurrency(calc.revenue.priming)}`);
  }
  if (areas.trim_sqft > 0) {
    revenueLines.push(`- Trim: ${areas.trim_sqft} sqft × ${formatCurrency(rates.trim_rate)} = ${formatCurrency(calc.revenue.trim)}`);
  }
  if (areas.doors_count > 0) {
    revenueLines.push(`- Doors: ${areas.doors_count} doors × ${formatCurrency(rates.door_rate)} = ${formatCurrency(calc.revenue.doors)}`);
  }
  if (areas.windows_count > 0) {
    revenueLines.push(`- Windows: ${areas.windows_count} windows × ${formatCurrency(rates.window_rate)} = ${formatCurrency(calc.revenue.windows)}`);
  }

  return `📋 **DETAILED BREAKDOWN**

**REVENUE CALCULATION:**
${revenueLines.join('\n')}
**Sum: ${formatCurrency(calc.revenue.total)}**

**MATERIALS COST:**
- Walls: ${calc.materials.walls.gallons} gallons × ${formatCurrency(paintCosts.walls_paint_cost)} = ${formatCurrency(calc.materials.walls.cost)}
- Ceilings: ${calc.materials.ceilings.gallons} gallons × ${formatCurrency(paintCosts.ceilings_paint_cost)} = ${formatCurrency(calc.materials.ceilings.cost)}
- Trim: ${calc.materials.trim.gallons} gallons × ${formatCurrency(paintCosts.trim_paint_cost)} = ${formatCurrency(calc.materials.trim.cost)}
**Materials Total: ${formatCurrency(calc.materials.total)}**

**LABOR CALCULATION:**
- Revenue after materials: ${formatCurrency(calc.labor.revenue_after_materials)}
- Labor (${calc.labor.labor_percentage}%): ${formatCurrency(calc.labor.projected_labor)}

**PROFIT:**
- Revenue: ${formatCurrency(calc.revenue.total)}
- Materials: -${formatCurrency(calc.materials.total)}
- Labor: -${formatCurrency(calc.labor.projected_labor)}
**Projected Profit: ${formatCurrency(calc.profit)}**

This calculation uses your current company rates. Want to adjust anything?`;
};

// Generate rate confirmation message
export const generateRateConfirmation = (rates: ChargeRates, areas: ProjectAreas): string => {
  const ratesDisplay = [];
  
  // Separate wall and ceiling rates
  if (areas.walls_sqft > 0) {
    ratesDisplay.push(`• **Wall Painting**: ${formatCurrency(rates.wall_rate)}/sq ft (2 coats, paint included)`);
  }
  if (areas.ceilings_sqft > 0) {
    ratesDisplay.push(`• **Ceiling Painting**: ${formatCurrency(rates.ceiling_rate)}/sq ft (2 coats, paint included)`);
  }
  
  if (areas.priming_sqft > 0) {
    ratesDisplay.push(`• **Priming**: ${formatCurrency(rates.priming_rate)}/sq ft (primer included)`);
  }
  if (areas.trim_sqft > 0) {
    ratesDisplay.push(`• **Trim**: ${formatCurrency(rates.trim_rate)}/sq ft`);
  }
  if (areas.doors_count > 0) {
    ratesDisplay.push(`• **Doors**: ${formatCurrency(rates.door_rate)} each`);
  }
  if (areas.windows_count > 0) {
    ratesDisplay.push(`• **Windows**: ${formatCurrency(rates.window_rate)} each`);
  }

  return `Perfect! I have your measurements. Here are the rates that we have for each category:\n\n${ratesDisplay.join('\n')}\n\nAre there any rates here that you would like to change for this project? If not, just say "looks good" or "calculate" to proceed.`;
};

// Parse rate adjustments from user input
export const parseRateAdjustments = (input: string): { hasChanges: boolean; rates: Partial<ChargeRates>; needsRateInput?: boolean; rateType?: string } => {
  const lowerInput = input.toLowerCase();
  
  // Check for confirmation to proceed without changes
  if (lowerInput.includes('looks good') || lowerInput.includes('calculate') || 
      lowerInput.includes('proceed') || lowerInput.includes('no changes') ||
      lowerInput.includes('sounds good') || lowerInput.includes('that works')) {
    return { hasChanges: false, rates: {} };
  }

  // Check for rate adjustment questions without specific amounts
  const rateQuestionPatterns = [
    /(?:can\s+we\s+|let'?s\s+|i\s+want\s+to\s+)?(?:update|change|adjust|modify)\s+(?:the\s+)?(?:painting|walls?|ceilings?)\s+rate/i,
    /(?:painting|walls?|ceilings?)\s+(?:rate\s+)?(?:update|change|adjust|modify)/i,
    /(?:can\s+we\s+|let'?s\s+|i\s+want\s+to\s+)?(?:update|change|adjust|modify)\s+(?:the\s+)?rate/i,
    /different\s+(?:painting\s+)?rate/i,
    /new\s+(?:painting\s+)?rate/i
  ];

  for (const pattern of rateQuestionPatterns) {
    if (pattern.test(input)) {
      // Determine which rate type they're asking about
      let rateType = 'painting'; // default
      if (/trim/i.test(input)) rateType = 'trim';
      else if (/priming|primer/i.test(input)) rateType = 'priming';
      else if (/door/i.test(input)) rateType = 'door';
      else if (/window/i.test(input)) rateType = 'window';
      
      return { hasChanges: false, rates: {}, needsRateInput: true, rateType };
    }
  }

  const rates: Partial<ChargeRates> = {};
  let hasChanges = false;

  // Parse wall rate changes: "walls to $2.50", "wall rate to $3.00"
  const wallRateMatch = input.match(/walls?\s+(?:rate\s+)?(?:to\s+|at\s+)?\$?(\d+\.?\d*)/i);
  if (wallRateMatch) {
    rates.wall_rate = parseFloat(wallRateMatch[1]);
    hasChanges = true;
  }

  // Parse ceiling rate changes: "ceilings to $2.50", "ceiling rate to $2.00"
  const ceilingRateMatch = input.match(/ceilings?\s+(?:rate\s+)?(?:to\s+|at\s+)?\$?(\d+\.?\d*)/i);
  if (ceilingRateMatch) {
    rates.ceiling_rate = parseFloat(ceilingRateMatch[1]);
    hasChanges = true;
  }

  // Parse priming rate changes
  const primingRateMatch = input.match(/prim(?:ing|er)\s+(?:to\s+|at\s+)?\$?(\d+\.?\d*)/i);
  if (primingRateMatch) {
    rates.priming_rate = parseFloat(primingRateMatch[1]);
    hasChanges = true;
  }

  // Parse trim rate changes
  const trimRateMatch = input.match(/trim\s+(?:to\s+|at\s+)?\$?(\d+\.?\d*)/i);
  if (trimRateMatch) {
    rates.trim_rate = parseFloat(trimRateMatch[1]);
    hasChanges = true;
  }

  // Parse door rate changes
  const doorRateMatch = input.match(/doors?\s+(?:to\s+|at\s+)?\$?(\d+\.?\d*)/i);
  if (doorRateMatch) {
    rates.door_rate = parseFloat(doorRateMatch[1]);
    hasChanges = true;
  }

  // Parse window rate changes
  const windowRateMatch = input.match(/windows?\s+(?:to\s+|at\s+)?\$?(\d+\.?\d*)/i);
  if (windowRateMatch) {
    rates.window_rate = parseFloat(windowRateMatch[1]);
    hasChanges = true;
  }

  return { hasChanges, rates };
};

// Generate rate display for confirmation
export const generateRateDisplay = (rates: ChargeRates, areas: ProjectAreas): string => {
  const ratesDisplay = [];
  
  // Separate wall and ceiling rates
  if (areas.walls_sqft > 0) {
    ratesDisplay.push(`• Wall Painting: ${formatCurrency(rates.wall_rate)}/sq ft`);
  }
  if (areas.ceilings_sqft > 0) {
    ratesDisplay.push(`• Ceiling Painting: ${formatCurrency(rates.ceiling_rate)}/sq ft`);
  }
  
  if (areas.priming_sqft > 0) {
    ratesDisplay.push(`• Priming: ${formatCurrency(rates.priming_rate)}/sq ft`);
  }
  if (areas.trim_sqft > 0) {
    ratesDisplay.push(`• Trim: ${formatCurrency(rates.trim_rate)}/sq ft`);
  }
  if (areas.doors_count > 0) {
    ratesDisplay.push(`• Doors: ${formatCurrency(rates.door_rate)} each`);
  }
  if (areas.windows_count > 0) {
    ratesDisplay.push(`• Windows: ${formatCurrency(rates.window_rate)} each`);
  }

  return ratesDisplay.join('\n');
};