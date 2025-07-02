// Professional Interior Painting Quote Calculator
// Based on industry-standard formulas and practices

export interface Room {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  doors: number;
  windows: number;
  ceiling_area: number; // Calculated from length × width
  wall_area: number; // Calculated from perimeter × height - door/window area
}

export interface ProjectDimensions {
  wall_linear_feet: number;      // Linear footage of walls
  ceiling_height: number;        // Height in feet
  ceiling_area: number;          // Ceiling square footage (defaults to floor_area)
  number_of_doors: number;       // Count of doors
  number_of_windows: number;     // Count of windows
  floor_area?: number;           // Floor area - used as default for ceiling_area
  rooms?: Room[];                // Room-by-room measurements
  room_count?: number;           // Total number of rooms
}

export interface PaintProducts {
  // Primer
  primer_name: string;
  primer_spread_rate: number;    // sqft per gallon
  primer_cost_per_gallon: number;
  
  // Wall Paint (3 options: good, better, best)
  wall_paints: {
    name: string;
    spread_rate: number;         // sqft per gallon
    cost_per_gallon: number;
  }[];
  
  // Ceiling Paint (3 options)
  ceiling_paints: {
    name: string;
    spread_rate: number;
    cost_per_gallon: number;
  }[];
  
  // Trim/Door/Window Paint (3 options)
  trim_paints: {
    name: string;
    doors_per_gallon: number;    // How many doors per gallon (2 coats)
    windows_per_gallon: number;  // How many windows per gallon (2 coats)
    cost_per_gallon: number;
  }[];
  
  // Floor/Driveway Sealer (optional)
  floor_sealer?: {
    name: string;
    spread_rate: number;
    cost_per_gallon: number;
  };
}

export interface ChargeRates {
  wall_rate_per_sqft: number;    // e.g., $1.50 per sqft (2 coats)
  ceiling_rate_per_sqft: number; // e.g., $1.25 per sqft (2 coats)
  primer_rate_per_sqft: number;  // e.g., $0.45 per sqft (1 coat)
  door_rate_each: number;        // e.g., $150 per door (2 coats)
  window_rate_each: number;      // e.g., $100 per window (2 coats)
  floor_sealer_rate_per_sqft?: number; // Optional floor sealer rate
}

export interface MaterialCalculation {
  primer: {
    sqft_needed: number;
    gallons_needed: number;
    cost: number;
  };
  walls: {
    sqft_needed: number;
    gallons_needed: number;
    cost: number;
  };
  ceilings: {
    sqft_needed: number;
    gallons_needed: number;
    cost: number;
  };
  trim_doors_windows: {
    doors_count: number;
    windows_count: number;
    gallons_needed: number;
    cost: number;
  };
  floor_sealer?: {
    sqft_needed: number;
    gallons_needed: number;
    cost: number;
  };
  total_material_cost: number;
}

export interface LaborCalculation {
  primer_labor: number;
  wall_labor: number;
  ceiling_labor: number;
  door_labor: number;
  window_labor: number;
  floor_sealer_labor?: number;
  total_labor: number;
}

export interface ProfessionalQuote {
  project_info: ProjectDimensions;
  materials: MaterialCalculation;
  labor: LaborCalculation;
  overhead: number;
  total_cost: number;           // Contractor's actual cost
  markup_percentage: number;    // Profit margin selected
  markup_amount: number;        // Dollar amount of markup
  final_price: number;          // Price charged to customer
  profit_margin: number;        // Actual profit percentage
  breakdown_summary: string;
}

// Room calculation utilities
export const calculateRoomAreas = (room: Omit<Room, 'ceiling_area' | 'wall_area'>): Room => {
  const ceiling_area = room.length * room.width;
  const perimeter = 2 * (room.length + room.width);
  
  // Standard door is 21 sqft (3' x 7'), window is 15 sqft (3' x 5')
  const door_area = room.doors * 21;
  const window_area = room.windows * 15;
  
  const wall_area = (perimeter * room.height) - door_area - window_area;
  
  return {
    ...room,
    ceiling_area,
    wall_area
  };
};

