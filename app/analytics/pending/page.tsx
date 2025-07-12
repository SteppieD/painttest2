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
    <div>
      <div>
        <div>
          <div>
            <button
              onClick={() => router.push("/dashboard")}
             
            >
              <ArrowLeft />
            </button>
            <div>
              <h1>Pending Quotes</h1>
              <p>Quotes awaiting customer response</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Stats Overview */}
        <div>
          <div>
            <div>
              <Clock />
              <span>{stats.totalPending}</span>
            </div>
            <p>Total Pending</p>
          </div>

          <div>
            <div>
              <AlertCircle />
              <span>{stats.urgent}</span>
            </div>
            <p>Urgent (7+ days)</p>
          </div>

          <div>
            <div>
              <Phone />
              <span>{stats.followUpNeeded}</span>
            </div>
            <p>Follow Up (3-7 days)</p>
          </div>

          <div>
            <p>Average Age</p>
            <span>{stats.averageAge} days</span>
          </div>

          <div>
            <p>Total Value</p>
            <span>{formatCurrency(stats.totalValue)}</span>
          </div>
        </div>

        {/* Pending Quotes List */}
        <div>
          <div>
            <h2>All Pending Quotes</h2>
          </div>
          <div>
            {pendingQuotes.length === 0 ? (
              <div>
                No pending quotes at the moment
              </div>
            ) : (
              pendingQuotes
                .sort((a, b) => getDaysOld(b.created_at) - getDaysOld(a.created_at))
                .map((quote) => (
                  <div key={quote.id}>
                    <div>
                      <div>
                        <div>
                          <h3>{quote.customer_name}</h3>
                          <span`}>
                            {getDaysOld(quote.created_at)} days old
                          </span>
                        </div>
                        <p>{quote.address}</p>
                        <div>
                          <span>Created: {formatDate(new Date(quote.created_at))}</span>
                          <span>{formatCurrency(quote.final_price || quote.quote_amount || 0)}</span>
                        </div>
                      </div>
                      
                      <div>
                        {quote.customer_phone && (
                          <a
                            href={`tel:${quote.customer_phone}`}
                           
                            title="Call customer"
                          >
                            <Phone />
                          </a>
                        )}
                        {quote.customer_email && (
                          <a
                            href={`mailto:${quote.customer_email}`}
                           
                            title="Email customer"
                          >
                            <Mail />
                          </a>
                        )}
                        <button
                          onClick={() => router.push(`/quotes/${quote.id || quote.quote_id}/review`)}
                         
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