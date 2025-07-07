"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "./card";
import { Button } from "./button";
import { Badge } from "./badge";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Play, 
  Zap, 
  Palette, 
  Calculator,
  TrendingUp,
  X,
  Lightbulb,
  Star,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  content: string;
  highlight?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  tip?: string;
}

interface OnboardingTourProps {
  companyName: string;
  onComplete: () => void;
  onSkip: () => void;
  className?: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your Modern Dashboard',
    description: 'Experience Apple and Google-inspired design built specifically for painting contractors',
    content: 'This new interface makes quote creation 80% faster than traditional methods. Everything is designed around your workflow - from express quotes to professional presentations.',
    highlight: 'Fast, Professional, Mobile-Ready',
    tip: 'Swipe through this tour to see how it works!'
  },
  {
    id: 'express-quotes',
    title: 'Express Quote Creation',
    description: 'Create quotes in 30 seconds using room templates',
    content: 'Skip the chat interface for standard jobs. Pick from pre-built room templates, adjust dimensions, and get instant pricing. Perfect for quick estimates on-site.',
    highlight: '30-second quotes',
    action: {
      label: 'Try Express Quote',
      onClick: () => console.log('Navigate to express quote')
    },
    tip: 'Great for repeat customers and standard room configurations'
  },
  {
    id: 'smart-suggestions',
    title: 'Smart Learning System',
    description: 'The system learns from your quote history',
    content: 'After a few quotes, the system remembers your preferred room sizes, paint choices, and pricing. It will suggest dimensions and materials based on your patterns.',
    highlight: 'Learns your preferences',
    tip: 'The more you use it, the smarter it gets!'
  },
  {
    id: 'professional-quotes',
    title: 'Client-Ready Presentations',
    description: 'Impress customers with professional quote presentations',
    content: 'Every quote becomes a beautiful, professional presentation with your branding, detailed breakdowns, and terms. Customers can review and accept quotes digitally.',
    highlight: 'Professional presentation',
    tip: 'Increase your win rate with professional-looking quotes'
  },
  {
    id: 'mobile-optimized',
    title: 'Mobile-First Design',
    description: 'Works perfectly on phones and tablets',
    content: 'Touch-optimized buttons, smart keyboard handling, and offline capability. Create quotes in the field, take measurements, and send estimates immediately.',
    highlight: 'Works everywhere',
    tip: 'Perfect for on-site estimates and measurements'
  },
  {
    id: 'dashboard-insights',
    title: 'Business Intelligence',
    description: 'Track your performance with actionable insights',
    content: 'See revenue trends, quote acceptance rates, and identify your most profitable services. The dashboard shows what matters most to growing your business.',
    highlight: 'Grow your business',
    tip: 'Make data-driven decisions about pricing and services'
  }
];

export function OnboardingTour({
  companyName,
  onComplete,
  onSkip,
  className
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('paintquote_onboarding_completed');
    if (!hasSeenOnboarding) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('paintquote_onboarding_completed', 'true');
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('paintquote_onboarding_completed', 'true');
    setIsVisible(false);
    onSkip();
  };

  const currentStepData = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className={cn("w-full max-w-2xl mx-auto", className)}>
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <div className="design-inline mb-4">
              <div>
                <h2 className="text-2xl font-bold">Welcome, {companyName}!</h2>
                <p className="text-blue-100">Let's explore your modern quoting interface</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-blue-500 bg-opacity-30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="mt-2 text-sm text-blue-100">
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-6">
              {/* Step Icon */}
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {currentStep === 0 && <Star className="w-8 h-8 text-blue-600" />}
                {currentStep === 1 && <Zap className="w-8 h-8 text-blue-600" />}
                {currentStep === 2 && <Lightbulb className="w-8 h-8 text-blue-600" />}
                {currentStep === 3 && <Palette className="w-8 h-8 text-blue-600" />}
                {currentStep === 4 && <Calculator className="w-8 h-8 text-blue-600" />}
                {currentStep === 5 && <TrendingUp className="w-8 h-8 text-blue-600" />}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {currentStepData.title}
              </h3>
              
              <p className="text-lg text-gray-600 mb-4">
                {currentStepData.description}
              </p>

              {currentStepData.highlight && (
                <Badge className="bg-green-100 text-green-700 mb-4">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  {currentStepData.highlight}
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {currentStepData.content}
              </p>

              {currentStepData.tip && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="design-inline">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">Pro Tip</p>
                      <p className="text-sm text-yellow-700">{currentStepData.tip}</p>
                    </div>
                  </div>
                </div>
              )}

              {currentStepData.action && (
                <div className="text-center">
                  <Button
                    onClick={currentStepData.action.onClick}
                    className="design-button design-button-primary"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {currentStepData.action.label}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="px-8 pb-6">
            <div className="design-inline">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="design-button design-button-secondary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="design-inline">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Skip Tour
                </Button>

                <Button
                  onClick={handleNext}
                  className="design-button design-button-primary"
                >
                  {currentStep === ONBOARDING_STEPS.length - 1 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Get Started
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Quick onboarding checklist for existing users
export function OnboardingChecklist({
  companyId,
  onAllComplete,
  className
}: {
  companyId: number;
  onAllComplete: () => void;
  className?: string;
}) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const checklistItems = [
    {
      id: 'express_quote',
      title: 'Try Express Quote',
      description: 'Create a 30-second quote',
      icon: Zap,
      action: () => console.log('Navigate to express quote')
    },
    {
      id: 'room_template',
      title: 'Use Room Templates',
      description: 'Pick a pre-built room configuration',
      icon: Palette,
      action: () => console.log('Show room templates')
    },
    {
      id: 'mobile_test',
      title: 'Test on Mobile',
      description: 'Open on your phone or tablet',
      icon: Calculator,
      action: () => console.log('Show mobile instructions')
    }
  ];

  const handleStepComplete = (stepId: string) => {
    const newCompleted = new Set([...completedSteps, stepId]);
    setCompletedSteps(newCompleted);
    
    if (newCompleted.size === checklistItems.length) {
      onAllComplete();
    }
  };

  return (
    <Card className={cn("design-card border-green-200", className)}>
      <CardContent className="p-6">
        <div className="design-inline mb-4">
          <div>
            <h3 className="font-semibold text-green-900">Get Started Checklist</h3>
            <p className="text-sm text-green-700">
              Complete these steps to master your new interface
            </p>
          </div>
          <Badge className="bg-green-100 text-green-700">
            {completedSteps.size}/{checklistItems.length}
          </Badge>
        </div>

        <div className="space-y-3">
          {checklistItems.map((item) => {
            const isCompleted = completedSteps.has(item.id);
            const IconComponent = item.icon;

            return (
              <div
                key={item.id}
                className={cn(
                  "design-inline p-3 rounded-lg border transition-all",
                  isCompleted 
                    ? "bg-green-50 border-green-200" 
                    : "bg-gray-50 border-gray-200 hover:border-green-300"
                )}
              >
                <div className="design-inline">
                  <div className={cn(
                    "p-2 rounded-lg",
                    isCompleted ? "bg-green-100" : "bg-white"
                  )}>
                    <IconComponent className={cn(
                      "w-4 h-4",
                      isCompleted ? "text-green-600" : "text-gray-600"
                    )} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>

                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      item.action();
                      handleStepComplete(item.id);
                    }}
                    className="design-button design-button-small"
                  >
                    <Timer className="w-3 h-3 mr-1" />
                    Try Now
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}