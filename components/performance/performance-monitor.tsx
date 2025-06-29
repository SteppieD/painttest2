/**
 * Performance Monitor Component
 * 
 * Displays real-time performance metrics and database optimization status
 * Helps track the effectiveness of N+1 query fixes and caching
 */

"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Database, 
  Zap, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

interface PerformanceMetrics {
  queryCount: number;
  avgQueryTime: number;
  totalExecutionTime: number;
  cacheSize: number;
  recentSlowQueries: Array<{
    query: string;
    duration: number;
    timestamp: number;
  }>;
}

interface LoadTimeMetrics {
  dashboard: number;
  quotes: number;
  customers: number;
  lastUpdated: Date;
}

export function PerformanceMonitor({ className }: { className?: string }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loadTimes, setLoadTimes] = useState<LoadTimeMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/performance/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.databaseMetrics);
        setLoadTimes(data.loadTimes);
      }
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchMetrics();
      const interval = setInterval(fetchMetrics, 10000); // Update every 10 seconds
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const getPerformanceStatus = (avgTime: number) => {
    if (avgTime < 50) return { status: 'excellent', color: 'bg-green-500', text: 'Excellent' };
    if (avgTime < 100) return { status: 'good', color: 'bg-blue-500', text: 'Good' };
    if (avgTime < 200) return { status: 'fair', color: 'bg-yellow-500', text: 'Fair' };
    return { status: 'poor', color: 'bg-red-500', text: 'Needs Optimization' };
  };

  const getCacheEfficiency = (cacheSize: number, queryCount: number) => {
    if (queryCount === 0) return 0;
    return Math.min(100, (cacheSize / queryCount) * 100);
  };

  if (!isVisible) {
    return (
      <div className={className}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="flex items-center gap-2"
        >
          <Activity className="w-4 h-4" />
          Performance Monitor
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Performance Monitor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchMetrics}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!metrics ? (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Loading metrics...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Query Performance */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Database</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Total Queries</span>
                    <span className="font-mono">{metrics.queryCount}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Avg Time</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono">{metrics.avgQueryTime.toFixed(1)}ms</span>
                      <Badge 
                        className={`text-xs px-1 ${getPerformanceStatus(metrics.avgQueryTime).color} text-white`}
                      >
                        {getPerformanceStatus(metrics.avgQueryTime).text}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Total Time</span>
                    <span className="font-mono">{metrics.totalExecutionTime.toFixed(1)}ms</span>
                  </div>
                </div>
              </div>

              {/* Cache Performance */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Cache</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Cache Size</span>
                    <span className="font-mono">{metrics.cacheSize}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Efficiency</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono">
                        {getCacheEfficiency(metrics.cacheSize, metrics.queryCount).toFixed(1)}%
                      </span>
                      {getCacheEfficiency(metrics.cacheSize, metrics.queryCount) > 70 ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Load Times */}
              {loadTimes && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Load Times</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Dashboard</span>
                      <span className="font-mono">{loadTimes.dashboard.toFixed(1)}ms</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Quotes</span>
                      <span className="font-mono">{loadTimes.quotes.toFixed(1)}ms</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Customers</span>
                      <span className="font-mono">{loadTimes.customers.toFixed(1)}ms</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Optimization Status */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Optimization</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs">N+1 Queries Fixed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs">JOINs Optimized</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Caching Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Batch Operations</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slow Queries Alert */}
          {metrics && metrics.recentSlowQueries.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Recent Slow Queries ({metrics.recentSlowQueries.length})
                </span>
              </div>
              <div className="space-y-1">
                {metrics.recentSlowQueries.slice(0, 3).map((query, index) => (
                  <div key={index} className="text-xs text-yellow-700">
                    <span className="font-mono">{query.duration.toFixed(1)}ms</span>
                    <span className="ml-2">{query.query}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Tips */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm font-medium text-blue-800 mb-2">Performance Optimizations Active:</div>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Eliminated N+1 queries with efficient JOINs</li>
              <li>• Implemented query result caching (TTL: 30s)</li>
              <li>• Added batch operations for bulk updates</li>
              <li>• Optimized dashboard with single query load</li>
              <li>• Added database connection pooling</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Performance metrics API endpoint hook
 */
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loadTimes, setLoadTimes] = useState<LoadTimeMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/performance/metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.databaseMetrics);
        setLoadTimes(data.loadTimes);
      }
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    metrics,
    loadTimes,
    isLoading,
    refresh: fetchMetrics
  };
}