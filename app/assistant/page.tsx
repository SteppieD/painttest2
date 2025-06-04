"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MarkupPopup } from "@/components/markup-popup";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AssistantPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your painting quote assistant. What's the client's name and address? Feel free to share any other project details you have.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);
  const [context, setContext] = useState<any>({});
  const [savedQuoteId, setSavedQuoteId] = useState<string | null>(null);
  const [isSavingQuote, setIsSavingQuote] = useState(false);
  const [showMarkupPopup, setShowMarkupPopup] = useState(false);
  const [pendingQuoteData, setPendingQuoteData] = useState<any>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Check authentication
  useEffect(() => {
    const company = localStorage.getItem("paintquote_company");
    if (!company) {
      router.push("/access-code");
      return;
    }

    try {
      const parsedCompany = JSON.parse(company);
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

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          history: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          context: context,
          companyId: companyData?.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      // Update context with new information
      if (data.context) {
        setContext(data.context);
      }
      
      // Check if context was reset (starting new quote)
      if (Object.keys(data.context).length === 0 && savedQuoteId) {
        setSavedQuoteId(null);
        setIsSavingQuote(false);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If quote is complete and needs markup confirmation, show popup
      if (data.isComplete && data.quoteData && data.quoteData.needsMarkupConfirmation && !savedQuoteId) {
        setPendingQuoteData(data.quoteData);
        setShowMarkupPopup(true);
      } 
      // If quote is complete and doesn't need confirmation, save it
      else if (data.isComplete && data.quoteData && !isSavingQuote && !savedQuoteId) {
        saveQuoteToDatabase(data.quoteData, data.context);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I'm having connection issues. Try again?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!companyData) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Save chat session to history
  const saveChatSession = (clientName: string, address: string, projectId?: string, quoteId?: string) => {
    const session = {
      id: Date.now().toString(),
      clientName,
      address,
      timestamp: new Date(),
      projectType: context.projectType,
      projectId: projectId || null,
      quoteId: quoteId || null
    };

    const history = localStorage.getItem('paintquote_chat_history');
    const sessions = history ? JSON.parse(history) : [];
    sessions.unshift(session);
    
    // Keep only last 50 sessions
    if (sessions.length > 50) {
      sessions.pop();
    }
    
    localStorage.setItem('paintquote_chat_history', JSON.stringify(sessions));
    window.dispatchEvent(new Event('storage'));
  };

  // Save quote to database
  const saveQuoteToDatabase = async (quoteData: any, contextData: any) => {
    if (isSavingQuote) return;
    
    setIsSavingQuote(true);
    
    // Don't save to history yet - wait until we have the project/quote ID

    try {
      const saveResponse = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteData: quoteData,
          companyId: companyData.id
        }),
      });

      if (saveResponse.ok) {
        const saveData = await saveResponse.json();
        const quoteId = saveData.quoteId || saveData.quote?.id;
        const projectId = saveData.quote?.projectId || saveData.projectId;
        
        setSavedQuoteId(quoteId);
        setIsSavingQuote(false);
        
        // Save chat session to history with IDs
        if (contextData.clientName && contextData.address) {
          saveChatSession(contextData.clientName, contextData.address, projectId, quoteId);
        }
        
        // Add confirmation message
        setTimeout(() => {
          const confirmMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: `Quote saved as #${quoteId}! Click 'View Quote Details' above to review and generate the customer quote.`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, confirmMessage]);
        }, 500);
      }
    } catch (error) {
      console.error('Error saving quote:', error);
      setIsSavingQuote(false);
    }
  };

  // Handle markup confirmation
  const handleMarkupConfirm = async (markupPercentage: number) => {
    if (!pendingQuoteData) return;
    
    // Update quote data with confirmed markup
    const updatedQuoteData = {
      ...pendingQuoteData,
      markup: {
        percentage: markupPercentage,
        amount: pendingQuoteData.subtotal * (markupPercentage / 100)
      }
    };
    
    // Recalculate total with new markup
    updatedQuoteData.totalCost = updatedQuoteData.subtotal + updatedQuoteData.markup.amount + (pendingQuoteData.tax || 0);
    
    // Add confirmation message about markup
    const markupMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Perfect! Applied ${markupPercentage}% markup ($${updatedQuoteData.markup.amount.toLocaleString()}). Your final quote is $${updatedQuoteData.totalCost.toLocaleString()}.`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, markupMessage]);
    
    // Save the quote
    await saveQuoteToDatabase(updatedQuoteData, context);
    
    setPendingQuoteData(null);
    setShowMarkupPopup(false);
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden mobile-chat-container">
      {/* Minimal Header */}
      <header className="bg-white border-b flex-shrink-0 safe-area-inset-top">
        <div className="px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="text-gray-600 flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold truncate">
              {context.clientName && !context.clientName.includes('and their address') 
                ? `Quote for ${context.clientName.split(' and ')[0]}` 
                : 'Quote Assistant'}
            </h1>
            {context.clientName && context.address && (
              <p className="text-xs text-gray-500 truncate">{context.address}</p>
            )}
          </div>
          
          <div className="w-10 flex-shrink-0" /> {/* Spacer for centering */}
        </div>
        
        {/* View Quote Details button */}
        {savedQuoteId && (
          <div className="px-4 pb-3">
            <Button
              onClick={() => router.push(`/quotes/${savedQuoteId}/review`)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              View Quote Details
            </Button>
          </div>
        )}
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0 mobile-chat-messages enhanced-scroll">
        <div className="max-w-2xl mx-auto space-y-4 pb-20 md:pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed",
                  message.role === 'user'
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2.5 rounded-2xl">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed position for mobile */}
      <div className="border-t bg-white flex-shrink-0 safe-area-inset-bottom md:relative md:bottom-auto mobile-input-area">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 text-[16px] py-3 px-4 rounded-full border-gray-200 focus:border-blue-600 min-h-[48px]"
              style={{
                fontSize: '16px', // Prevents zoom on iOS
              }}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Markup Confirmation Popup */}
      <MarkupPopup
        isOpen={showMarkupPopup}
        onClose={() => {
          setShowMarkupPopup(false);
          setPendingQuoteData(null);
        }}
        onConfirm={handleMarkupConfirm}
        baseCost={pendingQuoteData?.subtotal || 0}
        defaultMarkup={20}
      />
    </div>
  );
}