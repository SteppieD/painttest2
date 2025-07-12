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
    <Badge ml-2`}>
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
      <div key={selectedKey}>
        <h4>
          {categoryLabel}
        </h4>
        <div>
          {products.map((product, index) => {
            const isSelected = selectedProducts[selectedKey]?.name === product.name;
            return (
              <Button
                key={index}
                type="button"
                variant={isSelected ? "default" : "outline"}
                ${product.popular ? "ring-1 ring-blue-300" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedProducts(prev => ({
                    ...prev,
                    [selectedKey]: product
                  }))
                }}
              >
                <div>
                  <div>
                    <div>
                      {product.supplier}
                      {product.popular && (
                        <Star />
                      )}
                    </div>
                    <div>{product.name}</div>
                  </div>
                  <div>
                    {getTierBadge(product.tier)}
                    {isSelected && <CheckCircle />}
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
      <div>
        <div>
          <div></div>
          <p>Loading setup...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        {/* Header */}
        <div>
          <h1>
            Welcome to Professional Quote Builder
          </h1>
          <p>
            Let's set up your paint preferences to get you quoting quickly
          </p>
        </div>

        {/* Progress */}
        <div>
          <div>
            <span>Setup Progress</span>
            <span>Step {currentStep} of {totalSteps}</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Steps */}
        <Card>
          <CardContent>
            {currentStep === 1 && (
              <div>
                <Palette />
                <h2>
                  Hi {companyData.company_name}!
                </h2>
                <p>
                  We'll help you set up your preferred paint products and pricing so you can create accurate quotes in seconds.
                </p>
                <div>
                  <div>
                    <CheckCircle />
                    <p>Choose Favorites</p>
                    <p>Pick your go-to products</p>
                  </div>
                  <div>
                    <DollarSign />
                    <p>Set Markup</p>
                    <p>Your profit percentage</p>
                  </div>
                  <div>
                    <Rocket />
                    <p>Start Quoting</p>
                    <p>Create professional quotes</p>
                  </div>
                </div>
                <Button onClick={() => setCurrentStep(2)} size="lg">
                  Let's Get Started
                  <ArrowRight />
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2>
                  What type of projects do you typically do?
                </h2>
                <p>
                  We'll set up paint products for your most common project types.
                </p>
                <p>
                  ✓ Select one or both options below
                </p>
                <div>
                  {[
                    { value: 'interior', label: 'Interior Painting', description: 'Walls, ceilings, trim inside homes/buildings' },
                    { value: 'exterior', label: 'Exterior Painting', description: 'Siding, trim, outdoor surfaces' },
                  ].map((type) => (
                    <Button
                      key={type.value}
                      type="button"
                      variant={projectTypes.includes(type.value) ? "default" : "outline"}
                     `}
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
                        <div>{type.label}</div>
                        <div>{type.description}</div>
                      </div>
                      {projectTypes.includes(type.value) && (
                        <CheckCircle />
                      )}
                    </Button>
                  ))}
                </div>
                {projectTypes.length > 0 && (
                  <div>
                    <p>
                      ✓ Selected: {projectTypes.map(t => t === 'interior' ? 'Interior' : 'Exterior').join(', ')}
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2>
                  Choose Your Go-To Paint Products
                </h2>
                <p>
                  Pick your preferred brand for each category - these will be your quick-select options.
                </p>
                <div>
                  <Info />
                  <div>
                    <p>You'll set your actual prices later</p>
                    <p>Just pick the brands you prefer to work with. You can update your pricing anytime in Settings.</p>
                  </div>
                </div>
                
                {projectTypes.map((projectType) => (
                  <div key={projectType}>
                    <h3>
                      {projectType} Projects
                      <Badge variant="outline">{projectType === 'interior' ? '4 products' : '3 products'}</Badge>
                    </h3>
                    
                    {renderProductSelection('primer', 'Primer', projectType as 'interior' | 'exterior')}
                    {renderProductSelection('wall_paint', 'Wall Paint', projectType as 'interior' | 'exterior')}
                    {projectType === 'interior' && renderProductSelection('ceiling_paint', 'Ceiling Paint', projectType as 'interior' | 'exterior')}
                    {renderProductSelection('trim_paint', 'Trim Paint', projectType as 'interior' | 'exterior')}
                  </div>
                ))}
                
                <div>
                  <Star />
                  = Most popular choice among contractors
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h2>
                  Set Your Default Markup Percentage
                </h2>
                <p>
                  This covers your overhead and profit. You can adjust this for individual quotes.
                </p>
                <div>
                  {MARKUP_OPTIONS.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={markupPercentage === option.value ? "default" : "outline"}
                      ${markupPercentage === option.value ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                      onClick={() => setMarkupPercentage(option.value)}
                    >
                      <div>
                        <div>
                          <span>{option.label}</span>
                          <Badge variant="secondary">
                            {option.tier}
                          </Badge>
                          {option.recommended && (
                            <Badge>Recommended</Badge>
                          )}
                        </div>
                        <div>{option.description}</div>
                      </div>
                      {markupPercentage === option.value && (
                        <CheckCircle />
                      )}
                    </Button>
                  ))}
                </div>
                <div>
                  <p>💡 Tip: Most successful contractors use 20-30% markup to balance competitiveness with profitability.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div>
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
             
            >
              Next Step
              <ArrowRight />
            </Button>
          ) : (
            <Button
              onClick={saveSetupData}
              disabled={isLoading || !canProceedFromCurrentStep()}
             
            >
              {isLoading ? 'Saving...' : 'Complete Setup'}
              <Rocket />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}