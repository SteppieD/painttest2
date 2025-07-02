/**
 * Enhanced Conversation State Management
 * 
 * Fixes conversation loops, AI stuck states, and ambiguous response handling
 */

export interface ConversationState {
  stage: 'gathering_info' | 'quote_generated' | 'awaiting_confirmation' | 'quote_saved' | 'needs_clarification' | 'error_recovery';
  lastQuote?: any;
  lastQuoteSummary?: string;
  customerInfo?: {
    customer_name: string;
    address: string;
    email?: string;
    phone?: string;
  };
  collectedData?: {
    projectType?: string;
    surfaces?: string[];
    measurements?: any;
    paintProducts?: any[];
  };
  attemptCount: number;
  lastUserInput?: string;
  clarificationNeeded?: string;
  timestamp: number;
  sessionId: string;
}

export interface ConversationResult {
  shouldProcess: boolean;
  responseOverride?: string;
  newStage?: ConversationState['stage'];
  errorMessage?: string;
}

export class EnhancedConversationStateManager {
  private states: Map<string, ConversationState> = new Map();
  private readonly MAX_ATTEMPTS = 3;
  private readonly SESSION_TIMEOUT = 3600000; // 1 hour

  /**
   * Initialize or update conversation state with enhanced tracking
   */
  setState(sessionId: string, state: Partial<ConversationState>): void {
    const existing = this.states.get(sessionId) || {
      stage: 'gathering_info',
      attemptCount: 0,
      timestamp: Date.now(),
      sessionId
    };

    // Reset attempt count if stage changes
    const resetAttemptCount = state.stage && state.stage !== existing.stage;

    this.states.set(sessionId, {
      ...existing,
      ...state,
      attemptCount: resetAttemptCount ? 0 : (state.attemptCount || existing.attemptCount),
      timestamp: Date.now()
    });

    console.log(`🔄 Conversation state updated for ${sessionId}:`, {
      stage: this.states.get(sessionId)?.stage,
      attemptCount: this.states.get(sessionId)?.attemptCount
    });
  }

  /**
   * Get current conversation state with auto-cleanup
   */
  getState(sessionId: string): ConversationState | null {
    const state = this.states.get(sessionId);
    
    // Clean up old states
    if (state && Date.now() - state.timestamp > this.SESSION_TIMEOUT) {
      this.states.delete(sessionId);
      return null;
    }
    
    return state;
  }

