import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbAll, dbRun } from "../../../lib/database";

export async function POST(req: NextRequest) {
  try {
    const { message, userId, conversationHistory } = await req.json();

    if (!message || !userId) {
      return NextResponse.json(
        { error: "Message and user ID are required" },
        { status: 400 }
      );
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openRouterApiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      );
    }

    // Get current products
    const products = dbAll(`
      SELECT * FROM company_paint_products
      WHERE user_id = ? AND is_active = TRUE
      ORDER BY project_type, product_category, display_order
    `, [userId]);

    const systemPrompt = `You are a paint product management assistant. Help users update their paint product catalog.

Current products:
${JSON.stringify(products, null, 2)}

You can help with:
1. Price updates (individual or bulk)
2. Adding new products with details including spread rate/coverage
3. Removing products
4. Showing current inventory
5. Bulk percentage increases/decreases
6. Updating spread rates/coverage per gallon

Guidelines:
- Be specific about which products were updated
- Confirm changes before applying them
- Ask for clarification if the request is ambiguous
- Use friendly, professional tone
- Show current and new values when updating
- When users mention "spread rate", "coverage", or "sq ft per gallon", they're referring to coverage_per_gallon

Parse the user's intent and determine if any database actions are needed.
If updating prices, extract the specific products and new prices.
If updating spread rates/coverage, extract the specific products and new coverage values.
If adding products, extract supplier, name, category, price, and coverage per gallon (default 350 if not specified).
If removing products, identify which ones to remove.

Respond with the appropriate action and confirmation message.`;

    // Build messages for OpenRouter
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
        'X-Title': 'Paint Product Update Assistant'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-5-sonnet-20241022',
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "I can help you update your paint products. What would you like to do?";

    // Parse the response for database actions
    const { action, updatedProducts, success } = parseUpdateRequest(message, products);

    if (action && updatedProducts.length > 0) {
      // Apply the updates to the database
      await applyProductUpdates(userId, updatedProducts, action);
    }

    return NextResponse.json({
      response: aiResponse.trim(),
      success,
      action,
      message: action ? `Updated ${updatedProducts.length} product(s)` : undefined,
    });
  } catch (error) {
    console.error("Error in product update assistant:", error);
    return NextResponse.json(
      { error: "Failed to process update request" },
      { status: 500 }
    );
  }
}

function parseUpdateRequest(message: string, products: any[]) {
  const lowerMessage = message.toLowerCase();
  let action = null;
  let updatedProducts: any[] = [];
  let success = false;

  // Price update patterns
  const percentageMatch = message.match(/(\d+)%/);
  const priceMatch = message.match(/\$?(\d+\.?\d*)/);
  const coverageMatch = message.match(/(\d+)\s*(?:sq\s*ft|square\s*feet|sqft)/i);
  
  // Check if this is about spread rate/coverage
  const isSpreadRateUpdate = lowerMessage.includes("spread rate") || 
                           lowerMessage.includes("coverage") || 
                           lowerMessage.includes("sq ft per gallon") ||
                           lowerMessage.includes("square feet per gallon");
  
  if (lowerMessage.includes("increase") || lowerMessage.includes("raise")) {
    action = "price_increase";
    if (percentageMatch && !isSpreadRateUpdate) {
      const percentage = parseFloat(percentageMatch[1]);
      updatedProducts = products.map(p => ({
        ...p,
        costPerGallon: p.cost_per_gallon * (1 + percentage / 100),
      }));
      success = true;
    }
  } else if (lowerMessage.includes("decrease") || lowerMessage.includes("reduce") || lowerMessage.includes("lower")) {
    action = "price_decrease";
    if (percentageMatch && !isSpreadRateUpdate) {
      const percentage = parseFloat(percentageMatch[1]);
      updatedProducts = products.map(p => ({
        ...p,
        costPerGallon: p.cost_per_gallon * (1 - percentage / 100),
      }));
      success = true;
    }
  } else if (isSpreadRateUpdate && coverageMatch) {
    action = "coverage_update";
    const newCoverage = parseInt(coverageMatch[1]);
    
    // Try to match specific product
    const productMatches = products.filter(p => 
      lowerMessage.includes(p.product_name.toLowerCase()) ||
      lowerMessage.includes(p.supplier.toLowerCase())
    );
    
    if (productMatches.length > 0) {
      updatedProducts = productMatches.map(p => ({
        ...p,
        coveragePerGallon: newCoverage,
      }));
    } else if (lowerMessage.includes("all")) {
      // Update all products
      updatedProducts = products.map(p => ({
        ...p,
        coveragePerGallon: newCoverage,
      }));
    }
    success = updatedProducts.length > 0;
  } else if (lowerMessage.includes("update") && priceMatch && !isSpreadRateUpdate) {
    action = "specific_price_update";
    const newPrice = parseFloat(priceMatch[1]);
    
    // Try to match product name
    const productMatches = products.filter(p => 
      lowerMessage.includes(p.product_name.toLowerCase()) ||
      lowerMessage.includes(p.supplier.toLowerCase())
    );
    
    if (productMatches.length > 0) {
      updatedProducts = productMatches.map(p => ({
        ...p,
        costPerGallon: newPrice,
      }));
      success = true;
    }
  } else if (lowerMessage.includes("show") || lowerMessage.includes("list") || lowerMessage.includes("current")) {
    action = "show_products";
    success = true;
  }

  return { action, updatedProducts, success };
}

async function applyProductUpdates(userId: string, products: any[], action: string) {
  if (action === "show_products") return;

  for (const product of products) {
    if (action === "coverage_update") {
      dbRun(`
        UPDATE company_paint_products
        SET coverage_per_gallon = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `, [product.coveragePerGallon, product.id, userId]);
    } else {
      dbRun(`
        UPDATE company_paint_products
        SET cost_per_gallon = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `, [product.costPerGallon, product.id, userId]);
    }
  }
}