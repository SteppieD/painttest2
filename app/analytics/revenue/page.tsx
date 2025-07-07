"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, DollarSign, TrendingUp, Calendar, Award } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Quote {
  id: number;
  customer_name: string;
  quote_amount: number;
  final_price?: number;
  status?: string;
  created_at: string;
}

export default function RevenueAnalyticsPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    acceptedRevenue: 0,
    pendingRevenue: 0,
    thisMonth: 0,
    lastMonth: 0,
    monthlyGrowth: 0
  });

  useEffect(() => {
    const companyData = localStorage.getItem("paintquote_company");
    if (!companyData) {
      router.push("/access-code");
      return;
    }

    const company = JSON.parse(companyData);
    
    fetch(`/api/quotes?company_id=${company.id}`)
      .then(res => res.json())
      .then(data => {
        const quotesData = data.quotes || [];
        setQuotes(quotesData);
        
        // Calculate revenue stats
        const totalRevenue = quotesData.reduce((sum: number, q: Quote) => 
          sum + (q.final_price || q.quote_amount || 0), 0
        );
        
        const acceptedRevenue = quotesData
          .filter((q: Quote) => q.status === 'accepted')
          .reduce((sum: number, q: Quote) => sum + (q.final_price || q.quote_amount || 0), 0);
        
        const pendingRevenue = quotesData
          .filter((q: Quote) => !q.status || q.status === 'pending')
          .reduce((sum: number, q: Quote) => sum + (q.final_price || q.quote_amount || 0), 0);
        
        // Monthly calculations
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        
        const thisMonth = quotesData
          .filter((q: Quote) => new Date(q.created_at) >= thisMonthStart)
          .reduce((sum: number, q: Quote) => sum + (q.final_price || q.quote_amount || 0), 0);
        
        const lastMonth = quotesData
          .filter((q: Quote) => {
            const date = new Date(q.created_at);
            return date >= lastMonthStart && date <= lastMonthEnd;
          })
          .reduce((sum: number, q: Quote) => sum + (q.final_price || q.quote_amount || 0), 0);
        
        const monthlyGrowth = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;
        
        setStats({
          totalRevenue,
          acceptedRevenue,
          pendingRevenue,
          thisMonth,
          lastMonth,
          monthlyGrowth
        });
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Revenue Analytics</h1>
              <p className="text-gray-600">Track your earnings and growth</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold">{formatCurrency(stats.totalRevenue)}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Revenue</p>
            <p className="text-sm text-gray-500">All time earnings</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold">{formatCurrency(stats.acceptedRevenue)}</span>
            </div>
            <p className="text-gray-600 font-medium">Confirmed Revenue</p>
            <p className="text-sm text-green-600">From accepted quotes</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold">{formatCurrency(stats.thisMonth)}</span>
            </div>
            <p className="text-gray-600 font-medium">This Month</p>
            <p className="text-sm text-gray-500">Current month revenue</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <span className="text-3xl font-bold">
                {stats.monthlyGrowth > 0 ? '+' : ''}{stats.monthlyGrowth.toFixed(0)}%
              </span>
            </div>
            <p className="text-gray-600 font-medium">Monthly Growth</p>
            <p className="text-sm text-gray-500">vs last month</p>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue by Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Accepted Quotes</span>
                <span className="text-lg font-bold text-green-600">{formatCurrency(stats.acceptedRevenue)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending Quotes</span>
                <span className="text-lg font-bold text-yellow-600">{formatCurrency(stats.pendingRevenue)}</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Potential</span>
                  <span className="text-xl font-bold">{formatCurrency(stats.totalRevenue)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Comparison</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">This Month</span>
                <span className="text-lg font-bold">{formatCurrency(stats.thisMonth)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Month</span>
                <span className="text-lg font-bold">{formatCurrency(stats.lastMonth)}</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Difference</span>
                  <span className={`text-xl font-bold ${stats.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.monthlyGrowth >= 0 ? '+' : ''}{formatCurrency(stats.thisMonth - stats.lastMonth)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Quotes */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Revenue Quotes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {quotes
                  .sort((a, b) => (b.final_price || b.quote_amount || 0) - (a.final_price || a.quote_amount || 0))
                  .slice(0, 10)
                  .map((quote) => (
                    <tr key={quote.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{quote.customer_name}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {formatDate(new Date(quote.created_at))}
                      </td>
                      <td className="py-3 px-4 font-bold text-green-600">
                        {formatCurrency(quote.final_price || quote.quote_amount || 0)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          quote.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {quote.status || 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}