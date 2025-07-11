"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Send, 
  Download, 
  Copy, 
  Check,
  Mail,
  MessageSquare,
  FileText,
  Calendar,
  MapPin,
  DollarSign,
  Palette,
  Share2
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

export default function QuotePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchQuote() {
      try {
        console.log('Fetching quote for ID:', params.id);
        const response = await fetch(`/api/quotes/${params.id}`);
        console.log('Quote API response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Quote data received:', data);
          setQuote(data);
        } else {
          const errorData = await response.json();
          console.error('Quote API error:', errorData);
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

  const copyQuoteLink = async () => {
    const link = `${window.location.origin}/quotes/${params.id}/view`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendEmail = () => {
    router.push(`/quotes/${params.id}/send?method=email`);
  };

  const sendText = () => {
    router.push(`/quotes/${params.id}/send?method=sms`);
  };

  const downloadPDF = async () => {
    try {
      const response = await fetch(`/api/quotes/${params.id}/pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quote-${quote?.quote_id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  if (loading) {
    return (
      <div>
        <div>
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
          <Card>
            <CardContent>
              <h2>Quote Not Found</h2>
              <p>The quote you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => router.push('/dashboard')}>
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const quoteDetails = typeof quote.quote_details === 'string' 
    ? JSON.parse(quote.quote_details) 
    : quote.quote_details;

  // Helper function to clean customer name
  const cleanCustomerName = (name: string) => {
    if (!name) return 'Customer';
    
    // Handle "It's for [Name]" pattern
    const itsForMatch = name.match(/it'?s\s+for\s+([^.]+)/i);
    if (itsForMatch) {
      return itsForMatch[1].trim();
    }
    
    // Handle "Customer: [Name]" pattern
    const customerMatch = name.match(/customer:\s*([^,]+)/i);
    if (customerMatch) {
      return customerMatch[1].trim();
    }
    
    // Handle "the customer's name is [Name]" or "customers name is [Name]" pattern
    const customerNameIsMatch = name.match(/(?:the\s+)?customers?\s+name\s+is\s+([A-Z][a-z]+)(?:\s+and|$)/i);
    if (customerNameIsMatch) {
      return customerNameIsMatch[1].trim();
    }
    
    // Handle "name is [Name]" pattern
    const nameIsMatch = name.match(/name\s+is\s+([A-Z][a-z]+)/i);
    if (nameIsMatch) {
      return nameIsMatch[1].trim();
    }
    
    // If it looks like raw conversation data, try to extract name
    if (name.length > 50 || name.includes('.') || name.includes('painting')) {
      // Look for name patterns in longer text
      const nameMatch = name.match(/(?:for|customer|client)?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
      if (nameMatch) {
        return nameMatch[1].trim();
      }
    }
    
    return name;
  };

  // Helper function to clean address
  const cleanAddress = (address: string) => {
    if (!address) return 'Address not provided';
    
    // If it's a long conversation string, extract just the address
    if (address.length > 100) {
      // Look for address pattern (numbers + street name)
      const addressMatch = address.match(/(\d+\s+[A-Za-z\s]+(?:Street|Drive|Road|Avenue|Lane|Boulevard|Circle|Court|Place|Way))/i);
      if (addressMatch) {
        return addressMatch[1].trim();
      }
      
      // Look for just numbers + words at the beginning
      const simpleMatch = address.match(/^(\d+\s+[A-Za-z\s]+?)(?:\.|,|We|The|It)/);
      if (simpleMatch) {
        return simpleMatch[1].trim();
      }
    }
    
    return address;
  };

  // Helper function to calculate cost breakdown
  const calculateBreakdown = () => {
    const total = quote.quote_amount || (quote as any).final_price || (quote as any).total_revenue || 0;
    
    // Try to get from quote_details first
    if (quoteDetails?.materials?.total_material_cost || quoteDetails?.labor?.total_labor) {
      return {
        materials: quoteDetails.materials?.total_material_cost || 0,
        labor: quoteDetails.labor?.total_labor || 0,
        markup: quoteDetails.markup_amount || 0
      };
    }
    
    // Try to get from quote fields
    if ((quote as any).total_materials || (quote as any).projected_labor) {
      return {
        materials: (quote as any).total_materials || 0,
        labor: (quote as any).projected_labor || 0,
        markup: total - ((quote as any).total_materials || 0) - ((quote as any).projected_labor || 0)
      };
    }
    
    // Fallback to reasonable estimates
    const materialsPercent = 0.25; // 25% materials
    const laborPercent = 0.65;     // 65% labor
    const markupPercent = 0.10;    // 10% markup
    
    return {
      materials: Math.round(total * materialsPercent),
      labor: Math.round(total * laborPercent),
      markup: Math.round(total * markupPercent)
    };
  };

  // Process quote data
  const processedQuote = {
    ...quote,
    customer_name: cleanCustomerName(quote.customer_name),
    address: cleanAddress(quote.address)
  };

  const breakdown = calculateBreakdown();

  // Helper function to extract project specifications
  const extractProjectSpecs = () => {
    const specs = {
      surfaces: [],
      linearFeet: null,
      area: null,
      paintType: null,
      ceilingHeight: null,
      exclusions: []
    };

    // Try to get from quote_details
    if (quoteDetails?.project_details) {
      const details = quoteDetails.project_details;
      specs.linearFeet = details.linear_feet;
      specs.area = details.wall_area;
      specs.paintType = details.paint_type;
      if (details.surfaces) specs.surfaces = details.surfaces;
      if (details.no_ceilings) specs.exclusions.push('ceilings');
      if (details.no_doors) specs.exclusions.push('doors');
      if (details.no_trim) specs.exclusions.push('trim');
      if (details.no_windows) specs.exclusions.push('windows');
    }

    // Extract from address field if it contains project details
    if (quote.address && quote.address.length > 50) {
      const text = quote.address.toLowerCase();
      
      // Extract linear feet
      const linearMatch = text.match(/(\d+)\s*linear\s*feet/);
      if (linearMatch) specs.linearFeet = parseInt(linearMatch[1]);
      
      // Extract ceiling height
      const heightMatch = text.match(/(\d+)\s*(?:foot|feet|ft)\s*(?:tall|high|ceilings?)/);
      if (heightMatch) specs.ceilingHeight = parseInt(heightMatch[1]);
      
      // Extract paint details
      const paintMatch = text.match(/\$(\d+).*?(eggshell|satin|semi-gloss|gloss|flat).*?(sherwin\s*williams|benjamin\s*moore|behr)/i);
      if (paintMatch) {
        specs.paintType = `${paintMatch[3]} ${paintMatch[2]}`;
      }
      
      // Extract exclusions
      if (text.includes('not painting')) {
        if (text.includes('not painting the ceilings') || text.includes('no ceilings')) {
          specs.exclusions.push('ceilings');
        }
        if (text.includes('not painting doors') || text.includes('no doors')) {
          specs.exclusions.push('doors');
        }
        if (text.includes('not painting') && text.includes('trim')) {
          specs.exclusions.push('trim');
        }
        if (text.includes('not painting') && text.includes('windows')) {
          specs.exclusions.push('windows');
        }
      }
      
      // Default surfaces
      if (specs.surfaces.length === 0) {
        specs.surfaces.push('walls');
      }
    }

    return specs;
  };

  const projectSpecs = extractProjectSpecs();

  return (
    <div>
      {/* Header with Actions */}
      <div>
        <div>
          <div>
            <div>
              <Button 
                variant="ghost" 
                onClick={() => router.push('/dashboard')}
               
              >
                <ArrowLeft />
                Back to Dashboard
              </Button>
              <div>
                <h1>Quote Preview</h1>
                <p>{quote.quote_id}</p>
              </div>
            </div>
            
            <div>
              <Button variant="outline" onClick={copyQuoteLink}>
                {copied ? <Check /> : <Copy />}
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              <Button variant="outline" onClick={downloadPDF}>
                <Download />
                PDF
              </Button>
              <Button variant="outline" onClick={sendText}>
                <MessageSquare />
                Text
              </Button>
              <Button onClick={sendEmail}>
                <Mail />
                Email Quote
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Preview */}
      <div>
        <div>
          {/* Quote Header */}
          <div>
            <div>
              <div>
                <h2>Painting Quote</h2>
                <p>Professional Estimate</p>
              </div>
              <div>
                <div>${(quote.quote_amount || (quote as any).final_price || (quote as any).total_revenue || (quote as any).total_cost || 0).toLocaleString()}</div>
                <Badge variant="secondary">
                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Quote Content */}
          <div>
            <div>
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    <MapPin />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <label>Customer</label>
                      <p>{processedQuote.customer_name}</p>
                    </div>
                    <div>
                      <label>Property Address</label>
                      <p>{processedQuote.address}</p>
                    </div>
                    <div>
                      <label>Project Type</label>
                      <p>{quote.project_type} Painting</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quote Details */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Calendar />
                    Quote Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <label>Quote ID</label>
                      <p>{quote.quote_id}</p>
                    </div>
                    <div>
                      <label>Date Created</label>
                      <p>
                        {new Date(quote.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <label>Contractor</label>
                      <p>{quote.company_name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Specifications */}
            {(projectSpecs.linearFeet || projectSpecs.paintType || projectSpecs.exclusions.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    <FileText />
                    Project Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      {projectSpecs.linearFeet && (
                        <div>
                          <label>Linear Footage</label>
                          <p>{projectSpecs.linearFeet} feet</p>
                        </div>
                      )}
                      {projectSpecs.area && (
                        <div>
                          <label>Total Area</label>
                          <p>{projectSpecs.area.toLocaleString()} sq ft</p>
                        </div>
                      )}
                      {projectSpecs.ceilingHeight && (
                        <div>
                          <label>Ceiling Height</label>
                          <p>{projectSpecs.ceilingHeight} feet</p>
                        </div>
                      )}
                    </div>
                    <div>
                      {projectSpecs.paintType && (
                        <div>
                          <label>Paint Specification</label>
                          <p>{projectSpecs.paintType}</p>
                        </div>
                      )}
                      {projectSpecs.surfaces.length > 0 && (
                        <div>
                          <label>Surfaces Included</label>
                          <p>{projectSpecs.surfaces.join(', ')}</p>
                        </div>
                      )}
                      {projectSpecs.exclusions.length > 0 && (
                        <div>
                          <label>Exclusions</label>
                          <p>No {projectSpecs.exclusions.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Professional Investment Summary */}
            <Card>
                <CardHeader>
                  <CardTitle>
                    <DollarSign />
                    Investment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <span>Materials & Premium Paint</span>
                      <span>${breakdown.materials.toLocaleString()}</span>
                    </div>
                    <div>
                      <span>Professional Labor & Installation</span>
                      <span>${breakdown.labor.toLocaleString()}</span>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <span>Total Investment</span>
                      <span>${(quote.quote_amount || (quote as any).final_price || (quote as any).total_revenue || (quote as any).total_cost || 0).toLocaleString()}</span>
                    </div>
                    
                    <div>
                      <p>✓ All materials, labor, and project management included</p>
                      <p>✓ No hidden fees or surprise costs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

            {/* Professional Guarantee & Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <FileText />
                  Our Guarantee & Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div>
                    <h4>🛡️ Quality Guarantee</h4>
                    <div>
                      <p>• 2-year warranty on all workmanship</p>
                      <p>• Premium quality paints and materials</p>
                      <p>• Professional surface preparation included</p>
                      <p>• Clean-up and protection of your property</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4>💰 Payment Terms</h4>
                    <div>
                      <p>• No payment required until work begins</p>
                      <p>• 50% deposit secures your project start date</p>
                      <p>• Final payment due upon your complete satisfaction</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4>⏰ Important Details</h4>
                    <div>
                      <p>• This investment is valid for 30 days</p>
                      <p>• Scheduling typically within 2-3 weeks</p>
                      <p>• Weather-dependent for exterior projects</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Footer */}
          <div>
            <div>
              <p>
                Questions? Contact {quote.company_name} for more information.
              </p>
              <div>
                <Button variant="outline" onClick={() => router.push(`/quotes/${params.id}/view`)}>
                  <Share2 />
                  View Public Link
                </Button>
                <Button onClick={sendEmail}>
                  <Send />
                  Send to Client
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}