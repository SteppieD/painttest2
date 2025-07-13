"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calculator, FileText, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Edit3, Eye, Save, Copy, MessageSquare, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  breakdown: {
    labor: number;
    materials: number;
    prepWork: number;
    markup: number;
    paint?: number;
    sundries?: number;
  };
  timeline: string;
  created_at: string;
  paint_cost?: number;
  sundries_cost?: number;
  sundries_percentage?: number;
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
  company_name?: string;
  company_phone?: string;
  company_email?: string;
  line_items?: LineItem[];
  project_id?: string;
}

interface LineItem {
  description: string;
  quantity: number;
  unit: string;
  cost: number;
  price: number;
  total: number;
}

export default function QuoteReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [markupPercentage, setMarkupPercentage] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadQuote();
  }, [params.id]);

  const loadQuote = async () => {
    try {
      const response = await fetch(`/api/quotes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setQuote(data);
        
        // Calculate current markup percentage
        if (data.breakdown && data.breakdown.markup && data.total_cost) {
          const subtotal = data.total_cost - data.breakdown.markup;
          const markupPct = Math.round((data.breakdown.markup / subtotal) * 100);
          setMarkupPercentage(markupPct);
        }
      }
    } catch (error) {
      console.error('Error loading quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSubtotal = () => {
    if (!quote || !quote.breakdown) return 0;
    return (quote.breakdown.labor || 0) + 
           (quote.breakdown.materials || 0) + 
           (quote.breakdown.prepWork || 0) +
           (quote.paint_cost || quote.breakdown.paint || 0) +
           (quote.sundries_cost || quote.breakdown.sundries || 0);
  };

  const calculateMarkupAmount = () => {
    const subtotal = calculateSubtotal();
    return subtotal * (markupPercentage / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateMarkupAmount();
  };

  const calculateGrossProfit = () => {
    const total = calculateTotal();
    const directCosts = calculateSubtotal();
    return ((total - directCosts) / total) * 100;
  };

  const getMarginHealthColor = () => {
    const grossProfit = calculateGrossProfit();
    if (grossProfit >= 45) return "text-green-600 bg-green-50 border-green-200";
    if (grossProfit >= 25) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getMarginHealthIcon = () => {
    const grossProfit = calculateGrossProfit();
    if (grossProfit >= 45) return <CheckCircle />;
    if (grossProfit >= 25) return <AlertTriangle />;
    return <AlertTriangle />;
  };

  const getMarginHealthLabel = () => {
    const grossProfit = calculateGrossProfit();
    if (grossProfit >= 45) return "Excellent";
    if (grossProfit >= 25) return "Acceptable";
    return "Risky";
  };

  const calculateCostPercentage = (cost: number) => {
    const total = calculateTotal();
    return total > 0 ? (cost / total) * 100 : 0;
  };

  const updateMarkup = async (newPercentage: number) => {
    setMarkupPercentage(newPercentage);
    
    if (quote && quote.breakdown) {
      const subtotal = calculateSubtotal();
      const newMarkup = subtotal * (newPercentage / 100);
      const newTotal = subtotal + newMarkup;

      try {
        await fetch(`/api/quotes/${params.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            markup_percentage: newPercentage,
            total_cost: newTotal
          })
        });
      } catch (error) {
        console.error('Error updating markup:', error);
      }
    }
  };

  const saveQuote = async () => {
    setIsSaving(true);
    try {
      const total = calculateTotal();
      const markupAmount = calculateMarkupAmount();
      
      await fetch(`/api/quotes/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markup_percentage: markupPercentage,
          total_cost: total,
          final_price: total
        })
      });

      toast({
        title: "Quote Updated!",
        description: "Changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatValidityDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div>
        <div></div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div>
        <div>
          <p>Quote not found</p>
          <Button onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const laborPercentage = calculateCostPercentage(quote.breakdown?.labor || 0);
  const materialsPercentage = calculateCostPercentage((quote.breakdown?.materials || 0) + (quote.paint_cost || 0) + (quote.sundries_cost || 0));
  const grossProfit = calculateGrossProfit();

  return (
    <div>
      {/* Header */}
      <header>
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
                <h1>Internal Quote Review</h1>
                <p>Quote #{quote.quote_id}</p>
              </div>
            </div>
            
            <div>
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
                <Copy />
                Copy Customer Link
              </Button>
              
              <Button
                onClick={() => router.push(`/quotes/${quote.id}/customer`)}
               
              >
                <Eye />
                View Customer Quote
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div>
        {/* Project Overview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                <FileText />
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <Label>Client Details</Label>
                  <p>{quote.customer_name}</p>
                  <p>{quote.address}</p>
                  {quote.customer_phone && <p>📞 {quote.customer_phone}</p>}
                  {quote.customer_email && <p>✉️ {quote.customer_email}</p>}
                  <p>
                    Quote Date: {new Date(quote.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label>Scope Summary</Label>
                  <p>{quote.project_type} Painting</p>
                  <p>{quote.sqft?.toLocaleString()} sq ft total</p>
                  {quote.walls_sqft && <p>• Walls: {quote.walls_sqft.toLocaleString()} sqft</p>}
                  {quote.ceilings_sqft && <p>• Ceilings: {quote.ceilings_sqft.toLocaleString()} sqft</p>}
                  {quote.trim_sqft && <p>• Trim: {quote.trim_sqft.toLocaleString()} sqft</p>}
                  <p>{quote.paint_quality} paint quality</p>
                  <p>Timeline: {quote.timeline || 'Standard'}</p>
                  {quote.prep_work && <p>Prep: {quote.prep_work}</p>}
                </div>
              </div>
              {quote.special_requests && (
                <div>
                  <Label>Special Requests</Label>
                  <p>{quote.special_requests}</p>
                </div>
              )}
              
              <div>
                <div>
                  <div></div>
                  <span>Quote Stage: Active</span>
                </div>
                <div>
                  Valid until: {formatValidityDate(quote.created_at)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Margin Health Indicator */}
          <Card>
            <CardHeader>
              <CardTitle>
                <TrendingUp />
                Margin Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <div>
                    {getMarginHealthIcon()}
                    <span>{getMarginHealthLabel()}</span>
                  </div>
                  <span>{grossProfit.toFixed(1)}%</span>
                </div>
                <Progress value={Math.min(grossProfit, 100)} />
                <p>
                  Target: 45%+ gross profit
                </p>
              </div>
              
              <div>
                <div>
                  <span>Industry Benchmark:</span>
                  <span>45%+ excellent</span>
                </div>
                <div>
                  <span>Net Profit Target:</span>
                  <span>12-15%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cost Breakdown Analysis */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                <Calculator />
                Cost Breakdown Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div>
                  <div>
                    <span>Labour Costs</span>
                    <Badge variant={laborPercentage > 40 ? "destructive" : "secondary"}>
                      {laborPercentage.toFixed(1)}% {laborPercentage > 40 ? "(Over Target)" : "(Good)"}
                    </Badge>
                  </div>
                  <span>${(quote.breakdown?.labor || 0).toLocaleString()}</span>
                </div>
                
                <div>
                  <div>
                    <span>Paint Costs</span>
                  </div>
                  <span>${(quote.paint_cost || quote.breakdown?.paint || 0).toLocaleString()}</span>
                </div>
                
                <div>
                  <span>Sundries & Materials</span>
                  <span>${((quote.sundries_cost || 0) + (quote.breakdown?.materials || 0)).toLocaleString()}</span>
                </div>
                
                <div>
                  <span>Prep Work</span>
                  <span>${(quote.breakdown?.prepWork || 0).toLocaleString()}</span>
                </div>
                
                <div>
                  <div>
                    <span>Subtotal (Direct Costs)</span>
                    <span>${calculateSubtotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <p>Industry Targets:</p>
                <p>• Labour: Maximum 40% of total</p>
                <p>• Materials: Maximum 15% of total</p>
                <p>• Target gross profit: 45%+</p>
              </div>
            </CardContent>
          </Card>

          {/* Smart Margin Management */}
          <Card>
            <CardHeader>
              <CardTitle>
                <DollarSign />
                Smart Margin Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="markup">
                  Markup Percentage
                </Label>
                <div>
                  <Input
                    id="markup"
                    type="number"
                    min="0"
                    max="100"
                    value={markupPercentage}
                    onChange={(e) => updateMarkup(Number(e.target.value))}
                   
                  />
                  <span>%</span>
                </div>
              </div>
              
              <div>
                <div>
                  <span>Markup Amount:</span>
                  <span>${calculateMarkupAmount().toLocaleString()}</span>
                </div>
                <div>
                  <span>Gross Profit:</span>
                  <span>${calculateMarkupAmount().toLocaleString()}</span>
                </div>
                <div>
                  <span>Total Quote:</span>
                  <span>${calculateTotal().toLocaleString()}</span>
                </div>
              </div>
              
              <div>
                <Button
                  onClick={saveQuote}
                  disabled={isSaving}
                 
                >
                  <Save />
                  {isSaving ? 'Saving...' : 'Save & Update Quote'}
                </Button>
                
                <Button
                  onClick={() => {
                    // Navigate to chat with the project ID if available
                    const chatUrl = quote.project_id 
                      ? `/assistant?projectId=${quote.project_id}`
                      : '/assistant';
                    router.push(chatUrl);
                  }}
                  variant="outline"
                 
                >
                  <MessageSquare />
                  Back to Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Line Items */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Package />
              Detailed Line Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Cost</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Paint Line Items */}
                  {quote.walls_sqft && quote.walls_sqft > 0 && (
                    <tr>
                      <td>Wall Painting - {quote.paint_quality} Quality</td>
                      <td>{quote.walls_sqft?.toLocaleString()}</td>
                      <td>sqft</td>
                      <td>
                        ${((quote.paint_cost || 0) * 0.6 / (quote.walls_sqft || 1)).toFixed(2)}
                      </td>
                      <td>
                        ${((quote.paint_cost || 0) * 0.6 / (quote.walls_sqft || 1) * (1 + markupPercentage / 100)).toFixed(2)}
                      </td>
                      <td>
                        ${((quote.paint_cost || 0) * 0.6 * (1 + markupPercentage / 100)).toFixed(0)}
                      </td>
                    </tr>
                  )}
                  
                  {quote.ceilings_sqft && quote.ceilings_sqft > 0 && (
                    <tr>
                      <td>Ceiling Painting - {quote.paint_quality} Quality</td>
                      <td>{quote.ceilings_sqft?.toLocaleString()}</td>
                      <td>sqft</td>
                      <td>
                        ${((quote.paint_cost || 0) * 0.3 / (quote.ceilings_sqft || 1)).toFixed(2)}
                      </td>
                      <td>
                        ${((quote.paint_cost || 0) * 0.3 / (quote.ceilings_sqft || 1) * (1 + markupPercentage / 100)).toFixed(2)}
                      </td>
                      <td>
                        ${((quote.paint_cost || 0) * 0.3 * (1 + markupPercentage / 100)).toFixed(0)}
                      </td>
                    </tr>
                  )}
                  
                  {quote.trim_sqft && quote.trim_sqft > 0 && (
                    <tr>
                      <td>Trim & Detail Work</td>
                      <td>{quote.trim_sqft?.toLocaleString()}</td>
                      <td>linear ft</td>
                      <td>
                        ${((quote.paint_cost || 0) * 0.1 / (quote.trim_sqft || 1)).toFixed(2)}
                      </td>
                      <td>
                        ${((quote.paint_cost || 0) * 0.1 / (quote.trim_sqft || 1) * (1 + markupPercentage / 100)).toFixed(2)}
                      </td>
                      <td>
                        ${((quote.paint_cost || 0) * 0.1 * (1 + markupPercentage / 100)).toFixed(0)}
                      </td>
                    </tr>
                  )}
                  
                  {/* Labor Line Item */}
                  <tr>
                    <td>Professional Labor</td>
                    <td>{Math.ceil((quote.sqft || 0) / 400)}</td>
                    <td>days</td>
                    <td>
                      ${((quote.breakdown?.labor || 0) / Math.ceil((quote.sqft || 1) / 400)).toFixed(0)}
                    </td>
                    <td>
                      ${((quote.breakdown?.labor || 0) / Math.ceil((quote.sqft || 1) / 400) * (1 + markupPercentage / 100)).toFixed(0)}
                    </td>
                    <td>
                      ${((quote.breakdown?.labor || 0) * (1 + markupPercentage / 100)).toFixed(0)}
                    </td>
                  </tr>
                  
                  {/* Materials & Sundries */}
                  <tr>
                    <td>Materials & Sundries</td>
                    <td>1</td>
                    <td>lot</td>
                    <td>
                      ${((quote.sundries_cost || 0) + (quote.breakdown?.materials || 0)).toFixed(0)}
                    </td>
                    <td>
                      ${(((quote.sundries_cost || 0) + (quote.breakdown?.materials || 0)) * (1 + markupPercentage / 100)).toFixed(0)}
                    </td>
                    <td>
                      ${(((quote.sundries_cost || 0) + (quote.breakdown?.materials || 0)) * (1 + markupPercentage / 100)).toFixed(0)}
                    </td>
                  </tr>
                  
                  {/* Prep Work if exists */}
                  {quote.breakdown?.prepWork > 0 && (
                    <tr>
                      <td>Surface Preparation</td>
                      <td>1</td>
                      <td>job</td>
                      <td>
                        ${(quote.breakdown.prepWork).toFixed(0)}
                      </td>
                      <td>
                        ${(quote.breakdown.prepWork * (1 + markupPercentage / 100)).toFixed(0)}
                      </td>
                      <td>
                        ${(quote.breakdown.prepWork * (1 + markupPercentage / 100)).toFixed(0)}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3}>Subtotal</td>
                    <td>
                      ${calculateSubtotal().toFixed(0)}
                    </td>
                    <td colSpan={2}>
                      ${(calculateSubtotal() * (1 + markupPercentage / 100)).toFixed(0)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3}>Markup ({markupPercentage}%)</td>
                    <td>-</td>
                    <td colSpan={2}>
                      ${calculateMarkupAmount().toFixed(0)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3}>Total Quote</td>
                    <td></td>
                    <td colSpan={2}>
                      ${calculateTotal().toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div>
              <p>
                <strong>Note:</strong> This breakdown shows your internal costs vs. customer prices. 
                The markup of {markupPercentage}% covers overhead, profit, and business growth.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}