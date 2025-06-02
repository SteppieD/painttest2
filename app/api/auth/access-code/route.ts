import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

// Initialize SQLite database connection
const dbPath = path.join(process.cwd(), "quotes.db");
const db = new Database(dbPath);

// Ensure database tables exist on startup
const setupDatabase = () => {
  try {
    // Check if companies table exists
    const companiesTableExists = db
      .prepare(
        `
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='companies'
    `,
      )
      .get();

    if (!companiesTableExists) {
      // Create companies table if it doesn't exist
      db.exec(`
        CREATE TABLE companies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          access_code TEXT UNIQUE NOT NULL,
          company_name TEXT NOT NULL,
          phone TEXT,
          email TEXT,
          logo_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Add company_id to quotes table if it doesn't exist
      try {
        db.exec(
          `ALTER TABLE quotes ADD COLUMN company_id INTEGER REFERENCES companies(id)`,
        );
      } catch (err) {
        // Column might already exist, that's OK
      }

      // Insert default demo companies
      const insertCompany = db.prepare(`
        INSERT OR IGNORE INTO companies (access_code, company_name, phone, email) 
        VALUES (?, ?, ?, ?)
      `);

      const companies = [
        [
          "DEMO2024",
          "Demo Painting Company",
          "(555) 123-4567",
          "demo@paintingcompany.com",
        ],
        [
          "PAINTER001",
          "Smith Painting LLC",
          "(555) 987-6543",
          "info@smithpainting.com",
        ],
        [
          "CONTRACTOR123",
          "Elite Contractors",
          "(555) 456-7890",
          "quotes@elitecontractors.com",
        ],
        [
          "CUSTOM789",
          "Custom Paint Works",
          "(555) 234-5678",
          "hello@custompaintworks.com",
        ],
        [
          "BUILDER456",
          "Premier Builders",
          "(555) 345-6789",
          "contact@premierbuilders.com",
        ],
        [
          "PAINT2025",
          "Modern Paint Solutions",
          "(555) 567-8901",
          "info@modernpaint.com",
        ],
      ];

      companies.forEach((company) => {
        insertCompany.run(...company);
      });

      // Create indexes for better performance
      db.exec(
        `CREATE INDEX IF NOT EXISTS idx_companies_access_code ON companies(access_code)`,
      );
      db.exec(
        `CREATE INDEX IF NOT EXISTS idx_quotes_company_id ON quotes(company_id)`,
      );

      console.log("✅ Database setup complete - companies table created");
    }
  } catch (error) {
    console.error("❌ Database setup error:", error);
  }
};

// Run setup on API startup
setupDatabase();

// POST endpoint - Verify access code
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
    const findCompany = db.prepare(`
      SELECT id, access_code, company_name, phone, email, logo_url
      FROM companies 
      WHERE access_code = ?
    `);

    const company = findCompany.get(normalizedCode);

    if (company) {
      // Valid company found - return company data
      console.log(
        `✅ Valid access code: ${normalizedCode} for ${company.company_name}`,
      );

      return NextResponse.json({
        success: true,
        companyName: company.company_name,
        userId: `demo_${company.id}_${Date.now()}`,
        sessionToken: `session_${company.id}_${Date.now()}`,
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
      // Check if it's a valid new access code pattern (letters + numbers)
      const newCodePattern = /^[A-Z]{3,10}\\d{2,4}$/;

      if (newCodePattern.test(normalizedCode)) {
        // Auto-create new company for valid pattern
        const companyName = `Company ${normalizedCode}`;

        const insertCompany = db.prepare(`
          INSERT INTO companies (access_code, company_name, phone, email) 
          VALUES (?, ?, ?, ?)
        `);

        const result = insertCompany.run(normalizedCode, companyName, "", "");

        console.log(
          `🆕 Auto-created company: ${companyName} with code ${normalizedCode}`,
        );

        return NextResponse.json({
          success: true,
          companyName: companyName,
          userId: `demo_${result.lastInsertRowid}_${Date.now()}`,
          sessionToken: `session_${result.lastInsertRowid}_${Date.now()}`,
          company: {
            id: result.lastInsertRowid,
            accessCode: normalizedCode,
            name: companyName,
            phone: "",
            email: "",
            logoUrl: null,
          },
          isNewCompany: true,
        });
      } else {
        // Invalid access code format
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

// GET endpoint - List available demo companies (for testing)
export async function GET() {
  try {
    const getCompanies = db.prepare(`
      SELECT access_code, company_name, phone 
      FROM companies 
      ORDER BY created_at ASC
    `);

    const companies = getCompanies.all();

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
