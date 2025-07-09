import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";

// Structured output schema for quote information
const QuoteInfoSchema = z.object({
  customer_name: z.string().nullable().describe("Customer's name"),
  address: z.string().nullable().describe("Property address"),
  project_type: z.enum(["interior", "exterior", "both"]).nullable().describe("Type of painting project"),
  surfaces: z.object({
    walls: z.boolean().describe("Include wall painting"),
    ceilings: z.boolean().describe("Include ceiling painting"),
    trim: z.boolean().describe("Include trim painting"),
    doors: z.boolean().describe("Include door painting"),
    windows: z.boolean().describe("Include window painting"),
  }).describe("Which surfaces to paint"),
  dimensions: z.object({
    linear_feet: z.number().nullable().describe("Linear feet of walls"),
    ceiling_height: z.number().nullable().describe("Ceiling height in feet"),
    total_area: z.number().nullable().describe("Total square footage"),
  }).describe("Room dimensions"),
  paint_specs: z.object({
    brand: z.string().nullable().describe("Paint brand (e.g. Sherwin Williams)"),
    finish: z.string().nullable().describe("Paint finish (e.g. eggshell, satin)"),
    price_per_gallon: z.number().nullable().describe("Price per gallon of paint"),
    coverage_per_gallon: z.number().nullable().describe("Square feet covered per gallon"),
    primer_needed: z.boolean().describe("Whether primer is needed"),
  }).describe("Paint specifications"),
  labor: z.object({
    rate_per_sqft: z.number().nullable().describe("Labor rate per square foot"),
    included_in_sqft: z.boolean().describe("Whether labor is included in per-sqft rate"),
  }).describe("Labor information"),
  special_requirements: z.array(z.string()).describe("Any special requirements or notes"),
  missing_info: z.array(z.string()).describe("What information is still needed to complete the quote"),
  confidence_level: z.enum(["high", "medium", "low"]).describe("Confidence in extracted information"),
  next_questions: z.array(z.string()).describe("Specific questions to ask the user next"),
});

type QuoteInfo = z.infer<typeof QuoteInfoSchema>;

export class LangChainQuoteAssistant {
  private llm: ChatOpenAI;

  constructor() {
    this.llm = new ChatOpenAI({
      modelName: "anthropic/claude-3.5-sonnet", // Using Claude Sonnet via OpenRouter
      temperature: 0.1, // Low temperature for consistent extraction
      openAIApiKey: process.env.OPENROUTER_API_KEY,
      configuration: {
        basePath: "https://openrouter.ai/api/v1",
        baseOptions: {
          headers: {
            "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3001",
            "X-Title": "ProPaint Quote Assistant",
          },
        },
      },
    } as any);
  }

