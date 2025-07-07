import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET() {
  const hasApiKey = !!process.env.RESEND_API_KEY;
  const defaultEmail = process.env.DEFAULT_FROM_EMAIL || 'hello@propaintquote.com';
  
  return NextResponse.json({
    configured: hasApiKey,
    apiKeyLength: process.env.RESEND_API_KEY?.length || 0,
    defaultFromEmail: defaultEmail,
    message: hasApiKey ? 'Resend is configured!' : 'Missing RESEND_API_KEY'
  });
}

export async function POST() {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY not configured'
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const result = await resend.emails.send({
      from: process.env.DEFAULT_FROM_EMAIL || 'ProPaint Quote <onboarding@resend.dev>',
      to: 'test@example.com',
      subject: 'ProPaint Quote - Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Email Configuration Successful!</h1>
          <p>This is a test email from ProPaint Quote.</p>
          <p>Your Resend integration is working correctly.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">
            ProPaint Quote - Professional Painting Quote Platform
          </p>
        </div>
      `
    });

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Test email sent successfully!'
    });
  } catch (error: any) {
    console.error('Resend error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send email',
      details: error
    });
  }
}