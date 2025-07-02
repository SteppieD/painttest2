"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar,
  MapPin,
  DollarSign,
  Palette,
  FileText,
  CheckCircle,
  Phone,
  Mail
} from "lucide-react";

interface Quote {
  id: string;
  quote_id: string;
  customer_name: string;
  address: string;
  quote_amount: number;
  status: string;
  project_type: string;
  created_at: string;
  company_name: string;
  quote_details: any;
}

export default function PublicQuoteViewPage() {
  const params = useParams();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const response = await fetch(`/api/quotes/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setQuote(data);
        }
      } catch (error) {
        console.error('Error fetching quote:', error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchQuote();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Quote Not Found</h2>
              <p className="text-gray-600">The quote you're looking for doesn't exist or has been removed.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const quoteDetails = typeof quote.quote_details === 'string' 
    ? JSON.parse(quote.quote_details) 
    : quote.quote_details;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Professional Quote Display */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Painting Estimate</h1>
              <p className="text-blue-100 text-lg">{quote.company_name}</p>
              <div className="mt-4">
                <div className="text-4xl font-bold">${quote.quote_amount.toLocaleString()}</div>
                <Badge variant="secondary" className="mt-2 bg-white text-blue-700">
                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Customer & Project Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Project Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Customer</label>
                      <p className="text-gray-900 font-medium">{quote.customer_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Property Address</label>
                      <p className="text-gray-900">{quote.address}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Project Type</label>
                      <p className="text-gray-900 capitalize">{quote.project_type} Painting</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    Quote Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Quote Number</label>
                      <p className="text-gray-900 font-mono text-sm">{quote.quote_id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date Prepared</label>
                      <p className="text-gray-900">
                        {new Date(quote.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Valid Until</label>
                      <p className="text-gray-900">
                        {new Date(new Date(quote.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cost Breakdown */}
            {quoteDetails && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                    Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quoteDetails.materials && (
                      <div className="flex justify-between items-center py-3 border-b">
                        <div>
                          <span className="font-medium text-gray-900">Materials & Paint</span>
                          <p className="text-sm text-gray-600">Premium quality paints and supplies</p>
                        </div>
                        <span className="font-semibold text-lg">${quoteDetails.materials.total_material_cost?.toLocaleString() || '0'}</span>
                      </div>
                    )}
                    {quoteDetails.labor && (
                      <div className="flex justify-between items-center py-3 border-b">
                        <div>
                          <span className="font-medium text-gray-900">Professional Labor</span>
                          <p className="text-sm text-gray-600">Skilled painting and preparation work</p>
                        </div>
                        <span className="font-semibold text-lg">${quoteDetails.labor.total_labor?.toLocaleString() || '0'}</span>
                      </div>
                    )}
                    {quoteDetails.markup_amount > 0 && (
                      <div className="flex justify-between items-center py-3 border-b">
                        <div>
                          <span className="font-medium text-gray-900">Business Operations</span>
                          <p className="text-sm text-gray-600">Insurance, overhead, and project management</p>
                        </div>
                        <span className="font-semibold text-lg">${quoteDetails.markup_amount?.toLocaleString() || '0'}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center py-3 text-xl font-bold bg-blue-50 px-4 rounded">
                      <span>Total Project Investment</span>
                      <span className="text-blue-600">${quote.quote_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* What's Included */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Premium quality paints and materials
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Professional surface preparation
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Complete cleanup after work
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      2-year workmanship warranty
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Licensed and insured professionals
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Dedicated project manager
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms & Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Terms & Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <h4 className="font-semibold mb-2">Payment Terms:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li>• 50% deposit required to schedule project start</li>
                    <li>• Remaining balance due upon completion</li>
                    <li>• We accept cash, check, and major credit cards</li>
                  </ul>
                  
                  <h4 className="font-semibold mb-2">Project Timeline:</h4>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li>• Projects typically start within 1-2 weeks of deposit</li>
                    <li>• Most residential projects completed in 2-5 days</li>
                    <li>• Weather conditions may affect exterior work schedule</li>
                  </ul>

                  <div className="bg-blue-50 p-4 rounded-lg mt-4">
                    <p className="text-sm text-blue-800 font-medium">
                      Ready to get started? Contact {quote.company_name} to schedule your project!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="text-center text-sm text-gray-600">
              <p>This quote is valid for 30 days from the date of issue.</p>
              <p className="mt-1">Thank you for choosing {quote.company_name} for your painting needs!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}