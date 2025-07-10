// Contractor-Focused Quote Calculator
// Uses charge rates that include both labor and materials
// Labor is automatically calculated as 30% of total charge

export interface ContractorChargeRates {
  // Interior Rates (per unit specified)
  wall_charge_rate: number;         // Per sqft
  ceiling_charge_rate: number;      // Per sqft
  baseboard_charge_rate: number;    // Per linear foot
  crown_molding_charge_rate: number; // Per linear foot
  door_charge_rate: number;         // Per unit (includes jamb)
  window_charge_rate: number;       // Per unit

  // Exterior Rates
  exterior_wall_charge_rate: number;    // Per sqft
  soffit_charge_rate: number;           // Per sqft
  fascia_charge_rate: number;           // Per linear foot
  exterior_door_charge_rate: number;    // Per unit
  exterior_window_charge_rate: number;  // Per unit
}

export interface ContractorProjectDimensions {
  // Interior Measurements
  wall_sqft?: number;           // Total wall square footage
  ceiling_sqft?: number;        // Total ceiling square footage
  baseboard_linear_feet?: number;   // Linear feet of baseboards
  crown_molding_linear_feet?: number; // Linear feet of crown molding
  interior_doors?: number;      // Number of interior doors
  interior_windows?: number;    // Number of interior windows

  // Exterior Measurements
  exterior_wall_sqft?: number;  // Total exterior wall square footage
  soffit_sqft?: number;         // Total soffit square footage
  fascia_linear_feet?: number;  // Linear feet of fascia boards
  exterior_doors?: number;      // Number of exterior doors
  exterior_windows?: number;    // Number of exterior windows

  // Legacy support - convert from old format
  wall_linear_feet?: number;    // Convert to wall_sqft using ceiling height
  ceiling_height?: number;      // Used for conversion
  ceiling_area?: number;        // Maps to ceiling_sqft
  number_of_doors?: number;     // Maps to interior_doors
  number_of_windows?: number;   // Maps to interior_windows
}

export interface ContractorQuoteBreakdown {
  // Interior Charges
  walls: {
    quantity: number;
    unit: string;
    rate: number;
    total: number;
    labor: number;
    materials: number;
  };
  ceilings: {
    quantity: number;
    unit: string;
    rate: number;
    total: number;
    labor: number;
    materials: number;
  };
  baseboards: {
    quantity: number;
    unit: string;
    rate: number;
    total: number;
    labor: number;
    materials: number;
  };
  crown_molding: {
    quantity: number;
    unit: string;
    rate: number;
    total: number;
    labor: number;
    materials: number;
  };
  interior_doors: {
    quantity: number;
    unit: string;
    rate: number;
    total: number;
    labor: number;
    materials: number;
  };
  interior_windows: {
    quantity: number;
    unit: string;
    rate: number;
    total: number;
    labor: number;
    materials: number;
  };

  // Exterior Charges
  exterior_walls: {
    quantity: number;
    unit: string;
    rate: number;
    total: number;
    labor: number;
    materials: number;
  };
  soffits: {
    quantity: number;
    unit: string;
    rate: number;
    total: number;
    labor: number;
    materials: number;
  };
  fascia: {
    quantity: number;
    unit: string;
    rate: number;
    total: number;
    labor: number;
    materials: number;
  };
  exterior_doors: {
    quantity: number;
    unit: string;
    rate: number;
    total: number;
    labor: number;
    materials: number;
  };
  exterior_windows: {
    quantity: number;
    unit: string;
    rate: number;
    total: number;
    labor: number;
    materials: number;
  };

  // Totals
  interior_subtotal: number;
  exterior_subtotal: number;
  total_charge: number;
  total_labor: number;
  total_materials: number;
}

export interface ContractorQuote {
  dimensions: ContractorProjectDimensions;
  rates: ContractorChargeRates;
  breakdown: ContractorQuoteBreakdown;
  
  // Business calculations
  subtotal: number;             // Total charges
  overhead_percentage: number;  // Overhead %
  overhead_amount: number;      // Overhead $
  markup_percentage: number;    // Profit margin %
  markup_amount: number;        // Profit margin $
  
  // Taxes
  tax_rate: number;
  tax_on_materials_only: boolean;
  tax_amount: number;
  tax_label: string;
  
  // Final amounts
  total_before_tax: number;
  final_price: number;
  
  // Labor breakdown (30% of each charge)
  labor_cost: number;
  materials_cost: number;
}

