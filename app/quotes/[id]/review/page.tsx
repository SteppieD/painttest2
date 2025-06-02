"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calculator, FileText, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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
  };
  timeline: string;
  created_at: string;
}

export default function QuoteReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [markupPercentage, setMarkupPercentage] = useState(20);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuote();
  }, [params.id]);

  const loadQuote = async () => {
    try {
      const response = await fetch(`/api/quotes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setQuote(data);
        
        // Calculate markup percentage from the data
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

  const calculateTotal = () => {
    if (!quote) return 0;
    const subtotal = (quote.breakdown.labor || 0) + 
                    (quote.breakdown.materials || 0) + 
                    (quote.breakdown.prepWork || 0);
    const markup = subtotal * (markupPercentage / 100);
    return subtotal + markup;
  };

  const updateMarkup = async (newPercentage: number) => {
    setMarkupPercentage(newPercentage);
    
    // Update the quote in the database
    if (quote) {
      const subtotal = (quote.breakdown.labor || 0) + 
                      (quote.breakdown.materials || 0) + 
                      (quote.breakdown.prepWork || 0);
      const newMarkup = subtotal * (newPercentage / 100);
      const newTotal = subtotal + newMarkup;

      try {
        await fetch(`/api/quotes/${params.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            markup_percentage: newPercentage,
            total_cost: newTotal,
            breakdown: {
              ...quote.breakdown,
              markup: newMarkup
            }
          })
        });
      } catch (error) {
        console.error('Error updating markup:', error);
      }
    }
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

  const subtotal = (quote.breakdown.labor || 0) + 
                  (quote.breakdown.materials || 0) + 
                  (quote.breakdown.prepWork || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
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
                <h1 className="text-xl font-bold">Quote Review</h1>
                <p className="text-sm text-gray-500">Quote #{quote.quote_id}</p>
              </div>
            </div>
            
            <Button
              onClick={() => router.push(`/quotes/${params.id}/customer`)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Customer Quote
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Client Name</Label>
              <p className="font-medium">{quote.customer_name}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Address</Label>
              <p className="font-medium">{quote.address}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Project Type</Label>
              <p className="font-medium capitalize">{quote.project_type}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Square Footage</Label>
              <p className="font-medium">{quote.sqft?.toLocaleString()} sq ft</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Paint Quality</Label>
              <p className="font-medium capitalize">{quote.paint_quality}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Timeline</Label>
              <p className="font-medium capitalize">{quote.timeline || 'Standard'}</p>
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Labour Costs</span>
                <span className="font-medium">${quote.breakdown.labor?.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Paint & Materials</span>
                <span className="font-medium">${quote.breakdown.materials?.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Prep Work & Sundries</span>
                <span className="font-medium">${quote.breakdown.prepWork?.toLocaleString()}</span>
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Markup Section */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="markup" className="text-sm font-medium">
                  Markup Percentage
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="markup"
                    type="number"
                    min="0"
                    max="100"
                    value={markupPercentage}
                    onChange={(e) => updateMarkup(Number(e.target.value))}
                    className="w-20 text-right"
                  />
                  <span className="text-sm text-gray-600">%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Markup Amount</span>
                <span className="font-medium">
                  ${Math.round(subtotal * (markupPercentage / 100)).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total Quote</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${calculateTotal().toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.back()}
          >
            Back to Chat
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push(`/quotes/${params.id}/customer`)}
          >
            Generate Customer Quote
          </Button>
        </div>
      </div>
    </div>
  );
}