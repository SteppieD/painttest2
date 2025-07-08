import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userMessage, conversationHistory, companyId, instruction } = await request.json();
    
    // Mock AI response for now - replace with actual AI API call
    console.log('🎯 Stage 1 AI: Processing conversation message');
    console.log('User message:', userMessage);
    console.log('History length:', conversationHistory.length);
    
    // Simulate AI response based on conversation context
    let response = "";
    let isReadyForQuoting = false;
    
    const conversationText = conversationHistory.map(m => m.content).join(' ').toLowerCase();
    
    // Progressive conversation flow logic
    if (!conversationText.includes('name') && !userMessage.toLowerCase().includes('name')) {
      response = "Hi! I'd be happy to help you with a painting quote. Could I start by getting your name and the address where the project will be?";
    } else if (!conversationText.includes('interior') && !conversationText.includes('exterior')) {
      response = "Perfect! Is this an interior painting project, exterior, or both interior and exterior?";
    } else if (!conversationText.includes('room') && !conversationText.includes('area') && !conversationText.includes('sqft')) {
      response = "Got it! Which rooms or areas are you looking to have painted? For example, living room, bedrooms, kitchen, etc.";
    } else if (!conversationText.includes('wall') && !conversationText.includes('ceiling') && !conversationText.includes('trim')) {
      response = "Great! For each of those areas, what surfaces do you want painted - just the walls, or also ceilings, trim, doors, and windows?";
    } else if (!conversationText.includes('feet') && !conversationText.includes('x') && !conversationText.includes('dimension')) {
      response = "Excellent! To give you an accurate quote, I'll need approximate room dimensions. Could you give me the length and width of the main areas? For example, '12 feet by 10 feet' or '12x10'.";
    } else if (!conversationText.includes('paint') && !conversationText.includes('quality') && !conversationText.includes('brand')) {
      response = "Perfect! Do you have any preferences for paint quality or brand? For example, are you looking for good quality (like Behr), better quality (like Sherwin-Williams), or premium quality?";
    } else {
      response = "Excellent! I think I have enough information to put together a detailed quote for you. Let me calculate the materials and labor... READY_FOR_QUOTING";
      isReadyForQuoting = true;
    }
    
    // Add contextual responses based on user input
    if (userMessage.toLowerCase().includes('budget') || userMessage.toLowerCase().includes('cost')) {
      response = "I understand budget is important! " + response;
    }
    
    if (userMessage.toLowerCase().includes('timeline') || userMessage.toLowerCase().includes('when')) {
      response = response + " Also, when are you hoping to have this project completed?";
    }
    
    return NextResponse.json({
      response,
      isReadyForQuoting
    });
    
  } catch (error) {
    console.error('Conversation stage error:', error);
    return NextResponse.json(
      { error: "Failed to process conversation" },
      { status: 500 }
    );
  }
}