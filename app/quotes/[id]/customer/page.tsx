"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, Printer, Download, CheckCircle, PenTool, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  subtotal?: number;
  tax_rate?: number;
  tax_amount?: number;
  walls_sqft?: number;
  ceilings_sqft?: number;
  trim_sqft?: number;
}

export default function CustomerQuotePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [clientSignature, setClientSignature] = useState("");
  const [isAccepted, setIsAccepted] = useState(false);

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
PROFESSIONAL PAINTING ESTIMATE

${quote.company_name || 'ProPaint Company'}
Quote #: ${quote.quote_id}
Date: ${formatDate(quote.created_at)}
Valid Until: ${getValidityDate(quote.created_at)}

CLIENT: ${quote.customer_name}
PROPERTY: ${quote.address}

PROJECT SCOPE:
Premium ${quote.project_type} painting with surface preparation
${quote.sqft?.toLocaleString()} square feet
${quote.paint_quality} quality materials and application
Complete project management and cleanup

INVESTMENT: $${quote.total_cost?.toLocaleString()}

This proposal includes professional materials, expert application, and complete project management from start to finish.

Thank you for considering our services!
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

  const handleAcceptQuote = () => {
    if (!clientSignature.trim()) {
      toast({
        title: "Signature Required",
        description: "Please type your name to accept this quote.",
        variant: "destructive",
      });
      return;
    }

    setIsAccepted(true);
    toast({
      title: "Quote Accepted!",
      description: "Thank you! We'll contact you within 24 hours to schedule your project.",
    });
  };

  const getPaintQualityDescription = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'luxury':
        return 'Premium luxury finishes with superior durability and coverage';
      case 'premium':
        return 'High-quality professional grade paints with excellent coverage';
      case 'basic':
        return 'Quality standard paints suitable for most applications';
      default:
        return 'Professional grade paints and materials';
    }
  };

  const getTimelineDescription = (timeline: string) => {
    switch (timeline?.toLowerCase()) {
      case 'rush':
        return 'Expedited completion within 2-3 business days';
      case 'flexible':
        return 'Flexible scheduling to fit your timeline';
      default:
        return 'Standard completion timeline of 3-5 business days';
    }
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
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex gap-3">
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
                    Copy Quote
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="border-0 shadow-lg print:shadow-none">
          <CardContent className="p-8">
            {/* Professional Header */}
            <div className="text-center mb-8 pb-6 border-b-2 border-blue-600">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {quote.company_name || 'ProPaint Company'}
              </h1>
              <p className="text-lg text-blue-600 font-medium">Professional Painting Services</p>
              <div className="flex justify-center items-center gap-6 mt-4 text-sm text-gray-600">
                <span>{quote.company_phone || '(555) 123-4567'}</span>
                <span>•</span>
                <span>{quote.company_email || 'info@propaint.com'}</span>
              </div>
            </div>

            {/* PAINTING ESTIMATE Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">PAINTING ESTIMATE</h2>
              <div className="flex justify-center gap-8 text-sm">
                <div>
                  <span className="text-gray-600">Quote #:</span>
                  <span className="font-bold ml-2">{quote.quote_id}</span>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <span className="font-bold ml-2">{formatDate(quote.created_at)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Valid Until:</span>
                  <span className="font-bold ml-2 text-red-600">{getValidityDate(quote.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Client Information Block */}
            <div className="mb-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Project Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Client</p>
                  <p className="font-bold text-lg">{quote.customer_name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Property Address</p>
                  <p className="font-medium">{quote.address}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Project Scope</p>
                  <p className="font-medium capitalize">{quote.project_type} Painting Project</p>
                  <p className="text-sm text-gray-600">{quote.sqft?.toLocaleString()} square feet</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Estimated Timeline</p>
                  <p className="font-medium">{getTimelineDescription(quote.timeline)}</p>
                </div>
              </div>
            </div>

            {/* Strategic Pricing Presentation */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-6 text-gray-900">Professional Services Included</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                  <PenTool className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Premium {quote.project_type} Painting with Surface Preparation</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {getPaintQualityDescription(quote.paint_quality)} • Complete surface preparation including cleaning, sanding, and priming as needed
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                  <Award className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Professional Materials and Expert Application</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      High-quality paints, primers, and finishes • Professional-grade tools and equipment • Expert color consultation and application techniques
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Complete Project Management and Cleanup</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Daily cleanup and protection of your property • Complete post-project cleanup • Professional project coordination from start to finish
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Section */}
            <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Total Project Investment</h3>
                <div className="text-5xl font-bold mb-2">
                  ${quote.total_cost?.toLocaleString()}
                </div>
                <p className="text-blue-100">
                  Complete professional painting service as described above
                </p>
              </div>
            </div>

            {/* Trust-Building Elements */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  What&apos;s Included
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Complete surface preparation and cleaning</li>
                  <li>• Premium paint and materials included</li>
                  <li>• Professional application and finishing</li>
                  <li>• Daily cleanup and area protection</li>
                  <li>• Final walkthrough and touch-ups</li>
                  <li>• Complete post-project cleanup</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  Our Guarantee
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• 1-year workmanship warranty</li>
                  <li>• Licensed and insured professionals</li>
                  <li>• Satisfaction guarantee</li>
                  <li>• Clean, respectful service</li>
                  <li>• On-time project completion</li>
                  <li>• Free touch-ups within warranty period</li>
                </ul>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <h4 className="font-bold text-gray-900 mb-2">Payment Terms & Project Phases</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p>• 25% deposit to secure your project date</p>
                <p>• 50% progress payment upon project start</p>
                <p>• 25% final payment upon completion and your approval</p>
                <p>• We accept cash, check, and major credit cards</p>
              </div>
            </div>

            {/* Digital Signature Section */}
            {!isAccepted ? (
              <div className="mb-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h4 className="font-bold text-gray-900 mb-4 text-center">Accept This Quote</h4>
                <p className="text-center text-gray-600 mb-4">
                  Ready to transform your space? Type your name below and click Accept to get started.
                </p>
                <div className="max-w-md mx-auto space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Digital Signature (Type your full name)
                    </label>
                    <Input
                      value={clientSignature}
                      onChange={(e) => setClientSignature(e.target.value)}
                      placeholder="Type your full name here"
                      className="text-center"
                    />
                  </div>
                  <Button
                    onClick={handleAcceptQuote}
                    disabled={!clientSignature.trim()}
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
                  >
                    Accept Quote & Get Started
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mb-8 bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h4 className="font-bold text-green-900 text-xl mb-2">Quote Accepted!</h4>
                <p className="text-green-700 mb-2">
                  Thank you, {clientSignature}! Your quote has been accepted.
                </p>
                <p className="text-sm text-green-600">
                  We&apos;ll contact you within 24 hours to schedule your project and collect the deposit.
                </p>
              </div>
            )}

            {/* Contact Information Footer */}
            <div className="text-center pt-6 border-t">
              <h4 className="font-bold text-gray-900 mb-2">Questions? Ready to Schedule?</h4>
              <div className="text-gray-600 space-y-1">
                <p className="font-medium text-lg">
                  {quote.company_name || 'ProPaint Company'}
                </p>
                <p>
                  {quote.company_phone || '(555) 123-4567'} | {quote.company_email || 'info@propaint.com'}
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  Thank you for choosing us for your painting project!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}