export const calculateTotalAreasFromRooms = (rooms: Room[]): {
  total_ceiling_area: number;
  total_wall_area: number;
  total_doors: number;
  total_windows: number;
  wall_linear_feet: number;
} => {
  const totals = rooms.reduce((acc, room) => ({
    total_ceiling_area: acc.total_ceiling_area + room.ceiling_area,
    total_wall_area: acc.total_wall_area + room.wall_area,
    total_doors: acc.total_doors + room.doors,
    total_windows: acc.total_windows + room.windows,
    wall_linear_feet: acc.wall_linear_feet + (2 * (room.length + room.width))
  }), {
    total_ceiling_area: 0,
    total_wall_area: 0,
    total_doors: 0,
    total_windows: 0,
    wall_linear_feet: 0
  });
  
  return totals;
};

// Step 1: Calculate Wall Square Footage
export const calculateWallArea = (linearFeet: number, ceilingHeight: number): number => {
  return linearFeet * ceilingHeight;
};

// Step 2: Calculate Primer Needs (1 coat)
export const calculatePrimer = (
  wallSqft: number, 
  primerSpreadRate: number, 
  primerCostPerGallon: number
): { gallons: number; cost: number } => {
  const gallons = Math.ceil(wallSqft / primerSpreadRate);
  return {
    gallons,
    cost: gallons * primerCostPerGallon
  };
};

// Step 3: Calculate Wall Paint (2 coats)
export const calculateWallPaint = (
  wallSqft: number, 
  spreadRate: number, 
  costPerGallon: number
): { gallons: number; cost: number } => {
  const gallons = Math.ceil((wallSqft / spreadRate) * 1.8); // 1.8x for 2 coats
  return {
    gallons,
    cost: gallons * costPerGallon
  };
};

// Step 4: Calculate Ceiling Paint (2 coats)
export const calculateCeilingPaint = (
  ceilingSqft: number, 
  spreadRate: number, 
  costPerGallon: number
): { gallons: number; cost: number } => {
  const gallons = Math.ceil((ceilingSqft / spreadRate) * 1.8); // 1.8x for 2 coats
  return {
    gallons,
    cost: gallons * costPerGallon
  };
};

// Step 5: Calculate Trim Paint (doors and windows)
export const calculateTrimPaint = (
  numberOfDoors: number,
  numberOfWindows: number,
  doorsPerGallon: number, // typically 4.5
  windowsPerGallon: number, // typically 2.5
  costPerGallon: number
): { gallons: number; cost: number } => {
  const doorGallons = numberOfDoors / doorsPerGallon;
  const windowGallons = numberOfWindows / windowsPerGallon;
  const totalGallons = Math.ceil(doorGallons + windowGallons);
  
  return {
    gallons: totalGallons,
    cost: totalGallons * costPerGallon
  };
};

// Step 6: Calculate Floor Sealer (optional, 1 or 2 coats)
export const calculateFloorSealer = (
  floorSqft: number,
  spreadRate: number,
  costPerGallon: number,
  coats: 1 | 2 = 2
): { gallons: number; cost: number } => {
  const multiplier = coats === 2 ? 1.8 : 1;
  const gallons = Math.ceil((floorSqft / spreadRate) * multiplier);
  
  return {
    gallons,
    cost: gallons * costPerGallon
  };
};

