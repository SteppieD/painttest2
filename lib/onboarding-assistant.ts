import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

interface OnboardingContext {
  currentStep: string;
  companyData: any;
  productData: any;
  message: string;
  conversationHistory: Array<{ role: string; content: string }>;
}

const PRODUCT_CATEGORIES = {
  interior: ["primer", "ceiling_paint", "wall_paint", "trim_paint"],
  exterior: ["primer", "wall_paint", "trim_paint"],
};

const CATEGORY_LABELS = {
  primer: "Primer",
  ceiling_paint: "Ceiling Paint",
  wall_paint: "Wall Paint",
  trim_paint: "Trim, Windows & Doors Paint",
};

export async function processOnboardingMessage(context: OnboardingContext) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemPrompt = `You are a friendly onboarding assistant helping painting contractors set up their company profile and paint products.

Current Step: ${context.currentStep}
Company Name: ${context.companyData?.name || "Unknown"}

Your task is to guide the user through setting up:
1. Company information (phone, email)
2. Interior paint products (primer, ceiling paint, wall paint, trim paint)
3. Exterior paint products (primer, wall paint, trim paint)

For each product category, collect:
- Supplier name (e.g., Sherwin-Williams, Benjamin Moore)
- Product name (e.g., ProClassic, Duration)
- Cost per gallon (number only)

Guidelines:
- Be conversational and encouraging
- Ask for one piece of information at a time
- Confirm information before moving to the next step
- Allow up to 3 products per category
- Accept "skip" or "none" to skip a category
- Use emojis sparingly for friendliness

Current product data:
${JSON.stringify(context.productData, null, 2)}

Based on the conversation flow, determine:
1. What information to ask for next
2. How to parse the user's response
3. When to move to the next step

Respond with a friendly message guiding the user to the next step.`;

  try {
    // Format conversation history for Gemini API
    let formattedHistory = context.conversationHistory.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Ensure the first message is from user, not model
    if (formattedHistory.length > 0 && formattedHistory[0].role === "model") {
      formattedHistory = formattedHistory.slice(1);
    }

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(
      `${systemPrompt}\n\nUser message: ${context.message}`
    );
    const response = await result.response.text();

    // Parse the response and determine next step
    const nextStep = determineNextStep(context);
    const updatedData = parseUserResponse(context);

    return {
      response: response.trim(),
      currentStep: nextStep,
      companyData: updatedData.companyData,
      productData: updatedData.productData,
    };
  } catch (error) {
    console.error("Error in onboarding assistant:", error);
    // Fall back to rule-based responses when AI is unavailable
    return getFallbackResponse(context);
  }
}

function determineNextStep(context: OnboardingContext): string {
  const { currentStep, companyData, productData, message } = context;
  const lowerMessage = message.toLowerCase();

  // Check for skip commands
  if (lowerMessage.includes("skip") || lowerMessage.includes("none") || lowerMessage.includes("later")) {
    return getNextStepAfterSkip(currentStep);
  }

  switch (currentStep) {
    case "welcome":
      return "company_info";
    
    case "company_info":
      // Check if we have phone and email
      if (companyData.phone && companyData.email) {
        return "interior_products";
      }
      return "company_info";
    
    case "interior_products":
      // Check if all interior categories have at least one product or were skipped
      const interiorComplete = PRODUCT_CATEGORIES.interior.every(
        cat => productData.interior[cat].length > 0 || 
               context.conversationHistory.some(msg => 
                 msg.content.toLowerCase().includes(`skip ${cat}`) ||
                 msg.content.toLowerCase().includes(`no ${cat}`)
               )
      );
      if (interiorComplete) {
        return "exterior_products";
      }
      return "interior_products";
    
    case "exterior_products":
      // Check if all exterior categories have at least one product or were skipped
      const exteriorComplete = PRODUCT_CATEGORIES.exterior.every(
        cat => productData.exterior[cat].length > 0 || 
               context.conversationHistory.some(msg => 
                 msg.content.toLowerCase().includes(`skip ${cat}`) ||
                 msg.content.toLowerCase().includes(`no ${cat}`)
               )
      );
      if (exteriorComplete) {
        return "review";
      }
      return "exterior_products";
    
    case "review":
      if (lowerMessage.includes("confirm") || lowerMessage.includes("yes") || lowerMessage.includes("looks good")) {
        return "complete";
      }
      return "review";
    
    default:
      return currentStep;
  }
}

function getNextStepAfterSkip(currentStep: string): string {
  const stepOrder = ["welcome", "company_info", "interior_products", "exterior_products", "review", "complete"];
  const currentIndex = stepOrder.indexOf(currentStep);
  return stepOrder[Math.min(currentIndex + 1, stepOrder.length - 1)];
}

