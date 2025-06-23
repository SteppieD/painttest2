/**
 * AI-Powered Quote Analyzer
 * Progressively extracts and calculates quote data from conversation messages
 */

import type { ProgressiveQuoteData } from '@/components/ui/progressive-quote-form';

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export class AIQuoteAnalyzer {
  private quoteData: ProgressiveQuoteData = {};

  /**
   * Analyze a new message and update quote data
   */
  public analyzeMessage(message: ConversationMessage, allMessages: ConversationMessage[]): ProgressiveQuoteData {
    const content = message.content.toLowerCase();
    const fullConversation = allMessages.map(m => m.content).join(' ').toLowerCase();
    
    // Extract customer information
    this.extractCustomerInfo(content, fullConversation);
    
    // Extract project details
    this.extractProjectDetails(content, fullConversation);
    
    // Extract paint specifications
    this.extractPaintSpecs(content, fullConversation);
    
    // Extract labor and pricing
    this.extractLaborPricing(content, fullConversation);
    
    // Perform calculations
    this.calculateDerivedValues();
    
    return { ...this.quoteData };
  }

  /**
   * Get current quote data
   */
  public getQuoteData(): ProgressiveQuoteData {
    return { ...this.quoteData };
  }

  /**
   * Reset quote data
   */
  public reset(): void {
    this.quoteData = {};
  }

  private extractCustomerInfo(content: string, fullConversation: string): void {
    // Extract customer name
    const namePatterns = [
      /(?:for|customer|client)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
      /project\s+for\s+([A-Z][a-z]+)/i,
      /quote\s+for\s+([A-Z][a-z]+)/i,
      /it'?s\s+for\s+([A-Z][a-z]+)/i
    ];
    
    for (const pattern of namePatterns) {
      const match = fullConversation.match(pattern);
      if (match && match[1] && match[1].length > 1 && match[1].toLowerCase() !== 'at') {
        this.quoteData.customer_name = this.capitalizeWords(match[1].trim());
        break;
      }
    }

    // Extract address
    const addressPatterns = [
      /(\d+\s+[A-Za-z\s]+(street|st|avenue|ave|road|rd|drive|dr|way|lane|ln|court|ct|place|pl|boulevard|blvd))/i,
      /(?:address|located at|property at)[:\s]+([^.!?]+)/i,
      /at\s+(\d+\s+[A-Za-z\s]+(?:drive|dr|street|st|avenue|ave))/i
    ];
    
    for (const pattern of addressPatterns) {
      const match = fullConversation.match(pattern);
      if (match && match[1]) {
        this.quoteData.address = this.capitalizeWords(match[1].trim());
        break;
      }
    }
  }

  private extractProjectDetails(content: string, fullConversation: string): void {
    // Extract project type
    if (fullConversation.includes('exterior') && !fullConversation.includes('interior')) {
      this.quoteData.project_type = 'exterior';
    } else if (fullConversation.includes('interior') && !fullConversation.includes('exterior')) {
      this.quoteData.project_type = 'interior';
    } else if (fullConversation.includes('both') || (fullConversation.includes('interior') && fullConversation.includes('exterior'))) {
      this.quoteData.project_type = 'both';
    }

    // Extract linear feet
    const linearFeetPatterns = [
      /(\d+)\s*linear\s*feet?/i,
      /(\d+)\s*lin\s*ft/i,
      /(\d+)\s*lf/i
    ];
    
    for (const pattern of linearFeetPatterns) {
      const match = fullConversation.match(pattern);
      if (match && match[1]) {
        this.quoteData.linear_feet = parseInt(match[1]);
        break;
      }
    }

    // Extract ceiling height
    const heightPatterns = [
      /ceilings?\s+are\s+(\d+)\s*feet?\s+tall/i,
      /(\d+)\s*(?:foot|ft|feet)\s+(?:high\s+)?ceilings?/i,
      /ceiling\s+height\s+(?:is\s+)?(\d+)/i,
      /(\d+)\s*ft\s+ceilings?/i
    ];
    
    for (const pattern of heightPatterns) {
      const match = fullConversation.match(pattern);
      if (match && match[1]) {
        this.quoteData.ceiling_height = parseInt(match[1]);
        break;
      }
    }

    // Extract surfaces to paint
    const surfaces: string[] = [];
    
    // Check what surfaces are mentioned positively
    if (fullConversation.includes('wall') && !fullConversation.includes('not painting') || 
        fullConversation.includes('interior painting')) {
      surfaces.push('walls');
    }
    if (fullConversation.includes('ceiling') && !fullConversation.includes('not painting the ceiling')) {
      surfaces.push('ceilings');
    }
    if (fullConversation.includes('trim') && !fullConversation.includes('not painting') && 
        !fullConversation.includes('no trim')) {
      surfaces.push('trim');
    }
    if (fullConversation.includes('door') && !fullConversation.includes('not painting') && 
        !fullConversation.includes('no door')) {
      surfaces.push('doors');
    }
    
    // Remove surfaces that are explicitly excluded
    const exclusions = [];
    if (fullConversation.includes('not painting doors') || 
        fullConversation.includes('no doors')) {
      exclusions.push('doors');
    }
    if (fullConversation.includes('not painting the ceilings') || 
        fullConversation.includes('not painting ceilings')) {
      exclusions.push('ceilings');
    }
    if (fullConversation.includes('not painting') && fullConversation.includes('trim')) {
      exclusions.push('trim');
    }
    if (fullConversation.includes('not painting') && fullConversation.includes('windows')) {
      exclusions.push('windows');
    }

    // Filter out excluded surfaces
    const finalSurfaces = surfaces.filter(surface => !exclusions.includes(surface));
    if (finalSurfaces.length > 0) {
      this.quoteData.surfaces = finalSurfaces;
    }
  }

  private extractPaintSpecs(content: string, fullConversation: string): void {
    // Extract paint brand
    const brandPatterns = [
      /sherwin[\s-]?williams/i,
      /benjamin[\s-]?moore/i,
      /behr/i,
      /ppg/i,
      /kilz/i,
      /zinsser/i
    ];
    
    for (const pattern of brandPatterns) {
      const match = fullConversation.match(pattern);
      if (match) {
        this.quoteData.paint_brand = this.formatBrandName(match[0]);
        break;
      }
    }

    // Extract paint type
    const typePatterns = [
      /eggshell/i,
      /satin/i,
      /semi[\s-]?gloss/i,
      /gloss/i,
      /flat/i,
      /matte/i
    ];
    
    for (const pattern of typePatterns) {
      const match = fullConversation.match(pattern);
      if (match) {
        this.quoteData.paint_type = match[0].toLowerCase();
        break;
      }
    }

    // Extract cost per gallon
    const costPatterns = [
      /\$(\d+(?:\.\d{2})?)\s*(?:a|per)\s*gallon/i,
      /\$(\d+(?:\.\d{2})?)\s*\/\s*gal/i,
      /(\d+)\s*dollars?\s*(?:a|per)\s*gallon/i
    ];
    
    for (const pattern of costPatterns) {
      const match = fullConversation.match(pattern);
      if (match && match[1]) {
        this.quoteData.cost_per_gallon = parseFloat(match[1]);
        break;
      }
    }

    // Extract coverage per gallon (spread rate)
    const coveragePatterns = [
      /spread\s+rate\s+is\s+(\d+)\s*(?:square\s*feet|sq\s*ft)/i,
      /covers?\s+(\d+)\s*(?:square\s*feet|sq\s*ft)\s*per\s*gallon/i,
      /(\d+)\s*(?:square\s*feet|sq\s*ft)\s*(?:per\s*gallon|coverage)/i
    ];
    
    for (const pattern of coveragePatterns) {
      const match = fullConversation.match(pattern);
      if (match && match[1]) {
        this.quoteData.coverage_per_gallon = parseInt(match[1]);
        break;
      }
    }

    // Check if primer is needed
    if (fullConversation.includes('no primer') || fullConversation.includes('without primer')) {
      this.quoteData.needs_primer = false;
    } else if (fullConversation.includes('primer') || fullConversation.includes('prime')) {
      this.quoteData.needs_primer = true;
    }
  }

  private extractLaborPricing(content: string, fullConversation: string): void {
    // Extract labor cost per square foot
    const laborPatterns = [
      /labour?\s+(?:is\s+)?(?:included\s+)?(?:in\s+the\s+cost\s+)?(?:per\s+square\s+foot\s+)?at\s+\$?(\d+(?:\.\d{2})?)/i,
      /\$?(\d+(?:\.\d{2})?)\s*(?:per\s*)?(?:square\s*foot|sq\s*ft).*?labor/i,
      /labor.*?\$?(\d+(?:\.\d{2})?)\s*(?:per\s*)?(?:square\s*foot|sq\s*ft)/i
    ];
    
    for (const pattern of laborPatterns) {
      const match = fullConversation.match(pattern);
      if (match && match[1]) {
        this.quoteData.labor_cost_per_sqft = parseFloat(match[1]);
        break;
      }
    }

    // Extract markup percentage
    const markupPatterns = [
      /add\s+(\d+)%\s*markup/i,
      /(\d+)%\s*markup/i,
      /markup\s+(?:of\s+)?(\d+)%/i,
      /(\d+)\s*percent\s*markup/i
    ];
    
    for (const pattern of markupPatterns) {
      const match = fullConversation.match(pattern);
      if (match && match[1]) {
        this.quoteData.markup_percentage = parseInt(match[1]);
        break;
      }
    }

    // Extract timeline
    const timelinePatterns = [
      /(\d+)\s*(?:days?|weeks?)/i,
      /timeline\s+(?:is\s+)?([^.!?]+)/i
    ];
    
    for (const pattern of timelinePatterns) {
      const match = fullConversation.match(pattern);
      if (match && match[1]) {
        this.quoteData.timeline = match[1].trim();
        break;
      }
    }
  }

  private calculateDerivedValues(): void {
    // Calculate total square footage
    if (this.quoteData.linear_feet && this.quoteData.ceiling_height) {
      this.quoteData.total_sqft = this.quoteData.linear_feet * this.quoteData.ceiling_height;
    }
    
    // Calculate gallons needed
    if (this.quoteData.total_sqft && this.quoteData.coverage_per_gallon) {
      this.quoteData.gallons_needed = Math.ceil(this.quoteData.total_sqft / this.quoteData.coverage_per_gallon);
    }
    
    // Calculate material cost
    if (this.quoteData.gallons_needed && this.quoteData.cost_per_gallon) {
      this.quoteData.total_material_cost = this.quoteData.gallons_needed * this.quoteData.cost_per_gallon;
    }
    
    // Calculate labor cost
    if (this.quoteData.total_sqft && this.quoteData.labor_cost_per_sqft) {
      this.quoteData.total_labor_cost = this.quoteData.total_sqft * this.quoteData.labor_cost_per_sqft;
    }
    
    // Calculate subtotal
    if (this.quoteData.total_material_cost && this.quoteData.total_labor_cost) {
      this.quoteData.subtotal = this.quoteData.total_material_cost + this.quoteData.total_labor_cost;
    }
    
    // Calculate final amount with markup
    if (this.quoteData.subtotal && this.quoteData.markup_percentage) {
      const markupMultiplier = 1 + (this.quoteData.markup_percentage / 100);
      this.quoteData.final_quote_amount = Math.round(this.quoteData.subtotal * markupMultiplier);
    }
  }

  private capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  }

  private formatBrandName(brand: string): string {
    const normalized = brand.toLowerCase().replace(/[-\s]/g, ' ');
    if (normalized.includes('sherwin')) return 'Sherwin-Williams';
    if (normalized.includes('benjamin')) return 'Benjamin Moore';
    if (normalized.includes('behr')) return 'Behr';
    if (normalized.includes('ppg')) return 'PPG';
    if (normalized.includes('kilz')) return 'Kilz';
    if (normalized.includes('zinsser')) return 'Zinsser';
    return this.capitalizeWords(brand);
  }
}