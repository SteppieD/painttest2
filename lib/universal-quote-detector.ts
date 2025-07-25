/**
 * Universal Quote Detection System
 * 
 * Detects and extracts quote data from ANY chat message format including:
 * - Professional calculator quotes (complex)
 * - Manual AI quotes (simple)
 * - User-typed quotes (basic)
 */

export interface DetectedQuote {
  isQuote: boolean;
  confidence: 'high' | 'medium' | 'low';
  customerName?: string;
  address?: string;
  projectType?: string;
  totalCost?: number;
  breakdown?: {
    materials?: number;
    labor?: number;
    markup?: number;
  };
  surfaces?: string[];
  sqft?: number;
  rooms?: number;
  timeline?: string;
  extractedData: any;
}

/**
 * Detects if a message contains a quote and extracts all relevant data
 */
export function detectAndExtractQuote(content: string): DetectedQuote {
  const lowerContent = content.toLowerCase();
  console.log('🎯 Universal Quote Detection - Input content length:', content.length);
  console.log('🎯 First 200 chars:', content.substring(0, 200));
  
  // High confidence indicators (professional calculator quotes)
  const highConfidenceIndicators = [
    'total project cost:',
    'quote ready to send!',
    'professional quote complete',
    'final price:',
    'customer pays:',
    'markup amount:',
    'materials cost:',
    'labor cost:'
  ];
  
  // Medium confidence indicators (AI generated quotes)
  const mediumConfidenceIndicators = [
    'total cost:',
    'project total:',
    'estimate:',
    'quote for',
    'painting project',
    'labor:',
    'materials:',
    'paint cost:',
    'total estimate:',
    'project cost:',
    'sq ft',
    'square feet',
    'gallons',
    'rooms'
  ];
  
  // Low confidence indicators (basic quotes)
  const lowConfidenceIndicators = [
    '$',
    'cost',
    'price',
    'painting',
    'room',
    'wall',
    'ceiling',
    'customer',
    'address',
    'interior',
    'exterior'
  ];
  
  // Check for high confidence
  const foundHighIndicators = highConfidenceIndicators.filter(indicator => lowerContent.includes(indicator));
  console.log('🎯 High confidence indicators found:', foundHighIndicators);
  
  if (foundHighIndicators.length > 0) {
    const result = extractProfessionalQuote(content);
    console.log('🎯 Professional quote extraction result:', result);
    return result;
  }
  
  // Check for medium confidence (AI quotes)
  const mediumMatches = mediumConfidenceIndicators.filter(indicator => 
    lowerContent.includes(indicator)
  );
  console.log('🎯 Medium confidence indicators found:', mediumMatches);
  
  if (mediumMatches.length >= 3) {
    const result = extractAIQuote(content);
    console.log('🎯 AI quote extraction result:', result);
    return result;
  }
  
  // Check for low confidence (basic quotes)
  const lowMatches = lowConfidenceIndicators.filter(indicator => 
    lowerContent.includes(indicator)
  );
  const hasCostMentioned = hasCostMention(content);
  console.log('🎯 Low confidence indicators found:', lowMatches);
  console.log('🎯 Has cost mention:', hasCostMentioned);
  
  if (lowMatches.length >= 4 && hasCostMentioned) {
    const result = extractBasicQuote(content);
    console.log('🎯 Basic quote extraction result:', result);
    return result;
  }
  
  console.log('🎯 No quote detected - returning false');
  return {
    isQuote: false,
    confidence: 'low',
    extractedData: {}
  };
}

/**
 * Extract data from professional calculator quotes
 */
