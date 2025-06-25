"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { initializeQuoteCreation, trackLoadingPerformance, type CompanyInitialData } from "@/lib/batch-loader";
import { FixedChatInterface } from "@/components/chat/fixed-chat-interface";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

function CreateQuotePageContent() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const editQuoteId = searchParams.get('edit');

  // Loading states
  const [isInitializing, setIsInitializing] = useState(true);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [companyData, setCompanyData] = useState<CompanyInitialData | null>(null);

  // Initialize the quote creation system
  useEffect(() => {
    const initialize = async () => {
      try {
        const startTime = performance.now();
        setLoadingProgress(10);

        // Initialize with progress tracking
        const progressCallback = (progress: number) => {
          setLoadingProgress(Math.min(progress, 90));
        };

        const data = await initializeQuoteCreation(progressCallback);
        
        setCompanyData(data);
        setLoadingProgress(95);

        // Track performance
        const endTime = performance.now();
        await trackLoadingPerformance(endTime - startTime, !!data.companyData);

        setLoadingProgress(100);
        
        // Small delay to show completion
        setTimeout(() => {
          setIsInitializing(false);
        }, 200);

      } catch (error) {
        console.error('Initialization error:', error);
        setInitializationError(error instanceof Error ? error.message : 'Failed to initialize quote system');
        setIsInitializing(false);
      }
    };

    initialize();
  }, []);

  if (isInitializing) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <header className="bg-white border-b shadow-sm">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard")}
                className="w-10 h-10 hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Create Quote</h1>
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center gap-2 justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                Loading Quote System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  {loadingProgress < 30 && "Authenticating..."}
                  {loadingProgress >= 30 && loadingProgress < 70 && "Loading company settings..."}
                  {loadingProgress >= 70 && loadingProgress < 90 && "Preparing paint data..."}
                  {loadingProgress >= 90 && "Finalizing..."}
                </p>
                
                {initializationError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{initializationError}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <FixedChatInterface
      companyId={companyData?.companyData?.id || ''}
      onQuoteGenerated={(quoteData) => {
        toast({
          title: "Success!",
          description: "Quote has been created successfully."
        });
      }}
      onBack={() => router.push("/dashboard")}
    />
  );
}

export default function CreateQuotePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CreateQuotePageContent />
    </Suspense>
  );
}