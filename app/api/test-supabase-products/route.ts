import { NextRequest, NextResponse } from "next/server";
import { supabaseDb } from "@/lib/database/supabase-adapter";

export async function GET(req: NextRequest) {
  try {
    console.log("Testing Supabase paint products connection...");
    
    // Test getting products for company ID 1 (should be demo company)
    const products = await supabaseDb.getPaintProducts(1);
    console.log("Products retrieved:", products?.length || 0);
    
    return NextResponse.json({
      success: true,
      message: "Supabase paint products connection working",
      productCount: products?.length || 0,
      sampleProducts: products?.slice(0, 2) || []
    });
    
  } catch (error) {
    console.error("Supabase test failed:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
  }
}