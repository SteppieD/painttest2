import { NextRequest, NextResponse } from "next/server";
import { supabaseDb } from "@/lib/database/supabase-adapter";


export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    console.log("Product save request:", requestBody);
    
    const { userId, companyId, product } = requestBody;
    const id = companyId || userId; // Support both for backwards compatibility

    if (!id || !product) {
      console.error("Missing required fields:", { id, product });
      return NextResponse.json(
        { error: "Company ID and product are required" },
        { status: 400 }
      );
    }

    console.log("Processing product save:", { id, productId: product.id, supplier: product.supplier });

    if (product.id) {
      // Update existing product
      await supabaseDb.updatePaintProduct(product.id, {
        supplier: product.supplier,
        productName: product.productName,
        productLine: product.productLine || null,
        costPerGallon: product.costPerGallon,
        sheen: product.sheen || null
      });
    } else {
      // Create new product - add to existing products array
      const existingProducts = await supabaseDb.getPaintProducts(id);
      const newProductData = {
        projectType: product.projectType,
        productCategory: product.productCategory,
        supplier: product.supplier,
        productName: product.productName,
        productLine: product.productLine || null,
        costPerGallon: product.costPerGallon,
        displayOrder: product.displayOrder,
        sheen: product.sheen || null,
        coveragePerGallon: 350
      };
      
      await supabaseDb.savePaintProducts(id, [...existingProducts, newProductData]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving product:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      companyId: id,
      productData: product
    });
    return NextResponse.json(
      { 
        error: "Failed to save product", 
        details: error instanceof Error ? error.message : String(error)
      },
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

    await supabaseDb.deletePaintProduct(productId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}