import { NextResponse } from 'next/server';

export async function GET() {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const googleAIKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  
  return NextResponse.json({
    openrouter_configured: !!openRouterKey,
    openrouter_key_length: openRouterKey?.length || 0,
    google_ai_configured: !!googleAIKey,
    google_ai_key_length: googleAIKey?.length || 0,
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}