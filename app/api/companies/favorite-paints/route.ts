import { NextRequest, NextResponse } from 'next/server';
import { supabaseDb } from '@/lib/database/supabase-adapter';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const projectType = searchParams.get('project_type');
    const companyId = searchParams.get('company_id');

    if (!category || !projectType || !companyId) {
      return NextResponse.json(
        { error: 'Category, project_type, and company_id are required' },
        { status: 400 }
      );
    }

    // Get paint products for this company
    const products = await supabaseDb.getPaintProducts(parseInt(companyId));
    
    // Filter by category and project type
    const favorites = products
      .filter((p: any) => p.category === category && p.project_type === projectType)
      .slice(0, 10)
      .map((p: any) => ({
        id: p.id,
        supplier: p.supplier,
        productName: p.name,
        costPerGallon: p.cost_per_gallon,
        displayOrder: p.display_order || 1,
        tier: p.tier,
        is_favorite: p.is_favorite
      }));

    return NextResponse.json({ 
      success: true,
      favorites: favorites || [],
      count: favorites?.length || 0,
      category,
      project_type: projectType,
      company_id: companyId
    });

  } catch (error) {
    console.error('Favorite paints fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorite paints' },
      { status: 500 }
    );
  }
}