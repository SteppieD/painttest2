"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { SimplifiedConversationalWizard } from "@/components/setup/simplified-conversational-wizard";
import { ContractorChargeRatesWizard } from "@/components/setup/contractor-charge-rates-wizard";
import { ComprehensiveContractorWizard } from "@/components/setup/comprehensive-contractor-wizard";
import { trackSetupStarted, trackSetupCompleted, trackPageView } from "@/lib/analytics/tracking";
import { OnboardingProgressBar } from "@/components/ui/onboarding-progress-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Palette, BarChart3 } from "lucide-react";

function SetupPageContent() {
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [setupMode, setSetupMode] = useState<'comprehensive' | 'charge-rates' | 'traditional' | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    trackPageView('/setup');
    
    // Try to get access code from URL parameters first
    const code = searchParams.get('access_code');
    if (code) {
      setAccessCode(code);
      setIsLoading(false);
      trackSetupStarted('conversational');
      return;
    }
    
    // If not in URL, try to get from localStorage (where auth stores it)
    const companyData = localStorage.getItem('paintquote_company');
    if (companyData) {
      try {
        const company = JSON.parse(companyData);
        if (company.accessCode) {
          setAccessCode(company.accessCode);
          setIsLoading(false);
          trackSetupStarted('conversational');
          return;
        }
      } catch (error) {
        console.error('Error parsing company data:', error);
      }
    }
    
    // If no access code available, redirect to access code page
    router.push('/access-code');
  }, [searchParams, router]);

  const handleSetupComplete = async (setupData: any) => {
    try {
      // Check if this is comprehensive or charge rates setup
      const isChargeRatesSetup = 'wall_charge_rate' in setupData;
      const isComprehensiveSetup = isChargeRatesSetup && 'interior_wall_paint_brand' in setupData;
      
      if (isChargeRatesSetup) {
        // Save charge rates to settings
        const settingsResponse = await fetch(`/api/companies/settings?companyId=1`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...setupData,
            // Ensure the charge rates are properly saved
            wall_charge_rate: setupData.wall_charge_rate,
            ceiling_charge_rate: setupData.ceiling_charge_rate,
            baseboard_charge_rate: setupData.baseboard_charge_rate,
            crown_molding_charge_rate: setupData.crown_molding_charge_rate,
            door_charge_rate: setupData.door_charge_rate,
            window_charge_rate: setupData.window_charge_rate,
            exterior_wall_charge_rate: setupData.exterior_wall_charge_rate,
            soffit_charge_rate: setupData.soffit_charge_rate,
            fascia_charge_rate: setupData.fascia_charge_rate,
            exterior_door_charge_rate: setupData.exterior_door_charge_rate,
            exterior_window_charge_rate: setupData.exterior_window_charge_rate,
            overhead_percentage: setupData.overhead_percentage,
            default_markup_percentage: setupData.default_markup_percentage,
            tax_rate: setupData.tax_rate,
            tax_on_materials_only: setupData.tax_on_materials_only
          })
        });

        if (!settingsResponse.ok) {
          throw new Error('Failed to save charge rates');
        }
        
        // Also save company info
        const companyResponse = await fetch('/api/companies/complete-setup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accessCode,
            companyName: setupData.companyName,
            address: setupData.address,
            phone: setupData.phone,
            email: setupData.email,
            setupType: 'charge-rates'
          })
        });

        if (!companyResponse.ok) {
          throw new Error('Failed to save company information');
        }
        
        // If comprehensive setup, also save paint products
        if (isComprehensiveSetup) {
          const paintProducts = [];
          
          // Interior wall paint
          if (setupData.interior_wall_paint_brand) {
            paintProducts.push({
              category: 'wall_paint',
              project_type: 'interior',
              supplier: setupData.interior_wall_paint_brand,
              name: setupData.interior_wall_paint_product,
              cost_per_gallon: setupData.interior_wall_paint_cost,
              coverage: setupData.interior_wall_paint_coverage,
              coverage_unit: 'square feet'
            });
          }
          
          // Interior ceiling paint
          if (setupData.interior_ceiling_paint_brand) {
            paintProducts.push({
              category: 'ceiling_paint',
              project_type: 'interior',
              supplier: setupData.interior_ceiling_paint_brand,
              name: setupData.interior_ceiling_paint_product,
              cost_per_gallon: setupData.interior_ceiling_paint_cost,
              coverage: setupData.interior_ceiling_paint_coverage,
              coverage_unit: 'square feet'
            });
          }
          
          // Primer
          if (setupData.primer_brand) {
            paintProducts.push({
              category: 'primer',
              project_type: 'both',
              supplier: setupData.primer_brand,
              name: setupData.primer_product,
              cost_per_gallon: setupData.primer_cost,
              coverage: setupData.primer_coverage,
              coverage_unit: 'square feet'
            });
          }
          
          // Trim paint
          if (setupData.trim_paint_brand) {
            paintProducts.push({
              category: 'trim_paint',
              project_type: 'both',
              supplier: setupData.trim_paint_brand,
              name: setupData.trim_paint_product,
              cost_per_gallon: setupData.trim_paint_cost,
              coverage: setupData.trim_paint_coverage,
              coverage_unit: 'linear feet'
            });
          }
          
          // Exterior wall paint
          if (setupData.exterior_wall_paint_brand) {
            paintProducts.push({
              category: 'wall_paint',
              project_type: 'exterior',
              supplier: setupData.exterior_wall_paint_brand,
              name: setupData.exterior_wall_paint_product,
              cost_per_gallon: setupData.exterior_wall_paint_cost,
              coverage: setupData.exterior_wall_paint_coverage,
              coverage_unit: 'square feet'
            });
          }
          
          // Save paint products
          if (paintProducts.length > 0) {
            const paintResponse = await fetch('/api/companies/paints', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                accessCode,
                products: paintProducts
              })
            });

            if (!paintResponse.ok) {
              console.error('Failed to save paint products');
            }
          }
        }
        
        trackSetupCompleted(isComprehensiveSetup ? 'comprehensive' : 'charge-rates', 'complete');
        
        toast({
          title: isComprehensiveSetup ? "Complete Business Setup!" : "Charge Rates Setup Complete!",
          description: isComprehensiveSetup 
            ? "Your pricing AND product costs are saved. The system will track profit margins automatically!" 
            : "Your contractor charge rates have been saved. Labor is automatically calculated as 30% of each rate.",
        });
        
        router.push('/dashboard');
        return;
      }
      
      // Original setup flow for traditional setup
      const companyResponse = await fetch('/api/companies/complete-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessCode,
          companyName: setupData.companyName,
          address: setupData.address,
          phone: setupData.phone,
          email: setupData.email,
          setupType: 'conversational'
        })
      });

      if (!companyResponse.ok) {
        throw new Error('Failed to save company information');
      }

      // Save paint products
      const paintProducts = [];

      // Primer
      if (setupData.primer) {
        paintProducts.push({
          category: 'primer',
          project_type: 'both',
          supplier: setupData.primer.brand,
          name: setupData.primer.product,
          cost_per_gallon: setupData.primer.costPerGallon,
          coverage: setupData.primer.coverage,
          coverage_unit: setupData.primer.coverageUnit || 'square feet'
        });
      }

      // Interior products
      if (setupData.interiorWalls) {
        paintProducts.push({
          category: 'wall_paint',
          project_type: 'interior',
          supplier: setupData.interiorWalls.brand,
          name: setupData.interiorWalls.product,
          cost_per_gallon: setupData.interiorWalls.costPerGallon,
          coverage: setupData.interiorWalls.coverage,
          coverage_unit: setupData.interiorWalls.coverageUnit || 'square feet'
        });
      }

      if (setupData.interiorCeilings) {
        paintProducts.push({
          category: 'ceiling_paint',
          project_type: 'interior',
          supplier: setupData.interiorCeilings.brand,
          name: setupData.interiorCeilings.product,
          cost_per_gallon: setupData.interiorCeilings.costPerGallon,
          coverage: setupData.interiorCeilings.coverage,
          coverage_unit: setupData.interiorCeilings.coverageUnit || 'square feet'
        });
      }

      if (setupData.trim) {
        paintProducts.push({
          category: 'trim_paint',
          project_type: 'interior',
          supplier: setupData.trim.brand,
          name: setupData.trim.product,
          cost_per_gallon: setupData.trim.costPerGallon,
          coverage: setupData.trim.coverage,
          coverage_unit: setupData.trim.coverageUnit || 'linear feet'
        });
      }

      if (setupData.doors) {
        paintProducts.push({
          category: 'door_paint',
          project_type: 'interior',
          supplier: setupData.doors.brand,
          name: setupData.doors.product,
          cost_per_gallon: setupData.doors.costPerGallon,
          coverage: setupData.doors.coverage,
          coverage_unit: setupData.doors.coverageUnit || 'doors'
        });
      }

      // Exterior products
      if (setupData.exteriorWalls) {
        paintProducts.push({
          category: 'wall_paint',
          project_type: 'exterior',
          supplier: setupData.exteriorWalls.brand,
          name: setupData.exteriorWalls.product,
          cost_per_gallon: setupData.exteriorWalls.costPerGallon,
          coverage: setupData.exteriorWalls.coverage,
          coverage_unit: setupData.exteriorWalls.coverageUnit || 'square feet'
        });
      }

      if (setupData.exteriorSoffits) {
        paintProducts.push({
          category: 'ceiling_paint',
          project_type: 'exterior',
          supplier: setupData.exteriorSoffits.brand,
          name: setupData.exteriorSoffits.product,
          cost_per_gallon: setupData.exteriorSoffits.costPerGallon,
          coverage: setupData.exteriorSoffits.coverage,
          coverage_unit: setupData.exteriorSoffits.coverageUnit || 'square feet'
        });
      }

      if (setupData.exteriorTrim) {
        paintProducts.push({
          category: 'trim_paint',
          project_type: 'exterior',
          supplier: setupData.exteriorTrim.brand,
          name: setupData.exteriorTrim.product,
          cost_per_gallon: setupData.exteriorTrim.costPerGallon,
          coverage: setupData.exteriorTrim.coverage,
          coverage_unit: setupData.exteriorTrim.coverageUnit || 'linear feet'
        });
      }

      if (setupData.exteriorDoors) {
        paintProducts.push({
          category: 'door_paint',
          project_type: 'exterior',
          supplier: setupData.exteriorDoors.brand,
          name: setupData.exteriorDoors.product,
          cost_per_gallon: setupData.exteriorDoors.costPerGallon,
          coverage: setupData.exteriorDoors.coverage,
          coverage_unit: setupData.exteriorDoors.coverageUnit || 'doors'
        });
      }

      // Save paint products in batch
      if (paintProducts.length > 0) {
        const paintResponse = await fetch('/api/companies/paints', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accessCode,
            products: paintProducts
          })
        });

        if (!paintResponse.ok) {
          throw new Error('Failed to save paint products');
        }
      }

      trackSetupCompleted('conversational', paintProducts.length.toString());
      
      toast({
        title: "Setup Complete!",
        description: "Your company profile and paint products have been saved.",
      });

      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Setup error:', error);
      toast({
        title: "Setup Error",
        description: "There was a problem saving your setup. Please try again.",
        variant: "destructive",
      });
      throw error; // Re-throw to let the wizard handle the UI
    }
  };

  const handleSkipSetup = () => {
    // Save minimal setup
    fetch('/api/companies/setup-skip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessCode })
    }).finally(() => {
      router.push('/dashboard');
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check setup mode (can be controlled by query param or user selection)
  const forceMode = searchParams.get('mode');
  const showComprehensive = forceMode === 'comprehensive' || setupMode === 'comprehensive';
  const showChargeRates = forceMode === 'charge-rates' || setupMode === 'charge-rates';
  const showTraditional = forceMode === 'traditional' || setupMode === 'traditional';

  if (!setupMode && !forceMode) {
    // Show setup mode selection
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-center mb-8">Choose Your Setup Method</h1>
          
          <div className="grid gap-6">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-blue-500"
              onClick={() => setSetupMode('comprehensive')}
            >
              <CardContent className="p-6">
                <div className="absolute top-2 right-2">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">RECOMMENDED</span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Complete Business Setup</h3>
                    <p className="text-gray-600 mb-3">
                      Configure BOTH customer pricing AND track your actual product costs. 
                      Get automatic profit margin tracking on every quote.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• ✅ Customer charge rates (labor + materials)</li>
                      <li>• ✅ Product cost tracking</li>
                      <li>• ✅ Automatic profit margin calculation</li>
                      <li>• ✅ Business insights and analytics</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSetupMode('charge-rates')}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Charge Rates Only</h3>
                    <p className="text-gray-600 mb-3">
                      Quick setup for customer pricing only. Rates include both labor and materials.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• Customer charge rates only</li>
                      <li>• No product cost tracking</li>
                      <li>• Faster setup process</li>
                      <li>• Limited business insights</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSetupMode('traditional')}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <Palette className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Traditional Paint Products</h3>
                    <p className="text-gray-600 mb-3">
                      Legacy setup for paint products only. Does not include charge rates.
                    </p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• Paint brands and products</li>
                      <li>• Material costs only</li>
                      <li>• Manual labor calculation</li>
                      <li>• Legacy system</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button variant="ghost" onClick={handleSkipSetup} className="text-gray-500">
              Skip setup for now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {showComprehensive ? (
        <ComprehensiveContractorWizard
          accessCode={accessCode}
          onComplete={handleSetupComplete}
          onSkip={handleSkipSetup}
          isUpdate={searchParams.get('update') === 'true'}
        />
      ) : showChargeRates ? (
        <ContractorChargeRatesWizard
          accessCode={accessCode}
          onComplete={handleSetupComplete}
          onSkip={handleSkipSetup}
          isUpdate={searchParams.get('update') === 'true'}
        />
      ) : (
        <SimplifiedConversationalWizard
          accessCode={accessCode}
          onComplete={handleSetupComplete}
          onSkip={handleSkipSetup}
          isUpdate={searchParams.get('update') === 'true'}
        />
      )}
    </div>
  );
}

export default function SetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SetupPageContent />
    </Suspense>
  );
}