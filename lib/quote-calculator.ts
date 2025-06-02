interface CostSettings {
  labor_rate: number;
  paint_good: number;
  paint_better: number;
  paint_best: number;
  supplies_base: number;
}

export function calculateQuote(
  roomCount: number,
  totalSqft: number,
  paintQuality: "good" | "better" | "best",
  costs: CostSettings,
) {
  // Paint calculation: 1 gallon covers 350 sq ft, 2 coats standard
  const coats = 2;
  const coverage = 350;
  const paintGallons = Math.ceil((totalSqft * coats) / coverage);
  const paintCost = paintGallons * costs[`paint_${paintQuality}`];

  // Labor calculation: 4 hours per room
  const hoursPerRoom = 4;
  const totalLaborHours = roomCount * hoursPerRoom;
  const laborCost = totalLaborHours * costs.labor_rate;

  // Sundries: $25 per room for supplies
  const sundriesPerRoom = 25;
  const sundriesCost = roomCount * sundriesPerRoom;

  // Total base cost
  const baseCost = laborCost + paintCost + sundriesCost + costs.supplies_base;

  return {
    laborCost,
    paintCost,
    sundriesCost,
    suppliesCost: costs.supplies_base,
    baseCost,
    paintGallons,
    totalLaborHours,
    roomCount,
    totalSqft,
    paintQuality,
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
