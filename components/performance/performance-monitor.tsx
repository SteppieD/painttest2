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
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
         
        >
          <Activity />
          Performance Monitor
        </Button>
      </div>
    );
  }

  return (
    <div`}>
      <Card>
        <CardHeader>
          <CardTitle>
            <Activity />
            Performance Monitor
          </CardTitle>
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchMetrics}
              disabled={isLoading}
             
            >
              <RefreshCw`} />
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
            <div>
              <div></div>
              <p>Loading metrics...</p>
            </div>
          ) : (
            <div>
              {/* Query Performance */}
              <div>
                <div>
                  <Database />
                  <span>Database</span>
                </div>
                <div>
                  <div>
                    <span>Total Queries</span>
                    <span>{metrics.queryCount}</span>
                  </div>
                  <div>
                    <span>Avg Time</span>
                    <div>
                      <span>{metrics.avgQueryTime.toFixed(1)}ms</span>
                      <Badge 
                        text-white`}
                      >
                        {getPerformanceStatus(metrics.avgQueryTime).text}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span>Total Time</span>
                    <span>{metrics.totalExecutionTime.toFixed(1)}ms</span>
                  </div>
                </div>
              </div>

              {/* Cache Performance */}
              <div>
                <div>
                  <Zap />
                  <span>Cache</span>
                </div>
                <div>
                  <div>
                    <span>Cache Size</span>
                    <span>{metrics.cacheSize}</span>
                  </div>
                  <div>
                    <span>Efficiency</span>
                    <div>
                      <span>
                        {getCacheEfficiency(metrics.cacheSize, metrics.queryCount).toFixed(1)}%
                      </span>
                      {getCacheEfficiency(metrics.cacheSize, metrics.queryCount) > 70 ? (
                        <CheckCircle />
                      ) : (
                        <AlertTriangle />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Load Times */}
              {loadTimes && (
                <div>
                  <div>
                    <Clock />
                    <span>Load Times</span>
                  </div>
                  <div>
                    <div>
                      <span>Dashboard</span>
                      <span>{loadTimes.dashboard.toFixed(1)}ms</span>
                    </div>
                    <div>
                      <span>Quotes</span>
                      <span>{loadTimes.quotes.toFixed(1)}ms</span>
                    </div>
                    <div>
                      <span>Customers</span>
                      <span>{loadTimes.customers.toFixed(1)}ms</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Optimization Status */}
              <div>
                <div>
                  <TrendingUp />
                  <span>Optimization</span>
                </div>
                <div>
                  <div>
                    <div></div>
                    <span>N+1 Queries Fixed</span>
                  </div>
                  <div>
                    <div></div>
                    <span>JOINs Optimized</span>
                  </div>
                  <div>
                    <div></div>
                    <span>Caching Active</span>
                  </div>
                  <div>
                    <div></div>
                    <span>Batch Operations</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slow Queries Alert */}
          {metrics && metrics.recentSlowQueries.length > 0 && (
            <div>
              <div>
                <AlertTriangle />
                <span>
                  Recent Slow Queries ({metrics.recentSlowQueries.length})
                </span>
              </div>
              <div>
                {metrics.recentSlowQueries.slice(0, 3).map((query, index) => (
                  <div key={index}>
                    <span>{query.duration.toFixed(1)}ms</span>
                    <span>{query.query}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Tips */}
          <div>
            <div>Performance Optimizations Active:</div>
            <ul>
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