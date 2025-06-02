"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import { ArrowLeft, Save, Menu, X, Palette, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat/enhanced-chat-interface";
import { MarkupPanel } from "@/components/markup/markup-panel";
import { MobileMarkupSheet } from "@/components/markup/mobile-markup-sheet";
import { QuoteResult } from "@/lib/quote-calculator";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export default function CreateQuotePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [companyData, setCompanyData] = useState<any>(null);
  const [generatedQuote, setGeneratedQuote] = useState<QuoteResult | null>(null);
  const [markupPercentage, setMarkupPercentage] = useState(25);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMarkupSheetOpen, setIsMarkupSheetOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check if device is mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Check authentication
    const company = localStorage.getItem("paintquote_company");
    if (!company) {
      router.push("/access-code");
      return;
    }

    try {
      const parsedCompany = JSON.parse(company);
      // Check if session is still valid (24 hours)
      if (Date.now() - parsedCompany.loginTime > 24 * 60 * 60 * 1000) {
        localStorage.removeItem("paintquote_company");
        router.push("/access-code");
        return;
      }
      setCompanyData(parsedCompany);
    } catch (e) {
      localStorage.removeItem("paintquote_company");
      router.push("/access-code");
    }
  }, [router]);

  const handleQuoteGenerated = (quote: QuoteResult) => {
    setGeneratedQuote(quote);
    // Show markup panel on mobile when quote is generated
    if (isMobile && quote.totalCost > 0) {
      setIsMarkupSheetOpen(true);
    }
  };

  const handleSaveQuote = async () => {
    if (!generatedQuote) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteData: {
            ...generatedQuote,
            markupPercentage,
            finalPrice: generatedQuote.totalCost * (1 + markupPercentage / 100)
          },
          companyId: companyData.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save quote');
      }

      const data = await response.json();
      
      toast({
        title: "Quote Saved!",
        description: `Quote ${data.quoteId} saved successfully.`,
      });
      
      router.push(`/quotes/${data.quoteId}`);
    } catch (error) {
      console.error('Error saving quote:', error);
      toast({
        title: "Error",
        description: "Failed to save quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!companyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Mobile-First Header */}
      <header className="bg-white border-b shadow-sm relative z-20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard")}
                className="w-10 h-10 hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center gap-2">
                <Palette className="w-6 h-6 text-blue-600" />
                <h1 className="text-lg font-semibold">New Quote</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {generatedQuote && (
                <Button
                  onClick={handleSaveQuote}
                  disabled={isSaving}
                  size="sm"
                  className="h-9"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              )}
              
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="w-10 h-10 md:hidden"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Interface - Full Width on Mobile */}
        <div className={cn(
          "flex-1 flex flex-col",
          !isMobile && generatedQuote && "lg:pr-80" // Leave space for desktop sidebar
        )}>
          <ChatInterface 
            onQuoteGenerated={handleQuoteGenerated}
            markupPercentage={markupPercentage}
            companyData={companyData}
            isMobile={isMobile}
          />
        </div>

        {/* Desktop Markup Sidebar */}
        {!isMobile && generatedQuote && (
          <aside className="w-80 bg-white border-l shadow-lg fixed right-0 top-16 bottom-0 overflow-y-auto">
            <MarkupPanel
              quote={generatedQuote}
              markupPercentage={markupPercentage}
              onMarkupChange={setMarkupPercentage}
              onSave={handleSaveQuote}
              isSaving={isSaving}
            />
          </aside>
        )}
      </div>

      {/* Mobile Markup Bottom Sheet */}
      {isMobile && generatedQuote && (
        <>
          {/* Floating Action Button for Mobile */}
          <div className="fixed bottom-6 right-6 z-10">
            <Button
              onClick={() => setIsMarkupSheetOpen(true)}
              size="lg"
              className="rounded-full shadow-lg w-14 h-14"
            >
              <Calculator className="w-6 h-6" />
            </Button>
          </div>
          
          <MobileMarkupSheet
            isOpen={isMarkupSheetOpen}
            onOpenChange={setIsMarkupSheetOpen}
            quote={generatedQuote}
            markupPercentage={markupPercentage}
            onMarkupChange={setMarkupPercentage}
            onSave={handleSaveQuote}
            isSaving={isSaving}
          />
        </>
      )}

      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="absolute right-0 top-16 w-64 bg-white shadow-lg p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                router.push("/dashboard");
                setIsMobileMenuOpen(false);
              }}
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                router.push("/quotes");
                setIsMobileMenuOpen(false);
              }}
            >
              All Quotes
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                router.push("/settings");
                setIsMobileMenuOpen(false);
              }}
            >
              Settings
            </Button>
            <hr className="my-2" />
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600"
              onClick={() => {
                localStorage.removeItem("paintquote_company");
                router.push("/access-code");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}