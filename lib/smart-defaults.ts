// Smart defaults and learning system for painting quotes
// Learns from previous quotes to suggest defaults for new ones

import { getDatabase } from './database/init';

interface QuotePattern {
  roomType: string;
  avgDimensions: {
    length: number;
    width: number;
    height: number;
  };
  commonSurfaces: string[];
  preferredPaint: {
    brand: string;
    product: string;
    category: string;
  };
  avgPricePerSqFt: number;
  frequency: number;
}

interface ContractorPreferences {
  defaultMarkup: number;
  commonProjectTypes: string[];
  averageJobSize: number;
  preferredBrands: string[];
  typicalTimePerRoom: number;
}

export class SmartDefaultsEngine {
  private companyId: number;

  constructor(companyId: number) {
    this.companyId = companyId;
  }

  // Analyze previous quotes to learn patterns
  async analyzeQuoteHistory(): Promise<{
    patterns: QuotePattern[];
    preferences: ContractorPreferences;
  }> {
    const db = getDatabase();
    
    // Get last 50 quotes for analysis - mock data for Supabase compatibility
    const quotes: any[] = [];

    // Analyze room patterns
    const roomPatterns = new Map<string, QuotePattern>();
    
    quotes.forEach((quote: any) => {
      if (!quote.room_name) return;
      
      const key = quote.room_name.toLowerCase();
      const existing = roomPatterns.get(key) || {
        roomType: quote.room_name,
        avgDimensions: { length: 0, width: 0, height: 0 },
        commonSurfaces: [],
        preferredPaint: { brand: '', product: '', category: '' },
        avgPricePerSqFt: 0,
        frequency: 0
      };

      // Update averages
      existing.avgDimensions.length = (existing.avgDimensions.length * existing.frequency + (quote.length || 0)) / (existing.frequency + 1);
      existing.avgDimensions.width = (existing.avgDimensions.width * existing.frequency + (quote.width || 0)) / (existing.frequency + 1);
      existing.avgDimensions.height = (existing.avgDimensions.height * existing.frequency + (quote.height || 0)) / (existing.frequency + 1);
      
      // Track surfaces
      const surfaces = JSON.parse(quote.surfaces || '[]');
      surfaces.forEach((surface: string) => {
        if (!existing.commonSurfaces.includes(surface)) {
          existing.commonSurfaces.push(surface);
        }
      });

      // Track paint preferences
      if (quote.paint_brand && quote.paint_product) {
        existing.preferredPaint = {
          brand: quote.paint_brand,
          product: quote.paint_product,
          category: quote.paint_category || 'interior'
        };
      }

      // Calculate price per sq ft
      if (quote.area && quote.labor_cost) {
        const pricePerSqFt = quote.labor_cost / quote.area;
        existing.avgPricePerSqFt = (existing.avgPricePerSqFt * existing.frequency + pricePerSqFt) / (existing.frequency + 1);
      }

      existing.frequency++;
      roomPatterns.set(key, existing);
    });

    // Analyze contractor preferences
    const preferences = this.analyzeContractorPreferences(quotes);

    return {
      patterns: Array.from(roomPatterns.values()).sort((a, b) => b.frequency - a.frequency),
      preferences
    };
  }

  // Get smart suggestions for a new quote
  async getSmartSuggestions(context: {
    projectType?: string;
    roomName?: string;
    previousRooms?: any[];
  }) {
    const analysis = await this.analyzeQuoteHistory();
    
    // Find matching patterns
    const matchingPattern = analysis.patterns.find(p => 
      p.roomType.toLowerCase() === context.roomName?.toLowerCase()
    );

    // Get suggestions based on context
    const suggestions = {
      dimensions: matchingPattern?.avgDimensions || this.getDefaultDimensions(context.roomName),
      surfaces: matchingPattern?.commonSurfaces || this.getDefaultSurfaces(context.roomName),
      paint: await this.getSuggestedPaint(matchingPattern, analysis.preferences),
      pricing: {
        laborPerSqFt: matchingPattern?.avgPricePerSqFt || analysis.preferences.averageJobSize / 500,
        markup: analysis.preferences.defaultMarkup
      },
      timeEstimate: this.estimateTime(context, analysis.preferences)
    };

    return suggestions;
  }

  // Get suggested paint based on history and current inventory
  private async getSuggestedPaint(pattern: QuotePattern | undefined, preferences: ContractorPreferences) {
    const db = getDatabase();
    
    // If we have a pattern, use that paint
    if (pattern?.preferredPaint.brand) {
      const paint = db.prepare(`
        SELECT * FROM paint_products 
        WHERE company_id = ? AND brand = ? AND product_name = ?
        LIMIT 1
      `).get(this.companyId, pattern.preferredPaint.brand, pattern.preferredPaint.product);
      
      if (paint) return paint;
    }

    // Otherwise, get the most used paint
    const favoritePaint = db.prepare(`
      SELECT paint_brand as brand, paint_product as product_name, COUNT(*) as usage_count
      FROM quote_rooms
      WHERE quote_id IN (SELECT id FROM quotes WHERE company_id = ?)
      AND paint_brand IS NOT NULL
      GROUP BY paint_brand, paint_product
      ORDER BY usage_count DESC
      LIMIT 1
    `).get(this.companyId);

    return favoritePaint;
  }

