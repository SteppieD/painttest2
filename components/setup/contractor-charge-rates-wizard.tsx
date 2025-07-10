"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Send, CheckCircle, Building, DollarSign, Home, Briefcase } from "lucide-react";

interface ChargeRatesData {
  // Company info
  companyName: string;
  address: string;
  phone: string;
  email: string;
  
  // Interior Charge Rates (includes labor + materials)
  wall_charge_rate: number;         // Per sqft
  ceiling_charge_rate: number;      // Per sqft
  baseboard_charge_rate: number;    // Per linear foot
  crown_molding_charge_rate: number; // Per linear foot
  door_charge_rate: number;         // Per unit (includes jamb)
  window_charge_rate: number;       // Per unit
  
  // Exterior Charge Rates
  exterior_wall_charge_rate: number;    // Per sqft
  soffit_charge_rate: number;           // Per sqft
  fascia_charge_rate: number;           // Per linear foot
  exterior_door_charge_rate: number;    // Per unit
  exterior_window_charge_rate: number;  // Per unit
  
  // Business Settings
  overhead_percentage: number;      // Overhead %
  default_markup_percentage: number; // Profit margin %
  tax_rate: number;                // Tax rate
  tax_on_materials_only: boolean;  // Tax calculation method
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

interface ContractorChargeRatesWizardProps {
  accessCode: string;
  onComplete: (data: any) => void;
  onSkip: () => void;
  isUpdate?: boolean;
}

export function ContractorChargeRatesWizard({ accessCode, onComplete, onSkip, isUpdate = false }: ContractorChargeRatesWizardProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState<Partial<ChargeRatesData>>({});
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const messageIdCounter = useRef(0);

  // Comprehensive charge rate setup flow
  const setupFlow = [
    // Company info (4 questions)
    {
      field: 'companyName',
      section: 'Company Information',
      message: "Welcome! Let's set up your painting business with the new charge rate system. This includes both labor and materials in one simple rate. What's your company name?",
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
      section: 'Interior Charge Rates',
      message: "Now for your interior charge rates. These rates include both labor and materials (labor is automatically calculated as 30% of the total). What's your charge rate per square foot for interior walls?",
      inputType: 'number' as const,
      suggestions: ['$1.25', '$1.50', '$1.75', '$2.00']
    },
    {
      field: 'ceiling_charge_rate',
      section: 'Interior Charge Rates',
      message: "What's your charge rate per square foot for ceilings?",
      inputType: 'number' as const,
      suggestions: ['$1.00', '$1.25', '$1.50', '$1.75']
    },
    {
      field: 'baseboard_charge_rate',
      section: 'Interior Charge Rates',
      message: "What's your charge rate per linear foot for baseboards?",
      inputType: 'number' as const,
      suggestions: ['$2.00', '$2.50', '$3.00', '$3.50']
    },
    {
      field: 'crown_molding_charge_rate',
      section: 'Interior Charge Rates',
      message: "What's your charge rate per linear foot for crown molding?",
      inputType: 'number' as const,
      suggestions: ['$3.00', '$3.50', '$4.00', '$4.50']
    },
    {
      field: 'door_charge_rate',
      section: 'Interior Charge Rates',
      message: "What's your charge rate per door (including jamb)?",
      inputType: 'number' as const,
      suggestions: ['$125', '$150', '$175', '$200']
    },
    {
      field: 'window_charge_rate',
      section: 'Interior Charge Rates',
      message: "What's your charge rate per window?",
      inputType: 'number' as const,
      suggestions: ['$75', '$100', '$125', '$150']
    },
    
    // Exterior Charge Rates (5 questions)
    {
      field: 'exterior_wall_charge_rate',
      section: 'Exterior Charge Rates',
      message: "Now for exterior rates. What's your charge rate per square foot for exterior walls?",
      inputType: 'number' as const,
      suggestions: ['$1.75', '$2.00', '$2.25', '$2.50']
    },
    {
      field: 'soffit_charge_rate',
      section: 'Exterior Charge Rates',
      message: "What's your charge rate per square foot for soffits?",
      inputType: 'number' as const,
      suggestions: ['$1.50', '$1.75', '$2.00', '$2.25']
    },
    {
      field: 'fascia_charge_rate',
      section: 'Exterior Charge Rates',
      message: "What's your charge rate per linear foot for fascia boards?",
      inputType: 'number' as const,
      suggestions: ['$3.00', '$3.50', '$4.00', '$4.50']
    },
    {
      field: 'exterior_door_charge_rate',
      section: 'Exterior Charge Rates',
      message: "What's your charge rate per exterior door?",
      inputType: 'number' as const,
      suggestions: ['$175', '$200', '$225', '$250']
    },
    {
      field: 'exterior_window_charge_rate',
      section: 'Exterior Charge Rates',
      message: "What's your charge rate per exterior window?",
      inputType: 'number' as const,
      suggestions: ['$100', '$125', '$150', '$175']
    },
    
    // Business Settings (4 questions)
    {
      field: 'overhead_percentage',
      section: 'Business Settings',
      message: "Almost done! What's your overhead percentage? (This covers business expenses like insurance, vehicles, etc.)",
      inputType: 'number' as const,
      suggestions: ['10%', '15%', '20%', '25%']
    },
    {
      field: 'default_markup_percentage',
      section: 'Business Settings',
      message: "What profit margin percentage do you want to add?",
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
    
    addUserMessage(inputValue);
    
    // Update setup data
    const newSetupData = { ...setupData };
    newSetupData[currentStepData.field as keyof ChargeRatesData] = processedValue;
    setSetupData(newSetupData);
    setCurrentInput("");

    if (currentStep >= setupFlow.length - 1) {
      // We're done!
      setIsComplete(true);
      addBotMessage("Perfect! I have all your charge rates. Let me save your setup...");
      
      try {
        await processAndSaveSetup(newSetupData);
        addBotMessage("✅ Your charge rates are saved! Remember, labor is automatically calculated as 30% of each charge rate. You're ready to create professional quotes!");
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
          addBotMessage(`📋 ${nextSection}`);
        }, 300);
      }
      
      setTimeout(() => {
        addBotMessage(nextStep.message, nextStep.inputType, nextStep.field, nextStep.suggestions, nextStep.section);
      }, currentSection !== nextSection ? 800 : 500);
    }
  };

  const processAndSaveSetup = async (data: Partial<ChargeRatesData>) => {
    // Call the onComplete handler with the charge rates data
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
          <DollarSign className="w-5 h-5 text-green-600" />
          <h1 className="text-2xl font-bold">
            {isUpdate ? 'Update Charge Rates' : 'Contractor Charge Rate Setup'}
          </h1>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300" 
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
                {message.section && message.type === 'bot' && message.content.startsWith('📋') && (
                  <div className="flex items-center gap-2 my-4">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="text-sm font-medium text-gray-500 px-2">{message.section}</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </div>
                )}
                <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-green-600 text-white'
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
          <h3 className="text-xl font-semibold text-green-700 mb-2">Charge Rates Setup Complete!</h3>
          <p className="text-gray-600 mb-2">Your rates include both labor and materials.</p>
          <p className="text-sm text-gray-500">Labor is automatically calculated as 30% of each charge rate.</p>
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