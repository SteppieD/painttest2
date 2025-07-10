"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Send, CheckCircle, Building, DollarSign, Package, BarChart3 } from "lucide-react";

interface ComprehensiveSetupData {
  // Company info
  companyName: string;
  address: string;
  phone: string;
  email: string;
  
  // Interior Charge Rates (what you charge customers)
  wall_charge_rate: number;
  ceiling_charge_rate: number;
  baseboard_charge_rate: number;
  crown_molding_charge_rate: number;
  door_charge_rate: number;
  window_charge_rate: number;
  
  // Exterior Charge Rates
  exterior_wall_charge_rate: number;
  soffit_charge_rate: number;
  fascia_charge_rate: number;
  exterior_door_charge_rate: number;
  exterior_window_charge_rate: number;
  
  // Business Settings
  overhead_percentage: number;
  default_markup_percentage: number;
  tax_rate: number;
  tax_on_materials_only: boolean;
  
  // Product Tracking - Interior Wall Paint
  interior_wall_paint_brand: string;
  interior_wall_paint_product: string;
  interior_wall_paint_cost: number;
  interior_wall_paint_coverage: number;
  
  // Product Tracking - Interior Ceiling Paint
  interior_ceiling_paint_brand: string;
  interior_ceiling_paint_product: string;
  interior_ceiling_paint_cost: number;
  interior_ceiling_paint_coverage: number;
  
  // Product Tracking - Primer
  primer_brand: string;
  primer_product: string;
  primer_cost: number;
  primer_coverage: number;
  
  // Product Tracking - Trim/Baseboard Paint
  trim_paint_brand: string;
  trim_paint_product: string;
  trim_paint_cost: number;
  trim_paint_coverage: number;
  
  // Product Tracking - Exterior Wall Paint
  exterior_wall_paint_brand: string;
  exterior_wall_paint_product: string;
  exterior_wall_paint_cost: number;
  exterior_wall_paint_coverage: number;
  
  // Product Tracking - Exterior Trim Paint
  exterior_trim_paint_brand: string;
  exterior_trim_paint_product: string;
  exterior_trim_paint_cost: number;
  exterior_trim_paint_coverage: number;
}

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  inputType?: 'text' | 'email' | 'phone' | 'number' | 'boolean';
  field?: string;
  suggestions?: string[];
  section?: string;
}

interface ComprehensiveContractorWizardProps {
  accessCode: string;
  onComplete: (data: any) => void;
  onSkip: () => void;
  isUpdate?: boolean;
}

