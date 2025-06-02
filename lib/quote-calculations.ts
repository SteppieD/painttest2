// Professional painting quote calculation engine

export interface PaintCalculation {
  walls: { sqft: number; gallons: number; cost: number };
  ceilings: { sqft: number; gallons: number; cost: number };
  trim: { sqft: number; gallons: number; cost: number };
  totalGallons: number;
  totalCost: number;
}

export interface QuoteBreakdown {
  paint: PaintCalculation;
  sundries: {
    percentage: number;
    cost: number;
  };
  labor: {
    percentage: number;
    hours?: number;
    hourlyRate?: number;
    cost: number;
  };
  subtotal: number;
  markup: {
    percentage: number;
    amount: number;
  };
  tax: {
    rate: number;
    label: string;
    onMaterialsOnly: boolean;
    amount: number;
  };
  total: number;
  profit: number;
}

export interface QuoteInputs {
  // Areas
  wallsSqft: number;
  ceilingsSqft: number;
  trimSqft: number;
  
  // Paint costs per gallon
  wallsPaintCost: number;
  ceilingsPaintCost: number;
  trimPaintCost: number;
  
  // Coverage
  paintCoverage: number;
  
  // Cost factors
  sundriesPercentage: number;
  laborPercentage: number;
  markupPercentage: number;
  
  // Tax
  taxRate: number;
  taxLabel: string;
  taxOnMaterialsOnly: boolean;
}

export function calculatePaintNeeds(
  sqft: number, 
  paintCostPerGallon: number, 
  coverage: number
): { gallons: number; cost: number } {
  const gallons = Math.ceil(sqft / coverage);
  const cost = gallons * paintCostPerGallon;
  return { gallons, cost };
}

export function calculateDetailedQuote(inputs: QuoteInputs): QuoteBreakdown {
  // 1. Calculate paint needs for each surface
  const wallsPaint = calculatePaintNeeds(inputs.wallsSqft, inputs.wallsPaintCost, inputs.paintCoverage);
  const ceilingsPaint = calculatePaintNeeds(inputs.ceilingsSqft, inputs.ceilingsPaintCost, inputs.paintCoverage);
  const trimPaint = calculatePaintNeeds(inputs.trimSqft, inputs.trimPaintCost, inputs.paintCoverage);
  
  const paint: PaintCalculation = {
    walls: { sqft: inputs.wallsSqft, ...wallsPaint },
    ceilings: { sqft: inputs.ceilingsSqft, ...ceilingsPaint },
    trim: { sqft: inputs.trimSqft, ...trimPaint },
    totalGallons: wallsPaint.gallons + ceilingsPaint.gallons + trimPaint.gallons,
    totalCost: wallsPaint.cost + ceilingsPaint.cost + trimPaint.cost
  };
  
  // 2. Calculate sundries (brushes, tape, plastic, etc.)
  const sundriesCost = paint.totalCost * (inputs.sundriesPercentage / 100);
  
  // 3. Total materials = paint + sundries
  const totalMaterials = paint.totalCost + sundriesCost;
  
  // 4. Calculate labor
  // For now using percentage method, can be enhanced with hourly later
  const totalSqft = inputs.wallsSqft + inputs.ceilingsSqft + inputs.trimSqft;
  const baseRevenue = totalSqft * 2.5; // Base rate for calculation
  const laborCost = baseRevenue * (inputs.laborPercentage / 100);
  
  // 5. Subtotal before markup and tax
  const subtotal = totalMaterials + laborCost;
  
  // 6. Calculate markup (profit)
  const markupAmount = subtotal * (inputs.markupPercentage / 100);
  
  // 7. Calculate tax
  const taxableAmount = inputs.taxOnMaterialsOnly ? totalMaterials : (subtotal + markupAmount);
  const taxAmount = taxableAmount * (inputs.taxRate / 100);
  
  // 8. Final total
  const total = subtotal + markupAmount + taxAmount;
  
  return {
    paint,
    sundries: {
      percentage: inputs.sundriesPercentage,
      cost: sundriesCost
    },
    labor: {
      percentage: inputs.laborPercentage,
      cost: laborCost
    },
    subtotal,
    markup: {
      percentage: inputs.markupPercentage,
      amount: markupAmount
    },
    tax: {
      rate: inputs.taxRate,
      label: inputs.taxLabel,
      onMaterialsOnly: inputs.taxOnMaterialsOnly,
      amount: taxAmount
    },
    total,
    profit: markupAmount
  };
}

// Helper to format breakdown for display
export function formatBreakdownMessage(breakdown: QuoteBreakdown): string {
  let message = `Here's your detailed breakdown:\n\n`;
  
  message += `**Paint Costs:**\n`;
  if (breakdown.paint.walls.sqft > 0) {
    message += `• Walls: ${breakdown.paint.walls.gallons} gallons = $${breakdown.paint.walls.cost.toFixed(2)}\n`;
  }
  if (breakdown.paint.ceilings.sqft > 0) {
    message += `• Ceilings: ${breakdown.paint.ceilings.gallons} gallons = $${breakdown.paint.ceilings.cost.toFixed(2)}\n`;
  }
  if (breakdown.paint.trim.sqft > 0) {
    message += `• Trim: ${breakdown.paint.trim.gallons} gallons = $${breakdown.paint.trim.cost.toFixed(2)}\n`;
  }
  message += `Paint Total: $${breakdown.paint.totalCost.toFixed(2)}\n\n`;
  
  message += `**Sundries (${breakdown.sundries.percentage}%):** $${breakdown.sundries.cost.toFixed(2)}\n`;
  message += `**Labor (${breakdown.labor.percentage}%):** $${breakdown.labor.cost.toFixed(2)}\n\n`;
  
  message += `**Subtotal:** $${breakdown.subtotal.toFixed(2)}\n`;
  message += `**Your Profit (${breakdown.markup.percentage}%):** $${breakdown.markup.amount.toFixed(2)}\n`;
  
  if (breakdown.tax.rate > 0) {
    message += `**${breakdown.tax.label} (${breakdown.tax.rate}%):** $${breakdown.tax.amount.toFixed(2)}\n`;
  }
  
  message += `\n**Total Quote:** $${breakdown.total.toFixed(2)}`;
  
  return message;
}