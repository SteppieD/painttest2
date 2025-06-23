/**
 * Simple Quote Data Extractor
 * Replaces the complex universal quote detector with simple, reliable extraction
 */

import { ConversationExtractedData } from '@/types/quote';

export function extractQuoteDataFromConversation(messages: any[]): ConversationExtractedData {
  // Combine all message content
  const fullContent = messages
    .map(msg => msg.content || '')
    .join(' ')
    .toLowerCase();
  
  const extractedData: ConversationExtractedData = {
    confidence: 'low'
  };
  
  // Extract customer name - look for common patterns
  const customerPatterns = [
    /(?:customer|client):\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /for\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    /quote for\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
  ];
  
  for (const pattern of customerPatterns) {
    const match = fullContent.match(pattern);
    if (match && match[1] && match[1].length > 2) {
      extractedData.customer_name = match[1].trim();
      break;
    }
  }
  
  // Extract address
  const addressMatch = fullContent.match(/address[:\s]+([^\.]+)/i);
  if (addressMatch) {
    extractedData.address = addressMatch[1].trim();
  }
  
  // Extract project type
  if (fullContent.includes('exterior')) {
    extractedData.project_type = 'exterior';
  } else if (fullContent.includes('interior')) {
    extractedData.project_type = 'interior';
  }
  
  // Extract surfaces
  const surfaces: string[] = [];
  if (fullContent.includes('wall')) surfaces.push('walls');
  if (fullContent.includes('ceiling')) surfaces.push('ceilings');
  if (fullContent.includes('trim')) surfaces.push('trim');
  if (fullContent.includes('door')) surfaces.push('doors');
  if (fullContent.includes('cabinet')) surfaces.push('cabinets');
  
  if (surfaces.length > 0) {
    extractedData.surfaces = surfaces;
  }
  
  // Extract square footage
  const sqftMatch = fullContent.match(/([\d,]+)\s*(?:sq\s*ft|square\s*feet|sqft)/i);
  if (sqftMatch) {
    extractedData.total_sqft = parseInt(sqftMatch[1].replace(/,/g, ''));
  }
  
  // Extract room count
  const roomMatch = fullContent.match(/([\d]+)\s*(?:rooms?|bedrooms?)/i);
  if (roomMatch) {
    extractedData.room_count = parseInt(roomMatch[1]);
  }
  
  // Extract quote amount - look for dollar amounts
  const priceMatches = fullContent.match(/\$(\d{3,})/g);
  if (priceMatches) {
    // Take the largest amount found (likely the total)
    const amounts = priceMatches.map(match => parseInt(match.replace('$', '').replace(/,/g, '')));
    extractedData.quote_amount = Math.max(...amounts);
  }
  
  // Extract timeline
  const timelineMatch = fullContent.match(/(\d+)\s*(?:days?|weeks?)/i);
  if (timelineMatch) {
    extractedData.timeline = timelineMatch[0];
  }
  
  // Determine confidence based on how much data we extracted
  let dataPoints = 0;
  if (extractedData.customer_name) dataPoints++;
  if (extractedData.quote_amount && extractedData.quote_amount > 100) dataPoints++;
  if (extractedData.address) dataPoints++;
  if (extractedData.project_type) dataPoints++;
  if (extractedData.surfaces && extractedData.surfaces.length > 0) dataPoints++;
  
  if (dataPoints >= 4) {
    extractedData.confidence = 'high';
  } else if (dataPoints >= 2) {
    extractedData.confidence = 'medium';
  }
  
  console.log('📋 Simple extraction result:', extractedData);
  return extractedData;
}

/**
 * Check if conversation has enough data to suggest creating a quote
 */
export function hasQuoteWorthyContent(messages: any[]): boolean {
  const extracted = extractQuoteDataFromConversation(messages);
  
  // Suggest quote creation if we have at least a customer name and some pricing info
  return !!(
    extracted.customer_name && 
    (extracted.quote_amount || messages.some(msg => 
      msg.content?.toLowerCase().includes('total') || 
      msg.content?.toLowerCase().includes('cost') ||
      msg.content?.toLowerCase().includes('price')
    ))
  );
}