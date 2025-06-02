// Simple conversational assistant for quick quote generation

interface ConversationContext {
  clientName?: string;
  address?: string;
  projectType?: 'interior' | 'exterior' | 'both';
  sqft?: number;
  paintQuality?: 'basic' | 'premium' | 'luxury';
  prepWork?: 'minimal' | 'standard' | 'extensive';
  timeline?: 'rush' | 'standard' | 'flexible';
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

  // Extract project type
  if (!context.projectType) {
    if (lowerMessage.includes('interior') && lowerMessage.includes('exterior')) {
      extractedInfo.projectType = 'both';
    } else if (lowerMessage.includes('interior') || lowerMessage.includes('inside')) {
      extractedInfo.projectType = 'interior';
    } else if (lowerMessage.includes('exterior') || lowerMessage.includes('outside')) {
      extractedInfo.projectType = 'exterior';
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

  // Extract paint quality
  if (!context.paintQuality) {
    if (lowerMessage.includes('basic') || lowerMessage.includes('economy')) {
      extractedInfo.paintQuality = 'basic';
    } else if (lowerMessage.includes('premium') || lowerMessage.includes('quality')) {
      extractedInfo.paintQuality = 'premium';
    } else if (lowerMessage.includes('luxury') || lowerMessage.includes('high-end')) {
      extractedInfo.paintQuality = 'luxury';
    }
  }

  // Extract prep work
  if (!context.prepWork) {
    if (lowerMessage.includes('minimal prep') || lowerMessage.includes('light prep')) {
      extractedInfo.prepWork = 'minimal';
    } else if (lowerMessage.includes('extensive prep') || lowerMessage.includes('heavy prep')) {
      extractedInfo.prepWork = 'extensive';
    } else if (lowerMessage.includes('standard prep') || lowerMessage.includes('normal prep')) {
      extractedInfo.prepWork = 'standard';
    }
  }

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

  // Determine next question based on what's missing
  if (!updatedContext.clientName) {
    nextQuestion = "What's the client's name?";
  } else if (!updatedContext.address) {
    nextQuestion = `Got it, ${updatedContext.clientName}. What's the address?`;
  } else if (!updatedContext.projectType) {
    nextQuestion = "Interior or exterior painting?";
  } else if (!updatedContext.sqft) {
    nextQuestion = "How many square feet?";
  } else if (!updatedContext.paintQuality) {
    nextQuestion = "Basic, premium, or luxury paint?";
  } else if (!updatedContext.prepWork) {
    nextQuestion = "How much prep work needed?";
  } else if (!updatedContext.timeline) {
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

  // Prep work multipliers
  const prepMultipliers = {
    minimal: 1.1,
    standard: 1.25,
    extensive: 1.5
  };

  const prepMultiplier = prepMultipliers[context.prepWork || 'standard'];
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