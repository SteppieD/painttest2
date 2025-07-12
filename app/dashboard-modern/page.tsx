"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ModernDashboard } from "@/components/ui/modern-dashboard";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { ExpressQuoteCreator } from "@/components/ui/express-quote-creator";
import { ProfessionalQuotePresentation } from "@/components/ui/professional-quote-presentation";
import { OnboardingTour, OnboardingChecklist } from "@/components/ui/onboarding-tour";
import { SmartSuggestionWidget } from "@/components/ui/smart-suggestion-widget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Palette, 
  LogOut, 
  Settings, 
  Bell,
  User,
  Copy,
  CheckCircle2,
  Download,
  Share2
} from "lucide-react";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

type View = 'dashboard' | 'express-quote' | 'full-quote' | 'quote-preview' | 'chat';

interface CompanyInfo {
  id: string;
  company_name: string;
  access_code: string;
  owner_name?: string;
  email?: string;
  phone?: string;
}

export default function ModernDashboardPage() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedQuote, setGeneratedQuote] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showOnboardingChecklist, setShowOnboardingChecklist] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const company = localStorage.getItem("paintquote_company");
      if (!company) {
        router.push("/access-code");
        return;
      }

      const parsedCompany = JSON.parse(company);
      if (Date.now() - parsedCompany.loginTime > 24 * 60 * 60 * 1000) {
        localStorage.removeItem("paintquote_company");
        router.push("/access-code");
        return;
      }

      setCompanyInfo(parsedCompany);
      
      // Check if user should see onboarding
      const hasSeenOnboarding = localStorage.getItem('paintquote_onboarding_completed');
      const hasSeenChecklist = localStorage.getItem('paintquote_checklist_completed');
      
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      } else if (!hasSeenChecklist) {
        setShowOnboardingChecklist(true);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      router.push("/access-code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("paintquote_company");
    router.push("/access-code");
  };

  const handleCreateExpressQuote = () => {
    setCurrentView('express-quote');
  };

  const handleCreateFullQuote = () => {
    setCurrentView('full-quote');
  };

  const handleCreateChatQuote = () => {
    router.push('/create-quote');
  };

  const handleViewQuotes = () => {
    router.push('/quotes');
  };

  const handleViewInsights = () => {
    router.push('/insights');
  };

  const handleQuoteCreated = (quoteData: any) => {
    setGeneratedQuote(quoteData);
    setCurrentView('quote-preview');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setGeneratedQuote(null);
  };

  const handleFallbackToChat = () => {
    router.push('/create-quote');
  };

  const handleDownloadQuote = () => {
    // Implement PDF download
    console.log('Download quote PDF');
  };

  const handleShareQuote = () => {
    // Implement quote sharing
    console.log('Share quote');
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setShowOnboardingChecklist(true);
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
  };

  const handleChecklistComplete = () => {
    setShowOnboardingChecklist(false);
    localStorage.setItem('paintquote_checklist_completed', 'true');
  };

  if (isLoading) {
    return (
      <div>
        <div>
          <div></div>
          <p>Loading modern dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Modern Header */}
      <header>
        <div>
          <div>
            {/* Left Side */}
            <div>
              {currentView !== 'dashboard' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToDashboard}
                 
                >
                  <ArrowLeft />
                </Button>
              )}
              
              <div>
                <div>
                  <Palette />
                </div>
                <div>
                  <h1>
                    {currentView === 'dashboard' && 'Dashboard'}
                    {currentView === 'express-quote' && 'Express Quote'}
                    {currentView === 'full-quote' && 'Custom Quote'}
                    {currentView === 'quote-preview' && 'Quote Preview'}
                  </h1>
                  <p>{companyInfo?.company_name}</p>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div>
              {companyInfo?.access_code && (
                <div>
                  <span>Code:</span>
                  <Badge 
                    variant="outline" 
                   
                    onClick={() => {
                      navigator.clipboard.writeText(companyInfo.access_code);
                      // Show toast notification
                    }}
                  >
                    <span>{companyInfo.access_code}</span>
                    <Copy />
                  </Badge>
                </div>
              )}

              <div>
                <Button variant="ghost" size="sm">
                  <Bell />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/settings')}
                >
                  <Settings />
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                 
                >
                  <LogOut />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {currentView === 'dashboard' && (
          <div>
            {/* Onboarding Checklist (if applicable) */}
            {showOnboardingChecklist && companyInfo && (
              <div>
                <OnboardingChecklist
                  companyId={parseInt(companyInfo.id)}
                  onAllComplete={handleChecklistComplete}
                />
              </div>
            )}

            <ModernDashboard
              onCreateQuote={handleCreateFullQuote}
              onCreateExpressQuote={handleCreateExpressQuote}
              onViewQuotes={handleViewQuotes}
              onViewInsights={handleViewInsights}
            />
          </div>
        )}

        {currentView === 'express-quote' && (
          <ExpressQuoteCreator
            onQuoteCreated={handleQuoteCreated}
            onFallbackToChat={handleFallbackToChat}
            companyData={companyInfo}
          />
        )}

        {currentView === 'full-quote' && (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Custom Quote Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  The custom quote builder with visual room layout is coming soon!
                </p>
                <div>
                  <Button 
                    onClick={handleFallbackToChat}
                   
                  >
                    Use Chat Interface for Now
                  </Button>
                  <Button 
                    onClick={handleBackToDashboard}
                    variant="outline"
                   
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === 'quote-preview' && generatedQuote && (
          <div>
            <div>
              <div>
                <CheckCircle2 />
                <div>
                  <h2>Quote Generated Successfully!</h2>
                  <p>
                    Professional quote ready for {generatedQuote.customer_name}
                  </p>
                </div>
              </div>
            </div>

            <ProfessionalQuotePresentation
              quote={generatedQuote}
              onDownload={handleDownloadQuote}
              onShare={handleShareQuote}
            />
          </div>
        )}
      </main>

      {/* Floating Action Button - Only show on dashboard */}
      {currentView === 'dashboard' && (
        <FloatingActionButton
          onExpressQuote={handleCreateExpressQuote}
          onFullQuote={handleCreateFullQuote}
          onChatQuote={handleCreateChatQuote}
          onViewQuotes={handleViewQuotes}
        />
      )}

      {/* Demo Banner */}
      <div>
        <div>
          <span>🚀 Modern UX Demo - Apple/Google inspired design for contractors</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
           
          >
            View Original Dashboard
          </Button>
        </div>
      </div>

      {/* Onboarding Tour */}
      {showOnboarding && companyInfo && (
        <OnboardingTour
          companyName={companyInfo.company_name}
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
    </div>
  );
}