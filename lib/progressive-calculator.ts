/**
 * Progressive Calculation System
 * Provides running price estimates as users input data
 * Improves engagement by showing value immediately
 */

import { ProjectDimensions, DEFAULT_CHARGE_RATES, DEFAULT_PAINT_PRODUCTS } from './professional-quote-calculator';

export interface ProgressiveEstimate {
  estimatedPrice: number;
  confidence: 'low' | 'medium' | 'high';
  completeness: number; // 0-100 percentage
  missingData: string[];
  breakdown: {
    materials: number;
    labor: number;
    markup: number;
    total: number;
  };
  suggestedRange: {
    min: number;
    max: number;
  };
}

export interface PartialQuoteData {
  customer_name?: string;
  address?: string;
  project_type?: 'interior' | 'exterior' | 'both';
  selectedSurfaces?: string[];
  dimensions?: Partial<ProjectDimensions>;
  markup_percentage?: number;
  estimatedRoomCount?: number;
  estimatedHomeSize?: 'small' | 'medium' | 'large';
}

/**
 * Calculate a progressive estimate based on available data
 * Returns estimates even with minimal information
 */
export function calculateProgressiveEstimate(
  data: PartialQuoteData,
  rates = DEFAULT_CHARGE_RATES
): ProgressiveEstimate {
  const completeness = calculateCompleteness(data);
  const confidence = getConfidenceLevel(completeness, data);
  const missingData = getMissingDataList(data);
  
  // Base estimation strategies (in order of data availability)
  let estimate: number;
  let breakdown: ProgressiveEstimate['breakdown'];

  if (hasMinimalDimensions(data)) {
    // Strategy 1: Use actual dimensions (highest accuracy)
    const result = calculateFromDimensions(data, rates);
    estimate = result.total;
    breakdown = result.breakdown;
  } else if (hasSurfaceSelection(data)) {
    // Strategy 2: Estimate from surfaces and room count
    const result = estimateFromSurfaces(data, rates);
    estimate = result.total;
    breakdown = result.breakdown;
  } else if (hasBasicInfo(data)) {
    // Strategy 3: Very rough estimate from project type
    const result = estimateFromProjectType(data, rates);
    estimate = result.total;
    breakdown = result.breakdown;
  } else {
    // Strategy 4: Industry average (lowest accuracy)
    const result = getIndustryAverage(data);
    estimate = result.total;
    breakdown = result.breakdown;
  }

  // Apply markup if available
  const markup = data.markup_percentage || 20;
  const markupAmount = estimate * (markup / 100);
  const finalEstimate = estimate + markupAmount;

  // Calculate price range based on confidence
  const rangeVariation = confidence === 'high' ? 0.1 : confidence === 'medium' ? 0.25 : 0.4;
  const suggestedRange = {
    min: Math.round(finalEstimate * (1 - rangeVariation)),
    max: Math.round(finalEstimate * (1 + rangeVariation))
  };

  return {
    estimatedPrice: Math.round(finalEstimate),
    confidence,
    completeness,
    missingData,
    breakdown: {
      materials: Math.round(breakdown.materials),
      labor: Math.round(breakdown.labor),
      markup: Math.round(markupAmount),
      total: Math.round(finalEstimate)
    },
    suggestedRange
  };
}

/**
 * Calculate estimate using actual dimensions (most accurate)
 */
