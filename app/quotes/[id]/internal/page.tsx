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
      <div>
        <div>
          <div></div>
          <p>Loading quote details...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div>
        <Card>
          <CardContent>
            <h2>Quote Not Found</h2>
            <p>The quote you're looking for doesn't exist or has been removed.</p>
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
    <div>
      {/* Header */}
      <div>
        <div>
          <div>
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
               
              >
                <ArrowLeft />
              </Button>
              <div>
                <Calculator />
              </div>
              <div>
                <h1>
                  Internal Quote Breakdown
                </h1>
                <p>Quote #{quote.quote_id}</p>
              </div>
            </div>
            
            <div>
              <Button variant="outline" size="sm" onClick={copyQuoteData}>
                <Copy />
                Copy Data
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(`/quotes/${quote.id}/customer`, '_blank')}
              >
                <Eye />
                Customer View
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer />
                Print
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Quote Overview */}
        <div>
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Users />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>{quote.customer_name}</div>
                <div>{quote.address}</div>
              </div>
              {quote.customer_email && (
                <div>
                  <strong>Email:</strong> {quote.customer_email}
                </div>
              )}
              {quote.customer_phone && (
                <div>
                  <strong>Phone:</strong> {quote.customer_phone}
                </div>
              )}
              <div>
                <Badge variant={quote.status === 'accepted' ? 'default' : 'secondary'}>
                  {quote.status || 'Pending'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Home />
                Project Scope
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>{quote.project_type} Painting</div>
                <div>Created: {formatDate(quote.created_at)}</div>
              </div>
              <div>
                {quote.walls_sqft && quote.walls_sqft > 0 && (
                  <div>
                    <span>Walls:</span>
                    <span>{quote.walls_sqft.toLocaleString()} sq ft</span>
                  </div>
                )}
                {quote.ceilings_sqft && quote.ceilings_sqft > 0 && (
                  <div>
                    <span>Ceilings:</span>
                    <span>{quote.ceilings_sqft.toLocaleString()} sq ft</span>
                  </div>
                )}
                {quote.trim_sqft && quote.trim_sqft > 0 && (
                  <div>
                    <span>Trim:</span>
                    <span>{quote.trim_sqft.toLocaleString()} sq ft</span>
                  </div>
                )}
                {quote.number_of_doors && quote.number_of_doors > 0 && (
                  <div>
                    <span>Doors:</span>
                    <span>{quote.number_of_doors}</span>
                  </div>
                )}
                {quote.number_of_windows && quote.number_of_windows > 0 && (
                  <div>
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
              <CardTitle>
                <DollarSign />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <span>Materials:</span>
                  <span>{formatCurrency(materials)}</span>
                </div>
                <div>
                  <span>Labor:</span>
                  <span>{formatCurrency(labor)}</span>
                </div>
                <div>
                  <span>Subtotal:</span>
                  <span>{formatCurrency(materials + labor)}</span>
                </div>
                <div>
                  <span>Markup ({markupPercentage}%):</span>
                  <span>{formatCurrency(markupAmount)}</span>
                </div>
                <Separator />
                <div>
                  <span>Total Quote:</span>
                  <span>{formatCurrency(finalPrice)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Calculator />
              Detailed Cost Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <h4>Materials Cost</h4>
                <div>
                  <div>{formatCurrency(materials)}</div>
                  <div>
                    Paint, primer, supplies
                  </div>
                  <div>
                    {materials > 0 ? `${((materials / finalPrice) * 100).toFixed(1)}% of total` : 'N/A'}
                  </div>
                </div>
              </div>
              
              <div>
                <h4>Labor Cost</h4>
                <div>
                  <div>{formatCurrency(labor)}</div>
                  <div>
                    Prep work, painting, cleanup
                  </div>
                  <div>
                    {labor > 0 ? `${((labor / finalPrice) * 100).toFixed(1)}% of total` : 'N/A'}
                  </div>
                </div>
              </div>
              
              <div>
                <h4>Your Profit</h4>
                <div>
                  <div>{formatCurrency(markupAmount)}</div>
                  <div>
                    {markupPercentage}% markup
                  </div>
                  <div>
                    {markupAmount > 0 ? `${((markupAmount / finalPrice) * 100).toFixed(1)}% of total` : 'N/A'}
                  </div>
                </div>
              </div>
              
              <div>
                <h4>Customer Pays</h4>
                <div>
                  <div>{formatCurrency(finalPrice)}</div>
                  <div>
                    Total invoice amount
                  </div>
                  <div>
                    Final quoted price
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room Breakdown - Only show if rooms exist */}
        {rooms.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                <Home />
                Room-by-Room Breakdown ({rooms.length} rooms)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {rooms.map((room, index) => (
                  <div key={room.id || index}>
                    <h4>{room.name}</h4>
                    <div>
                      <div>
                        <span>Dimensions:</span>
                        <span>{room.length}' × {room.width}' × {room.height}'</span>
                      </div>
                      <div>
                        <span>Floor Area:</span>
                        <span>{(room.length * room.width).toFixed(1)} sq ft</span>
                      </div>
                      {room.ceiling_area > 0 && (
                        <div>
                          <span>Ceiling Area:</span>
                          <span>{room.ceiling_area} sq ft</span>
                        </div>
                      )}
                      {room.wall_area > 0 && (
                        <div>
                          <span>Wall Area:</span>
                          <span>{room.wall_area} sq ft</span>
                        </div>
                      )}
                      {(room.number_of_doors > 0 || room.number_of_windows > 0) && (
                        <div>
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

        {/* Additional Notes */}
        {(quote.prep_work || quote.special_requests) && (
          <Card>
            <CardHeader>
              <CardTitle>
                <FileText />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quote.prep_work && (
                <div>
                  <h4>Prep Work Required</h4>
                  <p>{quote.prep_work}</p>
                </div>
              )}
              {quote.special_requests && (
                <div>
                  <h4>Special Requests</h4>
                  <p>{quote.special_requests}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div>
          <Button
            onClick={() => router.push(`/quotes/${quote.id}/edit`)}
           
          >
            <Edit3 />
            Edit Quote
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.open(`/quotes/${quote.id}/customer`, '_blank')}
           
          >
            <Eye />
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
           
          >
            <Share />
            Share Customer Link
          </Button>
        </div>
      </div>
    </div>
  );
}