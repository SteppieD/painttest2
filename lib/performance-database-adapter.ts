// Mock performance database adapter for Supabase-only deployment
// This provides compatibility for existing code while using Supabase

export class PerformanceDatabaseAdapter {
  constructor() {
    console.log('Performance adapter initialized for Supabase deployment');
  }

  async getCompanyDashboard(companyId: number) {
    // Mock implementation - would need real Supabase queries
    return {
      company: {
        id: companyId,
        company_name: 'Demo Company',
        access_code: 'DEMO2024',
        email: 'demo@company.com',
        phone: '(555) 123-4567',
        is_trial: true,
        quote_limit: 1,
        default_walls_rate: 3.00,
        default_ceilings_rate: 2.00,
        default_trim_rate: 5.00,
        default_walls_paint_cost: 50.00,
        default_ceilings_paint_cost: 45.00,
        default_trim_paint_cost: 55.00,
        default_labor_percentage: 60,
        default_paint_coverage: 350,
        default_sundries_percentage: 15,
        tax_rate: 0.08,
        tax_on_materials_only: true,
        tax_label: 'Sales Tax'
      },
      quotes: [],
      totalRevenue: 0,
      quoteCount: 0
    };
  }

  async getDashboardData(companyId: number) {
    // Mock implementation - alias for getCompanyDashboard
    return this.getCompanyDashboard(companyId);
  }

  async getQuotesByCompany(companyId: number) {
    // Mock implementation
    return [];
  }

  async getCompanyByAccessCode(accessCode: string) {
    // Mock implementation
    return {
      id: 1,
      access_code: accessCode,
      company_name: 'Demo Company',
      email: 'demo@company.com'
    };
  }

  async createQuote(quoteData: any) {
    // Mock implementation
    console.log('Mock quote creation:', quoteData);
    return { id: 1, quote_id: 'QUOTE-' + Date.now() };
  }

  async updateQuote(quoteId: string, updateData: any) {
    // Mock implementation
    console.log('Mock quote update:', quoteId, updateData);
    return { changes: 1 };
  }

  async getQuotesWithDetails(companyId: number, options: { limit: number; offset: number; status?: string; search?: string }) {
    // Mock implementation
    return {
      quotes: [],
      total: 0,
      page: 1,
      pages: 1
    };
  }

  async getCustomersWithMetrics(companyId: number, options: { limit: number }) {
    // Mock implementation
    return [];
  }

  async getCompanyAnalytics(companyId: number, dateRange: { startDate: string; endDate: string }) {
    // Mock implementation
    return [];
  }

  async getPerformanceMetrics() {
    // Mock implementation
    return {
      queryTime: 0,
      connectionCount: 0,
      totalQueries: 0,
      cacheSize: 0,
      avgQueryTime: 50,
      recentSlowQueries: [],
      queryCount: 0
    };
  }

  optimize() {
    // Mock implementation
    console.log('Performance optimization completed');
  }

  clearCache() {
    // Mock implementation
    console.log('Cache cleared');
  }

  async batchCreateQuotes(quotes: any[]) {
    // Mock implementation
    console.log('Batch create quotes:', quotes.length);
    return quotes.map((quote, index) => ({
      id: index + 1,
      quote_id: 'QUOTE-' + Date.now() + '-' + index,
      success: true
    }));
  }

  async batchUpdateQuoteStatuses(updates: any[]) {
    // Mock implementation
    console.log('Batch update quote statuses:', updates.length);
    return updates.map(update => ({
      id: update.id,
      success: true
    }));
  }
}

// Export default instance
export const performanceDb = new PerformanceDatabaseAdapter();
export default performanceDb;