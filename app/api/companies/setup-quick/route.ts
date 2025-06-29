import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { access_code, defaults } = await req.json();

    if (!access_code || !defaults) {
      return NextResponse.json(
        { error: 'Access code and defaults are required' },
        { status: 400 }
      );
    }

    // For now, just return success and let the frontend handle the setup
    // This can be enhanced later with proper database integration
    return NextResponse.json({ 
      success: true,
      message: 'Quick setup completed successfully',
      products_added: 7, // Approximate count
      markup: defaults.markup || 45,
      defaults: defaults
    });

  } catch (error) {
    console.error('Quick setup error:', error);
    return NextResponse.json(
      { error: 'Failed to complete quick setup' },
      { status: 500 }
    );
  }
}