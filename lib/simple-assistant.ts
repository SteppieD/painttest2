// Simple conversational assistant for quick quote generation

// Fuzzy matching for common misspellings
const fuzzyMatch = {
  paintQuality: {
    'lucury': 'luxury',
    'luxery': 'luxury',
    'premum': 'premium',
    'premiem': 'premium',
    'baisic': 'basic',
    'basik': 'basic',
    'economy': 'basic',
    'standard': 'premium',
    'high-end': 'luxury',
    'high end': 'luxury'
  },
  projectType: {
    'intrior': 'interior',
    'interor': 'interior',
    'inside': 'interior',
    'exteror': 'exterior',
    'exterier': 'exterior',
    'outside': 'exterior',
    'both': 'both',
    'inside and outside': 'both',
    'interior and exterior': 'both'
  }
};

function fuzzyMatchTerm(input: string, category: 'paintQuality' | 'projectType'): string | null {
  const lower = input.toLowerCase();
  const matches = fuzzyMatch[category];
  
  // Check exact matches first
  for (const [key, value] of Object.entries(matches)) {
    if (lower.includes(key)) {
      return value as string;
    }
  }
  
  // Check if the correct term is already there
  const validTerms = category === 'paintQuality' 
    ? ['basic', 'premium', 'luxury']
    : ['interior', 'exterior', 'both'];
    
  for (const term of validTerms) {
    if (lower.includes(term)) {
      return term;
    }
  }
  
  return null;
}

export interface ConversationContext {
  clientName?: string;
  address?: string;
  projectType?: 'interior' | 'exterior' | 'both';
  sqft?: number;
  paintQuality?: 'basic' | 'premium' | 'luxury';
  timeline?: 'rush' | 'standard' | 'flexible';
  quoteType?: 'quick' | 'advanced';
  rooms?: string[];
}

export function parseMessage(message: string, context: ConversationContext): {
  extractedInfo: Partial<ConversationContext>;
  nextQuestion: string;
  isComplete: boolean;
} {
  const lowerMessage = message.toLowerCase();
  const extractedInfo: Partial<ConversationContext> = {};
  let nextQuestion = '';
  let isComplete = false;

  // Check if user wants to start a new quote (but not if asking about details)
  if ((lowerMessage.includes('another') || (lowerMessage.includes('new') && !lowerMessage.includes('view'))) 
      && Object.keys(context).length > 0 && context.clientName 
      && !lowerMessage.includes('detail') && !lowerMessage.includes('breakdown') 
      && !lowerMessage.includes('how') && !lowerMessage.includes('what')) {
    // Reset context and start fresh
    return {
      extractedInfo: {},
      nextQuestion: "What's the client's name and address?",
      isComplete: false
    };
  }

  // Check if user is asking about quote details after completion
  if (context.clientName && context.sqft && context.paintQuality && 
      (lowerMessage.includes('detail') || lowerMessage.includes('breakdown') || 
       lowerMessage.includes('labour') || lowerMessage.includes('labor') || 
       lowerMessage.includes('material') || lowerMessage.includes('paint') ||
       lowerMessage.includes('how did you') || lowerMessage.includes('what is'))) {
    return {
      extractedInfo: {},
      nextQuestion: 'PROVIDE_BREAKDOWN', // Special flag for breakdown
      isComplete: false
    };
  }

  // Try to extract all information from a single message
  // Example: "John Smith at 123 Main St, interior 2000 sqft, premium paint, standard prep, flexible timeline"
  
  // Extract client name and address
  if (!context.clientName || !context.address) {
    // Look for patterns like "Name at Address" or "Name, Address"
    const nameAddressMatch = message.match(/^([^,@]+?)(?:\s+at\s+|\s*,\s*)(.+?)(?:\.|,|$)/i);
    if (nameAddressMatch) {
      extractedInfo.clientName = nameAddressMatch[1].trim();
      extractedInfo.address = nameAddressMatch[2].trim();
    } else if (!context.clientName) {
      // Assume first part is name if no pattern matches
      const words = message.split(' ');
      if (words.length >= 2) {
        extractedInfo.clientName = message;
      }
    }
  }

  // Extract project type with fuzzy matching
  if (!context.projectType) {
    const projectType = fuzzyMatchTerm(message, 'projectType');
    if (projectType) {
      extractedInfo.projectType = projectType as 'interior' | 'exterior' | 'both';
    }
  }

  // Extract square footage
  if (!context.sqft) {
    const sqftMatch = message.match(/(\d{3,5})\s*(?:sq\s*ft|sqft|square feet|sf)/i);
    if (sqftMatch) {
      extractedInfo.sqft = parseInt(sqftMatch[1]);
    } else {
      const numberMatch = message.match(/\b(\d{3,5})\b/);
      if (numberMatch && !extractedInfo.address) { // Don't confuse with address numbers
        extractedInfo.sqft = parseInt(numberMatch[1]);
      }
    }
  }

  // Extract paint quality with fuzzy matching
  if (!context.paintQuality) {
    const paintQuality = fuzzyMatchTerm(message, 'paintQuality');
    if (paintQuality) {
      extractedInfo.paintQuality = paintQuality as 'basic' | 'premium' | 'luxury';
    }
  }

  // Only extract prep work if user mentions unusual conditions
  // Default to standard prep work included in base pricing

  // Extract timeline
  if (!context.timeline) {
    if (lowerMessage.includes('rush') || lowerMessage.includes('asap') || lowerMessage.includes('urgent')) {
      extractedInfo.timeline = 'rush';
    } else if (lowerMessage.includes('flexible') || lowerMessage.includes('no rush')) {
      extractedInfo.timeline = 'flexible';
    } else if (lowerMessage.includes('standard') || lowerMessage.includes('normal')) {
      extractedInfo.timeline = 'standard';
    }
  }

  // Update context with extracted info
  const updatedContext = { ...context, ...extractedInfo };

  // First, check if this is the start and ask about quote type
  if (!updatedContext.quoteType && updatedContext.clientName && updatedContext.address) {
    // Extract quote type preference
    if (lowerMessage.includes('quick') || lowerMessage.includes('basic estimate')) {
      extractedInfo.quoteType = 'quick';
      updatedContext.quoteType = 'quick';
    } else if (lowerMessage.includes('advanced') || lowerMessage.includes('detailed')) {
      extractedInfo.quoteType = 'advanced';
      updatedContext.quoteType = 'advanced';
    }
  }

  // Determine next question based on what's missing
  if (!updatedContext.clientName) {
    nextQuestion = "What's the client's name?";
  } else if (!updatedContext.address) {
    nextQuestion = `Got it, ${updatedContext.clientName}. What's the address?`;
  } else if (!updatedContext.quoteType) {
    nextQuestion = "Would you like a Quick quote (basic estimate) or Advanced quote (detailed breakdown)?";
  } else if (!updatedContext.projectType) {
    nextQuestion = "Interior or exterior painting?";
  } else if (!updatedContext.sqft) {
    nextQuestion = "How many square feet?";
  } else if (!updatedContext.paintQuality) {
    nextQuestion = "Basic, premium, or luxury paint?";
  } else if (!updatedContext.timeline && updatedContext.quoteType === 'advanced') {
    nextQuestion = "When do they need it done?";
  } else {
    isComplete = true;
    nextQuestion = '';
  }

  return {
    extractedInfo,
    nextQuestion,
    isComplete
  };
}

