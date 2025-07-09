/**
 * Optimized Dashboard Hook
 * 
 * Efficient data loading with caching and performance monitoring
 * Replaces multiple useEffect hooks with single optimized data fetch
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface DashboardData {
  company: {
    id: number;
    company_name: string;
    access_code: string;
    email: string;
    phone?: string;
    is_trial: boolean;
    quote_limit?: number;
  };
  metrics: {
    totalQuotes: number;
    approvedQuotes: number;
    pendingQuotes: number;
    totalRevenue: number;
    averageQuote: number;
    thisMonthQuotes: number;
    thisMonthRevenue: number;
    totalCustomers: number;
    activeCustomers: number;
    conversionRate: number;
  };
  recentQuotes?: Array<{
    id: number;
    quote_id: string;
    customer_name: string;
    address: string;
    final_price: number;
    status: string;
    created_at: string;
    project_type?: string;
  }>;
  topCustomers?: Array<{
    id: number;
    name: string;
    email?: string;
    phone?: string;
    totalRevenue: number;
    quoteCount: number;
    conversionRate: number;
    lastActivity?: string;
  }>;
  analytics?: {
    daily_trends: Array<{
      date: string;
      quotes_created: number;
      quotes_approved: number;
      daily_revenue: number;
    }>;
    project_types: Array<{
      type: string;
      count: number;
      avg_value: number;
    }>;
    status_distribution: Array<{
      status: string;
      count: number;
      percentage: number;
    }>;
  };
  performance: {
    loadTime: number;
    quotesLoadTime?: number;
    customersLoadTime?: number;
    analyticsLoadTime?: number;
  };
  databaseMetrics: {
    queryCount: number;
    avgQueryTime: number;
    cacheSize: number;
    recentSlowQueries: Array<{
      query: string;
      duration: number;
      timestamp: number;
    }>;
  };
}

interface QuotaInfo {
  isTrial: boolean;
  quotesUsed: number;
  quotesAllowed: number | null;
}

interface UseOptimizedDashboardOptions {
  companyId: number;
  includeAnalytics?: boolean;
  includeRecentQuotes?: boolean;
  includeTopCustomers?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
}

interface UseOptimizedDashboardResult {
  data: DashboardData | null;
  quotaInfo: QuotaInfo;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  performance: {
    totalLoadTime: number;
    cacheHitRate: number;
    requestCount: number;
  };
}

export function useOptimizedDashboard(
  options: UseOptimizedDashboardOptions
): UseOptimizedDashboardResult {
  const {
    companyId,
    includeAnalytics = false,
    includeRecentQuotes = true,
    includeTopCustomers = false,
    autoRefresh = false,
    refreshInterval = 30000 // 30 seconds
  } = options;

  const [data, setData] = useState<DashboardData | null>(null);
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo>({
    isTrial: false,
    quotesUsed: 0,
    quotesAllowed: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Performance tracking
  const [performance, setPerformance] = useState({
    totalLoadTime: 0,
    cacheHitRate: 0,
    requestCount: 0
  });

  const refreshTimeoutRef = useRef<NodeJS.Timeout>();
  const requestCountRef = useRef(0);
  const cacheHitsRef = useRef(0);

  const fetchDashboardData = useCallback(async () => {
    if (!companyId) return;

    const startTime = globalThis.performance.now();
    setIsLoading(true);
    setError(null);
    requestCountRef.current++;

    try {
      // Build query parameters
      const params = new URLSearchParams({
        companyId: companyId.toString(),
        includeAnalytics: includeAnalytics.toString(),
        includeRecentQuotes: includeRecentQuotes.toString(),
        includeTopCustomers: includeTopCustomers.toString()
      });

      // Fetch dashboard data from optimized endpoint
      const [dashboardResponse, quotaResponse] = await Promise.all([
        fetch(`/api/dashboard/optimized?${params.toString()}`),
        fetch(`/api/company-quota?company_id=${companyId}`)
      ]);

      if (!dashboardResponse.ok) {
        throw new Error(`Dashboard API error: ${dashboardResponse.status}`);
      }

      const dashboardResult = await dashboardResponse.json();
      
      if (!dashboardResult.success) {
        throw new Error(dashboardResult.error || 'Failed to load dashboard data');
      }

      setData(dashboardResult.data);

      // Handle quota info
      if (quotaResponse.ok) {
        const quotaResult = await quotaResponse.json();
        if (quotaResult.success) {
          setQuotaInfo({
            isTrial: quotaResult.is_trial,
            quotesUsed: quotaResult.quotes_used,
            quotesAllowed: quotaResult.quote_limit
          });
        }
      }

      // Check if this was a cache hit (very fast response)
      const totalTime = globalThis.performance.now() - startTime;
      if (totalTime < 50) { // Assume cache hit if under 50ms
        cacheHitsRef.current++;
      }

      // Update performance metrics
      setPerformance({
        totalLoadTime: totalTime,
        cacheHitRate: requestCountRef.current > 0 ? 
          (cacheHitsRef.current / requestCountRef.current) * 100 : 0,
        requestCount: requestCountRef.current
      });

      setLastUpdated(new Date());

    } catch (err) {
      console.error('Dashboard loading error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [companyId, includeAnalytics, includeRecentQuotes, includeTopCustomers]);

  const refresh = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto-refresh setup
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      refreshTimeoutRef.current = setInterval(() => {
        if (!isLoading) {
          fetchDashboardData();
        }
      }, refreshInterval);

      return () => {
        if (refreshTimeoutRef.current) {
          clearInterval(refreshTimeoutRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, isLoading, fetchDashboardData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearInterval(refreshTimeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    quotaInfo,
    isLoading,
    error,
    lastUpdated,
    refresh,
    performance
  };
}

/**
 * Optimized quotes hook for individual quote management
 */
export function useOptimizedQuotes(companyId: number, filters: {
  limit?: number;
  page?: number;
  status?: string;
  search?: string;
} = {}) {
  const { limit = 50, page = 1, status, search } = filters;
  const [quotes, setQuotes] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = useCallback(async () => {
    if (!companyId) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        company_id: companyId.toString(),
        limit: limit.toString(),
        offset: ((page - 1) * limit).toString()
      });

      if (status && status !== 'all') {
        params.append('status', status);
      }

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/quotes/optimized?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setQuotes(result.data.quotes);
        setTotal(result.data.total);
      } else {
        throw new Error(result.error || 'Failed to load quotes');
      }

    } catch (err) {
      console.error('Quotes loading error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load quotes');
    } finally {
      setIsLoading(false);
    }
  }, [companyId, limit, page, status, search]);

  const updateQuoteStatus = useCallback(async (quoteId: number, newStatus: string) => {
    try {
      const response = await fetch('/api/quotes/update-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId, status: newStatus })
      });

      if (response.ok) {
        // Update local state optimistically
        setQuotes(prev => 
          prev.map(quote => 
            quote.id === quoteId ? { ...quote, status: newStatus } : quote
          )
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating quote status:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  return {
    quotes,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    isLoading,
    error,
    refresh: fetchQuotes,
    updateQuoteStatus
  };
}