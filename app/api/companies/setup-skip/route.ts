import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { access_code } = await req.json();

    if (!access_code) {
      return NextResponse.json(
        { error: 'Access code is required' },
        { status: 400 }
      );
    }

    // For now, just return success
    // This can be enhanced later with proper database integration
    return NextResponse.json({ 
      success: true,
      message: 'Setup skipped successfully',
      reminder: 'You can configure products and pricing anytime from Settings → Products'
    });

  } catch (error) {
    console.error('Setup skip error:', error);
    return NextResponse.json(
      { error: 'Failed to skip setup' },
      { status: 500 }
    );
  }
}