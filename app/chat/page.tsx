"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
import { ChatInterface } from "@/components/chat/chat-interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, FileText, Settings, LogOut, Palette } from "lucide-react";
import { QuoteResult } from "@/lib/quote-calculator";
import { useToast } from "@/components/ui/use-toast";

export default function ChatPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [companyData, setCompanyData] = useState<any>(null);
  const [generatedQuote, setGeneratedQuote] = useState<QuoteResult | null>(null);

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
    toast({
      title: "Quote Generated!",
      description: `Quote saved successfully. Total: $${quote.totalCost.toLocaleString()}`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("paintquote_company");
    router.push("/access-code");
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Palette className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">ProPaint Quote Assistant</h1>
                <p className="text-sm text-gray-500">{companyData.company_name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="hidden sm:flex"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <ChatInterface onQuoteGenerated={handleQuoteGenerated} />
          </div>

          {/* Quote Summary Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Current Session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="text-gray-600 mb-2">Active since:</p>
                  <p className="font-medium">
                    {new Date(companyData.loginTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {generatedQuote && (
                  <>
                    <div className="border-t pt-3">
                      <p className="text-gray-600 mb-2 text-sm">Latest Quote:</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${generatedQuote.totalCost.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {generatedQuote.timeEstimate}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Labor:</span>
                        <span>${generatedQuote.breakdown.labor.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Materials:</span>
                        <span>${generatedQuote.breakdown.materials.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prep Work:</span>
                        <span>${generatedQuote.breakdown.prepWork.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Markup:</span>
                        <span>${generatedQuote.breakdown.markup.toLocaleString()}</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/dashboard")}
                    className="w-full"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View All Quotes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>💡 Be specific about room dimensions for accurate quotes</p>
                <p>🎨 Mention paint quality preferences (basic, premium, luxury)</p>
                <p>⏰ Let me know your timeline needs</p>
                <p>📋 Include any special prep work requirements</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}