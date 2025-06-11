"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Send, Calculator, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  ProjectDimensions,
  ProfessionalQuote,
  calculateProfessionalQuote,
  DEFAULT_PAINT_PRODUCTS,
  DEFAULT_CHARGE_RATES
} from "@/lib/professional-quote-calculator";
import {
  parseCustomerInfo,
  parseProjectType,
  parseDimensions,
  parseDoorsAndWindows,
  parsePaintQuality,
  parseMarkupPercentage,
  generateFollowUpQuestion,
  generateQuoteDisplay,
  ConversationData
} from "@/lib/professional-conversation-parser";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface QuoteData {
  customer_name: string;
  address: string;
  project_type: 'interior' | 'exterior' | 'both';
  dimensions: Partial<ProjectDimensions>;
  selected_products: {
    primer_level: 0 | 1 | 2;
    wall_paint_level: 0 | 1 | 2;
    ceiling_paint_level: 0 | 1 | 2;
    trim_paint_level: 0 | 1 | 2;
    include_floor_sealer: boolean;
  };
  markup_percentage: number;
  rates: typeof DEFAULT_CHARGE_RATES;
  calculation: ProfessionalQuote | null;
}

export default function CreateQuotePage() {
  const router = useRouter();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [companyData, setCompanyData] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'll help you create a professional painting quote using industry-standard calculations. Let's start with the basics.\n\nWhat's the customer's name and property address?",
      timestamp: new Date().toISOString()
    }
  ]);

  const [quoteData, setQuoteData] = useState<QuoteData>({
    customer_name: '',
    address: '',
    project_type: 'interior',
    dimensions: {},
    selected_products: {
      primer_level: 0,
      wall_paint_level: 0,
      ceiling_paint_level: 0,
      trim_paint_level: 0,
      include_floor_sealer: false
    },
    markup_percentage: 20, // Default 20% markup
    rates: DEFAULT_CHARGE_RATES,
    calculation: null
  });

  const [conversationStage, setConversationStage] = useState('customer_info');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check authentication and load company defaults
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
      loadCompanyDefaults(parsedCompany.id);
    } catch (e) {
      localStorage.removeItem("paintquote_company");
      router.push("/access-code");
    }
  }, [router]);

  const loadCompanyDefaults = async (companyId: string) => {
    try {
      const response = await fetch(`/api/companies/settings?companyId=${companyId}`);
      const settings = await response.json();
      
      setQuoteData(prev => ({
        ...prev,
        rates: {
          wall_rate_per_sqft: settings.wall_rate_per_sqft || DEFAULT_CHARGE_RATES.wall_rate_per_sqft,
          ceiling_rate_per_sqft: settings.ceiling_rate_per_sqft || DEFAULT_CHARGE_RATES.ceiling_rate_per_sqft,
          primer_rate_per_sqft: settings.primer_rate_per_sqft || DEFAULT_CHARGE_RATES.primer_rate_per_sqft,
          door_rate_each: settings.door_rate_each || DEFAULT_CHARGE_RATES.door_rate_each,
          window_rate_each: settings.window_rate_each || DEFAULT_CHARGE_RATES.window_rate_each,
          floor_sealer_rate_per_sqft: settings.floor_sealer_rate_per_sqft || DEFAULT_CHARGE_RATES.floor_sealer_rate_per_sqft
        }
      }));
    } catch (error) {
      console.error('Failed to load company defaults:', error);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await processUserInput(inputValue, conversationStage);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error processing input:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again or contact support.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const processUserInput = async (input: string, stage: string): Promise<Message> => {
    let responseContent = '';
    let nextStage = stage;

    switch (stage) {
      case 'customer_info':
        const customerInfo = parseCustomerInfo(input);
        setQuoteData(prev => ({ 
          ...prev, 
          customer_name: customerInfo.customer_name,
          address: customerInfo.address
        }));
        
        if (customerInfo.customer_name && customerInfo.address) {
          responseContent = `Perfect! I have ${customerInfo.customer_name} at ${customerInfo.address}.\n\nWhat type of painting work are we quoting?\n• Interior only\n• Exterior only\n• Both interior and exterior`;
          nextStage = 'project_type';
        } else if (customerInfo.customer_name && !customerInfo.address) {
          responseContent = `Great! I have the customer name as ${customerInfo.customer_name}. What's the property address?`;
          nextStage = 'address';
        } else if (!customerInfo.customer_name && customerInfo.address) {
          responseContent = `I have the address as ${customerInfo.address}. What's the customer's name?`;
          nextStage = 'customer_name';
        } else {
          responseContent = "Please provide both the customer's name and property address.";
        }
        break;

      case 'address':
        setQuoteData(prev => ({ ...prev, address: input.trim() }));
        responseContent = `Thanks! Now I have ${quoteData.customer_name} at ${input.trim()}.\n\nWhat type of painting work are we quoting?\n• Interior only\n• Exterior only\n• Both interior and exterior`;
        nextStage = 'project_type';
        break;
        
      case 'customer_name':
        setQuoteData(prev => ({ ...prev, customer_name: input.trim() }));
        responseContent = `Perfect! Now I have ${input.trim()} at ${quoteData.address}.\n\nWhat type of painting work are we quoting?\n• Interior only\n• Exterior only\n• Both interior and exterior`;
        nextStage = 'project_type';
        break;

      case 'project_type':
        const projectType = parseProjectType(input);
        setQuoteData(prev => ({ ...prev, project_type: projectType }));
        
        responseContent = `Great! For ${projectType} painting, I need the room dimensions:\n\n• **Wall linear footage** (perimeter of walls to be painted)\n• **Ceiling height** (in feet)\n${projectType === 'interior' || projectType === 'both' ? '• **Ceiling area** (square footage)\n' : ''}\nFor example: "120 linear feet, 9 foot ceilings${projectType === 'interior' || projectType === 'both' ? ', 1200 sqft ceiling area' : ''}"`;
        nextStage = 'dimensions';
        break;

      case 'dimensions':
        const dimensions = parseDimensions(input, quoteData.project_type);
        setQuoteData(prev => ({ 
          ...prev, 
          dimensions: { ...prev.dimensions, ...dimensions }
        }));
        
        // Check if we have enough dimensions to proceed
        const hasRequiredDimensions = dimensions.wall_linear_feet && dimensions.ceiling_height && 
          (quoteData.project_type === 'exterior' || dimensions.ceiling_area);
        
        if (hasRequiredDimensions) {
          responseContent = `Excellent! Now I need to count the doors and windows:\n\n• How many **doors** need painting?\n• How many **windows** need painting?\n\nFor example: "3 doors and 5 windows" or "2 doors, no windows"`;
          nextStage = 'doors_windows';
        } else {
          responseContent = generateFollowUpQuestion('dimensions', { dimensions: { ...quoteData.dimensions, ...dimensions }, project_type: quoteData.project_type });
        }
        break;
        
      case 'doors_windows':
        const doorsWindows = parseDoorsAndWindows(input);
        setQuoteData(prev => ({
          ...prev,
          dimensions: {
            ...prev.dimensions,
            number_of_doors: doorsWindows.doors,
            number_of_windows: doorsWindows.windows
          }
        }));
        
        responseContent = `Perfect! Now what paint quality would you like?\n\n• **Good** - Budget-friendly, basic coverage\n• **Better** - Mid-range, better durability  \n• **Best** - Premium, longest lasting\n\nYou can choose the same level for all surfaces or specify different levels.`;
        nextStage = 'paint_quality';
        break;
        
      case 'paint_quality':
        const paintQuality = parsePaintQuality(input);
        const updatedQuoteData = {
          ...quoteData,
          selected_products: {
            ...quoteData.selected_products,
            wall_paint_level: paintQuality.walls as 0 | 1 | 2,
            ceiling_paint_level: paintQuality.ceilings as 0 | 1 | 2,
            trim_paint_level: paintQuality.trim as 0 | 1 | 2
          }
        };
        setQuoteData(updatedQuoteData);
        
        responseContent = `Excellent! Now let's set your profit margin. What markup percentage would you like?\\n\\n\u2022 **10%** - Minimum profit (competitive pricing)\\n\u2022 **20%** - Standard profit (recommended)\\n\u2022 **30%** - Good profit (premium pricing)\\n\u2022 **40%** - High profit (luxury pricing)\\n\\nThis determines how much profit you make above your costs.`;
        nextStage = 'markup_selection';
        break;
        
      case 'markup_selection':
        const markupPercentage = parseMarkupPercentage(input);
        const finalQuoteData = {
          ...quoteData,
          markup_percentage: markupPercentage
        };
        setQuoteData(finalQuoteData);
        
        // Calculate the professional quote with markup
        if (finalQuoteData.dimensions.wall_linear_feet && 
            finalQuoteData.dimensions.ceiling_height &&
            finalQuoteData.dimensions.number_of_doors !== undefined &&
            finalQuoteData.dimensions.number_of_windows !== undefined) {
          
          const calculation = calculateProfessionalQuote(
            finalQuoteData.dimensions as ProjectDimensions,
            {
              primer: {
                name: DEFAULT_PAINT_PRODUCTS.primer_name,
                spread_rate: DEFAULT_PAINT_PRODUCTS.primer_spread_rate,
                cost: DEFAULT_PAINT_PRODUCTS.primer_cost_per_gallon
              } as any,
              wall_paint: DEFAULT_PAINT_PRODUCTS.wall_paints[finalQuoteData.selected_products.wall_paint_level],
              ceiling_paint: DEFAULT_PAINT_PRODUCTS.ceiling_paints[finalQuoteData.selected_products.ceiling_paint_level],
              trim_paint: DEFAULT_PAINT_PRODUCTS.trim_paints[finalQuoteData.selected_products.trim_paint_level],
              floor_sealer: DEFAULT_PAINT_PRODUCTS.floor_sealer
            },
            finalQuoteData.rates,
            markupPercentage, // Include the selected markup
            false // No floor sealer for now
          );
          
          setQuoteData(prev => ({ ...prev, calculation }));
          responseContent = generateQuoteDisplay(calculation, finalQuoteData.customer_name, finalQuoteData.address);
          nextStage = 'quote_review';
        } else {
          responseContent = "I need more information to calculate the quote. Let me ask for the missing details.";
          nextStage = 'dimensions';
        }
        break;

      case 'quote_review':
        const lowerInput = input.toLowerCase();
        
        if (lowerInput.includes('breakdown') || lowerInput.includes('how did you calculate') || lowerInput.includes('detail')) {
          const calc = quoteData.calculation!;
          responseContent = `## 📋 **Detailed Breakdown**\n\n**Materials:**\n• Primer: ${calc.materials.primer.gallons_needed} gal × $${(calc.materials.primer.cost / calc.materials.primer.gallons_needed).toFixed(0)} = $${calc.materials.primer.cost}\n• Wall Paint: ${calc.materials.walls.gallons_needed} gal × $${(calc.materials.walls.cost / calc.materials.walls.gallons_needed).toFixed(0)} = $${calc.materials.walls.cost}\n• Ceiling Paint: ${calc.materials.ceilings.gallons_needed} gal × $${(calc.materials.ceilings.cost / calc.materials.ceilings.gallons_needed).toFixed(0)} = $${calc.materials.ceilings.cost}\n• Trim Paint: ${calc.materials.trim_doors_windows.gallons_needed} gal × $${(calc.materials.trim_doors_windows.cost / calc.materials.trim_doors_windows.gallons_needed).toFixed(0)} = $${calc.materials.trim_doors_windows.cost}\n\n**Labor Rates:**\n• Primer: ${calc.materials.primer.sqft_needed} sqft × $${quoteData.rates.primer_rate_per_sqft} = $${calc.labor.primer_labor}\n• Walls: ${calc.materials.walls.sqft_needed} sqft × $${quoteData.rates.wall_rate_per_sqft} = $${calc.labor.wall_labor}\n• Ceilings: ${calc.materials.ceilings.sqft_needed} sqft × $${quoteData.rates.ceiling_rate_per_sqft} = $${calc.labor.ceiling_labor}\n• Doors: ${calc.materials.trim_doors_windows.doors_count} × $${quoteData.rates.door_rate_each} = $${calc.labor.door_labor}\n• Windows: ${calc.materials.trim_doors_windows.windows_count} × $${quoteData.rates.window_rate_each} = $${calc.labor.window_labor}`;
        } else if (lowerInput.includes('adjust markup') || lowerInput.includes('change markup') || lowerInput.includes('markup')) {
          responseContent = `Current markup is ${quoteData.markup_percentage}%. What markup percentage would you like?\n\n• **10%** - Minimum profit\n• **20%** - Standard profit\n• **30%** - Good profit\n• **40%** - High profit`;
          nextStage = 'markup_adjustment';
        } else if (lowerInput.includes('adjust') || lowerInput.includes('change') || lowerInput.includes('modify')) {
          responseContent = `What would you like to adjust? I can modify:\n\n• **Markup** (currently ${quoteData.markup_percentage}%)\n• **Dimensions** (linear feet, ceiling height, doors, windows)\n• **Paint quality** (good, better, best)\n• **Rates** (currently $${quoteData.rates.wall_rate_per_sqft}/sqft walls, $${quoteData.rates.door_rate_each}/door, $${quoteData.rates.window_rate_each}/window)\n\nJust tell me what you'd like to change!`;
          nextStage = 'adjustments';
        } else if (lowerInput.includes('save') || lowerInput.includes('approve') || lowerInput.includes('finalize')) {
          await saveQuote();
          responseContent = `✅ Quote saved successfully!\n\n**Final Details:**\n• Customer: ${quoteData.customer_name}\n• **Customer Price: $${quoteData.calculation!.final_price.toLocaleString()}**\n• Your Cost: $${quoteData.calculation!.total_cost.toLocaleString()}\n• Your Profit: $${quoteData.calculation!.markup_amount.toLocaleString()}\n\nWould you like to create another quote or return to the dashboard?`;
          nextStage = 'complete';
        } else {
          responseContent = `**Customer Price: $${quoteData.calculation!.final_price.toLocaleString()}** (Your profit: $${quoteData.calculation!.markup_amount.toLocaleString()})\n\nWhat would you like to do?\n• **"Save"** - Finalize this quote\n• **"Adjust markup"** - Change profit percentage\n• **"Breakdown"** - See detailed calculations`;
        }
        break;
        
      case 'markup_adjustment':
        const newMarkupPercentage = parseMarkupPercentage(input);
        const updatedMarkupData = {
          ...quoteData,
          markup_percentage: newMarkupPercentage
        };
        setQuoteData(updatedMarkupData);
        
        // Recalculate with new markup
        if (updatedMarkupData.dimensions.wall_linear_feet && 
            updatedMarkupData.dimensions.ceiling_height &&
            updatedMarkupData.dimensions.number_of_doors !== undefined &&
            updatedMarkupData.dimensions.number_of_windows !== undefined) {
          
          const recalculation = calculateProfessionalQuote(
            updatedMarkupData.dimensions as ProjectDimensions,
            {
              primer: {
                name: DEFAULT_PAINT_PRODUCTS.primer_name,
                spread_rate: DEFAULT_PAINT_PRODUCTS.primer_spread_rate,
                cost: DEFAULT_PAINT_PRODUCTS.primer_cost_per_gallon
              } as any,
              wall_paint: DEFAULT_PAINT_PRODUCTS.wall_paints[updatedMarkupData.selected_products.wall_paint_level],
              ceiling_paint: DEFAULT_PAINT_PRODUCTS.ceiling_paints[updatedMarkupData.selected_products.ceiling_paint_level],
              trim_paint: DEFAULT_PAINT_PRODUCTS.trim_paints[updatedMarkupData.selected_products.trim_paint_level]
            },
            updatedMarkupData.rates,
            newMarkupPercentage,
            false
          );
          
          setQuoteData(prev => ({ ...prev, calculation: recalculation }));
          responseContent = `✅ **Updated with ${newMarkupPercentage}% markup!**\\n\\n**Customer Price: $${recalculation.final_price.toLocaleString()}**\\n**Your Profit: $${recalculation.markup_amount.toLocaleString()}**\\n\\nSay \"save\" to finalize or adjust again.`;
        }
        nextStage = 'quote_review';
        break;

      case 'adjustments':
        // Simple adjustment parsing for now - can be enhanced later
        const lowerAdj = input.toLowerCase();
        let newQuoteData = { ...quoteData };
        let adjustmentMade = false;
        
        // Check for rate adjustments
        const rateMatch = input.match(/\$(\d+\.?\d*)/g);
        if (rateMatch && lowerAdj.includes('wall')) {
          const newRate = parseFloat(rateMatch[0].replace('$', ''));
          newQuoteData.rates.wall_rate_per_sqft = newRate;
          adjustmentMade = true;
        }
        
        // Check for dimension adjustments
        const numberMatch = input.match(/\d+/g);
        if (numberMatch && lowerAdj.includes('linear')) {
          newQuoteData.dimensions.wall_linear_feet = Number(numberMatch[0]);
          adjustmentMade = true;
        }
        
        if (adjustmentMade) {
          setQuoteData(newQuoteData);
          
          // Recalculate with adjustments
          const newCalculation = calculateProfessionalQuote(
            newQuoteData.dimensions as ProjectDimensions,
            {
              primer: {
                name: DEFAULT_PAINT_PRODUCTS.primer_name,
                spread_rate: DEFAULT_PAINT_PRODUCTS.primer_spread_rate,
                cost: DEFAULT_PAINT_PRODUCTS.primer_cost_per_gallon
              } as any,
              wall_paint: DEFAULT_PAINT_PRODUCTS.wall_paints[newQuoteData.selected_products.wall_paint_level],
              ceiling_paint: DEFAULT_PAINT_PRODUCTS.ceiling_paints[newQuoteData.selected_products.ceiling_paint_level],
              trim_paint: DEFAULT_PAINT_PRODUCTS.trim_paints[newQuoteData.selected_products.trim_paint_level]
            },
            newQuoteData.rates,
            newQuoteData.markup_percentage,
            false
          );
          
          setQuoteData(prev => ({ ...prev, calculation: newCalculation }));
          
          responseContent = `✅ **Updated Quote:**\n\n• **Total Quote:** $${newCalculation.total_cost.toLocaleString()}\n• **Materials:** $${newCalculation.materials.total_material_cost.toLocaleString()}\n• **Labor:** $${newCalculation.labor.total_labor.toLocaleString()}\n\nDoes this look better? Say "save" to finalize or make more adjustments.`;
        } else {
          responseContent = "I didn't understand that adjustment. Please specify what you'd like to change more clearly. For example: 'Change wall rate to $2.00' or 'Update linear feet to 150'.";
        }
        nextStage = 'quote_review';
        break;

      case 'complete':
        const lowerInputComplete = input.toLowerCase();
        if (lowerInputComplete.includes('another') || lowerInputComplete.includes('new quote')) {
          // Reset for new quote
          setQuoteData({
            customer_name: '',
            address: '',
            project_type: 'interior',
            dimensions: {},
            selected_products: {
              primer_level: 0,
              wall_paint_level: 0,
              ceiling_paint_level: 0,
              trim_paint_level: 0,
              include_floor_sealer: false
            },
            markup_percentage: 20, // Keep default markup
            rates: quoteData.rates, // Keep company rates
            calculation: null
          });
          setConversationStage('customer_info');
          responseContent = `Great! Let's create another quote. What's the customer's name and property address?`;
          return {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: responseContent,
            timestamp: new Date().toISOString()
          };
        } else {
          responseContent = `Thanks for using our quote system! You can:\n• **"Another quote"** - Create a new quote\n• **"Dashboard"** - Return to main dashboard\n• **"Exit"** - Close this session`;
        }
        break;

      default:
        responseContent = "I'm not sure what you're looking for. Could you please clarify?";
    }

    setConversationStage(nextStage);

    return {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date().toISOString()
    };
  };

  const saveQuote = async () => {
    if (!quoteData.calculation || !companyData) return;

    try {
      const calc = quoteData.calculation;
      const dims = quoteData.dimensions;
      
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: companyData.id,
          customer_name: quoteData.customer_name,
          customer_email: '',
          customer_phone: '',
          address: quoteData.address,
          project_type: quoteData.project_type,
          
          // Professional dimensions
          wall_linear_feet: dims.wall_linear_feet || 0,
          ceiling_height: dims.ceiling_height || 0,
          ceiling_area: dims.ceiling_area || 0,
          number_of_doors: dims.number_of_doors || 0,
          number_of_windows: dims.number_of_windows || 0,
          floor_area: dims.floor_area || 0,
          
          // Professional rates
          wall_rate_per_sqft: quoteData.rates.wall_rate_per_sqft,
          ceiling_rate_per_sqft: quoteData.rates.ceiling_rate_per_sqft,
          primer_rate_per_sqft: quoteData.rates.primer_rate_per_sqft,
          door_rate_each: quoteData.rates.door_rate_each,
          window_rate_each: quoteData.rates.window_rate_each,
          
          // Material calculations
          primer_gallons: calc.materials.primer.gallons_needed,
          wall_paint_gallons: calc.materials.walls.gallons_needed,
          ceiling_paint_gallons: calc.materials.ceilings.gallons_needed,
          trim_paint_gallons: calc.materials.trim_doors_windows.gallons_needed,
          
          // Cost breakdown with markup
          total_materials: calc.materials.total_material_cost,
          total_labor: calc.labor.total_labor,
          overhead: calc.overhead,
          total_cost: calc.total_cost, // Contractor's cost
          markup_percentage: quoteData.markup_percentage,
          markup_amount: calc.markup_amount,
          total_revenue: calc.final_price, // Customer pays this
          
          // Legacy compatibility fields
          walls_sqft: calc.materials.walls.sqft_needed,
          ceilings_sqft: calc.materials.ceilings.sqft_needed,
          trim_sqft: 0, // Not used in professional calculator
          quote_amount: calc.final_price, // Customer price
          final_price: calc.final_price, // Customer price
          notes: `${quoteData.project_type} - ${dims.wall_linear_feet}LF walls, ${dims.ceiling_height}' high, ${dims.number_of_doors} doors, ${dims.number_of_windows} windows`,
          conversation_summary: JSON.stringify(messages)
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Quote Saved!",
          description: `Professional quote ${result.quoteId || result.quote?.id} saved successfully.`,
        });
      } else {
        throw new Error('Failed to save quote');
      }
    } catch (error) {
      console.error('Failed to save quote:', error);
      toast({
        title: "Error",
        description: "Failed to save quote. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!companyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm relative z-20">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard")}
                className="w-10 h-10 hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="flex items-center gap-2">
                <Calculator className="w-6 h-6 text-blue-600" />
                <h1 className="text-lg font-semibold">Create Quote</h1>
              </div>
            </div>
            
            {quoteData.calculation && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Customer Price</div>
                <div className="text-lg font-bold text-green-600">
                  ${quoteData.calculation.final_price.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  Profit: ${quoteData.calculation.markup_amount.toLocaleString()} ({quoteData.markup_percentage}%)
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] p-4 rounded-lg shadow-sm",
                  message.role === 'user'
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white border rounded-bl-sm"
                )}
              >
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
                <div className={cn(
                  "text-xs mt-2",
                  message.role === 'user' ? "text-blue-100" : "text-gray-500"
                )}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="bg-white border p-4 rounded-lg rounded-bl-sm shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-500">Calculating...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
              className="shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}