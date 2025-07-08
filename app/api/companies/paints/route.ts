import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbAll, dbRun } from "@/lib/database";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// GET - Retrieve company paints
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId') || '1';

    // Try to get paints from the new paints table
    let paints = dbAll(`
      SELECT * FROM company_paints 
      WHERE company_id = ? 
      ORDER BY brand_name, product_name
    `, [companyId]);

    // If no paints found, check if company_paints table exists, if not create it
    if (!paints || paints.length === 0) {
      try {
        // Create table if it doesn't exist
        dbRun(`
          CREATE TABLE IF NOT EXISTS company_paints (
            id TEXT PRIMARY KEY,
            company_id TEXT NOT NULL,
            brand_name TEXT NOT NULL,
            product_name TEXT NOT NULL,
            cost_per_gallon REAL NOT NULL,
            quality_grade TEXT CHECK(quality_grade IN ('good', 'better', 'best')) DEFAULT 'good',
            coverage_sqft INTEGER DEFAULT 350,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Add some default paints for the company
        const defaultPaints = [
          {
            id: `paint_${companyId}_1`,
            company_id: companyId,
            brand_name: 'Sherwin Williams',
            product_name: 'ProClassic Interior',
            cost_per_gallon: 45.99,
            quality_grade: 'better',
            coverage_sqft: 350,
            notes: 'Great for trim and doors'
          },
          {
            id: `paint_${companyId}_2`,
            company_id: companyId,
            brand_name: 'Benjamin Moore',
            product_name: 'Advance Waterborne',
            cost_per_gallon: 52.99,
            quality_grade: 'best',
            coverage_sqft: 375,
            notes: 'Premium quality for high-end projects'
          },
          {
            id: `paint_${companyId}_3`,
            company_id: companyId,
            brand_name: 'Behr',
            product_name: 'Premium Plus Ultra',
            cost_per_gallon: 32.99,
            quality_grade: 'good',
            coverage_sqft: 325,
            notes: 'Good value for basic projects'
          }
        ];

        for (const paint of defaultPaints) {
          dbRun(`
            INSERT INTO company_paints (
              id, company_id, brand_name, product_name, cost_per_gallon, 
              quality_grade, coverage_sqft, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            paint.id, paint.company_id, paint.brand_name, paint.product_name,
            paint.cost_per_gallon, paint.quality_grade, paint.coverage_sqft, paint.notes
          ]);
        }

        // Fetch the newly created paints
        paints = dbAll(`
          SELECT * FROM company_paints 
          WHERE company_id = ? 
          ORDER BY brand_name, product_name
        `, [companyId]);
      } catch (error) {
        console.error('Error creating paints table:', error);
        paints = [];
      }
    }

    return NextResponse.json({ paints: paints || [] });

  } catch (error) {
    console.error("Error fetching company paints:", error);
    return NextResponse.json(
      { error: "Failed to fetch company paints" },
      { status: 500 }
    );
  }
}

