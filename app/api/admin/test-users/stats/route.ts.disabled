import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin/auth';
import Database from 'better-sqlite3';
import path from 'path';

export const dynamic = 'force-dynamic';

// Initialize database
const dbPath = path.join(process.cwd(), 'painting_quotes_app.db');
const db = new Database(dbPath);

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get test user statistics
    const stats = {
      total_test_users: 0,
      active_test_users: 0,
      demo_users: 0,
      qa_users: 0,
      support_users: 0,
      developer_users: 0,
      total_test_quotes: 0
    };

    // Total test users
    const totalQuery = 'SELECT COUNT(*) as count FROM test_users';
    const totalResult = db.prepare(totalQuery).get() as { count: number };
    stats.total_test_users = totalResult.count;

    // Active test users
    const activeQuery = 'SELECT COUNT(*) as count FROM test_users WHERE status = ?';
    const activeResult = db.prepare(activeQuery).get('active') as { count: number };
    stats.active_test_users = activeResult.count;

    // Test users by type
    const typeQueries = {
      demo_users: 'demo',
      qa_users: 'qa',
      support_users: 'support',
      developer_users: 'developer'
    };

    for (const [statKey, testType] of Object.entries(typeQueries)) {
      const typeQuery = 'SELECT COUNT(*) as count FROM test_users WHERE test_type = ?';
      const typeResult = db.prepare(typeQuery).get(testType) as { count: number };
      stats[statKey as keyof typeof stats] = typeResult.count;
    }

    // Total quotes used by test users
    const quotesQuery = 'SELECT SUM(quotes_used) as total FROM test_users';
    const quotesResult = db.prepare(quotesQuery).get() as { total: number | null };
    stats.total_test_quotes = quotesResult.total || 0;

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching test user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test user statistics' },
      { status: 500 }
    );
  }
}