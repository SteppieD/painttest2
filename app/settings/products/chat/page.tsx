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
          content: `Hi! I'm here to help you update your paint products and pricing. 🎨\n\nYou can:\n• Update prices for specific products\n• Add new products to your catalog\n• Remove products you no longer use\n• Bulk update prices by percentage\n• Update spread rates/coverage per gallon\n\nExamples:\n- "Update ProClassic spread rate to 400 sq ft"\n- "Set all products to 350 sq ft per gallon"\n- "Add new primer with 300 sq ft coverage"\n\nWhat would you like to do today?`,
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
    "Update ProClassic spread rate to 400 sq ft",
    "Add new Sherwin-Williams product",
  ];

  return (
    <div>
      {/* Header with Glassmorphism */}
      <div>
        <div>
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/settings/products")}
             
            >
              <ArrowLeft />
            </Button>
            <div>
              <div>
                <Settings />
              </div>
              <div>
                <h1>Product Updates</h1>
                <p>AI-powered product management</p>
              </div>
            </div>
          </div>
          <div>
            <span>Chat Assistant</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div>
        <div>
          {messages.map((message, index) => (
            <div
              key={index}
            >
              <div>
                <div>
                  <div>
                    {message.role === "user" ? (
                      <span>U</span>
                    ) : (
                      <span>AI</span>
                    )}
                  </div>
                  <div>
                    <p>
                      {message.content}
                    </p>
                    <div>
                      <span>
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.role === "assistant" && (
                        <div>
                          <div></div>
                          <span>AI Assistant</span>
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
            <div>
              <div>
                <div>
                  <h3>Quick Actions</h3>
                  <p>Get started with these common product management tasks</p>
                </div>
                <div>
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(action)}
                     
                    >
                      <span>{action}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {isLoading && (
            <div>
              <div>
                <div>
                  <div>
                    <Loader2 />
                  </div>
                  <div>
                    <div>
                      <span>AI Assistant</span>
                      <div></div>
                    </div>
                    <div>
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
      <div>
        <div>
          <div>
            <div>
              <div>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your request... (e.g., 'Increase all Benjamin Moore prices by 15%')"
                  disabled={isLoading}
                 
                />
                <div>
                  <Button 
                    onClick={handleSend} 
                    disabled={isLoading || !input.trim()}
                    size="sm"
                   
                  >
                    <Send />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <span>Quick examples:</span>
            {["Update ProClassic to $45", "Add primer with 300 sq ft coverage", "Update all spread rates to 400 sq ft"].map((example, index) => (
              <button
                key={index}
                onClick={() => setInput(example)}
               
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