// POST - Create new paint(s)
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let companyId = searchParams.get('companyId');
    
    const requestData = await request.json();
    
    // Support both single paint and batch creation from conversational setup
    if (requestData.accessCode && requestData.products) {
      // Batch creation from conversational setup
      try {
        // Get company ID from access code
        const company = dbGet(`
          SELECT id FROM companies WHERE access_code = ?
        `, [requestData.accessCode]);
        
        if (!company) {
          return NextResponse.json(
            { error: "Invalid access code" },
            { status: 404 }
          );
        }
        
        companyId = company.id.toString();
        
        // Ensure paint_products table exists with new structure
        dbRun(`
          CREATE TABLE IF NOT EXISTS paint_products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_id INTEGER NOT NULL,
            category VARCHAR(50) NOT NULL,
            project_type VARCHAR(20) NOT NULL,
            supplier VARCHAR(100) NOT NULL,
            name VARCHAR(100) NOT NULL,
            cost_per_gallon DECIMAL(8,2) NOT NULL,
            coverage INTEGER,
            coverage_unit VARCHAR(20),
            tier VARCHAR(20) DEFAULT 'standard',
            display_order INTEGER DEFAULT 1,
            is_favorite BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
          )
        `);
        
        // Clear existing products for this company
        dbRun(`DELETE FROM paint_products WHERE company_id = ?`, [companyId]);
        
        // Insert new products
        const results = [];
        for (const product of requestData.products) {
          try {
            const result = dbRun(`
              INSERT INTO paint_products (
                company_id, category, project_type, supplier, name, 
                cost_per_gallon, coverage, coverage_unit
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
              companyId,
              product.category,
              product.project_type,
              product.supplier,
              product.name,
              product.cost_per_gallon,
              product.coverage || null,
              product.coverage_unit || null
            ]);
            results.push({ success: true, insertId: result.lastInsertRowid });
          } catch (error) {
            console.error('Error inserting product:', error, product);
            results.push({ success: false, error: error.message });
          }
        }
        
        return NextResponse.json({
          success: true,
          message: `Created ${results.filter(r => r.success).length} paint products`,
          results
        });
        
      } catch (error) {
        console.error("Error in batch paint creation:", error);
        return NextResponse.json(
          { error: "Failed to create paint products: " + error.message },
          { status: 500 }
        );
      }
    } else {
      // Single paint creation (legacy)
      const paintData = requestData;
      
      if (!companyId) companyId = '1';

      // Ensure legacy table exists
      dbRun(`
        CREATE TABLE IF NOT EXISTS company_paints (
          id TEXT PRIMARY KEY,
          company_id TEXT NOT NULL,
          brand_name TEXT NOT NULL,
          product_name TEXT NOT NULL,
          cost_per_gallon REAL NOT NULL,
          quality_grade TEXT CHECK(quality_grade IN ('good', 'better', 'best')) DEFAULT 'good',
          coverage_sqft INTEGER DEFAULT 350,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      const paintId = paintData.id || `paint_${Date.now()}`;

      const result = dbRun(`
        INSERT INTO company_paints (
          id, company_id, brand_name, product_name, cost_per_gallon, 
          quality_grade, coverage_sqft, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        paintId,
        companyId,
        paintData.brand_name,
        paintData.product_name,
        paintData.cost_per_gallon,
        paintData.quality_grade || 'good',
        paintData.coverage_sqft || 350,
        paintData.notes || null
      ]);

      return NextResponse.json({
        success: true,
        id: paintId,
        message: "Paint created successfully"
      });
    }

  } catch (error) {
    console.error("Error creating paint:", error);
    return NextResponse.json(
      { error: "Failed to create paint" },
      { status: 500 }
    );
  }
}

// PUT - Update existing paint
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId') || '1';
    
    const paintData = await request.json();

    const result = dbRun(`
      UPDATE company_paints SET
        brand_name = ?,
        product_name = ?,
        cost_per_gallon = ?,
        quality_grade = ?,
        coverage_sqft = ?,
        notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND company_id = ?
    `, [
      paintData.brand_name,
      paintData.product_name,
      paintData.cost_per_gallon,
      paintData.quality_grade || 'good',
      paintData.coverage_sqft || 350,
      paintData.notes || null,
      paintData.id,
      companyId
    ]);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Paint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Paint updated successfully"
    });

  } catch (error) {
    console.error("Error updating paint:", error);
    return NextResponse.json(
      { error: "Failed to update paint" },
      { status: 500 }
    );
  }
}

// DELETE - Remove paint
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId') || '1';
    const paintId = searchParams.get('paintId');

    if (!paintId) {
      return NextResponse.json(
        { error: "Paint ID is required" },
        { status: 400 }
      );
    }

    const result = dbRun(`
      DELETE FROM company_paints 
      WHERE id = ? AND company_id = ?
    `, [paintId, companyId]);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Paint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Paint deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting paint:", error);
    return NextResponse.json(
      { error: "Failed to delete paint" },
      { status: 500 }
    );
  }
}