function extractProfessionalQuote(content: string): DetectedQuote {
  const data: any = {};
  
  // Extract customer name
  const customerMatch = content.match(/\*\*Customer:\*\*\s*([^\n\*]+)/i) ||
                       content.match(/Customer:\s*([^\n\*]+)/i);
  if (customerMatch) {
    const potentialName = customerMatch[1].trim();
    
    // Avoid extracting header text as customer names
    const excludePatterns = [
      /quote\s+summary/i,
      /project\s+overview/i,
      /estimate\s+breakdown/i,
      /cost\s+breakdown/i,
      /paint\s+summary/i,
      /professional\s+painting/i
    ];
    
    const isExcluded = excludePatterns.some(pattern => pattern.test(potentialName));
    
    if (!isExcluded && potentialName.length > 2) {
      data.customerName = potentialName;
    }
  }
  
  // Extract address
  const addressMatch = content.match(/\*\*Address:\*\*\s*([^\n\*]+)/i) ||
                      content.match(/Address:\s*([^\n\*]+)/i);
  if (addressMatch) {
    data.address = addressMatch[1].trim();
  }
  
  // Extract total cost
  const totalCostMatch = content.match(/\*\*TOTAL PROJECT COST:\*\*\s*\$?([\d,]+)/i) ||
                        content.match(/TOTAL PROJECT COST:\s*\$?([\d,]+)/i) ||
                        content.match(/Customer Price:\s*\$?([\d,]+)/i);
  if (totalCostMatch) {
    data.totalCost = parseInt(totalCostMatch[1].replace(/,/g, ''));
  }
  
  // Extract materials cost
  const materialsMatch = content.match(/Materials:\s*\$?([\d,]+)/i);
  if (materialsMatch) {
    data.breakdown = data.breakdown || {};
    data.breakdown.materials = parseInt(materialsMatch[1].replace(/,/g, ''));
  }
  
  // Extract labor cost
  const laborMatch = content.match(/Labor:\s*\$?([\d,]+)/i);
  if (laborMatch) {
    data.breakdown = data.breakdown || {};
    data.breakdown.labor = parseInt(laborMatch[1].replace(/,/g, ''));
  }
  
  // Extract markup
  const markupMatch = content.match(/Your Profit:\s*\$?([\d,]+)/i) ||
                     content.match(/Markup.*:\s*\$?([\d,]+)/i);
  if (markupMatch) {
    data.breakdown = data.breakdown || {};
    data.breakdown.markup = parseInt(markupMatch[1].replace(/,/g, ''));
  }
  
  return {
    isQuote: true,
    confidence: 'high',
    ...data,
    extractedData: data
  };
}

/**
 * Extract data from AI-generated quotes
 */
function extractAIQuote(content: string): DetectedQuote {
  const data: any = {};
  
  // Extract customer info - flexible patterns with exclusions
  const customerPatterns = [
    /(?:customer|client):\s*([^\n,]+)/i,
    /for\s+([A-Z][a-z]+)(?:\s+at\s+)/i, // "for Cici at"
    /breakdown for\s+([A-Z][a-z]+)/i, // "breakdown for Cici"
    /quote for\s+([^,\n]+)/i,
    /^([A-Z][a-z]+\s+[A-Z][a-z]+)/m // Name pattern at start of line
  ];
  
  // Exclusion patterns - avoid extracting these as customer names
  const excludePatterns = [
    /quote\s+summary/i,
    /project\s+overview/i,
    /estimate\s+breakdown/i,
    /cost\s+breakdown/i,
    /paint\s+summary/i,
    /total\s+cost/i,
    /final\s+price/i,
    /your\s+quote/i,
    /professional\s+painting/i
  ];
  
  for (const pattern of customerPatterns) {
    const match = content.match(pattern);
    if (match && match[1].trim().length > 2) {
      const potentialName = match[1].trim();
      
      // Check if this matches any exclusion patterns
      const isExcluded = excludePatterns.some(excludePattern => 
        excludePattern.test(potentialName)
      );
      
      if (!isExcluded) {
        data.customerName = potentialName;
        break;
      }
    }
  }
  
  // Extract address - flexible patterns
  const addressPatterns = [
    /address:\s*([^\n]+)/i,
    /at\s+(\d+[^,\n]+)/i,
    /location:\s*([^\n]+)/i,
    /(?:living|located)\s+at\s+([^\n,]+)/i
  ];
  
  for (const pattern of addressPatterns) {
    const match = content.match(pattern);
    if (match) {
      data.address = match[1].trim();
      break;
    }
  }
  
  // Extract total cost - multiple patterns with labor cost priority
  const costPatterns = [
    /total cost:\s*\$?([\d,]+)/i,
    /total estimate:\s*\$?([\d,]+)/i,
    /project total:\s*\$?([\d,]+)/i,
    /estimate:\s*\$?([\d,]+)/i,
    /total.*:\s*\$?([\d,]+)/i,
    /\$?([\d,]+)\s*total/i
  ];
  
  // Also check for labor costs as potential total - look for the result after equals
  const laborCostMatch = content.match(/labor:.*?=\s*\$?([\d,]+)/i) || 
                         content.match(/labor.*:\s*\$?([\d,]+)/i);
  
  // Try to find explicit total first
  for (const pattern of costPatterns) {
    const match = content.match(pattern);
    if (match) {
      const cost = parseInt(match[1].replace(/,/g, ''));
      if (cost > 100) { // Reasonable minimum for a painting quote
        data.totalCost = cost;
        break;
      }
    }
  }
  
  // If no explicit total found but labor cost exists, use that
  if (!data.totalCost && laborCostMatch) {
    const laborCost = parseInt(laborCostMatch[1].replace(/,/g, ''));
    if (laborCost > 100) {
      data.totalCost = laborCost;
    }
  }
  
  // Extract breakdown if available
  const materialsMatch = content.match(/materials?:\s*\$?([\d,]+)/i);
  const laborMatch = content.match(/labor:.*?=\s*\$?([\d,]+)/i) || 
                     content.match(/labor.*:\s*\$?([\d,]+)/i);
  const paintMatch = content.match(/paint:\s*\$?([\d,]+)/i);
  
  if (materialsMatch || laborMatch || paintMatch) {
    data.breakdown = {};
    if (materialsMatch) data.breakdown.materials = parseInt(materialsMatch[1].replace(/,/g, ''));
    if (laborMatch) data.breakdown.labor = parseInt(laborMatch[1].replace(/,/g, ''));
    if (paintMatch && !data.breakdown.materials) data.breakdown.materials = parseInt(paintMatch[1].replace(/,/g, ''));
  }
  
  // Extract square footage
  const sqftMatch = content.match(/([\d,]+)\s*(?:sq\s*ft|square\s*feet)/i);
  if (sqftMatch) {
    data.sqft = parseInt(sqftMatch[1].replace(/,/g, ''));
  }
  
  // Extract room count
  const roomMatch = content.match(/([\d]+)\s*(?:rooms?|bedrooms?)/i);
  if (roomMatch) {
    data.rooms = parseInt(roomMatch[1]);
  }
  
  // Determine project type
  if (content.toLowerCase().includes('exterior')) {
    data.projectType = 'exterior';
  } else if (content.toLowerCase().includes('interior')) {
    data.projectType = 'interior';
  }
  
  return {
    isQuote: true,
    confidence: 'medium',
    ...data,
    extractedData: data
  };
}

