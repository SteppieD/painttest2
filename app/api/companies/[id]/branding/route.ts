import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database/init';

// Get company branding
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDatabase();
    
    // Get existing branding data
    const branding = await db.query(
      `SELECT 
        company_id,
        logo_url,
        primary_color,
        secondary_color,
        accent_color,
        company_name,
        company_tagline,
        created_at,
        updated_at
      FROM company_branding 
      WHERE company_id = ?`,
      [params.id]
    );

    // If no branding exists, return defaults
    if (!branding || branding.length === 0) {
      return NextResponse.json({
        company_id: params.id,
        logo_url: null,
        primary_color: '#3182ce',
        secondary_color: '#2d3748',
        accent_color: '#38a169',
        company_name: 'Professional Painting Services',
        company_tagline: 'Licensed & Insured',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    return NextResponse.json(branding[0]);

  } catch (error) {
    console.error('Error fetching company branding:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branding data' },
      { status: 500 }
    );
  }
}

// Update company branding
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const db = getDatabase();
    
    const {
      logo_url,
      primary_color,
      secondary_color,
      accent_color,
      company_name,
      company_tagline
    } = data;

    // Validate required fields
    if (!company_name) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    // Validate color formats
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (primary_color && !hexColorRegex.test(primary_color)) {
      return NextResponse.json(
        { error: 'Invalid primary color format' },
        { status: 400 }
      );
    }
    if (secondary_color && !hexColorRegex.test(secondary_color)) {
      return NextResponse.json(
        { error: 'Invalid secondary color format' },
        { status: 400 }
      );
    }
    if (accent_color && !hexColorRegex.test(accent_color)) {
      return NextResponse.json(
        { error: 'Invalid accent color format' },
        { status: 400 }
      );
    }

    // Check if branding record exists
    const existing = await db.query(
      'SELECT company_id FROM company_branding WHERE company_id = ?',
      [params.id]
    );

    const now = new Date().toISOString();

    if (existing && existing.length > 0) {
      // Update existing record
      await db.query(
        `UPDATE company_branding SET 
          logo_url = ?,
          primary_color = ?,
          secondary_color = ?,
          accent_color = ?,
          company_name = ?,
          company_tagline = ?,
          updated_at = ?
        WHERE company_id = ?`,
        [
          logo_url || null,
          primary_color || '#3182ce',
          secondary_color || '#2d3748',
          accent_color || '#38a169',
          company_name,
          company_tagline || null,
          now,
          params.id
        ]
      );
    } else {
      // Create new record
      await db.query(
        `INSERT INTO company_branding (
          company_id,
          logo_url,
          primary_color,
          secondary_color,
          accent_color,
          company_name,
          company_tagline,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          params.id,
          logo_url || null,
          primary_color || '#3182ce',
          secondary_color || '#2d3748',
          accent_color || '#38a169',
          company_name,
          company_tagline || null,
          now,
          now
        ]
      );
    }

    // Return updated branding data
    const updated = await db.query(
      `SELECT 
        company_id,
        logo_url,
        primary_color,
        secondary_color,
        accent_color,
        company_name,
        company_tagline,
        created_at,
        updated_at
      FROM company_branding 
      WHERE company_id = ?`,
      [params.id]
    );

    return NextResponse.json({
      success: true,
      data: updated[0],
      message: 'Branding updated successfully'
    });

  } catch (error) {
    console.error('Error updating company branding:', error);
    return NextResponse.json(
      { error: 'Failed to update branding data' },
      { status: 500 }
    );
  }
}