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
      <div>
        <div>
          <div>
            <div>
              <Palette />
            </div>
            <h1>Welcome to Paint Quote Pro!</h1>
            <p>
              Choose how you'd like to set up your account. Don't worry - you can always change these settings later.
            </p>
          </div>

          <div>
            {SETUP_PATHS.map((path) => (
              <Card 
                key={path.id}
                ${selectedPath === path.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => {
                  setSelectedPath(path.id);
                  trackSetupStarted(path.id);
                }}
              >
                <CardHeader>
                  <div>
                    <CardTitle>
                      {path.title}
                      {path.recommended && (
                        <Badge>Recommended</Badge>
                      )}
                    </CardTitle>
                    <div>
                      <Clock />
                      {path.time}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>
                    {path.description}
                  </p>
                  
                  {path.id === 'quick' && (
                    <div>
                      <p>Includes:</p>
                      <ul>
                        <li>• Popular paint brands (Sherwin-Williams, Benjamin Moore, Kilz)</li>
                        <li>• Industry-standard pricing ($28-$85/gallon)</li>
                        <li>• 45% markup (typical for residential painting)</li>
                        <li>• Ready to quote immediately</li>
                      </ul>
                    </div>
                  )}
                  
                  {path.id === 'later' && (
                    <div>
                      <div>
                        <AlertCircle />
                        <p>
                          You'll need to set up products and pricing before creating quotes.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Button
              onClick={() => handlePathSelection(selectedPath)}
              disabled={!selectedPath || isLoading}
              size="lg"
             
            >
              {isLoading ? (
                <>Loading...</>
              ) : selectedPath === 'quick' ? (
                <>Apply Quick Setup <ArrowRight /></>
              ) : selectedPath === 'later' ? (
                <>Skip Setup <ArrowRight /></>
              ) : selectedPath ? (
                <>Continue <ArrowRight /></>
              ) : (
                'Select an option above'
              )}
            </Button>
            
            {selectedPath && (
              <p>
                {selectedPath === 'quick' && "Perfect for getting started quickly with tested defaults"}
                {selectedPath === 'guided' && "We'll help you pick from popular options"}
                {selectedPath === 'custom' && "Full control over your product selection"}
                {selectedPath === 'later' && "You can always set this up from Settings → Products"}
              </p>
            )}
          </div>

          <div>
            <div>
              <Info />
              All settings can be changed anytime from your dashboard
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For guided/custom setup, continue with existing flow...
  return (
    <div>
      <div>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>
                {selectedPath === 'guided' ? 'Guided Setup' : 'Custom Setup'}
              </CardTitle>
              <Badge variant="outline">Step {currentStep} of 4</Badge>
            </div>
            <Progress value={getStepProgress()} />
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