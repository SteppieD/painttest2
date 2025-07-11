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
    <div>
      <Card>
        <CardContent>
          {/* Header */}
          <div>
            <div>
              <div>
                <h2>Welcome, {companyName}!</h2>
                <p>Let's explore your modern quoting interface</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
               
              >
                <X />
              </Button>
            </div>

            {/* Progress Bar */}
            <div>
              <div 
               
               %` }}
              />
            </div>
            
            <div>
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </div>
          </div>

          {/* Content */}
          <div>
            <div>
              {/* Step Icon */}
              <div>
                {currentStep === 0 && <Star />}
                {currentStep === 1 && <Zap />}
                {currentStep === 2 && <Lightbulb />}
                {currentStep === 3 && <Palette />}
                {currentStep === 4 && <Calculator />}
                {currentStep === 5 && <TrendingUp />}
              </div>

              <h3>
                {currentStepData.title}
              </h3>
              
              <p>
                {currentStepData.description}
              </p>

              {currentStepData.highlight && (
                <Badge>
                  <CheckCircle2 />
                  {currentStepData.highlight}
                </Badge>
              )}
            </div>

            <div>
              <p>
                {currentStepData.content}
              </p>

              {currentStepData.tip && (
                <div>
                  <div>
                    <Lightbulb />
                    <div>
                      <p>Pro Tip</p>
                      <p>{currentStepData.tip}</p>
                    </div>
                  </div>
                </div>
              )}

              {currentStepData.action && (
                <div>
                  <Button
                    onClick={currentStepData.action.onClick}
                   
                  >
                    <Play />
                    {currentStepData.action.label}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div>
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
               
              >
                <ArrowLeft />
                Previous
              </Button>

              <div>
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                 
                >
                  Skip Tour
                </Button>

                <Button
                  onClick={handleNext}
                 
                >
                  {currentStep === ONBOARDING_STEPS.length - 1 ? (
                    <>
                      <CheckCircle2 />
                      Get Started
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight />
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
    const newCompleted = new Set(Array.from(completedSteps).concat(stepId));
    setCompletedSteps(newCompleted);
    
    if (newCompleted.size === checklistItems.length) {
      onAllComplete();
    }
  };

  return (
    <Card>
      <CardContent>
        <div>
          <div>
            <h3>Get Started Checklist</h3>
            <p>
              Complete these steps to master your new interface
            </p>
          </div>
          <Badge>
            {completedSteps.size}/{checklistItems.length}
          </Badge>
        </div>

        <div>
          {checklistItems.map((item) => {
            const isCompleted = completedSteps.has(item.id);
            const IconComponent = item.icon;

            return (
              <div
                key={item.id}
               
              >
                <div>
                  <div>
                    <IconComponent />
                  </div>
                  <div>
                    <p>{item.title}</p>
                    <p>{item.description}</p>
                  </div>
                </div>

                {isCompleted ? (
                  <CheckCircle2 />
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      item.action();
                      handleStepComplete(item.id);
                    }}
                   
                  >
                    <Timer />
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