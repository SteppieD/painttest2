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
  companyName: string;
  address: string;
  phone: string;
  email: string;
  primer: {
    brand: string;
    product: string;
    costPerGallon: number;
    coverage: number;
    coverageUnit: string;
  };
  interiorWalls: {
    brand: string;
    product: string;
    costPerGallon: number;
    coverage: number;
    coverageUnit: string;
  };
  interiorCeilings: {
    brand: string;
    product: string;
    costPerGallon: number;
    coverage: number;
    coverageUnit: string;
  };
  trim: {
    brand: string;
    product: string;
    costPerGallon: number;
    coverage: number;
    coverageUnit: string;
  };
  doors: {
    brand: string;
    product: string;
    costPerGallon: number;
    coverage: number;
    coverageUnit: string;
  };
  exteriorWalls: {
    brand: string;
    product: string;
    costPerGallon: number;
    coverage: number;
    coverageUnit: string;
  };
  exteriorSoffits: {
    brand: string;
    product: string;
    costPerGallon: number;
    coverage: number;
    coverageUnit: string;
  };
  exteriorTrim: {
    brand: string;
    product: string;
    costPerGallon: number;
    coverage: number;
    coverageUnit: string;
  };
  exteriorDoors: {
    brand: string;
    product: string;
    costPerGallon: number;
    coverage: number;
    coverageUnit: string;
  };
}

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  inputType?: 'text' | 'email' | 'phone' | 'number';
  field?: keyof SetupData | string;
  suggestions?: string[];
}

interface ConversationalSetupWizardProps {
  accessCode: string;
  onComplete: (data: SetupData) => void;
  onSkip: () => void;
  isUpdate?: boolean;
}

