import { NextRequest, NextResponse } from "next/server";
import { supabaseDb } from "@/lib/database/supabase-adapter";


export async function POST(req: NextRequest) {
  try {
    const { companyId, userId, products } = await req.json();
    const id = companyId || userId; // Support both for backwards compatibility

    if (!id || !products) {
      return NextResponse.json(
        { error: "Company ID and products are required" },
        { status: 400 }
      );
    }

    await supabaseDb.savePaintProducts(id, products);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving paint products:", error);
    return NextResponse.json(
      { error: "Failed to save paint products" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const companyId = searchParams.get("companyId") || searchParams.get("userId");

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    const products = await supabaseDb.getPaintProducts(parseInt(companyId));

    // Transform snake_case to camelCase for frontend compatibility
    const transformedProducts = products.map((product: any) => ({
      id: product.id,
      projectType: product.project_type,
      productCategory: product.product_category,
      supplier: product.supplier,
      productName: product.product_name,
      productLine: product.product_line,
      costPerGallon: product.cost_per_gallon,
      displayOrder: product.display_order,
      sheen: product.sheen,
      coveragePerGallon: product.coverage_per_gallon,
      isActive: product.is_active,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));

    return NextResponse.json({ products: transformedProducts });
  } catch (error) {
    console.error("Error fetching paint products:", error);
    return NextResponse.json(
      { error: "Failed to fetch paint products" },
      { status: 500 }
    );
  }
}