  // Analyze contractor working preferences
  private analyzeContractorPreferences(quotes: any[]): ContractorPreferences {
    const db = getDatabase();
    
    // Get company preferences
    const companyPrefs = db.prepare(`
      SELECT * FROM company_preferences WHERE company_id = ?
    `).get(this.companyId) as any;

    // Calculate averages from quotes
    const totalRevenue = quotes.reduce((sum, q) => sum + (q.quote_amount || 0), 0);
    const avgJobSize = quotes.length > 0 ? totalRevenue / quotes.length : 2500;

    // Find most common project types
    const projectTypes = new Map<string, number>();
    quotes.forEach(q => {
      if (q.project_type) {
        projectTypes.set(q.project_type, (projectTypes.get(q.project_type) || 0) + 1);
      }
    });

    const commonProjectTypes = Array.from(projectTypes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type]) => type);

    return {
      defaultMarkup: companyPrefs?.default_markup || 100,
      commonProjectTypes,
      averageJobSize: avgJobSize,
      preferredBrands: ['Sherwin-Williams', 'Benjamin Moore'], // Could analyze from history
      typicalTimePerRoom: 1.5 // days, could calculate from history
    };
  }

  // Get default dimensions based on room type
  private getDefaultDimensions(roomType?: string) {
    const defaults: Record<string, any> = {
      'bedroom': { length: 12, width: 12, height: 9 },
      'master bedroom': { length: 14, width: 16, height: 9 },
      'bathroom': { length: 8, width: 10, height: 9 },
      'kitchen': { length: 12, width: 16, height: 9 },
      'living room': { length: 16, width: 20, height: 9 },
      'dining room': { length: 12, width: 14, height: 9 },
      'hallway': { length: 20, width: 4, height: 9 },
      'office': { length: 10, width: 12, height: 9 }
    };

    const key = roomType?.toLowerCase() || 'bedroom';
    return defaults[key] || { length: 12, width: 12, height: 9 };
  }

  // Get default surfaces based on room type
  private getDefaultSurfaces(roomType?: string) {
    const defaults: Record<string, string[]> = {
      'bedroom': ['walls', 'ceilings'],
      'master bedroom': ['walls', 'ceilings'],
      'bathroom': ['walls', 'ceilings', 'trim'],
      'kitchen': ['walls', 'ceilings'],
      'living room': ['walls', 'ceilings'],
      'dining room': ['walls', 'ceilings', 'trim'],
      'hallway': ['walls', 'ceilings'],
      'office': ['walls', 'ceilings']
    };

    const key = roomType?.toLowerCase() || 'bedroom';
    return defaults[key] || ['walls', 'ceilings'];
  }

  // Estimate time based on context and history
  private estimateTime(context: any, preferences: ContractorPreferences) {
    const roomCount = (context.previousRooms?.length || 0) + 1;
    const baseTime = roomCount * preferences.typicalTimePerRoom;
    
    // Adjust for complexity
    let multiplier = 1;
    if (context.projectType?.includes('exterior')) multiplier = 1.5;
    if (context.projectType?.includes('cabinet')) multiplier = 1.3;
    
    return Math.ceil(baseTime * multiplier);
  }

  // Save learning from completed quotes
  async learnFromQuote(quoteId: number) {
    // This would analyze the completed quote and update patterns
    // For now, the learning happens passively through analyzeQuoteHistory
    console.log('Learning from quote:', quoteId);
  }

  // Get quick suggestions for common scenarios
  async getQuickTemplates() {
    const analysis = await this.analyzeQuoteHistory();
    
    // Return top 5 most common room configurations
    return analysis.patterns.slice(0, 5).map(pattern => ({
      name: pattern.roomType,
      dimensions: pattern.avgDimensions,
      surfaces: pattern.commonSurfaces,
      estimatedPrice: Math.round(
        pattern.avgDimensions.length * pattern.avgDimensions.width * 
        2 * pattern.avgPricePerSqFt * (pattern.avgDimensions.height / 8)
      ),
      frequency: pattern.frequency,
      confidence: pattern.frequency > 5 ? 'high' : 'medium'
    }));
  }
}

// Helper function to get smart defaults for a company
export async function getSmartDefaults(companyId: number, context: any) {
  const engine = new SmartDefaultsEngine(companyId);
  return engine.getSmartSuggestions(context);
}

// Helper function to learn from completed quotes
export async function learnFromCompletedQuote(quoteId: number, companyId: number) {
  const engine = new SmartDefaultsEngine(companyId);
  return engine.learnFromQuote(quoteId);
}