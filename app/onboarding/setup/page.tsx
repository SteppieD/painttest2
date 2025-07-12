"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send, Building2, PaintBucket } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface CompanyData {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface ProductData {
  interior: {
    primer: any[];
    ceiling_paint: any[];
    wall_paint: any[];
    trim_paint: any[];
  };
  exterior: {
    primer: any[];
    wall_paint: any[];
    trim_paint: any[];
  };
}

type SetupStep = "welcome" | "company_info" | "interior_products" | "exterior_products" | "review" | "complete";

export default function OnboardingSetupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [currentStep, setCurrentStep] = useState<SetupStep>("welcome");
  const [productData, setProductData] = useState<ProductData>({
    interior: {
      primer: [],
      ceiling_paint: [],
      wall_paint: [],
      trim_paint: [],
    },
    exterior: {
      primer: [],
      wall_paint: [],
      trim_paint: [],
    },
  });

  useEffect(() => {
    // Get company data from localStorage
    const storedCompany = localStorage.getItem("paintquote_company");
    if (storedCompany) {
      const company = JSON.parse(storedCompany);
      setCompanyData({
        id: company.id,
        name: company.name,
        phone: company.phone || "",
        email: company.email || "",
      });
      
      // Start the conversation
      setMessages([
        {
          role: "assistant",
          content: `Welcome to Painting Quote Pro, ${company.name}! 🎨\n\nI'm here to help you set up your paint products and pricing. This will make creating quotes much faster and more accurate.\n\nLet's start by setting up your company information. What's your company's full business name?`,
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
      const response = await fetch("/api/onboarding-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          currentStep,
          companyData,
          productData,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
        
        // Update state based on assistant's response
        if (data.currentStep) setCurrentStep(data.currentStep);
        if (data.companyData) setCompanyData(data.companyData);
        if (data.productData) setProductData(data.productData);

        // If setup is complete, save everything
        if (data.currentStep === "complete") {
          await saveSetupData();
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
    } finally {
      setIsLoading(false);
    }
  };

  const saveSetupData = async () => {
    try {
      // Save company profile
      await fetch("/api/company-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: companyData?.id,
          companyName: companyData?.name,
          companyPhone: companyData?.phone,
          companyEmail: companyData?.email,
        }),
      });

      // Save paint products
      const products: any[] = [];
      
      // Convert product data to flat array
      ["interior", "exterior"].forEach((projectType) => {
        Object.entries(productData[projectType as keyof ProductData]).forEach(([category, items]) => {
          items.forEach((item: any, index: number) => {
            products.push({
              projectType,
              productCategory: category,
              supplier: item.supplier,
              productName: item.productName,
              costPerGallon: item.cost,
              displayOrder: index + 1,
            });
          });
        });
      });

      await fetch("/api/paint-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: companyData?.id,
          products,
        }),
      });

      // Update localStorage
      const updatedCompany = {
        ...companyData,
        profileCompleted: true,
        onboardingCompleted: true,
      };
      localStorage.setItem("paintquote_company", JSON.stringify(updatedCompany));

      toast({
        title: "Setup Complete!",
        description: "Your company profile and products have been saved.",
      });

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error saving setup data:", error);
      toast({
        title: "Error",
        description: "Failed to save setup data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div>
      {/* Header */}
      <div>
        <div>
          <div>
            <Building2 />
            <h1>Company Setup</h1>
          </div>
          <div>
            <PaintBucket />
            <span>Setting up your paint products</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div>
        <div>
          {messages.map((message, index) => (
            <div
              key={index}
             `}
            >
              <Card
               `}
              >
                <p>{message.content}</p>
              </Card>
            </div>
          ))}
          {isLoading && (
            <div>
              <Card>
                <div>
                  <Loader2 />
                  <span>Thinking...</span>
                </div>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div>
        <div>
          <div>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response..."
              disabled={isLoading}
             
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
              <Send />
            </Button>
          </div>
          <p>
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}