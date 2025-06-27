import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbRun } from "@/lib/database";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// GET - Retrieve company settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId') || '1'; // Default to first company for demo

    // Load settings from database
    const company: any = dbGet(`
      SELECT * FROM companies WHERE id = ?
    `, [companyId]);

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    const settings = {
      default_walls_rate: company.default_walls_rate || 3.00,
      default_ceilings_rate: company.default_ceilings_rate || 2.00,
      default_trim_rate: company.default_trim_rate || 1.92,
      default_walls_paint_cost: company.default_walls_paint_cost || 26.00,
      default_ceilings_paint_cost: company.default_ceilings_paint_cost || 25.00,
      default_trim_paint_cost: company.default_trim_paint_cost || 35.00,
      default_labor_percentage: company.default_labor_percentage || 30,
      default_paint_coverage: company.default_paint_coverage || 350,
      default_sundries_percentage: company.default_sundries_percentage || 12,
      tax_rate: company.tax_rate || 0,
      tax_on_materials_only: company.tax_on_materials_only || false,
      tax_label: company.tax_label || 'Tax',
      overhead_percentage: company.overhead_percentage || 10,
      default_markup_percentage: company.default_markup_percentage || 20,
      ceiling_height: company.ceiling_height || 9,
      paint_multiplier: company.paint_multiplier || 1.8,
      doors_per_gallon: company.doors_per_gallon || 4.5,
      windows_per_gallon: company.windows_per_gallon || 2.5,
      logo_url: company.logo_url || ''
    };

    return NextResponse.json(settings);

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

    // Update companies table (legacy format that exists)
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
        overhead_percentage = ?,
        default_markup_percentage = ?,
        ceiling_height = ?,
        paint_multiplier = ?,
        doors_per_gallon = ?,
        windows_per_gallon = ?,
        logo_url = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      settings.default_walls_rate || 3.00,
      settings.default_ceilings_rate || 2.00,
      settings.default_trim_rate || 1.92,
      settings.default_walls_paint_cost || 26.00,
      settings.default_ceilings_paint_cost || 25.00,
      settings.default_trim_paint_cost || 35.00,
      settings.default_labor_percentage || 30,
      settings.default_paint_coverage || 350,
      settings.default_sundries_percentage || 12,
      settings.tax_rate || 0,
      settings.tax_on_materials_only ? 1 : 0,
      settings.tax_label || 'Tax',
      settings.overhead_percentage || 10,
      settings.default_markup_percentage || 20,
      settings.ceiling_height || 9,
      settings.paint_multiplier || 1.8,
      settings.doors_per_gallon || 4.5,
      settings.windows_per_gallon || 2.5,
      settings.logo_url || null,
      companyId
    ]);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Company not found or no changes made" },
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