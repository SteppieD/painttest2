// Paint Calculator Engine
// Handles all painting calculation logic for different calculator types

export interface PaintCalculationInput {
  type: 'interior' | 'exterior' | 'commercial' | 'cabinet'
  dimensions: {
    length?: number
    width?: number
    height?: number
    linearFeet?: number
    doors?: number
    windows?: number
    cabinetCount?: number
  }
  surfaces: {
    walls?: boolean
    ceiling?: boolean
    trim?: boolean
    doors?: boolean
    windows?: boolean
    siding?: boolean
    soffit?: boolean
    fascia?: boolean
    floors?: boolean
  }
  paintQuality: 'economy' | 'standard' | 'premium'
  coats: number
  laborRate?: number // Optional custom labor rate
  paintCoverage?: number // Optional custom coverage per gallon
}

export interface PaintCalculationResult {
  // Paint calculations
  totalArea: number
  paintNeeded: {
    gallons: number
    liters: number
  }
  coverage: number
  
  // Cost breakdown
  costs: {
    paint: number
    labor: number
    supplies: number
    subtotal: number
    overhead: number
    profit: number
    total: number
  }
  
  // Time estimates
  timeEstimates: {
    prepHours: number
    paintingHours: number
    totalHours: number
    totalDays: number
  }
  
  // Breakdown by surface
  breakdown: {
    [key: string]: {
      area: number
      paintGallons: number
      laborHours: number
      cost: number
    }
  }
  
  // Recommendations
  recommendations: {
    paintType: string
    primerNeeded: boolean
    sheenType: string
    brandSuggestions: string[]
  }
}

// Constants for calculations
const PAINT_PRICES = {
  economy: { min: 25, max: 35, avg: 30 },
  standard: { min: 40, max: 55, avg: 47.5 },
  premium: { min: 60, max: 80, avg: 70 }
}

const COVERAGE_SQFT_PER_GALLON = {
  smooth: 400,
  standard: 350,
  textured: 300,
  rough: 250
}

const LABOR_RATES = {
  interior: {
    walls: 175, // sq ft per hour
    ceiling: 125, // sq ft per hour
    trim: 60, // linear feet per hour
    doors: 0.75, // hours per door
    windows: 0.5 // hours per window
  },
  exterior: {
    siding: 150, // sq ft per hour
    soffit: 100, // sq ft per hour
    fascia: 50, // linear feet per hour
    trim: 40, // linear feet per hour
  },
  commercial: {
    walls: 200, // sq ft per hour (larger areas, more efficient)
    ceiling: 150, // sq ft per hour
    floors: 250, // sq ft per hour (epoxy)
  },
  cabinet: {
    door: 0.5, // hours per door
    drawer: 0.25, // hours per drawer
    frame: 1, // hours per linear section
  }
}

const DEFAULT_LABOR_RATE = 50 // $ per hour
const SUPPLIES_MULTIPLIER = 0.15 // 15% of paint cost
const OVERHEAD_PERCENTAGE = 0.15 // 15%
const PROFIT_PERCENTAGE = 0.25 // 25%