function parseUserResponse(context: OnboardingContext) {
  const { message, companyData, productData, currentStep, conversationHistory } = context;
  const updatedCompanyData = { ...companyData };
  const updatedProductData = { ...productData };

  // Parse based on current step and conversation context
  if (currentStep === "company_info") {
    // Look for phone number pattern
    const phoneMatch = message.match(/\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/);
    if (phoneMatch && !updatedCompanyData.phone) {
      updatedCompanyData.phone = phoneMatch[0];
    }

    // Look for email pattern
    const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch && !updatedCompanyData.email) {
      updatedCompanyData.email = emailMatch[0];
    }
  } else if (currentStep === "interior_products" || currentStep === "exterior_products") {
    // Parse product information
    const productType = currentStep === "interior_products" ? "interior" : "exterior";
    
    // Try to extract supplier, product name, and cost
    const costMatch = message.match(/\$?(\d+\.?\d*)/);
    const cost = costMatch ? parseFloat(costMatch[1]) : null;

    // Check recent messages to determine which category we're working on
    const recentMessages = conversationHistory.slice(-5);
    let currentCategory = null;
    
    for (const cat of PRODUCT_CATEGORIES[productType as keyof typeof PRODUCT_CATEGORIES]) {
      if (recentMessages.some(msg => 
        msg.content.toLowerCase().includes(CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS].toLowerCase())
      )) {
        currentCategory = cat;
        break;
      }
    }

    if (currentCategory && cost) {
      // Extract supplier and product name from message
      let supplier = "Unknown";
      let productName = "Unknown";
      
      // Common suppliers
      const suppliers = ["sherwin-williams", "benjamin moore", "ppg", "behr", "valspar"];
      for (const s of suppliers) {
        if (message.toLowerCase().includes(s)) {
          supplier = s.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join("-");
          break;
        }
      }

      // Extract product name (usually comes after supplier or before cost)
      const words = message.split(/\s+/);
      const costIndex = words.findIndex(w => w.includes(cost.toString()));
      if (costIndex > 0) {
        productName = words.slice(0, costIndex).filter(w => !w.includes("$")).join(" ");
        productName = productName.replace(supplier, "").trim();
      }

      // Add product to the appropriate category
      const products = updatedProductData[productType as keyof typeof updatedProductData][currentCategory] || [];
      if (products.length < 3) {
        products.push({
          supplier,
          productName: productName || `${CATEGORY_LABELS[currentCategory as keyof typeof CATEGORY_LABELS]}`,
          cost,
        });
        updatedProductData[productType as keyof typeof updatedProductData][currentCategory] = products;
      }
    }
  }

  return {
    companyData: updatedCompanyData,
    productData: updatedProductData,
  };
}

