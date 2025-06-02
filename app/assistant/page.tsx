"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
          context: context
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

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If quote is complete, save it
      if (data.isComplete && data.quoteData) {
        // Save chat session to history
        if (data.context.clientName && data.context.address) {
          saveChatSession(data.context.clientName, data.context.address);
        }

        // Save quote to database
        try {
          const saveResponse = await fetch('/api/quotes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              quoteData: data.quoteData,
              companyId: companyData.id
            }),
          });

          if (saveResponse.ok) {
            const saveData = await saveResponse.json();
            setTimeout(() => {
              const saveMessage: Message = {
                id: (Date.now() + 2).toString(),
                role: 'assistant',
                content: `Saved as quote #${saveData.quoteId}. Start another?`,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, saveMessage]);
              // Don't reset context here - let the user response trigger it
            }, 1500);
          }
        } catch (error) {
          console.error('Error saving quote:', error);
        }
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
  const saveChatSession = (clientName: string, address: string) => {
    const session = {
      id: Date.now().toString(),
      clientName,
      address,
      timestamp: new Date(),
      projectType: context.projectType
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

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Minimal Header */}
      <header className="bg-white border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <h1 className="text-lg font-semibold">Quote Assistant</h1>
          
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
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

      {/* Input Area */}
      <div className="border-t bg-white">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 text-[16px] py-3 px-4 rounded-full border-gray-200 focus:border-blue-600"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}