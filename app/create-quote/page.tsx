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
  ProjectAreas,
  ChargeRates,
  PaintCosts,
  QuoteCalculation,
  calculateQuote,
  parseCustomerInfo,
  parseProjectType,
  parseAreas,
  parseAdjustments,
  parseCustomPricing,
  generateQuoteDisplay,
  generateDetailedBreakdown
} from "@/lib/spreadsheet-calculator";

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
  project_type: string;
  areas: ProjectAreas;
  rates: ChargeRates;
  paint_costs: PaintCosts;
  labor_percentage: number;
  calculation: QuoteCalculation | null;
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
      content: "Hi! I'll help you create a painting quote using our proven calculation system. Let's start with the basics.\n\nWhat's the customer's name and property address?",
      timestamp: new Date().toISOString()
    }
  ]);

  const [quoteData, setQuoteData] = useState<QuoteData>({
    customer_name: '',
    address: '',
    project_type: '',
    areas: { walls_sqft: 0, ceilings_sqft: 0, trim_sqft: 0 },
    rates: { walls_rate: 3.00, ceilings_rate: 2.00, trim_rate: 1.92 },
    paint_costs: { walls_paint_cost: 26.00, ceilings_paint_cost: 25.00, trim_paint_cost: 35.00 },
    labor_percentage: 30,
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
          walls_rate: settings.default_walls_rate || 3.00,
          ceilings_rate: settings.default_ceilings_rate || 2.00,
          trim_rate: settings.default_trim_rate || 1.92
        },
        paint_costs: {
          walls_paint_cost: settings.default_walls_paint_cost || 26.00,
          ceilings_paint_cost: settings.default_ceilings_paint_cost || 25.00,
          trim_paint_cost: settings.default_trim_paint_cost || 35.00
        },
        labor_percentage: settings.default_labor_percentage || 30
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
        // Parse comprehensive contractor input - extract all available information
        const customerInfo = parseCustomerInfo(input);
        const parsedProjectType = parseProjectType(input);
        const customPricing = parseCustomPricing(input);
        const parsedAreas = parseAreas(input, parsedProjectType || 'interior');
        
        // Apply custom pricing if provided
        let updatedQuoteData = { ...quoteData };
        
        if (customPricing.customRate) {
          // Apply custom rate to all surfaces if labor is included
          updatedQuoteData.rates = {
            walls_rate: customPricing.customRate,
            ceilings_rate: customPricing.customRate,
            trim_rate: customPricing.customRate
          };
          console.log(`Applied custom rate: $${customPricing.customRate}/sqft`);
        }
        
        if (customPricing.customPaintCost) {
          // Apply custom paint cost to all surface types
          updatedQuoteData.paint_costs = {
            walls_paint_cost: customPricing.customPaintCost,
            ceilings_paint_cost: customPricing.customPaintCost,
            trim_paint_cost: customPricing.customPaintCost
          };
          console.log(`Applied custom paint cost: $${customPricing.customPaintCost}/gallon`);
        }
        
        if (customPricing.laborIncluded) {
          // If labor is included in the rate, set labor percentage to 0
          updatedQuoteData.labor_percentage = 0;
          console.log('Labor included in rate - set labor percentage to 0%');
        }
        
        // Update all parsed information
        updatedQuoteData = {
          ...updatedQuoteData,
          customer_name: customerInfo.customer_name,
          address: customerInfo.address,
          project_type: parsedProjectType || updatedQuoteData.project_type,
          areas: parsedAreas.walls_sqft > 0 || parsedAreas.ceilings_sqft > 0 || parsedAreas.trim_sqft > 0 ? parsedAreas : updatedQuoteData.areas
        };
        
        setQuoteData(updatedQuoteData);
        
        // Check if we have enough information to calculate the quote
        const hasCustomer = customerInfo.customer_name && customerInfo.address;
        const hasProject = parsedProjectType || updatedQuoteData.project_type;
        const hasAreas = parsedAreas.walls_sqft > 0 || parsedAreas.ceilings_sqft > 0 || parsedAreas.trim_sqft > 0;
        
        if (hasCustomer && hasProject && hasAreas) {
          // We have all information - calculate the quote immediately
          const calculation = calculateQuote(
            parsedAreas,
            updatedQuoteData.rates,
            updatedQuoteData.paint_costs,
            updatedQuoteData.labor_percentage,
            customPricing.coverage || 350
          );
          
          setQuoteData(prev => ({ ...prev, calculation }));
          
          // Apply markup if specified
          let finalCalculation = calculation;
          if (customPricing.customMarkup) {
            const markupMultiplier = 1 + (customPricing.customMarkup / 100);
            finalCalculation = {
              ...calculation,
              revenue: {
                ...calculation.revenue,
                total: calculation.revenue.total * markupMultiplier
              }
            };
            finalCalculation.profit = finalCalculation.revenue.total - calculation.materials.total - calculation.labor.projected_labor;
            setQuoteData(prev => ({ ...prev, calculation: finalCalculation }));
          }
          
          responseContent = `Perfect! I parsed your complete project details:\n\n**Customer:** ${customerInfo.customer_name}\n**Address:** ${customerInfo.address}\n**Project:** ${parsedProjectType} painting\n**Areas:** ${parsedAreas.walls_sqft} sq ft walls${parsedAreas.ceilings_sqft > 0 ? `, ${parsedAreas.ceilings_sqft} sq ft ceilings` : ''}${parsedAreas.trim_sqft > 0 ? `, ${parsedAreas.trim_sqft} sq ft trim` : ''}\n\n${generateQuoteDisplay(finalCalculation, parsedAreas, updatedQuoteData.rates, updatedQuoteData.paint_costs)}`;
          nextStage = 'quote_review';
        } else if (hasCustomer) {
          responseContent = `Perfect! I have ${customerInfo.customer_name} at ${customerInfo.address}.\n\nWhat type of painting work are we quoting?\n• Interior (walls, ceilings, trim)\n• Exterior\n• Both interior and exterior`;
          nextStage = 'project_type';
        } else {
          responseContent = `Great! I have the customer name as ${customerInfo.customer_name}. What's the property address?`;
          nextStage = 'address';
        }
        break;

      case 'address':
        setQuoteData(prev => ({ ...prev, address: input.trim() }));
        responseContent = `Thanks! Now I have ${quoteData.customer_name} at ${input.trim()}.\n\nWhat type of painting work are we quoting?\n• Interior (walls, ceilings, trim)\n• Exterior\n• Both interior and exterior`;
        nextStage = 'project_type';
        break;

      case 'project_type':
        const projectType = parseProjectType(input);
        setQuoteData(prev => ({ ...prev, project_type: projectType }));
        
        if (projectType === 'interior') {
          responseContent = `Perfect! For interior work, I need the square footage for each surface:\n\n• **Walls** (paintable wall area)\n• **Ceilings** (ceiling area) \n• **Trim** (doors, windows, baseboards)\n\nYou can say something like "1000 walls, 1000 ceilings, 520 trim" or just give me total square footage and I'll estimate the breakdown.`;
        } else if (projectType === 'exterior') {
          responseContent = `Got it! For exterior work, I need:\n\n• **Walls** (siding, stucco, etc.)\n• **Trim** (windows, doors, fascia)\n\nCeilings typically aren't painted on exterior jobs. What's the square footage?`;
        } else {
          responseContent = `Great! For both interior and exterior work, I'll need square footage for:\n\n• **Interior walls**\n• **Interior ceilings**\n• **Interior trim**\n• **Exterior walls**\n• **Exterior trim**\n\nWhat are the measurements?`;
        }
        nextStage = 'areas';
        break;

      case 'areas':
        const areas = parseAreas(input, quoteData.project_type);
        const updatedAreasData = { ...quoteData, areas };
        setQuoteData(updatedAreasData);
        
        // Calculate quote automatically using spreadsheet formulas
        const calculation = calculateQuote(
          areas, 
          updatedAreasData.rates, 
          updatedAreasData.paint_costs, 
          updatedAreasData.labor_percentage
        );
        
        setQuoteData(prev => ({ ...prev, calculation }));
        
        responseContent = generateQuoteDisplay(calculation, areas, updatedAreasData.rates, updatedAreasData.paint_costs);
        nextStage = 'quote_review';
        break;

      case 'quote_review':
        const lowerInput = input.toLowerCase();
        
        if (lowerInput.includes('breakdown') || lowerInput.includes('how did you calculate') || lowerInput.includes('detail')) {
          responseContent = generateDetailedBreakdown(quoteData.calculation!, quoteData.areas, quoteData.rates, quoteData.paint_costs);
        } else if (lowerInput.includes('adjust') || lowerInput.includes('change') || lowerInput.includes('modify')) {
          responseContent = `What would you like to adjust? I can modify:\n\n• **Square footage** (walls, ceilings, trim)\n• **Charge rates** (currently $${quoteData.rates.walls_rate}/sqft walls, $${quoteData.rates.ceilings_rate}/sqft ceilings, $${quoteData.rates.trim_rate}/sqft trim)\n• **Labor percentage** (currently ${quoteData.labor_percentage}%)\n• **Paint costs**\n\nJust tell me what you'd like to change!`;
          nextStage = 'adjustments';
        } else if (lowerInput.includes('save') || lowerInput.includes('approve') || lowerInput.includes('finalize')) {
          await saveQuote();
          responseContent = `✅ Quote saved successfully!\n\n**Final Details:**\n• Customer: ${quoteData.customer_name}\n• Total Quote: $${quoteData.calculation!.revenue.total.toFixed(2)}\n• Projected Profit: $${quoteData.calculation!.profit.toFixed(2)}\n\nWould you like to create another quote or return to the dashboard?`;
          nextStage = 'complete';
        } else {
          responseContent = `Your quote total is **$${quoteData.calculation!.revenue.total.toFixed(2)}** with a projected profit of **$${quoteData.calculation!.profit.toFixed(2)}**.\n\nWhat would you like to do?\n• **"Save"** - Finalize this quote\n• **"Breakdown"** - See detailed calculations\n• **"Adjust"** - Modify pricing or measurements`;
        }
        break;

      case 'adjustments':
        const adjustments = parseAdjustments(input);
        let newQuoteData = { ...quoteData };
        
        // Apply adjustments
        if (adjustments.rates) {
          newQuoteData.rates = { ...newQuoteData.rates, ...adjustments.rates };
        }
        if (adjustments.paintCosts) {
          newQuoteData.paint_costs = { ...newQuoteData.paint_costs, ...adjustments.paintCosts };
        }
        if (adjustments.laborPercent) {
          newQuoteData.labor_percentage = adjustments.laborPercent;
        }
        if (adjustments.areas) {
          newQuoteData.areas = { ...newQuoteData.areas, ...adjustments.areas };
        }
        
        setQuoteData(newQuoteData);
        
        // Recalculate with adjustments
        const newCalculation = calculateQuote(
          newQuoteData.areas, 
          newQuoteData.rates, 
          newQuoteData.paint_costs, 
          newQuoteData.labor_percentage
        );
        
        setQuoteData(prev => ({ ...prev, calculation: newCalculation }));
        
        responseContent = `✅ **Updated Quote:**\n\n• **Total Quote:** $${newCalculation.revenue.total.toFixed(2)}\n• **Projected Profit:** $${newCalculation.profit.toFixed(2)}\n\nDoes this look better? Say "save" to finalize or make more adjustments.`;
        nextStage = 'quote_review';
        break;

      case 'complete':
        const lowerInputComplete = input.toLowerCase();
        if (lowerInputComplete.includes('another') || lowerInputComplete.includes('new quote')) {
          // Reset for new quote
          setQuoteData({
            customer_name: '',
            address: '',
            project_type: '',
            areas: { walls_sqft: 0, ceilings_sqft: 0, trim_sqft: 0 },
            rates: quoteData.rates, // Keep company rates
            paint_costs: quoteData.paint_costs, // Keep company paint costs
            labor_percentage: quoteData.labor_percentage, // Keep company labor %
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
          
          // Area calculations
          walls_sqft: quoteData.areas.walls_sqft,
          ceilings_sqft: quoteData.areas.ceilings_sqft,
          trim_sqft: quoteData.areas.trim_sqft,
          
          // Charge rates
          walls_rate: quoteData.rates.walls_rate,
          ceilings_rate: quoteData.rates.ceilings_rate,
          trim_rate: quoteData.rates.trim_rate,
          
          // Paint costs
          walls_paint_cost: quoteData.paint_costs.walls_paint_cost,
          ceilings_paint_cost: quoteData.paint_costs.ceilings_paint_cost,
          trim_paint_cost: quoteData.paint_costs.trim_paint_cost,
          
          // Calculation results
          total_revenue: quoteData.calculation.revenue.total,
          total_materials: quoteData.calculation.materials.total,
          projected_labor: quoteData.calculation.labor.projected_labor,
          labor_percentage: quoteData.labor_percentage,
          projected_profit: quoteData.calculation.profit,
          
          // Legacy fields for compatibility
          quote_amount: quoteData.calculation.revenue.total,
          final_price: quoteData.calculation.revenue.total,
          notes: `${quoteData.project_type} - ${quoteData.areas.walls_sqft} walls, ${quoteData.areas.ceilings_sqft} ceilings, ${quoteData.areas.trim_sqft} trim`,
          conversation_summary: JSON.stringify(messages)
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Quote Saved!",
          description: `Quote ${result.quoteId || result.quote?.id} saved successfully.`,
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
                <h1 className="text-lg font-semibold">Spreadsheet Calculator</h1>
              </div>
            </div>
            
            {quoteData.calculation && (
              <div className="text-right">
                <div className="text-sm text-gray-600">Total Quote</div>
                <div className="text-lg font-bold text-blue-600">
                  ${quoteData.calculation.revenue.total.toFixed(2)}
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