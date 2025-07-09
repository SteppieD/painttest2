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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 design-body">Loading modern dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="design-container max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Left Side */}
            <div className="design-inline">
              {currentView !== 'dashboard' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToDashboard}
                  className="mr-3"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              
              <div className="design-inline">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Palette className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h1 className="text-lg font-semibold text-gray-900">
                    {currentView === 'dashboard' && 'Dashboard'}
                    {currentView === 'express-quote' && 'Express Quote'}
                    {currentView === 'full-quote' && 'Custom Quote'}
                    {currentView === 'quote-preview' && 'Quote Preview'}
                  </h1>
                  <p className="text-sm text-gray-500">{companyInfo?.company_name}</p>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="design-inline">
              {companyInfo?.access_code && (
                <div className="hidden sm:flex items-center mr-4">
                  <span className="text-sm text-gray-500 mr-2">Code:</span>
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      navigator.clipboard.writeText(companyInfo.access_code);
                      // Show toast notification
                    }}
                  >
                    <span className="mr-1">{companyInfo.access_code}</span>
                    <Copy className="w-3 h-3" />
                  </Badge>
                </div>
              )}

              <div className="design-inline">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <Bell className="w-4 h-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/settings')}
                >
                  <Settings className="w-4 h-4" />
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            {/* Onboarding Checklist (if applicable) */}
            {showOnboardingChecklist && companyInfo && (
              <div className="design-container max-w-4xl mx-auto p-4">
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
          <div className="design-container max-w-4xl mx-auto p-4">
            <Card className="design-card">
              <CardHeader>
                <CardTitle className="design-heading-3">Custom Quote Builder</CardTitle>
              </CardHeader>
              <CardContent className="text-center py-12">
                <p className="design-body mb-6">
                  The custom quote builder with visual room layout is coming soon!
                </p>
                <div className="design-inline">
                  <Button 
                    onClick={handleFallbackToChat}
                    className="design-button design-button-primary"
                  >
                    Use Chat Interface for Now
                  </Button>
                  <Button 
                    onClick={handleBackToDashboard}
                    variant="outline"
                    className="design-button design-button-secondary"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === 'quote-preview' && generatedQuote && (
          <div className="py-8">
            <div className="design-container max-w-4xl mx-auto mb-6">
              <div className="design-inline">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <h2 className="design-heading-2">Quote Generated Successfully!</h2>
                  <p className="design-body">
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
      <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-3 text-center text-sm z-30">
        <div className="design-inline">
          <span>🚀 Modern UX Demo - Apple/Google inspired design for contractors</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
            className="text-white hover:bg-blue-700 ml-4"
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