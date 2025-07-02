/**
 * Conversation State Management
 * 
 * Fixes the "conversation amnesia" problem where the system forgets 
 * it just generated a quote and treats "yes" as a new customer name.
 */

export interface ConversationState {
  stage: 'gathering_info' | 'quote_generated' | 'awaiting_confirmation' | 'quote_saved';
  lastQuote?: any;
  lastQuoteSummary?: string;
  customerInfo?: {
    customer_name: string;
    address: string;
  };
  timestamp: number;
}

export class ConversationStateManager {
  private states: Map<string, ConversationState> = new Map();

  /**
   * Initialize or update conversation state
   */
  setState(sessionId: string, state: Partial<ConversationState>): void {
    const existing = this.states.get(sessionId) || {
      stage: 'gathering_info',
      timestamp: Date.now()
    };

    this.states.set(sessionId, {
      ...existing,
      ...state,
      timestamp: Date.now()
    });
  }

  /**
   * Get current conversation state
   */
  getState(sessionId: string): ConversationState | null {
    const state = this.states.get(sessionId);
    
    // Clean up old states (older than 1 hour)
    if (state && Date.now() - state.timestamp > 3600000) {
      this.states.delete(sessionId);
      return null;
    }
    
    return state;
  }

  /**
   * Check if user input is a confirmation response
   */
  isConfirmationResponse(input: string): boolean {
    const lower = input.toLowerCase().trim();
    
    const yesResponses = [
      'yes', 'yeah', 'yep', 'ok', 'okay', 'sure', 'correct', 'right',
      'good', 'fine', 'approve', 'accept', 'confirm', 'save', 'proceed',
      'go ahead', 'looks good', 'perfect', 'great', 'absolutely'
    ];
    
    const noResponses = [
      'no', 'nope', 'not', 'cancel', 'stop', 'wait', 'hold on',
      'wrong', 'incorrect', 'change', 'edit', 'modify', 'different'
    ];
    
    // Check for exact matches or responses that start with these words
    for (const yes of yesResponses) {
      if (lower === yes || lower.startsWith(yes + ' ') || lower.endsWith(' ' + yes)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Check if user input is a rejection/edit response
   */
  isRejectionResponse(input: string): boolean {
    const lower = input.toLowerCase().trim();
    
    const noResponses = [
      'no', 'nope', 'not', 'cancel', 'stop', 'wait', 'hold on',
      'wrong', 'incorrect', 'change', 'edit', 'modify', 'different',
      'back', 'redo', 'restart', 'fix'
    ];
    
    for (const no of noResponses) {
      if (lower === no || lower.startsWith(no + ' ') || lower.endsWith(' ' + no)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Clear conversation state
   */
  clearState(sessionId: string): void {
    this.states.delete(sessionId);
  }

  /**
   * Generate a session ID from company ID and optional user identifier
   */
  generateSessionId(companyId: string, userIdentifier?: string): string {
    return `${companyId}_${userIdentifier || 'default'}`;
  }
}

// Global singleton instance
export const conversationStateManager = new ConversationStateManager();