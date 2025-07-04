"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import { Footer } from "@/components/shared/footer";
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
  ArrowRight,
  Settings,
  BarChart3,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Zap,
  Award,
  Target
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { QuotaCounter } from "@/components/ui/quota-counter";
import { trackDashboardViewed, trackPageView, trackFeatureUsed } from "@/lib/analytics/tracking";

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
        // Track dashboard view
        trackDashboardViewed(companyId.toString(), data.quotes.length);
        trackPageView('/dashboard', 'Company Dashboard');
      } else if (Array.isArray(data)) {
        // Fallback for direct array response
        setQuotes(data);
        calculateAnalytics(data);
        // Track dashboard view
        trackDashboardViewed(companyId.toString(), data.length);
        trackPageView('/dashboard', 'Company Dashboard');
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-pink rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Dashboard Stats */}
      <section className="ac-hero py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <div className="ac-hero-badge inline-flex mb-4">
                <Zap size={16} />
                <span>Company Dashboard</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome back, <span style={{ color: 'var(--primary-pink)' }}>{companyInfo?.name || companyInfo?.company_name || 'Contractor'}</span>
              </h1>
              <p className="text-lg text-gray-300">
                Access Code: {companyInfo?.accessCode || companyInfo?.access_code}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(companyInfo?.accessCode || companyInfo?.access_code || '');
                    alert('Access code copied to clipboard!');
                  }}
                  className="ml-2 p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <Copy className="w-4 h-4 inline" />
                </button>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  trackFeatureUsed('create_quote_button', { from: 'dashboard' });
                  router.push("/create-quote");
                }}
                className="ac-btn ac-btn-secondary ac-btn-lg"
              >
                <Calculator size={20} />
                <span>New Quote</span>
              </button>
              <button
                onClick={handleLogout}
                className="ac-btn ac-btn-ghost ac-btn-lg text-white border-white/20 hover:bg-white/10"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-8 h-8 text-white/80" />
                <span className="text-2xl font-bold text-white">{analytics.totalQuotes}</span>
              </div>
              <p className="text-white/80 font-medium">Total Quotes</p>
              <p className="text-sm text-white/60 mt-1">
                {analytics.acceptedQuotes} won ({analytics.totalQuotes > 0 ? Math.round((analytics.acceptedQuotes / analytics.totalQuotes) * 100) : 0}%)
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-white/80" />
                <span className="text-2xl font-bold text-white">{formatCurrency(analytics.totalRevenue)}</span>
              </div>
              <p className="text-white/80 font-medium">Total Revenue</p>
              <p className="text-sm text-white/60 mt-1">All time earnings</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-white/80" />
                <span className="text-2xl font-bold text-white">{formatCurrency(analytics.averageQuote)}</span>
              </div>
              <p className="text-white/80 font-medium">Average Quote</p>
              <p className="text-sm text-white/60 mt-1">Per job value</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-white/80" />
                <span className="text-2xl font-bold text-white">{analytics.pendingQuotes}</span>
              </div>
              <p className="text-white/80 font-medium">Pending</p>
              <p className="text-sm text-white/60 mt-1">Awaiting response</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Setup Completion Prompt */}
        {!isCheckingOnboarding && needsOnboarding && (
          <div className="mb-8">
            <div className="ac-card ac-gradient-box p-8 text-center">
              <div className="w-20 h-20 bg-primary-pink rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Complete Your Setup
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Set up your favorite paint products and pricing to create quotes quickly. 
                This takes just 2 minutes and you'll be ready to start quoting!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => router.push("/setup")}
                  className="ac-btn ac-btn-primary ac-btn-lg"
                >
                  <ArrowRight size={20} />
                  Complete Setup
                </button>
                <button 
                  onClick={() => setNeedsOnboarding(false)}
                  className="ac-btn ac-btn-secondary ac-btn-lg"
                >
                  Skip for Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Settings Access */}
        {!isCheckingOnboarding && !needsOnboarding && (
          <div className="mb-6">
            <div className="ac-card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <div className="ac-card-body flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-pink/10 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-primary-pink" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">Customize Your Products & Pricing</h3>
                    <p className="text-gray-600">Set up paint products and costs for accurate quotes</p>
                  </div>
                </div>
                <button 
                  onClick={() => router.push("/settings/products")}
                  className="ac-btn ac-btn-secondary"
                >
                  <Settings size={18} />
                  Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Primary Action - Create Quote */}
        <div className="mb-8">
          <div 
            className="ac-card cursor-pointer group hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary-pink/5 to-purple-50 border-primary-pink/20" 
            onClick={() => router.push("/create-quote")}
          >
            <div className="ac-card-body p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-pink to-primary-pink-dark rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Calculator className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Professional Quote</h3>
                    <p className="text-lg text-gray-600">Room-by-room measurements • Industry pricing • Customer-ready output</p>
                  </div>
                </div>
                <div className="text-primary-pink group-hover:translate-x-2 transition-transform">
                  <ArrowRight size={32} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quota Counter */}
        {companyInfo && (
          <div className="mb-8">
            <QuotaCounter 
              companyId={companyInfo.id}
              variant="full"
              showUpgrade={true}
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => router.push("/quotes")}
              className="ac-card group hover:shadow-lg transition-all"
            >
              <div className="ac-card-body flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">View All Quotes</h3>
                  <p className="text-sm text-gray-600">Manage your quotes</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => router.push("/insights")}
              className="ac-card group hover:shadow-lg transition-all"
            >
              <div className="ac-card-body flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Analytics</h3>
                  <p className="text-sm text-gray-600">View insights</p>
                </div>
              </div>
            </button>
            <button
              onClick={() => router.push("/settings")}
              className="ac-card group hover:shadow-lg transition-all"
            >
              <div className="ac-card-body flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Settings</h3>
                  <p className="text-sm text-gray-600">Configure options</p>
                </div>
              </div>
            </button>
          </div>
        </div>


        {/* Quotes List */}
        <div className="ac-card">
          <div className="ac-card-header">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Recent Quotes ({filteredQuotes.length})</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search quotes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ac-input pl-10 w-full sm:w-48"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="ac-input"
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
          
          <div className="ac-card-body">
            {filteredQuotes.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-6">
                  {quotes.length === 0 ? "No quotes yet" : "No quotes match your filters"}
                </p>
                {quotes.length === 0 && (
                  <button onClick={() => router.push("/create-quote")} className="ac-btn ac-btn-primary ac-btn-lg">
                    <Calculator size={20} />
                    Create Your First Professional Quote
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuotes.map((quote) => (
                  <div key={quote.id} className="ac-card hover:shadow-lg transition-all">
                    <div className="ac-card-body flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{quote.customer_name}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            quote.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            quote.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {quote.status === 'accepted' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {quote.status === 'completed' && <Award className="w-3 h-3 mr-1" />}
                            {quote.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                            {(!quote.status || quote.status === 'pending') && <Clock className="w-3 h-3 mr-1" />}
                            {quote.status || 'pending'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-1">{quote.address}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(new Date(quote.created_at))} • {quote.time_estimate || 'Time estimate pending'}
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="text-right sm:text-left">
                          <div className="text-2xl font-bold text-primary-pink">
                            {formatCurrency(quote.final_price || quote.quote_amount || 0)}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <select
                            value={quote.status || "pending"}
                            onChange={(e) => updateQuoteStatus(quote.id, e.target.value)}
                            className="ac-input py-2"
                          >
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const customerUrl = `${window.location.origin}/quotes/${quote.quote_id}/customer`;
                                navigator.clipboard.writeText(customerUrl);
                                // Show a simple visual feedback
                                const button = e.currentTarget as HTMLElement;
                                const originalText = button.textContent;
                                button.textContent = 'Copied!';
                                setTimeout(() => {
                                  button.textContent = originalText;
                                }, 1500);
                              }}
                              title="Copy customer quote link"
                              className="ac-btn ac-btn-sm ac-btn-secondary"
                            >
                              <Copy className="w-4 h-4" />
                              <span className="hidden sm:inline">Copy</span>
                            </button>
                            <button
                              onClick={() => router.push(`/quotes/${quote.id}`)}
                              title="View quote details"
                              className="ac-btn ac-btn-sm ac-btn-primary"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="hidden sm:inline">View</span>
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

      <Footer />

      <style jsx>{`
        .text-primary-pink {
          color: var(--primary-pink);
        }
        
        .bg-primary-pink {
          background-color: var(--primary-pink);
        }
        
        .from-primary-pink {
          --tw-gradient-from: var(--primary-pink);
        }
        
        .to-primary-pink-dark {
          --tw-gradient-to: var(--primary-pink-dark);
        }
        
        .border-primary-pink\/20 {
          border-color: rgba(239, 43, 112, 0.2);
        }
        
        .bg-primary-pink\/5 {
          background-color: rgba(239, 43, 112, 0.05);
        }
        
        .bg-primary-pink\/10 {
          background-color: rgba(239, 43, 112, 0.1);
        }
        
        .ac-gradient-box {
          background: linear-gradient(135deg, rgba(239, 43, 112, 0.05) 0%, rgba(239, 43, 112, 0.02) 100%);
          border: 1px solid rgba(239, 43, 112, 0.1);
        }
      `}</style>
    </div>
  );
}