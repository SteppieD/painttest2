/**
 * Performance Monitoring and Optimization
 * 
 * Monitors app performance and provides optimization utilities
 */

import React from 'react';

export interface PerformanceMetrics {
  pageLoadTime: number;
  timeToFirstByte: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  memoryUsage?: number;
  connectionType?: string;
}

export interface DatabasePerformanceMetrics {
  queryCount: number;
  totalQueryTime: number;
  averageQueryTime: number;
  slowQueries: Array<{
    query: string;
    duration: number;
    timestamp: number;
  }>;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Partial<PerformanceMetrics> = {};
  private dbMetrics: DatabasePerformanceMetrics = {
    queryCount: 0,
    totalQueryTime: 0,
    averageQueryTime: 0,
    slowQueries: []
  };

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Initialize performance monitoring
   */
  init(): void {
    if (typeof window === 'undefined') return;

    // Monitor page load metrics
    this.measurePageLoad();
    
    // Monitor Web Vitals
    this.measureWebVitals();
    
    // Monitor memory usage
    this.measureMemoryUsage();
    
    // Monitor network information
    this.measureNetworkInfo();

    // Report metrics periodically
    setInterval(() => {
      this.reportMetrics();
    }, 30000); // Every 30 seconds
  }

  /**
   * Measure page load performance
   */
  private measurePageLoad(): void {
    if (!window.performance || !window.performance.timing) return;

    const timing = window.performance.timing;
    
    this.metrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    this.metrics.timeToFirstByte = timing.responseStart - timing.navigationStart;
    this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
  }

  /**
   * Measure Web Vitals
   */
  private measureWebVitals(): void {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.firstContentfulPaint = entry.startTime;
        }
      }
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.largestContentfulPaint = lastEntry.startTime;
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.metrics.cumulativeLayoutShift = clsValue;
    }).observe({ entryTypes: ['layout-shift'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
      }
    }).observe({ entryTypes: ['first-input'] });
  }

  /**
   * Measure memory usage
   */
  private measureMemoryUsage(): void {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      this.metrics.memoryUsage = memInfo.usedJSHeapSize / 1024 / 1024; // MB
    }
  }

  /**
   * Measure network information
   */
  private measureNetworkInfo(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.metrics.connectionType = connection.effectiveType;
    }
  }

  /**
   * Track database query performance
   */
  trackDatabaseQuery(query: string, duration: number): void {
    this.dbMetrics.queryCount++;
    this.dbMetrics.totalQueryTime += duration;
    this.dbMetrics.averageQueryTime = this.dbMetrics.totalQueryTime / this.dbMetrics.queryCount;

    // Track slow queries (>100ms)
    if (duration > 100) {
      this.dbMetrics.slowQueries.push({
        query: query.substring(0, 100), // Truncate for storage
        duration,
        timestamp: Date.now()
      });

      // Keep only last 10 slow queries
      if (this.dbMetrics.slowQueries.length > 10) {
        this.dbMetrics.slowQueries.shift();
      }
    }
  }

  /**
   * Get current metrics
   */
  getMetrics(): {
    performance: Partial<PerformanceMetrics>;
    database: DatabasePerformanceMetrics;
  } {
    return {
      performance: { ...this.metrics },
      database: { ...this.dbMetrics }
    };
  }

  /**
   * Report metrics to monitoring service
   */
  private reportMetrics(): void {
    const metrics = this.getMetrics();
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metrics:', metrics);
    }

    // Send to monitoring service in production
    // This would integrate with your monitoring solution
  }

  /**
   * Check if performance is good
   */
  isPerformanceGood(): boolean {
    const { firstContentfulPaint, largestContentfulPaint, cumulativeLayoutShift, firstInputDelay } = this.metrics;

    return (
      (!firstContentfulPaint || firstContentfulPaint < 1800) &&
      (!largestContentfulPaint || largestContentfulPaint < 2500) &&
      (!cumulativeLayoutShift || cumulativeLayoutShift < 0.1) &&
      (!firstInputDelay || firstInputDelay < 100)
    );
  }
}

/**
 * Database query optimization wrapper
 */
export class OptimizedDatabase {
  private db: any;
  private queryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private performanceMonitor: PerformanceMonitor;

  constructor(databaseAdapter: any) {
    this.db = databaseAdapter;
    this.performanceMonitor = PerformanceMonitor.getInstance();
  }

