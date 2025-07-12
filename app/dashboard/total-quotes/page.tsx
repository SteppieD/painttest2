"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle
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
  notes: string;
  status?: string;
  created_at: string;
  company_id: number;
  project_type?: string;
  time_estimate?: string;
}

interface QuoteStats {
  total: number;
  pending: number;
  accepted: number;
  completed: number;
  cancelled: number;
  monthlyGrowth: number;
  acceptanceRate: number;
  averageTime: number;
}

export default function TotalQuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [stats, setStats] = useState<QuoteStats>({
    total: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
    cancelled: 0,
    monthlyGrowth: 0,
    acceptanceRate: 0,
    averageTime: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [monthlyData, setMonthlyData] = useState<{month: string; count: number}[]>([]);

  useEffect(() => {
    const companyData = localStorage.getItem("paintquote_company");
    if (companyData) {
      try {
        const company = JSON.parse(companyData);
        if (Date.now() - company.loginTime > 24 * 60 * 60 * 1000) {
          localStorage.removeItem("paintquote_company");
          router.push("/access-code");
          return;
        }
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

      // Handle both direct array and wrapped response
      const quotesArray = Array.isArray(data) ? data : (data.quotes || []);
      if (quotesArray.length >= 0) {
        setQuotes(quotesArray);
        calculateStats(quotesArray);
        calculateMonthlyData(quotesArray);
      }
    } catch (error) {
      console.error("Error loading quotes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (quotesData: Quote[]) => {
    const total = quotesData.length;
    const pending = quotesData.filter(q => !q.status || q.status === "pending").length;
    const accepted = quotesData.filter(q => q.status === "accepted").length;
    const completed = quotesData.filter(q => q.status === "completed").length;
    const cancelled = quotesData.filter(q => q.status === "cancelled").length;

    // Calculate monthly growth
    const now = new Date();
    const thisMonth = quotesData.filter(q => {
      const date = new Date(q.created_at);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    const lastMonth = quotesData.filter(q => {
      const date = new Date(q.created_at);
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
      return date.getMonth() === lastMonthDate.getMonth() && 
             date.getFullYear() === lastMonthDate.getFullYear();
    }).length;

    const monthlyGrowth = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

    // Calculate acceptance rate
    const decidedQuotes = accepted + completed + cancelled;
    const acceptanceRate = decidedQuotes > 0 ? ((accepted + completed) / decidedQuotes) * 100 : 0;

    // Calculate average time to decision (in days)
    const quotesWithDecision = quotesData.filter(q => q.status && q.status !== "pending");
    const averageTime = quotesWithDecision.length > 0 
      ? quotesWithDecision.reduce((sum, quote) => {
          const created = new Date(quote.created_at);
          const now = new Date();
          return sum + Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        }, 0) / quotesWithDecision.length
      : 0;

    setStats({
      total,
      pending,
      accepted,
      completed,
      cancelled,
      monthlyGrowth,
      acceptanceRate,
      averageTime: Math.round(averageTime),
    });
  };

  const calculateMonthlyData = (quotesData: Quote[]) => {
    const monthCounts: { [key: string]: number } = {};
    const now = new Date();
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthCounts[monthKey] = 0;
    }

    quotesData.forEach(quote => {
      const date = new Date(quote.created_at);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthCounts.hasOwnProperty(monthKey)) {
        monthCounts[monthKey]++;
      }
    });

    const data = Object.entries(monthCounts).map(([month, count]) => ({
      month,
      count,
    }));

    setMonthlyData(data);
  };

  const getFilteredQuotes = () => {
    let filtered = quotes;

    // Time filter
    if (timeFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter(quote => {
        const quoteDate = new Date(quote.created_at);
        switch (timeFilter) {
          case "today":
            return quoteDate.toDateString() === now.toDateString();
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return quoteDate >= weekAgo;
          case "month":
            return quoteDate.getMonth() === now.getMonth() && 
                   quoteDate.getFullYear() === now.getFullYear();
          case "year":
            return quoteDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(quote => 
        statusFilter === "pending" 
          ? !quote.status || quote.status === "pending"
          : quote.status === statusFilter
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(quote =>
        quote.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(quote.quote_id || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const exportData = () => {
    const filteredQuotes = getFilteredQuotes();
    const csv = [
      ["Quote ID", "Customer", "Address", "Amount", "Status", "Created Date"].join(","),
      ...filteredQuotes.map(q => [
        q.quote_id,
        q.customer_name,
        q.address,
        q.quote_amount || 0,
        q.status || "pending",
        new Date(q.created_at).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quotes-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div>
        <div>
          <div></div>
          <p>Loading quote analytics...</p>
        </div>
      </div>
    );
  }

  const filteredQuotes = getFilteredQuotes();
  const maxCount = Math.max(...monthlyData.map(d => d.count));

  return (
    <div>
      {/* Header */}
      <div>
        <div>
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
             
            >
              <ArrowLeft />
              Back to Dashboard
            </Button>
            <div>
              <h1>Total Quotes Analysis</h1>
            </div>
            <Button
              variant="outline"
              onClick={exportData}
             
            >
              <Download />
              Export Data
            </Button>
          </div>
        </div>
      </div>

      <div>
        {/* Overview Stats */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                Total Quotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>{stats.total}</div>
              <div>
                {stats.monthlyGrowth > 0 ? (
                  <TrendingUp />
                ) : (
                  <TrendingDown />
                )}
                <span`}>
                  {Math.abs(stats.monthlyGrowth).toFixed(1)}% vs last month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Acceptance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>{stats.acceptanceRate.toFixed(1)}%</div>
              <div>
                {stats.accepted + stats.completed} accepted of {stats.accepted + stats.completed + stats.cancelled} decided
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Pending Quotes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>{stats.pending}</div>
              <div>
                {((stats.pending / stats.total) * 100).toFixed(1)}% of total
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Avg. Decision Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>{stats.averageTime}</div>
              <div>days</div>
            </CardContent>
          </Card>
        </div>

        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <AlertCircle />
                <div>{stats.pending}</div>
                <div>Pending</div>
              </div>
              <div>
                <CheckCircle />
                <div>{stats.accepted}</div>
                <div>Accepted</div>
              </div>
              <div>
                <CheckCircle />
                <div>{stats.completed}</div>
                <div>Completed</div>
              </div>
              <div>
                <XCircle />
                <div>{stats.cancelled}</div>
                <div>Cancelled</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Quote Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {monthlyData.map((data, index) => (
                <div key={index}>
                  <div>{data.count}</div>
                  <div 
                   
                   px`,
                      minHeight: data.count > 0 ? '20px' : '0'
                    }}
                  />
                  <div>
                    {data.month}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters and Quote List */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span>Quote Details ({filteredQuotes.length})</span>
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
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                 
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
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
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Quote ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((quote) => (
                    <tr key={quote.id}>
                      <td>{quote.quote_id}</td>
                      <td>{quote.customer_name}</td>
                      <td>{formatCurrency(quote.quote_amount)}</td>
                      <td>
                        <span`}>
                          {quote.status || 'pending'}
                        </span>
                      </td>
                      <td>{formatDate(new Date(quote.created_at))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}