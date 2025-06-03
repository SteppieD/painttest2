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
    // Pattern 1: "Name and the address is Address"
    const andAddressMatch = message.match(/^(.+?)\s+and\s+(?:the\s+)?address\s+is\s+(.+?)$/i);
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
    // Pattern 4: Just a name (if we don't have one yet)
    else if (!context.clientName && message.length > 0) {
      // Check if this looks like an address (contains numbers and common street words)
      const addressPattern = /\d+.*(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|way|boulevard|blvd|court|ct|place|pl)/i;
      if (addressPattern.test(message)) {
        if (context.clientName) {
          extractedInfo.address = message;
        }
      } else {
        // Assume it's a name
        extractedInfo.clientName = message;
      }
    }
  }

  // Extract project type
  if (!context.projectType) {
    if (lowerMessage.includes('interior') || lowerMessage.includes('inside')) {
      extractedInfo.projectType = 'interior';
    } else if (lowerMessage.includes('exterior') || lowerMessage.includes('outside')) {
      extractedInfo.projectType = 'exterior';
    } else if (lowerMessage.includes('both') || (lowerMessage.includes('interior') && lowerMessage.includes('exterior'))) {
      extractedInfo.projectType = 'both';
    }
  }

  // Extract square footage (but be careful about addresses with numbers)
  if (!context.sqft && !extractedInfo.address) {
    const sqftMatch = message.match(/(\d{3,5})\s*(?:sq\s*ft|sqft|square feet|sf)/i);
    if (sqftMatch) {
      const number = parseInt(sqftMatch[1]);
      // Only accept reasonable square footage (500-50000)
      if (number >= 500 && number <= 50000) {
        extractedInfo.sqft = number;
      }
    }
  }

  // Extract paint quality
  if (!context.paintQuality) {
    if (lowerMessage.includes('basic') || lowerMessage.includes('economy')) {
      extractedInfo.paintQuality = 'basic';
    } else if (lowerMessage.includes('premium') || lowerMessage.includes('standard')) {
      extractedInfo.paintQuality = 'premium';
    } else if (lowerMessage.includes('luxury') || lowerMessage.includes('high-end') || lowerMessage.includes('high end')) {
      extractedInfo.paintQuality = 'luxury';
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
    nextQuestion = `Got it! ${updatedContext.clientName}. What's the property address?`;
  } else if (!updatedContext.projectType) {
    nextQuestion = `Perfect! I have ${updatedContext.clientName} at ${updatedContext.address}. What type of painting - interior, exterior, or both?`;
  } else if (!updatedContext.sqft) {
    nextQuestion = "How many square feet are we looking at?";
  } else if (!updatedContext.paintQuality) {
    nextQuestion = "What paint quality would they like - basic, premium, or luxury?";
  } else if (!updatedContext.timeline) {
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