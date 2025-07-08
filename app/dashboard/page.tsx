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
  Target,
  Sparkles
} from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { QuotaCounter } from "@/components/ui/quota-counter";
import { trackDashboardViewed, trackPageView, trackFeatureUsed } from "@/lib/analytics/tracking";
import { OnboardingTour } from "@/components/ui/onboarding-tour";
import { TrialExpiryBanner } from "@/components/ui/trial-expiry-banner";

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
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [showOnboardingTour, setShowOnboardingTour] = useState(false);
  const [trialInfo, setTrialInfo] = useState<{
    startDate: Date | null;
    isTrial: boolean;
  }>({ startDate: null, isTrial: false });

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
        
        // Check if user has seen the onboarding tour
        const hasSeenTour = localStorage.getItem('paintquote_onboarding_completed');
        if (!hasSeenTour) {
          setShowOnboardingTour(true);
        }
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
        
        // Set trial info for banner
        if (data.is_trial) {
          // Get trial start date from company creation or use current date minus some days
          const companyData = localStorage.getItem("paintquote_company");
          if (companyData) {
            const company = JSON.parse(companyData);
            // Use login time as approximation of trial start
            setTrialInfo({
              startDate: new Date(company.loginTime || Date.now()),
              isTrial: true
            });
          }
        }
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
      default: return "bg-orange-100 text-orange-800";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("paintquote_company");
    router.push("/access-code");
  };

  const loadDemoData = async () => {
    if (isLoadingDemo) return;
    
    setIsLoadingDemo(true);
    try {
      const response = await fetch('/api/seed-demo-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store demo contractors in localStorage
        if (data.demoContractors) {
          localStorage.setItem('demo_contractors', JSON.stringify(data.demoContractors));
        }
        
        // Reload quotes to show demo data
        if (companyInfo) {
          await loadQuotes(companyInfo.id);
        }
        
        alert(`Success! Loaded ${data.quotesCreated} demo quotes and ${data.contractorProfilesCreated} contractor success stories.`);
      } else if (data.message === 'Demo data already exists') {
        alert('Demo data has already been loaded for this account.');
      } else {
        alert('Failed to load demo data. Please try again.');
      }
    } catch (error) {
      console.error('Error loading demo data:', error);
      alert('Error loading demo data. Please try again.');
    } finally {
      setIsLoadingDemo(false);
    }
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
<<<<<<< HEAD
    <div className="min-h-screen bg-white">
      {/* Trial Expiry Banner */}
      {trialInfo.isTrial && trialInfo.startDate && quotaInfo.quotesAllowed && (
        <TrialExpiryBanner
          trialStartDate={trialInfo.startDate}
          trialDurationDays={14}
          quotesUsed={quotaInfo.quotesUsed}
          quotesAllowed={quotaInfo.quotesAllowed}
          companyId={companyInfo?.id?.toString() || ''}
          variant="full"
        />
      )}

      {/* Hero Section with Dashboard Stats */}
      <section className={cn("ac-hero py-12", trialInfo.isTrial && "pt-20")}>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <div className="ac-hero-badge inline-flex mb-4">
                <Zap size={16} />
                <span>Company Dashboard</span>
=======
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
>>>>>>> clean-recovery-deploy
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome back, <span className="text-white font-bold">{companyInfo?.name || companyInfo?.company_name || 'Contractor'}</span>
              </h1>
              <p className="text-lg text-gray-100">
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
<<<<<<< HEAD
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
=======
            
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
>>>>>>> clean-recovery-deploy
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => {
                trackFeatureUsed('analytics_total_quotes', { from: 'dashboard' });
                router.push("/analytics/quotes");
              }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-left hover:bg-white/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-8 h-8 text-white/80 group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-bold text-white">{analytics.totalQuotes}</span>
              </div>
              <p className="text-white/80 font-medium">Total Quotes</p>
              <p className="text-sm text-white/60 mt-1">
                {analytics.acceptedQuotes} won ({analytics.totalQuotes > 0 ? Math.round((analytics.acceptedQuotes / analytics.totalQuotes) * 100) : 0}%)
              </p>
            </button>
            <button 
              onClick={() => {
                trackFeatureUsed('analytics_revenue', { from: 'dashboard' });
                router.push("/analytics/revenue");
              }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-left hover:bg-white/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-8 h-8 text-white/80 group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-bold text-white">{formatCurrency(analytics.totalRevenue)}</span>
              </div>
              <p className="text-white/80 font-medium">Total Revenue</p>
              <p className="text-sm text-white/60 mt-1">All time earnings</p>
            </button>
            <button 
              onClick={() => {
                trackFeatureUsed('analytics_average', { from: 'dashboard' });
                router.push("/analytics/average");
              }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-left hover:bg-white/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-white/80 group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-bold text-white">{formatCurrency(analytics.averageQuote)}</span>
              </div>
              <p className="text-white/80 font-medium">Average Quote</p>
              <p className="text-sm text-white/60 mt-1">Per job value</p>
            </button>
            <button 
              onClick={() => {
                trackFeatureUsed('analytics_pending', { from: 'dashboard' });
                router.push("/analytics/pending");
              }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-left hover:bg-white/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-white/80 group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-bold text-white">{analytics.pendingQuotes}</span>
              </div>
              <p className="text-white/80 font-medium">Pending</p>
              <p className="text-sm text-white/60 mt-1">Awaiting response</p>
            </button>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Setup Completion Prompt */}
        {!isCheckingOnboarding && needsOnboarding && (
          <div className="mb-8">
            <div className="ac-card ac-gradient-box p-8 text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
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
                  onClick={() => router.push("/setup-chat")}
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
=======
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
>>>>>>> clean-recovery-deploy
              </div>
            </div>
          </div>
        )}

<<<<<<< HEAD
        {/* Quick Settings Access */}
        {!isCheckingOnboarding && !needsOnboarding && (
          <div className="mb-6">
            <div className="ac-card bg-white border-purple-200 shadow-sm">
              <div className="ac-card-body flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">Customize Your Products & Pricing</h3>
                    <p className="text-gray-600">Set up paint products and costs for accurate quotes</p>
=======
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
>>>>>>> clean-recovery-deploy
                  </div>
                </div>
                <button 
                  onClick={() => router.push("/settings/products")}
<<<<<<< HEAD
                  className="ac-btn ac-btn-secondary"
                >
                  <Settings size={18} />
=======
                  className="neomorphism-button-enhanced flex items-center gap-2"
                >
>>>>>>> clean-recovery-deploy
                  Settings
                </button>
              </div>
            </div>
          </div>
        )}

<<<<<<< HEAD
        {/* Primary Action - Create Quote */}
        <div className="mb-8">
          <div 
            className="ac-card cursor-pointer group hover:shadow-xl transition-all duration-300 bg-white border-orange-200 shadow-md" 
            onClick={() => router.push("/create-quote")}
          >
            <div className="ac-card-body p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Calculator className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Create Professional Quote</h3>
                    <p className="text-lg text-gray-600">Room-by-room measurements • Industry pricing • Customer-ready output</p>
                  </div>
                </div>
                <div className="text-orange-600 group-hover:translate-x-2 transition-transform">
                  <ArrowRight size={32} />
                </div>
              </div>
=======
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
>>>>>>> clean-recovery-deploy
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

<<<<<<< HEAD
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Settings</h3>
                  <p className="text-sm text-gray-600">Configure options</p>
                </div>
              </div>
            </button>
            <button
              onClick={loadDemoData}
              disabled={isLoadingDemo}
              className="ac-card group hover:shadow-lg transition-all"
            >
              <div className="ac-card-body flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className={`w-6 h-6 text-yellow-600 ${isLoadingDemo ? 'animate-spin' : ''}`} />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Load Demo Data</h3>
                  <p className="text-sm text-gray-600">Try sample quotes</p>
                </div>
=======
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
>>>>>>> clean-recovery-deploy
              </div>
            </button>
          </div>
        </div>

<<<<<<< HEAD

        {/* Quotes List */}
        <div className="ac-card">
          <div className="ac-card-header">
=======
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
              onClick={() => router.push("/analytics")}
              className="neomorphism-button-enhanced flex items-center justify-center gap-3 py-4 animate-neomorphism-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="font-semibold">Business Intelligence</span>
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
>>>>>>> clean-recovery-deploy
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Recent Quotes ({filteredQuotes.length})</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative">
<<<<<<< HEAD
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search quotes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="ac-input pl-10 w-full sm:w-48"
=======
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    placeholder="Search quotes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="neomorphism-input-enhanced pl-10 w-full sm:w-48"
>>>>>>> clean-recovery-deploy
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
<<<<<<< HEAD
                  className="ac-input"
=======
                  className="neomorphism-input-enhanced"
>>>>>>> clean-recovery-deploy
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
          
<<<<<<< HEAD
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
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button onClick={() => router.push("/create-quote")} className="ac-btn ac-btn-primary ac-btn-lg">
                      <Calculator size={20} />
                      Create Your First Professional Quote
                    </button>
                    <button 
                      onClick={loadDemoData} 
                      disabled={isLoadingDemo}
                      className="ac-btn ac-btn-secondary ac-btn-lg"
                    >
                      <Sparkles size={20} className={isLoadingDemo ? 'animate-spin' : ''} />
                      {isLoadingDemo ? 'Loading...' : 'Try Sample Quotes'}
                    </button>
                  </div>
=======
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
>>>>>>> clean-recovery-deploy
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuotes.map((quote) => (
<<<<<<< HEAD
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
=======
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
>>>>>>> clean-recovery-deploy
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
                          <div className="text-2xl font-bold text-green-700">
                            {formatCurrency(quote.final_price || quote.quote_amount || 0)}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <select
                            value={quote.status || "pending"}
                            onChange={(e) => updateQuoteStatus(quote.id, e.target.value)}
<<<<<<< HEAD
                            className="ac-input py-2"
=======
                            className="neomorphism-input-enhanced text-sm"
>>>>>>> clean-recovery-deploy
                          >
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          
                          <div className="flex gap-2">
                            <button
<<<<<<< HEAD
                              onClick={(e) => {
                                e.stopPropagation();
=======
                              onClick={() => {
>>>>>>> clean-recovery-deploy
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
<<<<<<< HEAD
                              className="ac-btn ac-btn-sm ac-btn-secondary"
                            >
                              <Copy className="w-4 h-4" />
                              <span className="hidden sm:inline">Copy</span>
=======
                              className="neomorphism-button-enhanced px-3 py-2"
                            >
                              <Copy className="w-4 h-4" />
                              <span className="sm:hidden ml-2">Copy Link</span>
>>>>>>> clean-recovery-deploy
                            </button>
                            <button
                              onClick={() => router.push(`/quotes/${quote.id}`)}
                              title="View quote details"
<<<<<<< HEAD
                              className="ac-btn ac-btn-sm ac-btn-primary"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="hidden sm:inline">View</span>
=======
                              className="neomorphism-button-enhanced px-3 py-2"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="sm:hidden ml-2">View</span>
>>>>>>> clean-recovery-deploy
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

      {/* Onboarding Tour */}
      {showOnboardingTour && companyInfo && (
        <OnboardingTour
          companyName={companyInfo.name || companyInfo.company_name || 'Contractor'}
          onComplete={() => {
            setShowOnboardingTour(false);
            // Track completion
            trackFeatureUsed('onboarding_tour_completed', { companyId: companyInfo.id });
          }}
          onSkip={() => {
            setShowOnboardingTour(false);
            // Track skip
            trackFeatureUsed('onboarding_tour_skipped', { companyId: companyInfo.id });
          }}
        />
      )}
    </div>
  );
}