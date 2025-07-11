"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuoteWizard } from "@/components/ui/quote-wizard";
import { useToast } from "@/components/ui/use-toast";

export default function CreateQuoteV2Page() {
  const router = useRouter();
  const { toast } = useToast();
  const [companyData, setCompanyData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const company = localStorage.getItem("paintquote_company");
    if (!company) {
      router.push("/access-code");
      return;
    }

    try {
      const companyInfo = JSON.parse(company);
      setCompanyData(companyInfo);
    } catch (error) {
      console.error("Error parsing company data:", error);
      router.push("/access-code");
    }
  }, [router]);

  const handleQuoteComplete = async (quoteData: any) => {
    setIsLoading(true);
    
    try {
      // Calculate quote using the simplified data
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_id: companyData.id,
          customer_name: quoteData.customerName,
          customer_email: quoteData.email,
          customer_phone: quoteData.phone,
          address: quoteData.address,
          project_type: quoteData.projectType,
          surfaces: quoteData.surfaces,
          total_square_feet: quoteData.totalSquareFeet,
          room_count: quoteData.roomCount,
          ceiling_height: quoteData.ceilingHeight,
          doors_windows: quoteData.doorsWindows,
          paint_brand: quoteData.paintBrand,
          paint_quality: quoteData.paintQuality,
          markup_percentage: quoteData.markup,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Quote Created Successfully!",
          description: `Quote ${result.quote_id} has been generated.`,
        });
        router.push(`/quotes/${result.id}/review`);
      } else {
        const error = await response.json();
        if (error.error && error.error.includes("quota")) {
          throw new Error("You've reached your quote limit. Please upgrade your account to create more quotes.");
        } else if (error.error && error.error.includes("validation")) {
          throw new Error("Please check all required fields are filled correctly.");
        } else {
          throw new Error("Quote creation failed. Please try again or contact support.");
        }
      }
    } catch (error: any) {
      console.error("Error creating quote:", error);
      
      let title = "Quote Creation Failed";
      let description = "Please try again.";
      
      if (error.message.includes("quota")) {
        title = "Quote Limit Reached";
        description = "Upgrade your account to create unlimited quotes.";
      } else if (error.message.includes("network") || error.message.includes("connection")) {
        title = "Connection Problem";
        description = "Please check your internet connection and try again.";
      } else if (error.message.includes("validation")) {
        title = "Information Missing";
        description = "Please make sure all required fields are filled out correctly.";
      }
      
      toast({
        title,
        description: error.message || description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  if (!companyData) {
    return (
      <div>
        <div>
          <div></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <QuoteWizard 
        onComplete={handleQuoteComplete} 
        onCancel={handleCancel}
      />
      
      {isLoading && (
        <div>
          <div>
            <div></div>
            <p>Creating your quote...</p>
          </div>
        </div>
      )}
    </div>
  );
}