export function calculatePaintingProject(input: PaintCalculationInput): PaintCalculationResult {
  // Initialize result structure
  const result: PaintCalculationResult = {
    totalArea: 0,
    paintNeeded: { gallons: 0, liters: 0 },
    coverage: COVERAGE_SQFT_PER_GALLON.standard,
    costs: {
      paint: 0,
      labor: 0,
      supplies: 0,
      subtotal: 0,
      overhead: 0,
      profit: 0,
      total: 0
    },
    timeEstimates: {
      prepHours: 0,
      paintingHours: 0,
      totalHours: 0,
      totalDays: 0
    },
    breakdown: {},
    recommendations: {
      paintType: '',
      primerNeeded: false,
      sheenType: '',
      brandSuggestions: []
    }
  }
  
  // Calculate based on type
  switch (input.type) {
    case 'interior':
      calculateInterior(input, result)
      break
    case 'exterior':
      calculateExterior(input, result)
      break
    case 'commercial':
      calculateCommercial(input, result)
      break
    case 'cabinet':
      calculateCabinet(input, result)
      break
  }
  
  // Calculate paint needed
  result.coverage = input.paintCoverage || COVERAGE_SQFT_PER_GALLON.standard
  result.paintNeeded.gallons = Math.ceil((result.totalArea * input.coats) / result.coverage)
  result.paintNeeded.liters = Math.round(result.paintNeeded.gallons * 3.785)
  
  // Calculate costs
  const paintPrice = PAINT_PRICES[input.paintQuality].avg
  result.costs.paint = result.paintNeeded.gallons * paintPrice
  
  const laborRate = input.laborRate || DEFAULT_LABOR_RATE
  result.costs.labor = result.timeEstimates.totalHours * laborRate
  
  result.costs.supplies = result.costs.paint * SUPPLIES_MULTIPLIER
  result.costs.subtotal = result.costs.paint + result.costs.labor + result.costs.supplies
  result.costs.overhead = result.costs.subtotal * OVERHEAD_PERCENTAGE
  result.costs.profit = result.costs.subtotal * PROFIT_PERCENTAGE
  result.costs.total = result.costs.subtotal + result.costs.overhead + result.costs.profit
  
  // Add recommendations
  generateRecommendations(input, result)
  
  return result
}

function calculateInterior(input: PaintCalculationInput, result: PaintCalculationResult) {
  const { dimensions, surfaces } = input
  
  if (surfaces.walls && dimensions.length && dimensions.width && dimensions.height) {
    const wallArea = 2 * (dimensions.length + dimensions.width) * dimensions.height
    const adjustedWallArea = wallArea * 0.9 // 10% deduction for doors/windows
    
    result.totalArea += adjustedWallArea
    result.timeEstimates.paintingHours += adjustedWallArea / LABOR_RATES.interior.walls
    
    result.breakdown.walls = {
      area: adjustedWallArea,
      paintGallons: (adjustedWallArea * input.coats) / result.coverage,
      laborHours: adjustedWallArea / LABOR_RATES.interior.walls,
      cost: 0 // Calculated later
    }
  }
  
  if (surfaces.ceiling && dimensions.length && dimensions.width) {
    const ceilingArea = dimensions.length * dimensions.width
    
    result.totalArea += ceilingArea
    result.timeEstimates.paintingHours += ceilingArea / LABOR_RATES.interior.ceiling
    
    result.breakdown.ceiling = {
      area: ceilingArea,
      paintGallons: (ceilingArea * input.coats) / result.coverage,
      laborHours: ceilingArea / LABOR_RATES.interior.ceiling,
      cost: 0
    }
  }
  
  if (surfaces.trim && dimensions.length && dimensions.width) {
    const trimLinearFeet = 2 * (dimensions.length + dimensions.width)
    const trimArea = trimLinearFeet * 0.5 // Approximate sq ft conversion
    
    result.totalArea += trimArea
    result.timeEstimates.paintingHours += trimLinearFeet / LABOR_RATES.interior.trim
    
    result.breakdown.trim = {
      area: trimArea,
      paintGallons: (trimArea * input.coats) / result.coverage,
      laborHours: trimLinearFeet / LABOR_RATES.interior.trim,
      cost: 0
    }
  }
  
  if (surfaces.doors && dimensions.doors) {
    const doorArea = dimensions.doors * 20 // 20 sq ft per door average
    
    result.totalArea += doorArea
    result.timeEstimates.paintingHours += dimensions.doors * LABOR_RATES.interior.doors
    
    result.breakdown.doors = {
      area: doorArea,
      paintGallons: (doorArea * input.coats) / result.coverage,
      laborHours: dimensions.doors * LABOR_RATES.interior.doors,
      cost: 0
    }
  }
  
  // Add prep time (20% of painting time for interior)
  result.timeEstimates.prepHours = result.timeEstimates.paintingHours * 0.2
  result.timeEstimates.totalHours = result.timeEstimates.prepHours + result.timeEstimates.paintingHours
  result.timeEstimates.totalDays = Math.ceil(result.timeEstimates.totalHours / 8)
}

