import { NextResponse } from 'next/server';
import { gpt4oMiniAssistant } from '@/lib/gpt4o-mini-assistant';

export async function POST(request: Request) {
  try {
    const { message, stage = 'measurements', category = 'walls' } = await request.json();

    // Test the GPT-4o mini assistant
    const result = await gpt4oMiniAssistant.processContractorMessage(message, {
      stage,
      category,
      conversationHistory: [],
      currentData: {},
      expectedInfo: ['wall measurements', 'ceiling height']
    });

    return NextResponse.json({
      success: true,
      input: message,
      result,
      apiKeyConfigured: !!process.env.OPENROUTER_API_KEY
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      apiKeyConfigured: !!process.env.OPENROUTER_API_KEY
    }, { status: 500 });
  }
}

export async function GET() {
  // Simple test to check if API is configured
  const testMessages = [
    "500 by 9",
    "Just 3 doors",
    "no windows",
    "ceiling is 12 feet high"
  ];

  const hasApiKey = !!process.env.OPENROUTER_API_KEY;

  if (!hasApiKey) {
    return NextResponse.json({
      configured: false,
      message: "OpenRouter API key not configured",
      setup: "Add OPENROUTER_API_KEY to your .env.local file",
      documentation: "/docs/OPENROUTER_SETUP.md"
    });
  }

  // Test a simple message
  const testResult = await gpt4oMiniAssistant.chat("Hey there!", { stage: 'greeting' });

  return NextResponse.json({
    configured: true,
    message: "GPT-4o mini is configured and ready!",
    testResponse: testResult,
    testExamples: testMessages,
    endpoints: {
      aiQuoteCreation: "/create-quote-ai",
      testComparison: "/test-claude",
      apiTest: "/api/test-gpt4o (POST)"
    }
  });
}