// Complete Professional Quote Calculator with Profit Margins
export const calculateProfessionalQuote = (
  dimensions: ProjectDimensions,
  selectedProducts: {
    primer: PaintProducts['primer_name'] & { spread_rate: number; cost: number };
    wall_paint: PaintProducts['wall_paints'][0];
    ceiling_paint: PaintProducts['ceiling_paints'][0];
    trim_paint: PaintProducts['trim_paints'][0];
    floor_sealer?: PaintProducts['floor_sealer'];
  },
  rates: ChargeRates,
  markupPercentage: number = 20, // Default 20% markup
  includeFloorSealer: boolean = false
): ProfessionalQuote => {
  
  // Calculate areas - use room-based calculations if available
  let wallSqft: number;
  let ceilingSqft: number;
  let totalDoors: number;
  let totalWindows: number;
  
  if (dimensions.rooms && dimensions.rooms.length > 0) {
    // Room-based calculation
    const roomTotals = calculateTotalAreasFromRooms(dimensions.rooms);
    wallSqft = roomTotals.total_wall_area;
    ceilingSqft = roomTotals.total_ceiling_area;
    totalDoors = roomTotals.total_doors;
    totalWindows = roomTotals.total_windows;
  } else {
    // Traditional calculation
    wallSqft = calculateWallArea(dimensions.wall_linear_feet, dimensions.ceiling_height);
    
    // Only auto-calculate ceiling area if explicitly missing (undefined), not if explicitly set to 0
    if (dimensions.ceiling_area === undefined && dimensions.wall_linear_feet) {
      // Estimate ceiling area from perimeter (assuming typical rectangular home with 1.3:1 ratio)
      const perimeter = dimensions.wall_linear_feet;
      // Formula: if perimeter = 2(l + w) and l = 1.3w, then perimeter = 2(1.3w + w) = 4.6w
      // So w = perimeter/4.6, l = 1.3 × perimeter/4.6
      // Area = w × l = (perimeter/4.6) × (1.3 × perimeter/4.6) = 1.3 × (perimeter/4.6)²
      const estimatedArea = Math.round(1.3 * Math.pow(perimeter / 4.6, 2));
      // Add safety check for unrealistic ceiling areas
      ceilingSqft = estimatedArea > 10000 ? 0 : estimatedArea;
    } else {
      ceilingSqft = dimensions.ceiling_area || 0;
    }
    
    totalDoors = dimensions.number_of_doors || 0;
    totalWindows = dimensions.number_of_windows || 0;
  }
  
  // Calculate materials (with safety checks for NaN)
  const primer = calculatePrimer(
    wallSqft || 0, 
    selectedProducts.primer?.spread_rate || 400, 
    selectedProducts.primer?.cost || 45
  );
  const walls = calculateWallPaint(
    wallSqft || 0, 
    selectedProducts.wall_paint?.spread_rate || 400, 
    selectedProducts.wall_paint?.cost_per_gallon || 35
  );
  const ceilings = calculateCeilingPaint(
    ceilingSqft || 0, 
    selectedProducts.ceiling_paint?.spread_rate || 400, 
    selectedProducts.ceiling_paint?.cost_per_gallon || 32
  );
  const trim = calculateTrimPaint(
    totalDoors || 0,
    totalWindows || 0,
    selectedProducts.trim_paint?.doors_per_gallon || 4.5,
    selectedProducts.trim_paint?.windows_per_gallon || 2.5,
    selectedProducts.trim_paint?.cost_per_gallon || 40
  );
  
  let floorSealer = undefined;
  if (includeFloorSealer && selectedProducts.floor_sealer && dimensions.floor_area) {
    floorSealer = calculateFloorSealer(
      dimensions.floor_area,
      selectedProducts.floor_sealer.spread_rate,
      selectedProducts.floor_sealer.cost_per_gallon
    );
  }
  
  // Calculate labor costs (with safety checks for NaN)
  const primerLabor = (wallSqft || 0) * (rates.primer_rate_per_sqft || 0.45);
  const wallLabor = (wallSqft || 0) * (rates.wall_rate_per_sqft || 1.50);
  const ceilingLabor = (ceilingSqft || 0) * (rates.ceiling_rate_per_sqft || 1.25);
  const doorLabor = (totalDoors || 0) * (rates.door_rate_each || 150);
  const windowLabor = (totalWindows || 0) * (rates.window_rate_each || 100);
  const floorSealerLabor = (includeFloorSealer && dimensions.floor_area && rates.floor_sealer_rate_per_sqft) 
    ? dimensions.floor_area * rates.floor_sealer_rate_per_sqft 
    : 0;
  
  const totalLabor = primerLabor + wallLabor + ceilingLabor + doorLabor + windowLabor + floorSealerLabor;
  const totalMaterialCost = primer.cost + walls.cost + ceilings.cost + trim.cost + (floorSealer?.cost || 0);
  
  // Calculate overhead (10% of materials + labor)
  const subtotal = totalLabor + totalMaterialCost;
  const overhead = subtotal * 0.10; // 10% overhead
  const totalCost = subtotal + overhead; // This is contractor's actual cost
  
  // Calculate markup and final price
  const markupAmount = totalCost * (markupPercentage / 100);
  const finalPrice = totalCost + markupAmount;
  const actualProfitMargin = (markupAmount / finalPrice) * 100;
  
  return {
    project_info: dimensions,
    materials: {
      primer: {
        sqft_needed: wallSqft,
        gallons_needed: primer.gallons,
        cost: primer.cost
      },
      walls: {
        sqft_needed: wallSqft,
        gallons_needed: walls.gallons,
        cost: walls.cost
      },
      ceilings: {
        sqft_needed: ceilingSqft,
        gallons_needed: ceilings.gallons,
        cost: ceilings.cost
      },
      trim_doors_windows: {
        doors_count: totalDoors,
        windows_count: totalWindows,
        gallons_needed: trim.gallons,
        cost: trim.cost
      },
      floor_sealer: floorSealer ? {
        sqft_needed: dimensions.floor_area || 0,
        gallons_needed: floorSealer.gallons,
        cost: floorSealer.cost
      } : undefined,
      total_material_cost: totalMaterialCost
    },
    labor: {
      primer_labor: primerLabor,
      wall_labor: wallLabor,
      ceiling_labor: ceilingLabor,
      door_labor: doorLabor,
      window_labor: windowLabor,
      floor_sealer_labor: floorSealerLabor || undefined,
      total_labor: totalLabor
    },
    overhead: overhead,
    total_cost: totalCost,              // Contractor's cost (materials + labor + overhead)
    markup_percentage: markupPercentage,
    markup_amount: markupAmount,
    final_price: finalPrice,            // Price charged to customer
    profit_margin: actualProfitMargin,
    breakdown_summary: generateProfessionalBreakdownSummary(totalMaterialCost, totalLabor, overhead, markupAmount, finalPrice)
  };
};

