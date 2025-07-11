"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { SmartSuggestionWidget } from "./smart-suggestion-widget";
import { Calculator, Clock, Home, Users } from "lucide-react";
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
    <div>
      {/* Header */}
      <div>
        <h1>Express Quote</h1>
        <p>Create professional quotes in 30 seconds for standard jobs</p>
      </div>

      {/* Progress Indicator */}
      <div>
        <div>
          <div>
            1
          </div>
          <div></div>
          <div>
            2
          </div>
          <div></div>
          <div>
            3
          </div>
        </div>
      </div>

      {/* Step 1: Customer Selection */}
      {step === 'customer' && (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Select Customer</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search for existing customers */}
              <Input
                placeholder="Search customers..."
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
               
              />

              {/* Recent customers */}
              {filteredCustomers.length > 0 && (
                <div>
                  <h4>Recent Customers</h4>
                  <div>
                    {filteredCustomers.map((customer) => (
                      <Card 
                        key={customer.id}
                       
                        onClick={() => handleCustomerSelect(customer)}
                      >
                        <CardContent>
                          <div>
                            <Users />
                            <div>
                              <p>{customer.name}</p>
                              <p>{customer.address}</p>
                              {customer.lastQuoteDate && (
                                <Badge variant="outline">
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
              <div>
                <h4>New Customer</h4>
                <div>
                  <Input
                    placeholder="Customer name"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                   
                  />
                  <Input
                    placeholder="Property address"
                    value={newCustomerAddress}
                    onChange={(e) => setNewCustomerAddress(e.target.value)}
                   
                  />
                </div>
                <Button 
                  onClick={handleNewCustomer}
                  disabled={!newCustomerName.trim() || !newCustomerAddress.trim()}
                 
                >
                  Continue with New Customer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Fallback to chat */}
          <div>
            <Button 
              variant="outline" 
              onClick={onFallbackToChat}
             
            >
              Need custom quote? Use full chat interface
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Template Selection */}
      {step === 'template' && (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                Choose Job Type for {selectedCustomer?.name}
              </CardTitle>
              <p>{selectedCustomer?.address}</p>
            </CardHeader>
            <CardContent>
              <div>
                {QUOTE_TEMPLATES.map((template) => (
                  <Card 
                    key={template.id}
                   
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent>
                      <div>
                        <div>
                          <span>{template.icon}</span>
                          <div>
                            <h4>{template.name}</h4>
                            <p>{template.description}</p>
                          </div>
                        </div>
                        
                        <div>
                          <Clock />
                          <span>{template.estimatedTime}</span>
                        </div>
                        
                        <div>
                          <Badge variant="secondary">
                            {template.rooms.length} room{template.rooms.length !== 1 ? 's' : ''}
                          </Badge>
                          <span>
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
           
          >
            Back to Customer Selection
          </Button>
        </div>
      )}

      {/* Step 3: Generate Quote */}
      {step === 'generate' && (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Generate Quote</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <h4>Quote Summary</h4>
                <div>
                  <div>
                    <Users />
                    <span><strong>{selectedCustomer?.name}</strong> at {selectedCustomer?.address}</span>
                  </div>
                  <div>
                    <Home />
                    <span>{selectedTemplate?.name} - {selectedTemplate?.description}</span>
                  </div>
                  <div>
                    <Calculator />
                    <span>
                      ${selectedTemplate ? calculateEstimatedPrice(selectedTemplate).toLocaleString() : '0'}
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
               
              >
                {isGenerating ? (
                  <div>
                    <div></div>
                    <span>Generating Professional Quote...</span>
                  </div>
                ) : (
                  <div>
                    <Calculator />
                    <span>Generate Professional Quote</span>
                  </div>
                )}
              </Button>

              <Button 
                variant="outline" 
                onClick={() => setStep('template')}
                disabled={isGenerating}
               
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