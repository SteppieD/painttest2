import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbRun } from "@/lib/database";

// Initialize preferences table (will be handled by database adapter)
console.log('Company preferences API initialized');

export async function POST(req: NextRequest) {
  try {
    const { companyId, defaultMarkup, setupCompleted } = await req.json();

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );
    }

    // Check if preferences already exist
    const existing = dbGet(
      "SELECT id FROM company_preferences WHERE company_id = ?",
      [companyId]
    );

    if (existing) {
      // Update existing preferences
      dbRun(`
        UPDATE company_preferences 
        SET default_markup = ?, setup_completed = ?, updated_at = CURRENT_TIMESTAMP
        WHERE company_id = ?
      `, [defaultMarkup || 20, setupCompleted ? 1 : 0, companyId]);
    } else {
      // Create new preferences
      dbRun(`
        INSERT INTO company_preferences (company_id, default_markup, setup_completed)
        VALUES (?, ?, ?)
      `, [companyId, defaultMarkup || 20, setupCompleted ? 1 : 0]);
    }

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

    const preferences = dbGet(`
      SELECT * FROM company_preferences WHERE company_id = ?
    `, [companyId]);

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