function calculateExterior(input: PaintCalculationInput, result: PaintCalculationResult) {
  const { dimensions, surfaces } = input
  
  if (surfaces.siding && dimensions.length && dimensions.width && dimensions.height) {
    // Exterior calculation assumes perimeter × height
    const perimeter = 2 * (dimensions.length + dimensions.width)
    const sidingArea = perimeter * dimensions.height * 0.85 // 15% deduction for openings
    
    result.totalArea += sidingArea
    result.timeEstimates.paintingHours += sidingArea / LABOR_RATES.exterior.siding
    
    result.breakdown.siding = {
      area: sidingArea,
      paintGallons: (sidingArea * input.coats) / result.coverage,
      laborHours: sidingArea / LABOR_RATES.exterior.siding,
      cost: 0
    }
  }
  
  if (surfaces.soffit && dimensions.length && dimensions.width) {
    // Soffit area - assume 2 ft overhang on all sides
    const soffitArea = 2 * (dimensions.length + dimensions.width + 4) * 2 // 2 ft overhang
    
    result.totalArea += soffitArea
    result.timeEstimates.paintingHours += soffitArea / LABOR_RATES.exterior.soffit
    
    result.breakdown.soffit = {
      area: soffitArea,
      paintGallons: (soffitArea * input.coats) / result.coverage,
      laborHours: soffitArea / LABOR_RATES.exterior.soffit,
      cost: 0
    }
  }
  
  if (surfaces.fascia && dimensions.length && dimensions.width) {
    // Fascia linear feet - perimeter of house
    const fasciaLinearFeet = 2 * (dimensions.length + dimensions.width)
    const fasciaArea = fasciaLinearFeet * 1 // Assume 1 ft height
    
    result.totalArea += fasciaArea
    result.timeEstimates.paintingHours += fasciaLinearFeet / LABOR_RATES.exterior.fascia
    
    result.breakdown.fascia = {
      area: fasciaArea,
      paintGallons: (fasciaArea * input.coats) / result.coverage,
      laborHours: fasciaLinearFeet / LABOR_RATES.exterior.fascia,
      cost: 0
    }
  }
  
  if (surfaces.trim && dimensions.length && dimensions.width && dimensions.height) {
    // Exterior trim - estimate based on windows and corners
    const trimLinearFeet = dimensions.height * 4 + (dimensions.windows || 0) * 15 // Corner trim + window trim
    const trimArea = trimLinearFeet * 0.5 // Average 6 inch width
    
    result.totalArea += trimArea
    result.timeEstimates.paintingHours += trimLinearFeet / LABOR_RATES.exterior.trim
    
    result.breakdown.trim = {
      area: trimArea,
      paintGallons: (trimArea * input.coats) / result.coverage,
      laborHours: trimLinearFeet / LABOR_RATES.exterior.trim,
      cost: 0
    }
  }
  
  if (surfaces.doors && dimensions.doors) {
    const doorArea = dimensions.doors * 30 // 30 sq ft per exterior door (larger than interior)
    
    result.totalArea += doorArea
    result.timeEstimates.paintingHours += dimensions.doors * 1 // 1 hour per exterior door
    
    result.breakdown.doors = {
      area: doorArea,
      paintGallons: (doorArea * input.coats) / result.coverage,
      laborHours: dimensions.doors * 1,
      cost: 0
    }
  }
  
  if (surfaces.windows && dimensions.windows) {
    const windowTrimArea = dimensions.windows * 10 // 10 sq ft per window trim
    
    result.totalArea += windowTrimArea
    result.timeEstimates.paintingHours += dimensions.windows * 0.3 // 20 min per window
    
    result.breakdown['window trim'] = {
      area: windowTrimArea,
      paintGallons: (windowTrimArea * input.coats) / result.coverage,
      laborHours: dimensions.windows * 0.3,
      cost: 0
    }
  }
  
  // Add 30% prep time for exterior (power washing, scraping, etc.)
  result.timeEstimates.prepHours = result.timeEstimates.paintingHours * 0.3
  result.timeEstimates.totalHours = result.timeEstimates.prepHours + result.timeEstimates.paintingHours
  result.timeEstimates.totalDays = Math.ceil(result.timeEstimates.totalHours / 8)
}

