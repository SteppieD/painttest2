import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin/auth';
import Database from 'better-sqlite3';
import path from 'path';

export const dynamic = 'force-dynamic';

// Initialize database
const dbPath = path.join(process.cwd(), 'painting_quotes_app.db');
const db = new Database(dbPath);

// POST - Reset test user (clear quotes, reset usage)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Test user ID is required' },
        { status: 400 }
      );
    }

    // Check if test user exists
    const testUser = db.prepare('SELECT * FROM test_users WHERE id = ?').get(id);
    if (!testUser) {
      return NextResponse.json(
        { error: 'Test user not found' },
        { status: 404 }
      );
    }

    const { access_code, company_name } = testUser as any;

    // Begin transaction to reset the test user
    const transaction = db.transaction(() => {
      // Delete all quotes for this test user
      db.prepare('DELETE FROM quotes WHERE user_id = ?').run(access_code);
      
      // Reset quote usage counter
      db.prepare('UPDATE test_users SET quotes_used = 0, last_used_at = NULL WHERE id = ?').run(id);
      
      // Reset any company-specific data if it exists
      db.prepare('UPDATE companies SET total_quotes = 0, total_revenue = 0 WHERE access_code = ?').run(access_code);
      
      // Clear any cached analytics or metrics for this test user
      db.prepare('DELETE FROM customer_metrics WHERE user_id = ? OR customer_id = ?').run(access_code, access_code);
    });

    transaction();

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
      'reset_test_user',
      JSON.stringify({
        test_user_id: id,
        company_name: company_name,
        access_code: access_code,
        action: 'cleared_all_quotes_and_usage'
      }),
      clientIP
    );

    // Return updated test user
    const resetUser = db.prepare('SELECT * FROM test_users WHERE id = ?').get(id);

    return NextResponse.json({ 
      testUser: resetUser,
      message: 'Test user reset successfully - all quotes and usage data cleared'
    });

  } catch (error) {
    console.error('Error resetting test user:', error);
    return NextResponse.json(
      { error: 'Failed to reset test user' },
      { status: 500 }
    );
  }
}