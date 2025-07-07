// Improved conversation parser with better natural language understanding

import { ProjectDimensions, Room, calculateRoomAreas, DEFAULT_CHARGE_RATES, DEFAULT_PAINT_PRODUCTS } from './professional-quote-calculator';

export interface ConversationData {
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
  conversation_stage: string;
}

// Improved customer info parser
const parseCustomerInfo = (input: string, existingData: Partial<ConversationData> = {}): { customer_name: string; address: string } => {
  const lower = input.toLowerCase();
  
  // Handle "The name is X and the address is Y" pattern
  if (lower.includes('the name is') && lower.includes('address is')) {
    const nameMatch = input.match(/(?:the\s+)?name\s+is\s+([^,]+?)(?:\s+and\s+|\s*,?\s*the\s+address\s+is)/i);
    const addressMatch = input.match(/address\s+is\s+(.+)/i);
    
    return {
      customer_name: nameMatch ? nameMatch[1].trim() : '',
      address: addressMatch ? addressMatch[1].trim() : ''
    };
  }
  
  // Handle "Name is X" pattern (standalone)
  if (lower.includes('name is') && !lower.includes('address')) {
    const nameMatch = input.match(/(?:the\s+)?name\s+is\s+(.+)/i);
    return {
      customer_name: nameMatch ? nameMatch[1].trim() : '',
      address: existingData.address || ''
    };
  }
  
  // Handle "Name, the address is X" pattern
  if (lower.includes('the address is') || lower.includes('address is')) {
    const addressMatch = input.match(/(?:the\s+)?address\s+is\s+(.+)/i);
    const beforeAddress = input.split(/(?:the\s+)?address\s+is/i)[0].trim();
    
    // Clean up the name part - remove "the name is" if present
    let name = beforeAddress.replace(/[,\s]+$/, '').trim();
    if (name.toLowerCase().startsWith('the name is')) {
      name = name.substring(11).trim();
    }
    const address = addressMatch ? addressMatch[1].trim() : '';
    
    return {
      customer_name: name || existingData.customer_name || '',
      address: address || existingData.address || ''
    };
  }
  
  // Handle "A/An [adjective] painting quote for Name at Address" pattern
  if (lower.includes('quote for') && lower.includes(' at ') && /\d/.test(input)) {
    const match = input.match(/quote\s+for\s+([A-Za-z\s]+?)\s+at\s+([^.]+)/i);
    if (match) {
      const customerName = match[1].trim();
      const address = match[2].trim();
      console.log('🔍 PARSING: "quote for X at Y" - Customer:', customerName, 'Address:', address);
      return {
        customer_name: customerName,
        address: address
      };
    }
  }
  
  // Handle "It's for Name at Address" pattern
  if (lower.includes("it's for") && lower.includes(' at ') && /\d/.test(input)) {
    const match = input.match(/it'?s\s+for\s+([A-Za-z\s]+?)\s+at\s+([^.]+)/i);
    if (match) {
      const customerName = match[1].trim();
      const address = match[2].trim();
      console.log('🔍 PARSING: "It\'s for X at Y" - Customer:', customerName, 'Address:', address);
      return {
        customer_name: customerName,
        address: address
      };
    }
  }
  
  // Handle standalone "It's for Name" pattern (without address in same sentence)
  if (lower.includes("it's for") && !lower.includes(' at ')) {
    const match = input.match(/it's for\s+([^.]+?)(?:\.|$)/i);
    if (match) {
      return {
        customer_name: match[1].trim(),
        address: existingData.address || ''
      };
    }
  }
  
  // Handle "her/his/their name is X and she/he/they is at Y" pattern
  if ((lower.includes('her name is') || lower.includes('his name is') || lower.includes('their name is')) && 
      (lower.includes(' and she is at ') || lower.includes(' and he is at ') || lower.includes(' and they are at ') || lower.includes(' and she\'s at ') || lower.includes(' and he\'s at '))) {
    const nameMatch = input.match(/(?:her|his|their)\s+name\s+is\s+([^,]+?)(?:\s+and\s+)/i);
    const addressMatch = input.match(/(?:and\s+(?:she|he|they)\s+(?:is|are|'s)\s+at\s+)(.+)/i);
    
    if (nameMatch && addressMatch) {
      console.log('🔍 PARSING: "her/his name is X and she/he is at Y" - Customer:', nameMatch[1].trim(), 'Address:', addressMatch[1].trim());
      return {
        customer_name: nameMatch[1].trim(),
        address: addressMatch[1].trim()
      };
    }
  }
  
  // Handle "Name at Address" pattern
  if (lower.includes(' at ') && /\d/.test(input)) {
    const parts = input.split(' at ');
    return {
      customer_name: parts[0].trim(),
      address: parts.slice(1).join(' at ').trim()
    };
  }
  
  // Check for address keywords
  const addressKeywords = ['street', 'st', 'avenue', 'ave', 'road', 'rd', 'drive', 'dr', 'lane', 'ln', 'way', 'court', 'ct', 'blvd', 'boulevard', 'place', 'pl'];
  const hasNumbers = /\d/.test(input);
  const hasAddressKeywords = addressKeywords.some(keyword => 
    lower.includes(` ${keyword}`) || lower.endsWith(keyword)
  );
  
  // Handle "Name and his/her/their address is..." pattern  
  if (lower.includes(' and ') && (lower.includes('and his address') || lower.includes('and her address') || lower.includes('and their address') || lower.includes('and the address'))) {
    const nameMatch = input.match(/^([^,]+?)\s+and\s+(?:his|her|their|the)\s+address\s+is\s+(.+)/i);
    if (nameMatch) {
      return {
        customer_name: nameMatch[1].trim(),
        address: nameMatch[2].trim()
      };
    }
  }
  
  // Handle "Name and Address" pattern (natural language) - but avoid "and his/her/their address" patterns
  if (lower.includes(' and ') && hasAddressKeywords && !lower.includes('and his') && !lower.includes('and her') && !lower.includes('and their') && !lower.includes('and the address')) {
    const parts = input.split(/\s+and\s+/i);
    if (parts.length >= 2) {
      const potentialName = parts[0].trim();
      const potentialAddress = parts.slice(1).join(' and ').trim();
      
      // Check if the second part looks like an address (and not explanatory text)
      const secondPartLower = potentialAddress.toLowerCase();
      const secondPartHasAddressKeywords = addressKeywords.some(keyword => 
        secondPartLower.includes(` ${keyword}`) || secondPartLower.endsWith(keyword)
      );
      
      // Also check that it doesn't start with possessive or descriptive phrases
      const startsWithDescriptive = /^(his|her|their|the)\s+(address|location|home|house|property)/i.test(potentialAddress);
      
      if ((secondPartHasAddressKeywords || /\d/.test(potentialAddress)) && !startsWithDescriptive) {
        return {
          customer_name: potentialName,
          address: potentialAddress
        };
      }
    }
  }
  
  // If it's just a name (no numbers, no address keywords)
  if (!hasNumbers && !hasAddressKeywords) {
    return {
      customer_name: input.trim(),
      address: existingData.address || ''
    };
  }
  
  // If it has address keywords (with or without numbers), treat as address
  if (hasAddressKeywords) {
    return {
      customer_name: existingData.customer_name || '',
      address: input.trim()
    };
  }
  
  // Default: treat as name if no existing name, otherwise as address
  return {
    customer_name: existingData.customer_name || input.trim(),
    address: existingData.address || (existingData.customer_name ? input.trim() : '')
  };
};

// Smart dimension parser with estimation capabilities
const parseDimensions = (input: string, projectType: string, existingDimensions: Partial<ProjectDimensions> = {}): Partial<ProjectDimensions> => {
  const numbers = input.match(/\d+\.?\d*/g)?.map(Number) || [];
  const lower = input.toLowerCase();
  
  const dimensions: Partial<ProjectDimensions> = { ...existingDimensions };
  
  // Parse specific ceiling area FIRST if provided (highest priority)
  if (lower.includes('ceiling area') || lower.includes('ceiling sqft') || lower.includes('ceiling square') || lower.includes('total ceiling')) {
    // First try to find explicit area with units
    let match = input.match(/(\d+\.?\d*)\s*(?:sqft|square feet|sq ft|sf)/i);
    if (match) {
      dimensions.ceiling_area = Number(match[1]);
      return dimensions; // Return early since we have what we need
    } else {
      // Check for mathematical expressions like "139x2" or "135*2" when ceiling area is mentioned
      const mathMatch = input.match(/(\d+\.?\d*)\s*[x*×]\s*(\d+\.?\d*)/i);
      if (mathMatch) {
        const result = Number(mathMatch[1]) * Number(mathMatch[2]);
        dimensions.ceiling_area = result;
        return dimensions; // Return early since we have what we need
      } else {
        // Check for standalone numbers when ceiling area context is clear
        const numberMatch = input.match(/(\d+\.?\d*)/);
        if (numberMatch) {
          const num = Number(numberMatch[1]);
          // Only accept reasonable ceiling area values (50-5000 sq ft)
          if (num >= 50 && num <= 5000) {
            dimensions.ceiling_area = num;
            return dimensions; // Return early since we have what we need
          }
        }
      }
    }
  }
  
  // Handle room descriptions (like "2 bedrooms that are 15 x 9" or "15 x 12 for each room")
  if (lower.includes('bedroom') || lower.includes('room') || lower.includes('area')) {
    // Pattern 1: "2 bedrooms that are 15 x 9"
    let roomMatch = input.match(/(\d+)\s*(?:bedrooms?|rooms?|areas?)\s*(?:that are|are|of|:)?\s*(\d+\.?\d*)\s*[x×*]\s*(\d+\.?\d*)/i);
    if (roomMatch) {
      const roomCount = Number(roomMatch[1]);
      const length = Number(roomMatch[2]);
      const width = Number(roomMatch[3]);
      
      // Calculate total floor area for all rooms
      const totalFloorArea = roomCount * length * width;
      
      // If they're asking for ceiling area, use floor area
      // Calculate perimeter for walls: (length + width) * 2 * number of rooms
      const totalPerimeter = (length + width) * 2 * roomCount;
      
      dimensions.wall_linear_feet = totalPerimeter;
      dimensions.ceiling_area = totalFloorArea;
      
      // Assume standard ceiling height if not provided
      if (!dimensions.ceiling_height) {
        dimensions.ceiling_height = 9;
      }
      
      return dimensions;
    }
    
    // Pattern 2: "15 feet by 12 feet for each room" (with 2 rooms mentioned elsewhere)
    roomMatch = input.match(/(\d+\.?\d*)\s*(?:feet|ft)?\s*(?:by|x|×)\s*(\d+\.?\d*)\s*(?:feet|ft)?\s*(?:for each|per)\s*room/i);
    if (roomMatch) {
      const length = Number(roomMatch[1]);
      const width = Number(roomMatch[2]);
      
      // Look for room count in the input or existing data
      const roomCountMatch = input.match(/(\d+)\s*rooms?/i);
      const roomCount = roomCountMatch ? Number(roomCountMatch[1]) : (existingDimensions.room_count || 1);
      
      // Store the room count for future reference
      if (roomCountMatch) {
        dimensions.room_count = roomCount;
      }
      
      // Calculate total floor area for all rooms
      const totalFloorArea = roomCount * length * width;
      
      // Calculate perimeter for walls: (length + width) * 2 * number of rooms
      const totalPerimeter = (length + width) * 2 * roomCount;
      
      dimensions.wall_linear_feet = totalPerimeter;
      dimensions.ceiling_area = totalFloorArea;
      
      // Assume standard ceiling height if not provided
      if (!dimensions.ceiling_height) {
        dimensions.ceiling_height = 9;
      }
      
      return dimensions;
    }
  }
  
  // Handle "X by Y" format (like "500 by 9" or "300 by 9") - but only if not already processed as room description
  if ((lower.includes(' by ') || lower.includes(' x ')) && !dimensions.ceiling_area) {
    const match = input.match(/(\d+\.?\d*)\s*(?:by|x)\s*(\d+\.?\d*)/i);
    if (match) {
      const first = Number(match[1]);
      const second = Number(match[2]);
      
      // If one number is clearly height (8-12 range), assign accordingly
      if (second >= 8 && second <= 15) {
        dimensions.wall_linear_feet = first;
        dimensions.ceiling_height = second;
      } else if (first >= 8 && first <= 15) {
        dimensions.wall_linear_feet = second;
        dimensions.ceiling_height = first;
      } else {
        // Both are likely room dimensions, use first as linear feet
        dimensions.wall_linear_feet = first;
        dimensions.ceiling_height = second;
      }
    }
  }
  
  // Parse linear feet (various ways contractors say it)
  if (lower.includes('linear') || lower.includes('lnft') || lower.includes('perimeter') || 
      lower.includes('around') || lower.includes('feet around')) {
    const match = input.match(/(\d+\.?\d*)\s*(?:linear|lnft|perimeter|around|feet)/i);
    if (match) dimensions.wall_linear_feet = Number(match[1]);
  }
  
  // Parse ceiling height (many ways contractors say it) - be more specific to avoid spread rate confusion
  if (lower.includes('ceiling') && (lower.includes('height') || lower.includes('tall') || lower.includes('foot') || lower.includes('feet') || lower.includes('ft'))) {
    const heightMatch = input.match(/ceilings?\s+(?:are|is)?\s*(\d+\.?\d*)\s*(?:foot|feet|ft|')/i);
    if (heightMatch) {
      dimensions.ceiling_height = Number(heightMatch[1]);
    } else {
      // Try another pattern for ceiling height
      const altMatch = input.match(/(\d+\.?\d*)\s*(?:foot|feet|ft|')\s+(?:ceiling|tall)/i);
      if (altMatch) {
        dimensions.ceiling_height = Number(altMatch[1]);
      }
    }
  }
  
  // If just a single number and we're missing ceiling height, and it's in typical height range
  if (numbers.length === 1 && !dimensions.ceiling_height && numbers[0] >= 8 && numbers[0] <= 15) {
    dimensions.ceiling_height = numbers[0];
  }
  
  // If just a single number and we're missing linear feet, and it's outside height range
  if (numbers.length === 1 && !dimensions.wall_linear_feet && (numbers[0] < 8 || numbers[0] > 15)) {
    dimensions.wall_linear_feet = numbers[0];
  }
  
  // Handle multiple numbers when both are provided - but EXCLUDE spread rate numbers
  if (numbers.length >= 2 && !dimensions.wall_linear_feet && !dimensions.ceiling_height) {
    // Filter out spread rate numbers (typically 300-400 sqft per gallon)
    const filteredNumbers = numbers.filter(num => !(num >= 300 && num <= 450 && lower.includes('spread')));
    
    // Sort by likely use - smaller number (8-15) is probably height
    const sortedNumbers = [...filteredNumbers].sort((a, b) => a - b);
    for (let num of sortedNumbers) {
      if (num >= 8 && num <= 15 && !dimensions.ceiling_height) {
        dimensions.ceiling_height = num;
      } else if (!dimensions.wall_linear_feet && num >= 50) { // Linear feet should be at least 50
        dimensions.wall_linear_feet = num;
      }
    }
  }
  
  // Smart ceiling area estimation based on floor area
  if (lower.includes("can't you") || lower.includes("work that out") || lower.includes("calculate") || 
      lower.includes("don't know") || lower.includes("not sure") || lower.includes("floor area")) {
    // User is asking us to calculate or doesn't know
    if (dimensions.wall_linear_feet && !dimensions.ceiling_area) {
      // Default ceiling area = floor area, calculated from overall house width × length
      // For typical rectangular layouts: perimeter = 2(w + l), so if w = l (square), then w = l = perimeter/4
      // Area = w × l = (perimeter/4)²
      // For rectangular homes with ratio 1.5:1, the calculation is slightly different
      // Using a practical multiplier based on typical home shapes
      const perimeter = dimensions.wall_linear_feet;
      // Assume typical rectangular home with 1.3:1 ratio (length:width)
      // Formula: if perimeter = 2(l + w) and l = 1.3w, then perimeter = 2(1.3w + w) = 4.6w
      // So w = perimeter/4.6, l = 1.3 × perimeter/4.6
      // Area = w × l = (perimeter/4.6) × (1.3 × perimeter/4.6) = 1.3 × (perimeter/4.6)²
      const floorArea = Math.round(1.3 * Math.pow(perimeter / 4.6, 2));
      dimensions.ceiling_area = floorArea; // Default: ceiling area = floor area
    }
  }
  
  // Parse floor area if provided (used for ceiling calculation)
  if (lower.includes('floor area') || lower.includes('house size') || lower.includes('total area')) {
    const match = input.match(/(\d+\.?\d*)\s*(?:sqft|square feet|sq ft|sf)/i);
    if (match) {
      const floorArea = Number(match[1]);
      dimensions.floor_area = floorArea;
      // Default: ceiling area = floor area (unless explicitly overridden)
      if (!dimensions.ceiling_area) {
        dimensions.ceiling_area = floorArea;
      }
    }
  }
  
  
  // Parse room count
  if (lower.includes('room') && !lower.includes('for each room')) {
    const roomMatch = input.match(/(\d+)\s*rooms?/i);
    if (roomMatch) dimensions.room_count = Number(roomMatch[1]);
  }
  
  // Parse doors and windows
  if (lower.includes('door')) {
    const match = input.match(/(\d+)\s*doors?/i);
    if (match) dimensions.number_of_doors = Number(match[1]);
  }
  
  if (lower.includes('window')) {
    const match = input.match(/(\d+)\s*windows?/i);
    if (match) dimensions.number_of_windows = Number(match[1]);
  }
  
  return dimensions;
};

// More intelligent follow-up question generator
const generateFollowUpQuestion = (stage: string, data: Partial<ConversationData>): string => {
  switch (stage) {
    case 'customer_info':
      if (!data.customer_name && !data.address) {
        return "What's the customer's name and property address?";
      }
      if (!data.customer_name) {
        return `I have the address as ${data.address}. What's the customer's name?`;
      }
      if (!data.address) {
        return `Perfect! Now I have ${data.customer_name}. What's the property address?`;
      }
      return `Great! For ${data.customer_name} at ${data.address}.\n\nWhat type of painting work are we quoting?`;
      
    case 'project_type':
      if (data.project_type === 'interior') {
        return "For interior painting, I need:\n\n• **Wall linear footage** (perimeter of walls to be painted)\n• **Ceiling height** (in feet)\n• **Floor area** (total house square footage) - I'll use this for ceiling calculations\n\nFor example: \"120 linear feet, 9 foot ceilings, 1200 sqft house\"";
      } else if (data.project_type === 'exterior') {
        return "For exterior painting, I need:\n\n• **Total siding area** (square footage)\n• **Number of stories**\n• **Linear feet of trim**\n\nFor example: \"2500 sqft siding, 2 story home, 150 linear feet of trim\"";
      } else {
        return "For both interior and exterior, let's start with interior dimensions:\n\n• **Wall linear footage**\n• **Ceiling height**\n• **Floor area** (total house square footage)";
      }
      
    case 'dimensions':
      const dims = data.dimensions || {};
      
      if (!dims.wall_linear_feet) {
        return "I need the total linear footage of walls to calculate the wall area for paint coverage. What's the total linear footage of walls to be painted?";
      }
      
      if (!dims.ceiling_height) {
        return `Got it - ${dims.wall_linear_feet} linear feet of walls. I need the ceiling height to calculate the wall area (linear feet × height). What's the ceiling height?`;
      }
      
      if (!dims.floor_area && !dims.ceiling_area && data.project_type === 'interior') {
        return `Got ${dims.wall_linear_feet} linear feet and ${dims.ceiling_height} foot ceilings.\n\nWhat's the total floor area (house square footage)? I'll use this for ceiling calculations.`;
      }
      
      if (dims.floor_area && !dims.ceiling_area && data.project_type === 'interior') {
        return `Perfect! I'll use ${dims.floor_area.toLocaleString()} sqft as the ceiling area (same as floor area for most homes).\n\nIf you need a different ceiling area, just let me know the specific square footage.`;
      }
      
      return "I need to count the doors and windows to calculate the exact surface area for paint coverage. How many doors and windows need painting?";
      
    case 'doors_windows':
      if (!data.dimensions?.number_of_doors && !data.dimensions?.number_of_windows) {
        return "How many doors and windows need painting? (e.g., \"3 doors and 5 windows\")";
      }
      
      return "What paint quality level would you prefer?\n\n• **Good** - Budget-friendly option\n• **Better** - Professional grade, great coverage\n• **Best** - Premium paint, maximum durability\n\n(I'll use the same quality for all surfaces unless you specify otherwise)";
      
    case 'paint_quality':
      return "Perfect! I'm calculating your professional painting quote now...";
      
    default:
      return "Let me help you with your painting quote. What information can I help you with?";
  }
};

// Parse yes/no responses for ceiling area confirmation
const parseConfirmation = (input: string): boolean | null => {
  const lower = input.toLowerCase();
  
  if (lower.includes('yes') || lower.includes('correct') || lower.includes('right') || 
      lower.includes('close') || lower.includes('good') || lower.includes('fine')) {
    return true;
  }
  
  if (lower.includes('no') || lower.includes('wrong') || lower.includes('not')) {
    return false;
  }
  
  return null;
};

// Add parseProjectType function
const parseProjectType = (input: string): 'interior' | 'exterior' | 'both' => {
  const lower = input.toLowerCase();
  
  if (lower.includes('both') || (lower.includes('interior') && lower.includes('exterior'))) {
    return 'both';
  } else if (lower.includes('exterior') || lower.includes('outside') || lower.includes('siding')) {
    return 'exterior';
  } else {
    return 'interior'; // Default to interior
  }
};

// Export all functions
export {
  parseCustomerInfo,
  parseProjectType,
  parseDimensions,
  parseConfirmation,
  generateFollowUpQuestion
};

export const parseDoorsAndWindows = (input: string) => {
  const dims = parseDimensions(input, 'interior');
  return {
    doors: dims.number_of_doors || 0,
    windows: dims.number_of_windows || 0
  };
};

export const parsePaintQuality = (input: string) => {
  const lower = input.toLowerCase();
  let level = 0;
  
  if (lower.includes('best') || lower.includes('premium')) level = 2;
  else if (lower.includes('better') || lower.includes('professional')) level = 1;
  else level = 0;
  
  return { walls: level, ceilings: level, trim: level };
};

export const parseMarkupPercentage = (input: string) => {
  // Look for explicit markup language
  const markupMatch = input.match(/(?:markup|profit|margin)\s*(?:of|is|at)?\s*(\d+)%?/i);
  if (markupMatch) {
    return Number(markupMatch[1]);
  }
  
  // Look for standalone percentage at end of input
  const percentMatch = input.match(/(\d+)%\s*$/);
  if (percentMatch) {
    return Number(percentMatch[1]);
  }
  
  // If labor is "included" in rate, no additional markup
  if (input.toLowerCase().includes('labour is included') || input.toLowerCase().includes('labor is included')) {
    return 0;
  }
  
  // Default to 0% if no markup specified
  return 0;
};

// Parse room count from user input
export const parseRoomCount = (input: string): number => {
  const numbers = input.match(/\d+/g);
  if (numbers) {
    return Number(numbers[0]);
  }
  
  const lower = input.toLowerCase();
  const roomWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  for (let i = 0; i < roomWords.length; i++) {
    if (lower.includes(roomWords[i])) {
      return i + 1;
    }
  }
  
  return 0;
};

// Parse individual room data from user input
export const parseRoomData = (input: string, roomName: string): Partial<Room> => {
  const lower = input.toLowerCase();
  const numbers = input.match(/\d+\.?\d*/g)?.map(Number) || [];
  
  const room: Partial<Room> = {
    name: roomName,
    doors: 1, // Default to 1 door per room
    windows: 1 // Default to 1 window per room
  };
  
  // Parse dimensions
  if (numbers.length >= 2) {
    room.length = numbers[0];
    room.width = numbers[1];
    
    if (numbers.length >= 3) {
      room.height = numbers[2];
    }
  }
  
  // Parse height if mentioned separately
  if (lower.includes('height') || lower.includes('ceiling') || lower.includes('tall')) {
    const heightMatch = input.match(/(\d+\.?\d*)\s*(?:foot|feet|ft|')/i);
    if (heightMatch) {
      room.height = Number(heightMatch[1]);
    }
  }
  
  // Parse doors
  if (lower.includes('door')) {
    const doorMatch = input.match(/(\d+)\s*doors?/i);
    if (doorMatch) {
      room.doors = Number(doorMatch[1]);
    } else if (lower.includes('no door') || lower.includes('0 door')) {
      room.doors = 0;
    }
  }
  
  // Parse windows
  if (lower.includes('window')) {
    const windowMatch = input.match(/(\d+)\s*windows?/i);
    if (windowMatch) {
      room.windows = Number(windowMatch[1]);
    } else if (lower.includes('no window') || lower.includes('0 window')) {
      room.windows = 0;
    }
  }
  
  return room;
};

// Generate room summary for display
export const generateRoomSummary = (rooms: Room[]): string => {
  const totalCeilingArea = rooms.reduce((sum, room) => sum + room.ceiling_area, 0);
  const totalDoors = rooms.reduce((sum, room) => sum + room.doors, 0);
  const totalWindows = rooms.reduce((sum, room) => sum + room.windows, 0);
  
  let summary = `### Room Summary (${rooms.length} rooms)\n`;
  
  rooms.forEach((room, index) => {
    summary += `${index + 1}. **${room.name}**: ${room.length}' × ${room.width}' × ${room.height}' (${room.ceiling_area} sqft ceiling, ${room.doors} doors, ${room.windows} windows)\n`;
  });
  
  summary += `\n**Total Ceiling Area:** ${totalCeilingArea.toLocaleString()} sqft\n`;
  summary += `**Total Doors:** ${totalDoors}\n`;
  summary += `**Total Windows:** ${totalWindows}\n`;
  
  return summary;
};

// Generate room summary with edit buttons for interactive display
export const generateRoomSummaryWithButtons = (rooms: Room[]): { summary: string; buttons: any[] } => {
  const totalCeilingArea = rooms.reduce((sum, room) => sum + room.ceiling_area, 0);
  const totalDoors = rooms.reduce((sum, room) => sum + room.doors, 0);
  const totalWindows = rooms.reduce((sum, room) => sum + room.windows, 0);
  
  let summary = `### Room Summary (${rooms.length} rooms)\n`;
  
  rooms.forEach((room, index) => {
    summary += `${index + 1}. **${room.name}**: ${room.length}' × ${room.width}' × ${room.height}' (${room.ceiling_area} sqft ceiling, ${room.doors} doors, ${room.windows} windows)\n`;
  });
  
  summary += `\n**Total Ceiling Area:** ${totalCeilingArea.toLocaleString()} sqft\n`;
  summary += `**Total Doors:** ${totalDoors}\n`;
  summary += `**Total Windows:** ${totalWindows}\n\n`;
  summary += `Click a room below to edit its dimensions:`;
  
  // Generate edit buttons for each room
  const buttons = rooms.map((room, index) => ({
    id: `edit_room_${index}`,
    label: `✏️ Edit ${room.name}`,
    value: `edit_room_${index}`,
    selected: false
  }));
  
  return { summary, buttons };
};

export const generateQuoteDisplay = (quote: any, customerName: string, address: string, rooms?: Room[]) => {
  let roomBreakdown = '';
  if (rooms && rooms.length > 0) {
    roomBreakdown = `\n### Room-by-Room Breakdown\n${generateRoomSummary(rooms)}\n`;
  }

  return `## Professional Painting Quote

**Customer:** ${customerName}
**Address:** ${address}
${roomBreakdown}
### Pricing Summary
• **Materials:** $${quote.materials.total_material_cost.toLocaleString()}
• **Labor:** $${quote.labor.total_labor.toLocaleString()}
• **Your Cost:** $${quote.total_cost.toLocaleString()}
• **Customer Price:** $${quote.final_price.toLocaleString()}
• **Your Profit:** $${quote.markup_amount.toLocaleString()} (${quote.profit_margin.toFixed(1)}% margin)

Ready to save this quote?`;
};

// Generate quote display with room edit buttons
export const generateQuoteDisplayWithButtons = (quote: any, customerName: string, address: string, rooms?: Room[]) => {
  let roomBreakdown = '';
  let roomButtons: any[] = [];
  
  if (rooms && rooms.length > 0) {
    const roomSummaryWithButtons = generateRoomSummaryWithButtons(rooms);
    roomBreakdown = `\n### Room-by-Room Breakdown\n${roomSummaryWithButtons.summary}\n`;
    roomButtons = roomSummaryWithButtons.buttons;
  }

  const quoteText = `## Professional Painting Quote

**Customer:** ${customerName}
**Address:** ${address}
${roomBreakdown}
### Pricing Summary
• **Materials:** $${quote.materials.total_material_cost.toLocaleString()}
• **Labor:** $${quote.labor.total_labor.toLocaleString()}
• **Your Cost:** $${quote.total_cost.toLocaleString()}
• **Customer Price:** $${quote.final_price.toLocaleString()}
• **Your Profit:** $${quote.markup_amount.toLocaleString()} (${quote.profit_margin.toFixed(1)}% margin)

Ready to save this quote?`;

  return { quoteText, roomButtons };
};