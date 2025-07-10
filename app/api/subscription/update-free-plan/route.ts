import { NextResponse } from "next/server";
import { dbRun, dbGet } from "@/lib/database";

export const dynamic = 'force-dynamic';

// This endpoint updates the free plan to have 10 quotes as per the freemium documentation
export async function GET() {
  try {
    console.log('📝 Updating free plan to 10 quotes per month...');
    
    // Update the free plan to have 10 quotes
    await dbRun(`
      UPDATE subscription_plans 
      SET quote_limit = 10,
          description = 'Free forever with 10 quotes per month'
      WHERE id = 'plan_free'
    `);
    
    // Also update the Perfect Start plan name and features in the plans table
    await dbRun(`
      UPDATE subscription_plans 
      SET name = 'Perfect Start',
          quote_limit = 10
      WHERE id = 'plan_free'
    `);
    
    // Get the updated plan to confirm
    const updatedPlan = await dbGet(`
      SELECT * FROM subscription_plans WHERE id = 'plan_free'
    `);
    
    return NextResponse.json({
      success: true,
      message: "Free plan updated to 10 quotes per month",
      updatedPlan
    });
  } catch (error) {
    console.error("Free plan update error:", error);
    return NextResponse.json(
      { 
        error: "Failed to update free plan",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering
export async function POST() {
  return GET();
}