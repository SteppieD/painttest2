"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ContractorQuoteWizard } from "@/components/ui/contractor-quote-wizard";
import { useToast } from "@/components/ui/use-toast";
import { calculateProfessionalQuote } from "@/lib/professional-quote-calculator";

export default function CreateQuoteProPage() {
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
      // Process room data for professional calculation
      const projectDimensions = {
        rooms: quoteData.rooms.map((room: any) => ({
          id: room.id,
          name: room.name,
          length: room.length,
          width: room.width,
          height: room.height,
          doors: room.doors,
          windows: room.windows,
          ceiling_area: room.length * room.width,
          wall_area: 2 * (room.length + room.width) * room.height - (room.doors * 20) - (room.windows * 15)
        })),
        room_count: quoteData.rooms.length,
        ceiling_height: quoteData.rooms[0]?.height || 8,
        // Calculate totals from rooms
        wall_linear_feet: quoteData.rooms.reduce((sum: number, room: any) => 
          sum + (2 * (room.length + room.width)), 0),
        ceiling_area: quoteData.rooms.reduce((sum: number, room: any) => 
          sum + (room.length * room.width), 0),
        number_of_doors: quoteData.rooms.reduce((sum: number, room: any) => sum + room.doors, 0),
        number_of_windows: quoteData.rooms.reduce((sum: number, room: any) => sum + room.windows, 0),
        floor_area: quoteData.rooms.reduce((sum: number, room: any) => 
          sum + (room.length * room.width), 0),
      };

      // Prepare surfaces array
      const selectedSurfaces = Object.entries(quoteData.surfaces)
        .filter(([_, selected]) => selected)
        .map(([surface, _]) => surface);

      // Create professional quote calculation
      const professionalQuote = calculateProfessionalQuote(
        projectDimensions,
        {
          primer_level: 1, // Default to better quality
          wall_paint_level: 1,
          ceiling_paint_level: 1,
          trim_paint_level: 1,
          include_floor_sealer: false
        },
        quoteData.markup
      );

      // Submit to backend
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
          
          // Professional room data
          rooms_data: JSON.stringify(quoteData.rooms),
          surfaces: selectedSurfaces,
          
          // Calculated totals
          total_square_feet: projectDimensions.ceiling_area + projectDimensions.wall_linear_feet * projectDimensions.ceiling_height,
          room_count: projectDimensions.room_count,
          ceiling_height: projectDimensions.ceiling_height,
          doors_windows: projectDimensions.number_of_doors + projectDimensions.number_of_windows,
          
          // Paint selections
          paint_selections: JSON.stringify(quoteData.paintSelections),
          
          // Pricing
          markup_percentage: quoteData.markup,
          labor_rate: quoteData.laborRate,
          quote_amount: professionalQuote.final_price,
          
          // Professional calculation breakdown
          professional_calculation: JSON.stringify(professionalQuote),
          
          // Status
          status: 'draft',
          created_by: 'contractor'
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        toast({
          title: "Professional Quote Created!",
          description: `Quote ${result.quote_id} generated with industry-standard calculations.`,
        });
        
        // Redirect to professional quote review
        router.push(`/quotes/${result.id}/review`);
      } else {
        const error = await response.json();
        
        if (error.error && error.error.includes("quota")) {
          throw new Error("You've reached your quote limit for this trial account. Please upgrade to create unlimited quotes.");
        } else if (error.error && error.error.includes("validation")) {
          throw new Error("Please verify all measurement data is complete and accurate.");
        } else {
          throw new Error("Failed to generate professional quote. Please check your data and try again.");
        }
      }
    } catch (error: any) {
      console.error("Error creating professional quote:", error);
      
      let title = "Quote Generation Failed";
      let description = "Please review your data and try again.";
      
      if (error.message.includes("quota")) {
        title = "Trial Limit Reached";
        description = "Upgrade to create unlimited professional quotes with advanced calculations.";
      } else if (error.message.includes("network") || error.message.includes("connection")) {
        title = "Connection Error";
        description = "Please check your internet connection and try again.";
      } else if (error.message.includes("measurement") || error.message.includes("validation")) {
        title = "Data Validation Error";
        description = "Please verify all room measurements and surface selections are complete.";
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading professional quote builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ContractorQuoteWizard 
        onComplete={handleQuoteComplete} 
        onCancel={handleCancel}
      />
      
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center max-w-sm">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Professional Quote</h3>
            <p className="text-gray-600">Calculating materials, labor, and industry-standard pricing...</p>
          </div>
        </div>
      )}
    </div>
  );
}