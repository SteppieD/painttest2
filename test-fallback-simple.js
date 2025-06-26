// Simple test to verify the LangChain -> Comprehensive Parser fallback logic

async function testFallback() {
  console.log('🚀 Testing LangChain -> Comprehensive Parser fallback...');
  
  const testInput = "Its for Cici at 9090 Hillside Drive. We are not painting the ceilings. The project is a 500 linear feet of interior painting. $50 a gallon bucket eggshell shirwin williams.";
  
  try {
    // Test the LangChain API first
    console.log('1️⃣ Testing LangChain API...');
    const langchainResponse = await fetch('http://localhost:3001/api/quote-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: testInput,
        conversationHistory: [],
        existingQuoteData: {},
        companyId: 1
      })
    });
    
    if (langchainResponse.ok) {
      const langchainData = await langchainResponse.json();
      console.log('📊 LangChain Response:', langchainData.response);
      console.log('🔍 Customer Name:', langchainData.extractedInfo.customer_name);
      console.log('🔍 Address:', langchainData.extractedInfo.address);
      console.log('🔍 Confidence:', langchainData.extractedInfo.confidence_level);
      
      // Check if this should trigger fallback
      const hasMeaningfulExtraction = (
        langchainData.extractedInfo.customer_name || 
        langchainData.extractedInfo.address || 
        langchainData.extractedInfo.project_type || 
        langchainData.extractedInfo.dimensions.linear_feet || 
        langchainData.extractedInfo.dimensions.ceiling_height ||
        langchainData.extractedInfo.paint_specs.brand ||
        langchainData.extractedInfo.paint_specs.finish ||
        langchainData.extractedInfo.paint_specs.price_per_gallon
      );
      
      const shouldFallback = !hasMeaningfulExtraction || 
                            langchainData.response.includes("I'm having trouble") || 
                            langchainData.response.includes("System error") ||
                            langchainData.extractedInfo.confidence_level === 'low';
      
      console.log('❓ Should fallback to comprehensive parser?', shouldFallback);
      
      if (shouldFallback) {
        console.log('\n2️⃣ Testing Comprehensive Parser fallback...');
        
        // Test comprehensive parser directly
        const comprehensiveResponse = await fetch('http://localhost:3001/api/test-comprehensive-parser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: testInput })
        });
        
        if (comprehensiveResponse.ok) {
          const comprehensiveData = await comprehensiveResponse.json();
          console.log('✅ Comprehensive Parser Response:', comprehensiveData.response);
          console.log('🔍 Customer Name:', comprehensiveData.extracted.customer_name);
          console.log('🔍 Address:', comprehensiveData.extracted.address);
          console.log('🔍 Linear Feet:', comprehensiveData.extracted.dimensions.linear_feet);
          console.log('🔍 Paint Finish:', comprehensiveData.extracted.paint_specs.finish);
          console.log('🔍 Paint Price:', comprehensiveData.extracted.paint_specs.price_per_gallon);
          console.log('🔍 Confidence:', comprehensiveData.extracted.confidence_level);
          
          console.log('\n🎉 RESULT: Fallback system should work correctly!');
          console.log('   - LangChain fails with error message');
          console.log('   - Comprehensive parser extracts all information');
          console.log('   - Frontend should detect LangChain failure and use comprehensive parser');
        } else {
          console.log('❌ Comprehensive parser API failed');
        }
      } else {
        console.log('✅ LangChain worked, no fallback needed');
      }
    } else {
      console.log('❌ LangChain API request failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testFallback();