import { NextRequest, NextResponse } from "next/server";
import { dbGet } from "@/lib/database";

/**
 * Get learning profile for a specific company
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const companyId = params.id;
    
    const profile = await dbGet(`
      SELECT clp.*, c.company_name 
      FROM company_learning_profiles clp
      LEFT JOIN companies c ON clp.company_id = c.id
      WHERE clp.company_id = ?
    `, [companyId]);
    
    if (!profile) {
      return NextResponse.json({
        companyId,
        companyName: 'Unknown Company',
        learningData: {},
        quotesAnalyzed: 0,
        confidenceScore: 0,
        insights: ['No learning data available yet. Create more quotes to build your profile!'],
        lastUpdated: null
      });
    }
    
    const learningData = JSON.parse(profile.learning_data || '{}');
    
    // Generate insights from the learning data
    const insights = generateInsights(learningData, profile.quotes_analyzed, profile.confidence_score);
    
    return NextResponse.json({
      companyId: profile.company_id,
      companyName: profile.company_name || 'Unknown Company',
      learningData,
      quotesAnalyzed: profile.quotes_analyzed,
      confidenceScore: profile.confidence_score,
      insights,
      lastUpdated: profile.updated_at
    });
    
  } catch (error) {
    console.error("Error fetching company learning profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch learning profile" },
      { status: 500 }
    );
  }
}

/**
 * Generate insights from learning data
 */
function generateInsights(learningData: any, quotesAnalyzed: number, confidenceScore: number): string[] {
  const insights: string[] = [];
  
  // Brand insights
  if (learningData.paintBrands && learningData.paintBrands.length > 0) {
    const topBrands = learningData.paintBrands.slice(0, 3).join(', ');
    insights.push(`🎨 You frequently use ${topBrands} paint brands`);
  }
  
  // Product insights
  if (learningData.paintProducts && learningData.paintProducts.length > 0) {
    const avgCost = learningData.paintProducts.reduce((sum: number, p: any) => sum + p.cost, 0) / learningData.paintProducts.length;
    insights.push(`💰 Your average paint cost is $${avgCost.toFixed(2)} per gallon`);
    
    const topProduct = learningData.paintProducts.sort((a: any, b: any) => (b.frequency || 1) - (a.frequency || 1))[0];
    if (topProduct) {
      insights.push(`⭐ Your most used product is ${topProduct.name} at $${topProduct.cost}/gal`);
    }
  }
  
  // Rate insights
  if (learningData.rates && learningData.rates.length > 0) {
    const wallRates = learningData.rates.filter((r: any) => r.surface === 'wall');
    if (wallRates.length > 0) {
      const avgWallRate = wallRates.reduce((sum: number, r: any) => sum + r.rate, 0) / wallRates.length;
      insights.push(`📏 Your average wall rate is $${avgWallRate.toFixed(2)}/sqft`);
    }
    
    const ceilingRates = learningData.rates.filter((r: any) => r.surface === 'ceiling');
    if (ceilingRates.length > 0) {
      const avgCeilingRate = ceilingRates.reduce((sum: number, r: any) => sum + r.rate, 0) / ceilingRates.length;
      insights.push(`🏠 Your average ceiling rate is $${avgCeilingRate.toFixed(2)}/sqft`);
    }
  }
  
  // Markup insights
  if (learningData.markupPreferences && learningData.markupPreferences.length > 0) {
    const avgMarkup = learningData.markupPreferences.reduce((sum: number, m: number) => sum + m, 0) / learningData.markupPreferences.length;
    insights.push(`📈 Your typical markup is ${avgMarkup.toFixed(0)}%`);
  }
  
  // Project type insights
  if (learningData.projectTypes && learningData.projectTypes.length > 0) {
    const types = learningData.projectTypes.slice(0, 2).join(' and ');
    insights.push(`🏘️ You commonly work on ${types} projects`);
  }
  
  // Timeline insights
  if (learningData.timeline && learningData.timeline.length > 0) {
    const commonTimeline = learningData.timeline[0];
    insights.push(`⏱️ Your typical timeline is ${commonTimeline}`);
  }
  
  // Learning progress
  if (quotesAnalyzed > 0) {
    insights.push(`📊 Profile built from ${quotesAnalyzed} quotes (${confidenceScore}% confidence)`);
    
    if (confidenceScore >= 80) {
      insights.push('🎯 High confidence profile! Your preferences are well-established.');
    } else if (confidenceScore >= 50) {
      insights.push('📈 Good progress! Create more quotes to improve accuracy.');
    } else {
      insights.push('🌱 Growing profile! Each quote helps us learn your preferences.');
    }
  }
  
  // Recommendations
  if (insights.length === 0) {
    insights.push('💡 Start creating quotes to build your personalized contractor profile!');
    insights.push('🚀 The system will learn your preferred products, rates, and markups.');
  } else if (quotesAnalyzed < 5) {
    insights.push('💡 Tip: Create a few more quotes to unlock advanced insights!');
  } else if (!learningData.paintBrands || learningData.paintBrands.length < 2) {
    insights.push('💡 Try mentioning specific paint brands to improve product recommendations.');
  }
  
  return insights;
}