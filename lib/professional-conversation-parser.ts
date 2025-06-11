// Professional painting conversation parser for collecting detailed project data

import { ProjectDimensions, DEFAULT_CHARGE_RATES, DEFAULT_PAINT_PRODUCTS } from './professional-quote-calculator';

export interface ConversationData {
  customer_name: string;
  address: string;
  project_type: 'interior' | 'exterior' | 'both';
  dimensions: Partial<ProjectDimensions>;
  selected_products: {
    primer_level: 0 | 1 | 2; // Index for product quality
    wall_paint_level: 0 | 1 | 2;
    ceiling_paint_level: 0 | 1 | 2;
    trim_paint_level: 0 | 1 | 2;
    include_floor_sealer: boolean;
  };
  conversation_stage: string;
}

// Parse customer info and address
export const parseCustomerInfo = (input: string): { customer_name: string; address: string } => {
  const lines = input.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // If multiple lines, assume first is name, second is address
  if (lines.length >= 2) {
    return {
      customer_name: lines[0],
      address: lines.slice(1).join(' ')
    };
  }
  
  // Single line - try to detect if it contains address keywords
  const addressKeywords = ['street', 'st', 'avenue', 'ave', 'road', 'rd', 'drive', 'dr', 'lane', 'ln', 'way', 'court', 'ct', 'blvd', 'boulevard'];
  const hasAddressKeywords = addressKeywords.some(keyword => 
    input.toLowerCase().includes(keyword)
  );
  
  // If contains numbers and address keywords, treat as address
  if (hasAddressKeywords && /\d/.test(input)) {
    return {
      customer_name: '',
      address: input
    };
  }
  
  // Otherwise treat as customer name
  return {
    customer_name: input,
    address: ''
  };
};

// Parse project type
export const parseProjectType = (input: string): 'interior' | 'exterior' | 'both' => {
  const lower = input.toLowerCase();
  
  if (lower.includes('both') || (lower.includes('interior') && lower.includes('exterior'))) {
    return 'both';
  } else if (lower.includes('exterior') || lower.includes('outside') || lower.includes('siding')) {
    return 'exterior';
  } else {
    return 'interior'; // Default to interior
  }
};

// Parse linear footage and dimensions
export const parseDimensions = (input: string, projectType: string): Partial<ProjectDimensions> => {
  const numbers = input.match(/\d+\.?\d*/g)?.map(Number) || [];
  const lower = input.toLowerCase();
  
  const dimensions: Partial<ProjectDimensions> = {};
  
  // Look for specific mentions
  if (lower.includes('linear') || lower.includes('lnft') || lower.includes('wall')) {
    const linearMatch = input.match(/(?:linear|lnft|wall)[^\d]*(\d+\.?\d*)/i);
    if (linearMatch) dimensions.wall_linear_feet = Number(linearMatch[1]);
  }
  
  if (lower.includes('height') || lower.includes('tall') || lower.includes('ceiling')) {
    const heightMatch = input.match(/(?:height|tall|ceiling)[^\d]*(\d+\.?\d*)/i);
    if (heightMatch) dimensions.ceiling_height = Number(heightMatch[1]);
  }
  
  if (lower.includes('ceiling area') || lower.includes('ceiling sqft')) {
    const ceilingMatch = input.match(/(?:ceiling area|ceiling sqft)[^\d]*(\d+\.?\d*)/i);
    if (ceilingMatch) dimensions.ceiling_area = Number(ceilingMatch[1]);
  }
  
  if (lower.includes('door')) {
    const doorMatch = input.match(/(\d+).*door/i) || input.match(/door.*(\d+)/i);
    if (doorMatch) dimensions.number_of_doors = Number(doorMatch[1]);
  }
  
  if (lower.includes('window')) {
    const windowMatch = input.match(/(\d+).*window/i) || input.match(/window.*(\d+)/i);
    if (windowMatch) dimensions.number_of_windows = Number(windowMatch[1]);
  }
  
  if (lower.includes('floor')) {
    const floorMatch = input.match(/(?:floor)[^\d]*(\d+\.?\d*)/i);
    if (floorMatch) dimensions.floor_area = Number(floorMatch[1]);
  }
  
  // If no specific keywords but we have numbers, try to infer
  if (Object.keys(dimensions).length === 0 && numbers.length > 0) {
    // Try common patterns like "100 linear feet, 10 foot ceilings, 1200 sqft ceiling"
    if (numbers.length >= 3) {
      dimensions.wall_linear_feet = numbers[0];
      dimensions.ceiling_height = numbers[1];
      dimensions.ceiling_area = numbers[2];
    } else if (numbers.length === 2) {
      dimensions.wall_linear_feet = numbers[0];
      dimensions.ceiling_height = numbers[1];
    } else if (numbers.length === 1) {
      dimensions.wall_linear_feet = numbers[0];
    }
  }
  
  return dimensions;
};