export function ConversationalSetupWizard({ accessCode, onComplete, onSkip, isUpdate = false }: ConversationalSetupWizardProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState<Partial<SetupData>>({});
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const messageIdCounter = useRef(0);

  const setupFlow = [
    {
      field: 'companyName',
      message: "Hi! I'm here to help set up your painting business profile. Let's start with the basics. What's your company name?",
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
    {
      field: 'primer.brand',
      message: "Perfect! Now let's set up your paint products. First, let's start with primer - what brand do you typically use?",
      inputType: 'text' as const,
      suggestions: ['Kilz', 'Zinsser', 'Sherwin Williams', 'Benjamin Moore', 'Behr', 'Other']
    },
    {
      field: 'primer.product',
      message: "What specific primer product line do you use?",
      inputType: 'text' as const,
      suggestions: ['Original', 'Premium', 'Adhesion', 'ProBlock', 'Cover Stain', 'Other']
    },
    {
      field: 'primer.costPerGallon',
      message: "How much do you pay per gallon for this primer?",
      inputType: 'number' as const,
      suggestions: []
    },
    {
      field: 'primer.coverage',
      message: "How many square feet does one gallon of primer cover? (typical range: 300-400 sq ft)",
      inputType: 'number' as const,
      suggestions: []
    },
    {
      field: 'interiorWalls.brand',
      message: "Great! Now for interior walls, what paint brand do you typically use?",
      inputType: 'text' as const,
      suggestions: ['Sherwin Williams', 'Benjamin Moore', 'Behr', 'PPG', 'Valspar', 'Glidden', 'Other']
    },
    {
      field: 'interiorWalls.product',
      message: "What specific product line do you use for interior walls?",
      inputType: 'text' as const,
      suggestions: ['ProClassic', 'Advance', 'SuperPaint', 'Cashmere', 'Duration', 'Emerald', 'Other']
    },
    {
      field: 'interiorWalls.costPerGallon',
      message: "How much do you pay per gallon for this interior wall paint?",
      inputType: 'number' as const,
      suggestions: []
    },
    {
      field: 'interiorWalls.coverage',
      message: "How many square feet does one gallon cover? (typical range: 300-400 sq ft)",
      inputType: 'number' as const,
      suggestions: []
    },
    {
      field: 'interiorCeilings.brand',
      message: "Now for interior ceilings - what brand do you use?",
      inputType: 'text' as const,
      suggestions: ['Sherwin Williams', 'Benjamin Moore', 'Behr', 'PPG', 'Valspar', 'Other']
    },
    {
      field: 'interiorCeilings.product',
      message: "What product line for interior ceilings?",
      inputType: 'text' as const,
      suggestions: ['Flat White', 'Ceiling Paint', 'Enamel Undercoat', 'Primer Sealer', 'Other']
    },
    {
      field: 'interiorCeilings.costPerGallon',
      message: "Cost per gallon for interior ceiling paint?",
      inputType: 'number' as const,
      suggestions: []
    },
    {
      field: 'interiorCeilings.coverage',
      message: "Square feet coverage per gallon for ceiling paint?",
      inputType: 'number' as const,
      suggestions: []
    },
    {
      field: 'trim.brand',
      message: "For trim work, what paint brand do you prefer?",
      inputType: 'text' as const,
      suggestions: ['Sherwin Williams', 'Benjamin Moore', 'Behr', 'PPG', 'Other']
    },
    {
      field: 'trim.product',
      message: "Which trim paint product?",
      inputType: 'text' as const,
      suggestions: ['ProClassic', 'Advance', 'All Surface Enamel', 'Trim Paint', 'Other']
    },
    {
      field: 'trim.costPerGallon',
      message: "Cost per gallon for trim paint?",
      inputType: 'number' as const,
      suggestions: []
    },
    {
      field: 'trim.coverage',
      message: "How many linear feet of trim can you paint with one gallon? (typical: 600-800 linear feet)",
      inputType: 'number' as const,
      suggestions: []
    },
    {
      field: 'doors.brand',
      message: "For doors, what paint brand do you use?",
      inputType: 'text' as const,
      suggestions: ['Sherwin Williams', 'Benjamin Moore', 'Behr', 'PPG', 'Other']
    },
    {
      field: 'doors.product',
      message: "Which door paint product?",
      inputType: 'text' as const,
      suggestions: ['ProClassic', 'Advance', 'Door & Trim', 'Enamel', 'Other']
    },
    {
      field: 'doors.costPerGallon',
      message: "Cost per gallon for door paint?",
      inputType: 'number' as const,
      suggestions: []
    },
    {
      field: 'doors.coverage',
      message: "How many doors can you paint with one gallon? (typical: 8-12 doors)",
      inputType: 'number' as const,
      suggestions: []
    },
    // Exterior products
    {
      field: 'exteriorWalls.brand',
      message: "Now for exterior work - what brand do you use for exterior walls?",
      inputType: 'text' as const,
      suggestions: ['Sherwin Williams', 'Benjamin Moore', 'Behr', 'PPG', 'Valspar', 'Other']
    },
    {
      field: 'exteriorWalls.product',
      message: "Which exterior wall paint product?",
      inputType: 'text' as const,
      suggestions: ['Duration', 'Resilience', 'SuperPaint', 'Emerald Exterior', 'Aura Exterior', 'Other']
    },
    {
      field: 'exteriorWalls.costPerGallon',
      message: "Cost per gallon for exterior wall paint?",
      inputType: 'number' as const,
      suggestions: []
    },
    {
      field: 'exteriorWalls.coverage',
      message: "Square feet coverage per gallon for exterior walls?",
      inputType: 'number' as const,
      suggestions: []
    },
    {
      field: 'exteriorSoffits.brand',
      message: "For exterior soffits (the underside of roof overhangs), what brand do you use?",
      inputType: 'text' as const,
      suggestions: ['Sherwin Williams', 'Benjamin Moore', 'Behr', 'PPG', 'Other']
    },
    {
      field: 'exteriorSoffits.product',
      message: "Which soffit paint product?",
      inputType: 'text' as const,
      suggestions: ['Duration', 'Exterior Acrylic', 'House Paint', 'Soffit Paint', 'Other']
    },
    {
      field: 'exteriorSoffits.costPerGallon',
      message: "Cost per gallon for soffit paint?",
      inputType: 'number' as const,
      suggestions: []
    },
    {
      field: 'exteriorSoffits.coverage',
      message: "Square feet coverage per gallon for soffits?",
      inputType: 'number' as const,
      suggestions: []
    },
    {
      field: 'exteriorTrim.brand',
      message: "For exterior trim, what brand?",
      inputType: 'text' as const,
      suggestions: ['Sherwin Williams', 'Benjamin Moore', 'Behr', 'PPG', 'Other']
    },
    {
      field: 'exteriorTrim.product',
      message: "Exterior trim paint product?",
      inputType: 'text' as const,
      suggestions: ['Duration', 'All Surface Enamel', 'Exterior Trim Paint', 'Other']
    },
    {
      field: 'exteriorTrim.costPerGallon',
      message: "Cost per gallon for exterior trim paint?",
      inputType: 'number' as const,
      suggestions: []
    },
    {
      field: 'exteriorTrim.coverage',
      message: "Linear feet coverage per gallon for exterior trim?",
      inputType: 'number' as const,
      suggestions: []
    },
    {
      field: 'exteriorDoors.brand',
      message: "Finally, for exterior doors, what brand?",
      inputType: 'text' as const,
      suggestions: ['Sherwin Williams', 'Benjamin Moore', 'Behr', 'PPG', 'Other']
    },
    {
      field: 'exteriorDoors.product',
      message: "Exterior door paint product?",
      inputType: 'text' as const,
      suggestions: ['Duration', 'Door & Trim', 'Exterior Enamel', 'Other']
    },
    {
      field: 'exteriorDoors.costPerGallon',
      message: "Cost per gallon for exterior door paint?",
      inputType: 'number' as const,
      suggestions: []
    },
    {
      field: 'exteriorDoors.coverage',
      message: "How many exterior doors can you paint with one gallon?",
      inputType: 'number' as const,
      suggestions: []
    }
  ];

  useEffect(() => {
    // Only add welcome message if no messages exist yet
    if (messages.length === 0) {
      const welcomeMessage = isUpdate 
        ? "Hi! I'm here to help you update your paint products and pricing. Let's make sure your quote calculations are using the latest costs. What's your company name?"
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

  const addBotMessage = (content: string, inputType?: 'text' | 'email' | 'phone' | 'number', field?: string, suggestions?: string[]) => {
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

  const handleSubmit = async () => {
    if (!currentInput.trim()) return;

    const currentStepData = setupFlow[currentStep];
    const value = currentStepData.inputType === 'number' ? parseFloat(currentInput) : currentInput;
    
    addUserMessage(currentInput);
    
    // Update setup data
    const newSetupData = { ...setupData };
    setNestedValue(newSetupData, currentStepData.field, value);
    
    // Add coverage unit for coverage fields
    if (currentStepData.field.includes('coverage')) {
      const unitField = currentStepData.field.replace('coverage', 'coverageUnit');
      if (currentStepData.field.includes('trim')) {
        setNestedValue(newSetupData, unitField, 'linear feet');
      } else if (currentStepData.field.includes('doors')) {
        setNestedValue(newSetupData, unitField, 'doors');
      } else {
        setNestedValue(newSetupData, unitField, 'square feet');
      }
    }
    
    setSetupData(newSetupData);
    setCurrentInput("");

    // Check if we're done
    if (currentStep >= setupFlow.length - 1) {
      setIsComplete(true);
      addBotMessage("Perfect! I have all the information I need. Let me save your setup...");
      
      try {
        await onComplete(newSetupData as SetupData);
        addBotMessage("✅ Your setup is complete! You're ready to start creating professional quotes.");
      } catch (error) {
        addBotMessage("❌ There was an error saving your setup. Please try again.");
        setIsComplete(false);
      }
    } else {
      // Move to next step
      setCurrentStep(currentStep + 1);
      setTimeout(() => {
        const nextStep = setupFlow[currentStep + 1];
        addBotMessage(nextStep.message, nextStep.inputType, nextStep.field, nextStep.suggestions);
      }, 500);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentInput(suggestion);
    
    // Auto-submit when clicking suggestions
    setTimeout(() => {
      const currentStepData = setupFlow[currentStep];
      const value = currentStepData.inputType === 'number' ? parseFloat(suggestion) : suggestion;
      
      addUserMessage(suggestion);
      
      // Update setup data
      const newSetupData = { ...setupData };
      setNestedValue(newSetupData, currentStepData.field, value);
      
      // Add coverage unit for coverage fields
      if (currentStepData.field.includes('coverage')) {
        const unitField = currentStepData.field.replace('coverage', 'coverageUnit');
        if (currentStepData.field.includes('trim')) {
          setNestedValue(newSetupData, unitField, 'linear feet');
        } else if (currentStepData.field.includes('doors')) {
          setNestedValue(newSetupData, unitField, 'doors');
        } else {
          setNestedValue(newSetupData, unitField, 'square feet');
        }
      }
      
      setSetupData(newSetupData);
      setCurrentInput("");

      // Check if we're done
      if (currentStep >= setupFlow.length - 1) {
        setIsComplete(true);
        addBotMessage("Perfect! I have all the information I need. Let me save your setup...");
        
        try {
          onComplete(newSetupData as SetupData);
          addBotMessage("✅ Your setup is complete! You're ready to start creating professional quotes.");
        } catch (error) {
          addBotMessage("❌ There was an error saving your setup. Please try again.");
          setIsComplete(false);
        }
      } else {
        // Move to next step
        setCurrentStep(currentStep + 1);
        setTimeout(() => {
          const nextStep = setupFlow[currentStep + 1];
          addBotMessage(nextStep.message, nextStep.inputType, nextStep.field, nextStep.suggestions);
        }, 500);
      }
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
          <Building className="w-5 h-5 text-blue-600" />
          <h1 className="text-2xl font-bold">
            {isUpdate ? 'Update Products & Pricing' : 'Company Setup'}
          </h1>
        </div>
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
            onClick={handleSubmit} 
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