  async extractQuoteInformation(
    userInput: string, 
    conversationHistory: string[] = [],
    existingData: Partial<QuoteInfo> = {}
  ): Promise<QuoteInfo> {
    
    const systemPrompt = `You are an expert painting quote assistant. Your job is to extract comprehensive quote information from user messages.

CRITICAL INSTRUCTIONS:
1. Extract ALL available information from the user's message, even if they provide multiple pieces of data at once
2. Pay special attention to exclusions (e.g., "not painting ceilings" = ceilings: false)
3. Look for paint specifications including brand, finish, price, and coverage rates
4. Identify labor rates and whether they're included in per-sqft pricing
5. Note any special requirements or exclusions
6. Determine what information is still missing for a complete quote
7. Set confidence level based on how complete and clear the information is

EXAMPLES OF WHAT TO EXTRACT:
- "It's for Cici at 9090 Hillside Drive" → customer_name: "Cici", address: "9090 Hillside Drive"
- "500 linear feet of interior painting" → project_type: "interior", linear_feet: 500
- "not painting the ceilings" → ceilings: false
- "Ceilings are 9 feet tall" → ceiling_height: 9
- "$50 a gallon bucket eggshell shirwin williams" → brand: "Sherwin Williams", finish: "eggshell", price_per_gallon: 50
- "spread rate is 350 square feet per gallon" → coverage_per_gallon: 350
- "labour is included in the cost per square foot at $1.50" → rate_per_sqft: 1.50, included_in_sqft: true
- "No primer" → primer_needed: false

Return structured data in the exact format specified.`;

    const humanPrompt = `Current conversation context:
${conversationHistory.length > 0 ? conversationHistory.join('\n') : 'No previous conversation'}

Existing quote data:
${JSON.stringify(existingData, null, 2)}

New user message:
"${userInput}"

Extract all available quote information from this message, combining it with existing data. Pay special attention to surface exclusions, paint specifications, and labor details.`;

    try {
      const response = await this.llm.invoke([
        new SystemMessage(systemPrompt + `

IMPORTANT: You MUST respond with valid JSON in this exact format:
{
  "customer_name": "string or null",
  "address": "string or null", 
  "project_type": "interior" | "exterior" | "both" | null,
  "surfaces": {
    "walls": boolean,
    "ceilings": boolean,
    "trim": boolean,
    "doors": boolean,
    "windows": boolean
  },
  "dimensions": {
    "linear_feet": number or null,
    "ceiling_height": number or null,
    "total_area": number or null
  },
  "paint_specs": {
    "brand": "string or null",
    "finish": "string or null", 
    "price_per_gallon": number or null,
    "coverage_per_gallon": number or null,
    "primer_needed": boolean
  },
  "labor": {
    "rate_per_sqft": number or null,
    "included_in_sqft": boolean
  },
  "special_requirements": ["array of strings"],
  "missing_info": ["array of strings"],
  "confidence_level": "high" | "medium" | "low",
  "next_questions": ["array of strings"]
}`),
        new HumanMessage(humanPrompt + "\n\nRespond with JSON only, no other text.")
      ]);

      // Parse the response as JSON
      const responseContent = response.content as string;
      
      // Try to extract JSON from the response
      let extractedData: any;
      try {
        // Clean the response - remove any markdown formatting
        let cleanJson = responseContent.trim();
        
        // Remove ```json and ``` if present
        cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        
        // Parse the JSON
        extractedData = JSON.parse(cleanJson);
      } catch (parseError) {
        console.error("Failed to parse LLM response as JSON:", parseError);
        console.log("Raw response:", responseContent);
        
        // Try to extract customer name and address using regex as fallback
        const nameMatch = userInput.match(/(?:it's for|for)\s+([^,\s]+)/i);
        const addressMatch = userInput.match(/(?:at\s+)(.+?)(?:\.|$|we|the|project)/i);
        const linearFeetMatch = userInput.match(/(\d+)\s*linear\s*feet/i);
        const heightMatch = userInput.match(/(\d+)\s*feet?\s*tall|(\d+)\s*foot?\s*ceiling/i);
        
        return {
          customer_name: nameMatch ? nameMatch[1].trim() : null,
          address: addressMatch ? addressMatch[1].trim() : null,
          project_type: /interior/i.test(userInput) ? "interior" as const : null,
          surfaces: {
            walls: true,
            ceilings: !/not.*paint.*ceiling|no.*ceiling/i.test(userInput),
            trim: !/not.*paint.*trim|no.*trim/i.test(userInput),
            doors: !/not.*paint.*door|no.*door/i.test(userInput),
            windows: !/not.*paint.*window|no.*window/i.test(userInput),
          },
          dimensions: {
            linear_feet: linearFeetMatch ? parseInt(linearFeetMatch[1]) : null,
            ceiling_height: heightMatch ? parseInt(heightMatch[1] || heightMatch[2]) : null,
            total_area: null,
          },
          paint_specs: {
            brand: /sherwin/i.test(userInput) ? "Sherwin Williams" : null,
            finish: /eggshell/i.test(userInput) ? "eggshell" : null,
            price_per_gallon: null,
            coverage_per_gallon: null,
            primer_needed: !/no primer/i.test(userInput),
          },
          labor: {
            rate_per_sqft: null,
            included_in_sqft: false,
          },
          special_requirements: [],
          missing_info: ["Unable to parse AI response - using fallback extraction"],
          confidence_level: "low" as const,
          next_questions: ["Could you please clarify any missing details?"],
        };
      }

      // Validate against schema
      const validatedData = QuoteInfoSchema.parse(extractedData);
      return validatedData;

    } catch (error) {
      console.error("Error in LangChain quote extraction:", error);
      
      // Return fallback structure
      return {
        customer_name: null,
        address: null,
        project_type: null,
        surfaces: {
          walls: true,
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
          primer_needed: true,
        },
        labor: {
          rate_per_sqft: null,
          included_in_sqft: false,
        },
        special_requirements: [],
        missing_info: ["System error - please try again"],
        confidence_level: "low" as const,
        next_questions: ["I'm having trouble processing your request. Could you tell me about your painting project?"],
      };
    }
  }

  async generateResponse(
    extractedInfo: QuoteInfo,
    userInput: string,
    conversationHistory: string[] = []
  ): Promise<string> {
    const systemPrompt = `You are a professional painting quote assistant. Based on the extracted quote information, generate a helpful, conversational response.

RESPONSE GUIDELINES:
1. Acknowledge what information you successfully captured
2. If confidence is high and most info is complete, move toward quote calculation
3. If information is missing, ask specific follow-up questions
4. Be conversational and helpful, not robotic
5. Show understanding of painting industry terminology
6. If exclusions were mentioned (like "not painting ceilings"), confirm them clearly

Keep responses concise but thorough. Focus on moving the conversation forward efficiently.`;

    const humanPrompt = `User input: "${userInput}"

Extracted information:
${JSON.stringify(extractedInfo, null, 2)}

Conversation history:
${conversationHistory.join('\n')}

Generate an appropriate response that acknowledges what you understood and guides the conversation forward.`;

    try {
      const response = await this.llm.invoke([
        new SystemMessage(systemPrompt),
        new HumanMessage(humanPrompt)
      ]);

      return response.content as string;
    } catch (error) {
      console.error("Error generating response:", error);
      return "I'm having trouble processing your request. Could you tell me about your painting project?";
    }
  }
}

export { QuoteInfoSchema, type QuoteInfo };