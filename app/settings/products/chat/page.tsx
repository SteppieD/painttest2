"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send, ArrowLeft, Settings } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ProductChatPage() {
  const router = useRouter();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);

  useEffect(() => {
    const storedCompany = localStorage.getItem("paintquote_company");
    if (storedCompany) {
      const company = JSON.parse(storedCompany);
      setCompanyData(company);
      
      // Start the conversation
      setMessages([
        {
          role: "assistant",
          content: `Hi! I'm here to help you update your paint products and pricing. 🎨\n\nYou can:\n• Update prices for specific products\n• Add new products to your catalog\n• Remove products you no longer use\n• Bulk update prices by percentage\n\nWhat would you like to do today?`,
        },
      ]);
    } else {
      router.push("/access-code");
    }
  }, [router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/product-update-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          userId: companyData?.id,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
        
        if (data.success && data.action) {
          toast({
            title: "Update Complete",
            description: data.message || "Your products have been updated successfully.",
          });
        }
      } else {
        throw new Error(data.error || "Failed to process message");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try rephrasing your request or use the manual editing interface.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    "Update all prices by 10%",
    "Show my current products",
    "Add new Sherwin-Williams product",
    "Remove unused products",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header with Glassmorphism */}
      <div className="glass-nav border-b sticky top-0 z-50 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/settings/products")}
              className="glass-button-primary hover:scale-105 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 glass-subtle rounded-lg">
                <Settings className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Product Updates</h1>
                <p className="text-sm text-gray-600">AI-powered product management</p>
              </div>
            </div>
          </div>
          <div className="glass-badge-primary px-3 py-1 rounded-full">
            <span className="text-sm font-medium">Chat Assistant</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-8 enhanced-scroll">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex animate-glass-slide-up ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`max-w-[75%] md:max-w-[60%] ${
                  message.role === "user"
                    ? "glass-blue rounded-2xl rounded-br-md p-4 shadow-lg"
                    : "glass-card rounded-2xl rounded-bl-md p-5 shadow-lg hover:shadow-xl transition-all duration-300"
                }`}
              >
                <div className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gradient-to-br from-purple-500 to-blue-600 text-white"
                  }`}>
                    {message.role === "user" ? (
                      <span className="text-sm font-semibold">U</span>
                    ) : (
                      <span className="text-sm font-semibold">AI</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
                      message.role === "user" 
                        ? "text-blue-900 font-medium" 
                        : "text-gray-800"
                    }`}>
                      {message.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-600 font-medium">AI Assistant</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Quick Actions */}
          {messages.length === 1 && (
            <div className="flex justify-center animate-glass-fade-in" style={{ animationDelay: "0.5s" }}>
              <div className="glass-card p-6 text-center max-w-2xl">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
                  <p className="text-sm text-gray-600">Get started with these common product management tasks</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(action)}
                      className="glass-button text-sm font-medium h-auto p-3 hover:scale-105 transition-all duration-200 justify-start"
                    >
                      <span className="text-left">{action}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {isLoading && (
            <div className="flex justify-start animate-glass-fade-in">
              <div className="glass-card p-4 max-w-[60%]">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-800">AI Assistant</span>
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="glass-nav border-t p-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-input-container relative">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your request... (e.g., 'Increase all Benjamin Moore prices by 15%')"
                  disabled={isLoading}
                  className="glass-input text-base py-4 pr-12 rounded-2xl border-0 focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-0"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Button 
                    onClick={handleSend} 
                    disabled={isLoading || !input.trim()}
                    size="sm"
                    className="glass-button-primary rounded-full p-2 h-8 w-8 hover:scale-110 transition-all duration-200"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-medium text-gray-600">Quick examples:</span>
            {["Update ProClassic to $45", "Add new primer", "Show ceiling prices"].map((example, index) => (
              <button
                key={index}
                onClick={() => setInput(example)}
                className="text-xs px-2 py-1 glass-subtle rounded-full text-blue-700 hover:text-blue-800 hover:scale-105 transition-all duration-200"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}