import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    console.log('Testing Supabase connection...');
    
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('Supabase URL:', supabaseUrl ? 'SET' : 'MISSING');
    console.log('Supabase Key:', supabaseKey ? 'SET' : 'MISSING');
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: 'Missing environment variables',
        url: !!supabaseUrl,
        key: !!supabaseKey
      }, { status: 500 });
    }
    
    // Create client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test simple query
    const { data, error } = await supabase
      .from('companies')
      .select('access_code, company_name')
      .limit(1);
    
    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({
        error: 'Database query failed',
        details: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection working!',
      sampleData: data
    });
    
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({
      error: 'Connection test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}