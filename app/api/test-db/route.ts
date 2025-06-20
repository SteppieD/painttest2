import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log('Test DB endpoint called');
    
    // Check environment variables
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasSupabaseKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Get the actual URL to check for = issue
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'not set';
    const urlFirstChar = supabaseUrl.charAt(0);
    
    return NextResponse.json({
      success: true,
      environment: {
        hasSupabaseUrl,
        hasSupabaseKey,
        hasAnonKey,
        urlFirstChar,
        urlLength: supabaseUrl.length,
        isProduction: process.env.NODE_ENV === 'production',
        isVercel: process.env.VERCEL === '1'
      },
      message: 'Database test endpoint working'
    });
  } catch (error) {
    console.error('Test DB error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}