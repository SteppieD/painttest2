import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Temporarily disabled - needs Supabase implementation
    return NextResponse.json(
      { error: 'Bulk access code creation temporarily disabled' },
      { status: 501 }
    );

  } catch (error) {
    console.error('Error creating bulk access codes:', error);
    return NextResponse.json(
      { error: 'Failed to create access codes' },
      { status: 500 }
    );
  }
}