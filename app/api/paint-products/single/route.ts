import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";

const db = new Database("./painting_quotes_app.db");

export async function POST(req: NextRequest) {
  try {
    const { userId, product } = await req.json();

    if (!userId || !product) {
      return NextResponse.json(
        { error: "User ID and product are required" },
        { status: 400 }
      );
    }

    if (product.id) {
      // Update existing product
      const updateStmt = db.prepare(`
        UPDATE company_paint_products
        SET supplier = ?,
            product_name = ?,
            product_line = ?,
            cost_per_gallon = ?,
            sheen = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `);

      updateStmt.run(
        product.supplier,
        product.productName,
        product.productLine || null,
        product.costPerGallon,
        product.sheen || null,
        product.id,
        userId
      );
    } else {
      // Create new product
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving product:", error);
    return NextResponse.json(
      { error: "Failed to save product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const deleteStmt = db.prepare(
      "UPDATE company_paint_products SET is_active = FALSE WHERE id = ?"
    );
    deleteStmt.run(productId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}