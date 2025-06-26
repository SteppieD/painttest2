const puppeteer = require('puppeteer');

async function testComprehensiveFlow() {
  let browser;
  try {
    console.log('🚀 Starting comprehensive flow test...');
    
    browser = await puppeteer.launch({ 
      headless: false, 
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Navigate to access code page
    console.log('📱 Navigating to access code page...');
    await page.goto('http://localhost:3001/access-code');
    await page.waitForSelector('input[type="text"]', { timeout: 10000 });
    
    // Enter demo access code
    console.log('🔑 Entering access code...');
    await page.type('input[type="text"]', 'DEMO2024');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    console.log('⏳ Waiting for dashboard...');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    // Navigate to create quote
    console.log('📝 Navigating to create quote...');
    await page.goto('http://localhost:3001/create-quote');
    await page.waitForSelector('input[placeholder="Type your message..."]', { timeout: 15000 });
    
    // Wait for initial AI message
    await page.waitForTimeout(2000);
    
    // Test the comprehensive input that should trigger fallback
    console.log('💬 Testing comprehensive input...');
    const comprehensiveInput = "Its for Cici at 9090 Hillside Drive. We are not painting the ceilings. The project is a 500 linear feet of interior painting. $50 a gallon bucket eggshell shirwin williams.";
    
    await page.type('input[placeholder="Type your message..."]', comprehensiveInput);
    await page.click('button[type="submit"]');
    
    // Wait for AI response
    console.log('⏳ Waiting for AI response...');
    await page.waitForTimeout(8000); // Give time for thinking and response
    
    // Get the last message using the correct selector structure  
    const messages = await page.$$eval('div[class*="max-w-"]', msgs => 
      msgs.map(msg => ({
        content: msg.textContent
      }))
    );
    
    const lastMessage = messages[messages.length - 1];
    console.log('🤖 AI Response:', lastMessage.content);
    
    // Check if the response contains expected comprehensive parsing results
    const hasCustomerName = lastMessage.content.includes('Cici');
    const hasAddress = lastMessage.content.includes('9090 Hillside Drive');
    const hasLinearFeet = lastMessage.content.includes('500');
    const hasCeilingExclusion = lastMessage.content.includes('ceiling') || lastMessage.content.includes('Excluding');
    const hasPaintSpecs = lastMessage.content.includes('Eggshell') || lastMessage.content.includes('$50');
    
    console.log('✅ Test Results:');
    console.log(`   Customer Name (Cici): ${hasCustomerName ? '✅' : '❌'}`);
    console.log(`   Address (9090 Hillside Drive): ${hasAddress ? '✅' : '❌'}`);
    console.log(`   Linear Feet (500): ${hasLinearFeet ? '✅' : '❌'}`);
    console.log(`   Ceiling Exclusion: ${hasCeilingExclusion ? '✅' : '❌'}`);
    console.log(`   Paint Specs (Eggshell/$50): ${hasPaintSpecs ? '✅' : '❌'}`);
    
    const successfulExtractions = [hasCustomerName, hasAddress, hasLinearFeet, hasCeilingExclusion, hasPaintSpecs].filter(Boolean).length;
    
    if (successfulExtractions >= 4) {
      console.log('🎉 SUCCESS: Comprehensive parser is working correctly!');
      console.log(`   Extracted ${successfulExtractions}/5 pieces of information`);
    } else {
      console.log('❌ FAILURE: Comprehensive parser not working as expected');
      console.log(`   Only extracted ${successfulExtractions}/5 pieces of information`);
    }
    
    console.log('\n📋 Full AI Response:');
    console.log(lastMessage.content);
    
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser will stay open for manual inspection...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

testComprehensiveFlow();