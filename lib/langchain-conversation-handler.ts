import { QuoteInfo } from './langchain-quote-assistant';

export interface ConversationState {
  extractedInfo: QuoteInfo;
  conversationHistory: string[];
  currentStage: string;
  needsSurfaceSelection: boolean;
  paintSelectionQueue: string[];
  currentPaintCategory: string | null;
  hasEnoughForQuote: boolean;
}

export async function processWithLangChain(
  userInput: string,
  currentState: ConversationState,
  companyId: number
): Promise<{
  response: string;
  newState: ConversationState;
  showButtons?: any[];
  showFavoritePaintSelector?: boolean;
  showSurfaceSelector?: boolean;
  quote?: any;
}> {
  try {
    // Call the new LangChain API
    const response = await fetch('/api/quote-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userInput,
        conversationHistory: currentState.conversationHistory,
        existingQuoteData: currentState.extractedInfo,
        companyId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to process message with LangChain');
    }

    const data = await response.json();

    // Update conversation state based on LangChain response
    const newState: ConversationState = {
      ...currentState,
      extractedInfo: data.extractedInfo,
      conversationHistory: data.conversationHistory,
      currentStage: data.nextStage,
      hasEnoughForQuote: data.canCalculateQuote,
    };

    // Determine UI elements to show based on extracted info and stage
    let showButtons: any[] = [];
    let showFavoritePaintSelector = false;
    let showSurfaceSelector = false;

    // Surface selection logic
    if (data.nextStage === 'surface_selection' || 
        (!data.extractedInfo.surfaces.walls && !data.extractedInfo.surfaces.ceilings)) {
      showSurfaceSelector = true;
      newState.needsSurfaceSelection = true;
    }

    // Paint selection logic
    if (data.nextStage === 'paint_selection' && data.extractedInfo.surfaces) {
      const surfaces = data.extractedInfo.surfaces;
      const needsPaint = [];
      
      if (surfaces.walls) needsPaint.push('walls');
      if (surfaces.ceilings) needsPaint.push('ceilings');
      if (surfaces.trim) needsPaint.push('trim');
      if (surfaces.doors) needsPaint.push('doors');
      if (surfaces.windows) needsPaint.push('windows');

      if (needsPaint.length > 0) {
        newState.paintSelectionQueue = needsPaint;
        newState.currentPaintCategory = needsPaint[0];
        showFavoritePaintSelector = true;
      }
    }

    // Button suggestions from LangChain
    if (data.suggestions && data.suggestions.length > 0) {
      showButtons = data.suggestions.map((suggestion: string, index: number) => ({
        id: `suggestion_${index}`,
        label: suggestion,
        value: suggestion,
        selected: false
      }));
    }

    return {
      response: data.response,
      newState,
      showButtons,
      showFavoritePaintSelector,
      showSurfaceSelector,
      quote: data.quote
    };

  } catch (error) {
    console.error('LangChain processing error:', error);
    
    // Fallback to simple response
    return {
      response: "I'm having trouble processing your message. Could you tell me about your painting project?",
      newState: currentState,
      showButtons: []
    };
  }
}

// Helper function to determine if we should use LangChain for a given input
export function shouldUseLangChain(input: string, currentStage: string): boolean {
  // Always use LangChain for initial customer info gathering
  if (currentStage === 'customer_info') {
    return true;
  }

  // Use LangChain for comprehensive inputs (multiple pieces of info)
  const hasMultipleInfo = [
    /\d+.*linear.*feet/i.test(input) && /\d+.*foot|feet/i.test(input), // dimensions
    /name.*address|address.*name/i.test(input), // customer info
    /interior|exterior/i.test(input) && /\d+/i.test(input), // project type + dimensions
    /not.*paint|don't.*paint|skip/i.test(input), // exclusions
    /gallon.*\$|\$.*gallon/i.test(input), // paint pricing
    /sherwin|benjamin|behr|valspar/i.test(input), // paint brands
    /eggshell|satin|semi-gloss|flat/i.test(input), // paint finishes
    /labor.*\$|\$.*labor|per.*square.*foot/i.test(input), // labor rates
  ].filter(Boolean).length;

  return hasMultipleInfo >= 2; // Use LangChain if multiple types of info detected
}

// Convert LangChain extracted info to quote data format
export function convertToQuoteData(extractedInfo: QuoteInfo): any {
  return {
    customer_name: extractedInfo.customer_name || '',
    address: extractedInfo.address || '',
    project_type: extractedInfo.project_type || 'interior',
    dimensions: {
      wall_linear_feet: extractedInfo.dimensions.linear_feet,
      ceiling_height: extractedInfo.dimensions.ceiling_height,
      ceiling_area: extractedInfo.dimensions.total_area,
      number_of_doors: 3, // Default - could be improved
      number_of_windows: 5, // Default - could be improved
    },
    selected_products: {
      primer_level: extractedInfo.paint_specs.primer_needed ? 1 : 0,
      wall_paint_level: 1, // Default mid-level
      ceiling_paint_level: extractedInfo.surfaces.ceilings ? 1 : 0,
      trim_paint_level: extractedInfo.surfaces.trim ? 1 : 0,
      include_floor_sealer: false,
    },
    markup_percentage: 20, // Default
  };
}