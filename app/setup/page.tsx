"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, Palette, DollarSign, Rocket, ArrowRight, Star, Info, Clock, AlertCircle } from "lucide-react";
import { trackSetupStarted, trackSetupCompleted, trackPageView } from "@/lib/analytics/tracking";

interface SetupChoice {
  id: string;
  title: string;
  description: string;
  time: string;
  recommended?: boolean;
}

const SETUP_PATHS: SetupChoice[] = [
  {
    id: 'quick',
    title: 'Quick Start (30 seconds)',
    description: 'Use industry-standard defaults and start quoting immediately. Perfect for testing.',
    time: '30 sec',
    recommended: true
  },
  {
    id: 'guided',
    title: 'Guided Setup (2 minutes)',
    description: 'Pick from popular paint brands with suggested pricing. Ideal for most contractors.',
    time: '2 min'
  },
  {
    id: 'custom',
    title: 'Custom Setup (5 minutes)',
    description: 'Enter your exact products and pricing. Best for contractors with established suppliers.',
    time: '5 min'
  },
  {
    id: 'later',
    title: 'Set Up Later',
    description: 'Skip setup for now and configure your preferences when you have time.',
    time: 'Now'
  }
];

const QUICK_DEFAULTS = {
  interior: {
    primer: { supplier: "Kilz", name: "Premium Primer", cost: 28 },
    wall_paint: { supplier: "Sherwin-Williams", name: "ProClassic", cost: 58 },
    ceiling_paint: { supplier: "Sherwin-Williams", name: "ProMar 200", cost: 45 },
    trim_paint: { supplier: "Benjamin Moore", name: "Advance", cost: 68 }
  },
  exterior: {
    primer: { supplier: "Sherwin-Williams", name: "ProBlock", cost: 42 },
    wall_paint: { supplier: "Sherwin-Williams", name: "Duration", cost: 75 },
    trim_paint: { supplier: "Benjamin Moore", name: "Aura Exterior", cost: 85 }
  },
  markup: 45 // 45% markup
};

function SetupWizardContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPath, setSelectedPath] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    // Try to get access code from URL parameters first
    const code = searchParams.get('access_code');
    if (code) {
      setAccessCode(code);
      return;
    }
    
    // If not in URL, try to get from localStorage (where auth stores it)
    const companyData = localStorage.getItem('paintquote_company');
    if (companyData) {
      try {
        const company = JSON.parse(companyData);
        if (company.accessCode) {
          setAccessCode(company.accessCode);
          return;
        }
      } catch (error) {
        console.error('Error parsing company data:', error);
      }
    }
    
    // If no access code available, redirect to access code page
    router.push('/access-code');
  }, [searchParams, router]);

  const handlePathSelection = async (pathId: string) => {
    setSelectedPath(pathId);
    setIsLoading(true);

    try {
      if (pathId === 'quick') {
        // Apply quick defaults
        await applyQuickDefaults();
      } else if (pathId === 'later') {
        // Skip setup entirely
        await skipSetup();
      } else {
        // Continue to guided/custom setup
        setCurrentStep(1);
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error('Setup error:', error);
      toast({
        title: "Setup Error",
        description: "There was an issue with setup. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const applyQuickDefaults = async () => {
    try {
      console.log('Applying quick defaults with access code:', accessCode);
      
      if (!accessCode) {
        throw new Error('Access code is missing');
      }
      
      // Save quick defaults to the database
      const response = await fetch('/api/companies/setup-quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_code: accessCode,
          defaults: QUICK_DEFAULTS
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Track setup completion
        trackSetupCompleted('quick', data.company_name || 'Unknown Company');
        
        toast({
          title: "Setup Complete!",
          description: "Your account is ready with industry-standard defaults. You can update preferences anytime in Settings.",
        });
        
        // Redirect to dashboard
        router.push(`/dashboard?access_code=${accessCode}`);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Setup failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Quick setup error:', error);
      toast({
        title: "Setup Error",
        description: error instanceof Error ? error.message : "Failed to complete setup. Please try again.",
        variant: "destructive",
      });
      // Don't throw - let the main handler manage loading state
    }
  };

  const skipSetup = async () => {
    try {
      console.log('Skipping setup with access code:', accessCode);
      
      if (!accessCode) {
        throw new Error('Access code is missing');
      }
      
      // Mark setup as skipped but don't apply any defaults
      const response = await fetch('/api/companies/setup-skip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_code: accessCode
        }),
      });

      if (response.ok) {
        toast({
          title: "Setup Skipped",
          description: "You can configure your preferences anytime from Settings → Products.",
        });
        
        // Redirect to dashboard
        router.push(`/dashboard?access_code=${accessCode}`);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Skip setup failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Skip setup error:', error);
      toast({
        title: "Setup Error",
        description: error instanceof Error ? error.message : "Failed to skip setup. Please try again.",
        variant: "destructive",
      });
      // Don't throw - let the main handler manage loading state
    }
  };

  const getStepProgress = () => {
    if (selectedPath === 'quick' || selectedPath === 'later') return 100;
    return ((currentStep + 1) / 4) * 100;
  };

  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-[#ef2b70] to-[#ff6b9d] p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Palette className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Paint Quote Pro!</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose how you'd like to set up your account. Don't worry - you can always change these settings later.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {SETUP_PATHS.map((path) => (
              <Card 
                key={path.id}
                className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                  path.recommended 
                    ? 'border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50 ring-2 ring-pink-100' 
                    : 'border-gray-200 hover:border-[#ef2b70]'
                } ${selectedPath === path.id ? 'ring-2 ring-[#ef2b70]' : ''}`}
                onClick={() => {
                  setSelectedPath(path.id);
                  trackSetupStarted(path.id);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      {path.title}
                      {path.recommended && (
                        <Badge className="ml-2 bg-gradient-to-r from-[#ef2b70] to-[#ff6b9d] text-white">Recommended</Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {path.time}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {path.description}
                  </p>
                  
                  {path.id === 'quick' && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <p className="text-xs font-medium text-gray-700 mb-2">Includes:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Popular paint brands (Sherwin-Williams, Benjamin Moore, Kilz)</li>
                        <li>• Industry-standard pricing ($28-$85/gallon)</li>
                        <li>• 45% markup (typical for residential painting)</li>
                        <li>• Ready to quote immediately</li>
                      </ul>
                    </div>
                  )}
                  
                  {path.id === 'later' && (
                    <div className="mt-3 p-3 bg-amber-50 rounded border border-amber-200">
                      <div className="flex items-start">
                        <AlertCircle className="w-4 h-4 text-amber-600 mr-2 mt-0.5" />
                        <p className="text-xs text-amber-700">
                          You'll need to set up products and pricing before creating quotes.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => handlePathSelection(selectedPath)}
              disabled={!selectedPath || isLoading}
              size="lg"
              className="px-8"
            >
              {isLoading ? (
                <>Loading...</>
              ) : selectedPath === 'quick' ? (
                <>Apply Quick Setup <ArrowRight className="w-4 h-4 ml-2" /></>
              ) : selectedPath === 'later' ? (
                <>Skip Setup <ArrowRight className="w-4 h-4 ml-2" /></>
              ) : selectedPath ? (
                <>Continue <ArrowRight className="w-4 h-4 ml-2" /></>
              ) : (
                'Select an option above'
              )}
            </Button>
            
            {selectedPath && (
              <p className="text-sm text-gray-500 mt-3">
                {selectedPath === 'quick' && "Perfect for getting started quickly with tested defaults"}
                {selectedPath === 'guided' && "We'll help you pick from popular options"}
                {selectedPath === 'custom' && "Full control over your product selection"}
                {selectedPath === 'later' && "You can always set this up from Settings → Products"}
              </p>
            )}
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center text-sm text-gray-500">
              <Info className="w-4 h-4 mr-2" />
              All settings can be changed anytime from your dashboard
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For guided/custom setup, continue with existing flow...
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {selectedPath === 'guided' ? 'Guided Setup' : 'Custom Setup'}
              </CardTitle>
              <Badge variant="outline">Step {currentStep} of 4</Badge>
            </div>
            <Progress value={getStepProgress()} className="mt-2" />
          </CardHeader>
          <CardContent>
            <p>Continue with {selectedPath} setup flow...</p>
            {/* Existing setup steps would go here */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SetupWizard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetupWizardContent />
    </Suspense>
  );
}