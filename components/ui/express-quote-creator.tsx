"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { SmartSuggestionWidget } from "./smart-suggestion-widget";
import { Calculator, Clock, Home, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Customer {
  id: string;
  name: string;
  address: string;
  lastQuoteDate?: string;
}

interface QuoteTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  estimatedTime: string;
  rooms: Array<{
    name: string;
    dimensions: { length: number; width: number; height: number };
    surfaces: string[];
  }>;
  defaultPaint: string;
  popularityScore: number;
}

interface ExpressQuoteCreatorProps {
  onQuoteCreated: (quoteData: any) => void;
  onFallbackToChat: () => void;
  companyData: any;
}

const QUOTE_TEMPLATES: QuoteTemplate[] = [
  {
    id: "3-room-interior",
    name: "3-Room Interior",
    description: "Bedroom, bathroom, living room - most popular",
    icon: "🏠",
    estimatedTime: "30 seconds",
    rooms: [
      { name: "Master Bedroom", dimensions: { length: 12, width: 14, height: 9 }, surfaces: ["walls", "ceilings"] },
      { name: "Bathroom", dimensions: { length: 8, width: 10, height: 9 }, surfaces: ["walls", "ceilings"] },
      { name: "Living Room", dimensions: { length: 16, width: 20, height: 9 }, surfaces: ["walls", "ceilings"] }
    ],
    defaultPaint: "ProClassic Interior",
    popularityScore: 95
  },
  {
    id: "kitchen-refresh",
    name: "Kitchen Refresh",
    description: "Cabinets, walls, and trim",
    icon: "🍳",
    estimatedTime: "45 seconds",
    rooms: [
      { name: "Kitchen", dimensions: { length: 12, width: 16, height: 9 }, surfaces: ["walls", "trim", "doors"] }
    ],
    defaultPaint: "Advance Waterborne",
    popularityScore: 85
  },
  {
    id: "bathroom-suite",
    name: "Bathroom Suite",
    description: "Full bathroom with high-moisture paint",
    icon: "🛁",
    estimatedTime: "20 seconds",
    rooms: [
      { name: "Bathroom", dimensions: { length: 8, width: 10, height: 9 }, surfaces: ["walls", "ceilings", "trim"] }
    ],
    defaultPaint: "Bath Paint",
    popularityScore: 75
  },
  {
    id: "whole-house",
    name: "Whole House Interior",
    description: "5-6 rooms, complete interior",
    icon: "🏡",
    estimatedTime: "2 minutes",
    rooms: [
      { name: "Living Room", dimensions: { length: 16, width: 20, height: 9 }, surfaces: ["walls", "ceilings"] },
      { name: "Master Bedroom", dimensions: { length: 14, width: 16, height: 9 }, surfaces: ["walls", "ceilings"] },
      { name: "Bedroom 2", dimensions: { length: 11, width: 12, height: 9 }, surfaces: ["walls", "ceilings"] },
      { name: "Kitchen", dimensions: { length: 12, width: 16, height: 9 }, surfaces: ["walls", "ceilings"] },
      { name: "Bathroom", dimensions: { length: 8, width: 10, height: 9 }, surfaces: ["walls", "ceilings"] },
      { name: "Hallway", dimensions: { length: 20, width: 4, height: 9 }, surfaces: ["walls", "ceilings"] }
    ],
    defaultPaint: "ProClassic Interior",
    popularityScore: 90
  }
];

const RECENT_CUSTOMERS: Customer[] = [
  { id: "1", name: "Sarah Johnson", address: "123 Oak Street", lastQuoteDate: "2 days ago" },
  { id: "2", name: "Mike Rodriguez", address: "456 Pine Avenue", lastQuoteDate: "1 week ago" },
  { id: "3", name: "Emily Chen", address: "789 Maple Drive", lastQuoteDate: "3 days ago" },
  { id: "4", name: "David Smith", address: "321 Elm Street", lastQuoteDate: "5 days ago" }
];

