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
      <div>
        <div>
          <div></div>
          <div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div>
        <div>
          <h1>Quote Not Found</h1>
          <p>The quote you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Company Branding */}
      <header>
        <div>
          <div>
            <div>
              <h1>Professional Painting Quote</h1>
              <p>Elite Painting Services</p>
            </div>
            <div>
              <div>
                <Phone />
                <span>(555) 123-4567</span>
              </div>
              <div>
                <Mail />
                <span>contact@elitepainting.com</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div>
        {/* Quote Header */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Project Quote</CardTitle>
              <Badge variant="secondary">
                Quote #{quote.quote_id}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <h3>Client Information</h3>
                <div>
                  <div>
                    <span>{quote.customer_name}</span>
                  </div>
                  <div>
                    <MapPin />
                    <span>{quote.address}</span>
                  </div>
                  <div>
                    <Calendar />
                    <span>Quote Date: {new Date(quote.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3>Project Details</h3>
                <div>
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
            <CardTitle>
              <FileText />
              Scope of Work
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p>
                Includes full preparation, premium paint application, and final cleanup:
              </p>
              
              <ul>
                <li>
                  <CheckCircle />
                  <span>{quote.rooms?.[0]?.name || "Interior Space"} – {quote.rooms?.[0]?.wall_sqft || 0} sq ft walls</span>
                </li>
                <li>
                  <CheckCircle />
                  <span>Premium {quote.materials?.wall_paint?.brand || "quality paint"} application</span>
                </li>
                <li>
                  <CheckCircle />
                  <span>Professional surface preparation</span>
                </li>
                <li>
                  <CheckCircle />
                  <span>Complete cleanup and protection of furnishings</span>
                </li>
                <li>
                  <CheckCircle />
                  <span>Quality guarantee and touch-up warranty</span>
                </li>
              </ul>

              {quote.scope_notes && (
                <div>
                  <p>
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
            <div>
              <div>
                <div>
                  <h3>Total Project Cost</h3>
                  <p>All materials, labor, and equipment included</p>
                </div>
                <div>
                  <span>
                    {formatCurrency(quote.total_quote || quote.quote_amount)}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
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
            <div>
              <div>
                <h4>Payment Schedule</h4>
                <ul>
                  <li>50% due at project start</li>
                  <li>50% upon completion</li>
                </ul>
              </div>
              <div>
                <h4>Quote Validity</h4>
                <p>
                  This quote is valid until <strong>{getValidityDate()}</strong>
                </p>
              </div>
            </div>
            
            <div>
              <p>
                We accept cash, check, and all major credit cards. A detailed contract will be provided upon acceptance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div>
          <Button 
            onClick={handleAcceptQuote}
           
          >
            <CheckCircle />
            Accept This Quote
          </Button>
          <Button 
            variant="outline"
            onClick={handleDownloadPDF}
           
          >
            <Download />
            Download PDF
          </Button>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Questions? Get in Touch</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <Phone />
                <h4>Call Us</h4>
                <p>(555) 123-4567</p>
              </div>
              <div>
                <Mail />
                <h4>Email Us</h4>
                <p>contact@elitepainting.com</p>
              </div>
              <div>
                <Send />
                <h4>Schedule Visit</h4>
                <p>Free consultation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div>
          <p>
            <strong>Elite Painting Services</strong> – Licensed, Bonded & Insured
          </p>
          <p>
            Thank you for considering our services for your painting project.
          </p>
        </div>
      </div>
    </div>
  );
}