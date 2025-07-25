'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { gpt4oMiniAssistant } from '@/lib/gpt4o-mini-assistant';
import { calculateProfessionalQuote, ProjectDimensions, DEFAULT_PAINT_PRODUCTS, DEFAULT_CHARGE_RATES } from '@/lib/professional-quote-calculator';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  data?: any; // Any extracted data
}

interface QuoteData {
  customer_name?: string;
  address?: string;
  project_type?: 'interior' | 'exterior' | 'both';
  surfaces?: string[];
  dimensions: {
    wall_linear_feet?: number;
    ceiling_height?: number;
    ceiling_area?: number;
    number_of_doors?: number;
    number_of_windows?: number;
  };
  paint_quality?: Record<string, number>;
  markup_percentage?: number;
}

export default function CreateQuoteAIPage() {
  const router = useRouter();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey! 👋 Ready to knock out a painting quote. What's the customer's name and address?",
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState('customer_info');
  const [quoteData, setQuoteData] = useState<QuoteData>({ dimensions: {} });
  const [currentCategory, setCurrentCategory] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const processMessage = async (userInput: string) => {
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // Get GPT-4o mini to understand and respond
      const result = await gpt4oMiniAssistant.processContractorMessage(userInput, {
        stage,
        category: currentCategory,
        conversationHistory: messages.map(m => ({ 
          role: m.role, 
          content: m.content 
        })),
        currentData: quoteData,
        expectedInfo: getExpectedInfo()
      });

      // Update quote data with any extracted information
      if (result.understanding.extracted) {
        const extracted = result.understanding.extracted;
        const newQuoteData = { ...quoteData };

        // Merge extracted data intelligently
        if (extracted.customer_name) newQuoteData.customer_name = extracted.customer_name;
        if (extracted.address) newQuoteData.address = extracted.address;
        if (extracted.project_type) newQuoteData.project_type = extracted.project_type;
        if (extracted.surfaces) newQuoteData.surfaces = extracted.surfaces;
        if (extracted.wall_linear_feet) {
          newQuoteData.dimensions.wall_linear_feet = extracted.wall_linear_feet;
        }
        if (extracted.ceiling_height) {
          newQuoteData.dimensions.ceiling_height = extracted.ceiling_height;
        }
        if (extracted.ceiling_area) {
          newQuoteData.dimensions.ceiling_area = extracted.ceiling_area;
        }
        if (extracted.doors !== undefined) {
          newQuoteData.dimensions.number_of_doors = extracted.doors;
        }
        if (extracted.windows !== undefined) {
          newQuoteData.dimensions.number_of_windows = extracted.windows;
        }

        setQuoteData(newQuoteData);
      }

      // Update stage based on AI understanding
      updateStage(result.understanding.nextAction);

      // Add AI response
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: result.response,
        timestamp: new Date().toISOString(),
        data: result.understanding.extracted
      };

      setMessages(prev => [...prev, aiMessage]);

      // Check if we have enough data to calculate quote
      checkIfReadyForQuote();

    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Sorry, had a hiccup there. Can you tell me that again? 🤔",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getExpectedInfo = (): string[] => {
    const missing = [];
    
    switch (stage) {
      case 'customer_info':
        if (!quoteData.customer_name) missing.push('customer name');
        if (!quoteData.address) missing.push('address');
        break;
      case 'project_type':
        if (!quoteData.project_type) missing.push('project type (interior/exterior/both)');
        break;
      case 'surface_selection':
        if (!quoteData.surfaces || quoteData.surfaces.length === 0) {
          missing.push('surfaces to paint (walls/ceilings/trim/doors/windows)');
        }
        break;
      case 'measurements':
        if (quoteData.surfaces?.includes('walls')) {
          if (!quoteData.dimensions.wall_linear_feet) missing.push('wall linear feet');
          if (!quoteData.dimensions.ceiling_height) missing.push('ceiling height');
        }
        if (quoteData.surfaces?.includes('ceilings')) {
          if (!quoteData.dimensions.ceiling_area) missing.push('ceiling area');
        }
        if (quoteData.surfaces?.includes('doors')) {
          if (quoteData.dimensions.number_of_doors === undefined) missing.push('number of doors');
        }
        if (quoteData.surfaces?.includes('windows')) {
          if (quoteData.dimensions.number_of_windows === undefined) missing.push('number of windows');
        }
        break;
    }
    
    return missing;
  };

  const updateStage = (nextAction?: string) => {
    // Simple stage progression based on what we have
    if (!quoteData.customer_name || !quoteData.address) {
      setStage('customer_info');
    } else if (!quoteData.project_type) {
      setStage('project_type');
    } else if (!quoteData.surfaces || quoteData.surfaces.length === 0) {
      setStage('surface_selection');
    } else if (getExpectedInfo().length > 0) {
      setStage('measurements');
    } else {
      setStage('ready_for_quote');
    }
  };

  const checkIfReadyForQuote = () => {
    const hasBasicInfo = quoteData.customer_name && quoteData.address && quoteData.project_type;
    const hasSurfaces = quoteData.surfaces && quoteData.surfaces.length > 0;
    const hasMeasurements = getExpectedInfo().filter(info => 
      info.includes('feet') || info.includes('height') || info.includes('area') || 
      info.includes('doors') || info.includes('windows')
    ).length === 0;

    if (hasBasicInfo && hasSurfaces && hasMeasurements) {
      // Calculate quote
      calculateQuote();
    }
  };

  const calculateQuote = () => {
    try {
      const dimensions: ProjectDimensions = {
        wall_linear_feet: quoteData.dimensions.wall_linear_feet || 0,
        ceiling_height: quoteData.dimensions.ceiling_height || 9,
        ceiling_area: quoteData.dimensions.ceiling_area || 0,
        number_of_doors: quoteData.dimensions.number_of_doors || 0,
        number_of_windows: quoteData.dimensions.number_of_windows || 0,
        floor_area: quoteData.dimensions.ceiling_area || 0
      };

      // Build the selected products object in the expected format
      const selectedProducts = {
        primer: DEFAULT_PAINT_PRODUCTS.primer_name as any, // Type assertion for complex union type
        wall_paint: DEFAULT_PAINT_PRODUCTS.wall_paints[1], // Default to mid-range
        ceiling_paint: DEFAULT_PAINT_PRODUCTS.ceiling_paints[1],
        trim_paint: DEFAULT_PAINT_PRODUCTS.trim_paints[1]
      };

      const quote = calculateProfessionalQuote(
        dimensions,
        selectedProducts,
        DEFAULT_CHARGE_RATES,
        20, // Default 20% markup
        false
      );

      const quoteMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Boom! Quote ready 💰\n\nTotal: $${quote.final_price.toLocaleString()}\n\nWant me to save this quote?`,
        timestamp: new Date().toISOString(),
        data: { quote }
      };

      setMessages(prev => [...prev, quoteMessage]);
      setStage('quote_complete');

    } catch (error) {
      console.error('Error calculating quote:', error);
    }
  };

  const handleSend = async () => {
    const message = input.trim();
    if (!message || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Process with AI
    await processMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickSuggestions = {
    customer_info: ["John Smith, 123 Main St", "Sarah Johnson at 456 Oak Ave"],
    project_type: ["Interior only", "Just the outside", "Both in and out"],
    surface_selection: ["Walls and ceilings", "Everything - walls, ceilings, trim", "Just walls"],
    measurements: ["500 by 9", "1200 sqft ceiling", "3 doors, 5 windows"]
  };

  return (
    <div>
      {/* Header */}
      <header>
        <div>
          <div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft />
            </Button>
            <div>
              <h1>AI Quote Assistant</h1>
              <p>Powered by GPT-4o mini</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div>
        <div>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}
              >
                <p>{message.content}</p>
                {message.data && (
                  <p>
                    {JSON.stringify(message.data)}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div>
              <div>
                <div>
                  <div />
                  <div />
                  <div />
                </div>
              </div>
            </div>
          )}

          {/* Quick suggestions */}
          {showSuggestions && quickSuggestions[stage as keyof typeof quickSuggestions] && (
            <div>
              {quickSuggestions[stage as keyof typeof quickSuggestions].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(suggestion);
                    handleSend();
                  }}
                 
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div>
        <div>
          <div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
             
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
             
            >
              {isLoading ? (
                <Loader2 />
              ) : (
                <Send />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}