export function ExpressQuoteCreator({ onQuoteCreated, onFallbackToChat, companyData }: ExpressQuoteCreatorProps) {
  const [step, setStep] = useState<'customer' | 'template' | 'customize' | 'generate'>('customer');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<QuoteTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchCustomer, setSearchCustomer] = useState('');

  const filteredCustomers = RECENT_CUSTOMERS.filter(customer => 
    customer.name.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    customer.address.toLowerCase().includes(searchCustomer.toLowerCase())
  );

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setStep('template');
  };

  const handleNewCustomer = () => {
    if (newCustomerName.trim() && newCustomerAddress.trim()) {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        name: newCustomerName.trim(),
        address: newCustomerAddress.trim()
      };
      setSelectedCustomer(newCustomer);
      setStep('template');
    }
  };

  const handleTemplateSelect = (template: QuoteTemplate) => {
    setSelectedTemplate(template);
    setStep('generate'); // Skip customize for now - go straight to generation
  };

  const handleGenerate = async () => {
    if (!selectedCustomer || !selectedTemplate) return;
    
    setIsGenerating(true);
    
    // Simulate quote generation with realistic timing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const quoteData = {
      customer_name: selectedCustomer.name,
      address: selectedCustomer.address,
      project_type: 'interior',
      template: selectedTemplate,
      estimated_price: calculateEstimatedPrice(selectedTemplate),
      created_via: 'express_quote'
    };
    
    onQuoteCreated(quoteData);
  };

  const calculateEstimatedPrice = (template: QuoteTemplate): number => {
    let totalPrice = 0;
    
    template.rooms.forEach(room => {
      const area = room.dimensions.length * room.dimensions.width;
      const wallArea = (room.dimensions.length + room.dimensions.width) * 2 * room.dimensions.height;
      
      if (room.surfaces.includes('walls')) totalPrice += wallArea * 1.5;
      if (room.surfaces.includes('ceilings')) totalPrice += area * 1.25;
      if (room.surfaces.includes('trim')) totalPrice += 200; // Estimated trim cost
      if (room.surfaces.includes('doors')) totalPrice += 150; // Per door
    });
    
    return Math.round(totalPrice * 1.2); // Add 20% markup
  };

  return (
    <div className="design-container max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="design-heading-1">Express Quote</h1>
        <p className="design-body">Create professional quotes in 30 seconds for standard jobs</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            step === 'customer' ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
          )}>
            1
          </div>
          <div className="w-8 h-1 bg-gray-200"></div>
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            step === 'template' ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
          )}>
            2
          </div>
          <div className="w-8 h-1 bg-gray-200"></div>
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
            step === 'generate' ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
          )}>
            3
          </div>
        </div>
      </div>

      {/* Step 1: Customer Selection */}
      {step === 'customer' && (
        <div className="design-stack">
          <Card className="design-card">
            <CardHeader>
              <CardTitle className="design-heading-3">Select Customer</CardTitle>
            </CardHeader>
            <CardContent className="design-stack">
              {/* Search for existing customers */}
              <Input
                placeholder="Search customers..."
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
                className="design-input"
              />

              {/* Recent customers */}
              {filteredCustomers.length > 0 && (
                <div className="design-stack">
                  <h4 className="font-medium text-gray-700">Recent Customers</h4>
                  <div className="design-grid design-grid-2">
                    {filteredCustomers.map((customer) => (
                      <Card 
                        key={customer.id}
                        className="design-card design-card-interactive cursor-pointer hover:border-blue-300"
                        onClick={() => handleCustomerSelect(customer)}
                      >
                        <CardContent className="p-4">
                          <div className="design-inline">
                            <Users className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              <p className="text-sm text-gray-500">{customer.address}</p>
                              {customer.lastQuoteDate && (
                                <Badge variant="outline" className="mt-1">
                                  Last quote: {customer.lastQuoteDate}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* New customer form */}
              <div className="design-stack">
                <h4 className="font-medium text-gray-700">New Customer</h4>
                <div className="design-grid design-grid-2">
                  <Input
                    placeholder="Customer name"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="design-input"
                  />
                  <Input
                    placeholder="Property address"
                    value={newCustomerAddress}
                    onChange={(e) => setNewCustomerAddress(e.target.value)}
                    className="design-input"
                  />
                </div>
                <Button 
                  onClick={handleNewCustomer}
                  disabled={!newCustomerName.trim() || !newCustomerAddress.trim()}
                  className="design-button design-button-primary w-full"
                >
                  Continue with New Customer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Fallback to chat */}
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={onFallbackToChat}
              className="design-button design-button-secondary"
            >
              Need custom quote? Use full chat interface
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Template Selection */}
      {step === 'template' && (
        <div className="design-stack">
          <Card className="design-card">
            <CardHeader>
              <CardTitle className="design-heading-3">
                Choose Job Type for {selectedCustomer?.name}
              </CardTitle>
              <p className="design-caption">{selectedCustomer?.address}</p>
            </CardHeader>
            <CardContent>
              <div className="design-grid design-grid-2">
                {QUOTE_TEMPLATES.map((template) => (
                  <Card 
                    key={template.id}
                    className="design-card design-card-interactive cursor-pointer hover:border-blue-300"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent className="p-6">
                      <div className="design-stack">
                        <div className="design-inline">
                          <span className="text-2xl">{template.icon}</span>
                          <div>
                            <h4 className="font-semibold">{template.name}</h4>
                            <p className="text-sm text-gray-500">{template.description}</p>
                          </div>
                        </div>
                        
                        <div className="design-inline">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{template.estimatedTime}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">
                            {template.rooms.length} room{template.rooms.length !== 1 ? 's' : ''}
                          </Badge>
                          <span className="text-sm font-medium text-green-600">
                            ~${calculateEstimatedPrice(template).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Smart Suggestions for Template Selection */}
          {companyData && (
            <SmartSuggestionWidget
              companyId={parseInt(companyData.id)}
              context={{
                projectType: selectedTemplate?.name,
                roomName: selectedTemplate?.rooms[0]?.name
              }}
              onApplySuggestion={(suggestion) => {
                console.log('Applied suggestion:', suggestion);
                // Could auto-select templates based on suggestions
              }}
            />
          )}

          <Button 
            variant="outline" 
            onClick={() => setStep('customer')}
            className="design-button design-button-secondary w-full"
          >
            Back to Customer Selection
          </Button>
        </div>
      )}

      {/* Step 3: Generate Quote */}
      {step === 'generate' && (
        <div className="design-stack">
          <Card className="design-card">
            <CardHeader>
              <CardTitle className="design-heading-3">Generate Quote</CardTitle>
            </CardHeader>
            <CardContent className="design-stack">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-4">Quote Summary</h4>
                <div className="design-stack">
                  <div className="design-inline">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span><strong>{selectedCustomer?.name}</strong> at {selectedCustomer?.address}</span>
                  </div>
                  <div className="design-inline">
                    <Home className="w-5 h-5 text-gray-400" />
                    <span>{selectedTemplate?.name} - {selectedTemplate?.description}</span>
                  </div>
                  <div className="design-inline">
                    <Calculator className="w-5 h-5 text-gray-400" />
                    <span className="text-lg font-semibold text-green-600">
                      ${selectedTemplate ? calculateEstimatedPrice(selectedTemplate).toLocaleString() : '0'}
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="design-button design-button-primary design-button-large w-full"
              >
                {isGenerating ? (
                  <div className="design-inline">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating Professional Quote...</span>
                  </div>
                ) : (
                  <div className="design-inline">
                    <Calculator className="w-5 h-5" />
                    <span>Generate Professional Quote</span>
                  </div>
                )}
              </Button>

              <Button 
                variant="outline" 
                onClick={() => setStep('template')}
                disabled={isGenerating}
                className="design-button design-button-secondary w-full"
              >
                Back to Templates
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}