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
    if (grossProfit >= 45) return <CheckCircle className="w-4 h-4" />;
    if (grossProfit >= 25) return <AlertTriangle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Quote not found</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Internal Quote Review</h1>
                <p className="text-sm text-gray-500">Quote #{quote.quote_id}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
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
                <Copy className="w-4 h-4 mr-2" />
                Copy Customer Link
              </Button>
              
              <Button
                onClick={() => router.push(`/quotes/${quote.id}/customer`)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Customer Quote
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Project Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Client Details</Label>
                  <p className="font-medium">{quote.customer_name}</p>
                  <p className="text-sm text-gray-600">{quote.address}</p>
                  {quote.customer_phone && <p className="text-sm text-gray-600">📞 {quote.customer_phone}</p>}
                  {quote.customer_email && <p className="text-sm text-gray-600">✉️ {quote.customer_email}</p>}
                  <p className="text-sm text-gray-500 mt-1">
                    Quote Date: {new Date(quote.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Scope Summary</Label>
                  <p className="font-medium capitalize">{quote.project_type} Painting</p>
                  <p className="text-sm text-gray-600">{quote.sqft?.toLocaleString()} sq ft total</p>
                  {quote.walls_sqft && <p className="text-sm text-gray-600">• Walls: {quote.walls_sqft.toLocaleString()} sqft</p>}
                  {quote.ceilings_sqft && <p className="text-sm text-gray-600">• Ceilings: {quote.ceilings_sqft.toLocaleString()} sqft</p>}
                  {quote.trim_sqft && <p className="text-sm text-gray-600">• Trim: {quote.trim_sqft.toLocaleString()} sqft</p>}
                  <p className="text-sm text-gray-600">{quote.paint_quality} paint quality</p>
                  <p className="text-sm text-gray-600">Timeline: {quote.timeline || 'Standard'}</p>
                  {quote.prep_work && <p className="text-sm text-gray-600">Prep: {quote.prep_work}</p>}
                </div>
              </div>
              {quote.special_requests && (
                <div className="mt-4 pt-4 border-t">
                  <Label className="text-sm font-medium text-gray-600">Special Requests</Label>
                  <p className="text-sm text-gray-700 mt-1">{quote.special_requests}</p>
                </div>
              )}
              
              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Quote Stage: Active</span>
                </div>
                <div className="text-sm text-gray-600">
                  Valid until: {formatValidityDate(quote.created_at)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Margin Health Indicator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Margin Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg border ${getMarginHealthColor()}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getMarginHealthIcon()}
                    <span className="font-semibold">{getMarginHealthLabel()}</span>
                  </div>
                  <span className="text-2xl font-bold">{grossProfit.toFixed(1)}%</span>
                </div>
                <Progress value={Math.min(grossProfit, 100)} className="mb-2" />
                <p className="text-sm">
                  Target: 45%+ gross profit
                </p>
              </div>
              
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Industry Benchmark:</span>
                  <span className="font-medium">45%+ excellent</span>
                </div>
                <div className="flex justify-between">
                  <span>Net Profit Target:</span>
                  <span className="font-medium">12-15%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cost Breakdown Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                Cost Breakdown Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Labour Costs</span>
                    <Badge variant={laborPercentage > 40 ? "destructive" : "secondary"} className="text-xs">
                      {laborPercentage.toFixed(1)}% {laborPercentage > 40 ? "(Over Target)" : "(Good)"}
                    </Badge>
                  </div>
                  <span className="font-medium">${(quote.breakdown?.labor || 0).toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Paint Costs</span>
                  </div>
                  <span className="font-medium">${(quote.paint_cost || quote.breakdown?.paint || 0).toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Sundries & Materials</span>
                  <span className="font-medium">${((quote.sundries_cost || 0) + (quote.breakdown?.materials || 0)).toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Prep Work</span>
                  <span className="font-medium">${(quote.breakdown?.prepWork || 0).toLocaleString()}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Subtotal (Direct Costs)</span>
                    <span className="font-medium">${calculateSubtotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                <p className="font-medium mb-1">Industry Targets:</p>
                <p>• Labour: Maximum 40% of total</p>
                <p>• Materials: Maximum 15% of total</p>
                <p>• Target gross profit: 45%+</p>
              </div>
            </CardContent>
          </Card>

          {/* Smart Margin Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Smart Margin Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="markup" className="text-sm font-medium">
                  Markup Percentage
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="markup"
                    type="number"
                    min="0"
                    max="100"
                    value={markupPercentage}
                    onChange={(e) => updateMarkup(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600">%</span>
                </div>
              </div>
              
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Markup Amount:</span>
                  <span className="font-medium">${calculateMarkupAmount().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross Profit:</span>
                  <span className="font-medium">${calculateMarkupAmount().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total Quote:</span>
                  <span className="text-blue-600">${calculateTotal().toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={saveQuote}
                  disabled={isSaving}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save & Update Quote'}
                </Button>
                
                <Button
                  onClick={() => {
                    // Navigate to create quote page
                    router.push('/create-quote');
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Create New Quote
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Line Items */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Detailed Line Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Qty</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Unit</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Cost</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Price</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Paint Line Items */}
                  {quote.walls_sqft && quote.walls_sqft > 0 && (
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">Wall Painting - {quote.paint_quality} Quality</td>
                      <td className="text-center py-3 px-4">{quote.walls_sqft?.toLocaleString()}</td>
                      <td className="text-center py-3 px-4">sqft</td>
                      <td className="text-right py-3 px-4 text-gray-600">
                        ${((quote.paint_cost || 0) * 0.6 / (quote.walls_sqft || 1)).toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        ${((quote.paint_cost || 0) * 0.6 / (quote.walls_sqft || 1) * (1 + markupPercentage / 100)).toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        ${((quote.paint_cost || 0) * 0.6 * (1 + markupPercentage / 100)).toFixed(0)}
                      </td>
                    </tr>
                  )}
                  
                  {quote.ceilings_sqft && quote.ceilings_sqft > 0 && (
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">Ceiling Painting - {quote.paint_quality} Quality</td>
                      <td className="text-center py-3 px-4">{quote.ceilings_sqft?.toLocaleString()}</td>
                      <td className="text-center py-3 px-4">sqft</td>
                      <td className="text-right py-3 px-4 text-gray-600">
                        ${((quote.paint_cost || 0) * 0.3 / (quote.ceilings_sqft || 1)).toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        ${((quote.paint_cost || 0) * 0.3 / (quote.ceilings_sqft || 1) * (1 + markupPercentage / 100)).toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        ${((quote.paint_cost || 0) * 0.3 * (1 + markupPercentage / 100)).toFixed(0)}
                      </td>
                    </tr>
                  )}
                  
                  {quote.trim_sqft && quote.trim_sqft > 0 && (
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">Trim & Detail Work</td>
                      <td className="text-center py-3 px-4">{quote.trim_sqft?.toLocaleString()}</td>
                      <td className="text-center py-3 px-4">linear ft</td>
                      <td className="text-right py-3 px-4 text-gray-600">
                        ${((quote.paint_cost || 0) * 0.1 / (quote.trim_sqft || 1)).toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        ${((quote.paint_cost || 0) * 0.1 / (quote.trim_sqft || 1) * (1 + markupPercentage / 100)).toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        ${((quote.paint_cost || 0) * 0.1 * (1 + markupPercentage / 100)).toFixed(0)}
                      </td>
                    </tr>
                  )}
                  
                  {/* Labor Line Item */}
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">Professional Labor</td>
                    <td className="text-center py-3 px-4">{Math.ceil((quote.sqft || 0) / 400)}</td>
                    <td className="text-center py-3 px-4">days</td>
                    <td className="text-right py-3 px-4 text-gray-600">
                      ${((quote.breakdown?.labor || 0) / Math.ceil((quote.sqft || 1) / 400)).toFixed(0)}
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      ${((quote.breakdown?.labor || 0) / Math.ceil((quote.sqft || 1) / 400) * (1 + markupPercentage / 100)).toFixed(0)}
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      ${((quote.breakdown?.labor || 0) * (1 + markupPercentage / 100)).toFixed(0)}
                    </td>
                  </tr>
                  
                  {/* Materials & Sundries */}
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">Materials & Sundries</td>
                    <td className="text-center py-3 px-4">1</td>
                    <td className="text-center py-3 px-4">lot</td>
                    <td className="text-right py-3 px-4 text-gray-600">
                      ${((quote.sundries_cost || 0) + (quote.breakdown?.materials || 0)).toFixed(0)}
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      ${(((quote.sundries_cost || 0) + (quote.breakdown?.materials || 0)) * (1 + markupPercentage / 100)).toFixed(0)}
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      ${(((quote.sundries_cost || 0) + (quote.breakdown?.materials || 0)) * (1 + markupPercentage / 100)).toFixed(0)}
                    </td>
                  </tr>
                  
                  {/* Prep Work if exists */}
                  {quote.breakdown?.prepWork > 0 && (
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">Surface Preparation</td>
                      <td className="text-center py-3 px-4">1</td>
                      <td className="text-center py-3 px-4">job</td>
                      <td className="text-right py-3 px-4 text-gray-600">
                        ${(quote.breakdown.prepWork).toFixed(0)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        ${(quote.breakdown.prepWork * (1 + markupPercentage / 100)).toFixed(0)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        ${(quote.breakdown.prepWork * (1 + markupPercentage / 100)).toFixed(0)}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2">
                    <td colSpan={3} className="py-3 px-4 font-medium">Subtotal</td>
                    <td className="text-right py-3 px-4 text-gray-600 font-medium">
                      ${calculateSubtotal().toFixed(0)}
                    </td>
                    <td className="text-right py-3 px-4 font-medium" colSpan={2}>
                      ${(calculateSubtotal() * (1 + markupPercentage / 100)).toFixed(0)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="py-3 px-4 font-medium">Markup ({markupPercentage}%)</td>
                    <td className="text-right py-3 px-4 text-gray-600">-</td>
                    <td className="text-right py-3 px-4 font-medium text-green-600" colSpan={2}>
                      ${calculateMarkupAmount().toFixed(0)}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="py-3 px-4 text-lg font-bold">Total Quote</td>
                    <td className="text-right py-3 px-4"></td>
                    <td className="text-right py-3 px-4 text-lg font-bold text-blue-600" colSpan={2}>
                      ${calculateTotal().toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
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