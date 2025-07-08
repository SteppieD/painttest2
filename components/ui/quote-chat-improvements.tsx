// Simple improvements to the quote chat interface
// This file contains CSS classes and simple components to improve the chat UI

export const chatStyles = {
  // User message styling - better contrast
  userMessage: "bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-sm shadow-md",
  
  // Assistant message styling - clean cards
  assistantMessage: "bg-white border border-gray-200 rounded-2xl rounded-bl-sm shadow-sm",
  
  // Message container with avatars
  messageContainer: "flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
  
  // Avatar styles
  userAvatar: "w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 flex-shrink-0 mt-1",
  assistantAvatar: "w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0 mt-1",
  
  // Enhanced input area
  inputContainer: "bg-white rounded-lg border shadow-sm p-3",
  
  // Progress bar container
  progressContainer: "bg-white border-b px-4 py-2",
  
  // Quick action buttons
  quickActionButton: "h-7 text-xs gap-1 hover:bg-blue-50 hover:border-blue-300",
  
  // Quote display cards
  quoteCard: "p-3 border rounded-lg",
  quoteTotalCard: "bg-blue-50 border-blue-200",
  quoteProfitCard: "bg-green-50 border-green-200",
  
  // Rate display
  rateItem: "flex items-center justify-between p-2 bg-gray-50 rounded-lg",
  
  // Help panel
  helpPanel: "absolute bottom-full right-0 mb-2 w-80 p-4 bg-white border rounded-lg shadow-lg"
};

// Simple markdown renderer that handles ** for bold
export const renderMarkdown = (text: string): string => {
  // Handle bold text
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
  
  // Handle line breaks
  text = text.replace(/\n/g, '<br />');
  
  // Handle bullet points
  text = text.replace(/^• /gm, '<span class="inline-block w-4">•</span>');
  
  return text;
};

// Helper to get stage labels
export const getStageLabel = (stage: string): string => {
  const labels: { [key: string]: string } = {
    'customer_info': 'Customer Information',
    'project_type': 'Project Type',
    'measurements': 'Measurements',
    'wall_measurements': 'Wall Measurements',
    'ceiling_measurements': 'Ceiling Measurements',
    'trim_measurements': 'Trim & Details',
    'paint_product_selection': 'Paint Selection',
    'paint_product_confirmation': 'Confirm Paint',
    'rate_confirmation': 'Review Rates',
    'quote_review': 'Quote Review',
    'adjustments': 'Adjustments',
    'complete': 'Complete',
    'clarification': 'Clarification Needed'
  };
  return labels[stage] || stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Helper to get progress percentage
export const getProgressPercentage = (stage: string): number => {
  const stages = [
    'customer_info',
    'project_type',
    'measurements',
    'paint_product_selection',
    'rate_confirmation',
    'quote_review',
    'complete'
  ];
  const currentIndex = stages.indexOf(stage);
  return currentIndex === -1 ? 0 : ((currentIndex + 1) / stages.length) * 100;
};

// Quick actions based on stage
export const getQuickActions = (stage: string) => {
  switch (stage) {
    case 'customer_info':
      return [
        { label: "Full Example", value: "John Smith at 123 Main St, Springfield" }
      ];
    
    case 'project_type':
      return [
        { label: "Interior", value: "interior" },
        { label: "Exterior", value: "exterior" },
        { label: "Both", value: "both" }
      ];
    
    case 'measurements':
      return [
        { label: "Example", value: "500 sqft walls, 300 sqft ceilings" }
      ];
    
    case 'rate_confirmation':
      return [
        { label: "Adjust Walls", value: "walls to $2.00" },
        { label: "Adjust Ceilings", value: "ceilings to $1.75" },
        { label: "Looks Good", value: "looks good" }
      ];
    
    case 'quote_review':
      return [
        { label: "See Breakdown", value: "breakdown" },
        { label: "Save Quote", value: "save" },
        { label: "Adjust", value: "adjust rates" }
      ];
    
    default:
      return [];
  }
};

// Input placeholders by stage
export const getInputPlaceholder = (stage: string): string => {
  const placeholders: { [key: string]: string } = {
    'customer_info': 'Enter customer name and address (e.g., "John Smith at 123 Main St")',
    'project_type': 'Select project type: interior, exterior, or both',
    'measurements': 'Enter measurements (e.g., "500 sqft walls, 300 sqft ceilings")',
    'wall_measurements': 'Enter wall measurements (e.g., "500 linear feet" or "1200 sqft")',
    'ceiling_measurements': 'Enter ceiling square footage',
    'trim_measurements': 'Enter trim sqft or door/window count',
    'paint_product_selection': 'Choose a paint product by number or name',
    'rate_confirmation': 'Adjust rates or say "looks good" to continue',
    'quote_review': 'Say "save" to finalize or "adjust" to modify',
    'complete': 'Say "another quote" or "dashboard" to continue'
  };
  return placeholders[stage] || 'Type your message...';
};