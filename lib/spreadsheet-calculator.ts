// Exact spreadsheet calculation engine matching provided formulas

export interface ProjectAreas {
  walls_sqft: number;
  ceilings_sqft: number;
  trim_sqft: number;
}

export interface ChargeRates {
  walls_rate: number;
  ceilings_rate: number;
  trim_rate: number;
}

export interface PaintCosts {
  walls_paint_cost: number;
  ceilings_paint_cost: number;
  trim_paint_cost: number;
}

export interface MaterialsBreakdown {
  walls: { gallons: number; cost: number };
  ceilings: { gallons: number; cost: number };
  trim: { gallons: number; cost: number };
  total: number;
}

export interface RevenueBreakdown {
  walls: number;
  ceilings: number;
  trim: number;
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
  const wallsRevenue = areas.walls_sqft * rates.walls_rate; // e.g., 1000 × $3.00 = $3,000
  const ceilingsRevenue = areas.ceilings_sqft * rates.ceilings_rate; // e.g., 1000 × $2.00 = $2,000  
  const trimRevenue = areas.trim_sqft * rates.trim_rate; // e.g., 520 × $1.92 = $1,000
  
  return {
    walls: wallsRevenue,
    ceilings: ceilingsRevenue,
    trim: trimRevenue,
    total: wallsRevenue + ceilingsRevenue + trimRevenue
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
  // Smart parsing for "John Smith, 123 Main St" or "John Smith and address is 123 Main St"
  const patterns = [
    /^(.+?),\s*(.+)$/, // "Name, Address"
    /^(.+?)\s+(?:and\s+)?(?:address\s+is\s+|at\s+)(.+)$/i, // "Name and address is Address"
    /^(.+)$/ // Just name, will ask for address next
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      return {
        customer_name: match[1].trim(),
        address: match[2]?.trim() || ''
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
  // Parse "1000 walls, 1000 ceilings, 520 trim" or similar patterns
  const wallsMatch = input.match(/(\d+)\s*(?:walls?|wall)/i);
  const ceilingsMatch = input.match(/(\d+)\s*(?:ceilings?|ceiling)/i);
  const trimMatch = input.match(/(\d+)\s*(?:trim|doors?|door)/i);
  
  // If no specific breakdown, try to parse total sqft and estimate
  if (!wallsMatch && !ceilingsMatch && !trimMatch) {
    const totalMatch = input.match(/(\d+)/);
    if (totalMatch) {
      const total = parseInt(totalMatch[1]);
      if (projectType === 'interior') {
        // Interior estimate: walls and ceilings roughly equal, trim 30% of walls
        return {
          walls_sqft: Math.round(total * 0.6),
          ceilings_sqft: Math.round(total * 0.6), 
          trim_sqft: Math.round(total * 0.3)
        };
      } else {
        // Exterior: mostly walls, no ceilings, some trim
        return {
          walls_sqft: Math.round(total * 0.8),
          ceilings_sqft: 0,
          trim_sqft: Math.round(total * 0.2)
        };
      }
    }
  }

  return {
    walls_sqft: wallsMatch ? parseInt(wallsMatch[1]) : 0,
    ceilings_sqft: ceilingsMatch ? parseInt(ceilingsMatch[1]) : 0,
    trim_sqft: trimMatch ? parseInt(trimMatch[1]) : 0
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

  // Rate adjustments
  const wallsRateMatch = input.match(/walls?\s+(?:to\s+|at\s+)?\$?(\d+\.?\d*)/i);
  if (wallsRateMatch) {
    adjustments.rates = { ...adjustments.rates, walls_rate: parseFloat(wallsRateMatch[1]) };
  }

  const ceilingsRateMatch = input.match(/ceilings?\s+(?:to\s+|at\s+)?\$?(\d+\.?\d*)/i);
  if (ceilingsRateMatch) {
    adjustments.rates = { ...adjustments.rates, ceilings_rate: parseFloat(ceilingsRateMatch[1]) };
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
  return `Here's your quote calculation:

💰 **REVENUE BREAKDOWN**
- Walls: ${areas.walls_sqft} sqft × ${formatCurrency(rates.walls_rate)}/sqft = ${formatCurrency(calc.revenue.walls)}
- Ceilings: ${areas.ceilings_sqft} sqft × ${formatCurrency(rates.ceilings_rate)}/sqft = ${formatCurrency(calc.revenue.ceilings)}
- Trim: ${areas.trim_sqft} sqft × ${formatCurrency(rates.trim_rate)}/sqft = ${formatCurrency(calc.revenue.trim)}
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
  return `📋 **DETAILED BREAKDOWN**

**REVENUE CALCULATION:**
- Walls: ${areas.walls_sqft} sqft × ${formatCurrency(rates.walls_rate)} = ${formatCurrency(calc.revenue.walls)}
- Ceilings: ${areas.ceilings_sqft} sqft × ${formatCurrency(rates.ceilings_rate)} = ${formatCurrency(calc.revenue.ceilings)}
- Trim: ${areas.trim_sqft} sqft × ${formatCurrency(rates.trim_rate)} = ${formatCurrency(calc.revenue.trim)}
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