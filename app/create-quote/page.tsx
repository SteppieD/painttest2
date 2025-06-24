"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Send, Calculator, Loader2, FileText, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
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
  generateDetailedBreakdown,
  generateRateConfirmation,
  parseRateAdjustments,
  generateRateDisplay
} from "@/lib/spreadsheet-calculator";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

// Message content renderer with markdown and link support
const MessageContent: React.FC<{ content: string }> = ({ content }) => {
  // Parse links in format [text](url)
  const renderContent = (text: string) => {
    const parts = text.split(/\[([^\]]+)\]\(([^)]+)\)/g);
    
    return parts.map((part, index) => {
      // Every third part starting from index 1 is link text
      // Every third part starting from index 2 is link URL
      if (index % 3 === 1) {
        const linkText = part;
        const linkUrl = parts[index + 1];
        return (
          <a
            key={index}
            href={linkUrl}
            className="text-blue-600 hover:text-blue-700 underline font-medium inline-flex items-center gap-1"
            onClick={(e) => {
              e.preventDefault();
              window.open(linkUrl, '_blank');
            }}
          >
            {linkText}
            <ExternalLink className="w-3 h-3" />
          </a>
        );
      } else if (index % 3 === 2) {
        // Skip URL parts as they're handled above
        return null;
      } else {
        // Regular text with markdown
        return <MarkdownRenderer key={index} content={part} className="inline" />;
      }
    });
  };
  
  return <div className="whitespace-pre-wrap text-sm">{renderContent(content)}</div>;
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface PaintProduct {
  id: string;
  projectType: "interior" | "exterior";
  productCategory: string;
  supplier: string;
  productName: string;
  productLine?: string;
  costPerGallon: number;
  displayOrder: number;
  sheen?: string;
  coveragePerGallon?: number;
}

