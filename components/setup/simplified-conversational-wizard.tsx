"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Send, CheckCircle, Building, Palette } from "lucide-react";

interface SetupData {
  // Company info
  companyName: string;
  address: string;
  phone: string;
  email: string;
  
  // Simplified paint setup
  samePaintForSimilar?: boolean;
  
  // Primary paints
  interiorPaint?: {
    brand: string;
    product: string;
    costPerGallon: number;
  };
  
  exteriorPaint?: {
    brand: string;
    product: string;
    costPerGallon: number;
  };
  
  // Optional specialty paints
  setupSpecialtyNow?: boolean;
  
  primer?: {
    brand: string;
    product: string;
    costPerGallon: number;
  };
  
  trimPaint?: {
    brand: string;
    product: string;
    costPerGallon: number;
  };
}

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  inputType?: 'text' | 'email' | 'phone' | 'number' | 'boolean';
  field?: string;
  suggestions?: string[];
}

interface SimplifiedConversationalWizardProps {
  accessCode: string;
  onComplete: (data: any) => void;
  onSkip: () => void;
  isUpdate?: boolean;
}

export function SimplifiedConversationalWizard({ accessCode, onComplete, onSkip, isUpdate = false }: SimplifiedConversationalWizardProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState<Partial<SetupData>>({});
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const messageIdCounter = useRef(0);

  // Simplified flow - approximately 12-15 questions instead of 40
  const setupFlow = [
    // Company info (4 questions)
    {
      field: 'companyName',
      message: "Hi! I'm here to help set up your painting business profile. Let's keep this quick and easy. What's your company name?",
      inputType: 'text' as const,
      suggestions: []
    },
    {
      field: 'address',
      message: "Great! What's your business address? This will appear on your quotes.",
      inputType: 'text' as const,
      suggestions: []
    },
    {
      field: 'phone',
      message: "What's your business phone number?",
      inputType: 'phone' as const,
      suggestions: []
    },
    {
      field: 'email',
      message: "And your business email address?",
      inputType: 'email' as const,
      suggestions: []
    },
    
    // Smart paint setup starts here
    {
      field: 'samePaintForSimilar',
      message: "Perfect! Now for paint products - let me save you some time. Do you typically use the same paint for walls and ceilings?",
      inputType: 'boolean' as const,
      suggestions: ['Yes, same paint', 'No, different paints']
    },
    
    // Interior paint (3 questions)
    {
      field: 'interiorPaint.brand',
      message: "What's your go-to interior paint brand?",
      inputType: 'text' as const,
      suggestions: ['Sherwin Williams', 'Benjamin Moore', 'Behr', 'PPG', 'Valspar', 'Other']
    },
    {
      field: 'interiorPaint.product',
      message: "Which product line do you typically use?",
      inputType: 'text' as const,
      suggestions: ['ProClassic', 'Duration', 'SuperPaint', 'Cashmere', 'Emerald', 'Other'],
      conditional: (data: Partial<SetupData>) => !!data.interiorPaint?.brand
    },
    {
      field: 'interiorPaint.costPerGallon',
      message: "How much do you pay per gallon? (We'll use standard coverage rates - you can adjust these later)",
      inputType: 'number' as const,
      suggestions: [],
      conditional: (data: Partial<SetupData>) => !!data.interiorPaint?.product
    },
    
    // Exterior paint (3 questions)
    {
      field: 'exteriorPaint.brand',
      message: "Now for exterior - what's your preferred exterior paint brand?",
      inputType: 'text' as const,
      suggestions: ['Sherwin Williams', 'Benjamin Moore', 'Behr', 'PPG', 'Valspar', 'Other']
    },
    {
      field: 'exteriorPaint.product',
      message: "Which exterior product line?",
      inputType: 'text' as const,
      suggestions: ['Duration', 'Resilience', 'SuperPaint', 'Emerald Exterior', 'Aura Exterior', 'Other'],
      conditional: (data: Partial<SetupData>) => !!data.exteriorPaint?.brand
    },
    {
      field: 'exteriorPaint.costPerGallon',
      message: "Cost per gallon for exterior paint?",
      inputType: 'number' as const,
      suggestions: [],
      conditional: (data: Partial<SetupData>) => !!data.exteriorPaint?.product
    },
    
    // Ask about specialty paints
    {
      field: 'setupSpecialtyNow',
      message: "Almost done! Would you like to set up specialty paints now (primer, trim)? You can always add these later.",
      inputType: 'boolean' as const,
      suggestions: ['Yes, set up now', 'No, I\'ll add later']
    },
    
    // Conditional specialty paint questions
    {
      field: 'primer.brand',
      message: "What primer do you typically use?",
      inputType: 'text' as const,
      suggestions: ['Kilz', 'Zinsser', 'Sherwin Williams', 'Benjamin Moore', 'Other'],
      conditional: (data: Partial<SetupData>) => data.setupSpecialtyNow === true
    },
    {
      field: 'primer.costPerGallon',
      message: "Cost per gallon for primer?",
      inputType: 'number' as const,
      suggestions: [],
      conditional: (data: Partial<SetupData>) => data.setupSpecialtyNow === true && !!data.primer?.brand
    },
    {
      field: 'trimPaint.brand',
      message: "Last question! What's your preferred trim paint?",
      inputType: 'text' as const,
      suggestions: ['Same as walls', 'Sherwin Williams ProClassic', 'Benjamin Moore Advance', 'Other'],
      conditional: (data: Partial<SetupData>) => data.setupSpecialtyNow === true
    },
    {
      field: 'trimPaint.costPerGallon',
      message: "Cost per gallon for trim paint?",
      inputType: 'number' as const,
      suggestions: [],
      conditional: (data: Partial<SetupData>) => data.setupSpecialtyNow === true && !!data.trimPaint?.brand && data.trimPaint.brand !== 'Same as walls'
    }
  ];

  // Filter flow based on conditional logic
  const getActiveFlow = () => {
    return setupFlow.filter(step => {
      if (!step.conditional) return true;
      return step.conditional(setupData);
    });
  };

  useEffect(() => {
    // Only add welcome message if no messages exist yet
    if (messages.length === 0) {
      const welcomeMessage = isUpdate 
        ? "Hi! I'm here to help you update your paint products and pricing. This will just take a couple minutes. What's your company name?"
        : setupFlow[0].message;
      
      addBotMessage(welcomeMessage, setupFlow[0].inputType, setupFlow[0].field, setupFlow[0].suggestions);
    }
  }, [isUpdate, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addBotMessage = (content: string, inputType?: Message['inputType'], field?: string, suggestions?: string[]) => {
    messageIdCounter.current += 1;
    const message: Message = {
      id: `bot-${messageIdCounter.current}-${Date.now()}`,
      type: 'bot',
      content,
      timestamp: new Date(),
      inputType,
      field,
      suggestions
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

  const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((acc, key) => {
      if (!acc[key]) acc[key] = {};
      return acc[key];
    }, obj);
    target[lastKey] = value;
  };

  const handleSubmit = async (value?: string) => {
    const inputValue = value || currentInput;
    if (!inputValue.trim()) return;

    const activeFlow = getActiveFlow();
    const currentStepData = activeFlow[currentStep];
    
    let processedValue: any = inputValue;
    if (currentStepData.inputType === 'number') {
      processedValue = parseFloat(inputValue);
    } else if (currentStepData.inputType === 'boolean') {
      processedValue = inputValue.toLowerCase().includes('yes') || inputValue.toLowerCase().includes('same paint');
    }
    
    addUserMessage(inputValue);
    
    // Update setup data
    const newSetupData = { ...setupData };
    setNestedValue(newSetupData, currentStepData.field, processedValue);
    setSetupData(newSetupData);
    setCurrentInput("");

    // Find next valid step
    const nextActiveFlow = setupFlow.filter(step => {
      if (!step.conditional) return true;
      return step.conditional(newSetupData);
    });
    
    const nextStepIndex = nextActiveFlow.findIndex(step => step.field === currentStepData.field) + 1;

    if (nextStepIndex >= nextActiveFlow.length) {
      // We're done!
      setIsComplete(true);
      addBotMessage("Perfect! I have everything I need. Let me save your setup...");
      
      try {
        await processAndSaveSetup(newSetupData);
        addBotMessage("✅ Your setup is complete! You're ready to start creating professional quotes.");
      } catch (error) {
        addBotMessage("❌ There was an error saving your setup. Please try again.");
        setIsComplete(false);
      }
    } else {
      // Move to next step
      const nextStep = nextActiveFlow[nextStepIndex];
      const currentStepIndexInOriginal = setupFlow.findIndex(s => s.field === nextStep.field);
      setCurrentStep(currentStepIndexInOriginal);
      
      setTimeout(() => {
        addBotMessage(nextStep.message, nextStep.inputType, nextStep.field, nextStep.suggestions);
      }, 500);
    }
  };

  const processAndSaveSetup = async (data: Partial<SetupData>) => {
    // Convert simplified data to full format expected by the API
    const fullSetupData: any = {
      companyName: data.companyName,
      address: data.address,
      phone: data.phone,
      email: data.email
    };

    // Set up interior products
    if (data.interiorPaint) {
      fullSetupData.interiorWalls = {
        brand: data.interiorPaint.brand,
        product: data.interiorPaint.product,
        costPerGallon: data.interiorPaint.costPerGallon,
        coverage: 350,
        coverageUnit: 'square feet'
      };
      
      // Use same paint for ceilings if specified
      if (data.samePaintForSimilar) {
        fullSetupData.interiorCeilings = { ...fullSetupData.interiorWalls };
      } else {
        // Use default ceiling paint
        fullSetupData.interiorCeilings = {
          brand: data.interiorPaint.brand,
          product: 'Ceiling Paint',
          costPerGallon: data.interiorPaint.costPerGallon * 0.8, // Slightly cheaper
          coverage: 350,
          coverageUnit: 'square feet'
        };
      }
    }

    // Set up exterior products
    if (data.exteriorPaint) {
      fullSetupData.exteriorWalls = {
        brand: data.exteriorPaint.brand,
        product: data.exteriorPaint.product,
        costPerGallon: data.exteriorPaint.costPerGallon,
        coverage: 300,
        coverageUnit: 'square feet'
      };
      
      // Use same for soffits
      fullSetupData.exteriorSoffits = { ...fullSetupData.exteriorWalls };
    }

    // Set up specialty paints if provided
    if (data.primer?.brand) {
      fullSetupData.primer = {
        brand: data.primer.brand,
        product: data.primer.brand === 'Kilz' ? 'Original' : 'Premium',
        costPerGallon: data.primer.costPerGallon,
        coverage: 350,
        coverageUnit: 'square feet'
      };
    }

    if (data.trimPaint?.brand) {
      if (data.trimPaint.brand === 'Same as walls') {
        fullSetupData.trim = { ...fullSetupData.interiorWalls };
        fullSetupData.doors = { ...fullSetupData.interiorWalls };
        fullSetupData.exteriorTrim = { ...fullSetupData.exteriorWalls };
        fullSetupData.exteriorDoors = { ...fullSetupData.exteriorWalls };
      } else {
        const trimData = {
          brand: data.trimPaint.brand,
          product: 'Trim Paint',
          costPerGallon: data.trimPaint.costPerGallon,
          coverage: 600,
          coverageUnit: 'linear feet'
        };
        fullSetupData.trim = trimData;
        fullSetupData.doors = { ...trimData, coverage: 10, coverageUnit: 'doors' };
        fullSetupData.exteriorTrim = trimData;
        fullSetupData.exteriorDoors = { ...trimData, coverage: 8, coverageUnit: 'doors' };
      }
    }

    // Call the original onComplete with full data
    await onComplete(fullSetupData);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentInput(suggestion);
    // Auto-submit
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

  const activeFlow = getActiveFlow();
  const currentActiveStep = activeFlow.findIndex(step => 
    setupFlow.findIndex(s => s.field === step.field) === currentStep
  );
  const progress = ((currentActiveStep + 1) / activeFlow.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Building className="w-5 h-5 text-blue-600" />
          <h1 className="text-2xl font-bold">
            {isUpdate ? 'Update Products & Pricing' : 'Quick Company Setup'}
          </h1>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Step {currentActiveStep + 1} of {activeFlow.length} (simplified setup)
        </p>
      </div>

      <Card className="mb-4">
        <CardContent className="p-0">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
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
            placeholder="Type your response..."
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
          <h3 className="text-xl font-semibold text-green-700 mb-2">Setup Complete!</h3>
          <p className="text-gray-600">You can update these settings anytime in your dashboard.</p>
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