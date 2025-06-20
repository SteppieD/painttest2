import { NextRequest, NextResponse } from 'next/server';
import { dbGet, dbAll, dbRun } from "@/lib/database";

interface PaintProduct {
  id: string;
  product_name: string;
  use_case: string;
  cost_per_gallon: number;
  sheen?: string;
  brand?: string;
  product_line?: string;
}

interface BrandGroup {
  brand: string;
  products: {
    [category: string]: PaintProduct[];
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get('companyId');
  
  if (!companyId) {
    return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
  }

  try {
    
    // Get all paint products for the company, grouped by brand and category
    const query = `
      SELECT 
        cp.id,
        cp.product_name,
        cp.product_category as use_case,
        cp.cost_per_gallon,
        cp.sheen,
        cp.supplier as brand,
        cp.product_line
      FROM company_paint_products cp
      WHERE cp.user_id = ? AND cp.is_active = 1
      ORDER BY cp.supplier, cp.product_category, cp.cost_per_gallon
    `;
    
    const products = dbAll(query, [companyId]) as PaintProduct[];
    
    // Group products by brand and category
    const brandGroups: { [brand: string]: BrandGroup } = {};
    
    products.forEach(product => {
      const brand = product.brand || 'Other';
      const category = product.use_case || 'general';
      
      if (!brandGroups[brand]) {
        brandGroups[brand] = {
          brand,
          products: {}
        };
      }
      
      if (!brandGroups[brand].products[category]) {
        brandGroups[brand].products[category] = [];
      }
      
      brandGroups[brand].products[category].push(product);
    });
    
    // Convert to array and sort brands by popularity (Sherwin-Williams, Benjamin Moore first)
    const brandPriority = ['Sherwin-Williams', 'Benjamin Moore', 'Behr', 'PPG', 'Kilz', 'Zinsser'];
    const sortedBrands = Object.values(brandGroups).sort((a, b) => {
      const aIndex = brandPriority.indexOf(a.brand);
      const bIndex = brandPriority.indexOf(b.brand);
      
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.brand.localeCompare(b.brand);
    });
    
    // Get top 3 brands and all other brands
    const topBrands = sortedBrands.slice(0, 3);
    const otherBrands = sortedBrands.slice(3);
    
    // Also provide a summary for quick access
    const availableBrands = sortedBrands.map(bg => bg.brand);
    const availableCategories = Array.from(new Set(products.map(p => p.use_case)));
    
    return NextResponse.json({
      success: true,
      brands: sortedBrands,
      topBrands: topBrands,
      otherBrands: otherBrands,
      summary: {
        availableBrands,
        availableCategories,
        totalProducts: products.length,
        topBrandNames: topBrands.map(b => b.brand)
      }
    });
    
  } catch (error) {
    console.error('Error fetching paint products by brand:', error);
    return NextResponse.json(
      { error: 'Failed to fetch paint products by brand' },
      { status: 500 }
    );
  }
}

// Get products for a specific brand and category
export async function POST(request: NextRequest) {
  try {
    const { companyId, brand, category } = await request.json();
    
    if (!companyId || !brand) {
      return NextResponse.json({ error: 'Company ID and brand are required' }, { status: 400 });
    }

    
    let query = `
      SELECT 
        id,
        product_name,
        product_category as use_case,
        cost_per_gallon,
        sheen,
        supplier as brand,
        product_line
      FROM company_paint_products 
      WHERE user_id = ? AND supplier = ? AND is_active = 1
    `;
    
    const params = [companyId, brand];
    
    if (category) {
      query += ' AND product_category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY cost_per_gallon';
    
    const products = dbAll(query, params) as PaintProduct[];
    
    return NextResponse.json({
      success: true,
      products,
      brand,
      category: category || 'all',
      count: products.length
    });
    
  } catch (error) {
    console.error('Error fetching products for brand:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products for brand' },
      { status: 500 }
    );
  }
}