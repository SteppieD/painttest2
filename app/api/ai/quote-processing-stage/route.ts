import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt, companyId } = await request.json();
    
    console.log('🎯 Stage 2 AI: Processing quote extraction');
    console.log('Company ID:', companyId);
    
    // Mock AI response for now - replace with actual AI API call
    // This would normally call OpenAI, Claude, or another AI service
    // Using the detailed prompt provided by the user
    
    // For now, simulate a structured response based on common patterns
    const mockQuoteData = {
      "client_name": "Cici",
      "address": "9090 Hillside Drive",
      "date": "2024-06-23",
      "rooms": [
        {
          "name": "Interior Space",
          "wall_sqft": 4500,
          "ceiling_sqft": 0,
          "doors_count": 0,
          "windows_count": 0,
          "floor_sqft": 0,
          "trim_linear_feet": 0
        }
      ],
      "materials": {
        "wall_paint": {
          "brand": "Sherwin Williams Eggshell",
          "gallons": 13,
          "cost_per_gallon": 50,
          "total_cost": 650
        }
      },
      "labor": {
        "estimated_hours": 30,
        "rate_type": "sqft",
        "rate_amount": 1.50,
        "total_labor_cost": 6750
      },
      "overhead": {
        "total": 740
      },
      "subtotal": 8140,
      "markup_percentage": 20,
      "markup_amount": 1628,
      "total_quote": 9768,
      "scope_notes": "500 linear feet interior painting, 9ft ceilings, walls only (no doors, trim, windows, or ceilings). No primer required.",
      "validity_days": 30
    };
    
    // In a real implementation, you would:
    // 1. Send the prompt to an AI service
    // 2. Parse the conversation for actual data
    // 3. Perform calculations based on extracted information
    // 4. Return structured JSON
    
    return NextResponse.json({
      response: JSON.stringify(mockQuoteData, null, 2)
    });
    
  } catch (error) {
    console.error('Quote processing stage error:', error);
    return NextResponse.json(
      { error: "Failed to process quote extraction" },
      { status: 500 }
    );
  }
}