import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    return NextResponse.json({
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseKey,
      hasAnonKey: !!anonKey,
      urlLength: supabaseUrl?.length || 0,
      serviceKeyLength: supabaseKey?.length || 0,
      anonKeyLength: anonKey?.length || 0,
      nodeEnv: process.env.NODE_ENV,
      // Show first few chars of URL for verification (safe to show)
      urlPrefix: supabaseUrl?.substring(0, 30) || 'NOT_SET'
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}