import { NextRequest, NextResponse } from 'next/server';
import { supabaseDb } from '@/lib/database/supabase-adapter';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Supabase connection...');
    
    // Check if environment variables are set
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const config = {
      hasUrl,
      hasServiceKey,
      hasAnonKey,
      nodeEnv: process.env.NODE_ENV,
      urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
      serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
      anonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
    };
    
    if (!hasUrl || (!hasServiceKey && !hasAnonKey)) {
      return NextResponse.json({
        success: false,
        error: 'Missing Supabase environment variables',
        config,
        details: 'Required: NEXT_PUBLIC_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY'
      }, { status: 500 });
    }
    
    // Try to initialize schema
    const schemaResult = await supabaseDb.initializeSchema();
    
    // Try to get demo companies
    let demoCompanies;
    let companyError;
    try {
      demoCompanies = await supabaseDb.getCompanyByAccessCode('DEMO2024');
    } catch (error) {
      companyError = error instanceof Error ? error.message : 'Unknown error';
    }
    
    return NextResponse.json({
      success: !companyError,
      message: companyError ? 'Supabase connection failed' : 'Supabase connection successful',
      config,
      data: {
        schemaInitialized: schemaResult,
        demoCompanyFound: !!demoCompanies,
        companyError
      }
    });
    
  } catch (error) {
    console.error('Supabase test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
}