interface CostSettings {
  labor_rate: number;
  paint_good: number;
  paint_better: number;
  paint_best: number;
  supplies_base: number;
  markup_percentage: number;
}

interface QuoteCalculationInput {
  projectType: 'interior' | 'exterior' | 'both';
  rooms?: Array<{
    name: string;
    length: number;
    width: number;
    height: number;
  }>;
  sqft?: number;
  paintType: 'basic' | 'premium' | 'luxury';
  prepWork: 'minimal' | 'standard' | 'extensive';
  timeline: 'rush' | 'standard' | 'flexible';
}

interface QuoteResult {
  laborCost: number;
  materialsCost: number;
  prepWorkCost: number;
  baseCost: number;
  markupAmount: number;
  totalCost: number;
  timeEstimate: string;
  breakdown: {
    labor: number;
    materials: number;
    prepWork: number;
    markup: number;
  };
  details: {
    paintGallons?: number;
    totalLaborHours: number;
    sqft: number;
    roomCount: number;
  };
}

const DEFAULT_COSTS: CostSettings = {
  labor_rate: 45,
  paint_good: 35,
  paint_better: 55,
  paint_best: 85,
  supplies_base: 150,
  markup_percentage: 35
};

export function calculateQuote(
  input: QuoteCalculationInput,
  customCosts?: Partial<CostSettings>
): QuoteResult {
  const costs = { ...DEFAULT_COSTS, ...customCosts };
  
  // Calculate square footage
  let totalSqft = input.sqft || 0;
  if (input.rooms && input.rooms.length > 0) {
    totalSqft = input.rooms.reduce((total, room) => {
      if (input.projectType === 'interior') {
        // Interior: wall area calculation
        const wallArea = 2 * (room.length + room.width) * room.height;
        return total + wallArea;
      } else {
        // Exterior: perimeter calculation
        const perimeter = 2 * (room.length + room.width);
        return total + perimeter * room.height;
      }
    }, 0);
  }

  const roomCount = input.rooms?.length || Math.ceil(totalSqft / 150); // Estimate rooms if not provided

  // Paint calculation
  const paintQualityMap = {
    basic: 'paint_good',
    premium: 'paint_better', 
    luxury: 'paint_best'
  } as const;
  
  const coats = input.projectType === 'exterior' ? 2 : 2;
  const coverage = 350; // sq ft per gallon
  const paintGallons = Math.ceil((totalSqft * coats) / coverage);
  const paintCost = paintGallons * costs[paintQualityMap[input.paintType]];

  // Labor calculation
  let hoursPerSqft = 0.15; // Base rate
  if (input.projectType === 'exterior') hoursPerSqft *= 1.5;
  if (input.paintType === 'premium') hoursPerSqft *= 1.2;
  if (input.paintType === 'luxury') hoursPerSqft *= 1.4;

  const totalLaborHours = Math.ceil(totalSqft * hoursPerSqft);
  const laborCost = totalLaborHours * costs.labor_rate;

  // Prep work cost
  const prepWorkMultipliers = {
    minimal: 0.1,
    standard: 0.25,
    extensive: 0.5
  };
  const prepWorkCost = laborCost * prepWorkMultipliers[input.prepWork];

  // Materials cost (paint + supplies)
  const materialsCost = paintCost + costs.supplies_base;

  // Base cost
  const baseCost = laborCost + materialsCost + prepWorkCost;

  // Timeline adjustments
  let timelineMultiplier = 1;
  if (input.timeline === 'rush') timelineMultiplier = 1.35;
  if (input.timeline === 'flexible') timelineMultiplier = 0.9;

  const adjustedBaseCost = baseCost * timelineMultiplier;

  // Markup
  const markupAmount = adjustedBaseCost * (costs.markup_percentage / 100);
  const totalCost = adjustedBaseCost + markupAmount;

  // Time estimate
  const baseTimeDays = Math.ceil(totalLaborHours / 8);
  let timeEstimate = `${baseTimeDays} days`;
  if (input.timeline === 'rush') timeEstimate = `${Math.ceil(baseTimeDays * 0.7)} days (rush)`;
  if (input.timeline === 'flexible') timeEstimate = `${Math.ceil(baseTimeDays * 1.3)} days`;

  return {
    laborCost,
    materialsCost,
    prepWorkCost,
    baseCost: adjustedBaseCost,
    markupAmount,
    totalCost: Math.round(totalCost),
    timeEstimate,
    breakdown: {
      labor: laborCost,
      materials: materialsCost,
      prepWork: prepWorkCost,
      markup: markupAmount
    },
    details: {
      paintGallons,
      totalLaborHours,
      sqft: totalSqft,
      roomCount
    }
  };
}

export function applyMarkup(baseCost: number, markupPercentage: number) {
  const markupAmount = baseCost * (markupPercentage / 100);
  const finalPrice = baseCost + markupAmount;

  return {
    baseCost,
    markupPercentage,
    markupAmount,
    finalPrice,
    profit: markupAmount,
  };
}

export { DEFAULT_COSTS, type CostSettings, type QuoteCalculationInput, type QuoteResult };