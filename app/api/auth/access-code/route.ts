import { NextRequest, NextResponse } from "next/server";

// Vercel Functions require external database (Supabase only)
const getSupabaseDb = async () => {
  try {
    const { supabaseDb } = await import("@/lib/database/supabase-adapter");
    return supabaseDb;
  } catch (error) {
    console.error('Failed to import Supabase adapter:', error);
    return null;
  }
};

interface Company {
  id: number;
  access_code: string;
  company_name: string;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  created_at?: string;
  updated_at?: string;
}

// Demo companies will be seeded automatically by the database module

// POST endpoint - Verify access code  
export async function POST(request: NextRequest) {
  try {
    const { accessCode } = await request.json();

    if (!accessCode) {
      return NextResponse.json(
        { error: "Access code is required" },
        { status: 400 },
      );
    }

    // Convert to uppercase for consistency
    const normalizedCode = accessCode.toString().toUpperCase();

    // Get Supabase database connection
    const supabaseDb = await getSupabaseDb();
    if (!supabaseDb) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 },
      );
    }

    // Check if access code exists in companies table
    const company = await supabaseDb.getCompanyByAccessCode(normalizedCode);

    if (company) {
      // Valid company found - return company data
      console.log(
        `✅ Valid access code: ${normalizedCode} for ${company.company_name}`,
      );

      return NextResponse.json({
        success: true,
        companyName: company.company_name,
        userId: `demo_${company.id}_${Date.now()}`,
        sessionToken: `session_${company.id}_${Date.now()}`,
        company: {
          id: company.id,
          accessCode: company.access_code,
          name: company.company_name,
          phone: company.phone,
          email: company.email,
          logoUrl: company.logo_url,
        },
      });
    } else {
      // Check if it's a valid new access code pattern (letters + numbers)
      const newCodePattern = /^[A-Z]{3,10}\\d{2,4}$/;

      if (newCodePattern.test(normalizedCode)) {
        // Auto-create new company for valid pattern
        const companyName = `Company ${normalizedCode}`;

        const result = await supabaseDb.createTrialCompany({
          accessCode: normalizedCode,
          companyName: companyName,
          phone: "",
          email: ""
        });

        console.log(
          `🆕 Auto-created company: ${companyName} with code ${normalizedCode}`,
        );

        return NextResponse.json({
          success: true,
          companyName: companyName,
          userId: `demo_${result.id}_${Date.now()}`,
          sessionToken: `session_${result.id}_${Date.now()}`,
          company: {
            id: result.id,
            accessCode: normalizedCode,
            name: companyName,
            phone: "",
            email: "",
            logoUrl: null,
          },
          isNewCompany: true,
        });
      } else {
        // Invalid access code format
        console.log(`❌ Invalid access code: ${normalizedCode}`);
        return NextResponse.json(
          {
            error: "Invalid access code. Please contact support.",
          },
          { status: 401 },
        );
      }
    }
  } catch (error) {
    console.error("Access code verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET endpoint - List available demo companies (for testing)
export async function GET() {
  try {
    const supabaseDb = await getSupabaseDb();
    if (!supabaseDb) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 },
      );
    }

    const companies = await supabaseDb.getAllCompanies();

    return NextResponse.json({
      companies,
      message: "Available access codes for testing",
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
