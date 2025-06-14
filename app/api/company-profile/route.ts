import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";

const db = new Database("./painting_quotes_app.db");

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      userId,
      companyName,
      companyAddress,
      companyPhone,
      companyEmail,
      companyWebsite,
      licenseNumber,
      insuranceInfo,
      quoteHeaderText,
      quoteFooterText,
      paymentTerms,
      companyLogoUrl,
    } = data;

    if (!userId || !companyName) {
      return NextResponse.json(
        { error: "User ID and company name are required" },
        { status: 400 }
      );
    }

    // Check if profile already exists
    const existingProfile = db.prepare(
      "SELECT id FROM company_profiles WHERE user_id = ?"
    ).get(userId);

    if (existingProfile) {
      // Update existing profile
      const updateStmt = db.prepare(`
        UPDATE company_profiles
        SET company_name = ?,
            company_logo_url = ?,
            company_address = ?,
            company_phone = ?,
            company_email = ?,
            company_website = ?,
            license_number = ?,
            insurance_info = ?,
            quote_header_text = ?,
            quote_footer_text = ?,
            payment_terms = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `);

      updateStmt.run(
        companyName,
        companyLogoUrl || null,
        companyAddress || null,
        companyPhone || null,
        companyEmail || null,
        companyWebsite || null,
        licenseNumber || null,
        insuranceInfo || null,
        quoteHeaderText || null,
        quoteFooterText || null,
        paymentTerms || "Net 30",
        userId
      );
    } else {
      // Create new profile
      const insertStmt = db.prepare(`
        INSERT INTO company_profiles (
          user_id,
          company_name,
          company_logo_url,
          company_address,
          company_phone,
          company_email,
          company_website,
          license_number,
          insurance_info,
          quote_header_text,
          quote_footer_text,
          payment_terms,
          onboarding_step
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertStmt.run(
        userId,
        companyName,
        companyLogoUrl || null,
        companyAddress || null,
        companyPhone || null,
        companyEmail || null,
        companyWebsite || null,
        licenseNumber || null,
        insuranceInfo || null,
        quoteHeaderText || null,
        quoteFooterText || null,
        paymentTerms || "Net 30",
        "paint_products"
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving company profile:", error);
    return NextResponse.json(
      { error: "Failed to save company profile" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const profile = db.prepare(`
      SELECT * FROM company_profiles WHERE user_id = ?
    `).get(userId);

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch company profile" },
      { status: 500 }
    );
  }
}