// Helper function to calculate labor and materials from charge
const calculateLaborAndMaterials = (totalCharge: number): { labor: number; materials: number } => {
  const labor = totalCharge * 0.30; // Labor is 30% of total charge
  const materials = totalCharge * 0.70; // Materials is 70% of total charge
  return { labor, materials };
};

// Helper function to convert legacy dimensions to new format
export const convertLegacyDimensions = (dimensions: ContractorProjectDimensions): ContractorProjectDimensions => {
  const converted = { ...dimensions };
  
  // Convert wall linear feet to wall sqft if needed
  if (!converted.wall_sqft && converted.wall_linear_feet && converted.ceiling_height) {
    converted.wall_sqft = converted.wall_linear_feet * converted.ceiling_height;
  }
  
  // Map ceiling_area to ceiling_sqft
  if (!converted.ceiling_sqft && converted.ceiling_area !== undefined) {
    converted.ceiling_sqft = converted.ceiling_area;
  }
  
  // Map door/window counts
  if (!converted.interior_doors && converted.number_of_doors !== undefined) {
    converted.interior_doors = converted.number_of_doors;
  }
  if (!converted.interior_windows && converted.number_of_windows !== undefined) {
    converted.interior_windows = converted.number_of_windows;
  }
  
  // Calculate baseboard linear feet if not provided
  if (!converted.baseboard_linear_feet && converted.wall_linear_feet) {
    // Baseboards typically run along all walls
    converted.baseboard_linear_feet = converted.wall_linear_feet;
  }
  
  return converted;
};

