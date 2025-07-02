import { NextRequest, NextResponse } from "next/server";
import { dbGet } from "@/lib/database-simple";

// Email sending service (mock implementation for development)
async function sendEmail(to: string, subject: string, message: string, quoteId: string) {
  // In production, this would integrate with:
  // - SendGrid
  // - AWS SES
  // - Mailgun
  // - Nodemailer with SMTP
  
  console.log('📧 Email would be sent:', {
    to,
    subject,
    preview: message.substring(0, 100) + '...',
    quoteId
  });
  
  // Simulate email sending delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, always return success
  // In production, this would return actual send status
  return {
    success: true,
    messageId: `email_${Date.now()}`,
    provider: 'demo'
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { to, subject, message } = await request.json();
    
    // Validate inputs
    if (!to || !to.includes('@')) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }
    
    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
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
    
    // Send the email
    const result = await sendEmail(to, subject, message, quote.quote_id);
    
    if (result.success) {
      // Log the email send for tracking
      console.log(`✅ Quote email sent: ${quote.quote_id} → ${to}`);
      
      // In production, you might want to log this to the database
      // await dbRun('INSERT INTO email_logs (quote_id, recipient, subject, sent_at) VALUES (?, ?, ?, ?)', 
      //   [quote.id, to, subject, new Date().toISOString()]);
      
      return NextResponse.json({
        success: true,
        message: "Email sent successfully",
        messageId: result.messageId,
        sentTo: to
      });
    } else {
      throw new Error('Email service failed');
    }
    
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}