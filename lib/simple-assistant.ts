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

interface ConversationContext {
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

  // Check if user wants to start a new quote
  if ((lowerMessage.includes('another') || lowerMessage.includes('new') || lowerMessage.includes('yes')) 
      && Object.keys(context).length > 0 && context.clientName) {
    // Reset context and start fresh
    return {
      extractedInfo: {},
      nextQuestion: "What's the client's name and address?",
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

export function calculateSimpleQuote(context: ConversationContext): {
  total: number;
  breakdown: {
    labor: number;
    materials: number;
    prepWork: number;
    markup: number;
  };
} {
  const sqft = context.sqft || 1000;
  
  // Base rates per square foot
  const baseRates = {
    basic: { interior: 1.75, exterior: 2.45 },
    premium: { interior: 3.25, exterior: 4.55 },
    luxury: { interior: 5.25, exterior: 7.35 }
  };

  const paintType = context.paintQuality || 'premium';
  const projectType = context.projectType || 'interior';
  
  // Calculate base cost
  let baseCost = 0;
  if (projectType === 'both') {
    baseCost = (baseRates[paintType].interior * sqft * 0.6) + 
               (baseRates[paintType].exterior * sqft * 0.4);
  } else {
    baseCost = baseRates[paintType][projectType] * sqft;
  }

  // Always include standard prep work in base pricing
  const prepMultiplier = 1.25;
  const prepCost = baseCost * (prepMultiplier - 1);

  // Timeline multipliers
  const timelineMultipliers = {
    rush: 1.35,
    standard: 1.0,
    flexible: 0.95
  };

  const timelineMultiplier = timelineMultipliers[context.timeline || 'standard'];

  // Calculate components
  const materials = baseCost * 0.35;
  const labor = baseCost * 0.45;
  const subtotal = baseCost + prepCost;
  const markup = subtotal * 0.2;
  const total = (subtotal + markup) * timelineMultiplier;

  return {
    total: Math.round(total),
    breakdown: {
      labor: Math.round(labor),
      materials: Math.round(materials),
      prepWork: Math.round(prepCost),
      markup: Math.round(markup)
    }
  };
}