export function ComprehensiveContractorWizard({ accessCode, onComplete, onSkip, isUpdate = false }: ComprehensiveContractorWizardProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState<Partial<ComprehensiveSetupData>>({});
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const messageIdCounter = useRef(0);

  // Comprehensive setup flow with both charge rates and product tracking
  const setupFlow = [
    // Company info (4 questions)
    {
      field: 'companyName',
      section: 'Company Information',
      message: "Welcome! Let's set up your painting business for success. We'll configure both your customer pricing AND track your actual product costs. What's your company name?",
      inputType: 'text' as const,
      suggestions: []
    },
    {
      field: 'address',
      section: 'Company Information',
      message: "Great! What's your business address?",
      inputType: 'text' as const,
      suggestions: []
    },
    {
      field: 'phone',
      section: 'Company Information',
      message: "What's your business phone number?",
      inputType: 'phone' as const,
      suggestions: []
    },
    {
      field: 'email',
      section: 'Company Information',
      message: "And your business email address?",
      inputType: 'email' as const,
      suggestions: []
    },
    
    // Interior Charge Rates (6 questions)
    {
      field: 'wall_charge_rate',
      section: 'Interior Customer Pricing',
      message: "Now let's set your CUSTOMER PRICING. These rates include both labor and materials. What do you charge per square foot for interior walls?",
      inputType: 'number' as const,
      suggestions: ['$1.25', '$1.50', '$1.75', '$2.00']
    },
    {
      field: 'ceiling_charge_rate',
      section: 'Interior Customer Pricing',
      message: "What do you charge per square foot for ceilings?",
      inputType: 'number' as const,
      suggestions: ['$1.00', '$1.25', '$1.50', '$1.75']
    },
    {
      field: 'baseboard_charge_rate',
      section: 'Interior Customer Pricing',
      message: "What do you charge per linear foot for baseboards?",
      inputType: 'number' as const,
      suggestions: ['$2.00', '$2.50', '$3.00', '$3.50']
    },
    {
      field: 'crown_molding_charge_rate',
      section: 'Interior Customer Pricing',
      message: "What do you charge per linear foot for crown molding?",
      inputType: 'number' as const,
      suggestions: ['$3.00', '$3.50', '$4.00', '$4.50']
    },
    {
      field: 'door_charge_rate',
      section: 'Interior Customer Pricing',
      message: "What do you charge per door (including jamb)?",
      inputType: 'number' as const,
      suggestions: ['$125', '$150', '$175', '$200']
    },
    {
      field: 'window_charge_rate',
      section: 'Interior Customer Pricing',
      message: "What do you charge per window?",
      inputType: 'number' as const,
      suggestions: ['$75', '$100', '$125', '$150']
    },
    
    // Exterior Charge Rates (5 questions)
    {
      field: 'exterior_wall_charge_rate',
      section: 'Exterior Customer Pricing',
      message: "Now for exterior pricing. What do you charge per square foot for exterior walls?",
      inputType: 'number' as const,
      suggestions: ['$1.75', '$2.00', '$2.25', '$2.50']
    },
    {
      field: 'soffit_charge_rate',
      section: 'Exterior Customer Pricing',
      message: "What do you charge per square foot for soffits?",
      inputType: 'number' as const,
      suggestions: ['$1.50', '$1.75', '$2.00', '$2.25']
    },
    {
      field: 'fascia_charge_rate',
      section: 'Exterior Customer Pricing',
      message: "What do you charge per linear foot for fascia boards?",
      inputType: 'number' as const,
      suggestions: ['$3.00', '$3.50', '$4.00', '$4.50']
    },
    {
      field: 'exterior_door_charge_rate',
      section: 'Exterior Customer Pricing',
      message: "What do you charge per exterior door?",
      inputType: 'number' as const,
      suggestions: ['$175', '$200', '$225', '$250']
    },
    {
      field: 'exterior_window_charge_rate',
      section: 'Exterior Customer Pricing',
      message: "What do you charge per exterior window?",
      inputType: 'number' as const,
      suggestions: ['$100', '$125', '$150', '$175']
    },
    
    // Product Tracking - Interior Wall Paint (4 questions)
    {
      field: 'interior_wall_paint_brand',
      section: 'Product Cost Tracking - Interior',
      message: "Great! Now let's track your ACTUAL COSTS. This helps you understand profit margins. What's your preferred interior wall paint brand?",
      inputType: 'text' as const,
      suggestions: ['Sherwin Williams', 'Benjamin Moore', 'Behr', 'PPG', 'Valspar']
    },
    {
      field: 'interior_wall_paint_product',
      section: 'Product Cost Tracking - Interior',
      message: "Which specific product do you use most?",
      inputType: 'text' as const,
      suggestions: ['ProClassic', 'Duration', 'SuperPaint', 'Cashmere', 'Emerald']
    },
    {
      field: 'interior_wall_paint_cost',
      section: 'Product Cost Tracking - Interior',
      message: "What do YOU pay per gallon for this paint? (your contractor price)",
      inputType: 'number' as const,
      suggestions: ['$25', '$35', '$45', '$55', '$65']
    },
    {
      field: 'interior_wall_paint_coverage',
      section: 'Product Cost Tracking - Interior',
      message: "How many square feet per gallon coverage do you get?",
      inputType: 'number' as const,
      suggestions: ['300', '350', '400', '450']
    },
    
    // Product Tracking - Interior Ceiling Paint (4 questions)
    {
      field: 'interior_ceiling_paint_brand',
      section: 'Product Cost Tracking - Interior',
      message: "What ceiling paint brand do you prefer?",
      inputType: 'text' as const,
      suggestions: ['Same as walls', 'Benjamin Moore', 'Sherwin Williams', 'PPG']
    },
    {
      field: 'interior_ceiling_paint_product',
      section: 'Product Cost Tracking - Interior',
      message: "Which ceiling paint product?",
      inputType: 'text' as const,
      suggestions: ['Ceiling Paint', 'Waterborne Ceiling', 'ProMar Ceiling', 'Eminence']
    },
    {
      field: 'interior_ceiling_paint_cost',
      section: 'Product Cost Tracking - Interior',
      message: "Your cost per gallon for ceiling paint?",
      inputType: 'number' as const,
      suggestions: ['$20', '$25', '$30', '$35', '$40']
    },
    {
      field: 'interior_ceiling_paint_coverage',
      section: 'Product Cost Tracking - Interior',
      message: "Coverage per gallon?",
      inputType: 'number' as const,
      suggestions: ['350', '400', '450', '500']
    },
    
    // Product Tracking - Primer (4 questions)
    {
      field: 'primer_brand',
      section: 'Product Cost Tracking - Primer',
      message: "What primer do you typically use?",
      inputType: 'text' as const,
      suggestions: ['Kilz', 'Zinsser', 'Sherwin Williams', 'Benjamin Moore']
    },
    {
      field: 'primer_product',
      section: 'Product Cost Tracking - Primer',
      message: "Which primer product?",
      inputType: 'text' as const,
      suggestions: ['Premium', 'Original', 'BIN', 'Bulls Eye 123', 'ProBlock']
    },
    {
      field: 'primer_cost',
      section: 'Product Cost Tracking - Primer',
      message: "Your cost per gallon for primer?",
      inputType: 'number' as const,
      suggestions: ['$15', '$20', '$25', '$30', '$35']
    },
    {
      field: 'primer_coverage',
      section: 'Product Cost Tracking - Primer',
      message: "Primer coverage per gallon?",
      inputType: 'number' as const,
      suggestions: ['300', '350', '400', '450']
    },
    
    // Product Tracking - Trim Paint (4 questions)
    {
      field: 'trim_paint_brand',
      section: 'Product Cost Tracking - Trim',
      message: "What's your go-to trim paint brand?",
      inputType: 'text' as const,
      suggestions: ['Sherwin Williams', 'Benjamin Moore', 'Same as walls']
    },
    {
      field: 'trim_paint_product',
      section: 'Product Cost Tracking - Trim',
      message: "Which trim paint product?",
      inputType: 'text' as const,
      suggestions: ['ProClassic', 'Advance', 'Emerald Urethane', 'Cabinet Coat']
    },
    {
      field: 'trim_paint_cost',
      section: 'Product Cost Tracking - Trim',
      message: "Your cost per gallon for trim paint?",
      inputType: 'number' as const,
      suggestions: ['$40', '$50', '$60', '$70', '$80']
    },
    {
      field: 'trim_paint_coverage',
      section: 'Product Cost Tracking - Trim',
      message: "Coverage per gallon for trim?",
      inputType: 'number' as const,
      suggestions: ['350', '400', '450', '500']
    },
    
    // Product Tracking - Exterior Paint (4 questions)
    {
      field: 'exterior_wall_paint_brand',
      section: 'Product Cost Tracking - Exterior',
      message: "Almost done! What's your preferred exterior paint brand?",
      inputType: 'text' as const,
      suggestions: ['Sherwin Williams', 'Benjamin Moore', 'Behr', 'PPG']
    },
    {
      field: 'exterior_wall_paint_product',
      section: 'Product Cost Tracking - Exterior',
      message: "Which exterior product?",
      inputType: 'text' as const,
      suggestions: ['Duration', 'Resilience', 'SuperPaint', 'Aura Exterior', 'Emerald']
    },
    {
      field: 'exterior_wall_paint_cost',
      section: 'Product Cost Tracking - Exterior',
      message: "Your cost per gallon for exterior paint?",
      inputType: 'number' as const,
      suggestions: ['$35', '$45', '$55', '$65', '$75']
    },
    {
      field: 'exterior_wall_paint_coverage',
      section: 'Product Cost Tracking - Exterior',
      message: "Exterior paint coverage per gallon?",
      inputType: 'number' as const,
      suggestions: ['250', '300', '350', '400']
    },
    
    // Business Settings (4 questions)
    {
      field: 'overhead_percentage',
      section: 'Business Settings',
      message: "Last section! What's your overhead percentage? (covers insurance, vehicles, equipment, etc.)",
      inputType: 'number' as const,
      suggestions: ['10%', '15%', '20%', '25%']
    },
    {
      field: 'default_markup_percentage',
      section: 'Business Settings',
      message: "What profit margin percentage do you target?",
      inputType: 'number' as const,
      suggestions: ['20%', '30%', '40%', '50%']
    },
    {
      field: 'tax_rate',
      section: 'Business Settings',
      message: "What's your local tax rate? (Enter 0 if no tax)",
      inputType: 'number' as const,
      suggestions: ['0%', '6%', '7%', '8%', '8.5%']
    },
    {
      field: 'tax_on_materials_only',
      section: 'Business Settings',
      message: "Should tax be calculated on materials only, or on the total price?",
      inputType: 'boolean' as const,
      suggestions: ['Materials only', 'Total price']
    }
  ];

  useEffect(() => {
    if (messages.length === 0) {
      addBotMessage(setupFlow[0].message, setupFlow[0].inputType, setupFlow[0].field, setupFlow[0].suggestions, setupFlow[0].section);
    }
  }, [messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addBotMessage = (content: string, inputType?: Message['inputType'], field?: string, suggestions?: string[], section?: string) => {
    messageIdCounter.current += 1;
    const message: Message = {
      id: `bot-${messageIdCounter.current}-${Date.now()}`,
      type: 'bot',
      content,
      timestamp: new Date(),
      inputType,
      field,
      suggestions,
      section
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (content: string) => {
    messageIdCounter.current += 1;
    const message: Message = {
      id: `user-${messageIdCounter.current}-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const handleSubmit = async (value?: string) => {
    const inputValue = value || currentInput;
    if (!inputValue.trim()) return;

    const currentStepData = setupFlow[currentStep];
    
    let processedValue: any = inputValue;
    
    // Process different input types
    if (currentStepData.inputType === 'number') {
      // Remove $ and % symbols and parse
      processedValue = parseFloat(inputValue.replace(/[$%]/g, ''));
    } else if (currentStepData.inputType === 'boolean') {
      processedValue = inputValue.toLowerCase().includes('materials');
    }
    
    // Handle "Same as walls" option
    if (inputValue === 'Same as walls' && currentStepData.field?.includes('ceiling')) {
      processedValue = setupData.interior_wall_paint_brand;
    }
    
    addUserMessage(inputValue);
    
    // Update setup data
    const newSetupData = { ...setupData };
    newSetupData[currentStepData.field as keyof ComprehensiveSetupData] = processedValue;
    setSetupData(newSetupData);
    setCurrentInput("");

    if (currentStep >= setupFlow.length - 1) {
      // We're done!
      setIsComplete(true);
      addBotMessage("Perfect! I have all your information. Let me save your comprehensive setup...");
      
      try {
        await processAndSaveSetup(newSetupData);
        addBotMessage("✅ Setup complete! Your customer pricing AND product costs are saved. The system will track your profit margins automatically!");
      } catch (error) {
        addBotMessage("❌ There was an error saving your setup. Please try again.");
        setIsComplete(false);
      }
    } else {
      // Move to next step
      setCurrentStep(currentStep + 1);
      const nextStep = setupFlow[currentStep + 1];
      
      // Add section header if entering new section
      const currentSection = currentStepData.section;
      const nextSection = nextStep.section;
      if (currentSection !== nextSection) {
        setTimeout(() => {
          if (nextSection?.includes('Product Cost')) {
            addBotMessage(`📦 ${nextSection} - Let's track what YOU pay for materials`);
          } else if (nextSection?.includes('Customer Pricing')) {
            addBotMessage(`💰 ${nextSection} - What you charge customers`);
          } else {
            addBotMessage(`📋 ${nextSection}`);
          }
        }, 300);
      }
      
      setTimeout(() => {
        addBotMessage(nextStep.message, nextStep.inputType, nextStep.field, nextStep.suggestions, nextStep.section);
      }, currentSection !== nextSection ? 800 : 500);
    }
  };

  const processAndSaveSetup = async (data: Partial<ComprehensiveSetupData>) => {
    // Call the onComplete handler with the comprehensive data
    await onComplete(data);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentInput(suggestion);
    setTimeout(() => {
      handleSubmit(suggestion);
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const progress = ((currentStep + 1) / setupFlow.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h1 className="text-2xl font-bold">
            {isUpdate ? 'Update Business Settings' : 'Complete Business Setup'}
          </h1>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Configure customer pricing AND track your actual costs for better business insights
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Step {currentStep + 1} of {setupFlow.length}
        </p>
      </div>

      <Card className="mb-4">
        <CardContent className="p-0">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                {message.section && message.type === 'bot' && (message.content.startsWith('📋') || message.content.startsWith('💰') || message.content.startsWith('📦')) && (
                  <div className="flex items-center gap-2 my-4">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="text-sm font-medium text-gray-500 px-2">
                      {message.section.replace(' - What you charge customers', '').replace(' - Let\'s track what YOU pay for materials', '')}
                    </span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>
                )}
                <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Suggestions */}
            {!isComplete && messages.length > 0 && messages[messages.length - 1].type === 'bot' && messages[messages.length - 1].suggestions && messages[messages.length - 1].suggestions!.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {!isComplete && (
        <div className="flex gap-2">
          <Input
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              messages.length > 0 && messages[messages.length - 1].inputType === 'number' 
                ? "Enter amount..." 
                : "Type your response..."
            }
            type={messages.length > 0 ? messages[messages.length - 1].inputType || 'text' : 'text'}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={() => handleSubmit()} 
            disabled={!currentInput.trim() || isLoading}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}

      {isComplete && (
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-700 mb-2">Complete Business Setup!</h3>
          <p className="text-gray-600 mb-2">Your pricing AND product costs are configured.</p>
          <p className="text-sm text-gray-500">The system will automatically track your profit margins on every quote!</p>
        </div>
      )}

      <div className="mt-4 text-center">
        <Button variant="ghost" onClick={onSkip} className="text-gray-500">
          {isUpdate ? 'Cancel update' : 'Skip setup for now'}
        </Button>
      </div>
    </div>
  );
}