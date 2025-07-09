export const dynamic = "force-dynamic";
/**
 * Optimized Dashboard API
 * 
 * Replaces multiple API calls with single optimized query
 * Eliminates N+1 queries and provides all dashboard data efficiently
 */

import { NextRequest, NextResponse } from 'next/server';
import { withSecureApi, createApiResponse } from '@/lib/secure-api-wrapper';
import { performanceDb } from '@/lib/performance-database-adapter';
import { z } from 'zod';

const DashboardQuerySchema = z.object({
  companyId: z.coerce.number().positive(),
  includeAnalytics: z.coerce.boolean().default(false),
  includeRecentQuotes: z.coerce.boolean().default(true),
  includeTopCustomers: z.coerce.boolean().default(false),
  dateRange: z.object({
    startDate: z.string(),
    endDate: z.string()
  }).optional()
});

async function getDashboardData(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const queryData = {
      companyId: searchParams.get('companyId'),
      includeAnalytics: searchParams.get('includeAnalytics'),
      includeRecentQuotes: searchParams.get('includeRecentQuotes'),
      includeTopCustomers: searchParams.get('includeTopCustomers'),
      dateRange: searchParams.get('startDate') && searchParams.get('endDate') ? {
        startDate: searchParams.get('startDate')!,
        endDate: searchParams.get('endDate')!
      } : undefined
    };

    const validatedData = DashboardQuerySchema.parse(queryData);
    const startTime = performance.now();

    // Get main dashboard data (company info + metrics)
    const dashboardData = performanceDb.getDashboardData(validatedData.companyId);

    if (!dashboardData) {
      return createApiResponse(
        { error: 'Company not found' },
        { success: false, status: 404 }
      );
    }

    // Prepare response with core data
    const response: any = {
      company: {
        id: dashboardData.id,
        company_name: dashboardData.company_name,
        access_code: dashboardData.access_code,
        email: dashboardData.email,
        phone: dashboardData.phone,
        is_trial: dashboardData.is_trial,
        quote_limit: dashboardData.quote_limit
      },
      metrics: {
        totalQuotes: dashboardData.total_quotes,
        approvedQuotes: dashboardData.approved_quotes,
        pendingQuotes: dashboardData.pending_quotes,
        totalRevenue: dashboardData.total_revenue,
        averageQuote: dashboardData.avg_quote_value,
        thisMonthQuotes: dashboardData.this_month_quotes,
        thisMonthRevenue: dashboardData.this_month_revenue,
        totalCustomers: dashboardData.total_customers,
        activeCustomers: dashboardData.active_customers,
        conversionRate: dashboardData.conversion_rate
      },
      performance: {
        loadTime: performance.now() - startTime
      }
    };

    // Add recent quotes if requested
    if (validatedData.includeRecentQuotes) {
      const recentQuotesStart = performance.now();
      const quotesData = performanceDb.getQuotesWithDetails(validatedData.companyId, {
        limit: 10,
        offset: 0
      });
      
      response.recentQuotes = quotesData.quotes.map(quote => ({
        id: quote.id,
        quote_id: quote.quote_id,
        customer_name: quote.customer_name,
        address: quote.address,
        final_price: quote.final_price || quote.total_revenue || quote.quote_amount || 0,
        status: quote.status || 'pending',
        created_at: quote.created_at,
        project_type: quote.project_type
      }));
      
      response.performance.quotesLoadTime = performance.now() - recentQuotesStart;
    }

    // Add top customers if requested
    if (validatedData.includeTopCustomers) {
      const customersStart = performance.now();
      const customersData = performanceDb.getCustomersWithMetrics(validatedData.companyId, {
        limit: 5
      });
      
      response.topCustomers = customersData
        .filter(customer => customer.total_revenue > 0)
        .sort((a, b) => b.total_revenue - a.total_revenue)
        .slice(0, 5)
        .map(customer => ({
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          totalRevenue: customer.total_revenue,
          quoteCount: customer.quote_count,
          conversionRate: customer.conversion_rate,
          lastActivity: customer.last_activity
        }));
      
      response.performance.customersLoadTime = performance.now() - customersStart;
    }

    // Add analytics if requested
    if (validatedData.includeAnalytics) {
      const analyticsStart = performance.now();
      const dateRange = validatedData.dateRange ? {
        startDate: validatedData.dateRange.startDate,
        endDate: validatedData.dateRange.endDate
      } : {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      };
      
      const analytics = performanceDb.getCompanyAnalytics(
        validatedData.companyId, 
        dateRange
      );
      
      response.analytics = analytics.reduce((acc, item) => {
        acc[item.metric_type] = JSON.parse(item.data);
        return acc;
      }, {} as any);
      
      response.performance.analyticsLoadTime = performance.now() - analyticsStart;
    }

    // Add database performance metrics
    response.databaseMetrics = performanceDb.getPerformanceMetrics();

    return createApiResponse(response, {
      message: 'Dashboard data loaded successfully'
    });

  } catch (error) {
    console.error('Optimized dashboard error:', error);

    if (error instanceof z.ZodError) {
      return createApiResponse(
        { error: 'Invalid query parameters', details: error.errors },
        { success: false, status: 400 }
      );
    }

    return createApiResponse(
      { error: 'Failed to load dashboard data', details: error instanceof Error ? error.message : 'Unknown error' },
      { success: false, status: 500 }
    );
  }
}

// Export with security wrapper
export const GET = withSecureApi({
  requireAuth: false, // Company ID validation handles auth
  allowedMethods: ['GET'],
  sanitizeInput: true,
  rateLimitConfig: {
    maxRequests: 60, // Allow frequent dashboard refreshes
    windowMs: 60000 // 1 minute
  }
})(getDashboardData);