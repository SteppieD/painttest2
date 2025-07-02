/**
 * Unified Quote Calculator
 * 
 * Single source of truth for all quote calculations
 * Replaces multiple calculation implementations with one consistent engine
 */

import { 
  UnifiedQuoteData, 
  QuoteCalculationRequest, 
  PricingDetails, 
  ProjectMeasurements,
  ProductSelections,
  PaintProduct
} from './unified-quote-types';

export class UnifiedQuoteCalculator {
  
  /**
   * Calculate complete quote pricing from measurements and products
   */
  static calculateQuote(request: QuoteCalculationRequest): PricingDetails {
    const { measurements, products, companyDefaults, overrides = {} } = request;
    
    // Apply rate overrides
    const rates = {
      walls: overrides.wallsRate ?? companyDefaults.wallsRate,
      ceilings: overrides.ceilingsRate ?? companyDefaults.ceilingsRate,
      trim: overrides.trimRate ?? companyDefaults.trimRate
    };
    
    const markupPercentage = overrides.markupPercentage ?? companyDefaults.markupPercentage;
    const taxRate = companyDefaults.taxRate;
    
    // Calculate labor costs
    const wallsLaborCost = measurements.totalWallsSqft * rates.walls;
    const ceilingsLaborCost = measurements.totalCeilingsSqft * rates.ceilings;
    const trimLaborCost = measurements.totalTrimSqft * rates.trim;
    const totalLaborCost = wallsLaborCost + ceilingsLaborCost + trimLaborCost;
    
    // Calculate material costs
    const materialCosts = this.calculateMaterialCosts(measurements, products);
    const totalMaterialCost = materialCosts.walls + materialCosts.ceilings + materialCosts.trim + materialCosts.sundries;
    
    // Calculate subtotal and markup
    const subtotal = totalLaborCost + totalMaterialCost;
    const markupAmount = subtotal * (markupPercentage / 100);
    const afterMarkup = subtotal + markupAmount;
    
    // Calculate tax and final price
    const taxAmount = afterMarkup * (taxRate / 100);
    const finalPrice = afterMarkup + taxAmount;
    
    return {
      wallsRate: rates.walls,
      ceilingsRate: rates.ceilings,
      trimRate: rates.trim,
      totalMaterialCost,
      totalLaborCost,
      subtotal,
      markupPercentage,
      markupAmount,
      taxRate,
      taxAmount,
      finalPrice,
      breakdown: {
        wallsCost: wallsLaborCost + materialCosts.walls,
        ceilingsCost: ceilingsLaborCost + materialCosts.ceilings,
        trimCost: trimLaborCost + materialCosts.trim,
        sundries: materialCosts.sundries,
        profit: markupAmount
      }
    };
  }
  
  /**
   * Calculate material costs based on measurements and product selections
   */
  private static calculateMaterialCosts(
    measurements: ProjectMeasurements, 
    products: ProductSelections
  ): {
    walls: number;
    ceilings: number;
    trim: number;
    sundries: number;
  } {
    const STANDARD_COVERAGE = 350; // sq ft per gallon
    const SUNDRIES_PERCENTAGE = 0.12; // 12% of material costs for brushes, rollers, etc.
    
    // Calculate paint needed (in gallons)
    const wallsGallons = Math.ceil(measurements.totalWallsSqft / STANDARD_COVERAGE);
    const ceilingsGallons = Math.ceil(measurements.totalCeilingsSqft / STANDARD_COVERAGE);
    const trimGallons = Math.ceil(measurements.totalTrimSqft / STANDARD_COVERAGE);
    
    // Get paint costs (use defaults if no specific products selected)
    const wallPaintCost = products.wallPaint ? 
      wallsGallons * products.wallPaint.costPerGallon :
      wallsGallons * this.getDefaultPaintCost('wall_paint', products.paintQuality);
      
    const ceilingPaintCost = products.ceilingPaint ? 
      ceilingsGallons * products.ceilingPaint.costPerGallon :
      ceilingsGallons * this.getDefaultPaintCost('ceiling_paint', products.paintQuality);
      
    const trimPaintCost = products.trimPaint ? 
      trimGallons * products.trimPaint.costPerGallon :
      trimGallons * this.getDefaultPaintCost('trim_paint', products.paintQuality);
    
    // Add primer cost if needed
    let primerCost = 0;
    if (products.primer) {
      const totalSqft = measurements.totalWallsSqft + measurements.totalCeilingsSqft;
      const primerGallons = Math.ceil(totalSqft / STANDARD_COVERAGE);
      primerCost = primerGallons * products.primer.costPerGallon;
    }
    
    const totalPaintCost = wallPaintCost + ceilingPaintCost + trimPaintCost + primerCost;
    const sundriesCost = totalPaintCost * SUNDRIES_PERCENTAGE;
    
    return {
      walls: wallPaintCost,
      ceilings: ceilingPaintCost,
      trim: trimPaintCost,
      sundries: sundriesCost
    };
  }
  
