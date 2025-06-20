import { NextRequest, NextResponse } from "next/server";

// Vercel Functions only support external databases (Supabase)
const getSupabaseDb = async () => {
  try {
    const { supabaseDb } = await import("@/lib/database/supabase-adapter");
    return supabaseDb;
  } catch (error) {
    console.error('Failed to import Supabase adapter:', error);
    return null;
  }
};

export async function POST(request: NextRequest) {
  console.log('Trial signup API called');
  
  try {
    const body = await request.json();
    console.log('Request body:', body);
    
    const { companyName, accessCode, contactName, email, phone } = body;

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

    // Vercel Functions require external database (Supabase only)
    const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!hasSupabase) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { error: "Database configuration error. Please contact support." },
        { status: 500 }
      );
    }

    console.log('Using Supabase PostgreSQL database...');
    
    const supabaseDb = await getSupabaseDb();
    if (!supabaseDb) {
      console.error('Failed to load Supabase adapter');
      return NextResponse.json(
        { error: "Database connection failed. Please try again." },
        { status: 500 }
      );
    }
    
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
    const result = await supabaseDb.createTrialCompany({
      accessCode: cleanAccessCode,
      companyName,
      email,
      phone
    });

    console.log(`✅ Trial account created with Supabase: ${cleanAccessCode} - ${companyName} (${email})`);

    // Send email with access code
    try {
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          companyName,
          accessCode: cleanAccessCode,
          type: 'trial_signup'
        })
      });
      console.log('📧 Welcome email sent to:', email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the signup if email fails
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