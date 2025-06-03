// Enhanced conversational assistant with better pattern matching
import { ConversationContext, calculateSimpleQuote } from './simple-assistant';

export function enhancedParseMessage(message: string, context: ConversationContext): {
  extractedInfo: Partial<ConversationContext>;
  nextQuestion: string;
  isComplete: boolean;
} {
  const lowerMessage = message.toLowerCase();
  const extractedInfo: Partial<ConversationContext> = {};
  let nextQuestion = '';
  let isComplete = false;

  console.log('Parsing message:', message);
  console.log('Current context:', context);

  // Check if user wants to start a new quote
  if ((lowerMessage.includes('another') || (lowerMessage.includes('new') && !lowerMessage.includes('view'))) 
      && Object.keys(context).length > 0 && context.clientName) {
    return {
      extractedInfo: {},
      nextQuestion: "What's the client's name and address?",
      isComplete: false
    };
  }

  // Extract client name and address with better patterns
  if (!context.clientName || !context.address) {
    // Pattern 1: "Name and the address is Address" or "the name is Name and the address is Address"
    const andAddressMatch = message.match(/(?:(?:the\s+)?name\s+is\s+)?(.+?)\s+and\s+(?:the\s+)?address\s+is\s+(.+?)$/i);
    if (andAddressMatch) {
      extractedInfo.clientName = andAddressMatch[1].trim();
      extractedInfo.address = andAddressMatch[2].trim();
      console.log('Extracted from "and address" pattern:', extractedInfo);
    } 
    // Pattern 2: "Name at Address"
    else if (message.match(/^(.+?)\s+at\s+(.+?)$/i)) {
      const match = message.match(/^(.+?)\s+at\s+(.+?)$/i);
      if (match) {
        extractedInfo.clientName = match[1].trim();
        extractedInfo.address = match[2].trim();
      }
    }
    // Pattern 3: "Name, Address"
    else if (message.includes(',')) {
      const parts = message.split(',');
      if (parts.length >= 2) {
        extractedInfo.clientName = parts[0].trim();
        extractedInfo.address = parts.slice(1).join(',').trim();
      }
    }
    // Pattern 4: "the name is X" or "my name is X" or "client name is X"
    else if (!context.clientName && message.match(/(?:the\s+|my\s+|client\s+)?name\s+is\s+(.+?)$/i)) {
      const nameMatch = message.match(/(?:the\s+|my\s+|client\s+)?name\s+is\s+(.+?)$/i);
      if (nameMatch) {
        extractedInfo.clientName = nameMatch[1].trim();
      }
    }
    // Pattern 5: Just a name (if we don't have one yet)
    else if (!context.clientName && message.length > 0) {
      // Check if this looks like an address (contains numbers and common street words)
      const addressPattern = /\d+.*(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|way|boulevard|blvd|court|ct|place|pl|circle|cir|terrace|ter|parkway|pkwy)/i;
      if (addressPattern.test(message)) {
        if (context.clientName) {
          extractedInfo.address = message;
        }
      } else {
        // Assume it's a name
        extractedInfo.clientName = message;
      }
    }
    // Pattern 5: If we have name but not address, assume the message is address
    else if (context.clientName && !context.address && message.length > 0) {
      extractedInfo.address = message;
    }
  }

  // Extract quote type (quick vs advanced) - IMPORTANT: Check this early
  if (!context.quoteType && context.clientName && context.address) {
    // Quick quote variations
    if (lowerMessage.match(/\b(quick|fast|simple|basic|estimate|rough|ballpark)\b/)) {
      extractedInfo.quoteType = 'quick';
    } 
    // Advanced quote variations
    else if (lowerMessage.match(/\b(advanced|detailed|complete|full|breakdown|itemized|comprehensive)\b/)) {
      extractedInfo.quoteType = 'advanced';
    }
    // Handle numbered options
    else if (lowerMessage.match(/^\s*[12]\s*$/)) {
      const num = lowerMessage.trim();
      if (num === '1') extractedInfo.quoteType = 'quick';
      else if (num === '2') extractedInfo.quoteType = 'advanced';
    }
  }

  // Extract project type with more flexible matching
  if (!context.projectType) {
    // Both variations - check this first to catch "in and out" patterns
    if (lowerMessage.match(/\b(both|everything|all|complete|whole\s*house)\b/) ||
        lowerMessage.match(/\b(in|interior|inside)\s*(and|&|,)\s*(out|exterior|outside)\b/) ||
        lowerMessage.match(/\b(out|exterior|outside)\s*(and|&|,)\s*(in|interior|inside)\b/) ||
        lowerMessage.match(/\b(interior\s*and\s*exterior|inside\s*and\s*outside)\b/)) {
      extractedInfo.projectType = 'both';
    }
    // Interior variations (only if not both)
    else if (lowerMessage.match(/\b(interior|inside|indoor|in)\b/) && !lowerMessage.match(/\b(and|&)\s*(out|exterior)/)) {
      extractedInfo.projectType = 'interior';
    } 
    // Exterior variations (only if not both)
    else if (lowerMessage.match(/\b(exterior|outside|outdoor|out)\b/) && !lowerMessage.match(/\b(and|&)\s*(in|interior)/)) {
      extractedInfo.projectType = 'exterior';
    }
    // If asking about project type and user just says "1", "2", or "3"
    else if (context.address && !context.projectType && lowerMessage.match(/^\s*[123]\s*$/)) {
      const num = lowerMessage.trim();
      if (num === '1') extractedInfo.projectType = 'interior';
      else if (num === '2') extractedInfo.projectType = 'exterior';
      else if (num === '3') extractedInfo.projectType = 'both';
    }
  }

  // Extract square footage (but be careful about addresses with numbers)
  if (!context.sqft && !extractedInfo.address) {
    // First try to match with explicit units
    const sqftMatch = message.match(/(\d{1,2},?\d{3,5}|\d{3,5})\s*(?:sq\s*ft|sqft|square\s*feet|sf|feet|ft)/i);
    if (sqftMatch) {
      const number = parseInt(sqftMatch[1].replace(/,/g, ''));
      // Only accept reasonable square footage (500-50000)
      if (number >= 500 && number <= 50000) {
        extractedInfo.sqft = number;
      }
    } 
    // Handle "about X" or "around X" or "approximately X"
    else if (message.match(/(?:about|around|approximately|approx\.?)\s*(\d{1,2},?\d{3,5}|\d{3,5})/i)) {
      const match = message.match(/(?:about|around|approximately|approx\.?)\s*(\d{1,2},?\d{3,5}|\d{3,5})/i);
      if (match) {
        const number = parseInt(match[1].replace(/,/g, ''));
        if (number >= 500 && number <= 50000) {
          extractedInfo.sqft = number;
        }
      }
    }
    // Handle "Xk" notation (e.g., "5k" for 5000)
    else if (message.match(/^\s*(\d+\.?\d*)\s*k\s*$/i)) {
      const match = message.match(/^\s*(\d+\.?\d*)\s*k\s*$/i);
      if (match) {
        const number = parseFloat(match[1]) * 1000;
        if (number >= 500 && number <= 50000) {
          extractedInfo.sqft = Math.round(number);
        }
      }
    }
    else if (context.projectType && !context.sqft) {
      // If we already have project type and are asking for sqft, accept plain numbers
      const plainNumberMatch = message.match(/^\s*(\d{1,2},?\d{3,5}|\d{3,5})\s*$/);
      if (plainNumberMatch) {
        const number = parseInt(plainNumberMatch[1].replace(/,/g, ''));
        if (number >= 500 && number <= 50000) {
          extractedInfo.sqft = number;
        }
      }
    }
  }

  // Extract paint quality with more flexible matching
  if (!context.paintQuality) {
    // Basic/economy variations
    if (lowerMessage.match(/\b(basic|economy|cheap|cheapest|budget|low|lowest|minimum)\b/)) {
      extractedInfo.paintQuality = 'basic';
    } 
    // Premium/standard variations
    else if (lowerMessage.match(/\b(premium|standard|good|regular|normal|mid|middle|average|medium)\b/)) {
      extractedInfo.paintQuality = 'premium';
    } 
    // Luxury/high-end variations
    else if (lowerMessage.match(/\b(luxury|high[-\s]?end|best|finest|top|highest|deluxe|superior)\b/)) {
      extractedInfo.paintQuality = 'luxury';
    }
    // Handle numbered options (1=basic, 2=premium, 3=luxury)
    else if (context.sqft && !context.paintQuality && lowerMessage.match(/^\s*[123]\s*$/)) {
      const num = lowerMessage.trim();
      if (num === '1') extractedInfo.paintQuality = 'basic';
      else if (num === '2') extractedInfo.paintQuality = 'premium';
      else if (num === '3') extractedInfo.paintQuality = 'luxury';
    }
    // Handle "first", "second", "third" options
    else if (lowerMessage.match(/\b(first|1st)\b/)) {
      extractedInfo.paintQuality = 'basic';
    } else if (lowerMessage.match(/\b(second|2nd)\b/)) {
      extractedInfo.paintQuality = 'premium';
    } else if (lowerMessage.match(/\b(third|3rd)\b/)) {
      extractedInfo.paintQuality = 'luxury';
    }
  }

  // Extract timeline with more variations
  if (!context.timeline && !extractedInfo.timeline) {
    // Check for rush timeline (2-3 days)
    // Don't match "quick" if we just extracted it as quote type or are asking about quote type
    const isAskingAboutQuoteType = context.clientName && context.address && !context.quoteType;
    const rushPattern = (extractedInfo.quoteType || isAskingAboutQuoteType) ? 
      /\b(rush|asap|urgent|quickly|soon|fast|immediately)\b/ :
      /\b(rush|asap|urgent|quickly|soon|fast|immediately|quick)\b/;
    
    if (lowerMessage.match(rushPattern) ||
        lowerMessage.match(/2\s*(-|to)\s*3\s*(days?)?/) || 
        lowerMessage.match(/^\s*(2-3|2 to 3)\s*$/) ||
        lowerMessage.match(/\b(couple|few)\s*(of\s*)?days\b/)) {
      extractedInfo.timeline = 'rush';
    } 
    // Check for flexible timeline (5-7 days)
    else if (lowerMessage.match(/\b(flexible|no\s*rush|whenever|no\s*hurry|anytime|relaxed)\b/) ||
             lowerMessage.match(/5\s*(-|to)\s*7\s*(days?)?/) || 
             lowerMessage.match(/^\s*(5-7|5 to 7)\s*$/) ||
             lowerMessage.match(/\b(week|7\s*days)\b/)) {
      extractedInfo.timeline = 'flexible';
    } 
    // Check for standard timeline (3-5 days)
    else if (lowerMessage.match(/\b(standard|normal|regular|typical)\b/) ||
             lowerMessage.match(/3\s*(-|to)\s*5\s*(days?)?/) || 
             lowerMessage.match(/^\s*(3-5|3 to 5)\s*$/) ||
             lowerMessage.match(/\b(several|few|some)\s*days\b/)) {
      extractedInfo.timeline = 'standard';
    }
    // Handle numbered options when asking about timeline
    else if (context.paintQuality && !context.timeline && lowerMessage.match(/^\s*[123]\s*$/)) {
      const num = lowerMessage.trim();
      if (num === '1') extractedInfo.timeline = 'rush';
      else if (num === '2') extractedInfo.timeline = 'standard';
      else if (num === '3') extractedInfo.timeline = 'flexible';
    }
  }

  // Update context with extracted info
  const updatedContext = { ...context, ...extractedInfo };

  // Determine next question based on what's missing
  if (!updatedContext.clientName) {
    nextQuestion = "What's the client's name?";
  } else if (!updatedContext.address) {
    nextQuestion = `Got it! ${updatedContext.clientName}. What's the property address?`;
  } else if (!updatedContext.quoteType) {
    nextQuestion = "Would you like a Quick quote (basic estimate) or Advanced quote (detailed breakdown)?";
  } else if (!updatedContext.projectType) {
    nextQuestion = "What type of painting - interior, exterior, or both?";
  } else if (!updatedContext.sqft) {
    nextQuestion = "How many square feet are we looking at?";
  } else if (!updatedContext.paintQuality) {
    nextQuestion = "What paint quality would they like - basic, premium, or luxury?";
  } else if (!updatedContext.timeline && updatedContext.quoteType === 'advanced') {
    nextQuestion = "What's the timeline - rush (2-3 days), standard (3-5 days), or flexible (5-7 days)?";
  } else {
    isComplete = true;
    nextQuestion = '';
  }

  console.log('Updated context:', updatedContext);
  console.log('Next question:', nextQuestion);

  return {
    extractedInfo,
    nextQuestion,
    isComplete
  };
}

// Export the enhanced calculator and ConversationContext type as well
export { calculateSimpleQuote } from './simple-assistant';
export type { ConversationContext } from './simple-assistant';