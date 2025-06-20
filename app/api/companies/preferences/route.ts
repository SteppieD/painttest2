import { NextRequest, NextResponse } from "next/server";
import { supabaseDb } from "@/lib/database/supabase-adapter";

export async function POST(req: NextRequest) {
  try {
    const { companyId, defaultMarkup, setupCompleted } = await req.json();

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Save or update preferences using Supabase
    await supabaseDb.saveCompanyPreferences(companyId, {
      defaultMarkup: defaultMarkup || 20,
      setupCompleted: setupCompleted === true
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving company preferences:", error);
    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    const preferences = await supabaseDb.getCompanyPreferences(companyId);

    return NextResponse.json({ 
      preferences: preferences || {
        default_markup: 20,
        setup_completed: false
      }
    });
  } catch (error) {
    console.error("Error fetching company preferences:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}