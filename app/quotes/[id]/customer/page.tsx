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
import { QuotePaymentLink } from "@/components/stripe/quote-payment-link";

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
  payment_link?: string;
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
      <div>
        <div>
          <div></div>
          <p>Loading your quote...</p>
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
                onClick={() => router.push(`/quotes/${params.id}`)}
               
              >
                <ArrowLeft />
              </Button>
              <div>
                <Palette />
              </div>
              <div>
                <h1>
                  {quote.company_name || "Professional Painting"}
                </h1>
                <p>Licensed & Insured</p>
              </div>
            </div>
            
            <div>
              <Button variant="outline" size="sm" onClick={shareQuote}>
                <Copy />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(`/api/quotes/${params.id}/pdf`, '_blank')}
              >
                <Download />
                PDF
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
        {/* Quote Header */}
        <Card>
          <CardHeader>
            <div>
              <div>
                <CardTitle>
                  Professional Painting Quote
                </CardTitle>
                <div>
                  <span>Quote #{quote.quote_id}</span>
                  <span>•</span>
                  <span>{formatDate(quote.created_at)}</span>
                </div>
              </div>
              <div>
                <div>{formatCurrency(finalPrice)}</div>
                <div>Total Investment</div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div>
              {/* Customer Details */}
              <div>
                <h3>
                  <Home />
                  Project Details
                </h3>
                <div>
                  <div>
                    <MapPin />
                    <div>
                      <div>{quote.customer_name}</div>
                      <div>{quote.address}</div>
                    </div>
                  </div>
                  <div>
                    <Palette />
                    <span>{quote.project_type} Painting</span>
                  </div>
                  <div>
                    <Home />
                    <span>Total: {quote.sqft ? `${quote.sqft.toLocaleString()} sq ft` : 'Custom project'}</span>
                  </div>
                  {(quote.walls_sqft || 0) > 0 && (
                    <div>
                      <div />
                      <span>Walls: {(quote.walls_sqft || 0).toLocaleString()} sq ft</span>
                    </div>
                  )}
                  {(quote.ceilings_sqft || 0) > 0 && (
                    <div>
                      <div />
                      <span>Ceilings: {(quote.ceilings_sqft || 0).toLocaleString()} sq ft</span>
                    </div>
                  )}
                  {(quote.trim_sqft || 0) > 0 && (
                    <div>
                      <div />
                      <span>Trim: {(quote.trim_sqft || 0).toLocaleString()} sq ft</span>
                    </div>
                  )}
                  {(quote.number_of_doors || quote.number_of_windows) && (
                    <div>
                      <div />
                      <span>
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
                <h3>
                  <Clock />
                  Timeline & Quality
                </h3>
                <div>
                  <div>
                    <span>Paint Quality:</span>
                    <Badge variant="secondary">
                      {quote.paint_quality || 'Premium'} Grade
                    </Badge>
                  </div>
                  <div>
                    <span>Timeline:</span>
                    <span>{quote.timeline || '3-5 business days'}</span>
                  </div>
                  <div>
                    <span>Valid Until:</span>
                    <span>{getValidityDate(quote.created_at)}</span>
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
                Room Breakdown ({rooms.length} rooms)
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

        {/* Services Included */}
        <Card>
          <CardHeader>
            <CardTitle>
              <CheckCircle />
              What's Included
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <div>
                  <CheckCircle />
                  <div>
                    <div>Complete Surface Preparation</div>
                    <div>Cleaning, sanding, and priming as needed</div>
                  </div>
                </div>
                <div>
                  <CheckCircle />
                  <div>
                    <div>Premium Paint & Materials</div>
                    <div>High-quality paints with excellent coverage</div>
                  </div>
                </div>
                <div>
                  <CheckCircle />
                  <div>
                    <div>Professional Application</div>
                    <div>Expert techniques for flawless finish</div>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <CheckCircle />
                  <div>
                    <div>Daily Cleanup & Protection</div>
                    <div>Your property protected throughout</div>
                  </div>
                </div>
                <div>
                  <CheckCircle />
                  <div>
                    <div>Final Walkthrough</div>
                    <div>Ensure your complete satisfaction</div>
                  </div>
                </div>
                <div>
                  <CheckCircle />
                  <div>
                    <div>Complete Post-Project Cleanup</div>
                    <div>Leave your space spotless</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guarantees */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Shield />
              Our Guarantee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <Award />
                <div>1-Year Warranty</div>
                <div>Workmanship guarantee</div>
              </div>
              <div>
                <Shield />
                <div>Licensed & Insured</div>
                <div>Full protection coverage</div>
              </div>
              <div>
                <Star />
                <div>Satisfaction Promise</div>
                <div>We make it right</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Terms - Only show if configured for this quote */}
        {quote.payment_terms && (
          <Card>
            <CardHeader>
              <CardTitle>
                <DollarSign />
                Payment Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  {quote.payment_terms.terms}
                </div>
                {quote.payment_terms.schedule && (
                  <div>
                    <strong>Payment Schedule:</strong> {quote.payment_terms.schedule}
                  </div>
                )}
                <div>
                  We accept cash, check, and all major credit cards
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Option */}
        {!isAccepted && quote && (
          <div>
            <QuotePaymentLink 
              quoteId={parseInt(quote.id)}
              amount={quote.total_cost || quote.final_price || 0}
              existingLink={quote.payment_link}
            />
          </div>
        )}

        {/* Accept Quote */}
        {!isAccepted ? (
          <Card>
            <CardHeader>
              <CardTitle>
                <PenTool />
                Ready to Get Started?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Transform your space with professional painting. Enter your name below to accept this quote and we'll contact you within 24 hours to schedule your project.
              </p>
              
              <div>
                <div>
                  <label>
                    Digital Signature (Type your full name)
                  </label>
                  <Input
                    value={clientSignature}
                    onChange={(e) => setClientSignature(e.target.value)}
                    placeholder="Type your full name here"
                   
                  />
                </div>
                
                <Button 
                  onClick={handleAcceptQuote}
                  disabled={!clientSignature.trim() || isSubmitting}
                 
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle />
                      Accept Quote & Get Started
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <CheckCircle />
              <h3>Quote Accepted!</h3>
              <p>
                Thank you for choosing us for your painting project. We'll contact you within 24 hours to schedule your project start date.
              </p>
              <div>
                Signed by: {clientSignature}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Footer */}
        <div>
          <h3>Questions? Ready to Schedule?</h3>
          <div>
            <div>
              <Phone />
              <a href={`tel:${quote.company_phone || '(555) 123-4567'}`}>
                {quote.company_phone || '(555) 123-4567'}
              </a>
            </div>
            <div>
              <Mail />
              <a href={`mailto:${quote.company_email || 'contact@paintingcompany.com'}`}>
                {quote.company_email || 'contact@paintingcompany.com'}
              </a>
            </div>
          </div>
          <p>
            Thank you for choosing {quote.company_name || "us"} for your painting project!
          </p>
        </div>
      </div>
    </div>
  );
}