// Generate a professional breakdown summary with profit margins
const generateProfessionalBreakdownSummary = (
  materials: number, 
  labor: number, 
  overhead: number, 
  markup: number, 
  finalPrice: number
): string => {
  const subtotal = materials + labor;
  const totalCost = subtotal + overhead;
  
  return `Materials: $${materials.toLocaleString()} | Labor: $${labor.toLocaleString()} | Overhead: $${overhead.toLocaleString()} | Cost: $${totalCost.toLocaleString()} | Markup: $${markup.toLocaleString()} | **Price: $${finalPrice.toLocaleString()}**`;
};

// Legacy function for compatibility
const generateBreakdownSummary = (labor: number, materials: number, total: number): string => {
  const laborPercent = ((labor / total) * 100).toFixed(1);
  const materialPercent = ((materials / total) * 100).toFixed(1);
  
  return `Labor: $${labor.toLocaleString()} (${laborPercent}%) | Materials: $${materials.toLocaleString()} (${materialPercent}%) | Total: $${total.toLocaleString()}`;
};

// Default product configurations for new companies
export const DEFAULT_PAINT_PRODUCTS: PaintProducts = {
  primer_name: "Kilz Premium Primer",
  primer_spread_rate: 400,
  primer_cost_per_gallon: 45,
  
  wall_paints: [
    { name: "Sherwin Williams ProClassic (Good)", spread_rate: 400, cost_per_gallon: 65 },
    { name: "Benjamin Moore Advance (Better)", spread_rate: 450, cost_per_gallon: 85 },
    { name: "Sherwin Williams ProMar 400 (Best)", spread_rate: 400, cost_per_gallon: 95 }
  ],
  
  ceiling_paints: [
    { name: "Sherwin Williams ProMar Ceiling (Good)", spread_rate: 450, cost_per_gallon: 55 },
    { name: "Benjamin Moore Waterborne Ceiling (Better)", spread_rate: 400, cost_per_gallon: 75 },
    { name: "Sherwin Williams ProClassic Ceiling (Best)", spread_rate: 450, cost_per_gallon: 85 }
  ],
  
  trim_paints: [
    { name: "Sherwin Williams ProClassic Trim (Good)", doors_per_gallon: 4.5, windows_per_gallon: 2.5, cost_per_gallon: 75 },
    { name: "Benjamin Moore Advance Trim (Better)", doors_per_gallon: 4, windows_per_gallon: 2.5, cost_per_gallon: 95 },
    { name: "Sherwin Williams ProMar Trim (Best)", doors_per_gallon: 4.5, windows_per_gallon: 3, cost_per_gallon: 105 }
  ],
  
  floor_sealer: {
    name: "Sherwin Williams Concrete & Garage Floor Paint",
    spread_rate: 400,
    cost_per_gallon: 85
  }
};

export const DEFAULT_CHARGE_RATES: ChargeRates = {
  wall_rate_per_sqft: 1.50,      // $1.50 per sqft for walls (2 coats)
  ceiling_rate_per_sqft: 1.25,   // $1.25 per sqft for ceilings (2 coats)
  primer_rate_per_sqft: 0.45,    // $0.45 per sqft for primer (1 coat)
  door_rate_each: 150,           // $150 per door (2 coats)
  window_rate_each: 100,         // $100 per window (2 coats)
  floor_sealer_rate_per_sqft: 1.20 // $1.20 per sqft for floor sealer
};