// Parse door and window counts
export const parseDoorsAndWindows = (input: string): { doors: number; windows: number } => {
  const lower = input.toLowerCase();
  
  let doors = 0;
  let windows = 0;
  
  // Look for door mentions
  const doorMatch = input.match(/(\d+).*?doors?/i) || input.match(/doors?.*?(\d+)/i);
  if (doorMatch) {
    doors = Number(doorMatch[1]);
  } else if (lower.includes('no door') || lower.includes('zero door')) {
    doors = 0;
  }
  
  // Look for window mentions
  const windowMatch = input.match(/(\d+).*?windows?/i) || input.match(/windows?.*?(\d+)/i);
  if (windowMatch) {
    windows = Number(windowMatch[1]);
  } else if (lower.includes('no window') || lower.includes('zero window')) {
    windows = 0;
  }
  
  // Handle common phrases
  if (lower.includes('one door')) doors = 1;
  if (lower.includes('two doors')) doors = 2;
  if (lower.includes('three doors')) doors = 3;
  if (lower.includes('four doors')) doors = 4;
  if (lower.includes('five doors')) doors = 5;
  
  if (lower.includes('one window')) windows = 1;
  if (lower.includes('two windows')) windows = 2;
  if (lower.includes('three windows')) windows = 3;
  if (lower.includes('four windows')) windows = 4;
  if (lower.includes('five windows')) windows = 5;
  
  return { doors, windows };
};

// Parse markup percentage selection
export const parseMarkupPercentage = (input: string): number => {
  const lower = input.toLowerCase();
  
  // Look for explicit percentage mentions
  if (lower.includes('40%') || lower.includes('40 percent') || lower.includes('forty')) {
    return 40;
  } else if (lower.includes('30%') || lower.includes('30 percent') || lower.includes('thirty')) {
    return 30;
  } else if (lower.includes('20%') || lower.includes('20 percent') || lower.includes('twenty')) {
    return 20;
  } else if (lower.includes('10%') || lower.includes('10 percent') || lower.includes('ten')) {
    return 10;
  }
  
  // Look for quality-based markup suggestions
  if (lower.includes('high') || lower.includes('premium') || lower.includes('maximum')) {
    return 40;
  } else if (lower.includes('standard') || lower.includes('normal') || lower.includes('typical')) {
    return 20;
  } else if (lower.includes('low') || lower.includes('minimum') || lower.includes('basic')) {
    return 10;
  }
  
  // Default to 20% if unclear
  return 20;
};

// Parse paint quality selection
export const parsePaintQuality = (input: string): { walls: number; ceilings: number; trim: number } => {
  const lower = input.toLowerCase();
  
  let wallLevel = 0; // Default to "good"
  let ceilingLevel = 0;
  let trimLevel = 0;
  
  // Look for quality keywords
  if (lower.includes('best') || lower.includes('premium') || lower.includes('high')) {
    wallLevel = ceilingLevel = trimLevel = 2;
  } else if (lower.includes('better') || lower.includes('mid') || lower.includes('standard')) {
    wallLevel = ceilingLevel = trimLevel = 1;
  } else if (lower.includes('good') || lower.includes('basic') || lower.includes('budget')) {
    wallLevel = ceilingLevel = trimLevel = 0;
  }
  
  // Look for specific mentions
  if (lower.includes('wall')) {
    if (lower.includes('wall') && lower.includes('best')) wallLevel = 2;
    else if (lower.includes('wall') && lower.includes('better')) wallLevel = 1;
    else if (lower.includes('wall') && lower.includes('good')) wallLevel = 0;
  }
  
  return { walls: wallLevel, ceilings: ceilingLevel, trim: trimLevel };
};

