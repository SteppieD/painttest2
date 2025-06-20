"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, Palette, DollarSign, Rocket, ArrowRight, Star, Info } from "lucide-react";

interface PaintProduct {
  supplier: string;
  name: string;
  tier: 'good' | 'better' | 'best';
  popular?: boolean;
}

const POPULAR_PRODUCTS = {
  interior: {
    primer: [
      { supplier: "Kilz", name: "Premium Primer", tier: 'good' as const, popular: true },
      { supplier: "Zinsser", name: "Bulls Eye 1-2-3", tier: 'better' as const },
      { supplier: "Sherwin-Williams", name: "ProBlock", tier: 'best' as const },
    ],
    wall_paint: [
      { supplier: "Sherwin-Williams", name: "ProClassic", tier: 'best' as const, popular: true },
      { supplier: "Benjamin Moore", name: "Regal Select", tier: 'best' as const },
      { supplier: "Behr", name: "Premium Plus Ultra", tier: 'better' as const },
    ],
    ceiling_paint: [
      { supplier: "Sherwin-Williams", name: "ProMar 200", tier: 'better' as const, popular: true },
      { supplier: "Benjamin Moore", name: "Waterborne Ceiling", tier: 'best' as const },
      { supplier: "Behr", name: "Premium Plus", tier: 'good' as const },
    ],
    trim_paint: [
      { supplier: "Benjamin Moore", name: "Advance", tier: 'best' as const, popular: true },
      { supplier: "Sherwin-Williams", name: "ProClassic", tier: 'best' as const },
      { supplier: "PPG", name: "Break-Through!", tier: 'best' as const },
    ],
  },
  exterior: {
    primer: [
      { supplier: "Kilz", name: "Adhesion Primer", tier: 'better' as const },
      { supplier: "Zinsser", name: "Cover Stain", tier: 'better' as const, popular: true },
      { supplier: "Benjamin Moore", name: "Fresh Start", tier: 'best' as const },
    ],
    wall_paint: [
      { supplier: "Sherwin-Williams", name: "Duration", tier: 'best' as const, popular: true },
      { supplier: "Benjamin Moore", name: "Aura Exterior", tier: 'best' as const },
      { supplier: "Behr", name: "Marquee", tier: 'better' as const },
    ],
    trim_paint: [
      { supplier: "Benjamin Moore", name: "Advance Exterior", tier: 'best' as const },
      { supplier: "Sherwin-Williams", name: "ProClassic", tier: 'best' as const, popular: true },
      { supplier: "PPG", name: "Manor Hall", tier: 'better' as const },
    ],
  },
};

const MARKUP_OPTIONS = [
  { value: 10, label: "10%", description: "Competitive pricing for high-volume work", tier: "Conservative" },
  { value: 20, label: "20%", description: "Industry standard for most contractors", tier: "Standard", recommended: true },
  { value: 30, label: "30%", description: "Quality-focused pricing", tier: "Premium" },
  { value: 40, label: "40%", description: "High-end residential & commercial", tier: "Luxury" },
];

const getTierBadge = (tier: string) => {
  const colors = {
    good: "bg-green-100 text-green-800",
    better: "bg-blue-100 text-blue-800", 
    best: "bg-purple-100 text-purple-800"
  };
  
  const labels = {
    good: "Good",
    better: "Better",
    best: "Best"
  };
  
  return (
    <Badge className={`${colors[tier as keyof typeof colors]} ml-2`}>
      {labels[tier as keyof typeof labels]}
    </Badge>
  );
};

export default function SetupPageImproved() {
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
                type="button"
                variant={isSelected ? "default" : "outline"}
                className={`h-auto p-4 justify-start text-left ${
                  isSelected ? "bg-blue-600 text-white hover:bg-blue-700" : ""
                } ${product.popular ? "ring-1 ring-blue-300" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedProducts(prev => ({
                    ...prev,
                    [selectedKey]: product
                  }))
                }}
              >
                <div className="flex justify-between items-center w-full">
                  <div className="flex-1">
                    <div className="font-medium flex items-center">
                      {product.supplier}
                      {product.popular && (
                        <Star className="w-4 h-4 ml-2 fill-current text-yellow-500" />
                      )}
                    </div>
                    <div className="text-sm opacity-75">{product.name}</div>
                  </div>
                  <div className="flex items-center">
                    {getTierBadge(product.tier)}
                    {isSelected && <CheckCircle className="w-5 h-5 ml-2" />}
                  </div>
                </div>
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
      // For now, we'll save with default prices that contractors can update later
      const defaultPrices = {
        good: { primer: 25, wall_paint: 40, ceiling_paint: 35, trim_paint: 55 },
        better: { primer: 30, wall_paint: 50, ceiling_paint: 45, trim_paint: 65 },
        best: { primer: 40, wall_paint: 65, ceiling_paint: 55, trim_paint: 75 }
      };

      const products = Object.entries(selectedProducts).map(([key, product]) => {
        const [projectType, ...categoryParts] = key.split('_');
        const category = categoryParts.join('_');
        const basePrice = defaultPrices[product.tier as keyof typeof defaultPrices][category as keyof typeof defaultPrices.good];
        
        return {
          projectType,
          productCategory: category,
          supplier: product.supplier,
          productName: product.name,
          costPerGallon: basePrice || 50, // Default fallback
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
        description: "Your paint preferences have been saved. You can update prices anytime in Settings.",
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
      case 1: return true;
      case 2: return projectTypes.length > 0;
      case 3: 
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
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Choose Your Go-To Paint Products
                </h2>
                <p className="text-gray-600 mb-2">
                  Pick your preferred brand for each category - these will be your quick-select options.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">You'll set your actual prices later</p>
                    <p>Just pick the brands you prefer to work with. You can update your pricing anytime in Settings.</p>
                  </div>
                </div>
                
                {projectTypes.map((projectType) => (
                  <div key={projectType} className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize flex items-center gap-2">
                      {projectType} Projects
                      <Badge variant="outline">{projectType === 'interior' ? '4 products' : '3 products'}</Badge>
                    </h3>
                    
                    {renderProductSelection('primer', 'Primer', projectType as 'interior' | 'exterior')}
                    {renderProductSelection('wall_paint', 'Wall Paint', projectType as 'interior' | 'exterior')}
                    {projectType === 'interior' && renderProductSelection('ceiling_paint', 'Ceiling Paint', projectType as 'interior' | 'exterior')}
                    {renderProductSelection('trim_paint', 'Trim Paint', projectType as 'interior' | 'exterior')}
                  </div>
                ))}
                
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current text-yellow-500" />
                  = Most popular choice among contractors
                </div>
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
                      type="button"
                      variant={markupPercentage === option.value ? "default" : "outline"}
                      className={`w-full h-auto p-4 justify-between text-left relative ${
                        option.recommended ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                      } ${markupPercentage === option.value ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                      onClick={() => setMarkupPercentage(option.value)}
                    >
                      <div className="flex-1">
                        <div className="font-medium flex items-center gap-2">
                          <span className="text-lg">{option.label}</span>
                          <Badge variant="secondary" className="font-normal">
                            {option.tier}
                          </Badge>
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
                <div className="mt-4 text-sm text-gray-600">
                  <p>💡 Tip: Most successful contractors use 20-30% markup to balance competitiveness with profitability.</p>
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