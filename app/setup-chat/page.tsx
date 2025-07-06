"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2, Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import { trackPageView, trackFeatureUsed } from "@/lib/analytics/tracking";
import { OnboardingProgressBar } from "@/components/ui/onboarding-progress-bar";

interface SetupProgress {
  businessName?: string;
  ownerName?: string;
  businessAddress?: string;
  interiorPrimer?: any;
  interiorWallPaint?: any;
  interiorCeilingPaint?: any;
  interiorTrimPaint?: any;
  exteriorPrimer?: any;
  exteriorWallPaint?: any;
  exteriorTrimPaint?: any;
  laborRates?: any;
  markupPercentage?: number;
  currentStep?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export default function SetupChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [setupProgress, setSetupProgress] = useState<SetupProgress>({});
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackPageView('/setup-chat');
    
    // Get company ID from localStorage
    const companyData = localStorage.getItem("paintquote_company");
    if (companyData) {
      try {
        const company = JSON.parse(companyData);
        setCompanyId(company.id);
      } catch (e) {
        router.push("/access-code");
      }
    } else {
      router.push("/access-code");
    }
  }, [router]);

  // Send initial message once company ID is set
  useEffect(() => {
    if (companyId && messages.length === 0) {
      sendMessage("", true);
    }
  }, [companyId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (message: string, isInitial = false) => {
    if (!companyId || (!message.trim() && !isInitial)) return;

    const userMessage = message.trim();
    
    // Add user message if not initial
    if (!isInitial && userMessage) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      }]);
    }

    setIsLoading(true);
    setInputValue("");

    try {
      const response = await fetch('/api/setup-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: {
            companyId,
            setupProgress
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update progress
        setSetupProgress(data.setupProgress);
        setIsComplete(data.isComplete);
        
        // Add assistant response
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          suggestions: data.suggestions
        }]);

        // Track progress
        trackFeatureUsed('setup_chat_step', { 
          step: data.currentStep,
          companyId: companyId.toString()
        });

        // If complete, redirect after a delay
        if (data.isComplete) {
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Setup chat error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble processing that. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    sendMessage(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Business Setup Assistant</h1>
                <p className="text-sm text-gray-600">Let's get your painting business configured</p>
              </div>
            </div>
          </div>
          {/* Compact Progress Bar in Header */}
          <div className="max-w-md">
            <OnboardingProgressBar
              steps={[
                {
                  id: 'business-info',
                  title: 'Business Info',
                  completed: !!setupProgress.businessName,
                  active: setupProgress.currentStep === 'business_info'
                },
                {
                  id: 'paint-products',
                  title: 'Paint Products',
                  completed: !!setupProgress.interiorWallPaint,
                  active: setupProgress.currentStep === 'paint_products'
                },
                {
                  id: 'labor-rates',
                  title: 'Labor Rates',
                  completed: !!setupProgress.laborRates,
                  active: setupProgress.currentStep === 'labor_rates'
                }
              ]}
              variant="compact"
              animated={true}
              showPercentage={true}
            />
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm border min-h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Quick options:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1 bg-white text-gray-700 rounded-md text-sm hover:bg-gray-50 border transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          {!isComplete ? (
            <form onSubmit={handleSubmit} className="border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your answer..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          ) : (
            <div className="border-t p-6 bg-green-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">Setup Complete!</p>
                    <p className="text-sm text-green-700">Redirecting to your dashboard...</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 bg-white rounded-lg shadow-sm border p-4">
          <OnboardingProgressBar
            steps={[
              {
                id: 'business-info',
                title: 'Business Info',
                description: 'Company name and details',
                completed: !!setupProgress.businessName,
                active: setupProgress.currentStep === 'business_info'
              },
              {
                id: 'paint-products',
                title: 'Paint Products',
                description: 'Your preferred paint brands',
                completed: !!setupProgress.interiorWallPaint,
                active: setupProgress.currentStep === 'paint_products'
              },
              {
                id: 'labor-rates',
                title: 'Labor & Pricing',
                description: 'Rates and markup',
                completed: !!setupProgress.laborRates,
                active: setupProgress.currentStep === 'labor_rates'
              }
            ]}
            variant="detailed"
            animated={true}
          />
        </div>
      </div>
    </div>
  );
}