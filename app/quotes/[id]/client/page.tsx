"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Phone, Mail, MapPin, Calendar, CheckCircle, FileText, Download, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

// Same interface as review page but will only show client-appropriate data
interface QuoteData {
  id: string;
  quote_id: string;
  customer_name: string;
  address: string;
  created_at: string;
  quote_amount: number;
  status: string;
  
  // Two-stage AI data structure (client will only see final results)
  client_name?: string;
  date?: string;
  rooms?: Array<{
    name: string;
    wall_sqft: number;
    ceiling_sqft: number;
    doors_count: number;
    windows_count: number;
    floor_sqft: number;
    trim_linear_feet: number;
  }>;
  materials?: {
    wall_paint?: { brand: string; gallons: number; };
  };
  labor?: {
    estimated_hours: number;
  };
  total_quote?: number;
  scope_notes?: string;
  validity_days?: number;
}

export default function ClientQuotePage() {
  const params = useParams();
  const { toast } = useToast();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuoteData();
  }, [params.id]);

  const loadQuoteData = async () => {
    try {
      // Same mock data as review page, but we'll only display client-appropriate info
      const mockQuote: QuoteData = {
        id: params.id as string,
        quote_id: `QUOTE-${(params.id as string).slice(0, 8).toUpperCase()}`,
        customer_name: "Cici",
        address: "9090 Hillside Drive",
        created_at: "2025-06-23T10:00:00Z",
        quote_amount: 8880,
        status: "pending",
        client_name: "Cici",
        date: "2025-06-23",
        rooms: [{
          name: "Interior Space",
          wall_sqft: 4500,
          ceiling_sqft: 0,
          doors_count: 0,
          windows_count: 0,
          floor_sqft: 0,
          trim_linear_feet: 0
        }],
        materials: {
          wall_paint: {
            brand: "Sherwin Williams Eggshell",
            gallons: 13
          }
        },
        labor: {
          estimated_hours: 23
        },
        total_quote: 8880,
        scope_notes: "500 linear feet interior painting, 9ft ceilings, walls only (no doors, trim, windows, or ceilings). No primer required.",
        validity_days: 30
      };
      
      setQuote(mockQuote);
      setLoading(false);
    } catch (error) {
      console.error('Error loading quote:', error);
      toast({
        title: "Error",
        description: "Failed to load quote data",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

  const handleAcceptQuote = () => {
    toast({
      title: "Quote Accepted!",
      description: "Thank you! We'll contact you shortly to schedule the work."
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Download Started",
      description: "Your quote PDF is being prepared..."
    });
  };

  const getValidityDate = () => {
    const date = new Date(quote?.created_at || Date.now());
    date.setDate(date.getDate() + (quote?.validity_days || 30));
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Quote Not Found</h1>
          <p className="text-gray-600">The quote you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Company Branding */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Professional Painting Quote</h1>
              <p className="text-gray-600 mt-1">Elite Painting Services</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-gray-600 mb-1">
                <Phone className="w-4 h-4 mr-2" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                <span>contact@elitepainting.com</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Quote Header */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Project Quote</CardTitle>
              <Badge variant="secondary" className="text-sm">
                Quote #{quote.quote_id}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Client Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <span className="font-medium">{quote.customer_name}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{quote.address}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Quote Date: {new Date(quote.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Project Details</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Project Type:</strong> Interior Painting</p>
                  <p><strong>Total Area:</strong> {quote.rooms?.[0]?.wall_sqft || 0} sq ft</p>
                  <p><strong>Estimated Duration:</strong> {quote.labor?.estimated_hours || 0} hours</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scope of Work */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Scope of Work
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                Includes full preparation, premium paint application, and final cleanup:
              </p>
              
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>{quote.rooms?.[0]?.name || "Interior Space"} – {quote.rooms?.[0]?.wall_sqft || 0} sq ft walls</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Premium {quote.materials?.wall_paint?.brand || "quality paint"} application</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Professional surface preparation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Complete cleanup and protection of furnishings</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Quality guarantee and touch-up warranty</span>
                </li>
              </ul>

              {quote.scope_notes && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-900 text-sm">
                    <strong>Specific Details:</strong> {quote.scope_notes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Total Cost - NO BREAKDOWN SHOWN */}
        <Card>
          <CardHeader>
            <CardTitle>Project Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-green-800">Total Project Cost</h3>
                  <p className="text-green-700 mt-1">All materials, labor, and equipment included</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-green-600">
                    {formatCurrency(quote.total_quote || quote.quote_amount)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>✓ Professional labor and supervision</p>
              <p>✓ All paint and materials</p>
              <p>✓ Surface preparation and cleanup</p>
              <p>✓ Equipment and supplies</p>
              <p>✓ Liability insurance coverage</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Payment Schedule</h4>
                <ul className="space-y-1 text-gray-700">
                  <li>50% due at project start</li>
                  <li>50% upon completion</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Quote Validity</h4>
                <p className="text-gray-700">
                  This quote is valid until <strong>{getValidityDate()}</strong>
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                We accept cash, check, and all major credit cards. A detailed contract will be provided upon acceptance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <Button 
            onClick={handleAcceptQuote}
            className="flex-1 bg-green-600 hover:bg-green-700 text-lg py-3"
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Accept This Quote
          </Button>
          <Button 
            variant="outline"
            onClick={handleDownloadPDF}
            className="flex-1 text-lg py-3"
          >
            <Download className="mr-2 h-5 w-5" />
            Download PDF
          </Button>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Questions? Get in Touch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center p-4">
                <Phone className="w-8 h-8 text-blue-600 mb-2" />
                <h4 className="font-semibold">Call Us</h4>
                <p className="text-gray-600">(555) 123-4567</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <Mail className="w-8 h-8 text-blue-600 mb-2" />
                <h4 className="font-semibold">Email Us</h4>
                <p className="text-gray-600">contact@elitepainting.com</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <Send className="w-8 h-8 text-blue-600 mb-2" />
                <h4 className="font-semibold">Schedule Visit</h4>
                <p className="text-gray-600">Free consultation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6 border-t">
          <p className="text-gray-600 text-sm">
            <strong>Elite Painting Services</strong> – Licensed, Bonded & Insured
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Thank you for considering our services for your painting project.
          </p>
        </div>
      </div>
    </div>
  );
}