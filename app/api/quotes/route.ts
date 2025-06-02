import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "quotes.db");
const db = new Database(dbPath);

// Ensure quotes table has all required columns
const setupQuotesTable = () => {
  try {
    // Check if status column exists
    const columns = db.prepare(`PRAGMA table_info(quotes)`).all();
    const hasStatusColumn = columns.some((col: any) => col.name === "status");

    if (!hasStatusColumn) {
      db.exec(`ALTER TABLE quotes ADD COLUMN status TEXT DEFAULT 'pending'`);
      console.log("✅ Added status column to quotes table");
    }

    // Check if updated_at column exists
    const hasUpdatedAtColumn = columns.some(
      (col: any) => col.name === "updated_at",
    );

    if (!hasUpdatedAtColumn) {
      db.exec(
        `ALTER TABLE quotes ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP`,
      );
      console.log("✅ Added updated_at column to quotes table");
    }
  } catch (error) {
    console.error("Error setting up quotes table:", error);
  }
};

// Run setup
setupQuotesTable();

// POST endpoint - Create new quote
export async function POST(request: NextRequest) {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      address,
      quote_amount,
      notes,
      company_id,
    } = await request.json();

    // Validate required fields
    if (!customer_name || !address || !quote_amount) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: customer_name, address, quote_amount",
        },
        { status: 400 },
      );
    }

    // Get company_id from session storage or default to 1 (DEMO2024)
    const finalCompanyId = company_id || 1;

    // Insert quote with company association and default status
    const stmt = db.prepare(`
      INSERT INTO quotes (customer_name, customer_email, customer_phone, address, quote_amount, notes, company_id, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    const result = stmt.run(
      customer_name,
      customer_email || "",
      customer_phone || "",
      address,
      quote_amount,
      notes || "",
      finalCompanyId,
      "pending", // Default status
    );

    console.log(
      `✅ Quote ${result.lastInsertRowid} saved for company ${finalCompanyId}`,
    );

    return NextResponse.json({
      id: result.lastInsertRowid,
      message: "Quote saved successfully",
      company_id: finalCompanyId,
    });
  } catch (error) {
    console.error("Error saving quote:", error);
    return NextResponse.json(
      { error: "Failed to save quote" },
      { status: 500 },
    );
  }
}

// GET endpoint - Fetch quotes with company filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("company_id");

    let stmt, quotes;

    if (companyId) {
      // Get quotes for specific company with company info
      stmt = db.prepare(`
        SELECT q.*, c.company_name, c.access_code
        FROM quotes q
        LEFT JOIN companies c ON q.company_id = c.id
        WHERE q.company_id = ?
        ORDER BY q.created_at DESC
      `);
      quotes = stmt.all(companyId);
    } else {
      // Get all quotes with company info (admin view)
      stmt = db.prepare(`
        SELECT q.*, c.company_name, c.access_code
        FROM quotes q
        LEFT JOIN companies c ON q.company_id = c.id
        ORDER BY q.created_at DESC
      `);
      quotes = stmt.all();
    }

    return NextResponse.json(quotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 },
    );
  }
}
