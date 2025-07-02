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
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
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
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Quote Not Found</h2>
              <p className="text-gray-600 mb-4">The quote you're looking for doesn't exist or has been removed.</p>
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
    const total = quote.quote_amount || quote.final_price || quote.total_revenue || 0;
    
    // Try to get from quote_details first
    if (quoteDetails?.materials?.total_material_cost || quoteDetails?.labor?.total_labor) {
      return {
        materials: quoteDetails.materials?.total_material_cost || 0,
        labor: quoteDetails.labor?.total_labor || 0,
        markup: quoteDetails.markup_amount || 0
      };
    }
    
    // Try to get from quote fields
    if (quote.total_materials || quote.projected_labor) {
      return {
        materials: quote.total_materials || 0,
        labor: quote.projected_labor || 0,
        markup: total - (quote.total_materials || 0) - (quote.projected_labor || 0)
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
    <div className="min-h-screen bg-gray-50">
      {/* Header with Actions */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/dashboard')}
                className="text-gray-600"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Quote Preview</h1>
                <p className="text-sm text-gray-600">{quote.quote_id}</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={copyQuoteLink}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              <Button variant="outline" onClick={downloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" onClick={sendText}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Text
              </Button>
              <Button onClick={sendEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Email Quote
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Preview */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Quote Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">Painting Quote</h2>
                <p className="text-blue-100">Professional Estimate</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">${(quote.quote_amount || quote.final_price || quote.total_revenue || quote.total_cost || 0).toLocaleString()}</div>
                <Badge variant="secondary" className="mt-2">
                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Quote Content */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Customer</label>
                      <p className="text-gray-900">{processedQuote.customer_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Property Address</label>
                      <p className="text-gray-900">{processedQuote.address}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Project Type</label>
                      <p className="text-gray-900 capitalize">{quote.project_type} Painting</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quote Details */}
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
                      <label className="text-sm font-medium text-gray-600">Quote ID</label>
                      <p className="text-gray-900 font-mono">{quote.quote_id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date Created</label>
                      <p className="text-gray-900">
                        {new Date(quote.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Contractor</label>
                      <p className="text-gray-900">{quote.company_name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Specifications */}
            {(projectSpecs.linearFeet || projectSpecs.paintType || projectSpecs.exclusions.length > 0) && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Project Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      {projectSpecs.linearFeet && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Linear Footage</label>
                          <p className="text-gray-900">{projectSpecs.linearFeet} feet</p>
                        </div>
                      )}
                      {projectSpecs.area && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Total Area</label>
                          <p className="text-gray-900">{projectSpecs.area.toLocaleString()} sq ft</p>
                        </div>
                      )}
                      {projectSpecs.ceilingHeight && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Ceiling Height</label>
                          <p className="text-gray-900">{projectSpecs.ceilingHeight} feet</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {projectSpecs.paintType && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Paint Specification</label>
                          <p className="text-gray-900">{projectSpecs.paintType}</p>
                        </div>
                      )}
                      {projectSpecs.surfaces.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Surfaces Included</label>
                          <p className="text-gray-900 capitalize">{projectSpecs.surfaces.join(', ')}</p>
                        </div>
                      )}
                      {projectSpecs.exclusions.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Exclusions</label>
                          <p className="text-gray-900 capitalize">No {projectSpecs.exclusions.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Professional Investment Summary */}
            <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                    Investment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Materials & Premium Paint</span>
                      <span className="font-semibold">${breakdown.materials.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Professional Labor & Installation</span>
                      <span className="font-semibold">${breakdown.labor.toLocaleString()}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center py-3 text-xl font-bold bg-blue-50 px-4 rounded-lg">
                      <span className="text-blue-900">Total Investment</span>
                      <span className="text-blue-600">${(quote.quote_amount || quote.final_price || quote.total_revenue || quote.total_cost || 0).toLocaleString()}</span>
                    </div>
                    
                    <div className="text-sm text-gray-600 text-center mt-3">
                      <p>✓ All materials, labor, and project management included</p>
                      <p>✓ No hidden fees or surprise costs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

            {/* Professional Guarantee & Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Our Guarantee & Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">🛡️ Quality Guarantee</h4>
                    <div className="text-sm text-gray-600 space-y-1 ml-4">
                      <p>• 2-year warranty on all workmanship</p>
                      <p>• Premium quality paints and materials</p>
                      <p>• Professional surface preparation included</p>
                      <p>• Clean-up and protection of your property</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">💰 Payment Terms</h4>
                    <div className="text-sm text-gray-600 space-y-1 ml-4">
                      <p>• No payment required until work begins</p>
                      <p>• 50% deposit secures your project start date</p>
                      <p>• Final payment due upon your complete satisfaction</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">⏰ Important Details</h4>
                    <div className="text-sm text-gray-600 space-y-1 ml-4">
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
          <div className="bg-gray-50 px-6 py-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Questions? Contact {quote.company_name} for more information.
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => router.push(`/quotes/${params.id}/view`)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  View Public Link
                </Button>
                <Button onClick={sendEmail}>
                  <Send className="h-4 w-4 mr-2" />
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