/**
 * Learning Profile System
 * 
 * Extracts and saves contractor preferences from every conversation
 * to make future quotes faster and more personalized
 */

export interface LearningData {
  paintBrands?: string[];
  paintProducts?: Array<{
    name: string;
    cost: number;
    category: string;
  }>;
  rates?: Array<{
    rate: number;
    type: string; // 'sqft', 'linear', 'per_door', etc.
    surface: string; // 'wall', 'ceiling', 'trim'
    context: string;
  }>;
  markupPreferences?: number[];
  projectTypes?: string[];
  commonMeasurements?: Array<{
    type: string;
    value: number;
    unit: string;
  }>;
  customerTypes?: string[];
  timeline?: string[];
  qualityPreferences?: string[];
}

export interface ContractorProfile {
  companyId: string;
  preferredBrands: string[];
  preferredProducts: Array<{
    category: string;
    name: string;
    cost: number;
    frequency: number;
  }>;
  averageRates: {
    wallRatePerSqft: number;
    ceilingRatePerSqft: number;
    trimRatePerLinearFt: number;
    doorRateEach: number;
    windowRateEach: number;
  };
  preferredMarkup: number;
  commonProjectTypes: string[];
  learningStats: {
    quotesAnalyzed: number;
    lastUpdated: string;
    confidenceScore: number;
  };
}

/**
 * Extract learning data from any conversation message
 */
export function extractLearningData(content: string): LearningData {
  const learningData: LearningData = {};
  const lowerContent = content.toLowerCase();
  
  // Extract paint brands mentioned
  const paintBrands = [
    'sherwin williams', 'sherwin-williams', 'benjamin moore', 'behr', 'valspar', 
    'kilz', 'zinsser', 'proclassic', 'duration', 'superpaint', 'cashmere',
    'regal', 'advance', 'cabinet coat', 'primer', 'ultra spec'
  ];
  
  const foundBrands: string[] = [];
  paintBrands.forEach(brand => {
    if (lowerContent.includes(brand)) {
      foundBrands.push(brand);
    }
  });
  
  if (foundBrands.length > 0) {
    learningData.paintBrands = foundBrands;
  }
  
  // Extract specific paint products with costs
  const productMatches = content.match(/([A-Za-z\s]+)(?:\s+at\s+|\s+@\s+|\s+-\s+)\$(\d+(?:\.\d{2})?)\s*(?:per\s+gallon|\/gal)/gi);
  if (productMatches) {
    learningData.paintProducts = productMatches.map(match => {
      const parts = match.split(/(?:\s+at\s+|\s+@\s+|\s+-\s+)/i);
      const name = parts[0].trim();
      const costMatch = match.match(/\$(\d+(?:\.\d{2})?)/);
      const cost = costMatch ? parseFloat(costMatch[1]) : 0;
      
      // Determine category based on keywords
      let category = 'wall_paint';
      if (name.toLowerCase().includes('primer')) category = 'primer';
      else if (name.toLowerCase().includes('ceiling')) category = 'ceiling_paint';
      else if (name.toLowerCase().includes('trim')) category = 'trim_paint';
      
      return { name, cost, category };
    });
  }
  
  // Extract rates mentioned
  const ratePatterns = [
    /\$(\d+(?:\.\d{2})?)\s*(?:per\s+)?(?:sq\s*ft|square\s*foot|sqft)/gi,
    /\$(\d+(?:\.\d{2})?)\s*(?:per\s+)?(?:linear\s*foot|linear\s*ft|lf)/gi,
    /\$(\d+(?:\.\d{2})?)\s*(?:per\s+)?door/gi,
    /\$(\d+(?:\.\d{2})?)\s*(?:per\s+)?window/gi
  ];
  
  const foundRates: Array<{ rate: number; type: string; surface: string; context: string }> = [];
  
  ratePatterns.forEach((pattern, index) => {
    const matches = [...content.matchAll(pattern)];
    matches.forEach(match => {
      const rate = parseFloat(match[1]);
      let type = 'sqft';
      let surface = 'wall';
      
      if (index === 1) { type = 'linear'; surface = 'trim'; }
      else if (index === 2) { type = 'each'; surface = 'door'; }
      else if (index === 3) { type = 'each'; surface = 'window'; }
      
      // Determine surface from context
      const contextWindow = content.substring(Math.max(0, match.index! - 50), match.index! + 50);
      if (contextWindow.toLowerCase().includes('ceiling')) surface = 'ceiling';
      else if (contextWindow.toLowerCase().includes('trim')) surface = 'trim';
      else if (contextWindow.toLowerCase().includes('wall')) surface = 'wall';
      
      foundRates.push({
        rate,
        type,
        surface,
        context: match[0]
      });
    });
  });
  
  if (foundRates.length > 0) {
    learningData.rates = foundRates;
  }
  
  // Extract markup percentages
  const markupMatches = content.match(/(\d+)%\s*markup/gi);
  if (markupMatches) {
    learningData.markupPreferences = markupMatches.map(match => {
      const percentMatch = match.match(/(\d+)/);
      return percentMatch ? parseInt(percentMatch[1]) : 20;
    });
  }
  
  // Extract project types
  const projectTypes = ['interior', 'exterior', 'commercial', 'residential', 'cabinet', 'fence', 'deck'];
  const foundTypes = projectTypes.filter(type => lowerContent.includes(type));
  if (foundTypes.length > 0) {
    learningData.projectTypes = foundTypes;
  }
  
  // Extract timeline preferences
  const timelineMatches = content.match(/(\d+[-–]\d+|\d+)\s*(days?|weeks?|hours?)/gi);
  if (timelineMatches) {
    learningData.timeline = timelineMatches;
  }
  
  return learningData;
}

