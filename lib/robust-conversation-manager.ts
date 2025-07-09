/**
 * Robust Conversation State Manager
 * 
 * Fixes AI conversation loops, stuck states, and provides fallback mechanisms
 * Handles edge cases when users say "yes", give ambiguous responses, or when APIs fail
 */

import { validateInput } from './validation-schemas';
import { InputSanitizer } from './enhanced-input-sanitization';
import { z } from 'zod';

export interface ConversationState {
  sessionId: string;
  companyId: number;
  currentStep: string;
  previousStep?: string;
  context: Record<string, any>;
  messages: ConversationMessage[];
  quoteData: Partial<QuoteData>;
  metadata: {
    startTime: number;
    lastActivity: number;
    retryCount: number;
    maxRetries: number;
    isStuck: boolean;
    loopDetection: {
      lastMessages: string[];
      repeatedCount: number;
    };
  };
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  step?: string;
  retryCount?: number;
}

export interface QuoteData {
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  projectType: 'interior' | 'exterior' | 'both';
  rooms: Array<{
    name: string;
    type: string;
    wallsSquareFootage: number;
    ceilingsSquareFootage: number;
    trimSquareFootage: number;
  }>;
  paintQuality: 'good' | 'better' | 'best' | 'premium';
  specialRequests?: string;
  timeline?: string;
  measurements: {
    totalWallsSqft: number;
    totalCeilingsSqft: number;
    totalTrimSqft: number;
  };
  pricing: {
    wallsRate: number;
    ceilingsRate: number;
    trimRate: number;
    markupPercentage: number;
  };
  totals: {
    subtotal: number;
    tax: number;
    finalPrice: number;
  };
}

export interface StepDefinition {
  id: string;
  name: string;
  prompt: string;
  required: boolean;
  validator?: (input: string, context: any) => { valid: boolean; message?: string; };
  nextStep?: string | ((context: any) => string);
  maxRetries: number;
  fallbackAction?: (context: any) => any;
}

export class RobustConversationManager {
  private conversations = new Map<string, ConversationState>();
  private readonly MAX_CONVERSATION_TIME = 30 * 60 * 1000; // 30 minutes
  private readonly MAX_MESSAGES = 100;
  private readonly LOOP_DETECTION_THRESHOLD = 3;
  private readonly STUCK_DETECTION_THRESHOLD = 5;

  // Define conversation flow steps
  private readonly CONVERSATION_STEPS: StepDefinition[] = [
    {
      id: 'welcome',
      name: 'Welcome & Customer Name',
      prompt: "Hi! I'm here to help create your painting quote. What's the customer's name for this project?",
      required: true,
      validator: this.validateCustomerName,
      nextStep: 'project_type',
      maxRetries: 3,
      fallbackAction: (context) => ({ customerName: 'Customer' })
    },
    {
      id: 'project_type',
      name: 'Project Type',
      prompt: "What type of project is this? Interior painting, exterior painting, or both?",
      required: true,
      validator: this.validateProjectType,
      nextStep: 'address',
      maxRetries: 3,
      fallbackAction: (context) => ({ projectType: 'interior' })
    },
    {
      id: 'address',
      name: 'Property Address',
      prompt: "What's the property address where the painting will be done?",
      required: true,
      validator: this.validateAddress,
      nextStep: 'rooms',
      maxRetries: 3
    },
    {
      id: 'rooms',
      name: 'Room Information',
      prompt: "Tell me about the rooms that need painting. Which rooms and approximately how many square feet for each?",
      required: true,
      validator: this.validateRooms,
      nextStep: 'paint_quality',
      maxRetries: 4
    },
    {
      id: 'paint_quality',
      name: 'Paint Quality',
      prompt: "What paint quality level would you like? Good (builder grade), Better (mid-range), Best (premium), or Premium (top-tier)?",
      required: true,
      validator: this.validatePaintQuality,
      nextStep: 'special_requests',
      maxRetries: 3,
      fallbackAction: (context) => ({ paintQuality: 'better' })
    },
    {
      id: 'special_requests',
      name: 'Special Requests',
      prompt: "Any special requests or specific requirements for this project? (prep work, specific colors, timeline, etc.)",
      required: false,
      validator: () => ({ valid: true }),
      nextStep: 'review',
      maxRetries: 2
    },
    {
      id: 'review',
      name: 'Review & Finalize',
      prompt: "Let me review your quote details and calculate the final pricing...",
      required: true,
      validator: () => ({ valid: true }),
      nextStep: 'complete',
      maxRetries: 2
    }
  ];