  /**
   * Get default paint costs by quality level
   */
  private static getDefaultPaintCost(
    category: 'primer' | 'wall_paint' | 'ceiling_paint' | 'trim_paint',
    quality: 'good' | 'better' | 'best' | 'premium' = 'better'
  ): number {
    const costs = {
      primer: {
        good: 25,
        better: 30,
        best: 35,
        premium: 40
      },
      wall_paint: {
        good: 35,
        better: 45,
        best: 60,
        premium: 75
      },
      ceiling_paint: {
        good: 30,
        better: 40,
        best: 55,
        premium: 70
      },
      trim_paint: {
        good: 40,
        better: 55,
        best: 70,
        premium: 85
      }
    };
    
    return costs[category][quality];
  }
  
  /**
   * Estimate measurements from simple inputs
   * For when detailed room measurements aren't available
   */
  static estimateMeasurements(
    totalSqft: number,
    projectType: 'interior' | 'exterior' | 'both' = 'interior'
  ): ProjectMeasurements {
    // Estimation formulas based on industry standards
    let wallsSqft: number;
    let ceilingsSqft: number;
    let trimSqft: number;
    
    if (projectType === 'interior') {
      // Interior assumptions: walls = 2.5x floor space, ceilings = floor space, trim = 0.5x floor space
      wallsSqft = Math.round(totalSqft * 2.5);
      ceilingsSqft = totalSqft;
      trimSqft = Math.round(totalSqft * 0.5);
    } else {
      // Exterior assumptions: different ratios
      wallsSqft = Math.round(totalSqft * 1.8);
      ceilingsSqft = 0; // No ceilings in exterior
      trimSqft = Math.round(totalSqft * 0.3);
    }
    
    return {
      totalWallsSqft: wallsSqft,
      totalCeilingsSqft: ceilingsSqft,
      totalTrimSqft: trimSqft,
      rooms: [{
        name: 'Estimated Area',
        type: 'other',
        wallsSquareFootage: wallsSqft,
        ceilingsSquareFootage: ceilingsSqft,
        trimSquareFootage: trimSqft
      }]
    };
  }
  
  /**
   * Calculate quote from minimal information (for quick quotes)
   */
  static calculateQuickQuote(
    totalSqft: number,
    paintQuality: 'good' | 'better' | 'best' | 'premium',
    companyDefaults: {
      wallsRate: number;
      ceilingsRate: number;
      trimRate: number;
      markupPercentage: number;
      taxRate: number;
    },
    projectType: 'interior' | 'exterior' | 'both' = 'interior'
  ): PricingDetails {
    const measurements = this.estimateMeasurements(totalSqft, projectType);
    const products: ProductSelections = { paintQuality };
    
    return this.calculateQuote({
      measurements,
      products,
      companyDefaults
    });
  }
  
