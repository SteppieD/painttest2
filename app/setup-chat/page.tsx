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
    <div>
      {/* Header */}
      <div>
        <div>
          <div>
            <div>
              <div>
                <Sparkles />
              </div>
              <div>
                <h1>Business Setup Assistant</h1>
                <p>Let's get your painting business configured</p>
              </div>
            </div>
          </div>
          {/* Compact Progress Bar in Header */}
          <div>
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
      <div>
        <div>
          {/* Messages */}
          <div>
            {messages.map((message) => (
              <div
                key={message.id}
               `}
              >
                <div
                 `}
                >
                  <p>{message.content}</p>
                  
                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div>
                      <p>Quick options:</p>
                      <div>
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                           
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
              <div>
                <div>
                  <div>
                    <Loader2 />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          {!isComplete ? (
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your answer..."
                 
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                 
                >
                  <Send />
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div>
                <div>
                  <CheckCircle />
                  <div>
                    <p>Setup Complete!</p>
                    <p>Redirecting to your dashboard...</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/dashboard')}
                 
                >
                  Go to Dashboard
                  <ArrowRight />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div>
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