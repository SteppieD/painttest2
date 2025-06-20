import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/database/init";
import { subscriptionManager } from "@/lib/subscription-manager";
import { vercelDb } from "@/lib/database/vercel-adapter";
import { supabaseDb } from "@/lib/database/supabase-adapter";

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

    // Database selection priority: Supabase > Vercel Postgres > SQLite
    const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
    const isVercel = process.env.VERCEL === '1';
    let result: any;

    if (hasSupabase) {
      // Use Supabase (preferred for production)
      console.log('Using Supabase PostgreSQL database...');
      
      try {
        // Initialize schema if needed
        await supabaseDb.initializeSchema();
        await supabaseDb.seedDemoCompanies();
        
        // Check existing companies
        const existing = await supabaseDb.checkExistingCompany(cleanAccessCode, email);
        
        if (existing.codeExists) {
          return NextResponse.json(
            { error: "This access code is already taken. Please choose a different one." },
            { status: 409 }
          );
        }

        if (existing.emailExists) {
          return NextResponse.json(
            { error: "An account with this email already exists." },
            { status: 409 }
          );
        }

        // Create new trial company
        result = await supabaseDb.createTrialCompany({
          accessCode: cleanAccessCode,
          companyName,
          email,
          phone
        });

        console.log(`✅ Trial account created with Supabase: ${cleanAccessCode} - ${companyName} (${email})`);

      } catch (supabaseError) {
        console.error('Supabase error, falling back to next option:', supabaseError);
        throw supabaseError;
      }
      
    } else if (isVercel) {
      // Use Vercel Postgres
      console.log('Using Vercel Postgres database...');
      
      // Initialize schema if needed
      await vercelDb.initializeSchema();
      await vercelDb.seedDemoCompanies();
      
      // Check existing companies
      const existing = await vercelDb.checkExistingCompany(cleanAccessCode, email);
      
      if (existing.codeExists) {
        return NextResponse.json(
          { error: "This access code is already taken. Please choose a different one." },
          { status: 409 }
        );
      }

      if (existing.emailExists) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }

      // Create new trial company
      result = await vercelDb.createTrialCompany({
        accessCode: cleanAccessCode,
        companyName,
        email,
        phone
      });

      console.log(`✅ Trial account created on Vercel: ${cleanAccessCode} - ${companyName} (${email})`);
      
    } else {
      // Use SQLite for local development
      console.log('Using SQLite database...');
      
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

      result = insertStmt.run(
        cleanAccessCode,
        companyName,
        phone || null,
        email,
        3.00, 2.00, 1.92,
        26.00, 25.00, 35.00,
        30, 350, 12,
        0, 0, 'Tax',
        1, 1
      );

      // Create subscription for the new company
      try {
        await subscriptionManager.createTrialSubscription(result.lastInsertRowid as number, 'plan_free');
      } catch (error) {
        console.error('Failed to create trial subscription:', error);
      }

      console.log(`✅ Trial account created: ${cleanAccessCode} - ${companyName} (${email})`);
    }

    return NextResponse.json({
      success: true,
      accessCode: cleanAccessCode,
      companyName,
      message: "Trial account created successfully! You have 1 free quote included.",
      quotesRemaining: 1
    });

  } catch (error) {
    console.error("Trial signup error:", error);
    
    // More specific error handling for debugging
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
      
      // Check if it's a database connection issue
      if (error.message.includes('database') || error.message.includes('SQLITE') || error.message.includes('better-sqlite3')) {
        return NextResponse.json(
          { error: "Database connection issue. This may be a temporary problem with the deployment. Please try again in a moment." },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to create trial account. Please try again." },
      { status: 500 }
    );
  }
}