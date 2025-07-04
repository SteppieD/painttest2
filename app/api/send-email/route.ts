import { NextRequest, NextResponse } from "next/server";

// Simple email template for access codes
const getAccessCodeEmailTemplate = (companyName: string, accessCode: string, email: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">🎨 ProPaint Quote</h1>
        <p style="color: #6b7280; margin-top: 5px;">Your Professional Painting Quote Assistant</p>
      </div>
      
      <div style="background-color: #f3f4f6; border-radius: 8px; padding: 30px; margin-bottom: 30px;">
        <h2 style="color: #111827; margin-top: 0;">Welcome to ProPaint Quote!</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          Your trial account for <strong>${companyName}</strong> has been created successfully.
        </p>
        
        <div style="background-color: #dbeafe; border: 2px solid #3b82f6; border-radius: 6px; padding: 20px; margin: 20px 0; text-align: center;">
          <p style="color: #1e40af; margin: 0; font-size: 14px;">Your Access Code:</p>
          <p style="color: #1d4ed8; font-size: 28px; font-weight: bold; margin: 10px 0; letter-spacing: 2px;">
            ${accessCode}
          </p>
          <p style="color: #1e40af; margin: 0; font-size: 12px;">
            Save this code - you'll need it to sign in
          </p>
        </div>
        
        <div style="background-color: #d1fae5; border-radius: 6px; padding: 15px; margin: 20px 0;">
          <h3 style="color: #065f46; margin: 0 0 10px 0; font-size: 16px;">✅ Your Free Trial Includes:</h3>
          <ul style="color: #047857; margin: 5px 0; padding-left: 20px;">
            <li>1 Professional Quote (no credit card required)</li>
            <li>AI-Powered Quote Assistant</li>
            <li>Full Dashboard Access</li>
            <li>Mobile & Desktop Compatible</li>
          </ul>
        </div>
      </div>
      
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app'}/access-code" 
           style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Sign In Now
        </a>
      </div>
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
        <p style="margin: 5px 0;">
          <strong>Important:</strong> Keep this email for your records. Your access code is: <strong>${accessCode}</strong>
        </p>
        <p style="margin: 5px 0;">
          If you forget your access code, you can recover it by entering your email address at the login page.
        </p>
      </div>
    </div>
  `;
};

export async function POST(request: NextRequest) {
  try {
    const { email, companyName, accessCode, type } = await request.json();

    if (!email || !companyName || !accessCode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Use communication service for sending emails
    const { communicationService } = await import('@/lib/communication-service-production');
    
    const emailHtml = getAccessCodeEmailTemplate(companyName, accessCode, email);
    const emailText = `
Welcome to ProPaint Quote!

Your trial account for ${companyName} has been created successfully.

Your Access Code: ${accessCode}

Save this code - you'll need it to sign in.

Your Free Trial Includes:
- 1 Professional Quote (no credit card required)
- AI-Powered Quote Assistant
- Full Dashboard Access
- Mobile & Desktop Compatible

Sign in at: ${process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app'}/access-code

Important: Keep this email for your records.
    `.trim();
    
    const result = await communicationService.sendEmail({
      to: email,
      subject: 'Your ProPaint Quote Access Code',
      text: emailText,
      html: emailHtml,
      from: process.env.DEFAULT_FROM_EMAIL || 'ProPaint Quote <onboarding@resend.dev>',
      priority: 'high'
    });

    if (result.success) {
      console.log(`✅ Email sent successfully to ${email} via ${result.provider}`);
    } else {
      console.error(`❌ Failed to send email: ${result.error}`);
    }

    return NextResponse.json({
      success: result.success,
      message: result.success ? "Email sent successfully" : result.error,
      provider: result.provider
    });

  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}