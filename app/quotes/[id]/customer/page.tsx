"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Copy, 
  Printer, 
  Download, 
  CheckCircle, 
  PenTool, 
  Shield, 
  Clock, 
  Award, 
  Star,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Palette,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface Room {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  ceiling_area: number;
  wall_area: number;
  number_of_doors: number;
  number_of_windows: number;
}

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
  customer_phone?: string;
  customer_email?: string;
  prep_work?: string;
  special_requests?: string;
  wall_linear_feet?: number;
  ceiling_height?: number;
  number_of_doors?: number;
  number_of_windows?: number;
  final_price?: number;
  markup_amount?: number;
  room_data?: string;
  room_count?: number;
  payment_terms?: {
    schedule: string;
    terms: string;
  };
}

export default function CustomerQuotePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clientSignature, setClientSignature] = useState("");
  const [isAccepted, setIsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    loadQuote();
  }, [params.id]);

  const loadQuote = async () => {
    try {
      const response = await fetch(`/api/quotes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setQuote(data);
        
        // Parse room data if available
        if (data.room_data && typeof data.room_data === 'string') {
          try {
            const roomData = JSON.parse(data.room_data);
            if (Array.isArray(roomData)) {
              setRooms(roomData);
            }
          } catch (e) {
            console.error('Error parsing room data:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error loading quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  const handleAcceptQuote = async () => {
    if (!clientSignature.trim()) {
      toast({
        title: "Signature Required",
        description: "Please enter your full name to accept the quote.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/quotes/${params.id}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_signature: clientSignature,
          accepted_at: new Date().toISOString()
        })
      });

      if (response.ok) {
        setIsAccepted(true);
        toast({
          title: "Quote Accepted!",
          description: "Thank you! We'll contact you within 24 hours to schedule your project.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept quote. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareQuote = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Painting Quote - ${quote?.customer_name}`,
          text: `Professional painting quote for ${quote?.total_cost ? formatCurrency(quote.total_cost) : 'your project'}`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Quote link copied to clipboard",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your quote...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Quote Not Found</h2>
            <p className="text-gray-600 mb-4">The quote you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const finalPrice = quote.final_price || quote.total_cost || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/quotes/${params.id}`)}
                className="shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {quote.company_name || "Professional Painting"}
                </h1>
                <p className="text-sm text-gray-500">Licensed & Insured</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={shareQuote}>
                <Copy className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(`/api/quotes/${params.id}/pdf`, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 py-8">
        {/* Quote Header */}
        <Card className="mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-2xl font-bold mb-2">
                  Professional Painting Quote
                </CardTitle>
                <div className="flex items-center gap-4 text-blue-100">
                  <span>Quote #{quote.quote_id}</span>
                  <span>•</span>
                  <span>{formatDate(quote.created_at)}</span>
                </div>
              </div>
              <div className="mt-4 lg:mt-0 text-right">
                <div className="text-3xl font-bold">{formatCurrency(finalPrice)}</div>
                <div className="text-blue-100 text-sm">Total Investment</div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Customer Details */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Home className="w-5 h-5 text-blue-600" />
                  Project Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium">{quote.customer_name}</div>
                      <div className="text-gray-600">{quote.address}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-gray-400" />
                    <span className="capitalize">{quote.project_type} Painting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-gray-400" />
                    <span>Total: {quote.sqft ? `${quote.sqft.toLocaleString()} sq ft` : 'Custom project'}</span>
                  </div>
                  {(quote.walls_sqft || 0) > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4" />
                      <span className="text-gray-600">Walls: {(quote.walls_sqft || 0).toLocaleString()} sq ft</span>
                    </div>
                  )}
                  {(quote.ceilings_sqft || 0) > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4" />
                      <span className="text-gray-600">Ceilings: {(quote.ceilings_sqft || 0).toLocaleString()} sq ft</span>
                    </div>
                  )}
                  {(quote.trim_sqft || 0) > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4" />
                      <span className="text-gray-600">Trim: {(quote.trim_sqft || 0).toLocaleString()} sq ft</span>
                    </div>
                  )}
                  {(quote.number_of_doors || quote.number_of_windows) && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4" />
                      <span className="text-gray-600">
                        {quote.number_of_doors ? `${quote.number_of_doors} doors` : ''}
                        {quote.number_of_doors && quote.number_of_windows ? ', ' : ''}
                        {quote.number_of_windows ? `${quote.number_of_windows} windows` : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline & Quality */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Timeline & Quality
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Paint Quality:</span>
                    <Badge variant="secondary" className="capitalize">
                      {quote.paint_quality || 'Premium'} Grade
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Timeline:</span>
                    <span className="text-sm font-medium">{quote.timeline || '3-5 business days'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Valid Until:</span>
                    <span className="text-sm font-medium">{getValidityDate(quote.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room Breakdown - Only show if rooms exist */}
        {rooms.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" />
                Room Breakdown ({rooms.length} rooms)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rooms.map((room, index) => (
                  <div key={room.id || index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">{room.name}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Dimensions:</span>
                        <span>{room.length}' × {room.width}' × {room.height}'</span>
                      </div>
                      {room.ceiling_area > 0 && (
                        <div className="flex justify-between">
                          <span>Ceiling Area:</span>
                          <span>{room.ceiling_area} sq ft</span>
                        </div>
                      )}
                      {room.wall_area > 0 && (
                        <div className="flex justify-between">
                          <span>Wall Area:</span>
                          <span>{room.wall_area} sq ft</span>
                        </div>
                      )}
                      {(room.number_of_doors > 0 || room.number_of_windows > 0) && (
                        <div className="flex justify-between">
                          <span>Features:</span>
                          <span>
                            {room.number_of_doors > 0 ? `${room.number_of_doors} doors` : ''}
                            {room.number_of_doors > 0 && room.number_of_windows > 0 ? ', ' : ''}
                            {room.number_of_windows > 0 ? `${room.number_of_windows} windows` : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Services Included */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              What's Included
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium">Complete Surface Preparation</div>
                    <div className="text-sm text-gray-600">Cleaning, sanding, and priming as needed</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium">Premium Paint & Materials</div>
                    <div className="text-sm text-gray-600">High-quality paints with excellent coverage</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium">Professional Application</div>
                    <div className="text-sm text-gray-600">Expert techniques for flawless finish</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium">Daily Cleanup & Protection</div>
                    <div className="text-sm text-gray-600">Your property protected throughout</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium">Final Walkthrough</div>
                    <div className="text-sm text-gray-600">Ensure your complete satisfaction</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-medium">Complete Post-Project Cleanup</div>
                    <div className="text-sm text-gray-600">Leave your space spotless</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guarantees */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Our Guarantee
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="font-medium">1-Year Warranty</div>
                <div className="text-sm text-gray-600">Workmanship guarantee</div>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="font-medium">Licensed & Insured</div>
                <div className="text-sm text-gray-600">Full protection coverage</div>
              </div>
              <div className="text-center">
                <Star className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="font-medium">Satisfaction Promise</div>
                <div className="text-sm text-gray-600">We make it right</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Terms - Only show if configured for this quote */}
        {quote.payment_terms && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Payment Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="text-sm text-gray-700">
                  {quote.payment_terms.terms}
                </div>
                {quote.payment_terms.schedule && (
                  <div className="text-sm text-gray-600">
                    <strong>Payment Schedule:</strong> {quote.payment_terms.schedule}
                  </div>
                )}
                <div className="text-center text-sm text-gray-600 pt-2 border-t">
                  We accept cash, check, and all major credit cards
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Accept Quote */}
        {!isAccepted ? (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <PenTool className="w-5 h-5" />
                Ready to Get Started?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <p className="text-green-700">
                Transform your space with professional painting. Enter your name below to accept this quote and we'll contact you within 24 hours to schedule your project.
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-1">
                    Digital Signature (Type your full name)
                  </label>
                  <Input
                    value={clientSignature}
                    onChange={(e) => setClientSignature(e.target.value)}
                    placeholder="Type your full name here"
                    className="border-green-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                
                <Button 
                  onClick={handleAcceptQuote}
                  disabled={!clientSignature.trim() || isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Accept Quote & Get Started
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-800 mb-2">Quote Accepted!</h3>
              <p className="text-green-700 mb-4">
                Thank you for choosing us for your painting project. We'll contact you within 24 hours to schedule your project start date.
              </p>
              <div className="text-sm text-green-600">
                Signed by: {clientSignature}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Footer */}
        <div className="mt-8 text-center">
          <h3 className="font-semibold text-gray-900 mb-4">Questions? Ready to Schedule?</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <a href={`tel:${quote.company_phone || '(555) 123-4567'}`} className="text-blue-600 hover:underline">
                {quote.company_phone || '(555) 123-4567'}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <a href={`mailto:${quote.company_email || 'contact@paintingcompany.com'}`} className="text-blue-600 hover:underline">
                {quote.company_email || 'contact@paintingcompany.com'}
              </a>
            </div>
          </div>
          <p className="text-gray-600 mt-4 text-sm">
            Thank you for choosing {quote.company_name || "us"} for your painting project!
          </p>
        </div>
      </div>
    </div>
  );
}