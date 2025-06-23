"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Copy, 
  Printer, 
  Download, 
  CheckCircle, 
  DollarSign, 
  Calculator,
  Users,
  Home,
  Palette,
  FileText,
  Edit3,
  Eye,
  Share
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  markup_percentage?: number;
  room_data?: string;
  room_count?: number;
  total_materials?: number;
  projected_labor?: number;
  status?: string;
}

export default function InternalQuoteViewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  const copyQuoteData = async () => {
    if (!quote) return;
    
    const quoteText = `
INTERNAL QUOTE BREAKDOWN - ${quote.quote_id}

Customer: ${quote.customer_name}
Address: ${quote.address}
Project: ${quote.project_type} painting
Date: ${formatDate(quote.created_at)}

MEASUREMENTS:
- Walls: ${quote.walls_sqft || 0} sq ft
- Ceilings: ${quote.ceilings_sqft || 0} sq ft
- Trim: ${quote.trim_sqft || 0} sq ft
- Doors: ${quote.number_of_doors || 0}
- Windows: ${quote.number_of_windows || 0}

COST BREAKDOWN:
Materials: ${formatCurrency(quote.total_materials || 0)}
Labor: ${formatCurrency(quote.projected_labor || 0)}
Subtotal: ${formatCurrency((quote.total_materials || 0) + (quote.projected_labor || 0))}
Markup (${quote.markup_percentage || 0}%): ${formatCurrency(quote.markup_amount || 0)}
TOTAL QUOTE: ${formatCurrency(quote.final_price || quote.total_cost || 0)}

Status: ${quote.status || 'pending'}
    `.trim();

    try {
      await navigator.clipboard.writeText(quoteText);
      toast({
        title: "Quote Data Copied!",
        description: "Internal quote breakdown copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy quote data",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quote details...</p>
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
  const materials = quote.total_materials || 0;
  const labor = quote.projected_labor || 0;
  const markupAmount = quote.markup_amount || 0;
  const markupPercentage = quote.markup_percentage || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  Internal Quote Breakdown
                </h1>
                <p className="text-sm text-gray-500">Quote #{quote.quote_id}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={copyQuoteData}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Data
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(`/quotes/${quote.id}/customer`, '_blank')}
              >
                <Eye className="w-4 h-4 mr-2" />
                Customer View
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 py-8">
        {/* Quote Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium text-lg">{quote.customer_name}</div>
                <div className="text-sm text-gray-600">{quote.address}</div>
              </div>
              {quote.customer_email && (
                <div className="text-sm text-gray-600">
                  <strong>Email:</strong> {quote.customer_email}
                </div>
              )}
              {quote.customer_phone && (
                <div className="text-sm text-gray-600">
                  <strong>Phone:</strong> {quote.customer_phone}
                </div>
              )}
              <div className="pt-2">
                <Badge variant={quote.status === 'accepted' ? 'default' : 'secondary'}>
                  {quote.status || 'Pending'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-green-600" />
                Project Scope
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-medium capitalize">{quote.project_type} Painting</div>
                <div className="text-sm text-gray-600">Created: {formatDate(quote.created_at)}</div>
              </div>
              <div className="space-y-2">
                {quote.walls_sqft && quote.walls_sqft > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Walls:</span>
                    <span>{quote.walls_sqft.toLocaleString()} sq ft</span>
                  </div>
                )}
                {quote.ceilings_sqft && quote.ceilings_sqft > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Ceilings:</span>
                    <span>{quote.ceilings_sqft.toLocaleString()} sq ft</span>
                  </div>
                )}
                {quote.trim_sqft && quote.trim_sqft > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Trim:</span>
                    <span>{quote.trim_sqft.toLocaleString()} sq ft</span>
                  </div>
                )}
                {quote.number_of_doors && quote.number_of_doors > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Doors:</span>
                    <span>{quote.number_of_doors}</span>
                  </div>
                )}
                {quote.number_of_windows && quote.number_of_windows > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Windows:</span>
                    <span>{quote.number_of_windows}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Financial Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Materials:</span>
                  <span>{formatCurrency(materials)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Labor:</span>
                  <span>{formatCurrency(labor)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(materials + labor)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Markup ({markupPercentage}%):</span>
                  <span>{formatCurrency(markupAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Quote:</span>
                  <span className="text-green-600">{formatCurrency(finalPrice)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Cost Breakdown */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Detailed Cost Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Materials Cost</h4>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(materials)}</div>
                  <div className="text-sm text-gray-600">
                    Paint, primer, supplies
                  </div>
                  <div className="text-xs text-gray-500">
                    {materials > 0 ? `${((materials / finalPrice) * 100).toFixed(1)}% of total` : 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Labor Cost</h4>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-600">{formatCurrency(labor)}</div>
                  <div className="text-sm text-gray-600">
                    Prep work, painting, cleanup
                  </div>
                  <div className="text-xs text-gray-500">
                    {labor > 0 ? `${((labor / finalPrice) * 100).toFixed(1)}% of total` : 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Your Profit</h4>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(markupAmount)}</div>
                  <div className="text-sm text-gray-600">
                    {markupPercentage}% markup
                  </div>
                  <div className="text-xs text-gray-500">
                    {markupAmount > 0 ? `${((markupAmount / finalPrice) * 100).toFixed(1)}% of total` : 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Customer Pays</h4>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">{formatCurrency(finalPrice)}</div>
                  <div className="text-sm text-gray-600">
                    Total invoice amount
                  </div>
                  <div className="text-xs text-gray-500">
                    Final quoted price
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
                Room-by-Room Breakdown ({rooms.length} rooms)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room, index) => (
                  <div key={room.id || index} className="p-4 bg-gray-50 rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-3">{room.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dimensions:</span>
                        <span className="font-medium">{room.length}' × {room.width}' × {room.height}'</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Floor Area:</span>
                        <span className="font-medium">{(room.length * room.width).toFixed(1)} sq ft</span>
                      </div>
                      {room.ceiling_area > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ceiling Area:</span>
                          <span className="font-medium">{room.ceiling_area} sq ft</span>
                        </div>
                      )}
                      {room.wall_area > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Wall Area:</span>
                          <span className="font-medium">{room.wall_area} sq ft</span>
                        </div>
                      )}
                      {(room.number_of_doors > 0 || room.number_of_windows > 0) && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Features:</span>
                          <span className="font-medium">
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

        {/* Additional Notes */}
        {(quote.prep_work || quote.special_requests) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quote.prep_work && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Prep Work Required</h4>
                  <p className="text-gray-600">{quote.prep_work}</p>
                </div>
              )}
              {quote.special_requests && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Special Requests</h4>
                  <p className="text-gray-600">{quote.special_requests}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => router.push(`/quotes/${quote.id}/edit`)}
            className="flex items-center justify-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Edit Quote
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.open(`/quotes/${quote.id}/customer`, '_blank')}
            className="flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Customer View
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              const customerUrl = `${window.location.origin}/quotes/${quote.id}/customer`;
              navigator.clipboard.writeText(customerUrl);
              toast({
                title: "Link Copied!",
                description: "Customer quote link copied to clipboard",
              });
            }}
            className="flex items-center justify-center gap-2"
          >
            <Share className="w-4 h-4" />
            Share Customer Link
          </Button>
        </div>
      </div>
    </div>
  );
}