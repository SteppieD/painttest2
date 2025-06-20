import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    // Try to find company by email in Supabase
    const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (hasSupabase) {
      const { supabaseDb } = await import("@/lib/database/supabase-adapter");
      
      try {
        // Get the Supabase instance directly
        const { getSupabaseDb } = await import("@/lib/database/supabase-adapter");
        const db = getSupabaseDb();
        
        if (db && (db as any).supabase) {
          const { data, error } = await (db as any).supabase
            .from('companies')
            .select('access_code, company_name')
            .eq('email', email.toLowerCase())
            .single();
          
          if (data && data.access_code) {
            // Send recovery email
            try {
              await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/api/send-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email,
                  companyName: data.company_name,
                  accessCode: data.access_code,
                  type: 'code_recovery'
                })
              });
            } catch (emailError) {
              console.error('Failed to send recovery email:', emailError);
            }
            
            return NextResponse.json({
              success: true,
              accessCode: data.access_code,
              message: "Access code found! We've also sent it to your email."
            });
          }
        }
      } catch (error) {
        console.error('Database error:', error);
      }
    }
    
    // If no company found
    return NextResponse.json(
      { error: "No account found with this email address. Please check and try again." },
      { status: 404 }
    );

  } catch (error) {
    console.error("Code recovery error:", error);
    return NextResponse.json(
      { error: "Failed to recover access code. Please try again." },
      { status: 500 }
    );
  }
}