interface SelectedProducts {
  walls?: PaintProduct;
  ceilings?: PaintProduct;
  trim?: PaintProduct;
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
  availableProducts?: PaintProduct[];
  selectedProducts?: SelectedProducts;
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
    areas: { walls_sqft: 0, ceilings_sqft: 0, trim_sqft: 0, doors_count: 0, windows_count: 0, priming_sqft: 0 },
    rates: { painting_rate: 2.50, priming_rate: 0.40, trim_rate: 1.92, door_rate: 100.00, window_rate: 25.00 },
    paint_costs: { walls_paint_cost: 26.00, ceilings_paint_cost: 25.00, trim_paint_cost: 35.00 },
    labor_percentage: 30,
    calculation: null,
    availableProducts: [],
    selectedProducts: {}
  });

  const [conversationStage, setConversationStage] = useState('customer_info');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedQuoteId, setSavedQuoteId] = useState<string | null>(null);

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
      // Load both company settings and paint products in parallel
      const [settingsResponse, productsResponse] = await Promise.all([
        fetch(`/api/companies/settings?companyId=${companyId}`),
        fetch(`/api/paint-products?companyId=${companyId}`)
      ]);
      
      const settings = await settingsResponse.json();
      const productsData = await productsResponse.json();
      
      setQuoteData(prev => ({
        ...prev,
        rates: {
          painting_rate: settings.default_painting_rate || 2.50,
          priming_rate: settings.default_priming_rate || 0.40,
          trim_rate: settings.default_trim_rate || 1.92,
          door_rate: settings.default_door_rate || 100.00,
          window_rate: settings.default_window_rate || 25.00
        },
        paint_costs: {
          walls_paint_cost: settings.default_walls_paint_cost || 26.00,
          ceilings_paint_cost: settings.default_ceilings_paint_cost || 25.00,
          trim_paint_cost: settings.default_trim_paint_cost || 35.00
        },
        labor_percentage: settings.default_labor_percentage || 30,
        availableProducts: productsData.products || []
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
          
          responseContent = `Perfect! I parsed your complete project details:\n\n**Customer:** ${customerInfo.customer_name}\n**Address:** ${customerInfo.address}\n**Project:** ${parsedProjectType} painting\n**Areas:** ${parsedAreas.walls_sqft} sq ft walls${parsedAreas.ceilings_sqft > 0 ? `, ${parsedAreas.ceilings_sqft} sq ft ceilings` : ''}${parsedAreas.trim_sqft > 0 ? `, ${parsedAreas.trim_sqft} sq ft trim` : ''}\n\n${generateEnhancedQuoteDisplay(finalCalculation, parsedAreas, updatedQuoteData.rates, updatedQuoteData.selectedProducts)}`;
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
        
        // Check if we have enough area data to calculate
        const hasWallArea = areas.walls_sqft > 0;
        const hasCeilingArea = areas.ceilings_sqft > 0;
        const hasTrimArea = areas.trim_sqft > 0;
        const hasAnyArea = hasWallArea || hasCeilingArea || hasTrimArea;
        
        // Check for surface selection without measurements
        const wallsOnlyNoMeasurement = /only\s+(?:doing\s+)?walls?/i.test(input) && !hasWallArea;
        const ceilingsOnlyNoMeasurement = /only\s+(?:doing\s+)?ceilings?/i.test(input) && !hasCeilingArea;
        const trimOnlyNoMeasurement = /only\s+(?:doing\s+)?(?:trim|doors?|windows?)/i.test(input) && !hasTrimArea;
        
        if (wallsOnlyNoMeasurement) {
          responseContent = `Perfect! We're painting walls only.\\n\\nWhat's the wall square footage? You can say:\\n• "1200 walls" or "1200 sqft walls"\\n• Or if you have room dimensions: "living room 12x14, bedroom 10x12" and I'll calculate the wall area`;
          nextStage = 'wall_measurements';
        } else if (ceilingsOnlyNoMeasurement) {
          responseContent = `Got it! We're painting ceilings only.\\n\\nWhat's the ceiling square footage? You can say:\\n• "800 ceilings" or "800 sqft ceilings"\\n• Or room dimensions: "living room 12x14, bedroom 10x12" and I'll calculate ceiling area`;
          nextStage = 'ceiling_measurements';
        } else if (trimOnlyNoMeasurement) {
          responseContent = `Perfect! We're painting trim only.\\n\\nWhat's the trim square footage? You can say:\\n• "300 trim" or "300 sqft trim"\\n• Or count items: "6 doors, 8 windows" and I'll estimate`;
          nextStage = 'trim_measurements';
        } else if (!hasAnyArea) {
          responseContent = `I need the square footage measurements. Please provide:\\n\\n• **Specific measurements**: "1000 walls, 800 ceilings, 400 trim"\\n• **Total sqft**: "2200 total sqft" and I'll estimate breakdown\\n• **Room dimensions**: "living room 12x14, bedroom 10x12" and I'll calculate`;
          nextStage = 'areas'; // Stay in same stage to retry
        } else {
          // We have measurements - now select paint products
          responseContent = generatePaintProductSelection(updatedAreasData);
          nextStage = 'paint_product_selection';
        }
        break;

      case 'wall_measurements':
        const wallAreas = parseAreas(input, quoteData.project_type);
        if (wallAreas.walls_sqft > 0) {
          const finalAreas = { walls_sqft: wallAreas.walls_sqft, ceilings_sqft: 0, trim_sqft: 0, doors_count: 0, windows_count: 0, priming_sqft: 0 };
          const wallQuoteData = { ...quoteData, areas: finalAreas };
          setQuoteData(wallQuoteData);
          
          responseContent = generatePaintProductSelection(wallQuoteData);
          nextStage = 'paint_product_selection';
        } else {
          responseContent = `I need the wall square footage. Please say something like:\\n• "1200 walls"\\n• "1200 sqft"\\n• Room dimensions: "12x14 living room, 10x12 bedroom"`;
          nextStage = 'wall_measurements'; // Stay in same stage
        }
        break;

      case 'ceiling_measurements':
        const ceilingAreas = parseAreas(input, quoteData.project_type);
        if (ceilingAreas.ceilings_sqft > 0) {
          const finalAreas = { walls_sqft: 0, ceilings_sqft: ceilingAreas.ceilings_sqft, trim_sqft: 0, doors_count: 0, windows_count: 0, priming_sqft: 0 };
          const ceilingQuoteData = { ...quoteData, areas: finalAreas };
          setQuoteData(ceilingQuoteData);
          
          responseContent = generatePaintProductSelection(ceilingQuoteData);
          nextStage = 'paint_product_selection';
        } else {
          responseContent = `I need the ceiling square footage. Please say something like:\\n• "800 ceilings"\\n• "800 sqft"\\n• Room dimensions: "12x14 living room"`;
          nextStage = 'ceiling_measurements'; // Stay in same stage
        }
        break;

      case 'trim_measurements':
        const trimAreas = parseAreas(input, quoteData.project_type);
        if (trimAreas.trim_sqft > 0) {
          const finalAreas = { walls_sqft: 0, ceilings_sqft: 0, trim_sqft: trimAreas.trim_sqft, doors_count: trimAreas.doors_count, windows_count: trimAreas.windows_count };
          const trimQuoteData = { ...quoteData, areas: finalAreas };
          setQuoteData(trimQuoteData);
          
          const trimCalculation = calculateQuote(
            finalAreas, 
            trimQuoteData.rates, 
            trimQuoteData.paint_costs, 
            trimQuoteData.labor_percentage
          );
          
          setQuoteData(prev => ({ ...prev, calculation: trimCalculation }));
          responseContent = generateEnhancedQuoteDisplay(trimCalculation, finalAreas, trimQuoteData.rates, trimQuoteData.selectedProducts);
          nextStage = 'quote_review';
        } else {
          responseContent = `I need the trim square footage. Please say something like:\\n• "300 trim"\\n• "300 sqft"\\n• Item count: "6 doors, 8 windows"`;
          nextStage = 'trim_measurements'; // Stay in same stage
        }
        break;

      case 'paint_product_selection':
        // Parse paint product selection from user input
        const productSelection = parsePaintProductSelection(input, quoteData);
        if (productSelection.selectedProducts) {
          // Update quote data with selected products and calculated paint costs
          const updatedQuoteData = {
            ...quoteData,
            selectedProducts: { ...quoteData.selectedProducts, ...productSelection.selectedProducts },
            paint_costs: productSelection.paintCosts || quoteData.paint_costs
          };
          setQuoteData(updatedQuoteData);
          
          // Check if we have all required products selected
          const neededSurfaces = getNeededSurfaces(updatedQuoteData.areas);
          const hasAllProducts = neededSurfaces.every(surface => 
            updatedQuoteData.selectedProducts?.[surface as keyof SelectedProducts]
          );
          
          if (hasAllProducts) {
            // All products selected - proceed to rate confirmation
            responseContent = generateRateConfirmation(updatedQuoteData.rates, updatedQuoteData.areas);
            nextStage = 'rate_confirmation';
          } else {
            // Still need more products - continue selection
            responseContent = generatePaintProductSelection(updatedQuoteData);
            nextStage = 'paint_product_selection';
          }
        } else {
          // No valid selection found - ask again
          responseContent = generatePaintProductSelection(quoteData);
          nextStage = 'paint_product_selection';
        }
        break;

      case 'rate_confirmation':
        // Parse rate adjustments from user input
        const rateAdjustments = parseRateAdjustments(input);
        let updatedRatesData = { ...quoteData };
        
        // Apply rate adjustments if any
        if (rateAdjustments.hasChanges) {
          updatedRatesData.rates = { ...updatedRatesData.rates, ...rateAdjustments.rates };
          setQuoteData(updatedRatesData);
          responseContent = `✅ **Rates Updated:**\n\n${generateRateDisplay(updatedRatesData.rates, updatedRatesData.areas)}\n\nCalculating your quote with these rates...`;
        } else {
          responseContent = `Perfect! Using standard rates for calculation...`;
        }
        
        // Calculate quote with confirmed rates
        const calculation = calculateQuote(
          updatedRatesData.areas, 
          updatedRatesData.rates, 
          updatedRatesData.paint_costs, 
          updatedRatesData.labor_percentage
        );
        
        setQuoteData(prev => ({ ...prev, calculation }));
        
        // Add quote display after a brief delay
        setTimeout(() => {
          const finalResponse = responseContent + "\n\n" + generateEnhancedQuoteDisplay(calculation, updatedRatesData.areas, updatedRatesData.rates, updatedRatesData.selectedProducts);
          setMessages(prev => [...prev.slice(0, -1), {
            id: Date.now().toString(),
            role: 'assistant',
            content: finalResponse,
            timestamp: new Date().toISOString()
          }]);
        }, 1000);
        
        nextStage = 'quote_review';
        break;

      case 'quote_review':
        const lowerInput = input.toLowerCase();
        
        if (lowerInput.includes('breakdown') || lowerInput.includes('how did you calculate') || lowerInput.includes('detail')) {
          responseContent = generateDetailedBreakdown(quoteData.calculation!, quoteData.areas, quoteData.rates, quoteData.paint_costs);
        } else if (lowerInput.includes('adjust') || lowerInput.includes('change') || lowerInput.includes('modify')) {
          responseContent = `What would you like to adjust? I can modify:\n\n• **Square footage** (walls, ceilings, trim)\n• **Charge rates** (currently $${quoteData.rates.painting_rate}/sqft painting, $${quoteData.rates.trim_rate}/sqft trim)\n• **Labor percentage** (currently ${quoteData.labor_percentage}%)\n• **Paint products** - Change selected products\n• **Paint costs** - Adjust individual paint costs\n\nJust tell me what you'd like to change!`;
          nextStage = 'adjustments';
        } else if (lowerInput.includes('save') || lowerInput.includes('approve') || lowerInput.includes('finalize')) {
          const quoteId = await saveQuote();
          if (quoteId) {
            responseContent = `✅ **Quote saved successfully!**\n\n**Final Details:**\n• Customer: ${quoteData.customer_name}\n• Total Quote: $${quoteData.calculation!.revenue.total.toFixed(2)}\n• Projected Profit: $${quoteData.calculation!.profit.toFixed(2)}\n\n**Quick Actions:**\n[Review Quote](/quotes/${quoteId}/review) | [Customer Version](/quotes/${quoteId}/customer) | [Download PDF](/api/quotes/${quoteId}/pdf)\n\nWould you like to create another quote or return to the dashboard?`;
          } else {
            responseContent = `✅ Quote saved!\n\nWould you like to create another quote or return to the dashboard?`;
          }
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
            areas: { walls_sqft: 0, ceilings_sqft: 0, trim_sqft: 0, doors_count: 0, windows_count: 0 },
            rates: quoteData.rates, // Keep company rates
            paint_costs: quoteData.paint_costs, // Keep company paint costs
            labor_percentage: quoteData.labor_percentage, // Keep company labor %
            calculation: null
          });
          setConversationStage('customer_info');
          setSavedQuoteId(null); // Reset saved quote ID
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
          
          // Charge rates (unified system)
          painting_rate: quoteData.rates.painting_rate,
          priming_rate: quoteData.rates.priming_rate,
          trim_rate: quoteData.rates.trim_rate,
          door_rate: quoteData.rates.door_rate,
          window_rate: quoteData.rates.window_rate,
          
          // Legacy rates for backward compatibility
          walls_rate: quoteData.rates.painting_rate,
          ceilings_rate: quoteData.rates.painting_rate,
          
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
          
          // Selected paint products
          selected_products: JSON.stringify(quoteData.selectedProducts || {}),
          
          // Legacy fields for compatibility
          quote_amount: quoteData.calculation.revenue.total,
          final_price: quoteData.calculation.revenue.total,
          notes: `${quoteData.project_type} - ${quoteData.areas.walls_sqft} walls, ${quoteData.areas.ceilings_sqft} ceilings, ${quoteData.areas.trim_sqft} trim`,
          conversation_summary: JSON.stringify(messages)
        })
      });

      if (response.ok) {
        const result = await response.json();
        const quoteId = result.quoteId || result.quote?.id || result.id;
        setSavedQuoteId(quoteId);
        toast({
          title: "Quote Saved!",
          description: `Quote ${quoteId} saved successfully.`,
        });
        return quoteId;
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

  // Helper function to generate rate confirmation display with selected products
  const generateRateConfirmation = (rates: ChargeRates, areas: ProjectAreas): string => {
    // Use the imported function from spreadsheet calculator, but override here to include selected products
    const quoteDataForDisplay = { ...quoteData, rates, areas };
    
    let rateDisplay = "Perfect! Here are your selected products and rates:\n\n";
    
    // Show selected products and rates
    const totalPaintingSqft = areas.walls_sqft + areas.ceilings_sqft;
    if (totalPaintingSqft > 0) {
      const selectedWallProduct = quoteDataForDisplay.selectedProducts?.walls;
      const selectedCeilingProduct = quoteDataForDisplay.selectedProducts?.ceilings;
      
      rateDisplay += `• **Painting** (walls & ceilings): $${rates.painting_rate.toFixed(2)}/sq ft\n`;
      
      if (selectedWallProduct) {
        rateDisplay += `  - Walls: ${selectedWallProduct.supplier} ${selectedWallProduct.productName} ($${selectedWallProduct.costPerGallon}/gal)\n`;
      }
      if (selectedCeilingProduct) {
        rateDisplay += `  - Ceilings: ${selectedCeilingProduct.supplier} ${selectedCeilingProduct.productName} ($${selectedCeilingProduct.costPerGallon}/gal)\n`;
      }
    }
    
    if (areas.priming_sqft > 0) {
      rateDisplay += `• **Priming**: $${rates.priming_rate.toFixed(2)}/sq ft\n`;
    }
    if (areas.trim_sqft > 0) {
      const selectedTrimProduct = quoteDataForDisplay.selectedProducts?.trim;
      rateDisplay += `• **Trim**: $${rates.trim_rate.toFixed(2)}/sq ft\n`;
      if (selectedTrimProduct) {
        rateDisplay += `  - Product: ${selectedTrimProduct.supplier} ${selectedTrimProduct.productName} ($${selectedTrimProduct.costPerGallon}/gal)\n`;
      }
    }
    if (areas.doors_count > 0) {
      rateDisplay += `• **Doors**: $${rates.door_rate.toFixed(2)} each\n`;
    }
    if (areas.windows_count > 0) {
      rateDisplay += `• **Windows**: $${rates.window_rate.toFixed(2)} each\n`;
    }
    
    rateDisplay += "\n**Are there any rates here that you would like to change for this project?**\n\n";
    rateDisplay += "You can say things like:\n";
    rateDisplay += "• \"painting to $3.50\" (adjusts combined painting rate)\n";
    rateDisplay += "• \"doors are complex, make them $120\"\n";
    rateDisplay += "• \"looks good\" to proceed with these rates";
    
    return rateDisplay;
  };

  // Helper function to parse rate adjustments from user input
  const parseRateAdjustments = (input: string): { hasChanges: boolean; rates: Partial<ChargeRates> } => {
    const lowerInput = input.toLowerCase();
    const adjustments: Partial<ChargeRates> = {};
    let hasChanges = false;

    // Check for "looks good", "proceed", "yes", etc.
    if (lowerInput.includes('looks good') || lowerInput.includes('proceed') || 
        lowerInput.includes('yes') || lowerInput.includes('correct') ||
        lowerInput.includes('fine') || lowerInput.includes('okay')) {
      return { hasChanges: false, rates: {} };
    }

    // Parse painting rate (walls and ceilings combined)
    const paintingRateMatch = input.match(/(?:painting|walls?|ceilings?)\s+(?:should\s+be\s+|to\s+|at\s+)?\$?(\d+\.?\d*)/i);
    if (paintingRateMatch) {
      adjustments.painting_rate = parseFloat(paintingRateMatch[1]);
      hasChanges = true;
    }

    // Parse priming rate
    const primingRateMatch = input.match(/prim(?:ing|er)\s+(?:should\s+be\s+|to\s+|at\s+)?\$?(\d+\.?\d*)/i);
    if (primingRateMatch) {
      adjustments.priming_rate = parseFloat(primingRateMatch[1]);
      hasChanges = true;
    }

    // Parse trim rate
    const trimMatch = input.match(/trim\s+(?:should\s+be\s+|to\s+|at\s+)?\$?(\d+\.?\d*)/i);
    if (trimMatch) {
      adjustments.trim_rate = parseFloat(trimMatch[1]);
      hasChanges = true;
    }

    // Parse door rate
    const doorMatch = input.match(/doors?\s+(?:should\s+be\s+|to\s+|at\s+|are\s+.*?,?\s*make\s+them\s+)?\$?(\d+\.?\d*)/i);
    if (doorMatch) {
      adjustments.door_rate = parseFloat(doorMatch[1]);
      hasChanges = true;
    }

    // Parse window rate
    const windowMatch = input.match(/windows?\s+(?:should\s+be\s+|to\s+|at\s+)?\$?(\d+\.?\d*)/i);
    if (windowMatch) {
      adjustments.window_rate = parseFloat(windowMatch[1]);
      hasChanges = true;
    }

    return { hasChanges, rates: adjustments };
  };

  // Helper function to display confirmed rates
  const generateRateDisplay = (rates: ChargeRates, areas: ProjectAreas): string => {
    let display = "";
    
    const totalPaintingSqft = areas.walls_sqft + areas.ceilings_sqft;
    if (totalPaintingSqft > 0) {
      display += `• Painting: $${rates.painting_rate.toFixed(2)}/sq ft\n`;
    }
    if (areas.priming_sqft > 0) {
      display += `• Priming: $${rates.priming_rate.toFixed(2)}/sq ft\n`;
    }
    if (areas.trim_sqft > 0) {
      display += `• Trim: $${rates.trim_rate.toFixed(2)}/sq ft\n`;
    }
    if (areas.doors_count > 0) {
      display += `• Doors: $${rates.door_rate.toFixed(2)}/door\n`;
    }
    if (areas.windows_count > 0) {
      display += `• Windows: $${rates.window_rate.toFixed(2)}/window\n`;
    }
    
    return display;
  };

  // Helper function to determine which surfaces need paint products
  const getNeededSurfaces = (areas: ProjectAreas): string[] => {
    const surfaces: string[] = [];
    if (areas.walls_sqft > 0) surfaces.push('walls');
    if (areas.ceilings_sqft > 0) surfaces.push('ceilings');
    if (areas.trim_sqft > 0) surfaces.push('trim');
    return surfaces;
  };

  // Helper function to generate paint product selection prompt
  const generatePaintProductSelection = (quoteData: QuoteData): string => {
    const neededSurfaces = getNeededSurfaces(quoteData.areas);
    const availableProducts = quoteData.availableProducts || [];
    
    // Find the first surface that doesn't have a product selected yet
    const nextSurface = neededSurfaces.find(surface => 
      !quoteData.selectedProducts?.[surface as keyof SelectedProducts]
    );
    
    if (!nextSurface) {
      return "All paint products selected! Let me show you the rates.";
    }
    
    // Get products for this surface and project type
    const surfaceProducts = availableProducts.filter(product => {
      const projectType = quoteData.project_type === 'exterior' ? 'exterior' : 'interior';
      const categoryMap: { [key: string]: string } = {
        walls: 'wall_paint',
        ceilings: 'ceiling_paint', 
        trim: 'trim_paint'
      };
      
      return product.projectType === projectType && 
             product.productCategory === categoryMap[nextSurface];
    });
    
    if (surfaceProducts.length === 0) {
      return `I don't have any ${nextSurface} paint products configured for your company. Let's continue with standard rates for now. Say "continue" to proceed.`;
    }
    
    // Show available products as buttons
    let response = `Great! Now let's select your paint for **${nextSurface}**.\n\nI have these products available:\n\n`;
    
    surfaceProducts.forEach((product, index) => {
      response += `**${index + 1}.** ${product.supplier} ${product.productName}`;
      if (product.productLine) response += ` (${product.productLine})`;
      response += ` - $${product.costPerGallon}/gallon`;
      if (product.sheen) response += ` • ${product.sheen}`;
      response += `\n`;
    });
    
    response += `\nChoose by saying the number (1, 2, 3) or the product name. You can also say "custom" to enter a different product.`;
    
    return response;
  };

  // Helper function to parse paint product selection
  const parsePaintProductSelection = (input: string, quoteData: QuoteData): {
    selectedProducts?: Partial<SelectedProducts>;
    paintCosts?: PaintCosts;
  } => {
    const neededSurfaces = getNeededSurfaces(quoteData.areas);
    const availableProducts = quoteData.availableProducts || [];
    
    // Find the surface we're currently selecting for
    const nextSurface = neededSurfaces.find(surface => 
      !quoteData.selectedProducts?.[surface as keyof SelectedProducts]
    );
    
    if (!nextSurface) return {};
    
    // Get products for this surface
    const projectType = quoteData.project_type === 'exterior' ? 'exterior' : 'interior';
    const categoryMap: { [key: string]: string } = {
      walls: 'wall_paint',
      ceilings: 'ceiling_paint',
      trim: 'trim_paint'
    };
    
    const surfaceProducts = availableProducts.filter(product => 
      product.projectType === projectType && 
      product.productCategory === categoryMap[nextSurface]
    );
    
    let selectedProduct: PaintProduct | null = null;
    
    // Try to parse number selection (1, 2, 3)
    const numberMatch = input.match(/^(\d+)$/);
    if (numberMatch) {
      const index = parseInt(numberMatch[1]) - 1;
      if (index >= 0 && index < surfaceProducts.length) {
        selectedProduct = surfaceProducts[index];
      }
    }
    
    // Try to parse product name selection
    if (!selectedProduct) {
      const lowerInput = input.toLowerCase();
      selectedProduct = surfaceProducts.find(product => 
        lowerInput.includes(product.productName.toLowerCase()) ||
        lowerInput.includes(product.supplier.toLowerCase()) ||
        (product.productLine && lowerInput.includes(product.productLine.toLowerCase()))
      );
    }
    
    if (selectedProduct) {
      // Calculate updated paint costs
      const paintCostMap: { [key: string]: keyof PaintCosts } = {
        walls: 'walls_paint_cost',
        ceilings: 'ceilings_paint_cost',
        trim: 'trim_paint_cost'
      };
      
      const updatedPaintCosts = {
        ...quoteData.paint_costs,
        [paintCostMap[nextSurface]]: selectedProduct.costPerGallon
      };
      
      return {
        selectedProducts: {
          [nextSurface]: selectedProduct
        } as Partial<SelectedProducts>,
        paintCosts: updatedPaintCosts
      };
    }
    
    return {};
  };

  // Enhanced quote display that includes selected products
  const generateEnhancedQuoteDisplay = (
    calculation: QuoteCalculation,
    areas: ProjectAreas,
    rates: ChargeRates,
    selectedProducts?: SelectedProducts
  ): string => {
    const revenueLines = [];
    
    // Combined painting line with product details
    const totalPaintingSqft = areas.walls_sqft + areas.ceilings_sqft;
    if (totalPaintingSqft > 0) {
      revenueLines.push(`- Painting: ${totalPaintingSqft} sqft × $${rates.painting_rate.toFixed(2)}/sqft = $${calculation.revenue.painting.toFixed(2)}`);
      
      // Add product details if selected
      if (selectedProducts?.walls && areas.walls_sqft > 0) {
        revenueLines.push(`  • Walls: ${selectedProducts.walls.supplier} ${selectedProducts.walls.productName} ($${selectedProducts.walls.costPerGallon}/gal)`);
      }
      if (selectedProducts?.ceilings && areas.ceilings_sqft > 0) {
        revenueLines.push(`  • Ceilings: ${selectedProducts.ceilings.supplier} ${selectedProducts.ceilings.productName} ($${selectedProducts.ceilings.costPerGallon}/gal)`);
      }
    }
    
    if (areas.priming_sqft > 0) {
      revenueLines.push(`- Priming: ${areas.priming_sqft} sqft × $${rates.priming_rate.toFixed(2)}/sqft = $${calculation.revenue.priming.toFixed(2)}`);
    }
    if (areas.trim_sqft > 0) {
      revenueLines.push(`- Trim: ${areas.trim_sqft} sqft × $${rates.trim_rate.toFixed(2)}/sqft = $${calculation.revenue.trim.toFixed(2)}`);
      
      if (selectedProducts?.trim) {
        revenueLines.push(`  • Product: ${selectedProducts.trim.supplier} ${selectedProducts.trim.productName} ($${selectedProducts.trim.costPerGallon}/gal)`);
      }
    }
    if (areas.doors_count > 0) {
      revenueLines.push(`- Doors: ${areas.doors_count} doors × $${rates.door_rate.toFixed(2)}/door = $${calculation.revenue.doors.toFixed(2)}`);
    }
    if (areas.windows_count > 0) {
      revenueLines.push(`- Windows: ${areas.windows_count} windows × $${rates.window_rate.toFixed(2)}/window = $${calculation.revenue.windows.toFixed(2)}`);
    }

    return `Here's your quote calculation:

💰 **REVENUE BREAKDOWN**
${revenueLines.join('\n')}
**Total Revenue: $${calculation.revenue.total.toFixed(2)}**

🎨 **MATERIALS**
- Total Materials Cost: $${calculation.materials.total.toFixed(2)}

👷 **LABOR ESTIMATE**
- Projected Labor (${calculation.labor.labor_percentage}%): $${calculation.labor.projected_labor.toFixed(2)}

📊 **FINAL QUOTE**
**Total Quote: $${calculation.revenue.total.toFixed(2)}**
**Projected Profit: $${calculation.profit.toFixed(2)}**

Ready to save this quote? Say "save" to finalize, or "breakdown" to see detailed calculations.`;
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

      {/* Quick Actions Card - Shows after saving */}
      {savedQuoteId && conversationStage === 'complete' && (
        <div className="bg-green-50 border-b border-green-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Save className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-900">Quote Saved Successfully!</p>
                  <p className="text-sm text-green-700">Quote ID: {savedQuoteId}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/quotes/${savedQuoteId}/review`)}
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Review & Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/quotes/${savedQuoteId}/customer`)}
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Customer View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/api/quotes/${savedQuoteId}/pdf`, '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                <MessageContent content={message.content} />
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