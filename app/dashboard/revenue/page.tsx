"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DollarSign, 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Search,
  Download,
  BarChart3,
  PieChart,
  Target
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

interface RevenueStats {
  totalRevenue: number;
  acceptedRevenue: number;
  completedRevenue: number;
  pendingRevenue: number;
  averageQuoteValue: number;
  highestQuote: number;
  lowestQuote: number;
  monthlyGrowth: number;
  yearlyGrowth: number;
  conversionRate: number;
}

export default function RevenuePage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [stats, setStats] = useState<RevenueStats>({
    totalRevenue: 0,
    acceptedRevenue: 0,
    completedRevenue: 0,
    pendingRevenue: 0,
    averageQuoteValue: 0,
    highestQuote: 0,
    lowestQuote: 0,
    monthlyGrowth: 0,
    yearlyGrowth: 0,
    conversionRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [monthlyRevenue, setMonthlyRevenue] = useState<{month: string; revenue: number}[]>([]);
  const [projectTypeRevenue, setProjectTypeRevenue] = useState<{type: string; revenue: number; count: number}[]>([]);

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
        calculateMonthlyRevenue(quotesArray);
        calculateProjectTypeRevenue(quotesArray);
      }
    } catch (error) {
      console.error("Error loading quotes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (quotesData: Quote[]) => {
    const totalRevenue = quotesData.reduce((sum, quote) => sum + (quote.quote_amount || 0), 0);
    const acceptedQuotes = quotesData.filter(q => q.status === "accepted");
    const completedQuotes = quotesData.filter(q => q.status === "completed");
    const pendingQuotes = quotesData.filter(q => !q.status || q.status === "pending");
    
    const acceptedRevenue = acceptedQuotes.reduce((sum, quote) => sum + (quote.quote_amount || 0), 0);
    const completedRevenue = completedQuotes.reduce((sum, quote) => sum + (quote.quote_amount || 0), 0);
    const pendingRevenue = pendingQuotes.reduce((sum, quote) => sum + (quote.quote_amount || 0), 0);

    const quoteAmounts = quotesData.map(q => q.quote_amount).filter(a => a > 0);
    const highestQuote = quoteAmounts.length > 0 ? Math.max(...quoteAmounts) : 0;
    const lowestQuote = quoteAmounts.length > 0 ? Math.min(...quoteAmounts) : 0;
    const averageQuoteValue = quotesData.length > 0 ? totalRevenue / quotesData.length : 0;

    // Calculate monthly growth
    const now = new Date();
    const thisMonthRevenue = quotesData
      .filter(q => {
        const date = new Date(q.created_at);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, quote) => sum + (quote.quote_amount || 0), 0);

    const lastMonthRevenue = quotesData
      .filter(q => {
        const date = new Date(q.created_at);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
        return date.getMonth() === lastMonth.getMonth() && 
               date.getFullYear() === lastMonth.getFullYear();
      })
      .reduce((sum, quote) => sum + (quote.quote_amount || 0), 0);

    const monthlyGrowth = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0;

    // Calculate yearly growth
    const thisYearRevenue = quotesData
      .filter(q => new Date(q.created_at).getFullYear() === now.getFullYear())
      .reduce((sum, quote) => sum + (quote.quote_amount || 0), 0);

    const lastYearRevenue = quotesData
      .filter(q => new Date(q.created_at).getFullYear() === now.getFullYear() - 1)
      .reduce((sum, quote) => sum + (quote.quote_amount || 0), 0);

    const yearlyGrowth = lastYearRevenue > 0 
      ? ((thisYearRevenue - lastYearRevenue) / lastYearRevenue) * 100 
      : 0;

    // Calculate conversion rate (accepted + completed vs total)
    const conversionRate = quotesData.length > 0
      ? ((acceptedQuotes.length + completedQuotes.length) / quotesData.length) * 100
      : 0;

    setStats({
      totalRevenue,
      acceptedRevenue,
      completedRevenue,
      pendingRevenue,
      averageQuoteValue,
      highestQuote,
      lowestQuote,
      monthlyGrowth,
      yearlyGrowth,
      conversionRate,
    });
  };

  const calculateMonthlyRevenue = (quotesData: Quote[]) => {
    const monthRevenue: { [key: string]: number } = {};
    const now = new Date();
    
    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthRevenue[monthKey] = 0;
    }

    quotesData.forEach(quote => {
      const date = new Date(quote.created_at);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (monthRevenue.hasOwnProperty(monthKey)) {
        monthRevenue[monthKey] += quote.quote_amount || 0;
      }
    });

    const data = Object.entries(monthRevenue).map(([month, revenue]) => ({
      month,
      revenue,
    }));

    setMonthlyRevenue(data);
  };

  const calculateProjectTypeRevenue = (quotesData: Quote[]) => {
    const typeRevenue: { [key: string]: { revenue: number; count: number } } = {};

    quotesData.forEach(quote => {
      const type = quote.project_type || 'General';
      if (!typeRevenue[type]) {
        typeRevenue[type] = { revenue: 0, count: 0 };
      }
      typeRevenue[type].revenue += quote.quote_amount || 0;
      typeRevenue[type].count += 1;
    });

    const data = Object.entries(typeRevenue)
      .map(([type, data]) => ({
        type,
        revenue: data.revenue,
        count: data.count,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    setProjectTypeRevenue(data);
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

    // Sort by amount descending
    return filtered.sort((a, b) => (b.quote_amount || 0) - (a.quote_amount || 0));
  };

  const exportData = () => {
    const filteredQuotes = getFilteredQuotes();
    const csv = [
      ["Quote ID", "Customer", "Address", "Amount", "Status", "Project Type", "Created Date"].join(","),
      ...filteredQuotes.map(q => [
        q.quote_id,
        q.customer_name,
        q.address,
        q.quote_amount || 0,
        q.status || "pending",
        q.project_type || "General",
        new Date(q.created_at).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div>
        <div>
          <div></div>
          <p>Loading revenue analytics...</p>
        </div>
      </div>
    );
  }

  const filteredQuotes = getFilteredQuotes();
  const maxRevenue = Math.max(...monthlyRevenue.map(d => d.revenue));
  const totalProjectRevenue = projectTypeRevenue.reduce((sum, type) => sum + type.revenue, 0);

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
              <h1>Revenue Analysis</h1>
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
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>{formatCurrency(stats.totalRevenue)}</div>
              <div>
                {stats.monthlyGrowth > 0 ? (
                  <TrendingUp />
                ) : (
                  <TrendingDown />
                )}
                <span>
                  {Math.abs(stats.monthlyGrowth).toFixed(1)}% monthly
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Average Quote Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>{formatCurrency(stats.averageQuoteValue)}</div>
              <div>
                per quote
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>{stats.conversionRate.toFixed(1)}%</div>
              <div>
                quotes accepted
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Pending Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>{formatCurrency(stats.pendingRevenue)}</div>
              <div>
                awaiting decision
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <DollarSign />
                <div>
                  {formatCurrency(stats.pendingRevenue)}
                </div>
                <div>Pending</div>
                <div>
                  {((stats.pendingRevenue / stats.totalRevenue) * 100).toFixed(1)}% of total
                </div>
              </div>
              <div>
                <DollarSign />
                <div>
                  {formatCurrency(stats.acceptedRevenue)}
                </div>
                <div>Accepted</div>
                <div>
                  {((stats.acceptedRevenue / stats.totalRevenue) * 100).toFixed(1)}% of total
                </div>
              </div>
              <div>
                <DollarSign />
                <div>
                  {formatCurrency(stats.completedRevenue)}
                </div>
                <div>Completed</div>
                <div>
                  {((stats.completedRevenue / stats.totalRevenue) * 100).toFixed(1)}% of total
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {monthlyRevenue.map((data, index) => (
                <div key={index}>
                  <div>
                    {formatCurrency(data.revenue)}
                  </div>
                  <div 
                    style={{
                      height: `${(data.revenue / maxRevenue) * 200}px`,
                      minHeight: data.revenue > 0 ? '20px' : '0'
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

        {/* Revenue by Project Type */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Project Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {projectTypeRevenue.map((type, index) => (
                <div key={index}>
                  <div>
                    <span>{type.type}</span>
                    <div>
                      <span>{formatCurrency(type.revenue)}</span>
                      <span>({type.count} quotes)</span>
                    </div>
                  </div>
                  <div>
                    <div 
                      style={{ width: `${(type.revenue / totalProjectRevenue) * 100}%` }}
                    >
                      <span>
                        {((type.revenue / totalProjectRevenue) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Quotes */}
        <Card>
          <CardHeader>
            <CardTitle>
              <span>Top Revenue Quotes</span>
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
                    <th>Project Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.slice(0, 20).map((quote) => (
                    <tr key={quote.id}>
                      <td>{quote.quote_id}</td>
                      <td>{quote.customer_name}</td>
                      <td>{quote.project_type || 'General'}</td>
                      <td>
                        {formatCurrency(quote.quote_amount)}
                      </td>
                      <td>
                        <span>
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