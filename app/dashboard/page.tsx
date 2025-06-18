"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Palette, 
  Plus, 
  MessageSquare, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Search,
  LogOut,
  Eye,
  Copy,
  Calculator,
  ArrowRight
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Quote {
  id: number;
  quote_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  quote_amount: number;
  final_price?: number;
  notes: string;
  status?: string;
  created_at: string;
  company_id: number;
  company_name?: string;
  project_type?: string;
  time_estimate?: string;
}

interface Analytics {
  totalQuotes: number;
  totalRevenue: number;
  averageQuote: number;
  pendingQuotes: number;
  acceptedQuotes: number;
  thisMonthQuotes: number;
  thisMonthRevenue: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalQuotes: 0,
    totalRevenue: 0,
    averageQuote: 0,
    pendingQuotes: 0,
    acceptedQuotes: 0,
    thisMonthQuotes: 0,
    thisMonthRevenue: 0,
  });
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [quotaInfo, setQuotaInfo] = useState<{isTrial: boolean, quotesUsed: number, quotesAllowed: number | null}>({
    isTrial: false, 
    quotesUsed: 0, 
    quotesAllowed: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    const companyData = localStorage.getItem("paintquote_company");
    if (companyData) {
      try {
        const company = JSON.parse(companyData);
        // Check if session is still valid (24 hours)
        if (Date.now() - company.loginTime > 24 * 60 * 60 * 1000) {
          localStorage.removeItem("paintquote_company");
          router.push("/access-code");
          return;
        }
        setCompanyInfo(company);
        loadQuotes(company.id);
        loadQuotaInfo(company.id);
        checkOnboardingStatus(company.id);
      } catch (e) {
        router.push("/access-code");
      }
    } else {
      router.push("/access-code");
    }
  }, [router]);

  const loadQuotes = async (companyId: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/quotes?company_id=${companyId}`);
      const data = await response.json();

      if (data.quotes && Array.isArray(data.quotes)) {
        setQuotes(data.quotes);
        calculateAnalytics(data.quotes);
      } else if (Array.isArray(data)) {
        // Fallback for direct array response
        setQuotes(data);
        calculateAnalytics(data);
      }
    } catch (error) {
      console.error("Error loading quotes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAnalytics = (quotesData: Quote[]) => {
    const total = quotesData.length;
    const revenue = quotesData.reduce((sum, quote) => {
      // Try multiple possible fields for quote amount
      const amount = quote.quote_amount || quote.final_price || (quote as any).total_revenue || 0;
      return sum + amount;
    }, 0);
    const average = total > 0 ? revenue / total : 0;

    const pending = quotesData.filter(q => !q.status || q.status === "pending").length;
    const accepted = quotesData.filter(q => q.status === "accepted").length;

    // This month calculations
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthQuotes = quotesData.filter(quote => {
      const quoteDate = new Date(quote.created_at);
      return quoteDate >= thisMonthStart;
    });

    const thisMonthRevenue = thisMonthQuotes.reduce((sum, quote) => {
      const amount = quote.quote_amount || quote.final_price || (quote as any).total_revenue || 0;
      return sum + amount;
    }, 0);

    setAnalytics({
      totalQuotes: total,
      totalRevenue: revenue,
      averageQuote: average,
      pendingQuotes: pending,
      acceptedQuotes: accepted,
      thisMonthQuotes: thisMonthQuotes.length,
      thisMonthRevenue: thisMonthRevenue,
    });
  };

  const loadQuotaInfo = async (companyId: number) => {
    try {
      const response = await fetch(`/api/company-quota?company_id=${companyId}`);
      const data = await response.json();
      
      if (data.success) {
        setQuotaInfo({
          isTrial: data.is_trial,
          quotesUsed: data.quotes_used,
          quotesAllowed: data.quote_limit
        });
      }
    } catch (error) {
      console.error("Error loading quota info:", error);
    }
  };

  const checkOnboardingStatus = async (companyId: number) => {
    try {
      setIsCheckingOnboarding(true);
      
      // Check if company has completed setup
      const preferencesResponse = await fetch(`/api/companies/preferences?companyId=${companyId}`);
      const preferencesData = await preferencesResponse.json();
      const setupCompleted = preferencesData.preferences?.setup_completed;
      
      // Check if they have any paint products
      const productsResponse = await fetch(`/api/paint-products?companyId=${companyId}`);
      const productsData = await productsResponse.json();
      const hasProducts = (productsData.products || []).length > 0;
      
      // Need onboarding if setup is not completed or no products
      setNeedsOnboarding(!setupCompleted || !hasProducts);
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      // Don't block access on error, but suggest setup
      setNeedsOnboarding(true);
    } finally {
      setIsCheckingOnboarding(false);
    }
  };

  // Filter quotes
  useEffect(() => {
    let filtered = quotes.filter((quote) => {
      const matchesSearch =
        quote.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (quote.quote_id && String(quote.quote_id).toLowerCase().includes(searchTerm.toLowerCase())) ||
        quote.quote_amount.toString().includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pending" && (!quote.status || quote.status === "pending")) ||
        (statusFilter !== "pending" && quote.status === statusFilter);

      return matchesSearch && matchesStatus;
    });

    // Sort by most recent first
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setFilteredQuotes(filtered);
  }, [quotes, searchTerm, statusFilter]);

  const updateQuoteStatus = async (quoteId: number, newStatus: string) => {
    try {
      const response = await fetch("/api/quotes/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId, status: newStatus }),
      });

      if (response.ok) {
        setQuotes(prev =>
          prev.map(quote =>
            quote.id === quoteId ? { ...quote, status: newStatus } : quote
          )
        );
      }
    } catch (error) {
      console.error("Error updating quote status:", error);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "accepted": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("paintquote_company");
    router.push("/access-code");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Palette className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">ProPaint Quote Assistant</h1>
                <p className="text-sm text-gray-500">{companyInfo?.company_name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/create-quote")}
                className="bg-green-600 hover:bg-green-700"
              >
                <Calculator className="w-4 h-4 mr-2" />
                New Quote
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Setup Completion Prompt */}
        {!isCheckingOnboarding && needsOnboarding && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Complete Your Setup
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Set up your favorite paint products and pricing to create quotes quickly. 
                  This takes just 2 minutes and you'll be ready to start quoting!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={() => router.push("/setup")}
                    className="bg-blue-600 hover:bg-blue-700 px-8"
                    size="lg"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Complete Setup
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setNeedsOnboarding(false)}
                    size="lg"
                  >
                    Skip for Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Settings Access - Optional */}
        {!isCheckingOnboarding && !needsOnboarding && (
          <div className="mb-6">
            <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border border-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Palette className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Customize Your Products & Pricing</h3>
                      <p className="text-sm text-gray-600">Set up paint products and costs for accurate quotes</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => router.push("/settings/products")}
                    className="flex items-center gap-2"
                  >
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Primary Action - Create Quote */}
        <div className="mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-green-200 bg-green-50" onClick={() => router.push("/create-quote")}>
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
                    <Calculator className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-900">Create Professional Quote</h3>
                    <p className="text-green-700">Room-by-room measurements • Industry pricing • Customer-ready output</p>
                  </div>
                </div>
                <div className="text-green-600">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trial Quota Warning */}
        {quotaInfo.isTrial && quotaInfo.quotesAllowed && (
          <div className="mb-6">
            <Card className={`border-2 ${
              quotaInfo.quotesUsed >= quotaInfo.quotesAllowed 
                ? 'border-red-200 bg-red-50' 
                : quotaInfo.quotesUsed >= quotaInfo.quotesAllowed * 0.8 
                ? 'border-yellow-200 bg-yellow-50' 
                : 'border-blue-200 bg-blue-50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      quotaInfo.quotesUsed >= quotaInfo.quotesAllowed 
                        ? 'bg-red-100' 
                        : quotaInfo.quotesUsed >= quotaInfo.quotesAllowed * 0.8 
                        ? 'bg-yellow-100' 
                        : 'bg-blue-100'
                    }`}>
                      <FileText className={`w-5 h-5 ${
                        quotaInfo.quotesUsed >= quotaInfo.quotesAllowed 
                          ? 'text-red-600' 
                          : quotaInfo.quotesUsed >= quotaInfo.quotesAllowed * 0.8 
                          ? 'text-yellow-600' 
                          : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Trial Account - {quotaInfo.quotesUsed} of {quotaInfo.quotesAllowed} quotes used
                      </h3>
                      <p className="text-sm text-gray-600">
                        {quotaInfo.quotesUsed >= quotaInfo.quotesAllowed 
                          ? "Quote limit reached. Upgrade to create more quotes."
                          : `${quotaInfo.quotesAllowed - quotaInfo.quotesUsed} quotes remaining in your trial.`
                        }
                      </p>
                    </div>
                  </div>
                  {quotaInfo.quotesUsed >= quotaInfo.quotesAllowed && (
                    <Button 
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => window.open('mailto:sales@propaintquote.com?subject=Upgrade Request', '_blank')}
                    >
                      Upgrade Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Business Metrics - Contractor Focus */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{analytics.totalQuotes}</div>
                <div className="text-sm text-gray-500">Total Quotes</div>
                <div className="text-xs text-green-600 mt-1">
                  {analytics.acceptedQuotes} won ({analytics.totalQuotes > 0 ? Math.round((analytics.acceptedQuotes / analytics.totalQuotes) * 100) : 0}%)
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(analytics.totalRevenue)}</div>
                <div className="text-sm text-gray-500">Revenue Generated</div>
                <div className="text-xs text-gray-500 mt-1">All time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(analytics.averageQuote)}</div>
                <div className="text-sm text-gray-500">Average Job Value</div>
                <div className="text-xs text-gray-500 mt-1">Per quote</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{analytics.pendingQuotes}</div>
                <div className="text-sm text-gray-500">Awaiting Response</div>
                <div className="text-xs text-gray-500 mt-1">Follow up needed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/quotes")}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              View All Quotes
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/insights")}
              className="flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Analytics
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/settings")}
              className="flex items-center gap-2"
            >
              Settings
            </Button>
          </div>
        </div>

        {/* Quotes List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <span>Recent Quotes ({filteredQuotes.length})</span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search quotes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-48"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {filteredQuotes.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  {quotes.length === 0 ? "No quotes yet" : "No quotes match your filters"}
                </p>
                {quotes.length === 0 && (
                  <Button onClick={() => router.push("/create-quote-pro")} className="bg-green-600 hover:bg-green-700">
                    <Calculator className="w-4 h-4 mr-2" />
                    Create Your First Professional Quote
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuotes.map((quote) => (
                  <div key={quote.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="font-semibold text-lg sm:text-base">{quote.customer_name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(quote.status)}`}>
                            {quote.status || 'pending'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{quote.address}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(new Date(quote.created_at))} • {quote.time_estimate || 'Time estimate pending'}
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="text-right sm:text-left">
                          <div className="text-xl font-bold text-green-600">
                            {formatCurrency(quote.final_price || quote.quote_amount || 0)}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <select
                            value={quote.status || "pending"}
                            onChange={(e) => updateQuoteStatus(quote.id, e.target.value)}
                            className="text-xs px-2 py-2 border rounded w-full sm:w-auto"
                          >
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const customerUrl = `${window.location.origin}/quotes/${quote.quote_id}/customer`;
                                navigator.clipboard.writeText(customerUrl);
                                // Show a simple visual feedback
                                const button = event?.target as HTMLElement;
                                const originalText = button.textContent;
                                button.textContent = 'Copied!';
                                setTimeout(() => {
                                  button.textContent = originalText;
                                }, 1500);
                              }}
                              title="Copy customer quote link"
                              className="flex-1 sm:flex-none"
                            >
                              <Copy className="w-4 h-4 sm:mr-0 mr-2" />
                              <span className="sm:hidden">Copy Link</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/quotes/${quote.id}`)}
                              title="View quote details"
                              className="flex-1 sm:flex-none"
                            >
                              <Eye className="w-4 h-4 sm:mr-0 mr-2" />
                              <span className="sm:hidden">View</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}