function getFallbackResponse(context: OnboardingContext) {
  const { currentStep, message, companyData = {}, productData } = context;
  
  // Parse user response first
  const updatedData = parseUserResponse(context);
  let nextStep = currentStep;
  let response = "";
  
  switch (currentStep) {
    case "welcome":
      updatedData.companyData.name = message.trim();
      nextStep = "company_info";
      response = `Great! I've set your company name as '${message.trim()}'. 🎨\n\nNow let's get your contact information. What's your company phone number?`;
      break;
      
    case "company_info":
      // Check if this looks like a phone number
      if (!companyData.phone && /\d{10,}/.test(message.replace(/\D/g, ''))) {
        updatedData.companyData.phone = message.trim();
        response = "Thanks! I've saved your phone number. Now, what's your company email address?";
      }
      // Check if this looks like an email
      else if (!companyData.email && message.includes("@")) {
        updatedData.companyData.email = message.trim();
        nextStep = "interior_products";
        response = "Perfect! Now let's set up your interior paint products. 🎨\n\nI'll walk you through each product one by one.\n\n**PRIMER** - What primer do you use and what does it cost per gallon?\n\nExample: 'Zinsser Bulls Eye, $25' or just the cost like '$25'";
      }
      // Missing phone
      else if (!companyData.phone) {
        response = "I need your phone number. Please provide it (numbers are fine, like 1234567890).";
      }
      // Missing email  
      else {
        response = "I need your email address. Please provide a valid email like company@example.com";
      }
      break;
      
    case "interior_products":
      // Extract cost from message
      const costMatch = message.match(/\$?(\d+)/);
      const cost = costMatch ? parseInt(costMatch[1]) : null;
      
      // Determine which product we're collecting based on what's already set
      const interior = updatedData.productData.interior;
      
      if (interior.primer.length === 0 && cost) {
        // Adding primer
        interior.primer.push({
          supplier: extractSupplier(message),
          productName: extractProductName(message) || "Primer",
          cost: cost
        });
        response = `Got it! Added primer at $${cost}/gallon. 👍\n\n**WALL PAINT** - What wall paint do you use and what does it cost per gallon?\n\nExample: 'Benjamin Moore, $35' or just '$35'`;
      } 
      else if (interior.wall_paint.length === 0 && cost) {
        // Adding wall paint
        interior.wall_paint.push({
          supplier: extractSupplier(message),
          productName: extractProductName(message) || "Wall Paint", 
          cost: cost
        });
        response = `Perfect! Added wall paint at $${cost}/gallon. 👍\n\n**CEILING PAINT** - What ceiling paint do you use and what does it cost per gallon?\n\nExample: 'Sherwin Williams, $30' or just '$30'`;
      }
      else if (interior.ceiling_paint.length === 0 && cost) {
        // Adding ceiling paint
        interior.ceiling_paint.push({
          supplier: extractSupplier(message),
          productName: extractProductName(message) || "Ceiling Paint",
          cost: cost
        });
        nextStep = "exterior_products";
        response = `Excellent! Added ceiling paint at $${cost}/gallon. 👍\n\nGreat job! Now for exterior work - do you do any exterior painting?\n\nType 'yes' if you do exterior work, or 'skip' if you only do interior.`;
      }
      else if (!cost) {
        // Need a cost
        if (interior.primer.length === 0) {
          response = "I need the cost for your primer. What does your primer cost per gallon? (Just the number like '$25' is fine)";
        } else if (interior.wall_paint.length === 0) {
          response = "I need the cost for your wall paint. What does your wall paint cost per gallon? (Just the number like '$35' is fine)";
        } else {
          response = "I need the cost for your ceiling paint. What does your ceiling paint cost per gallon? (Just the number like '$30' is fine)";
        }
      }
      else {
        response = "I understand you mentioned a paint product. Let me ask specifically - what does your primer cost per gallon?";
      }
      break;
      
    case "exterior_products":
      if (message.toLowerCase().includes("skip") || message.toLowerCase().includes("no") || message.toLowerCase().includes("don't")) {
        nextStep = "review";
        response = `No problem! Let me review your setup:\n\n**Company:** ${updatedData.companyData.name}\n**Phone:** ${updatedData.companyData.phone}\n**Email:** ${updatedData.companyData.email}\n\n**Interior Paints:**\n• ${updatedData.productData.interior.primer[0]?.productName} - $${updatedData.productData.interior.primer[0]?.cost}/gallon\n• ${updatedData.productData.interior.wall_paint[0]?.productName} - $${updatedData.productData.interior.wall_paint[0]?.cost}/gallon\n• ${updatedData.productData.interior.ceiling_paint[0]?.productName} - $${updatedData.productData.interior.ceiling_paint[0]?.cost}/gallon\n\nDoes this look correct? Type 'yes' to save your setup!`;
      } else {
        nextStep = "review";
        response = "Got it! I'll add some basic exterior paint options for you.\n\nLet me review your complete setup:\n\n**Company:** " + updatedData.companyData.name + "\n**Interior & Exterior Paints:** Configured\n\nDoes this look good? Type 'yes' to complete your setup!";
      }
      break;
      
    case "review":
      if (message.toLowerCase().includes("yes") || message.toLowerCase().includes("correct") || message.toLowerCase().includes("save")) {
        nextStep = "complete";
        response = "🎉 Perfect! Your company setup is complete!\n\nYou're all set to start creating professional quotes. Your paint products and pricing are now configured.\n\nYour setup will be saved automatically.";
      } else {
        response = "What would you like to change? Please let me know specifically what needs to be updated.";
      }
      break;
      
    default:
      response = "Let's continue with your setup. What would you like to tell me?";
  }
  
  return {
    response,
    currentStep: nextStep,
    companyData: updatedData.companyData,
    productData: updatedData.productData,
  };
}

function extractSupplier(message: string): string {
  const suppliers = ["sherwin-williams", "sherwin williams", "benjamin moore", "behr", "ppg", "zinsser", "rust-oleum", "valspar"];
  const lowerMessage = message.toLowerCase();
  
  for (const supplier of suppliers) {
    if (lowerMessage.includes(supplier)) {
      return supplier.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
  }
  return "Unknown";
}

function extractProductName(message: string): string {
  // Extract potential product name (words before price or common keywords)
  const words = message.split(/[\$\d]|cost|price|gallon/i)[0].trim();
  return words.length > 3 ? words : "";
}