/**
 * Extract data from basic/manual quotes
 */
function extractBasicQuote(content: string): DetectedQuote {
  const data: any = {};
  
  // Basic cost extraction
  const costMatches = content.match(/\$(\d{3,})/g); // At least $100
  if (costMatches) {
    const costs = costMatches.map(match => parseInt(match.replace('$', '').replace(/,/g, '')));
    data.totalCost = Math.max(...costs); // Take the highest cost as likely total
  }
  
  // Basic customer name extraction
  const nameMatch = content.match(/([A-Z][a-z]+\s+[A-Z][a-z]+)/);
  if (nameMatch) {
    data.customerName = nameMatch[1];
  }
  
  // Basic project type
  if (content.toLowerCase().includes('painting')) {
    data.projectType = content.toLowerCase().includes('exterior') ? 'exterior' : 'interior';
  }
  
  return {
    isQuote: true,
    confidence: 'low',
    ...data,
    extractedData: data
  };
}

/**
 * Check if content mentions cost/pricing
 */
function hasCostMention(content: string): boolean {
  const costIndicators = [
    /\$\d+/,
    /\d+\s*dollars?/i,
    /cost/i,
    /price/i,
    /estimate/i,
    /quote/i,
    /total/i
  ];
  
  return costIndicators.some(pattern => pattern.test(content));
}

/**
 * Smart learning extraction - extracts learning data for profile building
 */
export function extractLearningData(content: string): any {
  const learningData: any = {};
  
  // Extract paint products mentioned
  const paintBrands = [
    'sherwin', 'benjamin moore', 'behr', 'valspar', 'kilz', 'zinsser', 'proclassic', 'duration', 'superpaint'
  ];
  
  paintBrands.forEach(brand => {
    if (content.toLowerCase().includes(brand)) {
      learningData.paintBrands = learningData.paintBrands || [];
      learningData.paintBrands.push(brand);
    }
  });
  
  // Extract rates mentioned
  const rateMatches = content.match(/\$(\d+(?:\.\d{2})?)\s*(?:per\s+)?(?:sq\s*ft|square\s*foot|sqft)/gi);
  if (rateMatches) {
    learningData.rates = rateMatches.map(match => {
      const rate = parseFloat(match.replace(/[^0-9.]/g, ''));
      return { rate, context: match };
    });
  }
  
  // Extract markup percentages
  const markupMatch = content.match(/(\d+)%\s*markup/i);
  if (markupMatch) {
    learningData.preferredMarkup = parseInt(markupMatch[1]);
  }
  
  return learningData;
}