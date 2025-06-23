// Test script for the Two-Stage AI system
// Run with: node test-two-stage-ai.js

import { TwoStageAISystem } from './lib/two-stage-ai-system.js';

async function testTwoStageSystem() {
  console.log('🎯 Testing Two-Stage AI Quote System\n');
  
  const aiSystem = new TwoStageAISystem();
  
  // Simulate the conversation from your example
  const mockConversation = [
    { role: 'user', content: 'I need a quote for painting', timestamp: '2024-06-23T10:00:00Z' },
    { role: 'assistant', content: 'Hi! I\'d be happy to help you with a painting quote. Could I start by getting your name and the address where the project will be?', timestamp: '2024-06-23T10:00:05Z' },
    { role: 'user', content: 'My name is Cici and the address is 9090 Hillside Drive', timestamp: '2024-06-23T10:00:30Z' },
    { role: 'assistant', content: 'Perfect! Is this an interior painting project, exterior, or both interior and exterior?', timestamp: '2024-06-23T10:00:35Z' },
    { role: 'user', content: 'Interior painting only', timestamp: '2024-06-23T10:01:00Z' },
    { role: 'assistant', content: 'Got it! Which rooms or areas are you looking to have painted?', timestamp: '2024-06-23T10:01:05Z' },
    { role: 'user', content: 'It\'s 500 linear feet of interior space, ceilings are 9 feet tall. We are not painting doors, trim, windows, or ceilings - just walls.', timestamp: '2024-06-23T10:01:30Z' },
    { role: 'assistant', content: 'Great! For the walls, what surfaces do you want painted - just the walls, or also ceilings, trim, doors, and windows?', timestamp: '2024-06-23T10:01:35Z' },
    { role: 'user', content: 'Just walls, no ceilings, no doors, no trim, no windows', timestamp: '2024-06-23T10:02:00Z' },
    { role: 'assistant', content: 'Perfect! Do you have any preferences for paint quality or brand?', timestamp: '2024-06-23T10:02:05Z' },
    { role: 'user', content: '$50 a gallon bucket eggshell Sherwin Williams. Spread rate is 350 square feet per gallon. No primer needed. Labor is included at $1.50 per square foot. Add 20% markup.', timestamp: '2024-06-23T10:02:30Z' },
  ];
  
  console.log('📝 Mock Conversation:');
  mockConversation.forEach((msg, i) => {
    console.log(`${i + 1}. ${msg.role}: ${msg.content}`);
  });
  
  console.log('\n🤖 Stage 1: Natural Conversation Test');
  try {
    const stage1Result = await aiSystem.processConversationMessage(
      'Add 20% markup to the total',
      mockConversation,
      'test-company-123'
    );
    
    console.log('Stage 1 Response:', stage1Result.response);
    console.log('Ready for Quoting:', stage1Result.isReadyForQuoting);
  } catch (error) {
    console.log('Stage 1 Error (expected in test):', error.message);
  }
  
  console.log('\n🎯 Stage 2: Quote Processing Test');
  try {
    const stage2Result = await aiSystem.processQuoteGeneration(
      mockConversation,
      'test-company-123'
    );
    
    console.log('Stage 2 Extracted Data:');
    console.log(JSON.stringify(stage2Result, null, 2));
    
    console.log('\n📊 Professional Quote Display:');
    const quoteDisplay = aiSystem.generateQuoteDisplay(stage2Result);
    console.log(quoteDisplay);
    
  } catch (error) {
    console.log('Stage 2 Error (expected in test):', error.message);
  }
  
  console.log('\n✅ Two-Stage AI System Test Complete');
  console.log('💡 Next Steps:');
  console.log('1. Integrate with real AI API (OpenAI, Anthropic, etc.)');
  console.log('2. Test with actual conversation data');
  console.log('3. Integrate with quote creation workflow');
}

// Run the test
testTwoStageSystem().catch(console.error);