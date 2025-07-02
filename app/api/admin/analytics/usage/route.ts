import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30d';
    
    const dbPath = path.join(process.cwd(), 'painting_quotes_app.db');
    const db = new Database(dbPath);

    // Calculate date range based on timeframe
    const now = new Date();
    const timeframeDays = {
      '7d': 7,
      '30d': 30,
      '90d': 90
    };
    
    const daysBack = timeframeDays[timeframe as keyof typeof timeframeDays] || 30;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    const startDateStr = startDate.toISOString().split('T')[0];

    // Get total and active users
    const userStatsQuery = db.prepare(`
      SELECT 
        COUNT(DISTINCT id) as total_users,
        COUNT(DISTINCT CASE WHEN last_quote_date >= ? THEN id END) as active_users
      FROM companies
    `);
    
    const userStats = userStatsQuery.get(startDateStr) as any;

    // Get new users in timeframe
    const newUsersQuery = db.prepare(`
      SELECT COUNT(*) as new_users
      FROM companies 
      WHERE created_at >= ?
    `);
    
    const newUsers = newUsersQuery.get(startDateStr) as any;

    // Get session and quote data
    const activityQuery = db.prepare(`
      SELECT 
        COUNT(*) as total_sessions,
        COUNT(DISTINCT company_id) as unique_users,
        COUNT(*) as quotes_created
      FROM quotes 
      WHERE created_at >= ?
    `);
    
    const activity = activityQuery.get(startDateStr) as any;

    // Calculate average quotes per user
    const avgQuotesPerUser = userStats.active_users > 0 
      ? activity.quotes_created / userStats.active_users 
      : 0;

    // Simulated session duration (would need actual session tracking)
    const avgSessionDuration = 25; // 25 minutes average

    // Feature usage (simulated based on quote data and typical usage patterns)
    const featureUsage = {
      dashboard: Math.round(activity.total_sessions * 0.95), // Most users visit dashboard
      quoteCreation: activity.quotes_created,
      settings: Math.round(activity.total_sessions * 0.30), // 30% visit settings
      insights: Math.round(activity.total_sessions * 0.15)   // 15% check insights
    };

    // Device breakdown (simulated realistic data)
    const deviceBreakdown = {
      desktop: Math.round(userStats.total_users * 0.65),
      mobile: Math.round(userStats.total_users * 0.30),
      tablet: Math.round(userStats.total_users * 0.05)
    };

    // Browser breakdown (simulated realistic data)
    const browserBreakdown = {
      chrome: Math.round(userStats.total_users * 0.60),
      safari: Math.round(userStats.total_users * 0.25),
      firefox: Math.round(userStats.total_users * 0.08),
      edge: Math.round(userStats.total_users * 0.05),
      other: Math.round(userStats.total_users * 0.02)
    };

    // Get daily activity for the last 7 days
    const dailyActivityQuery = db.prepare(`
      SELECT 
        DATE(created_at) as date,
        COUNT(DISTINCT company_id) as active_users,
        COUNT(*) as sessions,
        COUNT(*) as quotes_created
      FROM quotes 
      WHERE created_at >= date('now', '-7 days')
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);
    
    const rawDailyActivity = dailyActivityQuery.all() as any[];
    
    // Fill in missing days with zero data
    const userActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dateStr = date.toISOString().split('T')[0];
      const dayData = rawDailyActivity.find(d => d.date === dateStr);
      
      userActivity.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        activeUsers: dayData?.active_users || 0,
        newUsers: 0, // Would need separate tracking
        sessions: dayData?.sessions || 0,
        quotesCreated: dayData?.quotes_created || 0
      });
    }

    // Top pages (simulated)
    const topPages = [
      { page: '/dashboard', views: featureUsage.dashboard, avgTime: 180 },
      { page: '/create-quote', views: featureUsage.quoteCreation, avgTime: 420 },
      { page: '/settings', views: featureUsage.settings, avgTime: 120 },
      { page: '/insights', views: featureUsage.insights, avgTime: 90 }
    ];

    // User engagement levels (based on quote activity)
    const engagementQuery = db.prepare(`
      SELECT 
        company_id,
        COUNT(*) as quote_count
      FROM quotes 
      WHERE created_at >= date('now', '-30 days')
      GROUP BY company_id
    `);
    
    const userQuoteCounts = engagementQuery.all() as any[];
    
    const userEngagement = {
      highlyActive: userQuoteCounts.filter(u => u.quote_count >= 5).length,
      moderatelyActive: userQuoteCounts.filter(u => u.quote_count >= 2 && u.quote_count < 5).length,
      lowActivity: userQuoteCounts.filter(u => u.quote_count === 1).length,
      inactive: Math.max(0, userStats.total_users - userQuoteCounts.length)
    };

    const metrics = {
      totalUsers: userStats.total_users || 0,
      activeUsers: userStats.active_users || 0,
      newUsers: newUsers.new_users || 0,
      avgSessionDuration,
      totalSessions: activity.total_sessions || 0,
      quotesCreated: activity.quotes_created || 0,
      avgQuotesPerUser,
      featureUsage,
      deviceBreakdown,
      browserBreakdown,
      userActivity,
      topPages,
      userEngagement
    };

    db.close();

    return NextResponse.json(metrics);

  } catch (error) {
    console.error('Error in usage analytics API:', error);
    return NextResponse.json(
      { error: 'Failed to load usage analytics' },
      { status: 500 }
    );
  }
}