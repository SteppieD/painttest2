"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, AlertCircle, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Quote {
  id: number;
  quote_id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  address: string;
  quote_amount: number;
  final_price?: number;
  status?: string;
  created_at: string;
}

export default function PendingAnalyticsPage() {
  const router = useRouter();
  const [pendingQuotes, setPendingQuotes] = useState<Quote[]>([]);
  const [stats, setStats] = useState({
    totalPending: 0,
    totalValue: 0,
    averageAge: 0,
    urgent: 0,
    followUpNeeded: 0
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
        const allQuotes = data.quotes || [];
        const pending = allQuotes.filter((q: Quote) => !q.status || q.status === 'pending');
        setPendingQuotes(pending);
        
        // Calculate stats
        const totalPending = pending.length;
        const totalValue = pending.reduce((sum: number, q: Quote) => 
          sum + (q.final_price || q.quote_amount || 0), 0
        );
        
        // Average age of pending quotes
        const now = new Date();
        const totalAge = pending.reduce((sum: number, q: Quote) => {
          const created = new Date(q.created_at);
          const ageInDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
          return sum + ageInDays;
        }, 0);
        const averageAge = totalPending > 0 ? totalAge / totalPending : 0;
        
        // Urgent (older than 7 days)
        const urgent = pending.filter((q: Quote) => {
          const created = new Date(q.created_at);
          const ageInDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
          return ageInDays > 7;
        }).length;
        
        // Follow up needed (3-7 days old)
        const followUpNeeded = pending.filter((q: Quote) => {
          const created = new Date(q.created_at);
          const ageInDays = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
          return ageInDays >= 3 && ageInDays <= 7;
        }).length;
        
        setStats({
          totalPending,
          totalValue,
          averageAge: Math.round(averageAge),
          urgent,
          followUpNeeded
        });
      });
  }, [router]);

  const getDaysOld = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getUrgencyClass = (createdAt: string) => {
    const days = getDaysOld(createdAt);
    if (days > 7) return "bg-red-100 text-red-800 border-red-200";
    if (days >= 3) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Pending Quotes</h1>
              <p className="text-gray-600">Quotes awaiting customer response</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-yellow-600" />
              <span className="text-3xl font-bold">{stats.totalPending}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Pending</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <span className="text-3xl font-bold text-red-600">{stats.urgent}</span>
            </div>
            <p className="text-gray-600 font-medium">Urgent (7+ days)</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-2">
              <Phone className="w-8 h-8 text-orange-600" />
              <span className="text-3xl font-bold">{stats.followUpNeeded}</span>
            </div>
            <p className="text-gray-600 font-medium">Follow Up (3-7 days)</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-gray-600 font-medium mb-1">Average Age</p>
            <span className="text-3xl font-bold">{stats.averageAge} days</span>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-gray-600 font-medium mb-1">Total Value</p>
            <span className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalValue)}</span>
          </div>
        </div>

        {/* Pending Quotes List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">All Pending Quotes</h2>
          </div>
          <div className="divide-y">
            {pendingQuotes.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No pending quotes at the moment
              </div>
            ) : (
              pendingQuotes
                .sort((a, b) => getDaysOld(b.created_at) - getDaysOld(a.created_at))
                .map((quote) => (
                  <div key={quote.id} className="p-6 hover:bg-gray-50">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{quote.customer_name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyClass(quote.created_at)}`}>
                            {getDaysOld(quote.created_at)} days old
                          </span>
                        </div>
                        <p className="text-gray-600">{quote.address}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>Created: {formatDate(new Date(quote.created_at))}</span>
                          <span className="font-bold text-green-600">{formatCurrency(quote.final_price || quote.quote_amount || 0)}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {quote.customer_phone && (
                          <a
                            href={`tel:${quote.customer_phone}`}
                            className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Call customer"
                          >
                            <Phone className="w-5 h-5" />
                          </a>
                        )}
                        {quote.customer_email && (
                          <a
                            href={`mailto:${quote.customer_email}`}
                            className="p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                            title="Email customer"
                          >
                            <Mail className="w-5 h-5" />
                          </a>
                        )}
                        <button
                          onClick={() => router.push(`/quotes/${quote.id || quote.quote_id}/review`)}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          View Quote
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}