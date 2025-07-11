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
    <div>
      {/* Header with Actions */}
      <Card>
        <CardHeader>
          <div>
            <div>
              <CardTitle>
                Quote #{quote.quote_id}
              </CardTitle>
              <p>{quote.customer_name} • {quote.address}</p>
            </div>
            <div>
              <Badge>
                {quote.status}
              </Badge>
              {quote.status === 'draft' && (
                <Button onClick={handleSendToCustomer}>
                  <Send />
                  Send to Customer
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Business Metrics - Contractor View */}
      <div>
        <Card>
          <CardContent>
            <div>
              <DollarSign />
              <span>Quote Total</span>
            </div>
            <p>${totals.total.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div>
              <TrendingUp />
              <span>Gross Profit</span>
            </div>
            <p>{totals.grossProfit.toFixed(1)}%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <div>
              <Calculator />
              <span>Markup Amount</span>
            </div>
            <p>${totals.markupAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card`}>
          <CardContent>
            <div>
              {totals.grossProfit >= 35 ? 
                <CheckCircle /> : 
                <AlertTriangle />
              }
              <span>Margin Health</span>
            </div>
            <p>{getMarginHealthLabel()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Cost Breakdown</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 />
              {isEditing ? 'Cancel' : 'Edit Markup'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <div>
              <span>Materials Cost:</span>
              <span>${totals.materialCost.toLocaleString()}</span>
            </div>
            <div>
              <span>Labor Cost:</span>
              <span>${totals.laborCost.toLocaleString()}</span>
            </div>
            <hr />
            <div>
              <span>Subtotal:</span>
              <span>${totals.subtotal.toLocaleString()}</span>
            </div>
            
            {isEditing ? (
              <div>
                <Label htmlFor="markup">Markup:</Label>
                <div>
                  <Input
                    id="markup"
                    type="number"
                    value={markupPercentage}
                    onChange={(e) => setMarkupPercentage(parseInt(e.target.value) || 0)}
                   
                    min="0"
                    max="100"
                  />
                  <span>%</span>
                  <span>${totals.markupAmount.toLocaleString()}</span>
                  <Button size="sm" onClick={handleUpdateMarkup}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <span>Markup ({markupPercentage}%):</span>
                <span>${totals.markupAmount.toLocaleString()}</span>
              </div>
            )}
            
            <hr />
            <div>
              <span>Total Quote:</span>
              <span>${totals.total.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Details */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Room Measurements</CardTitle>
          </CardHeader>
          <CardContent>
            {rooms.length > 0 ? (
              <div>
                {rooms.map((room: any) => (
                  <div key={room.id}>
                    <div>
                      <span>{room.name}</span>
                      <span>
                        {room.length}' × {room.width}' × {room.height}'
                      </span>
                    </div>
                    <div>
                      Floor: {(room.length * room.width).toFixed(1)} sq ft • 
                      Doors: {room.doors} • Windows: {room.windows}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No room data available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paint Selections</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(paintSelections).length > 0 ? (
              <div>
                {Object.entries(paintSelections).map(([surface, selection]: [string, any]) => (
                  <div key={surface}>
                    <div>
                      <span>{surface}</span>
                      <span>{selection.quality}</span>
                    </div>
                    <div>
                      {selection.brand} • ${selection.pricePerGallon}/gal
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No paint selections available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customer Actions */}
      {quote.status === 'sent' && (
        <Card>
          <CardContent>
            <h3>Quote Sent to Customer</h3>
            <p>
              Your customer can view and respond to this quote using the link you shared.
            </p>
            <div>
              <Button 
                variant="outline" 
                onClick={handleSendToCustomer}
               
              >
                <Copy />
                Copy Link Again
              </Button>
              <Button 
                onClick={() => window.open(`/quote/${quote.id}`, '_blank')}
               
              >
                <Eye />
                Preview Customer View
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}