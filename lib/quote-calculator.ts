export interface QuoteCalculationData {
  walls_sqft?: number;
  ceilings_sqft?: number;
  trim_sqft?: number;
  number_of_doors?: number;
  number_of_windows?: number;
  paint_quality?: string;
  project_type?: string;
  markup_percentage?: number;
}

export interface QuoteResult {
  breakdown: QuoteBreakdown;
  total: number;
  totalCost: number;
  timestamp: string;
  timeEstimate?: string;
  details?: {
    sqft?: number;
    roomCount?: number;
    paintGallons?: number;
    totalLaborHours?: number;
  };
}

export interface QuoteBreakdown {
  materials: {
    wallPaint: number;
    ceilingPaint: number;
    trimPaint: number;
    primer: number;
    supplies: number;
    total: number;
  };
  labor: {
    wallLabor: number;
    ceilingLabor: number;
    trimLabor: number;
    prepLabor: number;
    total: number;
  };
  subtotal: number;
  markup: number;
  total: number;
}

// Default rates per square foot
const DEFAULT_RATES = {
  walls: 3.00,
  ceilings: 2.00,
  trim: 5.00,
  doors: 45.00, // per door
  windows: 15.00, // per window
};

// Paint costs per gallon by quality
const PAINT_COSTS = {
  good: { walls: 25, ceilings: 23, trim: 30 },
  better: { walls: 35, ceilings: 32, trim: 40 },
  best: { walls: 50, ceilings: 45, trim: 55 },
  premium: { walls: 60, ceilings: 55, trim: 65 },
};

// Coverage rates (sq ft per gallon)
const COVERAGE_RATES = {
  walls: 350,
  ceilings: 350,
  trim: 300, // Lower coverage for trim due to more precise work
};

export function calculateQuote(data: QuoteCalculationData): QuoteBreakdown {
  const wallsSqft = data.walls_sqft || 0;
  const ceilingsSqft = data.ceilings_sqft || 0;
  const trimSqft = data.trim_sqft || 0;
  const numberOfDoors = data.number_of_doors || 0;
  const numberOfWindows = data.number_of_windows || 0;
  const paintQuality = data.paint_quality || 'better';
  const markupPercentage = data.markup_percentage || 30;

  // Get paint costs for the selected quality
  const paintCosts = PAINT_COSTS[paintQuality as keyof typeof PAINT_COSTS] || PAINT_COSTS.better;

  // Calculate paint quantities needed (in gallons)
  const wallPaintGallons = Math.ceil(wallsSqft / COVERAGE_RATES.walls);
  const ceilingPaintGallons = Math.ceil(ceilingsSqft / COVERAGE_RATES.ceilings);
  const trimPaintGallons = Math.ceil(trimSqft / COVERAGE_RATES.trim);

  // Calculate primer needed (assume 1 coat primer for all surfaces)
  const primerGallons = Math.ceil((wallsSqft + ceilingsSqft + trimSqft) / 400); // Primer covers more

  // Material costs
  const materials = {
    wallPaint: wallPaintGallons * paintCosts.walls,
    ceilingPaint: ceilingPaintGallons * paintCosts.ceilings,
    trimPaint: trimPaintGallons * paintCosts.trim,
    primer: primerGallons * 25, // Standard primer cost
    supplies: Math.max(50, (wallsSqft + ceilingsSqft + trimSqft) * 0.15), // Brushes, rollers, etc.
    total: 0,
  };

  materials.total = materials.wallPaint + materials.ceilingPaint + materials.trimPaint + materials.primer + materials.supplies;

  // Labor costs (based on surface area and complexity)
  const labor = {
    wallLabor: wallsSqft * DEFAULT_RATES.walls,
    ceilingLabor: ceilingsSqft * DEFAULT_RATES.ceilings,
    trimLabor: trimSqft * DEFAULT_RATES.trim,
    prepLabor: numberOfDoors * DEFAULT_RATES.doors + numberOfWindows * DEFAULT_RATES.windows,
    total: 0,
  };

  labor.total = labor.wallLabor + labor.ceilingLabor + labor.trimLabor + labor.prepLabor;

  // Calculate totals
  const subtotal = materials.total + labor.total;
  const markup = subtotal * (markupPercentage / 100);
  const total = subtotal + markup;

  return {
    materials,
    labor,
    subtotal,
    markup,
    total: Math.round(total),
  };
}

export function calculateSurfaceArea(length: number, width: number, height: number, doors: number = 0, windows: number = 0) {
  // Wall area calculation
  const wallPerimeter = 2 * (length + width);
  const wallArea = wallPerimeter * height;
  
  // Subtract door and window areas
  const doorArea = doors * 21; // Standard door is 3' x 7'
  const windowArea = windows * 15; // Average window is 3' x 5'
  const netWallArea = Math.max(0, wallArea - doorArea - windowArea);

  // Ceiling area
  const ceilingArea = length * width;

  return {
    walls: Math.round(netWallArea),
    ceiling: Math.round(ceilingArea),
    perimeter: Math.round(wallPerimeter),
  };
}

export function updateQuoteWithRoomData(rooms: any[]): QuoteCalculationData {
  let totalWalls = 0;
  let totalCeilings = 0;
  let totalDoors = 0;
  let totalWindows = 0;

  rooms.forEach(room => {
    if (room.wall_area) totalWalls += room.wall_area;
    if (room.ceiling_area) totalCeilings += room.ceiling_area;
    if (room.number_of_doors) totalDoors += room.number_of_doors;
    if (room.number_of_windows) totalWindows += room.number_of_windows;
  });

  return {
    walls_sqft: totalWalls,
    ceilings_sqft: totalCeilings,
    number_of_doors: totalDoors,
    number_of_windows: totalWindows,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getQuoteItemizedBreakdown(breakdown: QuoteBreakdown) {
  const items = [
    { 
      category: 'Materials',
      items: [
        { name: 'Wall Paint', amount: breakdown.materials.wallPaint },
        { name: 'Ceiling Paint', amount: breakdown.materials.ceilingPaint },
        { name: 'Trim Paint', amount: breakdown.materials.trimPaint },
        { name: 'Primer', amount: breakdown.materials.primer },
        { name: 'Supplies & Materials', amount: breakdown.materials.supplies },
      ],
      total: breakdown.materials.total
    },
    {
      category: 'Labor',
      items: [
        { name: 'Wall Painting', amount: breakdown.labor.wallLabor },
        { name: 'Ceiling Painting', amount: breakdown.labor.ceilingLabor },
        { name: 'Trim & Detail Work', amount: breakdown.labor.trimLabor },
        { name: 'Prep Work', amount: breakdown.labor.prepLabor },
      ],
      total: breakdown.labor.total
    }
  ];

  return items;
}