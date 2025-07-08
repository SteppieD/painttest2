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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  console.log('🔍 Quote state check:', { quote, isLoading });
  
  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Quote not found</p>
          <Button onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Quote Overview</h1>
                <p className="text-sm text-gray-500">#{quote.quote_id}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={copyCustomerLink}
                className="hidden sm:flex"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Link className="w-4 h-4 mr-2" />
                    Copy Customer Link
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleEmailQuote}
                className="hidden sm:flex"
              >
                <Send className="w-4 h-4 mr-2" />
                Email Quote
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Quote Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p className="text-lg font-medium">{quote.customer_name}</p>
                <p className="text-gray-600">{quote.address}</p>
                {quote.customer_email && (
                  <p className="text-gray-600">{quote.customer_email}</p>
                )}
                {quote.customer_phone && (
                  <p className="text-gray-600">{quote.customer_phone}</p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Project Details</h3>
                <p className="text-gray-600">
                  {quote.project_type?.charAt(0).toUpperCase() + quote.project_type?.slice(1)} Painting
                </p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  ${quote.total_cost?.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(quote.created_at).toLocaleDateString()}
                </p>
                <div className="mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    quote.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    quote.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {quote.status || 'pending'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                onClick={() => router.push(`/quotes/${quote.id}/review`)}>
            <CardContent className="p-6 text-center">
              <Edit3 className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Review & Edit</h3>
              <p className="text-sm text-gray-600">
                View internal details, adjust markup, and analyze costs
              </p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/quotes/${quote.id}/customer`)}>
            <CardContent className="p-6 text-center">
              <Eye className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Customer View</h3>
              <p className="text-sm text-gray-600">
                See the professional quote as your customer sees it
              </p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={copyCustomerLink}>
            <CardContent className="p-6 text-center">
              <Send className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Share Quote</h3>
              <p className="text-sm text-gray-600">
                Copy link to send to your customer
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Actions */}
        <div className="sm:hidden space-y-3">
          <Button
            onClick={copyCustomerLink}
            className="w-full"
            variant="outline"
          >
            {copied ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Customer Link Copied!
              </>
            ) : (
              <>
                <Link className="w-4 h-4 mr-2" />
                Copy Customer Link
              </>
            )}
          </Button>
          
          <Button
            onClick={handleEmailQuote}
            className="w-full"
            variant="outline"
          >
            <Send className="w-4 h-4 mr-2" />
            Email Quote to Customer
          </Button>
        </div>
      </div>
    </div>
  );
}