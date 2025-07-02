import { NextRequest, NextResponse } from 'next/server';
import { supabaseDb } from '@/lib/database/supabase-adapter';

export async function POST(req: NextRequest) {
  try {
    const { 
      access_code, 
      category, 
      project_type, 
      supplier, 
      name, 
      cost_per_gallon 
    } = await req.json();

    if (!access_code || !category || !project_type || !supplier || !name || !cost_per_gallon) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (cost_per_gallon <= 0) {
      return NextResponse.json(
        { error: 'Cost per gallon must be greater than 0' },
        { status: 400 }
      );
    }

    // Get company ID from access code
    const company = await supabaseDb.getCompanyByAccessCode(access_code);

    if (!company) {
      return NextResponse.json(
        { error: 'Invalid access code' },
        { status: 404 }
      );
    }

    // Create new product using supabase adapter
    const productData = {
      company_id: company.id,
      category,
      project_type,
      supplier,
      name,
      cost_per_gallon,
      tier: 'standard'
    };

    const result = await supabaseDb.addPaintProduct(company.id, productData);

    return NextResponse.json({ 
      success: true,
      message: 'Product added successfully',
      action: 'created',
      product: result
    });

  } catch (error) {
    console.error('Quick add product error:', error);
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    );
  }
}