  /**
   * Initialize a new conversation
   */
  initializeConversation(sessionId: string, companyId: number): ConversationState {
    const conversation: ConversationState = {
      sessionId,
      companyId,
      currentStep: 'welcome',
      context: {},
      messages: [],
      quoteData: {},
      metadata: {
        startTime: Date.now(),
        lastActivity: Date.now(),
        retryCount: 0,
        maxRetries: 10,
        isStuck: false,
        loopDetection: {
          lastMessages: [],
          repeatedCount: 0
        }
      }
    };

    this.conversations.set(sessionId, conversation);
    return conversation;
  }

  /**
   * Process user input and advance conversation
   */
  async processInput(
    sessionId: string,
    userInput: string,
    apiProvider: 'openrouter' | 'gemini' = 'gemini'
  ): Promise<{
    success: boolean;
    response: string;
    isComplete: boolean;
    quoteData?: Partial<QuoteData>;
    error?: string;
    suggestedActions?: string[];
  }> {
    try {
      let conversation = this.conversations.get(sessionId);
      
      if (!conversation) {
        return {
          success: false,
          response: "Session expired. Please start a new quote.",
          isComplete: false,
          error: "Session not found"
        };
      }

      // Update activity timestamp
      conversation.metadata.lastActivity = Date.now();

      // Check for conversation timeout
      if (this.isConversationExpired(conversation)) {
        this.conversations.delete(sessionId);
        return {
          success: false,
          response: "Your quote session has expired. Please start a new quote.",
          isComplete: false,
          error: "Session expired"
        };
      }

      // Sanitize user input
      const sanitizedInput = InputSanitizer.sanitizeString(userInput);

      // Detect and handle loops
      const loopDetected = this.detectLoop(conversation, sanitizedInput);
      if (loopDetected) {
        return this.handleLoop(conversation);
      }

      // Detect stuck state
      if (this.detectStuckState(conversation)) {
        return this.handleStuckState(conversation);
      }

      // Add user message to conversation
      this.addMessage(conversation, 'user', sanitizedInput);

      // Process the current step
      const result = await this.processCurrentStep(conversation, sanitizedInput, apiProvider);

      // Update conversation state
      this.conversations.set(sessionId, conversation);

      return result;

    } catch (error) {
      console.error('Conversation processing error:', error);
      return {
        success: false,
        response: "I'm having trouble processing your request. Let me help you start over or contact support.",
        isComplete: false,
        error: "Processing error",
        suggestedActions: [
          "Start a new quote",
          "Contact support",
          "Try again with simpler language"
        ]
      };
    }
  }

  /**
   * Process the current conversation step
   */
  private async processCurrentStep(
    conversation: ConversationState,
    userInput: string,
    apiProvider: 'openrouter' | 'gemini'
  ): Promise<{
    success: boolean;
    response: string;
    isComplete: boolean;
    quoteData?: Partial<QuoteData>;
  }> {
    const currentStep = this.CONVERSATION_STEPS.find(step => step.id === conversation.currentStep);
    
    if (!currentStep) {
      return this.handleInvalidStep(conversation);
    }

    // Handle ambiguous responses like "yes", "ok", "sure"
    const processedInput = this.processAmbiguousInput(userInput, conversation.context, currentStep);

    // Validate the input for current step
    let validation: { valid: boolean; message?: string } = { valid: true, message: undefined };
    if (currentStep.validator) {
      validation = currentStep.validator(processedInput, conversation.context);
    }

    if (!validation.valid) {
      conversation.metadata.retryCount++;
      
      if (conversation.metadata.retryCount >= currentStep.maxRetries) {
        // Apply fallback action if available
        if (currentStep.fallbackAction) {
          const fallbackData = currentStep.fallbackAction(conversation.context);
          Object.assign(conversation.quoteData, fallbackData);
          
          return this.advanceToNextStep(conversation, apiProvider);
        } else {
          return this.handleMaxRetriesExceeded(conversation, currentStep);
        }
      }

      const retryMessage = validation.message || 
        `I didn't quite understand that. ${currentStep.prompt} (Attempt ${conversation.metadata.retryCount}/${currentStep.maxRetries})`;

      this.addMessage(conversation, 'assistant', retryMessage);
      
      return {
        success: true,
        response: retryMessage,
        isComplete: false
      };
    }

    // Valid input - extract data and advance
    this.extractDataFromInput(conversation, processedInput, currentStep);
    conversation.metadata.retryCount = 0; // Reset retry count on success

    return this.advanceToNextStep(conversation, apiProvider);
  }

