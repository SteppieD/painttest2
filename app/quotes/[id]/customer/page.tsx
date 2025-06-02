"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, Printer, Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface QuoteData {
  id: string;
  quote_id: string;
  customer_name: string;
  address: string;
  project_type: string;
  sqft: number;
  paint_quality: string;
  total_cost: number;
  timeline: string;
  created_at: string;
  company_name?: string;
  company_phone?: string;
  company_email?: string;
}

export default function CustomerQuotePage({ params }: { params: { id: string } }) {
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
      const response = await fetch(`/api/quotes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setQuote(data);
      }
    } catch (error) {
      console.error('Error loading quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getValidityDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const copyToClipboard = async () => {
    if (!quote) return;
    
    const quoteText = `
PAINTING QUOTE

Quote #: ${quote.quote_id}
Date: ${formatDate(quote.created_at)}
Valid Until: ${getValidityDate(quote.created_at)}

CLIENT INFORMATION
${quote.customer_name}
${quote.address}

PROJECT DETAILS
Type: ${quote.project_type} painting
Square Footage: ${quote.sqft?.toLocaleString()} sq ft
Paint Quality: ${quote.paint_quality}
Timeline: ${quote.timeline || 'Standard'}

TOTAL QUOTE: $${quote.total_cost?.toLocaleString()}

TERMS & CONDITIONS
- Quote valid for 30 days
- 50% deposit required to start work
- Balance due upon completion
- Includes all labor, materials, and equipment
- Minor prep work included (patching small holes, light sanding)
- Major repairs quoted separately

Thank you for considering our services!
${quote.company_name || 'ProPaint Company'}
${quote.company_phone || '(555) 123-4567'}
${quote.company_email || 'info@propaint.com'}
    `.trim();

    try {
      await navigator.clipboard.writeText(quoteText);
      setCopied(true);
      toast({
        title: "Quote copied!",
        description: "The quote has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
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
    <div className="min-h-screen bg-white print:bg-white">
      {/* Actions Bar - Hidden when printing */}
      <div className="print:hidden bg-gray-50 border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Content */}
      <div className="max-w-3xl mx-auto p-8">
        <Card className="border-0 shadow-none print:shadow-none">
          <CardContent className="p-0">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {quote.company_name || 'ProPaint Company'}
              </h1>
              <p className="text-gray-600">Professional Painting Services</p>
            </div>

            {/* Quote Info */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Painting Quote</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Quote Number</p>
                  <p className="font-medium">{quote.quote_id}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="font-medium">{formatDate(quote.created_at)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Valid Until</p>
                  <p className="font-medium">{getValidityDate(quote.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Client Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{quote.customer_name}</p>
                <p className="text-gray-600">{quote.address}</p>
              </div>
            </div>

            {/* Project Scope */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Project Scope</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type of Work:</span>
                  <span className="font-medium capitalize">{quote.project_type} Painting</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Square Footage:</span>
                  <span className="font-medium">{quote.sqft?.toLocaleString()} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Paint Quality:</span>
                  <span className="font-medium capitalize">{quote.paint_quality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timeline:</span>
                  <span className="font-medium capitalize">{quote.timeline || 'Standard'}</span>
                </div>
              </div>
            </div>

            {/* Total Price */}
            <div className="mb-8 bg-blue-50 p-6 rounded-lg text-center">
              <p className="text-gray-600 mb-2">Total Quote Amount</p>
              <p className="text-4xl font-bold text-blue-600">
                ${quote.total_cost?.toLocaleString()}
              </p>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Terms & Conditions</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• This quote is valid for 30 days from the date of issue</li>
                <li>• 50% deposit required to begin work</li>
                <li>• Balance due upon completion of work</li>
                <li>• Includes all labor, materials, and equipment</li>
                <li>• Minor prep work included (patching small holes, light sanding)</li>
                <li>• Major repairs will be quoted separately if required</li>
                <li>• Work guaranteed for one year from completion</li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="text-center pt-8 border-t">
              <p className="font-semibold mb-2">
                {quote.company_name || 'ProPaint Company'}
              </p>
              <p className="text-gray-600">
                {quote.company_phone || '(555) 123-4567'} | {quote.company_email || 'info@propaint.com'}
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Thank you for considering our services!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}