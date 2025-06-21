"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Send, Calculator, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// Helper function to render markdown text
const renderMarkdown = (text: string) => {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};
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
  parseRoomCount,
  parseRoomData,
  generateRoomSummary,
  generateRoomSummaryWithButtons,
  generateFollowUpQuestion,
  generateQuoteDisplay,
  generateQuoteDisplayWithButtons,
  ConversationData
} from "@/lib/improved-conversation-parser";
import { Room, calculateRoomAreas, calculateTotalAreasFromRooms } from "@/lib/professional-quote-calculator";
import { PaintBrandSelector } from "@/components/ui/paint-brand-selector";
import { PaintProductSelector } from "@/components/ui/paint-product-selector";
import { FavoritePaintSelector } from "@/components/ui/favorite-paint-selector";
import { initializeQuoteCreation, trackLoadingPerformance, type CompanyInitialData } from "@/lib/batch-loader";
import { calculateProgressiveEstimate, generateEstimateMessage, type ProgressiveEstimate } from "@/lib/progressive-calculator";
import { ProgressiveEstimateDisplay, FloatingEstimateWidget } from "@/components/ui/progressive-estimate-display";

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

function CreateQuotePageContent() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const editQuoteId = searchParams.get('edit');

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
  const [isThinking, setIsThinking] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [buttonOptions, setButtonOptions] = useState<{id: string, label: string, value: any, selected?: boolean}[]>([]);
  const [selectedSurfaces, setSelectedSurfaces] = useState<string[]>([]);
  
  // Room-by-room tracking
  const [useRoomByRoom, setUseRoomByRoom] = useState(false);
  const [roomCount, setRoomCount] = useState(0);
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoomData, setCurrentRoomData] = useState<Partial<Room>>({});
  const [editingRoomIndex, setEditingRoomIndex] = useState(-1);

  // Paint selection tracking
  const [availableBrands, setAvailableBrands] = useState<any[]>([]);
  const [topBrands, setTopBrands] = useState<any[]>([]);
  const [otherBrands, setOtherBrands] = useState<any[]>([]);
  const [currentPaintCategory, setCurrentPaintCategory] = useState<string>('');
  const [selectedPaintProducts, setSelectedPaintProducts] = useState<{[category: string]: any}>({});
  const [paintSelectionQueue, setPaintSelectionQueue] = useState<string[]>([]);
  const [currentPaintCategoryIndex, setCurrentPaintCategoryIndex] = useState(0);

  // New measurement-driven workflow state
  const [measurementQueue, setMeasurementQueue] = useState<string[]>([]);
  const [currentMeasurementCategory, setCurrentMeasurementCategory] = useState<string>('');
  const [categoryCompletionStatus, setCategoryCompletionStatus] = useState<{[category: string]: {measured: boolean, paintSelected: boolean}}>({});
  const [showPaintBrandSelector, setShowPaintBrandSelector] = useState(false);
  const [showPaintProductSelector, setShowPaintProductSelector] = useState(false);
  const [selectedBrandForCategory, setSelectedBrandForCategory] = useState<string>('');
  const [availableProductsForCategory, setAvailableProductsForCategory] = useState<any[]>([]);
  
  // Favorite paint selector state
  const [showFavoritePaintSelector, setShowFavoritePaintSelector] = useState(false);
  const [useFavoriteSelector, setUseFavoriteSelector] = useState(true); // Default to using favorites
  
  // Batch loading state
  const [isInitializing, setIsInitializing] = useState(true);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Progressive estimation state
  const [currentEstimate, setCurrentEstimate] = useState<ProgressiveEstimate | null>(null);
  const [showEstimate, setShowEstimate] = useState(false);
  const [estimateFloating, setEstimateFloating] = useState(false);

  // Helper function for brand icons
  const getBrandIcon = (brand: string): string => {
    const brandIcons: { [key: string]: string } = {
      'Sherwin-Williams': '🎨',
      'Benjamin Moore': '🏠',
      'PPG': '🎭',
      'Behr': '✨',
      'Kilz': '🛡️',
      'Zinsser': '💪',
    };
    return brandIcons[brand] || '🎨';
  };

  // Helper function to determine quality level based on price
  const getQualityLevel = (price: number): string => {
    if (price < 50) return 'Good';
    if (price < 80) return 'Better';
    return 'Best';
  };

  // Helper functions for measurement-driven workflow
  const initializeMeasurementQueue = (surfaces: string[]) => {
    const queue: string[] = [];
    const status: {[category: string]: {measured: boolean, paintSelected: boolean}} = {};
    
    surfaces.forEach(surface => {
      queue.push(surface);
      status[surface] = { measured: false, paintSelected: false };
    });
    
    setMeasurementQueue(queue);
    setCategoryCompletionStatus(status);
    if (queue.length > 0) {
      setCurrentMeasurementCategory(queue[0]);
    }
  };

  const markCategoryMeasured = (category: string) => {
    setCategoryCompletionStatus(prev => ({
      ...prev,
      [category]: { ...prev[category], measured: true }
    }));
  };

  const markCategoryPaintSelected = (category: string) => {
    setCategoryCompletionStatus(prev => ({
      ...prev,
      [category]: { ...prev[category], paintSelected: true }
    }));
  };

  const getNextCategoryForMeasurement = () => {
    const incomplete = measurementQueue.find(category => 
      !categoryCompletionStatus[category]?.measured
    );
    return incomplete || null;
  };

  const getNextCategoryForPaintSelection = () => {
    const measured = measurementQueue.find(category => 
      categoryCompletionStatus[category]?.measured && 
      !categoryCompletionStatus[category]?.paintSelected
    );
    return measured || null;
  };

  const isWorkflowComplete = () => {
    return measurementQueue.every(category => 
      categoryCompletionStatus[category]?.measured && 
      categoryCompletionStatus[category]?.paintSelected
    );
  };

  // Paint selection component callbacks
  const handleBrandSelect = async (brand: string) => {
    setSelectedBrandForCategory(brand);
    setShowPaintBrandSelector(false);
    
    // Fetch products for this brand and category
    try {
      const response = await fetch('/api/paint-products/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: companyData.id,
          brand: brand,
          category: currentMeasurementCategory
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAvailableProductsForCategory(data.products || []);
        setShowPaintProductSelector(true);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductSelect = (product: any) => {
    // Store the selected product
    setSelectedPaintProducts(prev => ({
      ...prev,
      [currentMeasurementCategory]: product
    }));
    
    // Mark category as paint selected
    markCategoryPaintSelected(currentMeasurementCategory);
    setShowPaintProductSelector(false);
  };

  const handleFavoriteProductSelect = (product: any) => {
    // Store the selected favorite product
    setSelectedPaintProducts(prev => ({
      ...prev,
      [currentMeasurementCategory]: product
    }));
    
    // Mark category as paint selected
    markCategoryPaintSelected(currentMeasurementCategory);
    setShowFavoritePaintSelector(false);
    
    // Move to next category or finish
    const nextCategory = getNextCategoryForMeasurement();
    if (nextCategory) {
      setCurrentMeasurementCategory(nextCategory);
      setConversationStage('category_measurement_collection');
      
      // Add a message about the selection and moving to next category
      const confirmMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Great choice! **${product.supplier} ${product.productName}** selected for ${currentMeasurementCategory}.\n\nNext: Let's measure **${nextCategory}**.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, confirmMessage]);
    } else {
      // All categories complete
      checkWorkflowCompletion();
    }
  };

  // Helper function to handle workflow completion when all categories are done
  const checkWorkflowCompletion = () => {
    if (isWorkflowComplete()) {
      const completionMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🎉 **All surfaces complete!** \n\nMeasurements and paint selections are done. Now let's set your profit margin.\n\nWhat markup percentage would you like?`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, completionMessage]);
      setConversationStage('markup_selection');
      
      // Show markup buttons
      setTimeout(() => {
        setButtonOptions([
          { id: '15', label: '15%', value: '15', selected: false },
          { id: '20', label: '20%', value: '20', selected: true },
          { id: '25', label: '25%', value: '25', selected: false },
          { id: '30', label: '30%', value: '30', selected: false },
          { id: 'custom', label: 'Custom %', value: 'custom', selected: false }
        ]);
        setShowButtons(true);
      }, 500);
    }
  };

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper function to render markdown
  const renderMarkdown = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-scroll when buttons appear
  useEffect(() => {
    if (showButtons) {
      setTimeout(() => {
        scrollToBottom();
      }, 100); // Small delay to ensure DOM has updated
    }
  }, [showButtons]);

  // Optimized batch initialization
  useEffect(() => {
    initializeApp();
  }, [router, editQuoteId]);

  const initializeApp = async () => {
    setIsInitializing(true);
    setLoadingProgress(10);
    setInitializationError(null);

    try {
      // Check authentication
      const company = localStorage.getItem("paintquote_company");
      if (!company) {
        router.push("/access-code");
        return;
      }

      setLoadingProgress(20);

      const parsedCompany = JSON.parse(company);
      if (Date.now() - parsedCompany.loginTime > 24 * 60 * 60 * 1000) {
        localStorage.removeItem("paintquote_company");
        router.push("/access-code");
        return;
      }

      setCompanyData(parsedCompany);
      setLoadingProgress(30);

      // Batch load all company data and edit quote data in parallel
      const { companyData, editData, loadTime } = await initializeQuoteCreation(
        parsedCompany.id, 
        editQuoteId
      );

      setLoadingProgress(70);

      // Apply company settings
      setQuoteData(prev => ({
        ...prev,
        rates: {
          wall_rate_per_sqft: companyData.settings.wall_rate_per_sqft,
          ceiling_rate_per_sqft: companyData.settings.ceiling_rate_per_sqft,
          primer_rate_per_sqft: companyData.settings.primer_rate_per_sqft,
          door_rate_each: companyData.settings.door_rate_each,
          window_rate_each: companyData.settings.window_rate_each,
          floor_sealer_rate_per_sqft: companyData.settings.floor_sealer_rate_per_sqft
        },
        markup_percentage: companyData.preferences.default_markup || 20
      }));

      // Apply paint brands
      setAvailableBrands(companyData.paintBrands.brands);
      setTopBrands(companyData.paintBrands.topBrands);
      setOtherBrands(companyData.paintBrands.otherBrands);

      // Apply setup status
      setUseFavoriteSelector(companyData.setupStatus.canUseFavorites);

      setLoadingProgress(90);

      // Handle edit mode if applicable
      if (editData && editData.isEdit && editData.quote) {
        setIsEditMode(true);
        applyEditQuoteData(editData.quote);
      }

      setLoadingProgress(100);

      // Track performance improvement
      trackLoadingPerformance(loadTime, 'quote_creation_initialization');

      toast({
        title: "Ready to Quote",
        description: `Loaded in ${Math.round(loadTime)}ms`,
        duration: 2000,
      });

    } catch (error) {
      console.error('Failed to initialize app:', error);
      setInitializationError(error instanceof Error ? error.message : 'Failed to load');
      
      toast({
        title: "Loading Error",
        description: "Some features may not work properly. Try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const applyEditQuoteData = (quote: any) => {
    // Update quote data with existing values
    setQuoteData(prev => ({
      ...prev,
      customer_name: quote.customer_name || '',
      address: quote.address || '',
      project_type: quote.project_type || 'interior',
      dimensions: {
        wall_linear_feet: quote.wall_linear_feet || undefined,
        ceiling_height: quote.ceiling_height || undefined,
        ceiling_area: quote.ceiling_area || undefined,
        floor_area: quote.floor_area || undefined,
        number_of_doors: quote.number_of_doors || 0,
        number_of_windows: quote.number_of_windows || 0,
      },
      markup_percentage: quote.markup_percentage || 20,
    }));
    
    // Set initial message for edit mode
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: `I'm loading your existing quote for ${quote.customer_name} at ${quote.address}. 

Current details:
• Project Type: ${quote.project_type}
• Wall Linear Feet: ${quote.wall_linear_feet || 'Not set'}
• Ceiling Height: ${quote.ceiling_height || 'Not set'}ft
• Floor Area: ${quote.floor_area || 'Not set'} sqft
• Ceiling Area: ${quote.ceiling_area || quote.floor_area || 'Not set'} sqft
• Doors: ${quote.number_of_doors || 0}
• Windows: ${quote.number_of_windows || 0}
• Current Price: $${quote.final_price || quote.total_cost}

What would you like to modify?`,
        timestamp: new Date().toISOString()
      }
    ]);
    
    // Set conversation stage to allow modifications
    setConversationStage('quote_review');
  };

  // Progressive estimation update function
  const updateProgressiveEstimate = () => {
    const partialData = {
      customer_name: quoteData.customer_name,
      address: quoteData.address,
      project_type: quoteData.project_type,
      selectedSurfaces,
      dimensions: quoteData.dimensions,
      markup_percentage: quoteData.markup_percentage,
      estimatedRoomCount: roomCount || undefined
    };

    const estimate = calculateProgressiveEstimate(partialData, quoteData.rates);
    setCurrentEstimate(estimate);
    
    // Show estimate only when we have meaningful data (at least project type + surfaces + some dimensions)
    const hasProjectType = quoteData.project_type && quoteData.project_type !== '';
    const hasSurfaces = selectedSurfaces.length > 0;
    const hasDimensions = quoteData.dimensions.wall_linear_feet || quoteData.dimensions.floor_area || quoteData.dimensions.ceiling_area;
    const hasMinimumData = hasProjectType && hasSurfaces && hasDimensions;
    
    if (!showEstimate && hasMinimumData && estimate.completeness >= 40) {
      setShowEstimate(true);
    }
  };

  // Update estimate when relevant data changes
  useEffect(() => {
    if (!isInitializing && companyData) {
      updateProgressiveEstimate();
    }
  }, [
    selectedSurfaces,
    quoteData.dimensions,
    quoteData.project_type,
    quoteData.markup_percentage,
    roomCount,
    isInitializing,
    companyData
  ]);

  // Old sequential loading functions removed - now using batch loader

  const handleButtonClick = async (buttonValue: any, buttonLabel: string) => {
    // Handle surface selection buttons silently (no AI response)
    if (conversationStage === 'surface_selection') {
      // If it's the continue button, process normally (with AI response)
      if (buttonValue === 'continue') {
        // Let it fall through to normal processing
      } else {
        // Handle surface toggle buttons silently
        const updatedSurfaces = [...selectedSurfaces];
        
        // Toggle surface selection
        if (updatedSurfaces.includes(buttonValue)) {
          const index = updatedSurfaces.indexOf(buttonValue);
          updatedSurfaces.splice(index, 1);
        } else {
          updatedSurfaces.push(buttonValue);
        }
        
        setSelectedSurfaces(updatedSurfaces);
        
        // Update buttons with current selections - keep same label text but track selected state
        const surfaceButtons = quoteData.project_type === 'interior' || quoteData.project_type === 'both' ? [
          { id: 'walls', label: '🎨 Walls', value: 'walls', selected: updatedSurfaces.includes('walls') },
          { id: 'ceilings', label: '⬆️ Ceilings', value: 'ceilings', selected: updatedSurfaces.includes('ceilings') },
          { id: 'trim', label: '🖼️ Trim & Baseboards', value: 'trim', selected: updatedSurfaces.includes('trim') },
          { id: 'doors', label: '🚪 Doors', value: 'doors', selected: updatedSurfaces.includes('doors') },
          { id: 'windows', label: '🪟 Window Frames', value: 'windows', selected: updatedSurfaces.includes('windows') }
        ] : [
          { id: 'siding', label: '🏠 Siding', value: 'siding', selected: updatedSurfaces.includes('siding') },
          { id: 'trim_ext', label: '🖼️ Exterior Trim', value: 'trim_ext', selected: updatedSurfaces.includes('trim_ext') },
          { id: 'doors_ext', label: '🚪 Front Door', value: 'doors_ext', selected: updatedSurfaces.includes('doors_ext') },
          { id: 'shutters', label: '🪟 Shutters', value: 'shutters', selected: updatedSurfaces.includes('shutters') },
          { id: 'deck', label: '🏗️ Deck/Porch', value: 'deck', selected: updatedSurfaces.includes('deck') }
        ];
        
        // Add continue button if surfaces are selected
        if (updatedSurfaces.length > 0) {
          surfaceButtons.push({ id: 'continue', label: '➡️ Continue to Dimensions', value: 'continue', selected: false });
        }
        
        setButtonOptions(surfaceButtons);
        return; // Exit early - no AI response needed for surface toggles
      }
    }
    
    // For all other buttons (including continue), process normally
    setShowButtons(false);
    setButtonOptions([]);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: buttonLabel,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Start thinking phase
    setIsThinking(true);

    try {
      // Process the response while thinking
      const aiResponse = await processUserInput(buttonValue, conversationStage);
      
      // Calculate thinking duration based on response length
      const thinkingDuration = calculateThinkingDuration(aiResponse.content.length);
      
      // Wait for thinking duration to complete
      setTimeout(() => {
        setIsThinking(false);
        setIsLoading(true);
        
        // Small delay before showing the actual response for smooth transition
        setTimeout(() => {
          setMessages(prev => [...prev, aiResponse]);
          setIsLoading(false);
        }, 100);
      }, thinkingDuration);
      
    } catch (error) {
      console.error('Error processing button click:', error);
      
      // Even for errors, show thinking briefly
      setTimeout(() => {
        setIsThinking(false);
        setIsLoading(true);
        
        setTimeout(() => {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "I'm sorry, I encountered an error. Please try again or contact support.",
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, errorMessage]);
          setIsLoading(false);
        }, 100);
      }, 500);
    }
  };

  // Helper function to calculate thinking duration based on response length
  const calculateThinkingDuration = (responseLength: number): number => {
    // Base time: 500ms, add 500ms for longer responses (>200 chars)
    return responseLength > 200 ? 1000 : 500;
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || isThinking) return;

    setShowButtons(false);
    setButtonOptions([]);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Start thinking phase
    setIsThinking(true);

    try {
      // Process the response while thinking
      const aiResponse = await processUserInput(inputValue, conversationStage);
      
      // Calculate thinking duration based on response length
      const thinkingDuration = calculateThinkingDuration(aiResponse.content.length);
      
      // Wait for thinking duration to complete
      setTimeout(() => {
        setIsThinking(false);
        setIsLoading(true);
        
        // Small delay before showing the actual response for smooth transition
        setTimeout(() => {
          setMessages(prev => [...prev, aiResponse]);
          setIsLoading(false);
        }, 100);
      }, thinkingDuration);
      
    } catch (error) {
      console.error('Error processing input:', error);
      
      // Even for errors, show thinking briefly
      setTimeout(() => {
        setIsThinking(false);
        setIsLoading(true);
        
        setTimeout(() => {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "I'm sorry, I encountered an error. Please try again or contact support.",
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, errorMessage]);
          setIsLoading(false);
        }, 100);
      }, 500);
    }
  };

  const processUserInput = async (input: string, stage: string): Promise<Message> => {
    let responseContent = '';
    let nextStage = stage;

    switch (stage) {
      case 'customer_info':
        const customerInfo = parseCustomerInfo(input, quoteData);
        setQuoteData(prev => ({ 
          ...prev, 
          customer_name: customerInfo.customer_name || prev.customer_name,
          address: customerInfo.address || prev.address
        }));
        
        const customerName = customerInfo.customer_name || quoteData.customer_name;
        const address = customerInfo.address || quoteData.address;
        
        responseContent = generateFollowUpQuestion('customer_info', {
          customer_name: customerName,
          address: address
        });
        
        if (customerName && address) {
          nextStage = 'project_type';
          // Show project type buttons immediately when asking project type question
          setTimeout(() => {
            setButtonOptions([
              { id: 'interior', label: 'Interior Only', value: 'interior', selected: false },
              { id: 'exterior', label: 'Exterior Only', value: 'exterior', selected: false },
              { id: 'both', label: 'Both Interior & Exterior', value: 'both', selected: false }
            ]);
            setShowButtons(true);
          }, 500);
        } else {
          nextStage = 'customer_info';
        }
        break;

      case 'address':
        setQuoteData(prev => ({ ...prev, address: input.trim() }));
        responseContent = `Thanks! Now I have ${quoteData.customer_name} at ${input.trim()}.\n\nWhat type of painting work are we quoting?`;
        // Show project type buttons
        setTimeout(() => {
          setButtonOptions([
            { id: 'interior', label: 'Interior Only', value: 'interior', selected: false },
            { id: 'exterior', label: 'Exterior Only', value: 'exterior', selected: false },
            { id: 'both', label: 'Both Interior & Exterior', value: 'both', selected: false }
          ]);
          setShowButtons(true);
        }, 500);
        nextStage = 'project_type';
        break;
        
      case 'customer_name':
        setQuoteData(prev => ({ ...prev, customer_name: input.trim() }));
        responseContent = `Got it! ${input.trim()} at ${quoteData.address} 📍\n\nWhat kind of painting are we doing?`;
        // Show project type buttons
        setTimeout(() => {
          setButtonOptions([
            { id: 'interior', label: 'Interior Only', value: 'interior', selected: false },
            { id: 'exterior', label: 'Exterior Only', value: 'exterior', selected: false },
            { id: 'both', label: 'Both Interior & Exterior', value: 'both', selected: false }
          ]);
          setShowButtons(true);
        }, 500);
        nextStage = 'project_type';
        break;

      case 'project_type':
        const projectType = parseProjectType(input);
        setQuoteData(prev => ({ ...prev, project_type: projectType }));
        
        if (projectType === 'interior' || projectType === 'both') {
          responseContent = `Nice! ${projectType} it is 🏠\n\nWhat surfaces are we painting? Just tap what you need:`;
          // Show surface selection buttons for interior
          setTimeout(() => {
            setConversationStage('surface_selection'); // Set stage BEFORE showing buttons
            setSelectedSurfaces([]); // Reset selected surfaces
            setButtonOptions([
              { id: 'walls', label: '🎨 Walls', value: 'walls', selected: false },
              { id: 'ceilings', label: '⬆️ Ceilings', value: 'ceilings', selected: false },
              { id: 'trim', label: '🖼️ Trim & Baseboards', value: 'trim', selected: false },
              { id: 'doors', label: '🚪 Doors', value: 'doors', selected: false },
              { id: 'windows', label: '🪟 Window Frames', value: 'windows', selected: false }
            ]);
            setShowButtons(true);
          }, 500);
        } else {
          responseContent = `Awesome! Exterior painting 🎨\n\nWhat parts of the outside are we painting?`;
          // Show surface selection buttons for exterior
          setTimeout(() => {
            setConversationStage('surface_selection'); // Set stage BEFORE showing buttons
            setSelectedSurfaces([]); // Reset selected surfaces
            setButtonOptions([
              { id: 'siding', label: '🏠 Siding', value: 'siding', selected: false },
              { id: 'trim_ext', label: '🖼️ Exterior Trim', value: 'trim_ext', selected: false },
              { id: 'doors_ext', label: '🚪 Front Door', value: 'doors_ext', selected: false },
              { id: 'shutters', label: '🪟 Shutters', value: 'shutters', selected: false },
              { id: 'deck', label: '🏗️ Deck/Porch', value: 'deck', selected: false }
            ]);
            setShowButtons(true);
          }, 500);
        }
        nextStage = 'surface_selection';
        break;


      case 'surface_selection':
        // Handle continue to dimensions (surface selection is now handled in handleButtonClick)
        if (input === 'continue' || input.toLowerCase().includes('continue')) {
          // Require at least one surface to be selected
          if (selectedSurfaces.length === 0) {
            responseContent = `Please select at least one surface to paint before continuing.\n\nUse the buttons above to choose which surfaces you want to include in the quote.`;
            nextStage = 'surface_selection';
            break;
          }
          
          // Initialize the measurement queue for the new workflow
          initializeMeasurementQueue(selectedSurfaces);
          
          const surfaceList = selectedSurfaces.join(', ');
          const firstCategory = selectedSurfaces[0]; // Use selectedSurfaces directly since that's what gets queued
          
          // Start the new measurement-driven workflow
          responseContent = `Sweet! ${surfaceList} it is 👍\n\nLet's start with the ${firstCategory}. `;
          
          // Provide category-specific measurement instructions
          if (firstCategory === 'ceilings') {
            responseContent += `How many square feet of ceiling space?\n\n(You can tell me ceiling area or just the floor area and I'll figure it out!)`;
          } else if (firstCategory === 'walls') {
            responseContent += `What's the wall situation?\n\nJust need the linear feet around the room and ceiling height!\n\nLike "120 feet around, 9 foot ceilings"`;
          } else if (firstCategory === 'doors') {
            responseContent += `How many doors are we painting? 🚪`;
          } else if (firstCategory === 'windows') {
            responseContent += `How many windows? 🪟`;
          } else if (firstCategory === 'trim') {
            responseContent += `How many doors and windows have trim around them?\n\nLike "3 doors and 5 windows" or whatever you've got!`;
          }
          
          nextStage = 'category_measurement_collection';
        } else {
          // Handle text input during surface selection
          responseContent = `Just tap the buttons above to pick what we're painting! 😊`;
          nextStage = 'surface_selection';
        }
        break;

      case 'room_count':
        const count = input === 'custom' ? 0 : parseRoomCount(input);
        if (input === 'custom') {
          responseContent = `How many rooms? (Please enter a number)`;
          nextStage = 'room_count_custom';
        } else if (count > 0) {
          setRoomCount(count);
          setCurrentRoomIndex(0);
          setRooms([]);
          responseContent = `Perfect! Let's measure ${count} rooms for ceiling painting.\n\nI need the room dimensions to calculate the ceiling area for accurate paint coverage.\n\n**Room 1:** What are the dimensions and what would you like to call this room?\nPlease provide: length, width, height (in feet)\n\nExample: "Living Room: 12 by 14, 9 foot ceilings" or "Kitchen: 12x14x9"`;
          nextStage = 'room_dimensions';
        } else {
          responseContent = `Please select the number of rooms or choose "More than 5" for custom entry.`;
          nextStage = 'room_count';
        }
        break;

      case 'room_count_custom':
        const customCount = parseRoomCount(input);
        if (customCount > 0) {
          setRoomCount(customCount);
          setCurrentRoomIndex(0);
          setRooms([]);
          responseContent = `Perfect! Let's measure ${customCount} rooms for ceiling painting.\n\nI need the room dimensions to calculate the ceiling area for accurate paint coverage.\n\n**Room 1:** What are the dimensions and what would you like to call this room?\nPlease provide: length, width, height (in feet)\n\nExample: "Living Room: 12 by 14, 9 foot ceilings" or "Kitchen: 12x14x9"`;
          nextStage = 'room_dimensions';
        } else {
          responseContent = `Please enter a valid number of rooms.`;
          nextStage = 'room_count_custom';
        }
        break;

      case 'room_dimensions':
        // Parse room name and dimensions
        let roomName = `Room ${currentRoomIndex + 1}`;
        let roomDimensionInput = input;
        
        // Check if user provided a room name (format: "Room Name: dimensions")
        if (input.includes(':')) {
          const parts = input.split(':');
          if (parts.length >= 2) {
            roomName = parts[0].trim();
            roomDimensionInput = parts.slice(1).join(':').trim();
          }
        }
        
        const parsedRoom = parseRoomData(roomDimensionInput, roomName);
        
        if (parsedRoom.length && parsedRoom.width && parsedRoom.height) {
          const completeRoom = calculateRoomAreas({
            id: `room_${currentRoomIndex + 1}`,
            name: roomName,
            length: parsedRoom.length,
            width: parsedRoom.width,
            height: parsedRoom.height,
            doors: parsedRoom.doors || 1,
            windows: parsedRoom.windows || 1
          });
          
          const updatedRooms = [...rooms, completeRoom];
          setRooms(updatedRooms);
          
          if (currentRoomIndex + 1 < roomCount) {
            setCurrentRoomIndex(currentRoomIndex + 1);
            responseContent = `Great! **${roomName}**: ${parsedRoom.length}' × ${parsedRoom.width}' × ${parsedRoom.height}' (${completeRoom.ceiling_area} sqft ceiling)\n\n**Room ${currentRoomIndex + 2}:** What are the dimensions and name?\nLength, width, height (in feet)\n\nExample: "Bedroom 2: 10x12x9" or "Master Bath: 8 by 10, 9 foot ceilings"`;
            nextStage = 'room_dimensions';
          } else {
            // All rooms collected, update quote data and proceed
            const roomTotals = calculateTotalAreasFromRooms(updatedRooms);
            setQuoteData(prev => ({
              ...prev,
              dimensions: {
                ...prev.dimensions,
                rooms: updatedRooms,
                room_count: roomCount,
                ceiling_area: roomTotals.total_ceiling_area,
                wall_linear_feet: roomTotals.wall_linear_feet || prev.dimensions.wall_linear_feet,
                ceiling_height: updatedRooms[0]?.height || 9, // Use first room's height as reference
                number_of_doors: roomTotals.total_doors,
                number_of_windows: roomTotals.total_windows
              }
            }));
            
            const roomSummaryWithButtons = generateRoomSummaryWithButtons(updatedRooms);
            
            // Check what additional measurements are needed based on selected surfaces
            const needsWallDimensions = selectedSurfaces.some(surface => 
              ['walls', 'trim', 'doors', 'windows'].includes(surface)
            );
            const needsDoorsWindows = selectedSurfaces.some(surface => 
              ['doors', 'windows', 'trim'].includes(surface)
            );
            const onlyCeilings = selectedSurfaces.length === 1 && selectedSurfaces.includes('ceilings');
            
            if (onlyCeilings) {
              // For ceiling-only projects, we have all needed measurements from room dimensions
              responseContent = `Excellent! Here's your room summary:\n\n${roomSummaryWithButtons.summary}\n\n✅ **All measurements collected!** Since you're only painting ceilings, I have everything needed from the room dimensions.`;
              
              setTimeout(() => {
                setButtonOptions([
                  ...roomSummaryWithButtons.buttons,
                  { id: 'continue_paint', label: '➡️ Continue to Paint Selection', value: 'continue_paint', selected: false }
                ]);
                setShowButtons(true);
              }, 500);
              nextStage = 'ready_for_paint_selection';
            } else if (needsWallDimensions) {
              // Need wall dimensions for wall/trim/door/window painting
              const measurementPurpose = selectedSurfaces.includes('walls') 
                ? 'for calculating wall paint coverage' 
                : 'for calculating trim, door, and window areas';
              
              responseContent = `Excellent! Here's your room summary:\n\n${roomSummaryWithButtons.summary}\n\nI need the wall dimensions ${measurementPurpose}:\n\n• **Wall linear footage** (perimeter of walls to be painted)\n\nFor example: "120 linear feet"`;
              
              setTimeout(() => {
                const wallDimensionButtons = [
                  ...roomSummaryWithButtons.buttons,
                  { id: 'continue_wall', label: '➡️ Continue to Wall Dimensions', value: 'continue_wall', selected: false }
                ];
                setButtonOptions(wallDimensionButtons);
                setShowButtons(true);
              }, 500);
              nextStage = 'wall_dimensions';
            } else {
              // Fallback case
              responseContent = `Excellent! Here's your room summary:\n\n${roomSummaryWithButtons.summary}`;
              setTimeout(() => {
                setButtonOptions([
                  ...roomSummaryWithButtons.buttons,
                  { id: 'continue_paint', label: '➡️ Continue to Paint Selection', value: 'continue_paint', selected: false }
                ]);
                setShowButtons(true);
              }, 500);
              nextStage = 'ready_for_paint_selection';
            }
          }
        } else {
          responseContent = `I need the room dimensions. Please provide length, width, and height.\n\nExample: "${roomName}: 12 by 14, 9 foot ceilings" or "${roomName}: 12x14x9"`;
          nextStage = 'room_dimensions';
        }
        break;

      case 'wall_dimensions':
        // Handle room edit buttons
        if (input.startsWith('edit_room_')) {
          const roomIndex = parseInt(input.split('_')[2]);
          const roomToEdit = rooms[roomIndex];
          if (roomToEdit) {
            setEditingRoomIndex(roomIndex);
            responseContent = `**Editing ${roomToEdit.name}**\n\nCurrent dimensions: ${roomToEdit.length}' × ${roomToEdit.width}' × ${roomToEdit.height}'\n\nEnter new dimensions:\nLength, width, height (in feet)\n\nExample: "12 by 14, 9 foot ceilings" or "12x14x9"`;
            nextStage = 'edit_room';
          }
          break;
        }
        
        // Handle continue to wall dimensions button
        if (input === 'continue_wall') {
          responseContent = `I need the wall dimensions to calculate the wall area and determine paint coverage:\n\n• **Wall linear footage** (perimeter of walls to be painted)\n\nFor example: "120 linear feet"`;
          nextStage = 'wall_dimensions';
          break;
        }
        
        // Handle regular wall dimension input
        const wallDimensions = parseDimensions(input, quoteData.project_type, quoteData.dimensions);
        setQuoteData(prev => ({ 
          ...prev, 
          dimensions: { ...prev.dimensions, ...wallDimensions }
        }));
        
        if (wallDimensions.wall_linear_feet) {
          // Check if we need to ask about doors and windows
          const needsDoorsWindows = selectedSurfaces.some(surface => 
            ['doors', 'windows', 'trim'].includes(surface)
          );
          
          if (needsDoorsWindows) {
            const doorWindowPurpose = [];
            if (selectedSurfaces.includes('doors')) doorWindowPurpose.push('doors');
            if (selectedSurfaces.includes('windows')) doorWindowPurpose.push('windows');
            if (selectedSurfaces.includes('trim')) doorWindowPurpose.push('trim around doors and windows');
            
            responseContent = `Perfect! I need to count the doors and windows to calculate the exact paint coverage for ${doorWindowPurpose.join(', ')}:\n\n• How many **doors** need painting?\n• How many **windows** need painting?\n\nFor example: "3 doors and 5 windows" or "2 doors, no windows"`;
            nextStage = 'doors_windows';
          } else {
            // Skip doors/windows and go straight to paint selection
            responseContent = `Perfect! I have all the measurements needed for your wall painting project.`;
            
            // Set up paint selection queue based on selected surfaces
            const paintCategories = [];
            if (selectedSurfaces.includes('walls')) paintCategories.push('walls');
            if (selectedSurfaces.includes('ceilings')) paintCategories.push('ceilings');
            if (selectedSurfaces.includes('trim')) paintCategories.push('trim');
            if (selectedSurfaces.includes('doors')) paintCategories.push('doors');
            if (selectedSurfaces.includes('windows')) paintCategories.push('windows');
            
            setPaintSelectionQueue(paintCategories);
            setCurrentPaintCategoryIndex(0);
            
            if (paintCategories.length > 0) {
              const firstCategory = paintCategories[0];
              setCurrentPaintCategory(firstCategory);
              responseContent += `\n\nGreat! Now let's select paint for your ${firstCategory}.\n\nWhich paint brand do you prefer for ${firstCategory}?`;
              
              // Show brand selection buttons - prioritize top brands
              setTimeout(() => {
                const topBrandButtons = topBrands
                  .filter(brand => brand.products[firstCategory] && brand.products[firstCategory].length > 0)
                  .map(brand => ({
                    id: `brand_${brand.brand}`,
                    label: `${getBrandIcon(brand.brand)} ${brand.brand}`,
                    value: `brand_${brand.brand}_${firstCategory}`,
                    selected: false
                  }));
                
                if (topBrandButtons.length > 0) {
                  setButtonOptions(topBrandButtons);
                  setShowButtons(true);
                } else {
                  // Fallback to all brands limited to 3
                  const allBrandButtons = availableBrands
                    .filter(brand => brand.products[firstCategory] && brand.products[firstCategory].length > 0)
                    .slice(0, 3)
                    .map(brand => ({
                      id: `brand_${brand.brand}`,
                      label: `${getBrandIcon(brand.brand)} ${brand.brand}`,
                      value: `brand_${brand.brand}_${firstCategory}`,
                      selected: false
                    }));
                  
                  if (allBrandButtons.length > 0) {
                    setButtonOptions(allBrandButtons);
                    setShowButtons(true);
                  } else {
                    // Final fallback to generic paint quality
                    setButtonOptions([
                      { id: 'good', label: '💰 Good - Budget-friendly', value: 'good', selected: false },
                      { id: 'better', label: '⭐ Better - Mid-range quality', value: 'better', selected: false },
                      { id: 'best', label: '👑 Best - Premium quality', value: 'best', selected: false }
                    ]);
                    setShowButtons(true);
                  }
                }
              }, 500);
              
              // Check if we have brands available to determine next stage
              const hasBrands = topBrands.some(brand => brand.products[firstCategory] && brand.products[firstCategory].length > 0) ||
                               availableBrands.some(brand => brand.products[firstCategory] && brand.products[firstCategory].length > 0);
              if (hasBrands) {
                nextStage = 'paint_brand_selection';
              } else {
                nextStage = 'paint_quality';
                responseContent += `\n\nPerfect! Now what paint quality would you like for ${firstCategory}?`;
              }
            }
          }
        } else {
          responseContent = `I need the wall linear footage. How many linear feet of walls need painting?\n\nFor example: "120 linear feet"`;
          nextStage = 'wall_dimensions';
        }
        break;

      case 'edit_room':
        const editingIndex = editingRoomIndex;
        const editDimensionInput = input;
        
        // Parse new room dimensions
        const parsedEditedRoom = parseRoomData(editDimensionInput, rooms[editingIndex].name);
        
        if (parsedEditedRoom.length && parsedEditedRoom.width && parsedEditedRoom.height) {
          const updatedRoom = calculateRoomAreas({
            id: rooms[editingIndex].id,
            name: rooms[editingIndex].name,
            length: parsedEditedRoom.length,
            width: parsedEditedRoom.width,
            height: parsedEditedRoom.height,
            doors: parsedEditedRoom.doors || rooms[editingIndex].doors,
            windows: parsedEditedRoom.windows || rooms[editingIndex].windows
          });
          
          // Update the rooms array
          const updatedRooms = [...rooms];
          updatedRooms[editingIndex] = updatedRoom;
          setRooms(updatedRooms);
          
          // Recalculate totals
          const roomTotals = calculateTotalAreasFromRooms(updatedRooms);
          setQuoteData(prev => ({
            ...prev,
            dimensions: {
              ...prev.dimensions,
              rooms: updatedRooms,
              ceiling_area: roomTotals.total_ceiling_area,
              number_of_doors: roomTotals.total_doors,
              number_of_windows: roomTotals.total_windows
            }
          }));
          
          // Show updated room summary with buttons
          const roomSummaryWithButtons = generateRoomSummaryWithButtons(updatedRooms);
          responseContent = `**Room Updated!** ✅\n\n${roomSummaryWithButtons.summary}\n\nNow I need the wall dimensions for the areas you want painted:\n\n• **Wall linear footage** (perimeter of walls to be painted)\n\nFor example: "120 linear feet"`;
          
          // Show room edit buttons again
          setTimeout(() => {
            const wallDimensionButtons = [
              ...roomSummaryWithButtons.buttons,
              { id: 'continue_wall', label: '➡️ Continue to Wall Dimensions', value: 'continue_wall', selected: false }
            ];
            setButtonOptions(wallDimensionButtons);
            setShowButtons(true);
          }, 500);
          nextStage = 'wall_dimensions';
          setEditingRoomIndex(-1);
        } else {
          responseContent = `I need the room dimensions. Please provide length, width, and height.\n\nExample: "${rooms[editingIndex].name}: 12 by 14, 9 foot ceilings" or "12x14x9"`;
          nextStage = 'edit_room';
        }
        break;

      case 'edit_room_quote':
        const editingQuoteIndex = editingRoomIndex;
        const quoteEditDimensionInput = input;
        
        // Parse new room dimensions
        const parsedQuoteEditedRoom = parseRoomData(quoteEditDimensionInput, rooms[editingQuoteIndex].name);
        
        if (parsedQuoteEditedRoom.length && parsedQuoteEditedRoom.width && parsedQuoteEditedRoom.height) {
          const updatedQuoteRoom = calculateRoomAreas({
            id: rooms[editingQuoteIndex].id,
            name: rooms[editingQuoteIndex].name,
            length: parsedQuoteEditedRoom.length,
            width: parsedQuoteEditedRoom.width,
            height: parsedQuoteEditedRoom.height,
            doors: parsedQuoteEditedRoom.doors || rooms[editingQuoteIndex].doors,
            windows: parsedQuoteEditedRoom.windows || rooms[editingQuoteIndex].windows
          });
          
          // Update the rooms array
          const updatedQuoteRooms = [...rooms];
          updatedQuoteRooms[editingQuoteIndex] = updatedQuoteRoom;
          setRooms(updatedQuoteRooms);
          
          // Recalculate totals and quote
          const roomQuoteTotals = calculateTotalAreasFromRooms(updatedQuoteRooms);
          const updatedQuoteData = {
            ...quoteData,
            dimensions: {
              ...quoteData.dimensions,
              rooms: updatedQuoteRooms,
              ceiling_area: roomQuoteTotals.total_ceiling_area,
              number_of_doors: roomQuoteTotals.total_doors,
              number_of_windows: roomQuoteTotals.total_windows
            }
          };
          setQuoteData(updatedQuoteData);
          
          // Recalculate the quote with new room data
          const newCalculation = calculateProfessionalQuote(
            updatedQuoteData.dimensions as ProjectDimensions,
            {
              primer: {
                name: DEFAULT_PAINT_PRODUCTS.primer_name,
                spread_rate: DEFAULT_PAINT_PRODUCTS.primer_spread_rate,
                cost: DEFAULT_PAINT_PRODUCTS.primer_cost_per_gallon
              } as any,
              wall_paint: DEFAULT_PAINT_PRODUCTS.wall_paints[updatedQuoteData.selected_products.wall_paint_level],
              ceiling_paint: DEFAULT_PAINT_PRODUCTS.ceiling_paints[updatedQuoteData.selected_products.ceiling_paint_level],
              trim_paint: DEFAULT_PAINT_PRODUCTS.trim_paints[updatedQuoteData.selected_products.trim_paint_level],
              floor_sealer: DEFAULT_PAINT_PRODUCTS.floor_sealer
            },
            updatedQuoteData.rates,
            updatedQuoteData.markup_percentage,
            false
          );
          
          setQuoteData(prev => ({ ...prev, calculation: newCalculation }));
          
          // Show updated quote with buttons
          const quoteWithButtons = generateQuoteDisplayWithButtons(newCalculation, updatedQuoteData.customer_name, updatedQuoteData.address, updatedQuoteRooms);
          responseContent = `**Room Updated!** ✅ Quote recalculated.\n\n${quoteWithButtons.quoteText}`;
          
          // Show room edit buttons along with standard quote buttons
          setTimeout(() => {
            const quoteButtons = [
              ...quoteWithButtons.roomButtons,
              { id: 'save', label: '💾 Save Quote', value: 'save', selected: false },
              { id: 'adjust_markup', label: '📊 Adjust Markup', value: 'adjust_markup', selected: false },
              { id: 'breakdown', label: '🔍 View Breakdown', value: 'breakdown', selected: false }
            ];
            setButtonOptions(quoteButtons);
            setShowButtons(true);
          }, 500);
          nextStage = 'quote_review';
          setEditingRoomIndex(-1);
        } else {
          responseContent = `I need the room dimensions. Please provide length, width, and height.\n\nExample: "${rooms[editingQuoteIndex].name}: 12 by 14, 9 foot ceilings" or "12x14x9"`;
          nextStage = 'edit_room_quote';
        }
        break;

      case 'dimensions':
        const dimensions = parseDimensions(input, quoteData.project_type, quoteData.dimensions);
        setQuoteData(prev => ({ 
          ...prev, 
          dimensions: { ...prev.dimensions, ...dimensions }
        }));
        
        const updatedDimensions = { ...quoteData.dimensions, ...dimensions };
        
        // Check if we have enough dimensions to proceed
        const hasRequiredDimensions = updatedDimensions.wall_linear_feet && 
          updatedDimensions.ceiling_height;
        
        if (hasRequiredDimensions) {
          responseContent = `Excellent! I need to count the doors and windows to calculate the exact surface area for paint coverage:\n\n• How many **doors** need painting?\n• How many **windows** need painting?\n\nFor example: "3 doors and 5 windows" or "2 doors, no windows"`;
          nextStage = 'doors_windows';
        } else {
          responseContent = generateFollowUpQuestion('dimensions', { 
            dimensions: updatedDimensions, 
            project_type: quoteData.project_type 
          });
          // Stay in dimensions stage to continue collecting info
          nextStage = 'dimensions';
        }
        break;
        
      case 'ready_for_paint_selection':
        // Handle the continue to paint selection button for ceiling-only projects
        if (input === 'continue_paint') {
          // Set up paint selection queue based on selected surfaces
          const paintCategories = [];
          if (selectedSurfaces.includes('walls')) paintCategories.push('walls');
          if (selectedSurfaces.includes('ceilings')) paintCategories.push('ceilings');
          if (selectedSurfaces.includes('trim')) paintCategories.push('trim');
          if (selectedSurfaces.includes('doors')) paintCategories.push('doors');
          if (selectedSurfaces.includes('windows')) paintCategories.push('windows');
          
          setPaintSelectionQueue(paintCategories);
          setCurrentPaintCategoryIndex(0);
          
          if (paintCategories.length > 0) {
            const firstCategory = paintCategories[0];
            setCurrentPaintCategory(firstCategory);
            responseContent = `Great! Now let's select paint for your ${firstCategory}.\n\nWhich paint brand do you prefer for ${firstCategory}?`;
            
            // Show brand selection buttons - prioritize top brands
            setTimeout(() => {
              const topBrandButtons = topBrands
                .filter(brand => brand.products[firstCategory] && brand.products[firstCategory].length > 0)
                .map(brand => ({
                  id: `brand_${brand.brand}`,
                  label: `${getBrandIcon(brand.brand)} ${brand.brand}`,
                  value: `brand_${brand.brand}_${firstCategory}`,
                  selected: false
                }));
              
              if (topBrandButtons.length > 0) {
                setButtonOptions(topBrandButtons);
                setShowButtons(true);
              } else {
                // Fallback to all brands if no top brands available
                const allBrandButtons = availableBrands
                  .filter(brand => brand.products[firstCategory] && brand.products[firstCategory].length > 0)
                  .slice(0, 3) // Limit to 3 even for fallback
                  .map(brand => ({
                    id: `brand_${brand.brand}`,
                    label: `${getBrandIcon(brand.brand)} ${brand.brand}`,
                    value: `brand_${brand.brand}_${firstCategory}`,
                    selected: false
                  }));
                
                if (allBrandButtons.length > 0) {
                  setButtonOptions(allBrandButtons);
                  setShowButtons(true);
                } else {
                  // Final fallback to generic paint quality
                  setButtonOptions([
                    { id: 'good', label: '💰 Good - Budget-friendly', value: 'good', selected: false },
                    { id: 'better', label: '⭐ Better - Mid-range quality', value: 'better', selected: false },
                    { id: 'best', label: '👑 Best - Premium quality', value: 'best', selected: false }
                  ]);
                  setShowButtons(true);
                }
              }
            }, 500);
            
            // Check if we have brands available to determine next stage
            const hasBrands = topBrands.some(brand => brand.products[firstCategory] && brand.products[firstCategory].length > 0) ||
                             availableBrands.some(brand => brand.products[firstCategory] && brand.products[firstCategory].length > 0);
            if (hasBrands) {
              nextStage = 'paint_brand_selection';
            } else {
              nextStage = 'paint_quality';
              responseContent = `Perfect! Now what paint quality would you like for ${firstCategory}?`;
            }
          } else {
            responseContent = `Perfect! Now what paint quality would you like?`;
            // Show paint quality buttons as fallback
            setTimeout(() => {
              setButtonOptions([
                { id: 'good', label: '💰 Good - Budget-friendly', value: 'good', selected: false },
                { id: 'better', label: '⭐ Better - Mid-range quality', value: 'better', selected: false },
                { id: 'best', label: '👑 Best - Premium quality', value: 'best', selected: false }
              ]);
              setShowButtons(true);
            }, 500);
            nextStage = 'paint_quality';
          }
        } else {
          // Handle room edit buttons (same logic as other stages)
          if (input.startsWith('edit_room_')) {
            const roomIndex = parseInt(input.split('_')[2]);
            const roomToEdit = rooms[roomIndex];
            if (roomToEdit) {
              setEditingRoomIndex(roomIndex);
              responseContent = `**Editing ${roomToEdit.name}**\n\nCurrent dimensions: ${roomToEdit.length}' × ${roomToEdit.width}' × ${roomToEdit.height}'\n\nEnter new dimensions:\nLength, width, height (in feet)\n\nExample: "12 by 14, 9 foot ceilings" or "12x14x9"`;
              nextStage = 'edit_room';
            }
          }
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
        
        // Set up paint selection queue based on selected surfaces
        const paintCategories = [];
        if (selectedSurfaces.includes('walls')) paintCategories.push('walls');
        if (selectedSurfaces.includes('ceilings')) paintCategories.push('ceilings');
        if (selectedSurfaces.includes('trim')) paintCategories.push('trim');
        if (selectedSurfaces.includes('doors')) paintCategories.push('doors');
        if (selectedSurfaces.includes('windows')) paintCategories.push('windows');
        
        setPaintSelectionQueue(paintCategories);
        setCurrentPaintCategoryIndex(0);
        
        if (paintCategories.length > 0) {
          const firstCategory = paintCategories[0];
          setCurrentPaintCategory(firstCategory);
          responseContent = `Great! Now let's select paint for your ${firstCategory}.\n\nWhich paint brand do you prefer for ${firstCategory}?`;
          
          // Show brand selection buttons - prioritize top brands
          setTimeout(() => {
            const topBrandButtons = topBrands
              .filter(brand => brand.products[firstCategory] && brand.products[firstCategory].length > 0)
              .map(brand => ({
                id: `brand_${brand.brand}`,
                label: `${getBrandIcon(brand.brand)} ${brand.brand}`,
                value: `brand_${brand.brand}_${firstCategory}`,
                selected: false
              }));
            
            if (topBrandButtons.length > 0) {
              setButtonOptions(topBrandButtons);
              setShowButtons(true);
            } else {
              // Fallback to all brands limited to 3
              const allBrandButtons = availableBrands
                .filter(brand => brand.products[firstCategory] && brand.products[firstCategory].length > 0)
                .slice(0, 3)
                .map(brand => ({
                  id: `brand_${brand.brand}`,
                  label: `${getBrandIcon(brand.brand)} ${brand.brand}`,
                  value: `brand_${brand.brand}_${firstCategory}`,
                  selected: false
                }));
              
              if (allBrandButtons.length > 0) {
                setButtonOptions(allBrandButtons);
                setShowButtons(true);
              } else {
                // Final fallback to generic paint quality
                setButtonOptions([
                  { id: 'good', label: '💰 Good - Budget-friendly', value: 'good', selected: false },
                  { id: 'better', label: '⭐ Better - Mid-range quality', value: 'better', selected: false },
                  { id: 'best', label: '👑 Best - Premium quality', value: 'best', selected: false }
                ]);
                setShowButtons(true);
              }
            }
          }, 500);
          
          // Check if we have brands available to determine next stage
          const hasBrands = topBrands.some(brand => brand.products[firstCategory] && brand.products[firstCategory].length > 0) ||
                           availableBrands.some(brand => brand.products[firstCategory] && brand.products[firstCategory].length > 0);
          if (hasBrands) {
            nextStage = 'paint_brand_selection';
          } else {
            nextStage = 'paint_quality';
            responseContent = `Perfect! Now what paint quality would you like for ${firstCategory}?`;
          }
        } else {
          responseContent = `Perfect! Now what paint quality would you like?`;
          // Show paint quality buttons as fallback
          setTimeout(() => {
            setButtonOptions([
              { id: 'good', label: '💰 Good - Budget-friendly', value: 'good', selected: false },
              { id: 'better', label: '⭐ Better - Mid-range quality', value: 'better', selected: false },
              { id: 'best', label: '👑 Best - Premium quality', value: 'best', selected: false }
            ]);
            setShowButtons(true);
          }, 500);
          nextStage = 'paint_quality';
        }
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
        
        responseContent = `Excellent! Now let's set your profit margin. What markup percentage would you like?`;
        // Show markup buttons
        setTimeout(() => {
          setButtonOptions([
            { id: '10', label: '🎯 10% - Competitive pricing', value: '10%', selected: false },
            { id: '20', label: '⚖️ 20% - Standard profit (recommended)', value: '20%', selected: false },
            { id: '30', label: '📈 30% - Good profit margin', value: '30%', selected: false },
            { id: '40', label: '💎 40% - Premium pricing', value: '40%', selected: false }
          ]);
          setShowButtons(true);
        }, 500);
        nextStage = 'markup_selection';
        break;

      case 'paint_brand_selection':
        // Handle brand selection for current paint category
        if (input.startsWith('brand_')) {
          const parts = input.split('_');
          const selectedBrand = parts[1];
          const category = parts[2];
          
          // Fetch products for this brand and category
          try {
            const response = await fetch('/api/paint-products/brands', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                companyId: companyData.id,
                brand: selectedBrand,
                category: category
              })
            });
            
            if (response.ok) {
              const data = await response.json();
              
              if (data.products && data.products.length > 0) {
                responseContent = `Great choice! Here are the ${selectedBrand} ${category} paint options:\n\nChoose your ${selectedBrand} ${category} paint:`;
                
                // Show product selection buttons
                setTimeout(() => {
                  const productButtons = data.products.map((product: any, index: number) => {
                    const quality = getQualityLevel(product.cost_per_gallon);
                    return {
                      id: `product_${product.id}`,
                      label: `${product.product_name} - $${product.cost_per_gallon}/gal (${quality})`,
                      value: `product_${product.id}_${category}`,
                      selected: false
                    };
                  });
                  setButtonOptions(productButtons);
                  setShowButtons(true);
                }, 500);
                nextStage = 'paint_product_selection';
              } else {
                responseContent = `Sorry, no ${selectedBrand} ${category} paint products found. Let me show you other options.`;
                nextStage = 'paint_quality';
              }
            }
          } catch (error) {
            responseContent = `Error loading ${selectedBrand} products. Let's continue with standard paint quality options.`;
            nextStage = 'paint_quality';
          }
        }
        break;

      case 'paint_product_selection':
        // Handle specific product selection
        if (input.startsWith('product_')) {
          const parts = input.split('_');
          const productId = parts[1];
          const category = parts[2];
          
          // Find the selected product from available brands
          let selectedProduct = null;
          for (const brand of availableBrands) {
            if (brand.products[category]) {
              selectedProduct = brand.products[category].find((p: any) => p.id === productId);
              if (selectedProduct) break;
            }
          }
          
          if (selectedProduct) {
            // Store the selected product
            setSelectedPaintProducts(prev => ({
              ...prev,
              [category]: selectedProduct
            }));
            
            responseContent = `Perfect! Selected ${selectedProduct.product_name} at $${selectedProduct.cost_per_gallon}/gallon for ${category}.\n\nIs this cost correct for ${category} paint?`;
            
            // Show cost validation buttons
            setTimeout(() => {
              setButtonOptions([
                { id: 'cost_correct', label: '✅ Yes, cost is correct', value: `cost_approved_${category}`, selected: false },
                { id: 'cost_adjust', label: '💰 Adjust the cost', value: `cost_adjust_${category}`, selected: false },
                { id: 'choose_different', label: '🔄 Choose different product', value: `choose_different_${category}`, selected: false }
              ]);
              setShowButtons(true);
            }, 500);
            nextStage = 'paint_cost_validation';
          }
        }
        break;

      case 'paint_cost_validation':
        // Handle cost validation responses
        if (input.startsWith('cost_approved_')) {
          const category = input.split('_')[2];
          
          // Move to next paint category or finish paint selection
          const nextCategoryIndex = currentPaintCategoryIndex + 1;
          
          if (nextCategoryIndex < paintSelectionQueue.length) {
            const nextCategory = paintSelectionQueue[nextCategoryIndex];
            setCurrentPaintCategory(nextCategory);
            setCurrentPaintCategoryIndex(nextCategoryIndex);
            
            responseContent = `Great! Now let's select paint for your ${nextCategory}.\n\nWhich paint brand do you prefer for ${nextCategory}?`;
            
            // Show brand selection for next category - prioritize top brands
            setTimeout(() => {
              const topBrandButtons = topBrands
                .filter(brand => brand.products[nextCategory] && brand.products[nextCategory].length > 0)
                .map(brand => ({
                  id: `brand_${brand.brand}`,
                  label: `${getBrandIcon(brand.brand)} ${brand.brand}`,
                  value: `brand_${brand.brand}_${nextCategory}`,
                  selected: false
                }));
              
              if (topBrandButtons.length > 0) {
                setButtonOptions(topBrandButtons);
              } else {
                // Fallback to all brands limited to 3
                const allBrandButtons = availableBrands
                  .filter(brand => brand.products[nextCategory] && brand.products[nextCategory].length > 0)
                  .slice(0, 3)
                  .map(brand => ({
                    id: `brand_${brand.brand}`,
                    label: `${getBrandIcon(brand.brand)} ${brand.brand}`,
                    value: `brand_${brand.brand}_${nextCategory}`,
                    selected: false
                  }));
                setButtonOptions(allBrandButtons);
              }
              setShowButtons(true);
            }, 500);
            nextStage = 'paint_brand_selection';
          } else {
            // All paint categories selected, move to markup
            responseContent = `Excellent! All paint selections complete. Now let's set your profit margin.\n\nWhat markup percentage would you like?`;
            
            setTimeout(() => {
              setButtonOptions([
                { id: '10', label: '🎯 10% - Competitive pricing', value: '10%', selected: false },
                { id: '20', label: '⚖️ 20% - Standard profit (recommended)', value: '20%', selected: false },
                { id: '30', label: '📈 30% - Good profit margin', value: '30%', selected: false },
                { id: '40', label: '💎 40% - Premium pricing', value: '40%', selected: false }
              ]);
              setShowButtons(true);
            }, 500);
            nextStage = 'markup_selection';
          }
        } else if (input.startsWith('cost_adjust_')) {
          const category = input.split('_')[2];
          responseContent = `What should the cost per gallon be for ${category} paint? (Enter just the number, e.g., "45" for $45/gallon)`;
          nextStage = 'paint_cost_adjustment';
        } else if (input.startsWith('choose_different_')) {
          const category = input.split('_')[2];
          responseContent = `Let's choose a different ${category} paint.\n\nWhich brand would you prefer?`;
          
          setTimeout(() => {
            const brandButtons = availableBrands
              .filter(brand => brand.products[category] && brand.products[category].length > 0)
              .map(brand => ({
                id: `brand_${brand.brand}`,
                label: `${getBrandIcon(brand.brand)} ${brand.brand}`,
                value: `brand_${brand.brand}_${category}`,
                selected: false
              }));
            
            setButtonOptions(brandButtons);
            setShowButtons(true);
          }, 500);
          nextStage = 'paint_brand_selection';
        }
        break;

      case 'paint_cost_adjustment':
        // Handle manual cost adjustment
        const costMatch = input.match(/\d+\.?\d*/);
        if (costMatch) {
          const newCost = parseFloat(costMatch[0]);
          const category = currentPaintCategory;
          
          if (selectedPaintProducts[category]) {
            // Update the cost for the selected product
            setSelectedPaintProducts(prev => ({
              ...prev,
              [category]: {
                ...prev[category],
                cost_per_gallon: newCost
              }
            }));
            
            responseContent = `Updated! ${category} paint cost set to $${newCost}/gallon.\n\nShall we continue?`;
            
            setTimeout(() => {
              setButtonOptions([
                { id: 'continue_next', label: '✅ Continue to next paint', value: `cost_approved_${category}`, selected: false },
                { id: 'adjust_again', label: '💰 Adjust cost again', value: `cost_adjust_${category}`, selected: false }
              ]);
              setShowButtons(true);
            }, 500);
            nextStage = 'paint_cost_validation';
          }
        } else {
          responseContent = `Please enter a valid cost (just the number). For example, enter "65" for $65 per gallon.`;
          nextStage = 'paint_cost_adjustment';
        }
        break;

      case 'category_measurement_collection':
        // Collect measurements for the current category
        const category = currentMeasurementCategory;
        
        if (category === 'ceilings') {
          // For ceilings, we might already have room data or need ceiling area
          const ceilingDimensions = parseDimensions(input, quoteData.project_type);
          
          setQuoteData(prev => ({
            ...prev,
            dimensions: { ...prev.dimensions, ...ceilingDimensions }
          }));
          
          if (ceilingDimensions.ceiling_area || ceilingDimensions.floor_area) {
            markCategoryMeasured(category);
            setCurrentPaintCategory(category); // Set for paint selection
            responseContent = `Perfect! Ceiling measurements recorded for ${category}.\n\nNow let's select the paint for your ${category}.`;
            nextStage = 'category_paint_selection';
          } else {
            responseContent = `I need the ceiling area for accurate coverage calculation.\n\nPlease provide: "ceiling area: X sq ft" or "floor area: X sq ft" (I can use floor area to calculate ceiling area).`;
            nextStage = 'category_measurement_collection';
          }
        } else if (category === 'walls') {
          // For walls, we need linear footage and height
          const wallDimensions = parseDimensions(input, quoteData.project_type);
          
          setQuoteData(prev => ({
            ...prev,
            dimensions: { ...prev.dimensions, ...wallDimensions }
          }));
          
          if (wallDimensions.wall_linear_feet && wallDimensions.ceiling_height) {
            markCategoryMeasured(category);
            setCurrentPaintCategory(category); // Set for paint selection
            responseContent = `Perfect! Wall measurements recorded.\n\nNow let's select the paint for your ${category}.`;
            nextStage = 'category_paint_selection';
          } else {
            const missing = [];
            if (!wallDimensions.wall_linear_feet) missing.push('linear footage');
            if (!wallDimensions.ceiling_height) missing.push('ceiling height');
            responseContent = `I still need the ${missing.join(' and ')} for ${category}.\n\nExample: "120 linear feet, 9 foot ceilings"`;
            nextStage = 'category_measurement_collection';
          }
        } else if (['trim', 'doors', 'windows'].includes(category)) {
          // For trim/doors/windows, we need counts
          const doorWindowData = parseDoorsAndWindows(input);
          
          // Convert the parsed data to the expected format
          const dimensionData = {
            number_of_doors: doorWindowData.doors,
            number_of_windows: doorWindowData.windows
          };
          
          setQuoteData(prev => ({
            ...prev,
            dimensions: { ...prev.dimensions, ...dimensionData }
          }));
          
          const hasNeededData = (category === 'doors' && doorWindowData.doors !== undefined && doorWindowData.doors > 0) ||
                               (category === 'windows' && doorWindowData.windows !== undefined && doorWindowData.windows > 0) ||
                               (category === 'trim' && (doorWindowData.doors > 0 || doorWindowData.windows > 0));
          
          if (hasNeededData) {
            markCategoryMeasured(category);
            setCurrentPaintCategory(category); // Set for paint selection
            responseContent = `Perfect! ${category} count recorded.\n\nNow let's select the paint for your ${category}.`;
            nextStage = 'category_paint_selection';
          } else {
            responseContent = `I need the count for ${category}.\n\nExample: "3 doors" or "5 windows" or "3 doors and 5 windows"`;
            nextStage = 'category_measurement_collection';
          }
        }
        break;

      case 'category_paint_selection':
        // Initialize paint selection for the current category
        if (!showPaintBrandSelector && !showPaintProductSelector && !showFavoritePaintSelector) {
          // Use favorites if available, otherwise fall back to brand/product selection
          if (useFavoriteSelector) {
            setShowFavoritePaintSelector(true);
            responseContent = `Perfect! Now choose your paint for **${currentMeasurementCategory}** from your favorites:`;
          } else {
            // Reset paint selection state for new category
            setSelectedBrandForCategory('');
            setAvailableProductsForCategory([]);
            
            // Fetch available brands for this category
            fetch(`/api/paint-products/brands?companyId=${companyData.id}`)
              .then(response => response.json())
              .then(data => {
                if (data.success) {
                  setAvailableBrands(data.brands || []);
                  setTopBrands(data.topBrands || []);
                  setOtherBrands(data.otherBrands || []);
                  setShowPaintBrandSelector(true);
                }
              })
              .catch(error => {
                console.error('Error fetching brands:', error);
              });
            
            responseContent = `Perfect! Now let's select paint for your **${currentMeasurementCategory}**.`;
          }
        }
        break;
        
      case 'markup_selection':
        const markupPercentage = parseMarkupPercentage(input);
        const finalQuoteData = {
          ...quoteData,
          markup_percentage: markupPercentage
        };
        setQuoteData(finalQuoteData);
        
        // Ensure ceiling_area is set (use floor_area if available and ceiling_area not set)
        if (finalQuoteData.dimensions.floor_area && !finalQuoteData.dimensions.ceiling_area) {
          finalQuoteData.dimensions.ceiling_area = finalQuoteData.dimensions.floor_area;
        }
        
        // Calculate the professional quote with markup
        const ceilingsSelected = selectedSurfaces.includes('ceilings');
        const hasAllRequiredData = finalQuoteData.dimensions.wall_linear_feet && 
            finalQuoteData.dimensions.ceiling_height &&
            finalQuoteData.dimensions.number_of_doors !== undefined &&
            finalQuoteData.dimensions.number_of_windows !== undefined &&
            (!ceilingsSelected || (finalQuoteData.dimensions.ceiling_area || finalQuoteData.dimensions.floor_area));
        
        if (hasAllRequiredData) {
          
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
          
          // Show quote with room edit buttons if rooms exist
          if (finalQuoteData.dimensions.rooms && finalQuoteData.dimensions.rooms.length > 0) {
            const quoteWithButtons = generateQuoteDisplayWithButtons(calculation, finalQuoteData.customer_name, finalQuoteData.address, finalQuoteData.dimensions.rooms);
            responseContent = quoteWithButtons.quoteText;
            
            // Show room edit buttons along with standard quote buttons
            setTimeout(() => {
              const quoteButtons = [
                ...quoteWithButtons.roomButtons,
                { id: 'save', label: '💾 Save Quote', value: 'save', selected: false },
                { id: 'adjust_markup', label: '📊 Adjust Markup', value: 'adjust_markup', selected: false },
                { id: 'breakdown', label: '🔍 View Breakdown', value: 'breakdown', selected: false }
              ];
              setButtonOptions(quoteButtons);
              setShowButtons(true);
            }, 500);
          } else {
            responseContent = generateQuoteDisplay(calculation, finalQuoteData.customer_name, finalQuoteData.address, finalQuoteData.dimensions.rooms);
          }
          nextStage = 'quote_review';
        } else {
          responseContent = "I need more information to calculate the quote. Let me ask for the missing details.";
          nextStage = 'dimensions';
        }
        break;

      case 'quote_review':
        // Handle room edit buttons in quote review
        if (input.startsWith('edit_room_')) {
          const roomIndex = parseInt(input.split('_')[2]);
          const roomToEdit = rooms[roomIndex];
          if (roomToEdit) {
            setEditingRoomIndex(roomIndex);
            responseContent = `**Editing ${roomToEdit.name}**\n\nCurrent dimensions: ${roomToEdit.length}' × ${roomToEdit.width}' × ${roomToEdit.height}'\n\nEnter new dimensions:\nLength, width, height (in feet)\n\nExample: "12 by 14, 9 foot ceilings" or "12x14x9"`;
            nextStage = 'edit_room_quote';
          }
          break;
        }
        
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
          try {
            const quoteId = await saveQuote();
            responseContent = `✅ Quote saved successfully!\n\n**Final Details:**\n• Customer: ${quoteData.customer_name}\n• **Customer Price: $${quoteData.calculation!.final_price.toLocaleString()}**\n• Your Cost: $${quoteData.calculation!.total_cost.toLocaleString()}\n• Your Profit: $${quoteData.calculation!.markup_amount.toLocaleString()}\n\nWhat would you like to do next?`;
            
            // Show completion buttons including View Quote
            setTimeout(() => {
              const completionButtons = [
                { id: 'view_quote', label: '👁️ View Quote', value: `view_quote_${quoteId}`, selected: false },
                { id: 'new_quote', label: '➕ Create Another Quote', value: 'another quote', selected: false },
                { id: 'dashboard', label: '📊 Return to Dashboard', value: 'dashboard', selected: false }
              ];
              setButtonOptions(completionButtons);
              setShowButtons(true);
            }, 500);
            nextStage = 'complete';
          } catch (error) {
            responseContent = `❌ There was an error saving the quote. Please try again.`;
            nextStage = 'quote_review';
          }
        } else if (lowerInput.includes('edit') || lowerInput.includes('edit quote')) {
          responseContent = `What would you like to edit?\n\nI can help you modify specific parts of the quote:`;
          
          // Show edit options
          setTimeout(() => {
            setButtonOptions([
              { id: 'edit_customer', label: '👤 Customer Info', value: 'edit_customer_info', selected: false },
              { id: 'edit_dimensions', label: '📏 Dimensions', value: 'edit_dimensions', selected: false },
              { id: 'edit_paint', label: '🎨 Paint Products', value: 'edit_paint_products', selected: false },
              { id: 'edit_markup', label: '💵 Markup & Pricing', value: 'edit_markup', selected: false },
              { id: 'back_to_quote', label: '← Back to Quote', value: 'back_to_quote', selected: false }
            ]);
            setShowButtons(true);
          }, 500);
          nextStage = 'quote_editing';
        } else {
          responseContent = `**Customer Price: $${quoteData.calculation!.final_price.toLocaleString()}** (Your profit: $${quoteData.calculation!.markup_amount.toLocaleString()})\n\nWhat would you like to do?`;
          // Show action buttons
          setTimeout(() => {
            setButtonOptions([
              { id: 'save', label: '💾 Save Quote', value: 'save', selected: false },
              { id: 'adjust_markup', label: '📊 Adjust Markup', value: 'adjust markup', selected: false },
              { id: 'breakdown', label: '🔍 View Breakdown', value: 'breakdown', selected: false },
              { id: 'edit_quote', label: '✏️ Edit Quote', value: 'edit quote', selected: false }
            ]);
            setShowButtons(true);
          }, 500);
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

      case 'quote_editing':
        // Handle quote editing menu selections
        if (input === 'edit_customer_info') {
          responseContent = `Let's update the customer information.\n\nCurrent: ${quoteData.customer_name} at ${quoteData.address}\n\nEnter new customer name and address:`;
          nextStage = 'edit_customer_info';
        } else if (input === 'edit_dimensions') {
          responseContent = `Let's update the project dimensions.\n\nCurrent dimensions:\n• Wall linear feet: ${quoteData.dimensions.wall_linear_feet || 'Not set'}\n• Ceiling height: ${quoteData.dimensions.ceiling_height || 'Not set'}ft\n• Doors: ${quoteData.dimensions.number_of_doors || 0}\n• Windows: ${quoteData.dimensions.number_of_windows || 0}\n\nWhat would you like to change?`;
          
          setTimeout(() => {
            setButtonOptions([
              { id: 'edit_linear_feet', label: '📐 Wall Linear Feet', value: 'edit_wall_linear_feet', selected: false },
              { id: 'edit_ceiling_height', label: '📏 Ceiling Height', value: 'edit_ceiling_height', selected: false },
              { id: 'edit_doors', label: '🚪 Number of Doors', value: 'edit_doors', selected: false },
              { id: 'edit_windows', label: '🪟 Number of Windows', value: 'edit_windows', selected: false },
              { id: 'back_to_edit_menu', label: '← Back to Edit Menu', value: 'back_to_edit_menu', selected: false }
            ]);
            setShowButtons(true);
          }, 500);
          nextStage = 'edit_dimensions_menu';
        } else if (input === 'edit_paint_products') {
          responseContent = `Let's update the paint selections.\n\nCurrent paint products:\n${Object.entries(selectedPaintProducts).map(([category, product]: [string, any]) => 
            `• ${category}: ${product?.product_name || 'Not selected'} - $${product?.cost_per_gallon || 'N/A'}/gal`
          ).join('\n')}\n\nWhich paint category would you like to change?`;
          
          setTimeout(() => {
            const paintButtons = Object.keys(selectedPaintProducts).map(category => ({
              id: `edit_paint_${category}`,
              label: `🎨 ${category.charAt(0).toUpperCase() + category.slice(1)} Paint`,
              value: `edit_paint_${category}`,
              selected: false
            }));
            
            paintButtons.push({ id: 'back_to_edit_menu', label: '← Back to Edit Menu', value: 'back_to_edit_menu', selected: false });
            
            setButtonOptions(paintButtons);
            setShowButtons(true);
          }, 500);
          nextStage = 'edit_paint_menu';
        } else if (input === 'edit_markup') {
          responseContent = `Current markup: ${quoteData.markup_percentage}%\n\nWhat markup percentage would you like?`;
          
          setTimeout(() => {
            setButtonOptions([
              { id: '10', label: '🎯 10% - Competitive pricing', value: '10%', selected: false },
              { id: '20', label: '⚖️ 20% - Standard profit (recommended)', value: '20%', selected: false },
              { id: '30', label: '📈 30% - Good profit margin', value: '30%', selected: false },
              { id: '40', label: '💎 40% - Premium pricing', value: '40%', selected: false }
            ]);
            setShowButtons(true);
          }, 500);
          nextStage = 'markup_adjustment';
        } else if (input === 'back_to_quote') {
          responseContent = `**Customer Price: $${quoteData.calculation!.final_price.toLocaleString()}** (Your profit: $${quoteData.calculation!.markup_amount.toLocaleString()})\n\nWhat would you like to do?`;
          
          setTimeout(() => {
            setButtonOptions([
              { id: 'save', label: '💾 Save Quote', value: 'save', selected: false },
              { id: 'adjust_markup', label: '📊 Adjust Markup', value: 'adjust markup', selected: false },
              { id: 'breakdown', label: '🔍 View Breakdown', value: 'breakdown', selected: false },
              { id: 'edit_quote', label: '✏️ Edit Quote', value: 'edit quote', selected: false }
            ]);
            setShowButtons(true);
          }, 500);
          nextStage = 'quote_review';
        }
        break;

      case 'edit_customer_info':
        // Handle customer info editing
        const newCustomerInfo = parseCustomerInfo(input, quoteData);
        setQuoteData(prev => ({
          ...prev,
          customer_name: newCustomerInfo.customer_name || prev.customer_name,
          address: newCustomerInfo.address || prev.address
        }));
        
        responseContent = `✅ Customer info updated!\n\nNew details: ${newCustomerInfo.customer_name || quoteData.customer_name} at ${newCustomerInfo.address || quoteData.address}\n\nWould you like to edit anything else?`;
        
        setTimeout(() => {
          setButtonOptions([
            { id: 'continue_editing', label: '✏️ Edit More', value: 'edit quote', selected: false },
            { id: 'recalculate', label: '🔄 Recalculate Quote', value: 'recalculate_quote', selected: false },
            { id: 'back_to_quote', label: '← Back to Quote', value: 'back_to_quote', selected: false }
          ]);
          setShowButtons(true);
        }, 500);
        nextStage = 'quote_editing';
        break;

      case 'edit_dimensions_menu':
        // Handle dimension editing menu
        if (input === 'edit_wall_linear_feet') {
          responseContent = `Current wall linear feet: ${quoteData.dimensions.wall_linear_feet || 'Not set'}\n\nEnter new wall linear feet:`;
          nextStage = 'edit_wall_linear_feet';
        } else if (input === 'edit_ceiling_height') {
          responseContent = `Current ceiling height: ${quoteData.dimensions.ceiling_height || 'Not set'} feet\n\nEnter new ceiling height (in feet):`;
          nextStage = 'edit_ceiling_height';
        } else if (input === 'edit_doors') {
          responseContent = `Current number of doors: ${quoteData.dimensions.number_of_doors || 0}\n\nEnter new number of doors:`;
          nextStage = 'edit_doors';
        } else if (input === 'edit_windows') {
          responseContent = `Current number of windows: ${quoteData.dimensions.number_of_windows || 0}\n\nEnter new number of windows:`;
          nextStage = 'edit_windows';
        } else if (input === 'back_to_edit_menu') {
          responseContent = `What would you like to edit?\n\nI can help you modify specific parts of the quote:`;
          
          setTimeout(() => {
            setButtonOptions([
              { id: 'edit_customer', label: '👤 Customer Info', value: 'edit_customer_info', selected: false },
              { id: 'edit_dimensions', label: '📏 Dimensions', value: 'edit_dimensions', selected: false },
              { id: 'edit_paint', label: '🎨 Paint Products', value: 'edit_paint_products', selected: false },
              { id: 'edit_markup', label: '💵 Markup & Pricing', value: 'edit_markup', selected: false },
              { id: 'back_to_quote', label: '← Back to Quote', value: 'back_to_quote', selected: false }
            ]);
            setShowButtons(true);
          }, 500);
          nextStage = 'quote_editing';
        }
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
        
        // Handle View Quote button (format: view_quote_{id})
        if (input.startsWith('view_quote_')) {
          const quoteId = input.replace('view_quote_', '');
          router.push(`/quotes/${quoteId}`);
          return {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Opening quote details...',
            timestamp: new Date().toISOString()
          };
        } else if (lowerInputComplete.includes('another') || lowerInputComplete.includes('new quote')) {
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
        } else if (lowerInputComplete.includes('dashboard')) {
          router.push('/dashboard');
          return {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Returning to dashboard...',
            timestamp: new Date().toISOString()
          };
        } else {
          responseContent = `Thanks for using our quote system! What would you like to do?`;
          // Show completion options (include View Quote if we have a saved quote)
          setTimeout(() => {
            const completionButtons = [];
            if (savedQuoteId) {
              completionButtons.push({ id: 'view_quote', label: '👁️ View Quote', value: `view_quote_${savedQuoteId}`, selected: false });
            }
            completionButtons.push(
              { id: 'new_quote', label: '➕ Create Another Quote', value: 'another quote', selected: false },
              { id: 'dashboard', label: '📊 Return to Dashboard', value: 'dashboard', selected: false }
            );
            setButtonOptions(completionButtons);
            setShowButtons(true);
          }, 500);
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

  const [savedQuoteId, setSavedQuoteId] = useState<string | null>(null);

  const saveQuote = async () => {
    if (!quoteData.calculation || !companyData) return;

    try {
      const calc = quoteData.calculation;
      const dims = quoteData.dimensions;
      
      const url = isEditMode && editQuoteId ? `/api/quotes/${editQuoteId}` : '/api/quotes';
      const method = isEditMode ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method: method,
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
          
          // Room data (if available)
          room_data: dims.rooms ? JSON.stringify(dims.rooms) : null,
          room_count: dims.room_count || null,
          
          // Legacy compatibility fields
          walls_sqft: calc.materials.walls.sqft_needed,
          ceilings_sqft: calc.materials.ceilings.sqft_needed,
          trim_sqft: 0, // Not used in professional calculator
          quote_amount: calc.final_price, // Customer price
          final_price: calc.final_price, // Customer price
          notes: dims.rooms 
            ? `${quoteData.project_type} - ${dims.rooms.length} rooms, total ${calc.materials.ceilings.sqft_needed.toLocaleString()} sqft ceiling, ${dims.number_of_doors} doors, ${dims.number_of_windows} windows`
            : `${quoteData.project_type} - ${dims.wall_linear_feet}LF walls, ${dims.ceiling_height}' high, ${dims.number_of_doors} doors, ${dims.number_of_windows} windows`,
          conversation_summary: JSON.stringify(messages)
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Store the quote ID for the View Quote button
        setSavedQuoteId(result.quote?.id || editQuoteId);
        
        toast({
          title: isEditMode ? "Quote Updated!" : "Quote Saved!",
          description: isEditMode 
            ? `Quote #${editQuoteId} has been updated successfully.`
            : `Professional quote ${result.quoteId || result.quote?.id} saved successfully.`,
        });
        
        return result.quote?.id || editQuoteId; // Return the quote ID for immediate use
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
      throw error; // Re-throw to handle in the calling function
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

  // Show loading UI during initialization
  if (isInitializing) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        <header className="bg-white border-b shadow-sm">
          <div className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard")}
                className="w-10 h-10 hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Create Quote</h1>
            </div>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center gap-2 justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                Loading Quote System
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  {loadingProgress < 30 && "Authenticating..."}
                  {loadingProgress >= 30 && loadingProgress < 70 && "Loading company settings..."}
                  {loadingProgress >= 70 && loadingProgress < 90 && "Preparing paint data..."}
                  {loadingProgress >= 90 && "Finalizing..."}
                </p>
                
                {initializationError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{initializationError}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 text-center">
                Optimized batch loading for 60% faster initialization
              </div>
            </CardContent>
          </Card>
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
                <h1 className="text-lg font-semibold">{isEditMode ? 'Edit Quote' : 'Create Quote'}</h1>
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
                <div className="whitespace-pre-wrap text-sm" dangerouslySetInnerHTML={{
                  __html: renderMarkdown(message.content)
                }}>
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

          {/* Progressive Estimate Display */}
          {currentEstimate && showEstimate && !isThinking && (
            <div className="flex justify-center">
              <ProgressiveEstimateDisplay
                estimate={currentEstimate}
                isVisible={true}
                onEstimateClick={() => {
                  // Add estimate details to chat
                  const estimateMessage = generateEstimateMessage(currentEstimate);
                  const newMessage: Message = {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: `## Current Estimate\n\n${estimateMessage}\n\n*This estimate updates automatically as you provide more details.*`,
                    timestamp: new Date().toISOString()
                  };
                  setMessages(prev => [...prev, newMessage]);
                }}
              />
            </div>
          )}
          
          {isThinking && (
            <div className="flex gap-3 justify-start">
              <div className="bg-white border p-4 rounded-lg rounded-bl-sm shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          {isLoading && !isThinking && (
            <div className="flex gap-3 justify-start">
              <div className="bg-white border p-4 rounded-lg rounded-bl-sm shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-500">Calculating...</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Buttons */}
          {showButtons && buttonOptions.length > 0 && (
            <div className="flex gap-3 justify-start">
              <div className="max-w-[80%] p-4 bg-white border rounded-lg rounded-bl-sm shadow-sm">
                <p className="text-sm text-gray-600 mb-3">Choose an option:</p>
                <div className="flex flex-wrap gap-2">
                  {buttonOptions.map((option) => (
                    <Button
                      key={option.id}
                      onClick={() => handleButtonClick(option.value, option.label)}
                      variant={option.selected ? "default" : "outline"}
                      className={cn(
                        "text-sm transition-colors",
                        option.selected 
                          ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600" 
                          : "hover:bg-blue-50 hover:border-blue-300"
                      )}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Paint Brand Selector */}
          {showPaintBrandSelector && (
            <div className="flex gap-3 justify-start">
              <div className="max-w-[90%] p-4 bg-white border rounded-lg rounded-bl-sm shadow-sm">
                <PaintBrandSelector
                  brands={availableBrands}
                  topBrands={topBrands}
                  otherBrands={otherBrands}
                  category={currentMeasurementCategory}
                  onBrandSelect={handleBrandSelect}
                  selectedBrand={selectedBrandForCategory}
                />
              </div>
            </div>
          )}

          {/* Paint Product Selector */}
          {showPaintProductSelector && (
            <div className="flex gap-3 justify-start">
              <div className="max-w-[90%] p-4 bg-white border rounded-lg rounded-bl-sm shadow-sm">
                <PaintProductSelector
                  products={availableProductsForCategory}
                  brand={selectedBrandForCategory}
                  category={currentMeasurementCategory}
                  onProductSelect={handleProductSelect}
                  selectedProduct={selectedPaintProducts[currentMeasurementCategory]}
                />
              </div>
            </div>
          )}

          {/* Favorite Paint Selector */}
          {showFavoritePaintSelector && companyData && (
            <div className="flex gap-3 justify-start">
              <div className="max-w-[90%] p-4 bg-white border rounded-lg rounded-bl-sm shadow-sm">
                <FavoritePaintSelector
                  category={currentMeasurementCategory}
                  projectType={quoteData.project_type}
                  companyId={companyData.id}
                  onProductSelect={handleFavoriteProductSelect}
                  selectedProduct={selectedPaintProducts[currentMeasurementCategory]}
                />
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
              disabled={isLoading || isThinking}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading || isThinking}
              size="icon"
              className="shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Estimate Widget */}
      {currentEstimate && !showEstimate && (
        <FloatingEstimateWidget
          estimate={currentEstimate}
          isVisible={true}
          onToggle={() => setShowEstimate(true)}
        />
      )}
    </div>
  );
}

export default function CreateQuotePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CreateQuotePageContent />
    </Suspense>
  );
}