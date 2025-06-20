import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbAll, dbRun } from "@/lib/database";


export async function POST(req: NextRequest) {
  try {
    const { userId, companyId, product } = await req.json();
    const id = companyId || userId; // Support both for backwards compatibility

    if (!id || !product) {
      return NextResponse.json(
        { error: "Company ID and product are required" },
        { status: 400 }
      );
    }

    if (product.id) {
      // Update existing product
      dbRun(`
        UPDATE company_paint_products
        SET supplier = ?,
            product_name = ?,
            product_line = ?,
            cost_per_gallon = ?,
            sheen = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `, [
        product.supplier,
        product.productName,
        product.productLine || null,
        product.costPerGallon,
        product.sheen || null,
        product.id,
        id
      ]);
    } else {
      // Create new product
      dbRun(`
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
      `, [
        id,
        product.projectType,
        product.productCategory,
        product.supplier,
        product.productName,
        product.productLine || null,
        product.costPerGallon,
        product.displayOrder,
        product.sheen || null
      ]);
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

    dbRun(
      "UPDATE company_paint_products SET is_active = 0 WHERE id = ?",
      [productId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}