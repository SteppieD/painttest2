import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
import { generateQuoteId } from "@/lib/utils";

const dbPath = path.join(process.cwd(), "quotes.db");
const db = new Database(dbPath);

// Initialize the database tables
const initializeDatabase = () => {
  try {
    // Create companies table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT NOT NULL,
        access_code TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create quotes table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quote_id TEXT UNIQUE,
        customer_name TEXT NOT NULL,
        customer_email TEXT,
        customer_phone TEXT,
        address TEXT,
        project_type TEXT,
        paint_type TEXT,
        prep_work TEXT,
        timeline TEXT,
        rooms_data TEXT,
        sqft INTEGER,
        quote_amount REAL,
        labor_cost REAL,
        materials_cost REAL,
        prep_work_cost REAL,
        markup_amount REAL,
        time_estimate TEXT,
        notes TEXT,
        conversation_history TEXT,
        company_id INTEGER,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id)
      )
    `);

    // Insert default company if it doesn't exist
    const existingCompany = db.prepare("SELECT id FROM companies WHERE access_code = ?").get("DEMO2024");
    if (!existingCompany) {
      db.prepare("INSERT INTO companies (company_name, access_code) VALUES (?, ?)").run("Demo Company", "DEMO2024");
    }

    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// Initialize database on startup
initializeDatabase();

interface QuoteRequestBody {
  quoteData?: any;
  conversationHistory?: Array<{role: string; content: string}>;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  address?: string;
  quote_amount?: number;
  notes?: string;
  company_id?: number;
}

interface QuoteRecord {
  id: number;
  quote_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  address?: string;
  project_type?: string;
  paint_type?: string;
  prep_work?: string;
  timeline?: string;
  rooms_data?: string;
  sqft?: number;
  quote_amount: number;
  labor_cost?: number;
  materials_cost?: number;
  prep_work_cost?: number;
  markup_amount?: number;
  time_estimate?: string;
  notes?: string;
  conversation_history?: string | Array<{role: string; content: string}>;
  company_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  company_name?: string;
  access_code?: string;
}

// POST endpoint - Create new quote
export async function POST(request: NextRequest) {
  try {
    const body: QuoteRequestBody = await request.json();

    // If this is a quote generation request (from chat)
    if (body.quoteData && body.conversationHistory) {
      const quote = body.quoteData;
      const quoteId = generateQuoteId();
      
      // Extract customer info from conversation if available
      let customerName = 'Customer';
      let customerEmail = '';
      let customerPhone = '';
      let address = '';

      // Simple extraction from conversation history
      const conversationText = body.conversationHistory.map(msg => msg.content).join(' ');
      
      // Try to extract email
      const emailMatch = conversationText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
      if (emailMatch) customerEmail = emailMatch[0];

      // Try to extract phone
      const phoneMatch = conversationText.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/);
      if (phoneMatch) customerPhone = phoneMatch[0];

      const stmt = db.prepare(`
        INSERT INTO quotes (
          quote_id, customer_name, customer_email, customer_phone, address,
          project_type, paint_type, prep_work, timeline, sqft,
          quote_amount, labor_cost, materials_cost, prep_work_cost, markup_amount,
          time_estimate, conversation_history, company_id, status,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `);

      const result = stmt.run(
        quoteId,
        customerName,
        customerEmail,
        customerPhone,
        address,
        quote.projectType || '',
        quote.paintType || '',
        quote.prepWork || '',
        quote.timeline || '',
        quote.details?.sqft || 0,
        quote.totalCost || 0,
        quote.breakdown?.labor || 0,
        quote.breakdown?.materials || 0,
        quote.breakdown?.prepWork || 0,
        quote.breakdown?.markup || 0,
        quote.timeEstimate || '',
        JSON.stringify(body.conversationHistory),
        1, // Default company ID
        'pending'
      );

      return NextResponse.json({
        id: result.lastInsertRowid,
        quoteId: quoteId,
        totalCost: quote.totalCost,
        timeEstimate: quote.timeEstimate,
        breakdown: quote.breakdown,
        details: quote.details,
        message: "Quote generated successfully"
      });
    }

    // If this is a manual quote creation request
    const {
      customer_name,
      customer_email,
      customer_phone,
      address,
      quote_amount,
      notes,
      company_id,
    } = body;

    // Validate required fields
    if (!customer_name || !address || !quote_amount) {
      return NextResponse.json(
        {
          error: "Missing required fields: customer_name, address, quote_amount",
        },
        { status: 400 },
      );
    }

    const finalCompanyId = company_id || 1;
    const quoteId = generateQuoteId();

    const stmt = db.prepare(`
      INSERT INTO quotes (quote_id, customer_name, customer_email, customer_phone, address, quote_amount, notes, company_id, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    const result = stmt.run(
      quoteId,
      customer_name,
      customer_email || "",
      customer_phone || "",
      address,
      quote_amount,
      notes || "",
      finalCompanyId,
      "pending",
    );

    return NextResponse.json({
      id: result.lastInsertRowid,
      quoteId: quoteId,
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

// GET endpoint - Fetch quotes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("company_id");
    const quoteId = searchParams.get("quote_id");

    let stmt: any;
    let quotes: QuoteRecord | QuoteRecord[] | null;

    if (quoteId) {
      // Get specific quote
      stmt = db.prepare(`
        SELECT q.*, c.company_name, c.access_code
        FROM quotes q
        LEFT JOIN companies c ON q.company_id = c.id
        WHERE q.quote_id = ? OR q.id = ?
      `);
      quotes = stmt.get(quoteId, quoteId) as QuoteRecord | null;
      
      if (!quotes) {
        return NextResponse.json(
          { error: "Quote not found" },
          { status: 404 }
        );
      }

      // Parse conversation history if it exists
      if (quotes && quotes.conversation_history && typeof quotes.conversation_history === 'string') {
        try {
          quotes.conversation_history = JSON.parse(quotes.conversation_history);
        } catch (e) {
          quotes.conversation_history = [];
        }
      }

      return NextResponse.json(quotes);
    }

    if (companyId) {
      // Get quotes for specific company
      stmt = db.prepare(`
        SELECT q.*, c.company_name, c.access_code
        FROM quotes q
        LEFT JOIN companies c ON q.company_id = c.id
        WHERE q.company_id = ?
        ORDER BY q.created_at DESC
      `);
      quotes = stmt.all(companyId) as QuoteRecord[];
    } else {
      // Get all quotes
      stmt = db.prepare(`
        SELECT q.*, c.company_name, c.access_code
        FROM quotes q
        LEFT JOIN companies c ON q.company_id = c.id
        ORDER BY q.created_at DESC
      `);
      quotes = stmt.all() as QuoteRecord[];
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