// Generate intelligent follow-up questions
export const generateFollowUpQuestion = (stage: string, data: Partial<ConversationData>): string => {
  switch (stage) {
    case 'customer_info':
      if (!data.customer_name) {
        return "What's the customer's name?";
      }
      if (!data.address) {
        return "What's the property address?";
      }
      return "Perfect! What type of painting work are we quoting?\n• Interior only\n• Exterior only\n• Both interior and exterior";
      
    case 'project_type':
      return "Great! Now I need the room dimensions. Please provide:\n\n• **Wall linear footage** (perimeter of walls)\n• **Ceiling height** (in feet)\n• **Ceiling area** (square footage)\n\nFor example: '120 linear feet, 9 foot ceilings, 1200 sqft ceiling area'";
      
    case 'dimensions':
      if (!data.dimensions?.wall_linear_feet) {
        return "I need the **wall linear footage** (perimeter measurement of all walls to be painted).";
      }
      if (!data.dimensions?.ceiling_height) {
        return "What's the **ceiling height** in feet?";
      }
      if (!data.dimensions?.ceiling_area && data.project_type === 'interior') {
        return "What's the **ceiling area** in square feet?";
      }
      return "Now I need to count doors and windows:\n\n• How many **doors** need painting?\n• How many **windows** need painting?\n\nFor example: '3 doors and 5 windows'";
      
    case 'doors_windows':
      return "What paint quality would you like to use?\n\n• **Good** - Budget-friendly, basic coverage\n• **Better** - Mid-range, better durability\n• **Best** - Premium, longest lasting\n\nYou can choose different levels for walls, ceilings, and trim if needed.";
      
    case 'paint_quality':
      return "Perfect! Let me calculate your professional quote now...";
      
    default:
      return "I'm ready to help with your next step. What would you like to do?";
  }
};

// Generate professional quote display with profit margins
export const generateQuoteDisplay = (
  quote: any, // ProfessionalQuote type
  customerName: string,
  address: string
): string => {
  const materials = quote.materials;
  const labor = quote.labor;
  
  return `## 🎯 **Professional Paint Quote**

**Customer:** ${customerName}
**Address:** ${address}

### 💰 **Pricing Summary**
• **Materials Cost:** $${materials.total_material_cost.toLocaleString()}
• **Labor Cost:** $${labor.total_labor.toLocaleString()}
• **Overhead (10%):** $${quote.overhead.toLocaleString()}
• **Subtotal (Your Cost):** $${quote.total_cost.toLocaleString()}
• **Markup (${quote.markup_percentage}%):** $${quote.markup_amount.toLocaleString()}

## **💵 CUSTOMER PRICE: $${quote.final_price.toLocaleString()}**
**Your Profit: $${quote.markup_amount.toLocaleString()} (${quote.profit_margin.toFixed(1)}% margin)**

### 📊 **Materials Breakdown**
• **Primer:** ${materials.primer.gallons_needed} gallons - $${materials.primer.cost.toLocaleString()}
• **Wall Paint:** ${materials.walls.gallons_needed} gallons - $${materials.walls.cost.toLocaleString()}
• **Ceiling Paint:** ${materials.ceilings.gallons_needed} gallons - $${materials.ceilings.cost.toLocaleString()}
• **Trim Paint:** ${materials.trim_doors_windows.gallons_needed} gallons - $${materials.trim_doors_windows.cost.toLocaleString()}
${materials.floor_sealer ? `• **Floor Sealer:** ${materials.floor_sealer.gallons_needed} gallons - $${materials.floor_sealer.cost.toLocaleString()}` : ''}

### 👷 **Labor Breakdown**
• **Primer Application:** $${labor.primer_labor.toLocaleString()} (${materials.primer.sqft_needed} sqft)
• **Wall Painting:** $${labor.wall_labor.toLocaleString()} (${materials.walls.sqft_needed} sqft, 2 coats)
• **Ceiling Painting:** $${labor.ceiling_labor.toLocaleString()} (${materials.ceilings.sqft_needed} sqft, 2 coats)
• **Doors & Trim:** $${(labor.door_labor + labor.window_labor).toLocaleString()} (${materials.trim_doors_windows.doors_count} doors, ${materials.trim_doors_windows.windows_count} windows)
${labor.floor_sealer_labor ? `• **Floor Sealer:** $${labor.floor_sealer_labor.toLocaleString()}` : ''}

---
**What would you like to do?**
• **"Save"** - Finalize this quote at $${quote.final_price.toLocaleString()}
• **"Adjust markup"** - Change profit percentage (10%, 20%, 30%, 40%)
• **"Breakdown"** - See detailed calculations`;
};

export default {
  parseCustomerInfo,
  parseProjectType,
  parseDimensions,
  parseDoorsAndWindows,
  parsePaintQuality,
  generateFollowUpQuestion,
  generateQuoteDisplay
};