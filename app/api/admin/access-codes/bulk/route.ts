import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { count, prefix, max_quotes, expires_days, description } = body;

    if (!count || count < 1 || count > 100) {
      return NextResponse.json(
        { error: 'Count must be between 1 and 100' },
        { status: 400 }
      );
    }

    const dbPath = path.join(process.cwd(), 'painting_quotes_app.db');
    const db = new Database(dbPath);

    // Check if access_codes table exists, create if not
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS access_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        company_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME,
        max_quotes INTEGER,
        used_quotes INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        created_by TEXT DEFAULT 'admin',
        description TEXT,
        last_used_at DATETIME
      )
    `;
    
    db.exec(createTableQuery);

    // Generate codes
    const codes = [];
    const createdCodes = [];
    
    // Calculate expiration date if specified
    let expiresAt = null;
    if (expires_days) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + expires_days);
      expiresAt = expirationDate.toISOString();
    }

    // Generate unique codes
    for (let i = 0; i < count; i++) {
      let attempts = 0;
      let code = '';
      let isUnique = false;
      
      while (!isUnique && attempts < 10) {
        // Generate random suffix
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let suffix = '';
        for (let j = 0; j < 4; j++) {
          suffix += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        code = `${prefix}${suffix}`;
        
        // Check if code already exists
        const existingCode = db.prepare('SELECT id FROM access_codes WHERE code = ?').get(code);
        if (!existingCode) {
          isUnique = true;
        }
        attempts++;
      }
      
      if (!isUnique) {
        db.close();
        return NextResponse.json(
          { error: `Failed to generate unique code after 10 attempts for item ${i + 1}` },
          { status: 400 }
        );
      }
      
      codes.push({
        code,
        max_quotes,
        expires_at: expiresAt,
        description
      });
    }

    // Insert all codes
    const insertQuery = db.prepare(`
      INSERT INTO access_codes (code, max_quotes, expires_at, description)
      VALUES (?, ?, ?, ?)
    `);

    const transaction = db.transaction((codes) => {
      for (const codeData of codes) {
        insertQuery.run(
          codeData.code,
          codeData.max_quotes || null,
          codeData.expires_at,
          codeData.description || null
        );
        createdCodes.push(codeData.code);
      }
    });

    transaction(codes);
    db.close();

    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdCodes.length} access codes`,
      codes: createdCodes
    });

  } catch (error) {
    console.error('Error creating bulk access codes:', error);
    return NextResponse.json(
      { error: 'Failed to create access codes' },
      { status: 500 }
    );
  }
}