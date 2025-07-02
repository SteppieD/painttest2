import { NextResponse } from 'next/server';
import { enhancedAssistant } from '@/lib/gpt4o-mini-assistant-enhanced';

export async function POST(request: Request) {
  try {
    const { message, scenario } = await request.json();

    const scenarios = {
      // Test validation
      validation: {
        context: {
          stage: 'measurements',
          category: 'walls', 
          conversationHistory: [],
          currentData: {
            project_type: 'interior',
            surfaces: ['walls'],
            dimensions: {}
          }
        }
      },
      // Test recommendations
      recommendations: {
        context: {
          stage: 'measurements',
          conversationHistory: [],
          currentData: {
            project_type: 'interior',
            surfaces: ['walls', 'ceilings', 'trim'],
            dimensions: {
              wall_linear_feet: 400,
              ceiling_height: 9
            }
          }
        }
      },
      // Test predictions
      predictions: {
        context: {
          stage: 'project_type',
          conversationHistory: [],
          currentData: {
            customer_name: 'John Smith',
            address: '123 Main St'
          }
        }
      }
    };

    const testContext = scenarios[scenario as keyof typeof scenarios]?.context || scenarios.validation.context;

    // Test enhanced processing
    const result = await enhancedAssistant.processEnhancedMessage(message, testContext);

    return NextResponse.json({
      success: true,
      scenario,
      input: message,
      result,
      features: {
        validation: !!result.validation,
        recommendations: !!result.recommendations,
        insights: !!result.insights
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  // Demo scenarios
  const examples = [
    {
      title: "🔍 Validation Example",
      description: "AI catches unusual measurements",
      test: {
        message: "1000 linear feet, 6 foot ceilings",
        scenario: "validation"
      },
      expectedFeatures: ["Validation warning about unusually low ceilings"]
    },
    {
      title: "💡 Recommendations Example", 
      description: "AI suggests relevant add-ons",
      test: {
        message: "looks good so far",
        scenario: "recommendations"  
      },
      expectedFeatures: ["Smart suggestions for paint type", "Coverage estimates", "Time estimates"]
    },
    {
      title: "🎯 Prediction Example",
      description: "AI estimates typical measurements",
      test: {
        message: "3 bedroom ranch house",
        scenario: "predictions"
      },
      expectedFeatures: ["Estimated linear feet range", "Likely ceiling height", "Room count prediction"]
    }
  ];

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({
      configured: false,
      message: "Enhanced AI features require OpenRouter API key",
      examples
    });
  }

  return NextResponse.json({
    configured: true,
    message: "Enhanced AI Assistant Ready - Test the advanced features!",
    examples,
    instructions: "POST with { message: 'your input', scenario: 'validation|recommendations|predictions' }",
    costEstimate: {
      basic: "$2.70 per 1000 quotes",
      enhanced: "$6-10 per 1000 quotes",
      features: "Validation, Recommendations, Predictions, Smart Corrections"
    }
  });
}