  /**
   * Handle ambiguous user inputs like "yes", "ok", "sure"
   */
  private processAmbiguousInput(input: string, context: any, step: StepDefinition): string {
    const ambiguousPatterns = /^(yes|yeah|yep|ok|okay|sure|correct|right|that's right|sounds good)\.?$/i;
    
    if (ambiguousPatterns.test(input.trim())) {
      // Use context to provide a meaningful response
      switch (step.id) {
        case 'project_type':
          return context.suggestedProjectType || 'interior';
        case 'paint_quality':
          return context.suggestedPaintQuality || 'better';
        case 'rooms':
          return context.suggestedRooms || 'living room, 400 square feet';
        default:
          // For other steps, return a generic placeholder that validators can handle
          return `Confirmed: ${input}`;
      }
    }

    return input;
  }

  /**
   * Detect conversation loops
   */
  private detectLoop(conversation: ConversationState, input: string): boolean {
    const { loopDetection } = conversation.metadata;
    
    loopDetection.lastMessages.push(input.toLowerCase().trim());
    
    // Keep only last 5 messages for loop detection
    if (loopDetection.lastMessages.length > 5) {
      loopDetection.lastMessages.shift();
    }

    // Check for repeated patterns
    if (loopDetection.lastMessages.length >= 3) {
      const lastThree = loopDetection.lastMessages.slice(-3);
      const isRepeating = lastThree.every(msg => msg === lastThree[0]);
      
      if (isRepeating) {
        loopDetection.repeatedCount++;
        return loopDetection.repeatedCount >= this.LOOP_DETECTION_THRESHOLD;
      }
    }

    loopDetection.repeatedCount = 0;
    return false;
  }

  /**
   * Handle detected conversation loop
   */
  private handleLoop(conversation: ConversationState): {
    success: boolean;
    response: string;
    isComplete: boolean;
    suggestedActions: string[];
  } {
    const currentStep = this.CONVERSATION_STEPS.find(step => step.id === conversation.currentStep);
    
    const response = `I notice we're going in circles. Let me help you differently. ${currentStep?.prompt || 'What would you like to do?'}`;
    
    this.addMessage(conversation, 'assistant', response);
    
    // Reset loop detection
    conversation.metadata.loopDetection.lastMessages = [];
    conversation.metadata.loopDetection.repeatedCount = 0;
    
    return {
      success: true,
      response,
      isComplete: false,
      suggestedActions: [
        "Try a different approach",
        "Skip this step",
        "Start over",
        "Get help"
      ]
    };
  }

  /**
   * Detect stuck conversation state
   */
  private detectStuckState(conversation: ConversationState): boolean {
    return conversation.metadata.retryCount >= this.STUCK_DETECTION_THRESHOLD ||
           conversation.messages.length > this.MAX_MESSAGES;
  }

  /**
   * Handle stuck conversation state
   */
  private handleStuckState(conversation: ConversationState): {
    success: boolean;
    response: string;
    isComplete: boolean;
    suggestedActions: string[];
  } {
    conversation.metadata.isStuck = true;
    
    const response = "It seems we're having trouble with this quote. Let me help you complete it with some reasonable defaults, or we can start fresh.";
    
    this.addMessage(conversation, 'assistant', response);
    
    return {
      success: true,
      response,
      isComplete: false,
      suggestedActions: [
        "Use default values and continue",
        "Start a new quote",
        "Speak to a representative",
        "Get a simple estimate"
      ]
    };
  }

  /**
   * Advance to the next conversation step
   */
  private async advanceToNextStep(
    conversation: ConversationState,
    apiProvider: 'openrouter' | 'gemini'
  ): Promise<{
    success: boolean;
    response: string;
    isComplete: boolean;
    quoteData?: Partial<QuoteData>;
  }> {
    const currentStep = this.CONVERSATION_STEPS.find(step => step.id === conversation.currentStep);
    
    if (!currentStep) {
      return this.handleInvalidStep(conversation);
    }

    // Determine next step
    let nextStepId: string;
    if (typeof currentStep.nextStep === 'function') {
      nextStepId = currentStep.nextStep(conversation.context);
    } else {
      nextStepId = currentStep.nextStep || 'complete';
    }

    // Update conversation state
    conversation.previousStep = conversation.currentStep;
    conversation.currentStep = nextStepId;

    // Check if conversation is complete
    if (nextStepId === 'complete') {
      return this.completeConversation(conversation);
    }

    // Get next step prompt
    const nextStep = this.CONVERSATION_STEPS.find(step => step.id === nextStepId);
    if (!nextStep) {
      return this.handleInvalidStep(conversation);
    }

    const response = await this.generateStepResponse(nextStep, conversation, apiProvider);
    this.addMessage(conversation, 'assistant', response);

    return {
      success: true,
      response,
      isComplete: false
    };
  }

  /**
   * Generate contextual response for conversation step
   */
  private async generateStepResponse(
    step: StepDefinition,
    conversation: ConversationState,
    apiProvider: 'openrouter' | 'gemini'
  ): Promise<string> {
    // For now, return the step prompt with context
    // In a full implementation, this would call the AI API
    let contextualPrompt = step.prompt;

    // Add context based on previous steps
    if (step.id === 'rooms' && conversation.quoteData.projectType) {
      contextualPrompt += ` Since this is an ${conversation.quoteData.projectType} project, please include all relevant areas.`;
    }

    if (step.id === 'review') {
      contextualPrompt = this.generateReviewSummary(conversation);
    }

    return contextualPrompt;
  }

  /**
   * Generate quote review summary
   */
  private generateReviewSummary(conversation: ConversationState): string {
    const { quoteData } = conversation;
    
    let summary = "Here's your quote summary:\n\n";
    summary += `Customer: ${quoteData.customerName || 'Customer'}\n`;
    summary += `Project: ${quoteData.projectType || 'Interior'} painting\n`;
    
    if (quoteData.address) {
      summary += `Address: ${quoteData.address}\n`;
    }
    
    if (quoteData.rooms && quoteData.rooms.length > 0) {
      summary += `Rooms: ${quoteData.rooms.map(r => r.name).join(', ')}\n`;
    }
    
    summary += `Paint Quality: ${quoteData.paintQuality || 'Better'}\n`;
    
    if (quoteData.specialRequests) {
      summary += `Special Requests: ${quoteData.specialRequests}\n`;
    }

    summary += "\nCalculating final pricing... This quote is ready for review!";
    
    return summary;
  }

  /**
   * Complete the conversation and finalize quote
   */
  private completeConversation(conversation: ConversationState): {
    success: boolean;
    response: string;
    isComplete: true;
    quoteData: Partial<QuoteData>;
  } {
    // Finalize quote data with calculated totals
    this.finalizeQuoteData(conversation);
    
    const response = "Perfect! Your quote has been completed. You can now review all the details and send it to your customer.";
    
    this.addMessage(conversation, 'assistant', response);
    
    // Clean up conversation after completion
    setTimeout(() => {
      this.conversations.delete(conversation.sessionId);
    }, 5 * 60 * 1000); // Keep for 5 minutes after completion

    return {
      success: true,
      response,
      isComplete: true,
      quoteData: conversation.quoteData
    };
  }

  /**
   * Finalize quote data with calculations
   */
  private finalizeQuoteData(conversation: ConversationState): void {
    const { quoteData } = conversation;
    
    // Calculate measurements if not already done
    if (quoteData.rooms && quoteData.rooms.length > 0) {
      const totals = quoteData.rooms.reduce((acc, room) => ({
        totalWallsSqft: acc.totalWallsSqft + room.wallsSquareFootage,
        totalCeilingsSqft: acc.totalCeilingsSqft + room.ceilingsSquareFootage,
        totalTrimSqft: acc.totalTrimSqft + room.trimSquareFootage
      }), { totalWallsSqft: 0, totalCeilingsSqft: 0, totalTrimSqft: 0 });
      
      quoteData.measurements = totals;
    }

    // Set default pricing if not provided
    if (!quoteData.pricing) {
      quoteData.pricing = {
        wallsRate: 3.50,
        ceilingsRate: 2.50,
        trimRate: 5.00,
        markupPercentage: 45
      };
    }

    // Calculate totals
    if (quoteData.measurements && quoteData.pricing) {
      const { measurements, pricing } = quoteData;
      const subtotal = 
        (measurements.totalWallsSqft * pricing.wallsRate) +
        (measurements.totalCeilingsSqft * pricing.ceilingsRate) +
        (measurements.totalTrimSqft * pricing.trimRate);
      
      const tax = subtotal * 0.08; // 8% tax
      const finalPrice = subtotal + tax;
      
      quoteData.totals = {
        subtotal,
        tax,
        finalPrice
      };
    }
  }

  // Validation methods
  private validateCustomerName(input: string): { valid: boolean; message?: string } {
    const sanitized = InputSanitizer.sanitizeCustomerName(input);
    if (sanitized.length < 2) {
      return { valid: false, message: "Please provide a valid customer name (at least 2 characters)." };
    }
    return { valid: true };
  }

  private validateProjectType(input: string): { valid: boolean; message?: string } {
    const normalized = input.toLowerCase().trim();
    const validTypes = ['interior', 'exterior', 'both', 'inside', 'outside', 'indoor', 'outdoor'];
    
    if (validTypes.some(type => normalized.includes(type))) {
      return { valid: true };
    }
    
    return { 
      valid: false, 
      message: "Please specify if this is interior painting, exterior painting, or both." 
    };
  }

  private validateAddress(input: string): { valid: boolean; message?: string } {
    const sanitized = InputSanitizer.sanitizeAddress(input);
    if (sanitized.length < 10) {
      return { valid: false, message: "Please provide a complete address for the property." };
    }
    return { valid: true };
  }

  private validateRooms(input: string): { valid: boolean; message?: string } {
    // Check if input contains room information
    const hasRoomKeywords = /\b(room|bedroom|kitchen|bathroom|living|dining|hallway|office|basement|garage|sqft|square|feet|ft)\b/i.test(input);
    const hasNumbers = /\d+/.test(input);
    
    if (!hasRoomKeywords && !hasNumbers) {
      return { 
        valid: false, 
        message: "Please tell me about the specific rooms and their approximate square footage." 
      };
    }
    
    return { valid: true };
  }

  private validatePaintQuality(input: string): { valid: boolean; message?: string } {
    const normalized = input.toLowerCase().trim();
    const validQualities = ['good', 'better', 'best', 'premium', 'builder', 'mid', 'high', 'top'];
    
    if (validQualities.some(quality => normalized.includes(quality))) {
      return { valid: true };
    }
    
    return { 
      valid: false, 
      message: "Please choose: Good (builder grade), Better (mid-range), Best (premium), or Premium (top-tier)." 
    };
  }

  // Utility methods
  private addMessage(conversation: ConversationState, role: 'user' | 'assistant' | 'system', content: string): void {
    conversation.messages.push({
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role,
      content,
      timestamp: Date.now(),
      step: conversation.currentStep
    });
  }

  private isConversationExpired(conversation: ConversationState): boolean {
    return Date.now() - conversation.metadata.lastActivity > this.MAX_CONVERSATION_TIME;
  }

  private extractDataFromInput(conversation: ConversationState, input: string, step: StepDefinition): void {
    // Extract relevant data based on the current step
    switch (step.id) {
      case 'welcome':
        conversation.quoteData.customerName = InputSanitizer.sanitizeCustomerName(input);
        break;
      case 'project_type':
        const projectType = this.extractProjectType(input);
        conversation.quoteData.projectType = projectType;
        break;
      case 'address':
        conversation.quoteData.address = InputSanitizer.sanitizeAddress(input);
        break;
      case 'rooms':
        conversation.quoteData.rooms = this.extractRoomData(input);
        break;
      case 'paint_quality':
        conversation.quoteData.paintQuality = this.extractPaintQuality(input);
        break;
      case 'special_requests':
        conversation.quoteData.specialRequests = InputSanitizer.sanitizeNotes(input);
        break;
    }
  }

  private extractProjectType(input: string): 'interior' | 'exterior' | 'both' {
    const normalized = input.toLowerCase();
    if (normalized.includes('both') || (normalized.includes('interior') && normalized.includes('exterior'))) {
      return 'both';
    }
    if (normalized.includes('exterior') || normalized.includes('outside') || normalized.includes('outdoor')) {
      return 'exterior';
    }
    return 'interior'; // Default
  }

  private extractPaintQuality(input: string): 'good' | 'better' | 'best' | 'premium' {
    const normalized = input.toLowerCase();
    if (normalized.includes('premium') || normalized.includes('top')) return 'premium';
    if (normalized.includes('best') || normalized.includes('high')) return 'best';
    if (normalized.includes('good') || normalized.includes('builder')) return 'good';
    return 'better'; // Default
  }

  private extractRoomData(input: string): Array<{
    name: string;
    type: string;
    wallsSquareFootage: number;
    ceilingsSquareFootage: number;
    trimSquareFootage: number;
  }> {
    // Simple room extraction - in practice, this would be more sophisticated
    const rooms = [];
    const roomPattern = /(living room|bedroom|kitchen|bathroom|dining room|hallway|office|basement|garage)[,\s]*(\d+)?\s*(sq\.?\s?ft\.?|square feet)?/gi;
    
    let match;
    while ((match = roomPattern.exec(input)) !== null) {
      const name = match[1];
      const sqft = parseInt(match[2]) || 300; // Default size
      
      rooms.push({
        name,
        type: name.includes('bedroom') ? 'bedroom' : name.includes('kitchen') ? 'kitchen' : 'other',
        wallsSquareFootage: sqft * 0.8, // Estimate walls as 80% of total
        ceilingsSquareFootage: sqft * 0.9, // Estimate ceiling
        trimSquareFootage: sqft * 0.2 // Estimate trim
      });
    }
    
    // If no specific rooms found, create a generic room
    if (rooms.length === 0) {
      const totalSqft = this.extractNumber(input) || 400;
      rooms.push({
        name: 'Main Area',
        type: 'other',
        wallsSquareFootage: totalSqft * 0.8,
        ceilingsSquareFootage: totalSqft * 0.9,
        trimSquareFootage: totalSqft * 0.2
      });
    }
    
    return rooms;
  }

  private extractNumber(input: string): number | null {
    const match = input.match(/\d+/);
    return match ? parseInt(match[0]) : null;
  }

  private handleInvalidStep(conversation: ConversationState): {
    success: boolean;
    response: string;
    isComplete: boolean;
    error: string;
  } {
    return {
      success: false,
      response: "I encountered an error with the quote process. Let me help you start over.",
      isComplete: false,
      error: "Invalid conversation step"
    };
  }

  private handleMaxRetriesExceeded(conversation: ConversationState, step: StepDefinition): {
    success: boolean;
    response: string;
    isComplete: boolean;
    suggestedActions: string[];
  } {
    const response = `I'm having trouble understanding your response for ${step.name}. Let me help you with this step or we can move on.`;
    
    return {
      success: true,
      response,
      isComplete: false,
      suggestedActions: [
        "Skip this step",
        "Use a default value",
        "Try explaining differently",
        "Start this step over"
      ]
    };
  }

  /**
   * Get conversation state for debugging
   */
  getConversationState(sessionId: string): ConversationState | null {
    return this.conversations.get(sessionId) || null;
  }

  /**
   * Reset conversation to a specific step
   */
  resetToStep(sessionId: string, stepId: string): boolean {
    const conversation = this.conversations.get(sessionId);
    if (!conversation) return false;

    const step = this.CONVERSATION_STEPS.find(s => s.id === stepId);
    if (!step) return false;

    conversation.currentStep = stepId;
    conversation.metadata.retryCount = 0;
    conversation.metadata.isStuck = false;
    conversation.metadata.loopDetection.lastMessages = [];
    conversation.metadata.loopDetection.repeatedCount = 0;

    return true;
  }

  /**
   * Force complete conversation with current data
   */
  forceComplete(sessionId: string): Partial<QuoteData> | null {
    const conversation = this.conversations.get(sessionId);
    if (!conversation) return null;

    this.finalizeQuoteData(conversation);
    this.conversations.delete(sessionId);

    return conversation.quoteData;
  }

  /**
   * Clean up expired conversations
   */
  cleanupExpiredConversations(): number {
    let cleaned = 0;
    const now = Date.now();

    for (const [sessionId, conversation] of this.conversations.entries()) {
      if (now - conversation.metadata.lastActivity > this.MAX_CONVERSATION_TIME) {
        this.conversations.delete(sessionId);
        cleaned++;
      }
    }

    return cleaned;
  }
}

// Export singleton instance
export const conversationManager = new RobustConversationManager();