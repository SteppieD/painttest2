import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin/auth';
import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// Initialize database
const dbPath = path.join(process.cwd(), 'painting_quotes_app.db');
const db = new Database(dbPath);

// Create test_users table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS test_users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    company_name TEXT NOT NULL,
    access_code TEXT UNIQUE NOT NULL,
    test_type TEXT NOT NULL CHECK (test_type IN ('demo', 'qa', 'support', 'developer')),
    subscription_plan TEXT DEFAULT 'Professional',
    quotes_allowed INTEGER DEFAULT 25,
    quotes_used INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'disabled')),
    description TEXT,
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    last_used_at DATETIME
  )
`);

// GET - Retrieve all test users
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const testType = searchParams.get('type');
    const status = searchParams.get('status');

    let query = 'SELECT * FROM test_users';
    const conditions = [];
    const params = [];

    if (testType && testType !== 'all') {
      conditions.push('test_type = ?');
      params.push(testType);
    }

    if (status && status !== 'all') {
      conditions.push('status = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const testUsers = db.prepare(query).all(...params);

    return NextResponse.json({ testUsers });
  } catch (error) {
    console.error('Error fetching test users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test users' },
      { status: 500 }
    );
  }
}

// POST - Create new test user
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      company_name,
      access_code,
      test_type,
      quotes_allowed,
      expires_days,
      description
    } = body;

    // Validation
    if (!company_name?.trim()) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    if (!test_type || !['demo', 'qa', 'support', 'developer'].includes(test_type)) {
      return NextResponse.json(
        { error: 'Valid test type is required' },
        { status: 400 }
      );
    }

    // Generate access code if not provided
    const finalAccessCode = access_code || generateTestCode(test_type);

    // Check if access code already exists
    const existingCode = db.prepare('SELECT id FROM test_users WHERE access_code = ?').get(finalAccessCode);
    if (existingCode) {
      return NextResponse.json(
        { error: 'Access code already exists' },
        { status: 400 }
      );
    }

    // Calculate expiration date
    let expiresAt = null;
    if (expires_days && parseInt(expires_days) > 0) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + parseInt(expires_days));
      expiresAt = expirationDate.toISOString();
    }

    // Get subscription plan based on test type
    const planMapping = {
      demo: 'Professional',
      qa: 'Business',
      support: 'Professional',
      developer: 'Business'
    };

    const id = crypto.randomBytes(16).toString('hex');
    const subscriptionPlan = planMapping[test_type as keyof typeof planMapping];
    const quotesAllowedFinal = quotes_allowed ? parseInt(quotes_allowed) : getDefaultQuotes(test_type);

    // Insert test user
    const insertQuery = `
      INSERT INTO test_users (
        id, company_name, access_code, test_type, subscription_plan,
        quotes_allowed, quotes_used, status, description, created_by,
        created_at, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.prepare(insertQuery).run(
      id,
      company_name.trim(),
      finalAccessCode,
      test_type,
      subscriptionPlan,
      quotesAllowedFinal,
      0,
      'active',
      description?.trim() || null,
      authResult.user.id,
      new Date().toISOString(),
      expiresAt
    );

    // Log admin activity
    const activityQuery = `
      INSERT INTO admin_activity_logs (admin_user_id, action, details, ip_address)
      VALUES (?, ?, ?, ?)
    `;

    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    db.prepare(activityQuery).run(
      authResult.user.id,
      'create_test_user',
      JSON.stringify({
        test_user_id: id,
        company_name: company_name.trim(),
        access_code: finalAccessCode,
        test_type: test_type
      }),
      clientIP
    );

    // Return created test user
    const createdUser = db.prepare('SELECT * FROM test_users WHERE id = ?').get(id);

    return NextResponse.json({ 
      testUser: createdUser,
      message: 'Test user created successfully'
    });

  } catch (error) {
    console.error('Error creating test user:', error);
    return NextResponse.json(
      { error: 'Failed to create test user' },
      { status: 500 }
    );
  }
}

// Helper functions
function generateTestCode(type: string): string {
  const prefixes = {
    demo: 'DEMO',
    qa: 'TEST',
    support: 'SUPP',
    developer: 'DEV'
  };
  const prefix = prefixes[type as keyof typeof prefixes] || 'TEST';
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}${timestamp}`;
}

function getDefaultQuotes(type: string): number {
  const defaults = {
    demo: 25,
    qa: 100,
    support: 50,
    developer: 200
  };
  return defaults[type as keyof typeof defaults] || 25;
}