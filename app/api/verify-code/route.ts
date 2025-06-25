import { NextRequest, NextResponse } from "next/server";

// Database adapter - use simple adapter for local development
const getDatabase = async () => {
  try {
    // Try Supabase first
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { supabaseDb } = await import("@/lib/database/supabase-adapter");
      return supabaseDb;
    } else {
      // Fall back to simple database adapter for local development
      const simpleDb = await import("@/lib/database-simple");
      return {
        getCompanyByAccessCode: simpleDb.getCompanyByAccessCode,
        createTrialCompany: async (data: any) => {
          const company = await simpleDb.createCompany({
            access_code: data.accessCode,
            company_name: data.companyName,
            email: data.email,
            phone: data.phone
          });
          return {
            id: company.lastID,
            access_code: data.accessCode,
            company_name: data.companyName,
            email: data.email,
            phone: data.phone
          };
        },
        getAllCompanies: async () => {
          // Return demo companies for local development
          return [
            { id: 1, access_code: 'DEMO2024', company_name: 'Demo Company', email: 'demo@example.com', phone: '555-0123' },
            { id: 2, access_code: 'PAINTER001', company_name: 'Painter Pro LLC', email: 'painter@example.com', phone: '555-0456' },
            { id: 3, access_code: 'CONTRACTOR123', company_name: 'Best Contractors Inc', email: 'contractor@example.com', phone: '555-0789' }
          ];
        }
      };
    }
  } catch (error) {
    console.error('Failed to import database adapter:', error);
    return null;
  }
};

// Type definitions
interface Company {
  id: number;
  access_code: string;
  company_name: string;
  phone: string;
  email: string;
  logo_url: string | null;
}

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

    // Get database connection
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 },
      );
    }

    // Check if access code exists in companies table
    const company = await db.getCompanyByAccessCode(normalizedCode);

    if (company) {
      // Valid company found
      console.log(
        `✅ Valid access code: ${normalizedCode} for ${company.company_name}`,
      );

      return NextResponse.json({
        success: true,
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
      // Check if it's a new access code pattern (starts with letter, contains numbers)
      const newCodePattern = /^[A-Z]{3,10}\d{2,4}$/;

      if (newCodePattern.test(normalizedCode)) {
        // Auto-create new company for valid pattern
        const companyName = `Company ${normalizedCode}`;

        const result = await db.createTrialCompany({
          accessCode: normalizedCode,
          companyName: companyName,
          phone: "",
          email: `${normalizedCode.toLowerCase()}@example.com`
        });

        console.log(
          `🆕 Auto-created company: ${companyName} with code ${normalizedCode}`,
        );

        return NextResponse.json({
          success: true,
          company: {
            id: result.id,
            accessCode: normalizedCode,
            name: companyName,
            phone: "",
            email: `${normalizedCode.toLowerCase()}@example.com`,
            logoUrl: null,
          },
          isNewCompany: true,
        });
      } else {
        // Invalid access code
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

// GET endpoint to list available demo companies (for testing)
export async function GET() {
  try {
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 },
      );
    }

    const companies = await db.getAllCompanies();

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