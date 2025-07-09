import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Temporarily disabled - needs Supabase implementation
    return NextResponse.json({
      total_codes: 0,
      active_codes: 0,
      expired_codes: 0,
      total_usage: 0,
      companies_created: 0
    });

  } catch (error) {
    console.error('Error loading access code stats:', error);
    return NextResponse.json(
      { error: 'Failed to load access code statistics' },
      { status: 500 }
    );
  }
}