// Main calculator function
export const calculateContractorQuote = (
  dimensions: ContractorProjectDimensions,
  rates: ContractorChargeRates,
  businessSettings: {
    overhead_percentage: number;
    markup_percentage: number;
    tax_rate: number;
    tax_on_materials_only: boolean;
    tax_label: string;
  }
): ContractorQuote => {
  
  // Convert legacy dimensions if needed
  const convertedDimensions = convertLegacyDimensions(dimensions);
  
  // Initialize breakdown
  const breakdown: ContractorQuoteBreakdown = {
    // Interior
    walls: {
      quantity: convertedDimensions.wall_sqft || 0,
      unit: 'sq ft',
      rate: rates.wall_charge_rate,
      total: (convertedDimensions.wall_sqft || 0) * rates.wall_charge_rate,
      labor: 0,
      materials: 0
    },
    ceilings: {
      quantity: convertedDimensions.ceiling_sqft || 0,
      unit: 'sq ft',
      rate: rates.ceiling_charge_rate,
      total: (convertedDimensions.ceiling_sqft || 0) * rates.ceiling_charge_rate,
      labor: 0,
      materials: 0
    },
    baseboards: {
      quantity: convertedDimensions.baseboard_linear_feet || 0,
      unit: 'linear ft',
      rate: rates.baseboard_charge_rate,
      total: (convertedDimensions.baseboard_linear_feet || 0) * rates.baseboard_charge_rate,
      labor: 0,
      materials: 0
    },
    crown_molding: {
      quantity: convertedDimensions.crown_molding_linear_feet || 0,
      unit: 'linear ft',
      rate: rates.crown_molding_charge_rate,
      total: (convertedDimensions.crown_molding_linear_feet || 0) * rates.crown_molding_charge_rate,
      labor: 0,
      materials: 0
    },
    interior_doors: {
      quantity: convertedDimensions.interior_doors || 0,
      unit: 'each',
      rate: rates.door_charge_rate,
      total: (convertedDimensions.interior_doors || 0) * rates.door_charge_rate,
      labor: 0,
      materials: 0
    },
    interior_windows: {
      quantity: convertedDimensions.interior_windows || 0,
      unit: 'each',
      rate: rates.window_charge_rate,
      total: (convertedDimensions.interior_windows || 0) * rates.window_charge_rate,
      labor: 0,
      materials: 0
    },
    
    // Exterior
    exterior_walls: {
      quantity: convertedDimensions.exterior_wall_sqft || 0,
      unit: 'sq ft',
      rate: rates.exterior_wall_charge_rate,
      total: (convertedDimensions.exterior_wall_sqft || 0) * rates.exterior_wall_charge_rate,
      labor: 0,
      materials: 0
    },
    soffits: {
      quantity: convertedDimensions.soffit_sqft || 0,
      unit: 'sq ft',
      rate: rates.soffit_charge_rate,
      total: (convertedDimensions.soffit_sqft || 0) * rates.soffit_charge_rate,
      labor: 0,
      materials: 0
    },
    fascia: {
      quantity: convertedDimensions.fascia_linear_feet || 0,
      unit: 'linear ft',
      rate: rates.fascia_charge_rate,
      total: (convertedDimensions.fascia_linear_feet || 0) * rates.fascia_charge_rate,
      labor: 0,
      materials: 0
    },
    exterior_doors: {
      quantity: convertedDimensions.exterior_doors || 0,
      unit: 'each',
      rate: rates.exterior_door_charge_rate,
      total: (convertedDimensions.exterior_doors || 0) * rates.exterior_door_charge_rate,
      labor: 0,
      materials: 0
    },
    exterior_windows: {
      quantity: convertedDimensions.exterior_windows || 0,
      unit: 'each',
      rate: rates.exterior_window_charge_rate,
      total: (convertedDimensions.exterior_windows || 0) * rates.exterior_window_charge_rate,
      labor: 0,
      materials: 0
    },
    
    // Totals (will be calculated)
    interior_subtotal: 0,
    exterior_subtotal: 0,
    total_charge: 0,
    total_labor: 0,
    total_materials: 0
  };
  
  // Calculate labor and materials for each item
  const items = [
    'walls', 'ceilings', 'baseboards', 'crown_molding', 'interior_doors', 'interior_windows',
    'exterior_walls', 'soffits', 'fascia', 'exterior_doors', 'exterior_windows'
  ] as const;
  
  items.forEach(item => {
    const { labor, materials } = calculateLaborAndMaterials(breakdown[item].total);
    breakdown[item].labor = labor;
    breakdown[item].materials = materials;
  });
  
  // Calculate subtotals
  breakdown.interior_subtotal = 
    breakdown.walls.total +
    breakdown.ceilings.total +
    breakdown.baseboards.total +
    breakdown.crown_molding.total +
    breakdown.interior_doors.total +
    breakdown.interior_windows.total;
    
  breakdown.exterior_subtotal = 
    breakdown.exterior_walls.total +
    breakdown.soffits.total +
    breakdown.fascia.total +
    breakdown.exterior_doors.total +
    breakdown.exterior_windows.total;
    
  breakdown.total_charge = breakdown.interior_subtotal + breakdown.exterior_subtotal;
  
  // Calculate total labor and materials
  breakdown.total_labor = breakdown.total_charge * 0.30;
  breakdown.total_materials = breakdown.total_charge * 0.70;
  
  // Business calculations
  const subtotal = breakdown.total_charge;
  const overhead_amount = subtotal * (businessSettings.overhead_percentage / 100);
  const afterOverhead = subtotal + overhead_amount;
  const markup_amount = afterOverhead * (businessSettings.markup_percentage / 100);
  const total_before_tax = afterOverhead + markup_amount;
  
  // Tax calculation
  let tax_amount = 0;
  if (businessSettings.tax_rate > 0) {
    if (businessSettings.tax_on_materials_only) {
      // Tax only on materials portion
      const materials_with_overhead_markup = breakdown.total_materials * 
        (1 + businessSettings.overhead_percentage / 100) * 
        (1 + businessSettings.markup_percentage / 100);
      tax_amount = materials_with_overhead_markup * (businessSettings.tax_rate / 100);
    } else {
      // Tax on total
      tax_amount = total_before_tax * (businessSettings.tax_rate / 100);
    }
  }
  
  const final_price = total_before_tax + tax_amount;
  
  return {
    dimensions: convertedDimensions,
    rates,
    breakdown,
    subtotal,
    overhead_percentage: businessSettings.overhead_percentage,
    overhead_amount,
    markup_percentage: businessSettings.markup_percentage,
    markup_amount,
    tax_rate: businessSettings.tax_rate,
    tax_on_materials_only: businessSettings.tax_on_materials_only,
    tax_amount,
    tax_label: businessSettings.tax_label,
    total_before_tax,
    final_price,
    labor_cost: breakdown.total_labor,
    materials_cost: breakdown.total_materials
  };
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Helper function to generate a professional quote summary
export const generateQuoteSummary = (quote: ContractorQuote): string => {
  const hasInterior = quote.breakdown.interior_subtotal > 0;
  const hasExterior = quote.breakdown.exterior_subtotal > 0;
  
  let summary = 'QUOTE BREAKDOWN\n\n';
  
  if (hasInterior) {
    summary += 'INTERIOR WORK:\n';
    if (quote.breakdown.walls.quantity > 0) {
      summary += `- Walls: ${quote.breakdown.walls.quantity} sq ft @ ${formatCurrency(quote.breakdown.walls.rate)}/sq ft = ${formatCurrency(quote.breakdown.walls.total)}\n`;
    }
    if (quote.breakdown.ceilings.quantity > 0) {
      summary += `- Ceilings: ${quote.breakdown.ceilings.quantity} sq ft @ ${formatCurrency(quote.breakdown.ceilings.rate)}/sq ft = ${formatCurrency(quote.breakdown.ceilings.total)}\n`;
    }
    if (quote.breakdown.baseboards.quantity > 0) {
      summary += `- Baseboards: ${quote.breakdown.baseboards.quantity} linear ft @ ${formatCurrency(quote.breakdown.baseboards.rate)}/ft = ${formatCurrency(quote.breakdown.baseboards.total)}\n`;
    }
    if (quote.breakdown.crown_molding.quantity > 0) {
      summary += `- Crown Molding: ${quote.breakdown.crown_molding.quantity} linear ft @ ${formatCurrency(quote.breakdown.crown_molding.rate)}/ft = ${formatCurrency(quote.breakdown.crown_molding.total)}\n`;
    }
    if (quote.breakdown.interior_doors.quantity > 0) {
      summary += `- Doors (with jambs): ${quote.breakdown.interior_doors.quantity} @ ${formatCurrency(quote.breakdown.interior_doors.rate)} each = ${formatCurrency(quote.breakdown.interior_doors.total)}\n`;
    }
    if (quote.breakdown.interior_windows.quantity > 0) {
      summary += `- Windows: ${quote.breakdown.interior_windows.quantity} @ ${formatCurrency(quote.breakdown.interior_windows.rate)} each = ${formatCurrency(quote.breakdown.interior_windows.total)}\n`;
    }
    summary += `Interior Subtotal: ${formatCurrency(quote.breakdown.interior_subtotal)}\n\n`;
  }
  
  if (hasExterior) {
    summary += 'EXTERIOR WORK:\n';
    if (quote.breakdown.exterior_walls.quantity > 0) {
      summary += `- Exterior Walls: ${quote.breakdown.exterior_walls.quantity} sq ft @ ${formatCurrency(quote.breakdown.exterior_walls.rate)}/sq ft = ${formatCurrency(quote.breakdown.exterior_walls.total)}\n`;
    }
    if (quote.breakdown.soffits.quantity > 0) {
      summary += `- Soffits: ${quote.breakdown.soffits.quantity} sq ft @ ${formatCurrency(quote.breakdown.soffits.rate)}/sq ft = ${formatCurrency(quote.breakdown.soffits.total)}\n`;
    }
    if (quote.breakdown.fascia.quantity > 0) {
      summary += `- Fascia Boards: ${quote.breakdown.fascia.quantity} linear ft @ ${formatCurrency(quote.breakdown.fascia.rate)}/ft = ${formatCurrency(quote.breakdown.fascia.total)}\n`;
    }
    if (quote.breakdown.exterior_doors.quantity > 0) {
      summary += `- Exterior Doors: ${quote.breakdown.exterior_doors.quantity} @ ${formatCurrency(quote.breakdown.exterior_doors.rate)} each = ${formatCurrency(quote.breakdown.exterior_doors.total)}\n`;
    }
    if (quote.breakdown.exterior_windows.quantity > 0) {
      summary += `- Exterior Windows: ${quote.breakdown.exterior_windows.quantity} @ ${formatCurrency(quote.breakdown.exterior_windows.rate)} each = ${formatCurrency(quote.breakdown.exterior_windows.total)}\n`;
    }
    summary += `Exterior Subtotal: ${formatCurrency(quote.breakdown.exterior_subtotal)}\n\n`;
  }
  
  summary += 'COST BREAKDOWN:\n';
  summary += `Labor (30%): ${formatCurrency(quote.labor_cost)}\n`;
  summary += `Materials (70%): ${formatCurrency(quote.materials_cost)}\n`;
  summary += `Subtotal: ${formatCurrency(quote.subtotal)}\n`;
  
  if (quote.overhead_amount > 0) {
    summary += `Overhead (${quote.overhead_percentage}%): ${formatCurrency(quote.overhead_amount)}\n`;
  }
  if (quote.markup_amount > 0) {
    summary += `Profit Margin (${quote.markup_percentage}%): ${formatCurrency(quote.markup_amount)}\n`;
  }
  
  summary += `Total Before Tax: ${formatCurrency(quote.total_before_tax)}\n`;
  
  if (quote.tax_amount > 0) {
    const taxNote = quote.tax_on_materials_only ? ' (on materials only)' : '';
    summary += `${quote.tax_label} (${quote.tax_rate}%${taxNote}): ${formatCurrency(quote.tax_amount)}\n`;
  }
  
  summary += `\nFINAL TOTAL: ${formatCurrency(quote.final_price)}`;
  
  return summary;
};