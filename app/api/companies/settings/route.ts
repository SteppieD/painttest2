import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbRun } from "@/lib/database";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// GET - Retrieve company settings
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId') || '1'; // Default to first company for demo

    // Load settings from database
    const company: any = await dbGet(`
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
      logo_url: company.logo_url || '',
      
      // Product-Specific Spread Rates (from AI conversations)
      primer_spread_rate: company.primer_spread_rate || 250, // 200-300 sqft/gallon default
      wall_paint_spread_rate: company.wall_paint_spread_rate || 375, // 350-400 sqft/gallon default
      ceiling_paint_spread_rate: company.ceiling_paint_spread_rate || 350, // 350 sqft/gallon default
      trim_doors_per_gallon: company.trim_doors_per_gallon || 4.5, // 4-5 doors per gallon default
      trim_windows_per_gallon: company.trim_windows_per_gallon || 2.5, // 2-3 windows per gallon default
      
      // All-In Labor Rates (includes materials + labor from AI)
      wall_allin_rate_per_sqft: company.wall_allin_rate_per_sqft || 1.50, // $1.50 default
      ceiling_allin_rate_per_sqft: company.ceiling_allin_rate_per_sqft || 1.25, // $1.25 default
      primer_allin_rate_per_sqft: company.primer_allin_rate_per_sqft || 0.45, // $0.45 default
      door_allin_rate_each: company.door_allin_rate_each || 150, // $150 default
      window_allin_rate_each: company.window_allin_rate_each || 100, // $100 default
      
      // Product Preferences (contractor's go-to products from AI)
      preferred_primer_brand: company.preferred_primer_brand || 'Kilz', // Default primer brand
      preferred_primer_product: company.preferred_primer_product || 'PVA Primer', // Default primer product
      preferred_wall_paint_brand: company.preferred_wall_paint_brand || 'Sherwin Williams', // Default wall paint brand
      preferred_wall_paint_product: company.preferred_wall_paint_product || 'ProClassic', // Default wall paint product
      preferred_ceiling_paint_brand: company.preferred_ceiling_paint_brand || 'Benjamin Moore', // Default ceiling paint brand
      preferred_ceiling_paint_product: company.preferred_ceiling_paint_product || 'Waterborne Ceiling', // Default ceiling paint product
      preferred_trim_paint_brand: company.preferred_trim_paint_brand || 'Sherwin Williams', // Default trim paint brand
      preferred_trim_paint_product: company.preferred_trim_paint_product || 'ProClassic Semi-Gloss', // Default trim paint product
      
      // AI Learning Settings
      ai_learning_enabled: company.ai_learning_enabled !== false, // Auto-save conversation data to settings
      ai_ask_before_saving: company.ai_ask_before_saving !== false // Ask before saving new preferences
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
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId') || '1';
    
    const settings = await request.json();

    // Update companies table (legacy format that exists)
    const result = await dbRun(`
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
        primer_spread_rate = ?,
        wall_paint_spread_rate = ?,
        ceiling_paint_spread_rate = ?,
        trim_doors_per_gallon = ?,
        trim_windows_per_gallon = ?,
        wall_allin_rate_per_sqft = ?,
        ceiling_allin_rate_per_sqft = ?,
        primer_allin_rate_per_sqft = ?,
        door_allin_rate_each = ?,
        window_allin_rate_each = ?,
        preferred_primer_brand = ?,
        preferred_primer_product = ?,
        preferred_wall_paint_brand = ?,
        preferred_wall_paint_product = ?,
        preferred_ceiling_paint_brand = ?,
        preferred_ceiling_paint_product = ?,
        preferred_trim_paint_brand = ?,
        preferred_trim_paint_product = ?,
        ai_learning_enabled = ?,
        ai_ask_before_saving = ?,
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
      settings.primer_spread_rate || 250,
      settings.wall_paint_spread_rate || 375,
      settings.ceiling_paint_spread_rate || 350,
      settings.trim_doors_per_gallon || 4.5,
      settings.trim_windows_per_gallon || 2.5,
      settings.wall_allin_rate_per_sqft || 1.50,
      settings.ceiling_allin_rate_per_sqft || 1.25,
      settings.primer_allin_rate_per_sqft || 0.45,
      settings.door_allin_rate_each || 150,
      settings.window_allin_rate_each || 100,
      settings.preferred_primer_brand || 'Kilz',
      settings.preferred_primer_product || 'PVA Primer',
      settings.preferred_wall_paint_brand || 'Sherwin Williams',
      settings.preferred_wall_paint_product || 'ProClassic',
      settings.preferred_ceiling_paint_brand || 'Benjamin Moore',
      settings.preferred_ceiling_paint_product || 'Waterborne Ceiling',
      settings.preferred_trim_paint_brand || 'Sherwin Williams',
      settings.preferred_trim_paint_product || 'ProClassic Semi-Gloss',
      settings.ai_learning_enabled ? 1 : 0,
      settings.ai_ask_before_saving ? 1 : 0,
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