export function calculateSimpleQuote(context: ConversationContext, settings?: any): {
  total: number;
  breakdown: {
    paint: number;
    sundries: number;
    labor: number;
    materials: number;
    prepWork: number;
    markup: number;
  };
  subtotal: number;
  tax: number;
  needsMarkupConfirmation?: boolean;
} {
  const sqft = context.sqft || 1000;
  
  // Paint costs per gallon (based on quality)
  const paintCostsPerGallon = {
    basic: 22,
    premium: 28,
    luxury: 45
  };
  
  const paintQuality = context.paintQuality || 'premium';
  const paintCost = paintCostsPerGallon[paintQuality];
  const coverage = settings?.default_paint_coverage || 350;
  
  // Calculate paint needs
  const gallonsNeeded = Math.ceil(sqft / coverage);
  const totalPaintCost = gallonsNeeded * paintCost;
  
  // Calculate sundries (12% of paint cost by default)
  const sundriesPercentage = settings?.default_sundries_percentage || 12;
  const sundriesCost = totalPaintCost * (sundriesPercentage / 100);
  
  // Total materials
  const totalMaterials = totalPaintCost + sundriesCost;
  
  // Calculate labor (45% of base revenue)
  const baseRevenue = sqft * 2.5; // Base calculation rate
  const laborPercentage = settings?.default_labor_percentage || 45;
  const laborCost = baseRevenue * (laborPercentage / 100);
  
  // Prep work is included in labor/sundries now
  const prepCost = 0;
  
  // Subtotal before markup
  const subtotal = totalMaterials + laborCost;
  
  // Default markup (will be confirmed via popup)
  const defaultMarkup = settings?.default_markup_percentage || 20;
  const markupAmount = subtotal * (defaultMarkup / 100);
  
  // Calculate tax
  const taxRate = settings?.tax_rate || 0;
  const taxOnMaterialsOnly = settings?.tax_on_materials_only || false;
  const taxableAmount = taxOnMaterialsOnly ? totalMaterials : (subtotal + markupAmount);
  const taxAmount = taxableAmount * (taxRate / 100);
  
  // Timeline adjustment
  const timelineMultipliers = {
    rush: 1.15,
    standard: 1.0,
    flexible: 0.95
  };
  const timelineMultiplier = timelineMultipliers[context.timeline || 'standard'];
  
  // Final total
  const finalTotal = (subtotal + markupAmount + taxAmount) * timelineMultiplier;

  return {
    total: Math.round(finalTotal),
    breakdown: {
      paint: Math.round(totalPaintCost),
      sundries: Math.round(sundriesCost),
      labor: Math.round(laborCost),
      materials: Math.round(totalMaterials),
      prepWork: Math.round(prepCost),
      markup: Math.round(markupAmount)
    },
    subtotal: Math.round(subtotal),
    tax: Math.round(taxAmount),
    needsMarkupConfirmation: true
  };
}