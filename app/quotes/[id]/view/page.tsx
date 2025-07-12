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
    <div>
      <div>
        {/* Professional Quote Display */}
        <div>
          {/* Header */}
          <div>
            <div>
              <h1>Painting Estimate</h1>
              <p>{quote.company_name}</p>
              <div>
                <div>${quote.quote_amount.toLocaleString()}</div>
                <Badge variant="secondary">
                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            {/* Customer & Project Info */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <MapPin />
                    Project Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <div>
                      <label>Customer</label>
                      <p>{quote.customer_name}</p>
                    </div>
                    <div>
                      <label>Property Address</label>
                      <p>{quote.address}</p>
                    </div>
                    <div>
                      <label>Project Type</label>
                      <p>{quote.project_type} Painting</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                      <label>Quote Number</label>
                      <p>{quote.quote_id}</p>
                    </div>
                    <div>
                      <label>Date Prepared</label>
                      <p>
                        {new Date(quote.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <label>Valid Until</label>
                      <p>
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
              <Card>
                <CardHeader>
                  <CardTitle>
                    <DollarSign />
                    Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    {quoteDetails.materials && (
                      <div>
                        <div>
                          <span>Materials & Paint</span>
                          <p>Premium quality paints and supplies</p>
                        </div>
                        <span>${quoteDetails.materials.total_material_cost?.toLocaleString() || '0'}</span>
                      </div>
                    )}
                    {quoteDetails.labor && (
                      <div>
                        <div>
                          <span>Professional Labor</span>
                          <p>Skilled painting and preparation work</p>
                        </div>
                        <span>${quoteDetails.labor.total_labor?.toLocaleString() || '0'}</span>
                      </div>
                    )}
                    {quoteDetails.markup_amount > 0 && (
                      <div>
                        <div>
                          <span>Business Operations</span>
                          <p>Insurance, overhead, and project management</p>
                        </div>
                        <span>${quoteDetails.markup_amount?.toLocaleString() || '0'}</span>
                      </div>
                    )}
                    
                    <div>
                      <span>Total Project Investment</span>
                      <span>${quote.quote_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* What's Included */}
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
                      Premium quality paints and materials
                    </div>
                    <div>
                      <CheckCircle />
                      Professional surface preparation
                    </div>
                    <div>
                      <CheckCircle />
                      Complete cleanup after work
                    </div>
                  </div>
                  <div>
                    <div>
                      <CheckCircle />
                      2-year workmanship warranty
                    </div>
                    <div>
                      <CheckCircle />
                      Licensed and insured professionals
                    </div>
                    <div>
                      <CheckCircle />
                      Dedicated project manager
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms & Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <FileText />
                  Terms & Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h4>Payment Terms:</h4>
                  <ul>
                    <li>• 50% deposit required to schedule project start</li>
                    <li>• Remaining balance due upon completion</li>
                    <li>• We accept cash, check, and major credit cards</li>
                  </ul>
                  
                  <h4>Project Timeline:</h4>
                  <ul>
                    <li>• Projects typically start within 1-2 weeks of deposit</li>
                    <li>• Most residential projects completed in 2-5 days</li>
                    <li>• Weather conditions may affect exterior work schedule</li>
                  </ul>

                  <div>
                    <p>
                      Ready to get started? Contact {quote.company_name} to schedule your project!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div>
            <div>
              <p>This quote is valid for 30 days from the date of issue.</p>
              <p>Thank you for choosing {quote.company_name} for your painting needs!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}