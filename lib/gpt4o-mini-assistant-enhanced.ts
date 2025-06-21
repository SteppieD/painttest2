import { gpt4oMiniAssistant } from './gpt4o-mini-assistant';

interface ValidationResult {
  isValid: boolean;
  concerns: string[];
  suggestions: string[];
}

interface EnhancedResponse {
  response: string;
  validation?: ValidationResult;
  recommendations?: string[];
  insights?: string[];
}

class EnhancedGPT4oAssistant {
  // Validate measurements for common errors
  async validateMeasurements(data: any): Promise<ValidationResult> {
    const prompt = `Validate these painting measurements for common errors:
${JSON.stringify(data, null, 2)}

Check for:
- Unusually low/high ceiling heights (typical: 8-10ft)
- Excessive linear feet for room count
- Missing related measurements
- Unrealistic proportions

Return JSON:
{
  "isValid": boolean,
  "concerns": ["list of potential issues"],
  "suggestions": ["helpful suggestions"]
}`;

    const result = await gpt4oMiniAssistant.processContractorMessage(prompt, {
      stage: 'validation',
      conversationHistory: [],
      currentData: {},
    });

    try {
      return JSON.parse(result.response);
    } catch {
      return { isValid: true, concerns: [], suggestions: [] };
    }
  }

  // Generate smart recommendations based on project
  async getRecommendations(
    projectType: string,
    surfaces: string[],
    dimensions: any
  ): Promise<string[]> {
    const prompt = `Based on this painting project, suggest helpful additions:
Project: ${projectType}
Surfaces: ${surfaces.join(', ')}
Size: ${JSON.stringify(dimensions)}

Suggest 2-3 relevant add-ons or considerations (one sentence each).`;

    const result = await gpt4oMiniAssistant.chat(prompt, { stage: 'recommendations' });
    
    // Parse recommendations from response
    const lines = result.split('\n').filter(line => line.trim());
    return lines.slice(0, 3);
  }

  // Enhanced message processing with validation
  async processEnhancedMessage(
    message: string,
    context: any
  ): Promise<EnhancedResponse> {
    // Step 1: Understand the message
    const understanding = await gpt4oMiniAssistant.processContractorMessage(message, context);

    // Step 2: Validate if we have measurements
    let validation: ValidationResult | undefined;
    if (understanding.understanding.extracted && 
        (understanding.understanding.extracted.wall_linear_feet || 
         understanding.understanding.extracted.ceiling_height ||
         understanding.understanding.extracted.ceiling_area)) {
      validation = await this.validateMeasurements({
        ...context.currentData.dimensions,
        ...understanding.understanding.extracted
      });
    }

    // Step 3: Get recommendations if we have enough data
    let recommendations: string[] = [];
    if (context.currentData.project_type && context.currentData.surfaces?.length > 0) {
      recommendations = await this.getRecommendations(
        context.currentData.project_type,
        context.currentData.surfaces,
        context.currentData.dimensions
      );
    }

    // Step 4: Generate enhanced response with validation feedback
    let enhancedResponse = understanding.response;
    
    if (validation && validation.concerns.length > 0) {
      const validationPrompt = `The user said: "${message}"
You understood and extracted: ${JSON.stringify(understanding.understanding.extracted)}

However, there are some concerns: ${validation.concerns.join(', ')}

Respond naturally in 1-2 sentences, gently checking if they meant something else. Include ONE emoji.`;

      const validationResponse = await gpt4oMiniAssistant.chat(validationPrompt, { 
        stage: 'validation_response' 
      });
      
      enhancedResponse = validationResponse;
    }

    return {
      response: enhancedResponse,
      validation,
      recommendations: recommendations.length > 0 ? recommendations : undefined,
    };
  }

  // Predict common measurements based on project type
  async predictMeasurements(
    description: string,
    projectType: string
  ): Promise<any> {
    const prompt = `Based on this description: "${description}"
Project type: ${projectType}

Estimate typical measurements (be conservative):
- Linear feet range
- Likely ceiling height  
- Approximate room count
- Square footage range

Return brief JSON with estimates.`;

    const result = await gpt4oMiniAssistant.chat(prompt, { stage: 'prediction' });
    
    try {
      return JSON.parse(result);
    } catch {
      return null;
    }
  }

  // Generate customer-friendly quote summary
  async generateCustomerSummary(
    quote: any,
    projectDetails: any
  ): Promise<string> {
    const prompt = `Create a friendly 2-3 sentence summary of this painting quote for the customer:
Total: $${quote.final_price}
Surfaces: ${projectDetails.surfaces?.join(', ')}
Size: ${projectDetails.dimensions.wall_linear_feet} linear feet

Make it sound valuable and professional.`;

    return await gpt4oMiniAssistant.chat(prompt, { stage: 'summary' });
  }
}

export const enhancedAssistant = new EnhancedGPT4oAssistant();