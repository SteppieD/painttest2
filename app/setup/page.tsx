"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { SimplifiedConversationalWizard } from "@/components/setup/simplified-conversational-wizard";
import { trackSetupStarted, trackSetupCompleted, trackPageView } from "@/lib/analytics/tracking";
import { OnboardingProgressBar } from "@/components/ui/onboarding-progress-bar";

function SetupPageContent() {
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
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
      // Save company information
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

      trackSetupCompleted('conversational', paintProducts.length);
      
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <SimplifiedConversationalWizard
        accessCode={accessCode}
        onComplete={handleSetupComplete}
        onSkip={handleSkipSetup}
        isUpdate={searchParams.get('update') === 'true'}
      />
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