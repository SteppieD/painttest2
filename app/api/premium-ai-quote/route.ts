import { NextResponse } from 'next/server';
import { multiAgentSystem } from '@/lib/multi-agent-system';

export async function POST(request: Request) {
  try {
    const { message, context } = await request.json();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Premium AI features require OpenRouter API key configuration'
      }, { status: 500 });
    }

    // Use the multi-agent system to process the message
    const result = await multiAgentSystem.coordinateAgents(message, {
      stage: context.stage || 'initial',
      category: context.category,
      conversationHistory: context.conversationHistory || [],
      currentData: context.currentData || {},
      expectedInfo: context.expectedInfo,
      customerProfile: context.customerProfile,
      projectContext: context.projectContext
    });

    // Extract any quote data updates from the understanding
    let updatedData = {};
    
    // Parse the primary response for structured data extraction
    // This is a simplified approach - in production, you'd want more sophisticated parsing
    const lowerMessage = message.toLowerCase();
    const currentData = context.currentData || {};

    // Extract customer name
    if (lowerMessage.includes('name') || (!currentData.customer_name && context.stage === 'initial')) {
      const nameMatch = message.match(/(?:name is|i'm|called|my name)\s+([a-zA-Z\s]+)/i);
      if (nameMatch) {
        updatedData = { ...updatedData, customer_name: nameMatch[1].trim() };
      }
    }

    // Extract address
    if (lowerMessage.includes('address') || lowerMessage.includes('street') || lowerMessage.includes('location')) {
      const addressMatch = message.match(/(?:address is|location is|at)\s+(.+?)(?:\.|$)/i);
      if (addressMatch) {
        updatedData = { ...updatedData, address: addressMatch[1].trim() };
      }
    }

    // Extract project type
    if (lowerMessage.includes('interior') || lowerMessage.includes('exterior') || lowerMessage.includes('commercial')) {
      if (lowerMessage.includes('interior')) updatedData = { ...updatedData, project_type: 'interior' };
      if (lowerMessage.includes('exterior')) updatedData = { ...updatedData, project_type: 'exterior' };
      if (lowerMessage.includes('commercial')) updatedData = { ...updatedData, project_type: 'commercial' };
    }

    // Extract surfaces
    const surfaces = [];
    if (lowerMessage.includes('wall')) surfaces.push('walls');
    if (lowerMessage.includes('ceiling')) surfaces.push('ceilings');
    if (lowerMessage.includes('trim') || lowerMessage.includes('baseboard')) surfaces.push('trim');
    if (lowerMessage.includes('door')) surfaces.push('doors');
    if (lowerMessage.includes('window')) surfaces.push('windows');
    
    if (surfaces.length > 0) {
      updatedData = { ...updatedData, surfaces };
    }

    // Update stage based on what information we have
    let newStage = context.stage;
    if (!currentData.customer_name && updatedData.customer_name) {
      newStage = 'customer_info';
    } else if (currentData.customer_name && !currentData.project_type && updatedData.project_type) {
      newStage = 'project_type';
    } else if (currentData.project_type && !currentData.surfaces && updatedData.surfaces) {
      newStage = 'surface_selection';
    } else if (currentData.surfaces && Object.keys(currentData.dimensions || {}).length === 0) {
      newStage = 'measurements';
    }

    updatedData = { ...updatedData, stage: newStage };

    return NextResponse.json({
      success: true,
      primary_response: result.primary_response,
      validation_notes: result.validation_notes,
      strategy_suggestions: result.strategy_suggestions,
      pricing_insights: result.pricing_insights,
      next_action: result.next_action,
      confidence: result.confidence,
      updated_data: Object.keys(updatedData).length > 0 ? updatedData : null,
      cost_info: {
        estimated_cost: 0.10, // $0.10 per interaction
        agents_used: [
          result.primary_response ? 'Understanding Agent' : null,
          result.validation_notes ? 'Validation Agent' : null,
          result.strategy_suggestions ? 'Strategy Agent' : null,
          result.pricing_insights ? 'Pricing Agent' : null
        ].filter(Boolean)
      }
    });

  } catch (error) {
    console.error('Premium AI Quote error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      fallback_response: 'I apologize, but I\'m having trouble processing your request right now. Let me try again - could you tell me about your painting project?'
    }, { status: 500 });
  }
}

export async function GET() {
  // System status and capabilities
  const capabilities = {
    system: 'Multi-Agent AI System',
    agents: [
      {
        name: 'Understanding Agent',
        model: 'GPT-4o',
        role: 'Master conversation & natural language processing',
        cost: '$0.03 per interaction'
      },
      {
        name: 'Validation Agent', 
        model: 'Claude 3.5 Sonnet',
        role: 'Expert error detection & quality control',
        cost: '$0.02 per interaction'
      },
      {
        name: 'Strategy Agent',
        model: 'GPT-4o', 
        role: 'Business optimization & recommendations',
        cost: '$0.03 per interaction'
      },
      {
        name: 'Paint Expert Agent',
        model: 'GPT-4o mini',
        role: 'Product knowledge & recommendations', 
        cost: '$0.01 per interaction'
      },
      {
        name: 'Pricing Agent',
        model: 'Claude 3.5 Haiku',
        role: 'Market intelligence & competitive analysis',
        cost: '$0.01 per interaction'
      }
    ],
    total_cost_per_quote: '$0.10',
    features: [
      'Natural conversation understanding',
      'Automatic error detection and validation',
      'Business optimization suggestions', 
      'Market pricing intelligence',
      'Paint product expertise',
      'Upsell opportunity identification',
      'Risk assessment and mitigation',
      'Customer psychology insights'
    ],
    configured: !!process.env.OPENROUTER_API_KEY
  };

  return NextResponse.json(capabilities);
}