/**
 * Save learning data to company profile
 */
export async function saveLearningData(companyId: string, learningData: LearningData): Promise<void> {
  try {
    const response = await fetch('/api/companies/learning-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyId,
        learningData,
        timestamp: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save learning data');
    }
    
    console.log('📚 Learning data saved for company:', companyId);
  } catch (error) {
    console.error('Failed to save learning data:', error);
    // Don't throw - learning failures shouldn't break the main flow
  }
}

/**
 * Get company learning profile
 */
export async function getCompanyProfile(companyId: string): Promise<ContractorProfile | null> {
  try {
    const response = await fetch(`/api/companies/${companyId}/learning-profile`);
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to get company profile:', error);
    return null;
  }
}

/**
 * Update company profile with new learning data
 */
export function updateProfileWithLearning(
  profile: ContractorProfile, 
  learningData: LearningData
): ContractorProfile {
  const updatedProfile = { ...profile };
  
  // Update preferred brands
  if (learningData.paintBrands) {
    learningData.paintBrands.forEach(brand => {
      if (!updatedProfile.preferredBrands.includes(brand)) {
        updatedProfile.preferredBrands.push(brand);
      }
    });
  }
  
  // Update preferred products
  if (learningData.paintProducts) {
    learningData.paintProducts.forEach(product => {
      const existing = updatedProfile.preferredProducts.find(
        p => p.name.toLowerCase() === product.name.toLowerCase()
      );
      
      if (existing) {
        existing.frequency += 1;
        existing.cost = (existing.cost + product.cost) / 2; // Average cost
      } else {
        updatedProfile.preferredProducts.push({
          ...product,
          frequency: 1
        });
      }
    });
  }
  
  // Update rates (calculate weighted averages)
  if (learningData.rates) {
    learningData.rates.forEach(rate => {
      const currentRate = getCurrentRateForSurface(updatedProfile, rate.surface);
      const newRate = (currentRate + rate.rate) / 2; // Simple average for now
      
      switch (rate.surface) {
        case 'wall':
          updatedProfile.averageRates.wallRatePerSqft = newRate;
          break;
        case 'ceiling':
          updatedProfile.averageRates.ceilingRatePerSqft = newRate;
          break;
        case 'trim':
          updatedProfile.averageRates.trimRatePerLinearFt = newRate;
          break;
        case 'door':
          updatedProfile.averageRates.doorRateEach = newRate;
          break;
        case 'window':
          updatedProfile.averageRates.windowRateEach = newRate;
          break;
      }
    });
  }
  
  // Update markup preference
  if (learningData.markupPreferences && learningData.markupPreferences.length > 0) {
    const avgMarkup = learningData.markupPreferences.reduce((a, b) => a + b, 0) / learningData.markupPreferences.length;
    updatedProfile.preferredMarkup = (updatedProfile.preferredMarkup + avgMarkup) / 2;
  }
  
  // Update project types
  if (learningData.projectTypes) {
    learningData.projectTypes.forEach(type => {
      if (!updatedProfile.commonProjectTypes.includes(type)) {
        updatedProfile.commonProjectTypes.push(type);
      }
    });
  }
  
  // Update learning stats
  updatedProfile.learningStats.quotesAnalyzed += 1;
  updatedProfile.learningStats.lastUpdated = new Date().toISOString();
  updatedProfile.learningStats.confidenceScore = Math.min(
    100,
    updatedProfile.learningStats.confidenceScore + 1
  );
  
  return updatedProfile;
}

/**
 * Helper function to get current rate for a surface
 */
function getCurrentRateForSurface(profile: ContractorProfile, surface: string): number {
  switch (surface) {
    case 'wall': return profile.averageRates.wallRatePerSqft;
    case 'ceiling': return profile.averageRates.ceilingRatePerSqft;
    case 'trim': return profile.averageRates.trimRatePerLinearFt;
    case 'door': return profile.averageRates.doorRateEach;
    case 'window': return profile.averageRates.windowRateEach;
    default: return 0;
  }
}

/**
 * Generate insights from contractor profile
 */
export function generateProfileInsights(profile: ContractorProfile): string[] {
  const insights: string[] = [];
  
  // Brand insights
  if (profile.preferredBrands.length > 0) {
    insights.push(`You frequently use ${profile.preferredBrands.slice(0, 3).join(', ')} paint brands`);
  }
  
  // Rate insights
  if (profile.averageRates.wallRatePerSqft > 0) {
    insights.push(`Your average wall rate is $${profile.averageRates.wallRatePerSqft.toFixed(2)}/sqft`);
  }
  
  // Markup insights
  if (profile.preferredMarkup > 0) {
    insights.push(`Your typical markup is ${profile.preferredMarkup.toFixed(0)}%`);
  }
  
  // Project type insights
  if (profile.commonProjectTypes.length > 0) {
    insights.push(`You commonly work on ${profile.commonProjectTypes.join(', ')} projects`);
  }
  
  // Learning progress
  insights.push(`Profile built from ${profile.learningStats.quotesAnalyzed} quotes (${profile.learningStats.confidenceScore}% confidence)`);
  
  return insights;
}