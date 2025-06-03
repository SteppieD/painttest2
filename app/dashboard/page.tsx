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
  Copy
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
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

      if (Array.isArray(data)) {
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
    const revenue = quotesData.reduce((sum, quote) => sum + (quote.quote_amount || 0), 0);
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

    setAnalytics({
      totalQuotes: total,
      totalRevenue: revenue,
      averageQuote: average,
      pendingQuotes: pending,
      acceptedQuotes: accepted,
      thisMonthQuotes: thisMonthQuotes.length,
      thisMonthRevenue: thisMonthQuotes.reduce((sum, quote) => sum + (quote.quote_amount || 0), 0),
    });
  };

  // Filter quotes
  useEffect(() => {
    let filtered = quotes.filter((quote) => {
      const matchesSearch =
        quote.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (quote.quote_id && quote.quote_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => router.push("/assistant")}
                className="hidden sm:flex"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                New Quote
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push("/quotes")}
                className="hidden sm:flex"
              >
                <FileText className="w-4 h-4 mr-2" />
                All Quotes
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push("/insights")}
                className="hidden sm:flex"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Insights
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push("/settings")}
                className="hidden sm:flex"
              >
                Settings
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Quick Action - Single Quote Method */}
        <div className="mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/assistant")}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Create New Quote</h3>
                  <p className="text-sm text-gray-600">Chat with AI to generate quotes quickly</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] hover:border-blue-200"
            onClick={() => router.push("/dashboard/total-quotes")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Total Quotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalQuotes}</div>
              <p className="text-xs text-gray-500">
                {analytics.pendingQuotes} pending
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] hover:border-green-200"
            onClick={() => router.push("/dashboard/revenue")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(analytics.totalRevenue)}
              </div>
              <p className="text-xs text-gray-500">
                All time
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] hover:border-blue-200"
            onClick={() => router.push("/dashboard/average-quote")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Average Quote
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(analytics.averageQuote)}
              </div>
              <p className="text-xs text-gray-500">
                Per quote
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] hover:border-purple-200"
            onClick={() => router.push("/dashboard/this-month")}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.thisMonthQuotes}</div>
              <p className="text-xs text-gray-500">
                {formatCurrency(analytics.thisMonthRevenue)}
              </p>
            </CardContent>
          </Card>
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
                  <Button onClick={() => router.push("/chat")}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Create Your First Quote
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
                          <div className="flex items-center gap-2">
                            {quote.quote_id && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {quote.quote_id}
                              </span>
                            )}
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(quote.status)}`}>
                              {quote.status || 'pending'}
                            </span>
                          </div>
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