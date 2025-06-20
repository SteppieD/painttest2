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

    // In a production environment, you would use a real email service like:
    // - SendGrid
    // - AWS SES
    // - Resend
    // - Postmark
    
    // For now, we'll just log the email and return success
    console.log("📧 Email would be sent to:", email);
    console.log("Subject: Your ProPaint Quote Access Code");
    console.log("Company:", companyName);
    console.log("Access Code:", accessCode);

    // In production, uncomment and configure your email service:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: email,
      from: 'noreply@propaintquote.com',
      subject: 'Your ProPaint Quote Access Code',
      html: getAccessCodeEmailTemplate(companyName, accessCode, email),
    };
    
    await sgMail.send(msg);
    */

    return NextResponse.json({
      success: true,
      message: "Email sent successfully"
    });

  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}