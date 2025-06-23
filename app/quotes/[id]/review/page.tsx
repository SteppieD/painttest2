"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit2, Save, Send, Calculator, CheckCircle, FileText, Eye, Copy, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

// Updated interface to match two-stage AI output
interface QuoteData {
  id: string;
  quote_id: string;
  customer_name: string;
  address: string;
  created_at: string;
  quote_amount: number;
  status: string;
  
  // Two-stage AI data structure
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
    primer?: { brand: string; gallons: number; cost_per_gallon: number; total_cost: number; };
    wall_paint?: { brand: string; gallons: number; cost_per_gallon: number; total_cost: number; };
    ceiling_paint?: { brand: string; gallons: number; cost_per_gallon: number; total_cost: number; };
    trim_paint?: { brand: string; gallons: number; cost_per_gallon: number; total_cost: number; };
  };
  labor?: {
    estimated_hours: number;
    rate_type: string;
    rate_amount: number;
    total_labor_cost: number;
  };
  overhead?: { total: number; };
  subtotal?: number;
  markup_percentage?: number;
  markup_amount?: number;
  total_quote?: number;
  scope_notes?: string;
  validity_days?: number;
}

export default function QuoteReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    loadQuoteData();
  }, [params.id]);

  const loadQuoteData = async () => {
    try {
      // Mock data from two-stage AI system (Cici quote)
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
            gallons: 13,
            cost_per_gallon: 50,
            total_cost: 650
          }
        },
        labor: {
          estimated_hours: 23,
          rate_type: "sqft",
          rate_amount: 1.5,
          total_labor_cost: 6750
        },
        overhead: { total: 0 },
        subtotal: 7400,
        markup_percentage: 20,
        markup_amount: 1480,
        total_quote: 8880,
        scope_notes: "500 linear feet interior painting, 9ft ceilings, walls only (no doors, trim, windows, or ceilings). No primer required.",
        validity_days: 30
      };
      
      setQuote(mockQuote);
      setEditData({
        markup_percentage: mockQuote.markup_percentage,
        labor_rate: mockQuote.labor?.rate_amount,
        paint_cost: mockQuote.materials?.wall_paint?.cost_per_gallon
      });
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

  const recalculateQuote = () => {
    if (!quote) return quote;

    // Recalculate based on editable fields
    const totalMaterialCost = (quote.materials?.wall_paint?.gallons || 0) * (editData.paint_cost || 0);
    const totalLaborCost = (quote.rooms?.[0]?.wall_sqft || 0) * (editData.labor_rate || 0);
    const newSubtotal = totalMaterialCost + totalLaborCost + (quote.overhead?.total || 0);
    const newMarkupAmount = newSubtotal * ((editData.markup_percentage || 0) / 100);
    const newTotal = newSubtotal + newMarkupAmount;

    return {
      ...quote,
      materials: {
        ...quote.materials,
        wall_paint: {
          ...quote.materials?.wall_paint!,
          cost_per_gallon: editData.paint_cost || 0,
          total_cost: totalMaterialCost
        }
      },
      labor: {
        ...quote.labor!,
        rate_amount: editData.labor_rate || 0,
        total_labor_cost: totalLaborCost
      },
      subtotal: newSubtotal,
      markup_percentage: editData.markup_percentage || 0,
      markup_amount: newMarkupAmount,
      total_quote: newTotal,
      quote_amount: newTotal
    };
  };

  const handleSaveChanges = () => {
    const updatedQuote = recalculateQuote();
    setQuote(updatedQuote);
    setEditing(false);
    toast({
      title: "Quote Updated",
      description: "Changes saved successfully"
    });
  };

  const handleApproveQuote = () => {
    toast({
      title: "Quote Approved",
      description: "Generating client-facing version..."
    });
    // Navigate to client-facing version
    router.push(`/quotes/${params.id}/client`);
  };

  const calculateGrossProfit = () => {
    if (!quote) return 0;
    const total = quote.total_quote || quote.quote_amount || 0;
    const directCosts = quote.subtotal || 0;
    return total > 0 ? ((total - directCosts) / total) * 100 : 0;
  };

  const getMarginHealthColor = () => {
    const grossProfit = calculateGrossProfit();
    if (grossProfit >= 25) return "text-green-600 bg-green-50 border-green-200";
    if (grossProfit >= 15) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getMarginHealthIcon = () => {
    const grossProfit = calculateGrossProfit();
    if (grossProfit >= 25) return <CheckCircle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const getMarginHealthLabel = () => {
    const grossProfit = calculateGrossProfit();
    if (grossProfit >= 25) return "Excellent";
    if (grossProfit >= 15) return "Acceptable";
    return "Risky";
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Quote Not Found</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const displayQuote = editing ? recalculateQuote() : quote;
  const grossProfit = calculateGrossProfit();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🧑‍🔧 Internal Quote Review</h1>
            <p className="text-gray-600">Full visibility with markup and profit analysis - {quote.quote_id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => {
              const customerUrl = `${window.location.origin}/quotes/${quote.id}/client`;
              navigator.clipboard.writeText(customerUrl);
              toast({
                title: "Link Copied!",
                description: "Client quote link copied to clipboard"
              });
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Client Link
          </Button>
          <Badge variant={quote.status === "pending" ? "secondary" : "default"}>
            {quote.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Client Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Client & Project Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Client Name</label>
                <p className="text-lg font-semibold">{quote.customer_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-lg">{quote.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Quote ID</label>
                <p className="text-lg font-mono">{quote.quote_id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date</label>
                <p className="text-lg">{new Date(quote.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            
            {quote.scope_notes && (
              <div className="mt-4 pt-4 border-t">
                <label className="text-sm font-medium text-gray-600">Project Scope</label>
                <p className="text-gray-700 mt-1">{quote.scope_notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profit Margin Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Profit Margin Health
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
              <p className="text-sm">
                Target: 25%+ for healthy margins
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Editable Inputs */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Edit2 className="mr-2 h-5 w-5" />
              Quote Inputs {editing && <span className="text-sm text-orange-600 ml-2">(Editing Mode)</span>}
            </div>
            {!editing ? (
              <Button onClick={() => setEditing(true)} variant="outline">
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Inputs
              </Button>
            ) : (
              <div className="space-x-2">
                <Button onClick={handleSaveChanges}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button onClick={() => setEditing(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Wall Area</Label>
                <p className="text-lg">{quote.rooms?.[0]?.wall_sqft || 0} sq ft</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Paint Brand</Label>
                <p className="text-lg">{quote.materials?.wall_paint?.brand}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Gallons Needed</Label>
                <p className="text-lg">{quote.materials?.wall_paint?.gallons} gallons</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Paint Cost per Gallon</Label>
                {editing ? (
                  <Input
                    type="number"
                    value={editData.paint_cost}
                    onChange={(e) => setEditData({...editData, paint_cost: parseFloat(e.target.value)})}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-lg">{formatCurrency(quote.materials?.wall_paint?.cost_per_gallon || 0)}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Labor Rate per Sq Ft</Label>
                {editing ? (
                  <Input
                    type="number"
                    step="0.01"
                    value={editData.labor_rate}
                    onChange={(e) => setEditData({...editData, labor_rate: parseFloat(e.target.value)})}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-lg">{formatCurrency(quote.labor?.rate_amount || 0)}/sqft</p>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Markup Percentage</Label>
                {editing ? (
                  <Input
                    type="number"
                    value={editData.markup_percentage}
                    onChange={(e) => setEditData({...editData, markup_percentage: parseFloat(e.target.value)})}
                    className="mt-1"
                  />
                ) : (
                  <p className="text-lg text-blue-600 font-semibold">{quote.markup_percentage}%</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Estimated Hours</Label>
                <p className="text-lg">{quote.labor?.estimated_hours} hours</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculated Results with MARKUP VISIBLE */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="mr-2 h-5 w-5" />
            Calculated Results {editing && <span className="text-sm text-green-600 ml-2">(Live Preview)</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Total Material Cost</span>
              <span className="font-semibold">{formatCurrency(displayQuote?.materials?.wall_paint?.total_cost || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Total Labor Cost</span>
              <span className="font-semibold">{formatCurrency(displayQuote?.labor?.total_labor_cost || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Overhead</span>
              <span className="font-semibold">{formatCurrency(displayQuote?.overhead?.total || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b bg-gray-50 px-4 rounded">
              <span className="text-gray-900 font-medium">Subtotal (Materials + Labor + Overhead)</span>
              <span className="font-bold">{formatCurrency(displayQuote?.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b text-blue-600 bg-blue-50 px-4 rounded">
              <span className="font-medium">🔍 Markup ({displayQuote?.markup_percentage}%) - INTERNAL VIEW</span>
              <span className="font-bold">{formatCurrency(displayQuote?.markup_amount || 0)}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-green-50 px-4 rounded-lg">
              <span className="text-lg font-bold text-green-800">Final Total (Client Price)</span>
              <span className="text-2xl font-bold text-green-600">{formatCurrency(displayQuote?.total_quote || displayQuote?.quote_amount || 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button 
          onClick={handleApproveQuote}
          disabled={editing}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Approve Quote & Generate Client Version
        </Button>
        <Button 
          variant="outline"
          onClick={() => setEditing(true)}
          disabled={editing}
        >
          <Edit2 className="mr-2 h-4 w-4" />
          Make Changes
        </Button>
        <Button 
          variant="outline"
          onClick={() => router.push(`/quotes/${params.id}/client`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview Client Version
        </Button>
      </div>

      {/* Important Note */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800">
          <strong>🔍 Internal Review Mode:</strong> This page shows all costs, markup, and profit margins for your decision-making. 
          The client version will hide markup and cost breakdowns, showing only the professional quote total.
        </p>
      </div>
    </div>
  );
}