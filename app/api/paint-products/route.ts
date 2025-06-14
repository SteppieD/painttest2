import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";

const db = new Database("./painting_quotes_app.db");

export async function POST(req: NextRequest) {
  try {
    const { userId, products } = await req.json();

    if (!userId || !products) {
      return NextResponse.json(
        { error: "User ID and products are required" },
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
      // Delete existing products for this user
      deleteStmt.run(userId);

      // Insert new products
      for (const product of products) {
        insertStmt.run(
          userId,
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

    // Update company profile onboarding status
    const updateProfileStmt = db.prepare(`
      UPDATE company_profiles
      SET onboarding_completed = TRUE,
          onboarding_step = 'completed',
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `);
    updateProfileStmt.run(userId);

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
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const products = db.prepare(`
      SELECT * FROM company_paint_products
      WHERE user_id = ? AND is_active = TRUE
      ORDER BY project_type, product_category, display_order
    `).all(userId);

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching paint products:", error);
    return NextResponse.json(
      { error: "Failed to fetch paint products" },
      { status: 500 }
    );
  }
}