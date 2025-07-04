import { NextResponse } from 'next/server';
import { communicationService } from '@/lib/communication-service-production';

export async function GET() {
  const emailConfig = {
    hasResendKey: !!process.env.RESEND_API_KEY,
    hasSendGridKey: !!process.env.SENDGRID_API_KEY,
    hasSmtpConfig: !!(process.env.SMTP_HOST && process.env.SMTP_USER),
    defaultFromEmail: process.env.DEFAULT_FROM_EMAIL || 'Not configured',
  };

  const isConfigured = emailConfig.hasResendKey || emailConfig.hasSendGridKey || emailConfig.hasSmtpConfig;

  // Get delivery stats
  const stats = communicationService.getDeliveryStats();

  return NextResponse.json({
    configured: isConfigured,
    activeProvider: isConfigured ? 'production' : 'mock',
    details: emailConfig,
    deliveryStats: stats,
    recommendation: isConfigured 
      ? 'Email is configured and ready to send!' 
      : 'No email provider configured. Add RESEND_API_KEY or SENDGRID_API_KEY to your .env.local file.',
  });
}

export async function POST() {
  try {
    // Send a test email
    const result = await communicationService.sendEmail({
      to: 'test@example.com',
      subject: 'ProPaint Quote - Test Email',
      text: 'This is a test email from ProPaint Quote. If you receive this, email is working!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Test Email Successful!</h1>
          <p>This is a test email from ProPaint Quote.</p>
          <p>If you're seeing this, your email configuration is working correctly.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">ProPaint Quote - Professional Painting Quote Platform</p>
        </div>
      `
    });

    return NextResponse.json({
      success: result.success,
      provider: result.provider,
      messageId: result.messageId,
      message: result.success 
        ? `Test email sent successfully via ${result.provider}` 
        : `Failed to send test email: ${result.error}`
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}