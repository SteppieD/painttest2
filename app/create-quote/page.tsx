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
  generateFollowUpQuestion,
  generateQuoteDisplay,
  ConversationData
} from "@/lib/improved-conversation-parser";
import { Room, calculateRoomAreas, calculateTotalAreasFromRooms } from "@/lib/professional-quote-calculator";

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
      
      // Load quote data if in edit mode
      if (editQuoteId) {
        loadQuoteForEdit(editQuoteId);
      }
    } catch (e) {
      localStorage.removeItem("paintquote_company");
      router.push("/access-code");
    }
  }, [router, editQuoteId]);

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

  const loadQuoteForEdit = async (quoteId: string) => {
    try {
      setIsEditMode(true);
      const response = await fetch(`/api/quotes/${quoteId}`);
      const quote = await response.json();
      
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
    } catch (error) {
      console.error('Failed to load quote for editing:', error);
      toast({
        title: "Error",
        description: "Failed to load quote. Starting fresh quote instead.",
        variant: "destructive",
      });
    }
  };

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
    setIsLoading(true);

    try {
      const aiResponse = await processUserInput(buttonValue, conversationStage);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error processing button click:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

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
        responseContent = `Perfect! Now I have ${input.trim()} at ${quoteData.address}.\n\nWhat type of painting work are we quoting?`;
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
          responseContent = `Perfect! For ${projectType} painting, I can calculate this two ways:\n\n**Option 1:** Quick estimate using total linear feet\n**Option 2:** Room-by-room measurements (more accurate for ceilings)\n\nWhich would you prefer?`;
          // Show measurement method buttons
          setTimeout(() => {
            setConversationStage('measurement_method');
            setButtonOptions([
              { id: 'quick', label: '⚡ Quick Estimate', value: 'quick', selected: false },
              { id: 'room_by_room', label: '🏠 Room-by-Room', value: 'room_by_room', selected: false }
            ]);
            setShowButtons(true);
          }, 500);
        } else {
          responseContent = `Great! For exterior painting, what surfaces do you want to include?`;
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
        nextStage = projectType === 'exterior' ? 'surface_selection' : 'measurement_method';
        break;

      case 'measurement_method':
        if (input === 'room_by_room') {
          setUseRoomByRoom(true);
          responseContent = `Great choice! Room-by-room measurements give us precise ceiling areas.\n\nHow many rooms need ceiling painting?`;
          setTimeout(() => {
            setButtonOptions([
              { id: '1', label: '1 Room', value: '1', selected: false },
              { id: '2', label: '2 Rooms', value: '2', selected: false },
              { id: '3', label: '3 Rooms', value: '3', selected: false },
              { id: '4', label: '4 Rooms', value: '4', selected: false },
              { id: '5', label: '5 Rooms', value: '5', selected: false },
              { id: 'custom', label: 'More than 5', value: 'custom', selected: false }
            ]);
            setShowButtons(true);
          }, 500);
          nextStage = 'room_count';
        } else {
          setUseRoomByRoom(false);
          const surfaceList = selectedSurfaces.length > 0 ? selectedSurfaces.join(', ') : 'selected surfaces';
          responseContent = `Perfect! For ${surfaceList} using quick estimates, I need the dimensions:\n\n• **Wall linear footage** (perimeter of walls to be painted)\n• **Ceiling height** (in feet)\n• **Floor area** (total house square footage)\n\nFor example: "120 linear feet, 9 foot ceilings, 1200 sqft house"`;
          nextStage = 'dimensions';
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
          responseContent = `Perfect! Let's measure ${count} rooms.\n\n**Room 1:** What are the dimensions?\nPlease provide: length, width, height (in feet)\n\nExample: "12 by 14, 9 foot ceilings" or "12x14x9"`;
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
          responseContent = `Perfect! Let's measure ${customCount} rooms.\n\n**Room 1:** What are the dimensions?\nPlease provide: length, width, height (in feet)\n\nExample: "12 by 14, 9 foot ceilings" or "12x14x9"`;
          nextStage = 'room_dimensions';
        } else {
          responseContent = `Please enter a valid number of rooms.`;
          nextStage = 'room_count_custom';
        }
        break;

      case 'room_dimensions':
        const roomName = `Room ${currentRoomIndex + 1}`;
        const parsedRoom = parseRoomData(input, roomName);
        
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
            responseContent = `Great! Room ${currentRoomIndex + 1}: ${parsedRoom.length}' × ${parsedRoom.width}' × ${parsedRoom.height}' (${completeRoom.ceiling_area} sqft ceiling)\n\n**Room ${currentRoomIndex + 2}:** What are the dimensions?\nLength, width, height (in feet)`;
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
                wall_linear_feet: roomTotals.wall_linear_feet,
                ceiling_height: updatedRooms[0]?.height || 9, // Use first room's height as reference
                number_of_doors: roomTotals.total_doors,
                number_of_windows: roomTotals.total_windows
              }
            }));
            
            responseContent = `Excellent! Here's your room summary:\n\n${generateRoomSummary(updatedRooms)}\n\nNow what paint quality would you like?`;
            
            // Show paint quality buttons
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
          responseContent = `I need the room dimensions. Please provide length, width, and height.\n\nExample: "12 by 14, 9 foot ceilings" or "12x14x9"`;
          nextStage = 'room_dimensions';
        }
        break;

      case 'surface_selection':
        // Handle continue to dimensions (surface selection is now handled in handleButtonClick)
        if (input === 'continue' || input.toLowerCase().includes('continue')) {
          const surfaceList = selectedSurfaces.length > 0 ? selectedSurfaces.join(', ') : 'selected surfaces';
          
          // Check if ceilings are selected for interior projects - offer measurement method choice
          if (quoteData.project_type === 'interior' && selectedSurfaces.includes('ceilings')) {
            responseContent = `Perfect! I see you selected ceiling painting.\n\nFor the most accurate quote, how would you like to measure the ceilings?`;
            setTimeout(() => {
              setButtonOptions([
                { id: 'quick', label: '🚀 Quick Estimate', value: 'quick_estimate', selected: false },
                { id: 'detailed', label: '📏 Room-by-Room (More Accurate)', value: 'room_by_room', selected: false }
              ]);
              setShowButtons(true);
            }, 500);
            nextStage = 'measurement_method';
          } else if (quoteData.project_type === 'interior') {
            responseContent = `Perfect! For ${surfaceList}, I need the dimensions:\n\n• **Wall linear footage** (perimeter of walls to be painted)\n• **Ceiling height** (in feet)\n• **Floor area** (total house square footage)\n\nFor example: "120 linear feet, 9 foot ceilings, 1200 sqft house"`;
            nextStage = 'dimensions';
          } else {
            responseContent = `Perfect! For ${surfaceList}, I need the dimensions:\n\n• **Total area** to be painted (square footage)\n• **Number of stories**\n\nFor example: "2500 sqft siding, 2 story home"`;
            nextStage = 'dimensions';
          }
        } else {
          // Handle text input during surface selection
          responseContent = `Please use the buttons above to select surfaces, then click "Continue to Dimensions" when ready.`;
          nextStage = 'surface_selection';
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
          updatedDimensions.ceiling_height && 
          (quoteData.project_type === 'exterior' || updatedDimensions.floor_area || updatedDimensions.ceiling_area);
        
        if (hasRequiredDimensions) {
          responseContent = `Excellent! Now I need to count the doors and windows:\n\n• How many **doors** need painting?\n• How many **windows** need painting?\n\nFor example: "3 doors and 5 windows" or "2 doors, no windows"`;
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
        
        responseContent = `Perfect! Now what paint quality would you like?`;
        // Show paint quality buttons
        setTimeout(() => {
          setButtonOptions([
            { id: 'good', label: '💰 Good - Budget-friendly', value: 'good', selected: false },
            { id: 'better', label: '⭐ Better - Mid-range quality', value: 'better', selected: false },
            { id: 'best', label: '👑 Best - Premium quality', value: 'best', selected: false }
          ]);
          setShowButtons(true);
        }, 500);
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
        if (finalQuoteData.dimensions.wall_linear_feet && 
            finalQuoteData.dimensions.ceiling_height &&
            (finalQuoteData.dimensions.ceiling_area || finalQuoteData.dimensions.floor_area) &&
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
          responseContent = generateQuoteDisplay(calculation, finalQuoteData.customer_name, finalQuoteData.address, finalQuoteData.dimensions.rooms);
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
          responseContent = `✅ Quote saved successfully!\n\n**Final Details:**\n• Customer: ${quoteData.customer_name}\n• **Customer Price: $${quoteData.calculation!.final_price.toLocaleString()}**\n• Your Cost: $${quoteData.calculation!.total_cost.toLocaleString()}\n• Your Profit: $${quoteData.calculation!.markup_amount.toLocaleString()}\n\nWhat would you like to do next?`;
          // Show completion buttons
          setTimeout(() => {
            setButtonOptions([
              { id: 'new_quote', label: '➕ Create Another Quote', value: 'another quote', selected: false },
              { id: 'dashboard', label: '📊 Return to Dashboard', value: 'dashboard', selected: false }
            ]);
            setShowButtons(true);
          }, 500);
          nextStage = 'complete';
        } else {
          responseContent = `**Customer Price: $${quoteData.calculation!.final_price.toLocaleString()}** (Your profit: $${quoteData.calculation!.markup_amount.toLocaleString()})\n\nWhat would you like to do?`;
          // Show action buttons
          setTimeout(() => {
            setButtonOptions([
              { id: 'save', label: '💾 Save Quote', value: 'save', selected: false },
              { id: 'adjust_markup', label: '📊 Adjust Markup', value: 'adjust markup', selected: false },
              { id: 'breakdown', label: '🔍 View Breakdown', value: 'breakdown', selected: false }
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
          // Show completion options
          setTimeout(() => {
            setButtonOptions([
              { id: 'new_quote', label: '➕ Create Another Quote', value: 'another quote', selected: false },
              { id: 'dashboard', label: '📊 Return to Dashboard', value: 'dashboard', selected: false }
            ]);
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
        toast({
          title: isEditMode ? "Quote Updated!" : "Quote Saved!",
          description: isEditMode 
            ? `Quote #${editQuoteId} has been updated successfully.`
            : `Professional quote ${result.quoteId || result.quote?.id} saved successfully.`,
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