function calculateFromDimensions(data: PartialQuoteData, rates: typeof DEFAULT_CHARGE_RATES) {
  const dims = data.dimensions!;
  const surfaces = data.selectedSurfaces || [];
  
  // Calculate areas
  const wallArea = dims.wall_linear_feet && dims.ceiling_height 
    ? dims.wall_linear_feet * dims.ceiling_height 
    : 0;
  const ceilingArea = dims.ceiling_area || dims.floor_area || 0;
  const doorArea = (dims.number_of_doors || 0) * 20; // Avg door area
  const windowArea = (dims.number_of_windows || 0) * 12; // Avg window area

  let materials = 0;
  let labor = 0;

  // Calculate for selected surfaces
  if (surfaces.includes('walls') && wallArea > 0) {
    const wallPaintCost = (wallArea / 350) * DEFAULT_PAINT_PRODUCTS.wall_paints[1].cost_per_gallon;
    const wallPrimerCost = (wallArea / 400) * DEFAULT_PAINT_PRODUCTS.primer_cost_per_gallon;
    materials += wallPaintCost + wallPrimerCost;
    labor += wallArea * rates.wall_rate_per_sqft;
  }

  if (surfaces.includes('ceilings') && ceilingArea > 0) {
    const ceilingPaintCost = (ceilingArea / 350) * DEFAULT_PAINT_PRODUCTS.ceiling_paints[1].cost_per_gallon;
    materials += ceilingPaintCost;
    labor += ceilingArea * rates.ceiling_rate_per_sqft;
  }

  if (surfaces.includes('trim')) {
    const doors = dims.number_of_doors || 0;
    const windows = dims.number_of_windows || 0;
    const trimPaintCost = ((doors + windows) / 10) * DEFAULT_PAINT_PRODUCTS.trim_paints[1].cost_per_gallon;
    materials += trimPaintCost;
    labor += doors * rates.door_rate_each + windows * rates.window_rate_each;
  }

  const total = materials + labor;

  return {
    total,
    breakdown: { materials, labor, markup: 0, total }
  };
}

/**
 * Estimate from surface selection and room hints
 */
function estimateFromSurfaces(data: PartialQuoteData, rates: typeof DEFAULT_CHARGE_RATES) {
  const surfaces = data.selectedSurfaces || [];
  const roomCount = data.estimatedRoomCount || estimateRoomCount(data);
  const homeSize = data.estimatedHomeSize || estimateHomeSize(data);
  
  // Typical room dimensions based on home size
  const roomSpecs = {
    small: { avgSqft: 150, avgHeight: 8, avgWallArea: 120 },
    medium: { avgSqft: 200, avgHeight: 9, avgWallArea: 160 },
    large: { avgSqft: 300, avgHeight: 10, avgWallArea: 240 }
  };

  const specs = roomSpecs[homeSize];
  const totalFloorArea = roomCount * specs.avgSqft;
  const totalWallArea = roomCount * specs.avgWallArea;
  const totalCeilingArea = totalFloorArea;

  let materials = 0;
  let labor = 0;

  if (surfaces.includes('walls')) {
    const wallPaintCost = (totalWallArea / 350) * DEFAULT_PAINT_PRODUCTS.wall_paints[1].cost_per_gallon;
    const wallPrimerCost = (totalWallArea / 400) * DEFAULT_PAINT_PRODUCTS.primer_cost_per_gallon;
    materials += wallPaintCost + wallPrimerCost;
    labor += totalWallArea * rates.wall_rate_per_sqft;
  }

  if (surfaces.includes('ceilings')) {
    const ceilingPaintCost = (totalCeilingArea / 350) * DEFAULT_PAINT_PRODUCTS.ceiling_paints[1].cost_per_gallon;
    materials += ceilingPaintCost;
    labor += totalCeilingArea * rates.ceiling_rate_per_sqft;
  }

  if (surfaces.includes('trim')) {
    const avgDoorsPerRoom = 1.5;
    const avgWindowsPerRoom = 2;
    const totalDoors = roomCount * avgDoorsPerRoom;
    const totalWindows = roomCount * avgWindowsPerRoom;
    
    const trimPaintCost = ((totalDoors + totalWindows) / 10) * DEFAULT_PAINT_PRODUCTS.trim_paints[1].cost_per_gallon;
    materials += trimPaintCost;
    labor += totalDoors * rates.door_rate_each + totalWindows * rates.window_rate_each;
  }

  const total = materials + labor;

  return {
    total,
    breakdown: { materials, labor, markup: 0, total }
  };
}

/**
 * Rough estimate from project type only
 */
function estimateFromProjectType(data: PartialQuoteData, rates: typeof DEFAULT_CHARGE_RATES) {
  const projectType = data.project_type || 'interior';
  
  // Industry averages per square foot
  const avgCostPerSqft = {
    interior: 3.50,
    exterior: 2.80,
    both: 3.00
  };

  // Assume average home size if no other data
  const estimatedSqft = 1800; // Typical US home
  const baseCost = estimatedSqft * avgCostPerSqft[projectType];
  
  // Rough breakdown (60% labor, 40% materials typical)
  const labor = baseCost * 0.6;
  const materials = baseCost * 0.4;

  return {
    total: baseCost,
    breakdown: { materials, labor, markup: 0, total: baseCost }
  };
}

