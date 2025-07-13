"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Progress } from "./progress";
import { ArrowLeft, ArrowRight, CheckCircle, Home, Palette, Calculator, FileText } from "lucide-react";

interface QuoteWizardProps {
  onComplete: (quoteData: any) => void;
  onCancel: () => void;
}

interface QuoteData {
  // Step 1: Customer Info
  customerName: string;
  address: string;
  email: string;
  phone: string;
  
  // Step 2: Project Type
  projectType: 'interior' | 'exterior' | 'both';
  surfaces: string[];
  
  // Step 3: Dimensions
  roomCount: number;
  totalSquareFeet: number;
  ceilingHeight: number;
  doorsWindows: number;
  
  // Step 4: Paint Selection
  paintBrand: string;
  paintQuality: 'economy' | 'standard' | 'premium';
  
  // Step 5: Review
  markup: number;
}

export function QuoteWizard({ onComplete, onCancel }: QuoteWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [quoteData, setQuoteData] = useState<QuoteData>({
    customerName: "",
    address: "",
    email: "",
    phone: "",
    projectType: 'interior',
    surfaces: [],
    roomCount: 1,
    totalSquareFeet: 0,
    ceilingHeight: 8,
    doorsWindows: 0,
    paintBrand: "",
    paintQuality: 'standard',
    markup: 20
  });

  const steps = [
    { number: 1, title: "Customer Info", icon: Home },
    { number: 2, title: "Project Type", icon: Home },
    { number: 3, title: "Dimensions", icon: Calculator },
    { number: 4, title: "Paint Selection", icon: Palette },
    { number: 5, title: "Review & Quote", icon: FileText }
  ];

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateQuoteData = (field: string, value: any) => {
    setQuoteData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return quoteData.customerName && quoteData.address;
      case 2:
        return quoteData.projectType && quoteData.surfaces.length > 0;
      case 3:
        return quoteData.totalSquareFeet > 0;
      case 4:
        return quoteData.paintBrand && quoteData.paintQuality;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                value={quoteData.customerName}
                onChange={(e) => updateQuoteData('customerName', e.target.value)}
                placeholder="John Smith"
              />
            </div>
            <div>
              <Label htmlFor="address">Property Address *</Label>
              <Input
                id="address"
                value={quoteData.address}
                onChange={(e) => updateQuoteData('address', e.target.value)}
                placeholder="123 Main St, City, State"
              />
            </div>
            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={quoteData.email}
                onChange={(e) => updateQuoteData('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                value={quoteData.phone}
                onChange={(e) => updateQuoteData('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label>Project Type *</Label>
              <div>
                {['interior', 'exterior', 'both'].map((type) => (
                  <button
                    key={type}
                    onClick={() => updateQuoteData('projectType', type)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                      quoteData.projectType === type
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Surfaces to Paint *</Label>
              <div>
                {['walls', 'ceilings', 'trim', 'doors', 'cabinets', 'exterior siding'].map((surface) => {
                  const isSelected = quoteData.surfaces.includes(surface);
                  return (
                    <button
                      key={surface}
                      onClick={() => {
                        const newSurfaces = isSelected
                          ? quoteData.surfaces.filter(s => s !== surface)
                          : [...quoteData.surfaces, surface];
                        updateQuoteData('surfaces', newSurfaces);
                      }}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {surface}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="totalSquareFeet">Total Square Feet to Paint *</Label>
              <Input
                id="totalSquareFeet"
                type="number"
                value={quoteData.totalSquareFeet || ''}
                onChange={(e) => updateQuoteData('totalSquareFeet', parseInt(e.target.value) || 0)}
                placeholder="1500"
              />
              <p>
                Include all surfaces you selected in the previous step
              </p>
            </div>
            <div>
              <Label htmlFor="roomCount">Number of Rooms</Label>
              <Input
                id="roomCount"
                type="number"
                value={quoteData.roomCount}
                onChange={(e) => updateQuoteData('roomCount', parseInt(e.target.value) || 1)}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="ceilingHeight">Ceiling Height (feet)</Label>
              <Input
                id="ceilingHeight"
                type="number"
                value={quoteData.ceilingHeight}
                onChange={(e) => updateQuoteData('ceilingHeight', parseInt(e.target.value) || 8)}
                min="7"
                max="20"
              />
            </div>
            <div>
              <Label htmlFor="doorsWindows">Number of Doors + Windows</Label>
              <Input
                id="doorsWindows"
                type="number"
                value={quoteData.doorsWindows}
                onChange={(e) => updateQuoteData('doorsWindows', parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>Paint Brand *</Label>
              <div>
                {['Sherwin-Williams', 'Benjamin Moore', 'Behr', 'PPG'].map((brand) => (
                  <button
                    key={brand}
                    onClick={() => updateQuoteData('paintBrand', brand)}
                    className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                      quoteData.paintBrand === brand
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Paint Quality *</Label>
              <div>
                {[
                  { value: 'economy', label: 'Economy', desc: 'Good value' },
                  { value: 'standard', label: 'Standard', desc: 'Most popular' },
                  { value: 'premium', label: 'Premium', desc: 'Best quality' }
                ].map((quality) => (
                  <button
                    key={quality.value}
                    onClick={() => updateQuoteData('paintQuality', quality.value)}
                    className={`p-4 rounded-lg border-2 transition-colors text-center ${
                      quoteData.paintQuality === quality.value
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div>{quality.label}</div>
                    <div>{quality.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        const estimatedCost = quoteData.totalSquareFeet * 3.50 * (1 + quoteData.markup / 100);
        return (
          <div>
            <div>
              <h3>Quote Summary</h3>
              <div>
                <div>
                  <span>Customer:</span>
                  <span>{quoteData.customerName}</span>
                </div>
                <div>
                  <span>Property:</span>
                  <span>{quoteData.address}</span>
                </div>
                <div>
                  <span>Project Type:</span>
                  <span>{quoteData.projectType}</span>
                </div>
                <div>
                  <span>Square Feet:</span>
                  <span>{quoteData.totalSquareFeet} sq ft</span>
                </div>
                <div>
                  <span>Paint Brand:</span>
                  <span>{quoteData.paintBrand}</span>
                </div>
                <div>
                  <span>Paint Quality:</span>
                  <span>{quoteData.paintQuality}</span>
                </div>
                <hr />
                <div>
                  <span>Estimated Total:</span>
                  <span>${estimatedCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="markup">Markup Percentage</Label>
              <Input
                id="markup"
                type="number"
                value={quoteData.markup}
                onChange={(e) => updateQuoteData('markup', parseInt(e.target.value) || 20)}
                min="0"
                max="100"
              />
              <p>
                Adjust your profit margin (default: 20%)
              </p>
            </div>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Create New Quote</h1>
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Cancel
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} />
        </div>
        
        <div className="flex justify-between items-center">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : isCompleted ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <StepIcon className="w-6 h-6" />
                  )}
                </div>
                <span className={`text-sm mt-2 ${isActive ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft />
          Previous
        </Button>
        
        {currentStep === steps.length ? (
          <Button
            onClick={() => onComplete(quoteData)}
            disabled={!canProceed()}
           
          >
            Generate Quote
            <FileText />
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
          >
            Next
            <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
}