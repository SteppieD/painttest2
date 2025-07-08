"use client";

import { useState } from "react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Checkbox } from "./checkbox";
import { X, FileText, DollarSign, User, MapPin } from "lucide-react";
import { useToast } from "./use-toast";
import { ConversationExtractedData, QuoteCreationRequest } from "@/types/quote";

interface ManualQuoteCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onQuoteCreated: (quoteId: string) => void;
  extractedData?: ConversationExtractedData;
  companyId: string;
  conversationData?: any;
}

export function ManualQuoteCreator({ 
  isOpen, 
  onClose, 
  onQuoteCreated, 
  extractedData, 
  companyId,
  conversationData 
}: ManualQuoteCreatorProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state with extracted data as defaults
  const [formData, setFormData] = useState<QuoteCreationRequest>({
    customer_name: extractedData?.customer_name || '',
    customer_email: '',
    customer_phone: '',
    address: extractedData?.address || '',
    project_type: extractedData?.project_type || 'interior',
    surfaces: extractedData?.surfaces || [],
    total_sqft: extractedData?.total_sqft || undefined,
    room_count: extractedData?.room_count || undefined,
    quote_amount: extractedData?.quote_amount || 0,
    timeline: extractedData?.timeline || '',
    notes: '',
    company_id: companyId,
    conversation_data: conversationData
  });

  const availableSurfaces = [
    'walls', 'ceilings', 'trim', 'doors', 'windows', 'cabinets', 'baseboards'
  ];

  const handleSurfaceChange = (surface: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        surfaces: [...(prev.surfaces || []), surface]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        surfaces: (prev.surfaces || []).filter(s => s !== surface)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.customer_name || !formData.quote_amount || formData.quote_amount <= 0) {
      toast({
        title: "Missing Required Fields",
        description: "Please provide customer name and quote amount.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/quotes/create-from-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Quote Created!",
          description: `Quote ${result.quote_id} created successfully.`,
        });
        onQuoteCreated(result.quote_id);
        onClose();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create quote');
      }
    } catch (error) {
      console.error('Quote creation error:', error);
      toast({
        title: "Error",
        description: "Failed to create quote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Create Quote
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          {extractedData?.confidence && (
            <p className="text-sm text-gray-600">
              Auto-filled from conversation ({extractedData.confidence} confidence)
            </p>
          )}
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <User className="w-4 h-4" />
                Customer Information
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer_name">Customer Name *</Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="customer_email">Email</Label>
                  <Input
                    id="customer_email"
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_email: e.target.value }))}
                    placeholder="customer@example.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="customer_phone">Phone</Label>
                  <Input
                    id="customer_phone"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, customer_phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Main St, City, State"
                  />
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="w-4 h-4" />
                Project Details
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="project_type">Project Type</Label>
                  <Select 
                    value={formData.project_type} 
                    onValueChange={(value: 'interior' | 'exterior' | 'both') => 
                      setFormData(prev => ({ ...prev, project_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interior">Interior</SelectItem>
                      <SelectItem value="exterior">Exterior</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="total_sqft">Total Sq Ft</Label>
                  <Input
                    id="total_sqft"
                    type="number"
                    value={formData.total_sqft || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      total_sqft: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                    placeholder="1500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="room_count">Room Count</Label>
                  <Input
                    id="room_count"
                    type="number"
                    value={formData.room_count || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      room_count: e.target.value ? parseInt(e.target.value) : undefined 
                    }))}
                    placeholder="5"
                  />
                </div>
              </div>
              
              {/* Surfaces */}
              <div>
                <Label>Surfaces to Paint</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {availableSurfaces.map(surface => (
                    <div key={surface} className="flex items-center space-x-2">
                      <Checkbox
                        id={surface}
                        checked={(formData.surfaces || []).includes(surface)}
                        onCheckedChange={(checked) => handleSurfaceChange(surface, !!checked)}
                      />
                      <Label htmlFor={surface} className="text-sm capitalize">
                        {surface}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing and Timeline */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="w-4 h-4" />
                Pricing & Timeline
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quote_amount">Quote Amount *</Label>
                  <Input
                    id="quote_amount"
                    type="number"
                    value={formData.quote_amount}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      quote_amount: parseFloat(e.target.value) || 0 
                    }))}
                    placeholder="2500"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="timeline">Timeline</Label>
                  <Input
                    id="timeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                    placeholder="3-5 days"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special requirements or notes..."
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Quote...' : 'Create Quote'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}