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
  company_logo_url?: string;
  paint_brand?: string;
  paint_product?: string;
  paint_finish?: string;
  paint_color?: string;
  paint_color_hex?: string;
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
  const [showQRCode, setShowQRCode] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="liquid-glass-header">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className="liquid-glass-button shrink-0"
                onClick={() => router.push(`/quotes/${params.id}`)}
                style={{ padding: '8px' }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-white truncate">
                  Professional Quote
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-gray-200">
                  <span>Quote #{quote.quote_id}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{formatDate(quote.created_at)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="liquid-glass-button" onClick={shareQuote}>
                <Copy className="w-4 h-4 mr-2" />
                Share
              </button>
              
              {/* Enhanced Print/PDF Button */}
              <div className="relative group">
                <button 
                  className="liquid-glass-button liquid-glass-success"
                  onClick={() => window.print()}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Save PDF
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-black text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  Click to save as PDF or print. Use your browser's print dialog to save as PDF or email directly.
                </div>
              </div>
              
              <button 
                className="liquid-glass-button liquid-glass-info"
                onClick={() => {
                  const subject = `Painting Quote - ${quote.customer_name}`;
                  const body = `Here's your professional painting quote for ${formatCurrency(finalPrice)}:\n\n${window.location.href}\n\nThank you for considering us for your project!`;
                  window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                }}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 py-8">
        {/* Quote Header */}
        <div className="liquid-glass-quote mb-6 shadow-2xl border-0 overflow-hidden">
          <div className="liquid-glass-header text-white p-8">
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  {/* Company Branding Section */}
                  <div className="flex items-start gap-6 mb-8 pb-6 border-b border-white/10">
                    <div className="relative">
                      <div className="w-20 h-20 shrink-0">
                        {quote.company_logo_url ? (
                          <img 
                            src={quote.company_logo_url} 
                            alt={`${quote.company_name} Logo`}
                            className="w-20 h-20 rounded-xl object-cover border-4 border-white/30 shadow-2xl bg-white/95 p-1"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-20 h-20 bg-gradient-to-br from-white/20 to-white/5 rounded-xl flex items-center justify-center border-4 border-white/30 shadow-2xl backdrop-blur-sm ${quote.company_logo_url ? 'hidden' : ''}`}>
                          <Palette className="w-10 h-10 text-white drop-shadow-lg" />
                        </div>
                      </div>
                      {/* Accent decoration */}
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg"></div>
                    </div>
                    
                    <div className="flex-1 pt-1">
                      <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                        {quote.company_name || "Professional Painting Company"}
                      </h2>
                      <div className="flex flex-col gap-2">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-emerald-400/30">
                          <Shield className="w-4 h-4 text-emerald-300" />
                          <span className="text-sm font-semibold text-emerald-100">Licensed & Insured</span>
                        </div>
                        
                        {(quote.company_phone || quote.company_email) && (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-1">
                            {quote.company_phone && (
                              <a 
                                href={`tel:${quote.company_phone}`} 
                                className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-all duration-200 hover:bg-white/10 px-2 py-1 rounded-md group"
                              >
                                <Phone className="w-4 h-4 text-blue-300 group-hover:text-white" />
                                <span className="font-medium">{quote.company_phone}</span>
                              </a>
                            )}
                            {quote.company_email && (
                              <a 
                                href={`mailto:${quote.company_email}`} 
                                className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-all duration-200 hover:bg-white/10 px-2 py-1 rounded-md group"
                              >
                                <Mail className="w-4 h-4 text-blue-300 group-hover:text-white" />
                                <span className="font-medium">{quote.company_email}</span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quote Title Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
                      <CardTitle className="text-3xl font-bold text-white tracking-tight">
                        Professional Painting Quote
                      </CardTitle>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-yellow-400/30">
                        <Award className="w-4 h-4 text-yellow-300" />
                        <span className="text-sm font-semibold text-yellow-100">Licensed • Insured • Guaranteed</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-blue-200">
                      <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                        <span className="text-xs font-medium text-blue-300">QUOTE</span>
                        <span className="font-mono font-bold text-white">#{quote.quote_id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-300" />
                        <span className="font-medium">{formatDate(quote.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Price Section */}
                <div className="lg:text-right">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
                    <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Total Investment</div>
                    <div className="text-4xl lg:text-5xl font-bold text-white mb-1 tracking-tight">
                      {formatCurrency(finalPrice)}
                    </div>
                    <div className="text-sm text-blue-200 font-medium">Professional Grade</div>
                  </div>
                </div>
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
                  <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Paint Specs:</span>
                    <div className="text-right">
                      <div className="text-sm font-medium">{quote.paint_brand || 'Sherwin Williams'} {quote.paint_product || 'ProClassic'}</div>
                      <div className="text-xs text-gray-500">{quote.paint_finish || 'Eggshell'} Finish</div>
                    </div>
                  </div>
                  {quote.paint_color && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Color:</span>
                      <div className="flex items-center gap-2">
                        {quote.paint_color_hex && (
                          <div 
                            className="w-4 h-4 rounded border border-gray-300 shadow-sm"
                            style={{ backgroundColor: quote.paint_color_hex }}
                          />
                        )}
                        <span className="text-sm font-medium">{quote.paint_color}</span>
                      </div>
                    </div>
                  )}
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

        {/* Customer Testimonials */}
        <Card className="mb-6 bg-gradient-to-r from-gray-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              What Our Customers Say
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  "Exceptional work and attention to detail. The team was professional, clean, and finished on time. Highly recommend!"
                </p>
                <p className="text-xs text-gray-500">- Sarah M., Homeowner</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  "Best painting company we've used. Fair pricing, quality materials, and beautiful results. Worth every penny!"
                </p>
                <p className="text-xs text-gray-500">- Mike R., Property Manager</p>
              </div>
            </div>
            <div className="text-center mt-4">
              <div className="text-2xl font-bold text-blue-600">4.9/5</div>
              <div className="text-sm text-gray-600">Average from 150+ reviews</div>
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

        {/* QR Code Section for Easy Sharing */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-3">Share This Quote</h3>
            <p className="text-sm text-gray-600 mb-4">
              Scan this QR code or copy the link to easily share this quote
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div 
                  className="w-32 h-32 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-500 text-center cursor-pointer"
                  onClick={() => {
                    // Simple QR code using a service
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(window.location.href)}`;
                    setShowQRCode(!showQRCode);
                  }}
                >
                  {showQRCode ? (
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${encodeURIComponent(window.location.href)}`}
                      alt="QR Code for Quote"
                      className="w-full h-full"
                    />
                  ) : (
                    <div>
                      <div className="text-2xl mb-1">📱</div>
                      Click to show QR code
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({ title: "Link copied!", description: "Quote link copied to clipboard" });
                  }}
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const text = `Check out this professional painting quote: ${window.location.href}`;
                    if (navigator.share) {
                      navigator.share({ title: 'Painting Quote', text, url: window.location.href });
                    }
                  }}
                  className="w-full"
                >
                  📱 Share via Text
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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