/**
 * Industry average when no data is available
 */
function getIndustryAverage(data: PartialQuoteData) {
  // National averages for different project types
  const industryAverages = {
    interior: 4500,
    exterior: 3800,
    both: 6500
  };

  const projectType = data.project_type || 'interior';
  const total = industryAverages[projectType];
  
  return {
    total,
    breakdown: { 
      materials: Math.round(total * 0.4), 
      labor: Math.round(total * 0.6), 
      markup: 0, 
      total 
    }
  };
}

/**
 * Helper functions for data analysis
 */
function calculateCompleteness(data: PartialQuoteData): number {
  let score = 0;
  
  if (data.customer_name) score += 5;
  if (data.address) score += 5;
  if (data.project_type) score += 10;
  if (data.selectedSurfaces?.length) score += 15;
  
  // Dimension scoring
  const dims = data.dimensions;
  if (dims?.wall_linear_feet) score += 20;
  if (dims?.ceiling_height) score += 15;
  if (dims?.floor_area || dims?.ceiling_area) score += 15;
  if (dims?.number_of_doors !== undefined) score += 5;
  if (dims?.number_of_windows !== undefined) score += 5;
  
  if (data.markup_percentage) score += 5;
  
  return Math.min(score, 100);
}

function getConfidenceLevel(completeness: number, data: PartialQuoteData): 'low' | 'medium' | 'high' {
  if (completeness >= 80 && hasMinimalDimensions(data)) return 'high';
  if (completeness >= 50 && hasSurfaceSelection(data)) return 'medium';
  return 'low';
}

function getMissingDataList(data: PartialQuoteData): string[] {
  const missing: string[] = [];
  
  if (!data.project_type) missing.push("Project type (interior/exterior)");
  if (!data.selectedSurfaces?.length) missing.push("Surfaces to paint");
  if (!hasMinimalDimensions(data)) {
    missing.push("Room dimensions");
    missing.push("Number of doors and windows");
  }
  
  return missing;
}

function hasMinimalDimensions(data: PartialQuoteData): boolean {
  const dims = data.dimensions;
  return !!(dims?.wall_linear_feet && dims?.ceiling_height && 
            (dims?.floor_area || dims?.ceiling_area));
}

function hasSurfaceSelection(data: PartialQuoteData): boolean {
  return !!(data.selectedSurfaces?.length && data.selectedSurfaces.length > 0);
}

function hasBasicInfo(data: PartialQuoteData): boolean {
  return !!(data.project_type);
}

function estimateRoomCount(data: PartialQuoteData): number {
  // Try to guess room count from available data
  if (data.dimensions?.floor_area) {
    // Assume 200 sqft per room average
    return Math.max(1, Math.round(data.dimensions.floor_area / 200));
  }
  
  // Default based on project type
  const defaults = {
    interior: 4,
    exterior: 1,
    both: 5
  };
  
  return defaults[data.project_type || 'interior'];
}

function estimateHomeSize(data: PartialQuoteData): 'small' | 'medium' | 'large' {
  if (data.dimensions?.floor_area) {
    if (data.dimensions.floor_area < 1200) return 'small';
    if (data.dimensions.floor_area < 2500) return 'medium';
    return 'large';
  }
  
  // Default to medium if no data
  return 'medium';
}

/**
 * Generate user-friendly estimate message
 */
export function generateEstimateMessage(estimate: ProgressiveEstimate): string {
  const { estimatedPrice, confidence, completeness, suggestedRange } = estimate;
  
  let message = "";
  
  if (confidence === 'high') {
    message = `Based on your details, I estimate this project at **$${estimatedPrice.toLocaleString()}**`;
  } else if (confidence === 'medium') {
    message = `With current information, I estimate **$${suggestedRange.min.toLocaleString()} - $${suggestedRange.max.toLocaleString()}**`;
  } else {
    message = `Early estimate: **$${suggestedRange.min.toLocaleString()} - $${suggestedRange.max.toLocaleString()}** (${confidence} confidence)`;
  }
  
  if (completeness < 100) {
    message += `\n\n*Estimate will become more accurate as you provide more details (${completeness}% complete)*`;
  }
  
  return message;
}