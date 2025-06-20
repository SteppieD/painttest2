"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, Palette, DollarSign, Rocket, ArrowRight } from "lucide-react";

interface PaintProduct {
  supplier: string;
  name: string;
  cost: number;
}

const POPULAR_PRODUCTS = {
  interior: {
    primer: [
      { supplier: "Kilz", name: "Premium Primer", cost: 25 },
      { supplier: "Zinsser", name: "Bulls Eye 1-2-3", cost: 28 },
      { supplier: "Sherwin-Williams", name: "ProBlock", cost: 32 },
    ],
    wall_paint: [
      { supplier: "Sherwin-Williams", name: "ProClassic", cost: 58 },
      { supplier: "Benjamin Moore", name: "Regal Select", cost: 65 },
      { supplier: "Behr", name: "Premium Plus Ultra", cost: 45 },
    ],
    ceiling_paint: [
      { supplier: "Sherwin-Williams", name: "ProMar 200", cost: 42 },
      { supplier: "Benjamin Moore", name: "Waterborne Ceiling", cost: 55 },
      { supplier: "Behr", name: "Premium Plus", cost: 38 },
    ],
    trim_paint: [
      { supplier: "Benjamin Moore", name: "Advance", cost: 75 },
      { supplier: "Sherwin-Williams", name: "ProClassic", cost: 68 },
      { supplier: "PPG", name: "Break-Through!", cost: 72 },
    ],
  },
  exterior: {
    primer: [
      { supplier: "Kilz", name: "Adhesion Primer", cost: 35 },
      { supplier: "Zinsser", name: "Cover Stain", cost: 38 },
      { supplier: "Benjamin Moore", name: "Fresh Start", cost: 42 },
    ],
    wall_paint: [
      { supplier: "Sherwin-Williams", name: "Duration", cost: 78 },
      { supplier: "Benjamin Moore", name: "Aura Exterior", cost: 85 },
      { supplier: "Behr", name: "Marquee", cost: 65 },
    ],
    trim_paint: [
      { supplier: "Benjamin Moore", name: "Advance Exterior", cost: 82 },
      { supplier: "Sherwin-Williams", name: "ProClassic", cost: 75 },
      { supplier: "PPG", name: "Manor Hall", cost: 70 },
    ],
  },
};

const MARKUP_OPTIONS = [
  { value: 10, label: "10% - Competitive pricing", description: "Lower profit, win more bids" },
  { value: 20, label: "20% - Standard profit", description: "Recommended for most jobs", recommended: true },
  { value: 30, label: "30% - Good profit margin", description: "Higher profit on quality jobs" },
  { value: 40, label: "40% - Premium pricing", description: "Premium clients and complex work" },
];

