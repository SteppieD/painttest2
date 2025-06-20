import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log('Testing database connection...');
  
  try {
    // Test environment variables
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasSupabaseKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('Environment check:', {
      hasSupabaseUrl,
      hasSupabaseKey,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
    });
    
    if (!hasSupabaseUrl || !hasSupabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        details: { hasSupabaseUrl, hasSupabaseKey }
      });
    }
    
    // Test Supabase import
    const { supabaseDb } = await import("@/lib/database/supabase-adapter");
    console.log('✅ Supabase adapter imported successfully');
    
    // Test database connection
    const companies = await supabaseDb.getAllCompanies();
    console.log('✅ Database query successful, companies:', companies?.length || 0);
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      companiesCount: companies?.length || 0,
      environment: {
        hasSupabaseUrl,
        hasSupabaseKey,
        nodeEnv: process.env.NODE_ENV
      }
    });
    
  } catch (error) {
    console.error('Connection test failed:', error);
    console.error('Error type:', typeof error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      errorType: typeof error,
      stack: error instanceof Error ? error.stack : undefined,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
    });
  }
}