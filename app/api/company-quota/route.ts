import { NextRequest, NextResponse } from "next/server";
import { dbGet } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const companyId = url.searchParams.get("company_id");

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Get company quota information
    const company = dbGet(`
      SELECT 
        is_trial, 
        quote_limit, 
        company_name,
        (SELECT COUNT(*) FROM quotes WHERE company_id = ?) as quotes_used
      FROM companies 
      WHERE id = ?
    `, [companyId, companyId]) as any;

    if (!company) {
      return NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      is_trial: Boolean(company.is_trial),
      quote_limit: company.quote_limit,
      quotes_used: company.quotes_used || 0,
      company_name: company.company_name,
      quotes_remaining: company.quote_limit ? Math.max(0, company.quote_limit - (company.quotes_used || 0)) : null
    });

  } catch (error) {
    console.error("Company quota API error:", error);
    return NextResponse.json(
      { error: "Failed to load quota information" },
      { status: 500 }
    );
  }
}