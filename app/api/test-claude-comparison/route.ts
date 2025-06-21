import { NextResponse } from 'next/server';
import { claudeHaikuAssistant } from '@/lib/claude-haiku-assistant';
import { parseDimensions, parseDoorsAndWindows } from '@/lib/improved-conversation-parser';

export async function POST(request: Request) {
  try {
    const { input, stage, category, existingData } = await request.json();

    // First, let's parse with our current system
    const currentParsing = (() => {
      if (category === 'walls' || category === 'ceilings') {
        return parseDimensions(input, 'interior', existingData?.dimensions || {});
      } else if (['doors', 'windows', 'trim'].includes(category)) {
        return parseDoorsAndWindows(input);
      }
      return {};
    })();

    // Now parse with Claude
    const claudeParsing = await claudeHaikuAssistant.parseContractorInput(input, {
      stage,
      category,
      existingData: existingData || {},
      needsInfo: []
    });

    // Generate responses with both approaches
    const currentResponse = generateCurrentResponse(input, category, currentParsing);
    
    const claudeResponse = await claudeHaikuAssistant.generateContractorResponse({
      stage,
      category,
      parsedData: claudeParsing.parsed || {},
      existingData: existingData || {}
    });

    return NextResponse.json({
      input,
      stage,
      category,
      comparison: {
        parsing: {
          current: currentParsing,
          claude: claudeParsing.parsed
        },
        responses: {
          current: currentResponse,
          claude: claudeResponse.response
        }
      }
    });
  } catch (error) {
    console.error('Comparison error:', error);
    return NextResponse.json(
      { error: 'Failed to compare responses' },
      { status: 500 }
    );
  }
}

// Mock the current hardcoded responses for comparison
function generateCurrentResponse(input: string, category: string, parsed: any): string {
  const responses: Record<string, Record<string, string>> = {
    walls: {
      complete: `Got it! ${parsed.wall_linear_feet} linear feet with ${parsed.ceiling_height} foot ceilings 👍\n\nTime to pick paint for your walls!`,
      needHeight: `Perfect! Got the ${parsed.wall_linear_feet} linear feet. What's the ceiling height?`,
      needLinear: `Great! ${parsed.ceiling_height} foot ceilings. How many linear feet of wall?`,
      needBoth: `I need the wall measurements. Just tell me like "300 linear feet, 9 foot ceilings" or "300 by 9"`
    },
    ceilings: {
      complete: `Perfect! Got ${parsed.ceiling_area || parsed.floor_area} square feet of ceiling space 👍\n\nTime to pick paint for your ceilings!`,
      needArea: `I need the ceiling area. You can tell me:\n\n• "1200 square feet" (total ceiling area)\n• "Floor area is 1200 sqft" (I'll use that for ceiling)\n• Just the room size and I'll calculate it!`
    },
    doors: {
      complete: `Got it! ${parsed.doors} doors to paint 🚪\n\nTime to pick paint for your doors!`,
      needCount: `How many doors are we painting? Just tell me like:\n\n• "3 doors"\n• "Just 2"\n• "No doors" or "0 doors"`
    },
    windows: {
      complete: `Perfect! ${parsed.windows} windows to paint 🪟\n\nTime to pick paint for your windows!`,
      needCount: `How many windows are we painting? Just tell me like:\n\n• "5 windows"\n• "Just 3"\n• "No windows" or "0 windows"`
    }
  };

  // Determine which response to use based on what was parsed
  if (category === 'walls') {
    if (parsed.wall_linear_feet && parsed.ceiling_height) {
      return responses.walls.complete;
    } else if (parsed.wall_linear_feet) {
      return responses.walls.needHeight;
    } else if (parsed.ceiling_height) {
      return responses.walls.needLinear;
    } else {
      return responses.walls.needBoth;
    }
  } else if (category === 'ceilings') {
    if (parsed.ceiling_area || parsed.floor_area) {
      return responses.ceilings.complete;
    } else {
      return responses.ceilings.needArea;
    }
  } else if (category === 'doors') {
    if (parsed.doors !== undefined) {
      return responses.doors.complete;
    } else {
      return responses.doors.needCount;
    }
  } else if (category === 'windows') {
    if (parsed.windows !== undefined) {
      return responses.windows.complete;
    } else {
      return responses.windows.needCount;
    }
  }

  return "I need more information to help with your quote.";
}

export async function GET() {
  // Test examples for demonstration
  const testCases = [
    {
      input: "500 by 9",
      stage: "category_measurement_collection",
      category: "walls",
      description: "Contractor saying wall dimensions naturally"
    },
    {
      input: "9",
      stage: "category_measurement_collection", 
      category: "walls",
      description: "Just ceiling height when that's what's missing",
      existingData: { dimensions: { wall_linear_feet: 300 } }
    },
    {
      input: "Just 3",
      stage: "category_measurement_collection",
      category: "doors", 
      description: "Natural way to say 3 doors"
    },
    {
      input: "ceiling height is 9, 300 linear feet",
      stage: "category_measurement_collection",
      category: "walls",
      description: "Information in different order"
    },
    {
      input: "no windows",
      stage: "category_measurement_collection",
      category: "windows",
      description: "Natural way to say zero"
    }
  ];

  const comparisons = await Promise.all(
    testCases.map(async (test) => {
      const result = await fetch('http://localhost:3001/api/test-claude-comparison', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test)
      }).then(r => r.json()).catch(() => ({ error: 'Failed' }));
      
      return {
        ...test,
        result
      };
    })
  );

  return NextResponse.json({
    message: "Claude 3.5 Haiku vs Current System Comparison",
    testCases: comparisons,
    note: "Set OPENROUTER_API_KEY in .env to see Claude responses"
  });
}