function calculateCommercial(input: PaintCalculationInput, result: PaintCalculationResult) {
  // Commercial calculations typically deal with larger areas
  const { dimensions, surfaces } = input
  
  if (surfaces.walls && dimensions.length && dimensions.width && dimensions.height) {
    const wallArea = 2 * (dimensions.length + dimensions.width) * dimensions.height
    
    result.totalArea += wallArea
    result.timeEstimates.paintingHours += wallArea / LABOR_RATES.commercial.walls
    
    result.breakdown.walls = {
      area: wallArea,
      paintGallons: (wallArea * input.coats) / result.coverage,
      laborHours: wallArea / LABOR_RATES.commercial.walls,
      cost: 0
    }
  }
  
  if (surfaces.ceiling && dimensions.length && dimensions.width) {
    const ceilingArea = dimensions.length * dimensions.width
    
    result.totalArea += ceilingArea
    result.timeEstimates.paintingHours += ceilingArea / LABOR_RATES.commercial.ceiling
    
    result.breakdown.ceiling = {
      area: ceilingArea,
      paintGallons: (ceilingArea * input.coats) / result.coverage,
      laborHours: ceilingArea / LABOR_RATES.commercial.ceiling,
      cost: 0
    }
  }
  
  if (surfaces.trim && dimensions.length && dimensions.width) {
    const trimLinearFeet = 2 * (dimensions.length + dimensions.width)
    const trimArea = trimLinearFeet * 0.5 // Approximate sq ft conversion
    
    result.totalArea += trimArea
    result.timeEstimates.paintingHours += trimLinearFeet / LABOR_RATES.interior.trim
    
    result.breakdown.trim = {
      area: trimArea,
      paintGallons: (trimArea * input.coats) / result.coverage,
      laborHours: trimLinearFeet / LABOR_RATES.interior.trim,
      cost: 0
    }
  }
  
  if (surfaces.doors && dimensions.doors) {
    const doorArea = dimensions.doors * 30 // 30 sq ft per commercial door (larger)
    
    result.totalArea += doorArea
    result.timeEstimates.paintingHours += dimensions.doors * 1 // 1 hour per commercial door
    
    result.breakdown.doors = {
      area: doorArea,
      paintGallons: (doorArea * input.coats) / result.coverage,
      laborHours: dimensions.doors * 1,
      cost: 0
    }
  }
  
  // Special handling for floor coating (epoxy)
  if (surfaces.floors && dimensions.length && dimensions.width) {
    const floorArea = dimensions.length * dimensions.width
    
    result.totalArea += floorArea
    result.timeEstimates.paintingHours += floorArea / LABOR_RATES.commercial.floors
    
    result.breakdown.floors = {
      area: floorArea,
      paintGallons: (floorArea * input.coats) / result.coverage,
      laborHours: floorArea / LABOR_RATES.commercial.floors,
      cost: 0
    }
  }
  
  // Minimal prep for commercial (10%)
  result.timeEstimates.prepHours = result.timeEstimates.paintingHours * 0.1
  result.timeEstimates.totalHours = result.timeEstimates.prepHours + result.timeEstimates.paintingHours
  result.timeEstimates.totalDays = Math.ceil(result.timeEstimates.totalHours / 8)
}

