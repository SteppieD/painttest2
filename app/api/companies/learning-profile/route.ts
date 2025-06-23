import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbRun } from "@/lib/database";

/**
 * Save learning data to company profile
 */
export async function POST(request: NextRequest) {
  try {
    const { companyId, learningData, timestamp } = await request.json();
    
    if (!companyId || !learningData) {
      return NextResponse.json(
        { error: "Company ID and learning data are required" },
        { status: 400 }
      );
    }
    
    // Get existing learning profile
    let existingProfile = null;
    try {
      existingProfile = dbGet(`
        SELECT * FROM company_learning_profiles 
        WHERE company_id = ?
      `, [companyId]);
    } catch (error) {
      // Table might not exist yet, create it
      dbRun(`
        CREATE TABLE IF NOT EXISTS company_learning_profiles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          company_id TEXT UNIQUE NOT NULL,
          learning_data TEXT NOT NULL,
          quotes_analyzed INTEGER DEFAULT 0,
          confidence_score INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (company_id) REFERENCES companies (id)
        )
      `);
    }
    
    if (existingProfile) {
      // Update existing profile by merging learning data
      const existingData = JSON.parse(existingProfile.learning_data || '{}');
      const mergedData = mergeLearningData(existingData, learningData);
      
      dbRun(`
        UPDATE company_learning_profiles 
        SET learning_data = ?, 
            quotes_analyzed = quotes_analyzed + 1,
            confidence_score = MIN(100, confidence_score + 1),
            updated_at = CURRENT_TIMESTAMP
        WHERE company_id = ?
      `, [JSON.stringify(mergedData), companyId]);
      
      console.log(`📚 Updated learning profile for company ${companyId}`);
    } else {
      // Create new profile
      dbRun(`
        INSERT INTO company_learning_profiles 
        (company_id, learning_data, quotes_analyzed, confidence_score)
        VALUES (?, ?, 1, 5)
      `, [companyId, JSON.stringify(learningData)]);
      
      console.log(`📚 Created new learning profile for company ${companyId}`);
    }
    
    return NextResponse.json({
      success: true,
      message: "Learning data saved successfully"
    });
    
  } catch (error) {
    console.error("Error saving learning data:", error);
    return NextResponse.json(
      { error: "Failed to save learning data" },
      { status: 500 }
    );
  }
}

/**
 * Get learning profile for a company
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('company_id');
    
    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }
    
    const profile = dbGet(`
      SELECT * FROM company_learning_profiles 
      WHERE company_id = ?
    `, [companyId]);
    
    if (!profile) {
      return NextResponse.json(
        { error: "Learning profile not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      companyId: profile.company_id,
      learningData: JSON.parse(profile.learning_data),
      quotesAnalyzed: profile.quotes_analyzed,
      confidenceScore: profile.confidence_score,
      lastUpdated: profile.updated_at
    });
    
  } catch (error) {
    console.error("Error fetching learning profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch learning profile" },
      { status: 500 }
    );
  }
}

/**
 * Merge new learning data with existing data
 */
function mergeLearningData(existing: any, newData: any): any {
  const merged = { ...existing };
  
  // Merge paint brands
  if (newData.paintBrands) {
    merged.paintBrands = [...new Set([
      ...(merged.paintBrands || []),
      ...newData.paintBrands
    ])];
  }
  
  // Merge paint products
  if (newData.paintProducts) {
    merged.paintProducts = merged.paintProducts || [];
    newData.paintProducts.forEach((newProduct: any) => {
      const existingIndex = merged.paintProducts.findIndex(
        (p: any) => p.name.toLowerCase() === newProduct.name.toLowerCase()
      );
      
      if (existingIndex >= 0) {
        // Update existing product (average the cost)
        const existing = merged.paintProducts[existingIndex];
        existing.cost = (existing.cost + newProduct.cost) / 2;
        existing.frequency = (existing.frequency || 1) + 1;
      } else {
        // Add new product
        merged.paintProducts.push({
          ...newProduct,
          frequency: 1
        });
      }
    });
  }
  
  // Merge rates
  if (newData.rates) {
    merged.rates = merged.rates || [];
    merged.rates.push(...newData.rates);
    
    // Keep only the last 20 rates to prevent infinite growth
    if (merged.rates.length > 20) {
      merged.rates = merged.rates.slice(-20);
    }
  }
  
  // Merge markup preferences
  if (newData.markupPreferences) {
    merged.markupPreferences = merged.markupPreferences || [];
    merged.markupPreferences.push(...newData.markupPreferences);
    
    // Keep only the last 10 markups
    if (merged.markupPreferences.length > 10) {
      merged.markupPreferences = merged.markupPreferences.slice(-10);
    }
  }
  
  // Merge project types
  if (newData.projectTypes) {
    merged.projectTypes = [...new Set([
      ...(merged.projectTypes || []),
      ...newData.projectTypes
    ])];
  }
  
  // Merge timeline preferences
  if (newData.timeline) {
    merged.timeline = merged.timeline || [];
    merged.timeline.push(...newData.timeline);
    
    // Keep only the last 10 timelines
    if (merged.timeline.length > 10) {
      merged.timeline = merged.timeline.slice(-10);
    }
  }
  
  return merged;
}