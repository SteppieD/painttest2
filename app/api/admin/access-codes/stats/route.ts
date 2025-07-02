import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const dbPath = path.join(process.cwd(), 'painting_quotes_app.db');
    const db = new Database(dbPath);

    // Check if access_codes table exists
    const tableExists = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='access_codes'
    `).get();

    if (!tableExists) {
      // Return default stats if table doesn't exist
      db.close();
      return NextResponse.json({
        total_codes: 0,
        active_codes: 0,
        expired_codes: 0,
        total_usage: 0,
        companies_created: 0
      });
    }

    // Get basic stats
    const statsQuery = db.prepare(`
      SELECT 
        COUNT(*) as total_codes,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_codes,
        COUNT(CASE WHEN status = 'expired' OR (expires_at IS NOT NULL AND expires_at < datetime('now')) THEN 1 END) as expired_codes,
        COALESCE(SUM(used_quotes), 0) as total_usage
      FROM access_codes
    `);
    
    const stats = statsQuery.get() as any;

    // Get companies created (from companies table using access codes)
    const companiesQuery = db.prepare(`
      SELECT COUNT(DISTINCT id) as companies_created
      FROM companies
    `);
    
    const companies = companiesQuery.get() as any;

    db.close();

    return NextResponse.json({
      total_codes: stats.total_codes || 0,
      active_codes: stats.active_codes || 0,
      expired_codes: stats.expired_codes || 0,
      total_usage: stats.total_usage || 0,
      companies_created: companies.companies_created || 0
    });

  } catch (error) {
    console.error('Error loading access code stats:', error);
    return NextResponse.json(
      { error: 'Failed to load access code statistics' },
      { status: 500 }
    );
  }
}