export default function SetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);
  
  // Setup data
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<{[key: string]: PaintProduct}>({});
  const [markupPercentage, setMarkupPercentage] = useState(20);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    // Get company data from URL params or localStorage
    const accessCode = searchParams.get('code');
    const storedCompany = localStorage.getItem("paintquote_company");
    
    if (storedCompany) {
      setCompanyData(JSON.parse(storedCompany));
    } else if (accessCode) {
      // If coming from trial signup, try to get company data
      fetchCompanyData(accessCode);
    } else {
      // Redirect to access code page if no company data
      router.push('/access-code');
    }
  }, [searchParams, router]);

  const fetchCompanyData = async (code: string) => {
    try {
      const response = await fetch('/api/access-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode: code }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setCompanyData(data.company);
        localStorage.setItem("paintquote_company", JSON.stringify(data.company));
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };

  const renderProductSelection = (category: string, categoryLabel: string, projectType: 'interior' | 'exterior') => {
    const productCategory = POPULAR_PRODUCTS[projectType];
    const products = productCategory[category as keyof typeof productCategory];
    
    // Skip if products don't exist for this category
    if (!products) return null;
    
    const selectedKey = `${projectType}_${category}`;
    
    return (
      <div key={selectedKey} className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3 capitalize">
          {categoryLabel}
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {products.map((product, index) => {
            const isSelected = selectedProducts[selectedKey]?.name === product.name;
            return (
              <Button
                key={index}
                variant={isSelected ? "default" : "outline"}
                className={`h-auto p-4 justify-start text-left ${
                  isSelected ? "bg-blue-600 text-white" : ""
                }`}
                onClick={() => setSelectedProducts(prev => ({
                  ...prev,
                  [selectedKey]: product
                }))}
              >
                <div className="flex justify-between items-center w-full">
                  <div>
                    <div className="font-medium">{product.supplier}</div>
                    <div className="text-sm opacity-75">{product.name}</div>
                  </div>
                  <div className="text-lg font-semibold">
                    ${product.cost}/gal
                  </div>
                </div>
                {isSelected && <CheckCircle className="w-5 h-5 ml-2" />}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  const saveSetupData = async () => {
    if (!companyData) return;
    
    setIsLoading(true);
    try {
      // Save paint products
      const products = Object.entries(selectedProducts).map(([key, product]) => {
        const [projectType, category] = key.split('_');
        return {
          projectType,
          productCategory: category,
          supplier: product.supplier,
          productName: product.name,
          costPerGallon: product.cost,
          displayOrder: 1,
        };
      });

      await fetch('/api/paint-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: companyData.id,
          products,
        }),
      });

      // Save company preferences
      await fetch('/api/companies/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: companyData.id,
          defaultMarkup: markupPercentage,
          setupCompleted: true,
        }),
      });

      toast({
        title: "Setup Complete!",
        description: "Your paint preferences have been saved. Ready to create quotes!",
      });

      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Error saving setup:', error);
      toast({
        title: "Setup Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canProceedFromCurrentStep = () => {
    switch (currentStep) {
      case 1: return true; // Can always proceed from welcome
      case 2: return projectTypes.length > 0; // Need at least one project type
      case 3: 
        // Check if at least one product selected per category per project type
        const requiredSelections = projectTypes.flatMap(type => 
          type === 'interior' 
            ? ['primer', 'wall_paint', 'ceiling_paint', 'trim_paint'].map(cat => `${type}_${cat}`)
            : ['primer', 'wall_paint', 'trim_paint'].map(cat => `${type}_${cat}`)
        );
        return requiredSelections.every(key => selectedProducts[key]);
      case 4: return markupPercentage > 0;
      default: return true;
    }
  };

  if (!companyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading setup...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Professional Quote Builder
          </h1>
          <p className="text-gray-600">
            Let's set up your paint preferences to get you quoting quickly
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Setup Progress</span>
            <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Steps */}
        <Card className="mb-6">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <div className="text-center">
                <Palette className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Hi {companyData.company_name}!
                </h2>
                <p className="text-gray-600 mb-6">
                  We'll help you set up your preferred paint products and pricing so you can create accurate quotes in seconds.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Choose Favorites</p>
                    <p className="text-xs text-gray-600">Pick your go-to products</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Set Markup</p>
                    <p className="text-xs text-gray-600">Your profit percentage</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Rocket className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Start Quoting</p>
                    <p className="text-xs text-gray-600">Create professional quotes</p>
                  </div>
                </div>
                <Button onClick={() => setCurrentStep(2)} size="lg" className="px-8">
                  Let's Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  What type of projects do you typically do?
                </h2>
                <p className="text-gray-600 mb-4">
                  We'll set up paint products for your most common project types.
                </p>
                <p className="text-sm text-blue-600 mb-6 font-medium">
                  ✓ Select one or both options below
                </p>
                <div className="space-y-3">
                  {[
                    { value: 'interior', label: 'Interior Painting', description: 'Walls, ceilings, trim inside homes/buildings' },
                    { value: 'exterior', label: 'Exterior Painting', description: 'Siding, trim, outdoor surfaces' },
                  ].map((type) => (
                    <Button
                      key={type.value}
                      type="button"
                      variant={projectTypes.includes(type.value) ? "default" : "outline"}
                      className={`w-full h-auto p-4 justify-start text-left ${
                        projectTypes.includes(type.value) ? "bg-blue-600 hover:bg-blue-700" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (projectTypes.includes(type.value)) {
                          setProjectTypes(prev => prev.filter(t => t !== type.value));
                        } else {
                          setProjectTypes(prev => [...prev, type.value]);
                        }
                      }}
                    >
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm opacity-75">{type.description}</div>
                      </div>
                      {projectTypes.includes(type.value) && (
                        <CheckCircle className="w-5 h-5 ml-auto" />
                      )}
                    </Button>
                  ))}
                </div>
                {projectTypes.length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✓ Selected: {projectTypes.map(t => t === 'interior' ? 'Interior' : 'Exterior').join(', ')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Choose Your Go-To Paint Products
                </h2>
                <p className="text-gray-600 mb-6">
                  Pick one product from each category - these will be your quick-select options when creating quotes.
                </p>
                
                {projectTypes.map((projectType) => (
                  <div key={projectType} className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize flex items-center gap-2">
                      {projectType} Projects
                      <Badge variant="outline">{projectType === 'interior' ? '4 categories' : '3 categories'}</Badge>
                    </h3>
                    
                    {renderProductSelection('primer', 'Primer', projectType as 'interior' | 'exterior')}
                    {renderProductSelection('wall_paint', 'Wall Paint', projectType as 'interior' | 'exterior')}
                    {projectType === 'interior' && renderProductSelection('ceiling_paint', 'Ceiling Paint', projectType as 'interior' | 'exterior')}
                    {renderProductSelection('trim_paint', 'Trim Paint', projectType as 'interior' | 'exterior')}
                  </div>
                ))}
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Set Your Default Markup Percentage
                </h2>
                <p className="text-gray-600 mb-6">
                  This covers your overhead and profit. You can adjust this for individual quotes.
                </p>
                <div className="space-y-3">
                  {MARKUP_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      variant={markupPercentage === option.value ? "default" : "outline"}
                      className={`w-full h-auto p-4 justify-between text-left relative ${
                        option.recommended ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                      }`}
                      onClick={() => setMarkupPercentage(option.value)}
                    >
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {option.label}
                          {option.recommended && (
                            <Badge className="bg-blue-600">Recommended</Badge>
                          )}
                        </div>
                        <div className="text-sm opacity-75">{option.description}</div>
                      </div>
                      {markupPercentage === option.value && (
                        <CheckCircle className="w-5 h-5" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setCurrentStep(currentStep + 1);
              }}
              disabled={!canProceedFromCurrentStep()}
              className={!canProceedFromCurrentStep() ? "opacity-50 cursor-not-allowed" : ""}
            >
              Next Step
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={saveSetupData}
              disabled={isLoading || !canProceedFromCurrentStep()}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Saving...' : 'Complete Setup'}
              <Rocket className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}