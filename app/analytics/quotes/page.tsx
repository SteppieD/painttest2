"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, TrendingUp, CheckCircle, Clock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Quote {
  id: number;
  quote_id: string;
  customer_name: string;
  address: string;
  quote_amount: number;
  final_price?: number;
  status?: string;
  created_at: string;
  project_type?: string;
}

export default function QuotesAnalyticsPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    pending: 0,
    cancelled: 0,
    acceptanceRate: 0,
    totalValue: 0
  });

  useEffect(() => {
    const companyData = localStorage.getItem("paintquote_company");
    if (!companyData) {
      router.push("/access-code");
      return;
    }

    const company = JSON.parse(companyData);
    
    // Load quotes
    fetch(`/api/quotes?company_id=${company.id}`)
      .then(res => res.json())
      .then(data => {
        const quotesData = data.quotes || [];
        setQuotes(quotesData);
        
        // Calculate stats
        const total = quotesData.length;
        const accepted = quotesData.filter((q: Quote) => q.status === 'accepted').length;
        const pending = quotesData.filter((q: Quote) => !q.status || q.status === 'pending').length;
        const cancelled = quotesData.filter((q: Quote) => q.status === 'cancelled').length;
        const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0;
        const totalValue = quotesData.reduce((sum: number, q: Quote) => sum + (q.final_price || q.quote_amount || 0), 0);
        
        setStats({ total, accepted, pending, cancelled, acceptanceRate, totalValue });
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
              <h1 className="text-2xl font-bold text-gray-900">Quote Analytics</h1>
              <p className="text-gray-600">Detailed insights into your quotes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <span className="text-3xl font-bold">{stats.total}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Quotes</p>
            <p className="text-sm text-gray-500">All time</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold">{stats.accepted}</span>
            </div>
            <p className="text-gray-600 font-medium">Accepted</p>
            <p className="text-sm text-green-600">{stats.acceptanceRate}% win rate</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-yellow-600" />
              <span className="text-3xl font-bold">{stats.pending}</span>
            </div>
            <p className="text-gray-600 font-medium">Pending</p>
            <p className="text-sm text-gray-500">Awaiting response</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <span className="text-3xl font-bold">{formatCurrency(stats.totalValue)}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Value</p>
            <p className="text-sm text-gray-500">All quotes</p>
          </div>
        </div>

        {/* Quotes by Status */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quotes by Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">Accepted</span>
              </div>
              <span className="text-lg font-bold text-green-600">{stats.accepted}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="font-medium">Pending</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">{stats.pending}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="font-medium">Cancelled</span>
              </div>
              <span className="text-lg font-bold text-red-600">{stats.cancelled}</span>
            </div>
          </div>
        </div>

        {/* Recent Quotes */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Quotes</h2>
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
                {quotes.slice(0, 10).map((quote) => (
                  <tr key={quote.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{quote.customer_name}</p>
                        <p className="text-sm text-gray-500">{quote.address}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatDate(new Date(quote.created_at))}
                    </td>
                    <td className="py-3 px-4 font-medium text-green-600">
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