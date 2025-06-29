import { NextRequest, NextResponse } from "next/server";
import { dbGet } from "@/lib/database-simple";

// SMS sending service (mock implementation for development)
async function sendSMS(to: string, message: string, quoteId: string) {
  // In production, this would integrate with:
  // - Twilio
  // - AWS SNS
  // - Vonage (Nexmo)
  // - TextMagic
  
  console.log('📱 SMS would be sent:', {
    to,
    message: message.substring(0, 50) + '...',
    length: message.length,
    quoteId
  });
  
  // Simulate SMS sending delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For demo purposes, always return success
  // In production, this would return actual send status
  return {
    success: true,
    messageId: `sms_${Date.now()}`,
    provider: 'demo',
    segments: Math.ceil(message.length / 160)
  };
}

function validatePhoneNumber(phone: string): boolean {
  // Basic phone number validation
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // US phone numbers should be 10 or 11 digits (with country code)
  return digits.length === 10 || (digits.length === 11 && digits[0] === '1');
}

function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Add country code if not present
  if (digits.length === 10) {
    return `+1${digits}`;
  } else if (digits.length === 11 && digits[0] === '1') {
    return `+${digits}`;
  }
  
  return phone; // Return as-is if format is unclear
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { to, message } = await request.json();
    
    // Validate inputs
    if (!to) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }
    
    if (!validatePhoneNumber(to)) {
      return NextResponse.json(
        { error: "Valid phone number is required (10-11 digits)" },
        { status: 400 }
      );
    }
    
    if (!message || message.length === 0) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }
    
    if (message.length > 160) {
      return NextResponse.json(
        { error: "Message too long (160 character limit)" },
        { status: 400 }
      );
    }
    
    // Verify quote exists
    const quote = await dbGet(`
      SELECT q.*, c.company_name 
      FROM quotes q 
      LEFT JOIN companies c ON q.company_id = c.id 
      WHERE q.id = ? OR q.quote_id = ?
    `, [params.id, params.id]);
    
    if (!quote) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }
    
    // Format phone number
    const formattedPhone = formatPhoneNumber(to);
    
    // Send the SMS
    const result = await sendSMS(formattedPhone, message, quote.quote_id);
    
    if (result.success) {
      // Log the SMS send for tracking
      console.log(`✅ Quote SMS sent: ${quote.quote_id} → ${formattedPhone}`);
      
      // In production, you might want to log this to the database
      // await dbRun('INSERT INTO sms_logs (quote_id, recipient, message, segments, sent_at) VALUES (?, ?, ?, ?, ?)', 
      //   [quote.id, formattedPhone, message, result.segments, new Date().toISOString()]);
      
      return NextResponse.json({
        success: true,
        message: "SMS sent successfully",
        messageId: result.messageId,
        sentTo: formattedPhone,
        segments: result.segments,
        estimatedCost: `$${(result.segments * 0.0075).toFixed(4)}` // Typical SMS cost
      });
    } else {
      throw new Error('SMS service failed');
    }
    
  } catch (error) {
    console.error("Error sending SMS:", error);
    return NextResponse.json(
      { error: "Failed to send SMS" },
      { status: 500 }
    );
  }
}