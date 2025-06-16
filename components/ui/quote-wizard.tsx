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
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-4 block">Project Type *</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {['interior', 'exterior', 'both'].map((type) => (
                  <button
                    key={type}
                    onClick={() => updateQuoteData('projectType', type)}
                    className={`p-4 border rounded-lg text-center capitalize transition-colors ${
                      quoteData.projectType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-base font-medium mb-4 block">Surfaces to Paint *</Label>
              <div className="grid grid-cols-2 gap-3">
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
                      className={`p-3 border rounded-lg text-sm capitalize transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
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
              <p className="text-xs text-gray-500 mt-1">
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
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-4 block">Paint Brand *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {['Sherwin-Williams', 'Benjamin Moore', 'Behr', 'PPG'].map((brand) => (
                  <button
                    key={brand}
                    onClick={() => updateQuoteData('paintBrand', brand)}
                    className={`p-4 border rounded-lg text-center transition-colors ${
                      quoteData.paintBrand === brand
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-base font-medium mb-4 block">Paint Quality *</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'economy', label: 'Economy', desc: 'Good value' },
                  { value: 'standard', label: 'Standard', desc: 'Most popular' },
                  { value: 'premium', label: 'Premium', desc: 'Best quality' }
                ].map((quality) => (
                  <button
                    key={quality.value}
                    onClick={() => updateQuoteData('paintQuality', quality.value)}
                    className={`p-4 border rounded-lg text-center transition-colors ${
                      quoteData.paintQuality === quality.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{quality.label}</div>
                    <div className="text-sm text-gray-500">{quality.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        const estimatedCost = quoteData.totalSquareFeet * 3.50 * (1 + quoteData.markup / 100);
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Quote Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-medium">{quoteData.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Property:</span>
                  <span className="font-medium">{quoteData.address}</span>
                </div>
                <div className="flex justify-between">
                  <span>Project Type:</span>
                  <span className="font-medium capitalize">{quoteData.projectType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Square Feet:</span>
                  <span className="font-medium">{quoteData.totalSquareFeet} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span>Paint Brand:</span>
                  <span className="font-medium">{quoteData.paintBrand}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paint Quality:</span>
                  <span className="font-medium capitalize">{quoteData.paintQuality}</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-bold text-green-900">
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
              <p className="text-xs text-gray-500 mt-1">
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
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Create New Quote</h1>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : isActive
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>
                <span className={`text-xs mt-1 text-center ${
                  isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        {currentStep === steps.length ? (
          <Button
            onClick={() => onComplete(quoteData)}
            disabled={!canProceed()}
            className="bg-green-600 hover:bg-green-700"
          >
            Generate Quote
            <FileText className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}