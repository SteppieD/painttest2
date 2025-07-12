"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Edit3, Send, Link, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface QuoteData {
  id: string;
  quote_id: string;
  customer_name: string;
  address: string;
  project_type: string;
  total_cost: number;
  status: string;
  created_at: string;
  customer_email?: string;
  customer_phone?: string;
}

export default function QuotePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadQuote();
  }, [params.id]);

  const loadQuote = async () => {
    try {
      console.log('🔍 Loading quote with ID:', params.id);
      const response = await fetch(`/api/quotes/${params.id}`);
      console.log('🔍 Quote API response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 Quote data received:', data);
        setQuote(data);
        console.log('🔍 Quote state set successfully');
      } else {
        console.log('❌ Quote API response not ok:', response.status);
      }
    } catch (error) {
      console.error('Error loading quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyCustomerLink = async () => {
    const customerUrl = `${window.location.origin}/quotes/${params.id}/customer`;
    try {
      await navigator.clipboard.writeText(customerUrl);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Customer quote link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const handleEmailQuote = () => {
    // TODO: Implement email functionality
    toast({
      title: "Email Feature",
      description: "Email integration coming soon! For now, copy the customer link and send it manually.",
    });
  };

  if (isLoading) {
    return (
      <div>
        <div></div>
      </div>
    );
  }

  console.log('🔍 Quote state check:', { quote, isLoading });
  
  if (!quote) {
    return (
      <div>
        <div>
          <p>Quote not found</p>
          <Button onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header>
        <div>
          <div>
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard")}
              >
                <ArrowLeft />
              </Button>
              <div>
                <h1>Quote Overview</h1>
                <p>#{quote.quote_id}</p>
              </div>
            </div>
            
            <div>
              <Button
                variant="outline"
                onClick={copyCustomerLink}
               
              >
                {copied ? (
                  <>
                    <CheckCircle />
                    Copied!
                  </>
                ) : (
                  <>
                    <Link />
                    Copy Customer Link
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleEmailQuote}
               
              >
                <Send />
                Email Quote
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div>
        {/* Quote Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <h3>Customer Information</h3>
                <p>{quote.customer_name}</p>
                <p>{quote.address}</p>
                {quote.customer_email && (
                  <p>{quote.customer_email}</p>
                )}
                {quote.customer_phone && (
                  <p>{quote.customer_phone}</p>
                )}
              </div>
              
              <div>
                <h3>Project Details</h3>
                <p>
                  {quote.project_type?.charAt(0).toUpperCase() + quote.project_type?.slice(1)} Painting
                </p>
                <p>
                  ${quote.total_cost?.toLocaleString()}
                </p>
                <p>
                  Created: {new Date(quote.created_at).toLocaleDateString()}
                </p>
                <div>
                  <span`}>
                    {quote.status || 'pending'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <Card 
                onClick={() => router.push(`/quotes/${quote.id}/review`)}>
            <CardContent>
              <Edit3 />
              <h3>Review & Edit</h3>
              <p>
                View internal details, adjust markup, and analyze costs
              </p>
            </CardContent>
          </Card>
          
          <Card
                onClick={() => router.push(`/quotes/${quote.id}/customer`)}>
            <CardContent>
              <Eye />
              <h3>Customer View</h3>
              <p>
                See the professional quote as your customer sees it
              </p>
            </CardContent>
          </Card>
          
          <Card
                onClick={copyCustomerLink}>
            <CardContent>
              <Send />
              <h3>Share Quote</h3>
              <p>
                Copy link to send to your customer
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Actions */}
        <div>
          <Button
            onClick={copyCustomerLink}
           
            variant="outline"
          >
            {copied ? (
              <>
                <CheckCircle />
                Customer Link Copied!
              </>
            ) : (
              <>
                <Link />
                Copy Customer Link
              </>
            )}
          </Button>
          
          <Button
            onClick={handleEmailQuote}
           
            variant="outline"
          >
            <Send />
            Email Quote to Customer
          </Button>
        </div>
      </div>
    </div>
  );
}