export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { emailTemplateGenerator } from '@/lib/email-templates';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { action, recipient_email } = await request.json();

    // Fetch quote data
    const quoteResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/api/quotes/${params.id}`, {
      headers: {
        'User-Agent': 'Quote-Email-Generator'
      }
    });

    if (!quoteResponse.ok) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    const quote = await quoteResponse.json();
    const quoteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/quotes/${quote.quote_id}/customer`;

    let emailContent;
    
    switch (action) {
      case 'send_quote':
        emailContent = emailTemplateGenerator.generateQuoteDeliveryEmail(quote, quoteUrl);
        break;
        
      case 'follow_up':
        const daysSince = Math.floor((Date.now() - new Date(quote.created_at).getTime()) / (1000 * 60 * 60 * 24));
        emailContent = emailTemplateGenerator.generateFollowUpEmail(quote, quoteUrl, daysSince);
        break;
        
      case 'acceptance_confirmation':
        emailContent = emailTemplateGenerator.generateAcceptanceConfirmationEmail(quote);
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // In a production environment, you would send the actual email here
    // using services like SendGrid, Nodemailer, or AWS SES
    
    // For now, we'll simulate email sending and return the email content for preview
    const emailData = {
      to: recipient_email || quote.customer_email || 'customer@example.com',
      from: quote.company_email || 'noreply@paintingcompany.com',
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      quote_id: quote.quote_id,
      action: action,
      sent_at: new Date().toISOString()
    };

    // TODO: Integrate with actual email service
    // await sendEmail(emailData);

    // For development, log the email data
    console.log('Email would be sent:', {
      to: emailData.to,
      subject: emailData.subject,
      action: emailData.action
    });

    // Store email record in database (optional)
    // await storeEmailRecord(emailData);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      email_preview: {
        to: emailData.to,
        subject: emailData.subject,
        sent_at: emailData.sent_at
      }
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

// Preview email template without sending
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'send_quote';
    const format = searchParams.get('format') || 'html';

    // Fetch quote data
    const quoteResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/api/quotes/${params.id}`);
    const quote = await quoteResponse.json();
    const quoteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/quotes/${quote.quote_id}/customer`;

    let emailContent;
    
    switch (action) {
      case 'send_quote':
        emailContent = emailTemplateGenerator.generateQuoteDeliveryEmail(quote, quoteUrl);
        break;
        
      case 'follow_up':
        const daysSince = Math.floor((Date.now() - new Date(quote.created_at).getTime()) / (1000 * 60 * 60 * 24));
        emailContent = emailTemplateGenerator.generateFollowUpEmail(quote, quoteUrl, daysSince);
        break;
        
      case 'acceptance_confirmation':
        emailContent = emailTemplateGenerator.generateAcceptanceConfirmationEmail(quote);
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    if (format === 'html') {
      return new NextResponse(emailContent.html, {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    } else if (format === 'text') {
      return new NextResponse(emailContent.text, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    } else {
      return NextResponse.json({
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      });
    }

  } catch (error) {
    console.error('Email preview error:', error);
    return NextResponse.json(
      { error: 'Failed to generate email preview' },
      { status: 500 }
    );
  }
}