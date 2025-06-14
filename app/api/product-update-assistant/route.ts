import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Database from "better-sqlite3";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
const db = new Database("./painting_quotes_app.db");

export async function POST(req: NextRequest) {
  try {
    const { message, userId, conversationHistory } = await req.json();

    if (!message || !userId) {
      return NextResponse.json(
        { error: "Message and user ID are required" },
        { status: 400 }
      );
    }

    // Get current products
    const products = db.prepare(`
      SELECT * FROM company_paint_products
      WHERE user_id = ? AND is_active = TRUE
      ORDER BY project_type, product_category, display_order
    `).all(userId);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `You are a paint product management assistant. Help users update their paint product catalog.

Current products:
${JSON.stringify(products, null, 2)}

You can help with:
1. Price updates (individual or bulk)
2. Adding new products
3. Removing products
4. Showing current inventory
5. Bulk percentage increases/decreases

Guidelines:
- Be specific about which products were updated
- Confirm changes before applying them
- Ask for clarification if the request is ambiguous
- Use friendly, professional tone
- Show current and new prices when updating

Parse the user's intent and determine if any database actions are needed.
If updating prices, extract the specific products and new prices.
If adding products, extract supplier, name, category, and price.
If removing products, identify which ones to remove.

Respond with the appropriate action and confirmation message.`;

    const chat = model.startChat({
      history: conversationHistory.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(`${systemPrompt}\n\nUser request: ${message}`);
    const response = await result.response.text();

    // Parse the response for database actions
    const { action, updatedProducts, success } = parseUpdateRequest(message, products);

    if (action && updatedProducts.length > 0) {
      // Apply the updates to the database
      await applyProductUpdates(userId, updatedProducts, action);
    }

    return NextResponse.json({
      response: response.trim(),
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
  
  if (lowerMessage.includes("increase") || lowerMessage.includes("raise")) {
    action = "price_increase";
    if (percentageMatch) {
      const percentage = parseFloat(percentageMatch[1]);
      updatedProducts = products.map(p => ({
        ...p,
        costPerGallon: p.cost_per_gallon * (1 + percentage / 100),
      }));
      success = true;
    }
  } else if (lowerMessage.includes("decrease") || lowerMessage.includes("reduce") || lowerMessage.includes("lower")) {
    action = "price_decrease";
    if (percentageMatch) {
      const percentage = parseFloat(percentageMatch[1]);
      updatedProducts = products.map(p => ({
        ...p,
        costPerGallon: p.cost_per_gallon * (1 - percentage / 100),
      }));
      success = true;
    }
  } else if (lowerMessage.includes("update") && priceMatch) {
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

  const updateStmt = db.prepare(`
    UPDATE company_paint_products
    SET cost_per_gallon = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `);

  const updateMany = db.transaction(() => {
    for (const product of products) {
      updateStmt.run(product.costPerGallon, product.id, userId);
    }
  });

  updateMany();
}