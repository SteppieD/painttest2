import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/database/init";
import { subscriptionManager } from "@/lib/subscription-manager";

export async function POST(request: NextRequest) {
  try {
    const { companyName, accessCode, contactName, email, phone } = await request.json();

    // Validation
    if (!companyName || !accessCode || !email) {
      return NextResponse.json(
        { error: "Company name, access code, and email are required" },
        { status: 400 }
      );
    }

    if (accessCode.length < 4) {
      return NextResponse.json(
        { error: "Access code must be at least 4 characters" },
        { status: 400 }
      );
    }

    // Sanitize access code (alphanumeric only)
    const cleanAccessCode = accessCode.replace(/[^A-Z0-9]/g, "").substring(0, 20);
    if (cleanAccessCode.length < 4) {
      return NextResponse.json(
        { error: "Access code must contain at least 4 letters or numbers" },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // Check if access code already exists
    const existingCompany = db.prepare("SELECT id FROM companies WHERE access_code = ?").get(cleanAccessCode);
    if (existingCompany) {
      return NextResponse.json(
        { error: "This access code is already taken. Please choose a different one." },
        { status: 409 }
      );
    }

    // Check if email already exists
    const existingEmail = db.prepare("SELECT id FROM companies WHERE email = ?").get(email);
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Create new trial company with quote limit
    const insertStmt = db.prepare(`
      INSERT INTO companies (
        access_code, company_name, phone, email,
        default_walls_rate, default_ceilings_rate, default_trim_rate,
        default_walls_paint_cost, default_ceilings_paint_cost, default_trim_paint_cost,
        default_labor_percentage, default_paint_coverage, default_sundries_percentage,
        tax_rate, tax_on_materials_only, tax_label,
        quote_limit, is_trial
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertStmt.run(
      cleanAccessCode,
      companyName,
      phone || null,
      email,
      3.00, // default walls rate
      2.00, // default ceilings rate  
      1.92, // default trim rate
      26.00, // default walls paint cost
      25.00, // default ceilings paint cost
      35.00, // default trim paint cost
      30, // default labor percentage
      350, // default paint coverage
      12, // default sundries percentage
      0, // tax rate
      0, // tax on materials only
      'Tax', // tax label
      1, // quote_limit (1 free quote for trial)
      1  // is_trial (true)
    );

    // Create subscription for the new company
    try {
      await subscriptionManager.createTrialSubscription(result.lastInsertRowid as number, 'plan_free');
    } catch (error) {
      console.error('Failed to create trial subscription:', error);
      // Don't fail the account creation if subscription creation fails
    }

    // Log the trial account creation
    console.log(`✅ Trial account created: ${cleanAccessCode} - ${companyName} (${email})`);

    return NextResponse.json({
      success: true,
      accessCode: cleanAccessCode,
      companyName,
      message: "Trial account created successfully! You have 1 free quote included.",
      quotesRemaining: 1
    });

  } catch (error) {
    console.error("Trial signup error:", error);
    return NextResponse.json(
      { error: "Failed to create trial account. Please try again." },
      { status: 500 }
    );
  }
}