import { NextRequest, NextResponse } from "next/server";
import { getCompanyByAccessCode, createCompany, dbAll, dbRun } from "@/lib/database";

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

    // Check if access code exists in companies table
    const company = getCompanyByAccessCode(normalizedCode) as Company | undefined;

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

        const result = createCompany({
          access_code: normalizedCode,
          company_name: companyName,
          phone: "",
          email: ""
        });

        // Create a user record for the new company
        const userId = crypto.randomUUID();
        dbRun(
          `INSERT INTO users (id, email, company_name) VALUES (?, ?, ?)`,
          [userId, `${normalizedCode.toLowerCase()}@example.com`, companyName]
        );

        console.log(
          `🆕 Auto-created company: ${companyName} with code ${normalizedCode}`,
        );

        return NextResponse.json({
          success: true,
          company: {
            id: userId, // Use the user ID instead of company ID
            accessCode: normalizedCode,
            name: companyName,
            phone: "",
            email: "",
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
    const companies = dbAll(`
      SELECT access_code, company_name, phone 
      FROM companies 
      ORDER BY created_at ASC
    `) as Pick<Company, "access_code" | "company_name" | "phone">[];

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