  /**
   * Execute query with performance tracking and caching
   */
  async query(
    sql: string, 
    params: any[] = [],
    options: {
      cache?: boolean;
      cacheTTL?: number; // seconds
      timeout?: number;
    } = {}
  ): Promise<any> {
    const { cache = false, cacheTTL = 300, timeout = 5000 } = options;
    const cacheKey = `${sql}:${JSON.stringify(params)}`;
    
    // Check cache first
    if (cache) {
      const cached = this.queryCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cached.ttl * 1000) {
        return cached.data;
      }
    }

    const startTime = Date.now();
    
    try {
      // Add timeout wrapper
      const queryPromise = this.db.all ? this.db.all(sql, params) : this.db.query(sql, params);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout')), timeout);
      });

      const result = await Promise.race([queryPromise, timeoutPromise]);
      const duration = Date.now() - startTime;

      // Track performance
      this.performanceMonitor.trackDatabaseQuery(sql, duration);

      // Cache result if requested
      if (cache) {
        this.queryCache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
          ttl: cacheTTL
        });
      }

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      this.performanceMonitor.trackDatabaseQuery(`ERROR: ${sql}`, duration);
      throw error;
    }
  }

  /**
   * Batch queries to reduce N+1 problems
   */
  async batchQueries<T>(
    queries: Array<{
      sql: string;
      params: any[];
      key: string;
    }>
  ): Promise<Record<string, T>> {
    const startTime = Date.now();
    const results: Record<string, T> = {};

    try {
      // Execute all queries in parallel
      const promises = queries.map(async ({ sql, params, key }) => {
        const result = await this.query(sql, params);
        return { key, result };
      });

      const batchResults = await Promise.all(promises);
      
      for (const { key, result } of batchResults) {
        results[key] = result;
      }

      const duration = Date.now() - startTime;
      this.performanceMonitor.trackDatabaseQuery(`BATCH(${queries.length})`, duration);

      return results;

    } catch (error) {
      const duration = Date.now() - startTime;
      this.performanceMonitor.trackDatabaseQuery(`BATCH_ERROR(${queries.length})`, duration);
      throw error;
    }
  }

  /**
   * Get quotes with optimized joins to prevent N+1
   */
  async getQuotesWithCustomers(companyId: number, options: {
    limit?: number;
    offset?: number;
    includeCustomerStats?: boolean;
  } = {}): Promise<any[]> {
    const { limit = 20, offset = 0, includeCustomerStats = false } = options;

    // Single optimized query instead of N+1
    const sql = `
      SELECT 
        q.*,
        c.name as customer_name_resolved,
        c.email as customer_email_resolved,
        c.phone as customer_phone_resolved,
        c.status as customer_status,
        c.total_quotes as customer_total_quotes,
        c.total_revenue as customer_total_revenue
      FROM quotes q
      LEFT JOIN customers c ON q.customer_id = c.id
      WHERE q.company_id = ?
      ORDER BY q.created_at DESC
      LIMIT ? OFFSET ?
    `;

    return this.query(sql, [companyId, limit, offset], {
      cache: true,
      cacheTTL: 60 // 1 minute cache for frequently accessed data
    });
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.queryCache.entries()) {
      if (now - entry.timestamp > entry.ttl * 1000) {
        this.queryCache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    hitRate: number;
    memoryUsage: number;
  } {
    const size = this.queryCache.size;
    // This would need hit/miss tracking for accurate hit rate
    const hitRate = 0; // Placeholder
    const memoryUsage = JSON.stringify([...this.queryCache.entries()]).length;

    return { size, hitRate, memoryUsage };
  }
}

/**
 * React hook for performance monitoring
 */
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();

  React.useEffect(() => {
    monitor.init();
  }, []);

  return {
    getMetrics: () => monitor.getMetrics(),
    isPerformanceGood: () => monitor.isPerformanceGood()
  };
}

/**
 * Lazy loading utility
 */
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  return React.lazy(async () => {
    const start = Date.now();
    try {
      const importedModule = await importFn();
      const loadTime = Date.now() - start;
      
      console.log(`Component loaded in ${loadTime}ms`);
      
      return importedModule;
    } catch (error) {
      console.error('Failed to load component:', error);
      throw error;
    }
  });
}

/**
 * Image optimization utility
 */
export class ImageOptimizer {
  static async optimizeImage(
    file: File,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
      format?: 'webp' | 'jpeg' | 'png';
    } = {}
  ): Promise<Blob> {
    const { maxWidth = 1920, maxHeight = 1080, quality = 0.8, format = 'webp' } = options;

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Set canvas size
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to optimize image'));
            }
          },
          `image/${format}`,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  PerformanceMonitor.getInstance().init();
}