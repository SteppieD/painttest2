import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbRun } from "@/lib/database";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// GET - Retrieve company settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId') || '1'; // Default to first company for demo

    const settings = dbGet(`
      SELECT 
        default_walls_rate, 
        default_ceilings_rate, 
        default_trim_rate,
        default_walls_paint_cost, 
        default_ceilings_paint_cost, 
        default_trim_paint_cost,
        default_labor_percentage, 
        default_paint_coverage,
        default_sundries_percentage,
        tax_rate,
        tax_on_materials_only,
        tax_label
      FROM companies 
      WHERE id = ?
    `, [companyId]);

    // Return default values if no company found
    const defaultSettings = {
      default_walls_rate: 3.00,
      default_ceilings_rate: 2.00,
      default_trim_rate: 1.92,
      default_walls_paint_cost: 26.00,
      default_ceilings_paint_cost: 25.00,
      default_trim_paint_cost: 35.00,
      default_labor_percentage: 30,
      default_paint_coverage: 350,
      default_sundries_percentage: 12,
      tax_rate: 0,
      tax_on_materials_only: false,
      tax_label: 'Tax'
    };

    return NextResponse.json(settings || defaultSettings);

  } catch (error) {
    console.error("Error fetching company settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch company settings" },
      { status: 500 }
    );
  }
}

// PUT - Update company settings
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId') || '1';
    
    const settings = await request.json();

    const result = dbRun(`
      UPDATE companies SET
        default_walls_rate = ?,
        default_ceilings_rate = ?,
        default_trim_rate = ?,
        default_walls_paint_cost = ?,
        default_ceilings_paint_cost = ?,
        default_trim_paint_cost = ?,
        default_labor_percentage = ?,
        default_paint_coverage = ?,
        default_sundries_percentage = ?,
        tax_rate = ?,
        tax_on_materials_only = ?,
        tax_label = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      settings.default_walls_rate,
      settings.default_ceilings_rate,
      settings.default_trim_rate,
      settings.default_walls_paint_cost,
      settings.default_ceilings_paint_cost,
      settings.default_trim_paint_cost,
      settings.default_labor_percentage,
      settings.default_paint_coverage,
      settings.default_sundries_percentage,
      settings.tax_rate,
      settings.tax_on_materials_only ? 1 : 0,
      settings.tax_label,
      companyId
    ]);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Company settings updated successfully"
    });

  } catch (error) {
    console.error("Error updating company settings:", error);
    return NextResponse.json(
      { error: "Failed to update company settings" },
      { status: 500 }
    );
  }
}