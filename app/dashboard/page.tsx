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
      const setupCompleted = preferencesData.preferences?.setup_completed === true || preferencesData.preferences?.setup_completed === 1;
      
      // Check if they have any paint products
      const productsResponse = await fetch(`/api/paint-products?companyId=${companyId}`);
      const productsData = await productsResponse.json();
      const hasProducts = (productsData.products || []).length > 0;
      
      console.log('Setup status check:', { setupCompleted, hasProducts, preferences: preferencesData.preferences });
      
      // Show onboarding only if setup is not completed AND no products exist
      // Hide it if either setup is completed OR products exist
      setNeedsOnboarding(!setupCompleted && !hasProducts);
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      // Don't block access on error, but don't suggest setup
      setNeedsOnboarding(false);
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
    <div className="min-h-screen bg-gray-50" style={{ background: '#f0f0f3' }}>
      {/* Header */}
      <div className="neomorphism-nav-enhanced">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="neomorphism-accessible-subtle p-3 rounded-2xl">
                <Palette className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 neomorphism-text">ProPaint Quote Assistant</h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">{companyInfo?.company_name}</p>
                  {companyInfo?.access_code && (
                    <>
                      <span className="text-sm text-gray-400">•</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500">Code: {companyInfo.access_code}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(companyInfo.access_code);
                            alert('Access code copied to clipboard!');
                          }}
                          className="neomorphism-button-enhanced h-6 w-6 p-0 rounded-lg flex items-center justify-center"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/create-quote")}
                className="neomorphism-button-primary-enhanced flex items-center"
              >
                <Calculator className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">New Quote</span>
                <span className="sm:hidden">Quote</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="neomorphism-button-enhanced flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Setup Completion Prompt - Neumorphism Design */}
        {!isCheckingOnboarding && needsOnboarding && (
          <div className="mb-8">
            <div className="neomorphism-modal-enhanced animate-neomorphism-scale-in">
              <div className="text-center">
                <div className="neomorphism-accessible w-20 h-20 flex items-center justify-center mx-auto mb-5">
                  <Palette className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3 neomorphism-text">
                  Complete Your Setup
                </h2>
                <p className="text-lg text-gray-700 mb-6 max-w-md mx-auto">
                  Set up your favorite paint products and pricing to create quotes quickly. 
                  This takes just 2 minutes and you'll be ready to start quoting!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => router.push("/setup")}
                    className="neomorphism-button-primary-enhanced px-8"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Complete Setup
                  </button>
                  <button 
                    onClick={() => setNeedsOnboarding(false)}
                    className="neomorphism-button-enhanced"
                  >
                    Skip for Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Settings Access - Neumorphism Design */}
        {!isCheckingOnboarding && !needsOnboarding && (
          <div className="mb-6">
            <div className="neomorphism-card-accessible animate-neomorphism-fade-in">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="neomorphism-accessible-subtle w-12 h-12 flex items-center justify-center">
                    <Palette className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">Customize Your Products & Pricing</h3>
                    <p className="text-base text-gray-700">Set up paint products and costs for accurate quotes</p>
                  </div>
                </div>
                <button 
                  onClick={() => router.push("/settings/products")}
                  className="neomorphism-button-enhanced flex items-center gap-2"
                >
                  Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Primary Action - Create Quote - Neumorphism Design */}
        <div className="mb-8">
          <div 
            className="neomorphism-interactive neomorphism-green p-8 cursor-pointer animate-neomorphism-scale-in" 
            onClick={() => router.push("/create-quote")}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="neomorphism-strong w-24 h-24 flex items-center justify-center">
                  <Calculator className="w-12 h-12 text-green-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-green-800 mb-2 neomorphism-text">Create Professional Quote</h3>
                  <p className="text-lg font-medium text-gray-700">Room-by-room measurements • Industry pricing • Customer-ready output</p>
                </div>
              </div>
              <div className="text-green-700">
                <ArrowRight className="w-8 h-8" />
              </div>
            </div>
          </div>
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

        {/* Business Metrics - Enhanced Neumorphism Design */}
        <div className="mb-8">
          <div className="neomorphism-card-accessible animate-neomorphism-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 neomorphism-text">Business Performance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Quotes Card */}
              <div className="neomorphism-metric-card text-center">
                <div className="neomorphism-accessible-subtle w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2 neomorphism-text">{analytics.totalQuotes}</div>
                <div className="text-base font-semibold text-gray-700 mb-2">Total Quotes</div>
                <div className="neomorphism-badge-enhanced">
                  {analytics.acceptedQuotes} won ({analytics.totalQuotes > 0 ? Math.round((analytics.acceptedQuotes / analytics.totalQuotes) * 100) : 0}%)
                </div>
              </div>

              {/* Revenue Card */}
              <div className="neomorphism-metric-card text-center">
                <div className="neomorphism-accessible-subtle w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-700 mb-2 neomorphism-text">{formatCurrency(analytics.totalRevenue)}</div>
                <div className="text-base font-semibold text-gray-700 mb-2">Revenue Generated</div>
                <div className="text-sm font-medium text-gray-600">All time</div>
              </div>

              {/* Average Quote Card */}
              <div className="neomorphism-metric-card text-center">
                <div className="neomorphism-accessible-subtle w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-700 mb-2 neomorphism-text">{formatCurrency(analytics.averageQuote)}</div>
                <div className="text-base font-semibold text-gray-700 mb-2">Average Job Value</div>
                <div className="text-sm font-medium text-gray-600">Per quote</div>
              </div>

              {/* Pending Quotes Card */}
              <div className="neomorphism-metric-card text-center">
                <div className="neomorphism-accessible-subtle w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-orange-700 mb-2 neomorphism-text">{analytics.pendingQuotes}</div>
                <div className="text-base font-semibold text-gray-700 mb-2">Awaiting Response</div>
                <div className="text-sm font-medium text-gray-600">Follow up needed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Navigation - Enhanced Neumorphism Design */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => router.push("/quotes")}
              className="neomorphism-button-enhanced flex items-center justify-center gap-3 py-4 animate-neomorphism-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">View All Quotes</span>
            </button>
            <button
              onClick={() => router.push("/insights")}
              className="neomorphism-button-enhanced flex items-center justify-center gap-3 py-4 animate-neomorphism-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="font-semibold">Analytics</span>
            </button>
            <button
              onClick={() => router.push("/settings")}
              className="neomorphism-button-enhanced flex items-center justify-center gap-3 py-4 animate-neomorphism-slide-up"
              style={{ animationDelay: '0.3s' }}
            >
              <MessageSquare className="w-5 h-5 text-orange-600" />
              <span className="font-semibold">Settings</span>
            </button>
          </div>
        </div>

        {/* Quotes List - Enhanced Neumorphism Design */}
        <div className="neomorphism-card-accessible animate-neomorphism-slide-up">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Recent Quotes ({filteredQuotes.length})</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    placeholder="Search quotes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="neomorphism-input-enhanced pl-10 w-full sm:w-48"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="neomorphism-input-enhanced"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            {filteredQuotes.length === 0 ? (
              <div className="text-center py-8">
                <div className="neomorphism-accessible-subtle w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">
                  {quotes.length === 0 ? "No quotes yet" : "No quotes match your filters"}
                </p>
                {quotes.length === 0 && (
                  <button 
                    onClick={() => router.push("/create-quote")} 
                    className="neomorphism-button-primary-enhanced"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Create Your First Professional Quote
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuotes.map((quote) => (
                  <div key={quote.id} className="neomorphism-accessible-subtle p-4 hover:neomorphism-accessible transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="font-semibold text-lg sm:text-base">{quote.customer_name}</h3>
                          <span className={`neomorphism-badge-enhanced text-xs ${
                            quote.status === 'accepted' ? 'text-green-700' :
                            quote.status === 'completed' ? 'text-blue-700' :
                            quote.status === 'cancelled' ? 'text-red-700' :
                            'text-yellow-700'
                          }`}>
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
                            className="neomorphism-input-enhanced text-sm"
                          >
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          
                          <div className="flex gap-2">
                            <button
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
                              className="neomorphism-button-enhanced px-3 py-2"
                            >
                              <Copy className="w-4 h-4" />
                              <span className="sm:hidden ml-2">Copy Link</span>
                            </button>
                            <button
                              onClick={() => router.push(`/quotes/${quote.id}`)}
                              title="View quote details"
                              className="neomorphism-button-enhanced px-3 py-2"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="sm:hidden ml-2">View</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}