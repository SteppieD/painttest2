import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";

const db = new Database("./painting_quotes_app.db");

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

    // Start a transaction
    const deleteStmt = db.prepare(
      "DELETE FROM company_paint_products WHERE user_id = ?"
    );
    const insertStmt = db.prepare(`
      INSERT INTO company_paint_products (
        user_id,
        project_type,
        product_category,
        supplier,
        product_name,
        product_line,
        cost_per_gallon,
        display_order,
        sheen
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((products: any[]) => {
      // Delete existing products for this company
      deleteStmt.run(id);

      // Insert new products
      for (const product of products) {
        insertStmt.run(
          id,
          product.projectType,
          product.productCategory,
          product.supplier,
          product.productName,
          product.productLine || null,
          product.costPerGallon,
          product.displayOrder,
          product.sheen || null
        );
      }
    });

    insertMany(products);

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

    const products = db.prepare(`
      SELECT * FROM company_paint_products
      WHERE user_id = ? AND is_active = 1
      ORDER BY project_type, product_category, display_order
    `).all(companyId);

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