// Enhanced conversational assistant with better pattern matching
import { ConversationContext, calculateSimpleQuote } from './simple-assistant';

// Intelligent data dump parser for natural language input
function parseDataDump(message: string, context: ConversationContext): {
  foundMultipleItems: boolean;
  extractedInfo: Partial<ConversationContext>;
} {
  const extractedInfo: Partial<ConversationContext> = {};
  let foundItems = 0;

  // Extract client name - multiple patterns
  const namePatterns = [
    /(?:client|customer|name)(?:\s+is|\s*:|\s+of)?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /for\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:at|needs|wants|has)/i
  ];
  
  for (const pattern of namePatterns) {
    const match = message.match(pattern);
    if (match && !extractedInfo.clientName) {
      const name = match[1].trim();
      // Ensure it's not an address or other data
      if (!name.match(/\d+|street|ave|road|drive|sqft|sq|ft|doors?|paint/i)) {
        extractedInfo.clientName = name;
        foundItems++;
        break;
      }
    }
  }

  // Extract address - comprehensive patterns
  const addressPatterns = [
    /(?:address|location|property|at|on)\s+(?:is\s+)?(.+?)(?:\s+(?:has|needs|wants|with|\d+\s*(?:sq|square))|\s*,|$)/i,
    /(\d+\s+[^,\d]+(?:street|st|avenue|ave|road|rd|drive|dr|lane|ln|way|boulevard|blvd|court|ct|place|pl)(?:\s+\w+)*)/i
  ];
  
  for (const pattern of addressPatterns) {
    const match = message.match(pattern);
    if (match && !extractedInfo.address) {
      extractedInfo.address = match[1].trim();
      foundItems++;
      break;
    }
  }

  // Extract square footage
  const sqftPatterns = [
    /(\d+(?:,\d{3})*)\s*(?:sq|square)\s*(?:ft|feet|foot)/i,
    /(\d+(?:,\d{3})*)\s*sqft/i,
    /(\d+(?:,\d{3})*)\s*sq\s*ft/i,
    /(\d+(?:,\d{3})*)\s*(?:square\s*)?(?:feet|foot)/i
  ];
  
  for (const pattern of sqftPatterns) {
    const match = message.match(pattern);
    if (match && !extractedInfo.sqft) {
      extractedInfo.sqft = parseInt(match[1].replace(/,/g, ''));
      foundItems++;
      break;
    }
  }

  // Extract doors
  const doorPatterns = [
    /(\d+)\s*doors?/i,
    /doors?\s*(?::\s*)?(\d+)/i,
    /(\d+)\s*door\s*(?:trim|frame)/i
  ];
  
  for (const pattern of doorPatterns) {
    const match = message.match(pattern);
    if (match && !extractedInfo.doors) {
      extractedInfo.doors = parseInt(match[1]);
      foundItems++;
      break;
    }
  }

  // Extract paint quality
  const paintQualityPatterns = [
    /\b(basic|standard|premium|luxury|high[- ]?end|low[- ]?end)\s*(?:paint|quality)/i,
    /\b(sherwin[- ]?williams|benjamin[- ]?moore|behr|valspar)\b/i
  ];
  
  for (const pattern of paintQualityPatterns) {
    const match = message.match(pattern);
    if (match && !extractedInfo.paintQuality) {
      const quality = match[1].toLowerCase();
      if (quality.includes('basic') || quality.includes('standard') || quality.includes('low')) {
        extractedInfo.paintQuality = 'basic';
      } else if (quality.includes('premium') || quality.includes('high')) {
        extractedInfo.paintQuality = 'premium';
      } else if (quality.includes('luxury')) {
        extractedInfo.paintQuality = 'luxury';
      } else {
        extractedInfo.paintQuality = 'premium'; // Brand names default to premium
      }
      foundItems++;
      break;
    }
  }

  // Extract project type
  const projectTypePatterns = [
    /\b(interior|inside|indoor)\b/i,
    /\b(exterior|outside|outdoor)\b/i,
    /\b(both|everything|complete|whole\s*house)\b/i
  ];
  
  for (const pattern of projectTypePatterns) {
    const match = message.match(pattern);
    if (match && !extractedInfo.projectType) {
      const type = match[1].toLowerCase();
      if (type.includes('exterior') || type.includes('outside') || type.includes('outdoor')) {
        extractedInfo.projectType = 'exterior';
      } else if (type.includes('both') || type.includes('everything') || type.includes('complete') || type.includes('whole')) {
        extractedInfo.projectType = 'both';
      } else {
        extractedInfo.projectType = 'interior';
      }
      foundItems++;
      break;
    }
  }

  // Extract timeline preferences
  const timelinePatterns = [
    /\b(rush|urgent|asap|quickly?)\b/i,
    /\b(flexible|no\s*rush|whenever)\b/i,
    /(?:in|within)\s*(\d+)\s*(?:days?|weeks?)/i
  ];
  
  for (const pattern of timelinePatterns) {
    const match = message.match(pattern);
    if (match && !extractedInfo.timeline) {
      const timelineText = match[1] ? match[1].toLowerCase() : match[0].toLowerCase();
      if (timelineText.includes('rush') || timelineText.includes('urgent') || timelineText.includes('asap')) {
        extractedInfo.timeline = 'rush';
      } else if (timelineText.includes('flexible') || timelineText.includes('no rush') || timelineText.includes('whenever')) {
        extractedInfo.timeline = 'flexible';
      } else {
        extractedInfo.timeline = 'standard';
      }
      foundItems++;
      break;
    }
  }

  // Extract surface breakdown (walls, ceilings, trim)
  const wallsMatch = message.match(/(\d+)\s*(?:sq\s*ft\s*)?(?:of\s*)?walls?/i);
  if (wallsMatch) {
    extractedInfo.walls_sqft = parseInt(wallsMatch[1]);
    foundItems++;
  }

  const ceilingsMatch = message.match(/(\d+)\s*(?:sq\s*ft\s*)?(?:of\s*)?ceilings?/i);
  if (ceilingsMatch) {
    extractedInfo.ceilings_sqft = parseInt(ceilingsMatch[1]);
    foundItems++;
  }

  const trimMatch = message.match(/(\d+)\s*(?:linear\s*ft\s*|lin\s*ft\s*)?(?:of\s*)?trim/i);
  if (trimMatch) {
    extractedInfo.trim_sqft = parseInt(trimMatch[1]);
    foundItems++;
  }

  console.log(`Data dump parser found ${foundItems} items:`, extractedInfo);
  
  return {
    foundMultipleItems: foundItems >= 3, // Need at least 3 pieces of info to consider it a data dump
    extractedInfo
  };
}

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

  // First, try the intelligent data dump parser
  const dataDumpResult = parseDataDump(message, context);
  if (dataDumpResult.foundMultipleItems) {
    console.log('Data dump parsing successful:', dataDumpResult);
    Object.assign(extractedInfo, dataDumpResult.extractedInfo);
    
    // Check if we have enough for a quote
    if (extractedInfo.clientName && extractedInfo.address && extractedInfo.sqft) {
      extractedInfo.quoteType = extractedInfo.quoteType || 'quick';
      extractedInfo.projectType = extractedInfo.projectType || 'interior';
      
      return {
        extractedInfo,
        nextQuestion: `Perfect! I've extracted all the details: ${extractedInfo.clientName} at ${extractedInfo.address}, ${extractedInfo.sqft} sqft ${extractedInfo.projectType || 'interior'} project${extractedInfo.doors ? ` with ${extractedInfo.doors} doors` : ''}${extractedInfo.paintQuality ? ` using ${extractedInfo.paintQuality} paint` : ''}. Should I create your quote now?`,
        isComplete: true
      };
    }
  }

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
    const nameIsPattern = message.match(/(?:the\s+|client\s+)?name\s+is\s+([^,]+?)\s+and\s+(?:the\s+)?address\s+is\s+(.+?)$/i);
    if (nameIsPattern) {
      extractedInfo.clientName = nameIsPattern[1].trim();
      extractedInfo.address = nameIsPattern[2].trim();
      console.log('Extracted from "name is X and address is Y" pattern:', extractedInfo);
    }
    // Pattern 1b: "Name and the address is Address" (without "name is")
    else if (!nameIsPattern) {
      const simpleAndPattern = message.match(/^([^,\s]+(?:\s+[^,\s]+)*?)\s+and\s+(?:the\s+)?address\s+is\s+(.+?)$/i);
      if (simpleAndPattern) {
        const potentialName = simpleAndPattern[1].trim();
        // Make sure it's likely a name (not too long, doesn't contain address keywords)
        if (potentialName.length <= 50 && !potentialName.match(/\d+.*(?:street|avenue|drive|road|way|lane)/i)) {
          extractedInfo.clientName = potentialName;
          extractedInfo.address = simpleAndPattern[2].trim();
          console.log('Extracted from "Name and address is Y" pattern:', extractedInfo);
        }
      }
    }
    
    // Pattern 2: "Name at Address" - only if we haven't found name/address yet
    if (!extractedInfo.clientName && !extractedInfo.address && message.match(/^(.+?)\s+at\s+(.+?)$/i)) {
      const match = message.match(/^(.+?)\s+at\s+(.+?)$/i);
      if (match) {
        extractedInfo.clientName = match[1].trim();
        extractedInfo.address = match[2].trim();
      }
    }
    
    // Pattern 3: "Name, Address" - only if we haven't found name/address yet
    if (!extractedInfo.clientName && !extractedInfo.address && message.includes(',')) {
      const parts = message.split(',');
      if (parts.length >= 2) {
        extractedInfo.clientName = parts[0].trim();
        extractedInfo.address = parts.slice(1).join(',').trim();
      }
    }
    
    // Pattern 4: "the name is X" or "my name is X" or "client name is X"
    if (!extractedInfo.clientName && !context.clientName && message.match(/(?:the\s+|my\s+|client\s+)?name\s+is\s+(.+?)$/i)) {
      const nameMatch = message.match(/(?:the\s+|my\s+|client\s+)?name\s+is\s+(.+?)$/i);
      if (nameMatch) {
        extractedInfo.clientName = nameMatch[1].trim();
      }
    }
    
    // Pattern 5: Just a name (if we don't have one yet)
    if (!extractedInfo.clientName && !context.clientName && message.length > 0) {
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
    
    // Pattern 6: If we have name but not address, assume the message is address
    if (!extractedInfo.address && context.clientName && !context.address && message.length > 0) {
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