function calculateCabinet(input: PaintCalculationInput, result: PaintCalculationResult) {
  const { dimensions } = input
  
  if (dimensions.cabinetCount) {
    // Assume average cabinet has 2 doors and 2 drawers
    const doors = dimensions.cabinetCount * 2
    const drawers = dimensions.cabinetCount * 2
    const frames = dimensions.cabinetCount
    
    // Cabinet surface area approximation
    const cabinetArea = dimensions.cabinetCount * 30 // 30 sq ft per cabinet average
    
    result.totalArea += cabinetArea
    result.timeEstimates.paintingHours += 
      (doors * LABOR_RATES.cabinet.door) +
      (drawers * LABOR_RATES.cabinet.drawer) +
      (frames * LABOR_RATES.cabinet.frame)
    
    result.breakdown.cabinets = {
      area: cabinetArea,
      paintGallons: (cabinetArea * input.coats) / result.coverage,
      laborHours: result.timeEstimates.paintingHours,
      cost: 0
    }
  }
  
  // Extensive prep for cabinets (50%)
  result.timeEstimates.prepHours = result.timeEstimates.paintingHours * 0.5
  result.timeEstimates.totalHours = result.timeEstimates.prepHours + result.timeEstimates.paintingHours
  result.timeEstimates.totalDays = Math.ceil(result.timeEstimates.totalHours / 8)
}

function generateRecommendations(input: PaintCalculationInput, result: PaintCalculationResult) {
  // Paint type recommendations
  switch (input.type) {
    case 'interior':
      result.recommendations.paintType = 'Acrylic Latex'
      result.recommendations.sheenType = input.surfaces?.ceiling ? 'Flat for ceilings, Eggshell for walls' : 'Eggshell or Satin'
      result.recommendations.primerNeeded = input.coats === 1
      break
    case 'exterior':
      result.recommendations.paintType = '100% Acrylic'
      result.recommendations.sheenType = 'Satin or Semi-Gloss'
      result.recommendations.primerNeeded = true
      break
    case 'commercial':
      result.recommendations.paintType = 'Commercial-Grade Acrylic'
      result.recommendations.sheenType = 'Semi-Gloss or Gloss'
      result.recommendations.primerNeeded = false
      break
    case 'cabinet':
      result.recommendations.paintType = 'Alkyd or Hybrid Enamel'
      result.recommendations.sheenType = 'Semi-Gloss or Gloss'
      result.recommendations.primerNeeded = true
      break
  }
  
  // Brand suggestions based on quality level
  switch (input.paintQuality) {
    case 'economy':
      result.recommendations.brandSuggestions = ['Behr Pro', 'Valspar Pro', 'Glidden Professional']
      break
    case 'standard':
      result.recommendations.brandSuggestions = ['Benjamin Moore Ben', 'Sherwin-Williams SuperPaint', 'PPG Diamond']
      break
    case 'premium':
      result.recommendations.brandSuggestions = ['Benjamin Moore Aura', 'Sherwin-Williams Emerald', 'Farrow & Ball']
      break
  }
}

// Helper function to format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Helper function to validate input
export function validateCalculatorInput(input: Partial<PaintCalculationInput>): string[] {
  const errors: string[] = []
  
  if (!input.type) {
    errors.push('Calculator type is required')
  }
  
  if (!input.dimensions) {
    errors.push('Dimensions are required')
  }
  
  if (!input.surfaces || !Object.values(input.surfaces).some(v => v)) {
    errors.push('At least one surface must be selected')
  }
  
  if (!input.paintQuality) {
    errors.push('Paint quality selection is required')
  }
  
  if (!input.coats || input.coats < 1 || input.coats > 5) {
    errors.push('Number of coats must be between 1 and 5')
  }
  
  return errors
}