  /**
   * Enhanced confirmation response detection with context awareness
   */
  isConfirmationResponse(input: string, conversationState?: ConversationState): boolean {
    const lower = input.toLowerCase().trim();
    
    // If we just generated a quote, be more generous with confirmation detection
    const inQuoteContext = conversationState?.stage === 'awaiting_confirmation';
    
    const strongYesResponses = [
      'yes', 'yeah', 'yep', 'ok', 'okay', 'sure', 'correct', 'right',
      'good', 'fine', 'approve', 'accept', 'confirm', 'save', 'proceed',
      'go ahead', 'looks good', 'perfect', 'great', 'absolutely', 'exactly'
    ];
    
    const weakYesResponses = [
      'that works', 'sounds good', 'looks right', 'all good', 'correct',
      'accurate', 'yes please', 'please save', 'save it', 'send it'
    ];

    // Check for strong confirmations (always valid)
    for (const yes of strongYesResponses) {
      if (lower === yes || lower.startsWith(yes + ' ') || lower.endsWith(' ' + yes)) {
        return true;
      }
    }

    // Check for weak confirmations (only in quote context)
    if (inQuoteContext) {
      for (const yes of weakYesResponses) {
        if (lower.includes(yes)) {
          return true;
        }
      }
    }

    // Detect implicit confirmations in quote context
    if (inQuoteContext) {
      // If input doesn't contain new information, treat as confirmation
      const hasNewInfo = this.containsNewInformation(input);
      if (!hasNewInfo && input.length < 50) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Enhanced rejection response detection
   */
  isRejectionResponse(input: string): boolean {
    const lower = input.toLowerCase().trim();
    
    const noResponses = [
      'no', 'nope', 'not', 'cancel', 'stop', 'wait', 'hold on',
      'wrong', 'incorrect', 'change', 'edit', 'modify', 'different',
      'back', 'redo', 'restart', 'fix', 'update', 'revise'
    ];
    
    // Strong rejection indicators
    for (const no of noResponses) {
      if (lower === no || lower.startsWith(no + ' ') || lower.endsWith(' ' + no)) {
        return true;
      }
    }

    // Look for correction phrases
    const correctionPhrases = [
      'actually', 'instead', 'rather', 'should be', 'make it', 'change to'
    ];

    return correctionPhrases.some(phrase => lower.includes(phrase));
  }

  /**
   * Check if input contains new information (not just confirmation)
   */
  private containsNewInformation(input: string): boolean {
    const lower = input.toLowerCase();
    
    // Patterns that indicate new information
    const newInfoPatterns = [
      /\d+/,  // Numbers
      /customer|client|name/,  // Customer info
      /address|street|road|avenue/,  // Address info
      /paint|color|gallon/,  // Paint info
      /room|bedroom|bathroom|kitchen/,  // Room info
      /linear|feet|sqft|square/,  // Measurements
      /interior|exterior/  // Project type
    ];

    return newInfoPatterns.some(pattern => pattern.test(lower));
  }

  /**
   * Handle conversation loops and stuck states
   */
  checkForLoop(sessionId: string, userInput: string): ConversationResult {
    const state = this.getState(sessionId);
    
    if (!state) {
      return { shouldProcess: true };
    }

    // Check if user is repeating the same input
    if (state.lastUserInput === userInput.trim()) {
      state.attemptCount++;
      
      if (state.attemptCount >= this.MAX_ATTEMPTS) {
        return {
          shouldProcess: false,
          responseOverride: "I notice we're going in circles. Let me help you start fresh. Could you tell me the customer's name and project address?",
          newStage: 'error_recovery'
        };
      }
    }

    // Check if we're stuck in gathering_info stage too long
    if (state.stage === 'gathering_info' && state.attemptCount > 5) {
      return {
        shouldProcess: false,
        responseOverride: "It seems like we're having trouble collecting all the information needed. Let's try a different approach. Can you provide:\n\n1. Customer name\n2. Property address\n3. Type of project (interior/exterior)\n4. Approximate square footage or room count\n\nExample: 'Sarah Johnson, 123 Main St, interior painting, 2 bedrooms'",
        newStage: 'needs_clarification'
      };
    }

    // Update last input
    this.setState(sessionId, { 
      lastUserInput: userInput.trim(),
      attemptCount: state.attemptCount + 1
    });

    return { shouldProcess: true };
  }

  /**
   * Handle ambiguous responses with context
   */
  handleAmbiguousResponse(sessionId: string, userInput: string): ConversationResult {
    const state = this.getState(sessionId);
    
    if (!state) {
      return { shouldProcess: true };
    }

    const lower = userInput.toLowerCase().trim();

    // Very short responses that could be ambiguous
    if (userInput.length <= 3 && !['yes', 'no', 'ok'].includes(lower)) {
      return {
        shouldProcess: false,
        responseOverride: `I received "${userInput}" but I'm not sure what you mean. Could you please be more specific?`,
        newStage: 'needs_clarification'
      };
    }

    // Common ambiguous responses in context
    const ambiguousInContext: Record<string, string> = {
      'that': 'Could you be more specific about what you\'re referring to?',
      'it': 'What specifically are you referring to?',
      'this': 'Could you clarify what you mean by "this"?',
      'those': 'Which items are you referring to?',
      'them': 'Could you be more specific about what you mean?'
    };

    if (ambiguousInContext[lower]) {
      return {
        shouldProcess: false,
        responseOverride: ambiguousInContext[lower],
        newStage: 'needs_clarification'
      };
    }

    return { shouldProcess: true };
  }

  /**
   * Recovery mechanism for stuck conversations
   */
  recoverConversation(sessionId: string): string {
    const state = this.getState(sessionId);
    
    // Clear problematic state and restart
    this.setState(sessionId, {
      stage: 'gathering_info',
      attemptCount: 0,
      lastUserInput: undefined,
      clarificationNeeded: undefined
    });

    if (state?.customerInfo?.customer_name || state?.collectedData) {
      return "Let me help you continue from where we left off. I can see we have some information already. What would you like to add or change?";
    }

    return "Let's start fresh! I'm here to help you create a professional painting quote. Please tell me the customer's name and the address where the work will be done.";
  }

  /**
   * Clear conversation state
   */
  clearState(sessionId: string): void {
    this.states.delete(sessionId);
    console.log(`🗑️ Cleared conversation state for ${sessionId}`);
  }

  /**
   * Generate a session ID from company ID and optional user identifier
   */
  generateSessionId(companyId: string, userIdentifier?: string): string {
    return `${companyId}_${userIdentifier || 'default'}`;
  }

  /**
   * Get conversation health metrics
   */
  getConversationHealth(sessionId: string): {
    isHealthy: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const state = this.getState(sessionId);
    
    if (!state) {
      return {
        isHealthy: true,
        issues: [],
        recommendations: []
      };
    }

    const issues: string[] = [];
    const recommendations: string[] = [];

    if (state.attemptCount > 3) {
      issues.push('High retry count detected');
      recommendations.push('Consider conversation recovery');
    }

    if (state.stage === 'gathering_info' && Date.now() - state.timestamp > 300000) { // 5 minutes
      issues.push('Long conversation time');
      recommendations.push('Offer simplified data collection');
    }

    if (state.stage === 'awaiting_confirmation' && Date.now() - state.timestamp > 120000) { // 2 minutes
      issues.push('User may be confused about confirmation');
      recommendations.push('Re-explain what they need to confirm');
    }

    return {
      isHealthy: issues.length === 0,
      issues,
      recommendations
    };
  }

  /**
   * Export conversation summary for debugging
   */
  exportConversationSummary(sessionId: string): any {
    const state = this.getState(sessionId);
    
    if (!state) {
      return null;
    }

    return {
      sessionId: state.sessionId,
      stage: state.stage,
      attemptCount: state.attemptCount,
      duration: Date.now() - state.timestamp,
      hasCustomerInfo: !!state.customerInfo,
      hasQuote: !!state.lastQuote,
      lastInput: state.lastUserInput,
      health: this.getConversationHealth(sessionId)
    };
  }
}

// Global enhanced singleton instance
export const enhancedConversationStateManager = new EnhancedConversationStateManager();