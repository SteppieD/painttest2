"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Badge } from "./badge";
import { useToast } from "./use-toast";
import { 
  Calculator, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Edit3, 
  Eye, 
  Copy, 
  Send
} from "lucide-react";

interface ContractorQuoteReviewProps {
  quote: any;
  onUpdate?: (updatedQuote: any) => void;
}

export function ContractorQuoteReview({ quote, onUpdate }: ContractorQuoteReviewProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [markupPercentage, setMarkupPercentage] = useState(quote.markup_percentage || 35);
  
  // Parse room data if available
  const rooms = quote.rooms_data ? JSON.parse(quote.rooms_data) : [];
  const paintSelections = quote.paint_selections ? JSON.parse(quote.paint_selections) : {};
  const professionalCalc = quote.professional_calculation ? JSON.parse(quote.professional_calculation) : null;

  const calculateTotals = () => {
    const materialCost = professionalCalc?.materials?.total_material_cost || 0;
    const laborCost = professionalCalc?.labor?.total_labor || 0;
    const subtotal = materialCost + laborCost;
    const markupAmount = subtotal * (markupPercentage / 100);
    const total = subtotal + markupAmount;
    
    return {
      materialCost,
      laborCost,
      subtotal,
      markupAmount,
      total,
      grossProfit: ((markupAmount / total) * 100)
    };
  };

  const totals = calculateTotals();

  const getMarginHealthColor = () => {
    if (totals.grossProfit >= 35) return "text-green-600 bg-green-50 border-green-200";
    if (totals.grossProfit >= 20) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getMarginHealthLabel = () => {
    if (totals.grossProfit >= 35) return "Excellent";
    if (totals.grossProfit >= 20) return "Acceptable";
    return "Low Margin";
  };

  const handleSendToCustomer = async () => {
    try {
      // Generate a shareable link for the customer
      const customerLink = `${window.location.origin}/quote/${quote.id}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(customerLink);
      
      toast({
        title: "Customer Link Copied!",
        description: "Share this link with your customer to view and approve the quote.",
      });
      
      // Update quote status to sent
      if (onUpdate) {
        onUpdate({ ...quote, status: 'sent' });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to generate customer link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMarkup = async () => {
    try {
      const response = await fetch(`/api/quotes/${quote.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          markup_percentage: markupPercentage,
          quote_amount: totals.total,
        }),
      });

      if (response.ok) {
        toast({
          title: "Quote Updated",
          description: "Markup and total have been updated successfully.",
        });
        
        if (onUpdate) {
          onUpdate({ ...quote, markup_percentage: markupPercentage, quote_amount: totals.total });
        }
        setIsEditing(false);
      } else {
        throw new Error("Failed to update quote");
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Unable to update quote. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-gray-900">
                Quote #{quote.quote_id}
              </CardTitle>
              <p className="text-gray-600">{quote.customer_name} • {quote.address}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={quote.status === 'draft' ? 'bg-gray-100 text-gray-800' : 
                              quote.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                              quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'}>
                {quote.status}
              </Badge>
              {quote.status === 'draft' && (
                <Button onClick={handleSendToCustomer} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" />
                  Send to Customer
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Business Metrics - Contractor View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Quote Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">${totals.total.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Gross Profit</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{totals.grossProfit.toFixed(1)}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Markup Amount</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">${totals.markupAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card className={`border-2 ${getMarginHealthColor()}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {totals.grossProfit >= 35 ? 
                <CheckCircle className="w-4 h-4" /> : 
                <AlertTriangle className="w-4 h-4" />
              }
              <span className="text-sm font-medium">Margin Health</span>
            </div>
            <p className="text-2xl font-bold">{getMarginHealthLabel()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Cost Breakdown</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Markup'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Materials Cost:</span>
              <span className="font-medium">${totals.materialCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Labor Cost:</span>
              <span className="font-medium">${totals.laborCost.toLocaleString()}</span>
            </div>
            <hr />
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${totals.subtotal.toLocaleString()}</span>
            </div>
            
            {isEditing ? (
              <div className="flex items-center gap-4">
                <Label htmlFor="markup" className="text-gray-600">Markup:</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="markup"
                    type="number"
                    value={markupPercentage}
                    onChange={(e) => setMarkupPercentage(parseInt(e.target.value) || 0)}
                    className="w-20"
                    min="0"
                    max="100"
                  />
                  <span className="text-gray-600">%</span>
                  <span className="font-medium">${totals.markupAmount.toLocaleString()}</span>
                  <Button size="sm" onClick={handleUpdateMarkup}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Markup ({markupPercentage}%):</span>
                <span className="font-medium">${totals.markupAmount.toLocaleString()}</span>
              </div>
            )}
            
            <hr />
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Quote:</span>
              <span className="text-green-600">${totals.total.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Room Measurements</CardTitle>
          </CardHeader>
          <CardContent>
            {rooms.length > 0 ? (
              <div className="space-y-3">
                {rooms.map((room: any) => (
                  <div key={room.id} className="border-b pb-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{room.name}</span>
                      <span className="text-sm text-gray-500">
                        {room.length}' × {room.width}' × {room.height}'
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Floor: {(room.length * room.width).toFixed(1)} sq ft • 
                      Doors: {room.doors} • Windows: {room.windows}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No room data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paint Selections</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(paintSelections).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(paintSelections).map(([surface, selection]: [string, any]) => (
                  <div key={surface} className="border-b pb-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">{surface}</span>
                      <span className="text-sm text-gray-500">{selection.quality}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {selection.brand} • ${selection.pricePerGallon}/gal
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No paint selections available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customer Actions */}
      {quote.status === 'sent' && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Quote Sent to Customer</h3>
            <p className="text-blue-700 mb-4">
              Your customer can view and respond to this quote using the link you shared.
            </p>
            <div className="flex justify-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleSendToCustomer}
                className="border-blue-300 text-blue-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link Again
              </Button>
              <Button 
                onClick={() => window.open(`/quote/${quote.id}`, '_blank')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview Customer View
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}