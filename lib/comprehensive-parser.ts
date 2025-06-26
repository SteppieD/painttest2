// Comprehensive parser that can extract multiple pieces of information from a single user input
// This solves the original problem without requiring external API calls

export interface ComprehensiveQuoteInfo {
  customer_name: string | null;
  address: string | null;
  project_type: 'interior' | 'exterior' | 'both' | null;
  surfaces: {
    walls: boolean;
    ceilings: boolean;
    trim: boolean;
    doors: boolean;
    windows: boolean;
  };
  dimensions: {
    linear_feet: number | null;
    ceiling_height: number | null;
    total_area: number | null;
  };
  paint_specs: {
    brand: string | null;
    finish: string | null;
    price_per_gallon: number | null;
    coverage_per_gallon: number | null;
    primer_needed: boolean;
  };
  labor: {
    rate_per_sqft: number | null;
    included_in_sqft: boolean;
  };
  special_requirements: string[];
  confidence_level: 'high' | 'medium' | 'low';
  extracted_count: number; // How many pieces of info were found
}

export function parseComprehensiveInput(input: string): ComprehensiveQuoteInfo {
  const lower = input.toLowerCase();
  let extractedCount = 0;
  
  // Initialize result with defaults
  const result: ComprehensiveQuoteInfo = {
    customer_name: null,
    address: null,
    project_type: null,
    surfaces: {
      walls: true, // Default to painting walls
      ceilings: true,
      trim: true,
      doors: true,
      windows: true,
    },
    dimensions: {
      linear_feet: null,
      ceiling_height: null,
      total_area: null,
    },
    paint_specs: {
      brand: null,
      finish: null,
      price_per_gallon: null,
      coverage_per_gallon: null,
      primer_needed: true, // Default to needing primer
    },
    labor: {
      rate_per_sqft: null,
      included_in_sqft: false,
    },
    special_requirements: [],
    confidence_level: 'low',
    extracted_count: 0,
  };

  // 1. Extract customer name and address
  // Pattern: "It's for [Name] at [Address]"
  const customerAddressMatch = input.match(/(?:it's for|for)\s+([^,\s]+)(?:\s+at\s+)?([^.]+?)(?:\.|$|we|the|project)/i);
  if (customerAddressMatch) {
    result.customer_name = customerAddressMatch[1].trim();
    if (customerAddressMatch[2] && customerAddressMatch[2].trim() !== customerAddressMatch[1].trim()) {
      result.address = customerAddressMatch[2].replace(/^at\s+/i, '').trim();
    }
    extractedCount += 2;
  } else {
    // Try separate patterns
    const nameMatch = input.match(/(?:customer|client|for)\s+(?:is\s+)?([A-Za-z]+)/i);
    if (nameMatch) {
      result.customer_name = nameMatch[1].trim();
      extractedCount++;
    }
    
    // Look for address patterns
    const addressKeywords = ['street', 'st', 'avenue', 'ave', 'road', 'rd', 'drive', 'dr', 'lane', 'ln', 'way', 'court', 'ct', 'hillside'];
    const addressMatch = input.match(new RegExp(`(\\d+\\s+[^.]+?(?:${addressKeywords.join('|')})\\w*)`, 'i'));
    if (addressMatch) {
      result.address = addressMatch[1].trim();
      extractedCount++;
    }
  }

  // 2. Extract project type
  if (/interior/i.test(input)) {
    result.project_type = 'interior';
    extractedCount++;
  } else if (/exterior/i.test(input)) {
    result.project_type = 'exterior';
    extractedCount++;
  } else if (/both/i.test(input)) {
    result.project_type = 'both';
    extractedCount++;
  }

  // 3. Extract surface exclusions (important!)
  if (/not.*paint.*ceiling|no.*ceiling|skip.*ceiling|excluding.*ceiling/i.test(input)) {
    result.surfaces.ceilings = false;
    extractedCount++;
  }
  if (/not.*paint.*trim|no.*trim|skip.*trim|excluding.*trim/i.test(input)) {
    result.surfaces.trim = false;
    extractedCount++;
  }
  if (/not.*paint.*door|no.*door|skip.*door|excluding.*door/i.test(input)) {
    result.surfaces.doors = false;
    extractedCount++;
  }
  if (/not.*paint.*window|no.*window|skip.*window|excluding.*window/i.test(input)) {
    result.surfaces.windows = false;
    extractedCount++;
  }

  // 4. Extract dimensions
  const linearFeetMatch = input.match(/(\d+)\s*linear\s*feet?/i);
  if (linearFeetMatch) {
    result.dimensions.linear_feet = parseInt(linearFeetMatch[1]);
    extractedCount++;
  }

  const ceilingHeightMatch = input.match(/(?:ceiling|height).*?(\d+)\s*feet?|(\d+)\s*feet?\s*tall|(\d+)\s*foot?\s*ceiling/i);
  if (ceilingHeightMatch) {
    result.dimensions.ceiling_height = parseInt(ceilingHeightMatch[1] || ceilingHeightMatch[2] || ceilingHeightMatch[3]);
    extractedCount++;
  }

  const totalAreaMatch = input.match(/(\d+)\s*(?:square\s*feet?|sqft|sq\s*ft)/i);
  if (totalAreaMatch) {
    result.dimensions.total_area = parseInt(totalAreaMatch[1]);
    extractedCount++;
  }

  // 5. Extract paint specifications
  const brandPatterns = [
    { pattern: /sherwin\s*williams?/i, brand: 'Sherwin Williams' },
    { pattern: /benjamin\s*moore/i, brand: 'Benjamin Moore' },
    { pattern: /behr/i, brand: 'Behr' },
    { pattern: /valspar/i, brand: 'Valspar' },
  ];
  
  for (const { pattern, brand } of brandPatterns) {
    if (pattern.test(input)) {
      result.paint_specs.brand = brand;
      extractedCount++;
      break;
    }
  }

  const finishPatterns = [
    { pattern: /eggshell/i, finish: 'Eggshell' },
    { pattern: /satin/i, finish: 'Satin' },
    { pattern: /semi-gloss/i, finish: 'Semi-Gloss' },
    { pattern: /flat/i, finish: 'Flat' },
    { pattern: /matte/i, finish: 'Matte' },
  ];
  
  for (const { pattern, finish } of finishPatterns) {
    if (pattern.test(input)) {
      result.paint_specs.finish = finish;
      extractedCount++;
      break;
    }
  }

  const priceMatch = input.match(/\$(\d+).*gallon|(\d+).*dollar.*gallon/i);
  if (priceMatch) {
    result.paint_specs.price_per_gallon = parseInt(priceMatch[1] || priceMatch[2]);
    extractedCount++;
  }

  const coverageMatch = input.match(/(\d+)\s*square\s*feet\s*per\s*gallon|spread\s*rate.*?(\d+)/i);
  if (coverageMatch) {
    result.paint_specs.coverage_per_gallon = parseInt(coverageMatch[1] || coverageMatch[2]);
    extractedCount++;
  }

  if (/no\s*primer|without\s*primer|skip\s*primer/i.test(input)) {
    result.paint_specs.primer_needed = false;
    extractedCount++;
  }

  // 6. Extract labor information
  const laborRateMatch = input.match(/\$(\d+(?:\.\d+)?)\s*(?:per\s*)?(?:square\s*foot|sqft|sq\s*ft)/i);
  if (laborRateMatch) {
    result.labor.rate_per_sqft = parseFloat(laborRateMatch[1]);
    extractedCount++;
  }

  if (/labor.*included|labour.*included|included.*labor|included.*labour/i.test(input)) {
    result.labor.included_in_sqft = true;
    extractedCount++;
  }

  // 7. Extract special requirements
  const specialRequirements = [];
  if (/no\s*primer/i.test(input)) specialRequirements.push('No primer required');
  if (/rush\s*job|urgent|asap/i.test(input)) specialRequirements.push('Rush job');
  if (/weekend/i.test(input)) specialRequirements.push('Weekend work requested');
  
  result.special_requirements = specialRequirements;
  result.extracted_count = extractedCount;

  // Determine confidence level
  if (extractedCount >= 6) {
    result.confidence_level = 'high';
  } else if (extractedCount >= 3) {
    result.confidence_level = 'medium';
  } else {
    result.confidence_level = 'low';
  }

  return result;
}

export function generateComprehensiveResponse(extracted: ComprehensiveQuoteInfo, originalInput: string): string {
  const pieces = [];
  let response = '';

  // Acknowledge what was understood
  if (extracted.customer_name && extracted.address) {
    response += `Perfect! I have **${extracted.customer_name}** at **${extracted.address}**.\n\n`;
  } else if (extracted.customer_name) {
    response += `Got it - for **${extracted.customer_name}**.\n\n`;
  } else if (extracted.address) {
    response += `I have the address as **${extracted.address}**.\n\n`;
  }

  // Acknowledge project details
  if (extracted.project_type) {
    response += `Project type: **${extracted.project_type} painting**\n`;
  }

  if (extracted.dimensions.linear_feet && extracted.dimensions.ceiling_height) {
    const wallArea = extracted.dimensions.linear_feet * extracted.dimensions.ceiling_height;
    response += `Wall area: **${extracted.dimensions.linear_feet} linear feet × ${extracted.dimensions.ceiling_height}ft = ${wallArea.toLocaleString()} sqft**\n`;
  } else if (extracted.dimensions.linear_feet) {
    response += `Linear footage: **${extracted.dimensions.linear_feet} feet**\n`;
  }

  // Acknowledge surface selections/exclusions
  const excludedSurfaces = [];
  if (!extracted.surfaces.ceilings) excludedSurfaces.push('ceilings');
  if (!extracted.surfaces.trim) excludedSurfaces.push('trim');
  if (!extracted.surfaces.doors) excludedSurfaces.push('doors');
  if (!extracted.surfaces.windows) excludedSurfaces.push('windows');

  if (excludedSurfaces.length > 0) {
    response += `**Excluding:** ${excludedSurfaces.join(', ')}\n`;
  }

  // Acknowledge paint specs
  if (extracted.paint_specs.brand || extracted.paint_specs.finish) {
    const paintDetails = [];
    if (extracted.paint_specs.brand) paintDetails.push(extracted.paint_specs.brand);
    if (extracted.paint_specs.finish) paintDetails.push(extracted.paint_specs.finish);
    if (extracted.paint_specs.price_per_gallon) paintDetails.push(`$${extracted.paint_specs.price_per_gallon}/gallon`);
    response += `**Paint:** ${paintDetails.join(' ')}\n`;
  }

  if (!extracted.paint_specs.primer_needed) {
    response += `**No primer** required\n`;
  }

  // Acknowledge labor
  if (extracted.labor.rate_per_sqft) {
    response += `**Labor:** $${extracted.labor.rate_per_sqft}/sqft${extracted.labor.included_in_sqft ? ' (included)' : ''}\n`;
  }

  response += '\n';

  // Determine what to do next based on completeness
  if (extracted.confidence_level === 'high' && 
      extracted.customer_name && 
      extracted.address && 
      extracted.dimensions.linear_feet && 
      extracted.dimensions.ceiling_height) {
    
    response += `Excellent! I have everything needed to calculate your quote. Let me prepare the professional estimate now.`;
    
  } else if (extracted.confidence_level === 'medium') {
    const missing = [];
    if (!extracted.customer_name) missing.push('customer name');
    if (!extracted.address) missing.push('property address');
    if (!extracted.dimensions.linear_feet) missing.push('linear feet of walls');
    if (!extracted.dimensions.ceiling_height) missing.push('ceiling height');
    
    if (missing.length > 0) {
      response += `I just need a few more details:\n• ${missing.join('\n• ')}`;
    } else {
      response += `Great! Let me select the paint products and calculate your quote.`;
    }
    
  } else {
    response += `I captured some details, but could you help me with the basic information?\n\n**What's the customer name and property address?**`;
  }

  return response;
}

// Helper function to check if input should use comprehensive parsing
export function shouldUseComprehensiveParsing(input: string): boolean {
  const indicators = [
    /\d+.*linear.*feet/i,
    /\d+.*foot|feet.*tall|ceiling/i,
    /interior|exterior/i,
    /not.*paint|don't.*paint|excluding/i,
    /\$.*gallon|gallon.*\$/i,
    /sherwin|benjamin|behr|valspar/i,
    /eggshell|satin|semi-gloss|flat/i,
    /labor|labour.*\$/i,
    /at\s+\d+/i, // Address pattern
  ];

  const matches = indicators.filter(pattern => pattern.test(input)).length;
  return matches >= 2; // Use comprehensive parsing if 2+ indicators found
}