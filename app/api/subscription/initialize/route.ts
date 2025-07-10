import { NextResponse } from "next/server";
import { subscriptionManager } from "@/lib/subscription-manager";

export const dynamic = 'force-dynamic';

// This endpoint initializes the subscription system for existing companies
export async function GET() {
  try {
    console.log('🚀 Starting subscription system initialization...');
    
    // Run the migration for existing companies
    await subscriptionManager.migrateExistingCompanies();
    
    // Get stats on the migration
    const plans = await subscriptionManager.getAvailablePlans();
    
    return NextResponse.json({
      success: true,
      message: "Subscription system initialized successfully",
      availablePlans: plans
    });
  } catch (error) {
    console.error("Subscription initialization error:", error);
    return NextResponse.json(
      { 
        error: "Failed to initialize subscription system",
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