import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";

const db = new Database("./painting_quotes_app.db");

// Ensure the preferences table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS company_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    default_markup INTEGER DEFAULT 20,
    setup_completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies (id)
  )
`);

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
    const existing = db.prepare(
      "SELECT id FROM company_preferences WHERE company_id = ?"
    ).get(companyId);

    if (existing) {
      // Update existing preferences
      const updateStmt = db.prepare(`
        UPDATE company_preferences 
        SET default_markup = ?, setup_completed = ?, updated_at = CURRENT_TIMESTAMP
        WHERE company_id = ?
      `);
      updateStmt.run(defaultMarkup || 20, setupCompleted ? 1 : 0, companyId);
    } else {
      // Create new preferences
      const insertStmt = db.prepare(`
        INSERT INTO company_preferences (company_id, default_markup, setup_completed)
        VALUES (?, ?, ?)
      `);
      insertStmt.run(companyId, defaultMarkup || 20, setupCompleted ? 1 : 0);
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

    const preferences = db.prepare(`
      SELECT * FROM company_preferences WHERE company_id = ?
    `).get(companyId);

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