  /**
   * Recalculate pricing when quote data changes
   */
  static recalculateQuote(
    quoteData: UnifiedQuoteData,
    changes: {
      measurements?: Partial<ProjectMeasurements>;
      products?: Partial<ProductSelections>;
      rateOverrides?: { walls?: number; ceilings?: number; trim?: number; };
      markupOverride?: number;
    }
  ): PricingDetails {
    // Merge changes with existing data
    const updatedMeasurements = {
      ...quoteData.measurements,
      ...changes.measurements
    };
    
    const updatedProducts = {
      ...quoteData.products,
      ...changes.products
    };
    
    // Extract company defaults from existing quote
    const companyDefaults = {
      wallsRate: quoteData.pricing.wallsRate,
      ceilingsRate: quoteData.pricing.ceilingsRate,
      trimRate: quoteData.pricing.trimRate,
      markupPercentage: quoteData.pricing.markupPercentage,
      taxRate: quoteData.pricing.taxRate
    };
    
    const overrides = {
      ...changes.rateOverrides,
      markupPercentage: changes.markupOverride
    };
    
    return this.calculateQuote({
      measurements: updatedMeasurements,
      products: updatedProducts,
      companyDefaults,
      overrides
    });
  }
  
  /**
   * Validate measurement data
   */
  static validateMeasurements(measurements: ProjectMeasurements): {
    isValid: boolean;
    warnings: string[];
    errors: string[];
  } {
    const warnings: string[] = [];
    const errors: string[] = [];
    
    // Check for negative values
    if (measurements.totalWallsSqft < 0) errors.push('Walls square footage cannot be negative');
    if (measurements.totalCeilingsSqft < 0) errors.push('Ceilings square footage cannot be negative');
    if (measurements.totalTrimSqft < 0) errors.push('Trim square footage cannot be negative');
    
    // Check for unrealistic values
    if (measurements.totalWallsSqft > 10000) warnings.push('Walls square footage is unusually large');
    if (measurements.totalCeilingsSqft > 5000) warnings.push('Ceilings square footage is unusually large');
    if (measurements.totalTrimSqft > 2000) warnings.push('Trim square footage is unusually large');
    
    // Check if measurements are too small
    if (measurements.totalWallsSqft < 50) warnings.push('Walls square footage seems very small');
    
    // Check room measurements consistency
    const calculatedTotals = measurements.rooms.reduce(
      (acc, room) => ({
        walls: acc.walls + room.wallsSquareFootage,
        ceilings: acc.ceilings + room.ceilingsSquareFootage,
        trim: acc.trim + room.trimSquareFootage
      }),
      { walls: 0, ceilings: 0, trim: 0 }
    );
    
    const tolerance = 0.1; // 10% tolerance
    if (Math.abs(calculatedTotals.walls - measurements.totalWallsSqft) / measurements.totalWallsSqft > tolerance) {
      warnings.push('Room wall measurements don\'t match total walls');
    }
    
    return {
      isValid: errors.length === 0,
      warnings,
      errors
    };
  }
  
  /**
   * Get cost breakdown summary for display
   */
  static getCostBreakdownSummary(pricing: PricingDetails): {
    categories: Array<{ name: string; amount: number; percentage: number }>;
    totals: { materials: number; labor: number; markup: number; tax: number };
  } {
    const categories = [
      {
        name: 'Walls',
        amount: pricing.breakdown.wallsCost,
        percentage: (pricing.breakdown.wallsCost / pricing.finalPrice) * 100
      },
      {
        name: 'Ceilings', 
        amount: pricing.breakdown.ceilingsCost,
        percentage: (pricing.breakdown.ceilingsCost / pricing.finalPrice) * 100
      },
      {
        name: 'Trim',
        amount: pricing.breakdown.trimCost,
        percentage: (pricing.breakdown.trimCost / pricing.finalPrice) * 100
      },
      {
        name: 'Sundries',
        amount: pricing.breakdown.sundries,
        percentage: (pricing.breakdown.sundries / pricing.finalPrice) * 100
      },
      {
        name: 'Profit',
        amount: pricing.breakdown.profit,
        percentage: (pricing.breakdown.profit / pricing.finalPrice) * 100
      },
      {
        name: 'Tax',
        amount: pricing.taxAmount,
        percentage: (pricing.taxAmount / pricing.finalPrice) * 100
      }
    ];
    
    return {
      categories,
      totals: {
        materials: pricing.totalMaterialCost,
        labor: pricing.totalLaborCost,
        markup: pricing.markupAmount,
        tax: pricing.taxAmount
      }
    };
  }
}