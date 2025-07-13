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
  ArrowRight,
  Crown,
  Sparkles
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
      <div>
        <div>
          <div></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div>
        <div>
          <div>
            <div>
              <Palette />
              <div>
                <h1>ProPaint Quote Assistant</h1>
                <div>
                  <p>{companyInfo?.company_name}</p>
                  {companyInfo?.access_code && (
                    <>
                      <span>•</span>
                      <div>
                        <span>Code: {companyInfo.access_code}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            navigator.clipboard.writeText(companyInfo.access_code);
                            alert('Access code copied to clipboard!');
                          }}
                         
                        >
                          <Copy />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              {companyInfo && (
                <QuotaCounter 
                  companyId={companyInfo.id}
                  variant="header"
                 
                />
              )}
              <Button
                onClick={() => {
                  trackFeatureUsed('create_quote_button', { from: 'dashboard' });
                  router.push("/create-quote");
                }}
               
              >
                <Calculator />
                <span>New Quote</span>
                <span>Quote</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleLogout}
               
              >
                <LogOut />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Upgrade Banner for Trial/Freemium Users */}
        {!isCheckingOnboarding && quotaInfo.isTrial && quotaInfo.quotesAllowed && quotaInfo.quotesUsed >= quotaInfo.quotesAllowed * 0.5 && (
          <div>
            <Card>
              <CardContent>
                <div>
                  <div>
                    <div>
                      <Crown />
                    </div>
                    <div>
                      <h3>
                        {quotaInfo.quotesUsed >= quotaInfo.quotesAllowed 
                          ? "You've reached your quote limit!" 
                          : `You've used ${quotaInfo.quotesUsed} of ${quotaInfo.quotesAllowed} free quotes`}
                      </h3>
                      <p>
                        Upgrade to Professional for unlimited quotes and premium features
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="lg"
                    variant="secondary"
                    onClick={() => router.push('/pricing')}
                   
                  >
                    <Sparkles />
                    Upgrade Now - Save 20%
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Setup Completion Prompt - Flat Design */}
        {!isCheckingOnboarding && needsOnboarding && (
          <div>
            <Card>
              <CardContent>
                <div>
                  <Palette />
                </div>
                <h2>
                  Complete Your Setup
                </h2>
                <p>
                  Set up your favorite paint products and pricing to create quotes quickly. 
                  This takes just 2 minutes and you'll be ready to start quoting!
                </p>
                <div>
                  <Button 
                    onClick={() => router.push("/setup")}
                   
                    size="lg"
                  >
                    <ArrowRight />
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

        {/* Quick Settings Access - Flat Design */}
        {!isCheckingOnboarding && !needsOnboarding && (
          <div>
            <Card>
              <CardContent>
                <div>
                  <div>
                    <div>
                      <Palette />
                    </div>
                    <div>
                      <h3>Customize Your Products & Pricing</h3>
                      <p>Set up paint products and costs for accurate quotes</p>
                    </div>
                  </div>
                  <div>
                    <Button 
                      variant="ghost"
                      onClick={() => router.push("/setup?update=true")}
                     
                    >
                      <MessageSquare />
                      <span>Quick Update</span>
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => router.push("/settings/products")}
                     
                    >
                      Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Primary Action - Create Quote - Mobile-First Flat Design */}
        <div>
          <Card 
            
            onClick={() => router.push("/create-quote")}
          >
            <CardContent>
              <div>
                <div>
                  <div>
                    <Calculator />
                  </div>
                  <div>
                    <h3>Create Professional Quote</h3>
                    <p>Room-by-room measurements • Industry pricing • Customer-ready output</p>
                  </div>
                </div>
                <div>
                  <ArrowRight />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quota Counter */}
        {companyInfo && (
          <div>
            <QuotaCounter 
              companyId={companyInfo.id}
              variant="full"
              showUpgrade={true}
            />
          </div>
        )}

        {/* Business Metrics - Flat Design Mobile-First */}
        <div>
          <div>
            <h2>Business Performance</h2>
            <div>
              {/* Total Quotes Card */}
              <div>
                <div>
                  <FileText />
                </div>
                <div>{analytics.totalQuotes}</div>
                <div>Total Quotes</div>
                <div>
                  {analytics.acceptedQuotes} won ({analytics.totalQuotes > 0 ? Math.round((analytics.acceptedQuotes / analytics.totalQuotes) * 100) : 0}%)
                </div>
              </div>

              {/* Revenue Card */}
              <div>
                <div>
                  <DollarSign />
                </div>
                <div>{formatCurrency(analytics.totalRevenue)}</div>
                <div>Revenue Generated</div>
                <div>All time</div>
              </div>

              {/* Average Quote Card */}
              <div>
                <div>
                  <TrendingUp />
                </div>
                <div>{formatCurrency(analytics.averageQuote)}</div>
                <div>Average Job Value</div>
                <div>Per quote</div>
              </div>

              {/* Pending Quotes Card */}
              <div>
                <div>
                  <Calendar />
                </div>
                <div>{analytics.pendingQuotes}</div>
                <div>Awaiting Response</div>
                <div>Follow up needed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Navigation - Mobile-First Flat Design */}
        <div>
          <div>
            <Button
              variant="outline"
              onClick={() => router.push("/quotes")}
             
            >
              <FileText />
              <span>View All Quotes</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/insights")}
             
            >
              <TrendingUp />
              <span>Analytics</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/business-insights")}
              className={`${quotaInfo.isTrial ? 'opacity-50' : ''}`}
            >
              <Crown className="h-4 w-4" />
              <span>Business Insights</span>
              {quotaInfo.isTrial && (
                <Sparkles className="h-3 w-3 ml-1" />
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/settings")}
             
            >
              <MessageSquare />
              <span>Settings</span>
            </Button>
          </div>
        </div>

        {/* Quotes List - Flat Design */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span>Recent Quotes ({filteredQuotes.length})</span>
              <div>
                <div>
                  <Search />
                  <Input
                    placeholder="Search quotes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                   
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                 
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
              <div>
                <FileText />
                <p>
                  {quotes.length === 0 ? "No quotes yet" : "No quotes match your filters"}
                </p>
                {quotes.length === 0 && (
                  <Button onClick={() => router.push("/create-quote")}>
                    <Calculator />
                    Create Your First Professional Quote
                  </Button>
                )}
              </div>
            ) : (
              <div>
                {filteredQuotes.map((quote) => (
                  <div key={quote.id}>
                    <div>
                      <div>
                        <div>
                          <h3>{quote.customer_name}</h3>
                          <span>
                            {quote.status || 'pending'}
                          </span>
                        </div>
                        <p>{quote.address}</p>
                        <p>
                          {formatDate(new Date(quote.created_at))} • {quote.time_estimate || 'Time estimate pending'}
                        </p>
                      </div>
                      
                      <div>
                        <div>
                          <div>
                            {formatCurrency(quote.final_price || quote.quote_amount || 0)}
                          </div>
                        </div>
                        
                        <div>
                          <select
                            value={quote.status || "pending"}
                            onChange={(e) => updateQuoteStatus(quote.id, e.target.value)}
                           
                          >
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          
                          <div>
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
                             
                            >
                              <Copy />
                              <span>Copy Link</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/quotes/${quote.id}`)}
                              title="View quote details"
                             
                            >
                              <Eye />
                              <span>View</span>
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