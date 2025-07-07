/**
 * Production Communication Service - Resend Only
 * 
 * This is a production-optimized version that only uses installed packages
 */

import { z } from 'zod';
import { InputSanitizer } from './enhanced-input-sanitization';
import { Resend } from 'resend';

// Email service providers
interface EmailProvider {
  name: string;
  send: (options: EmailOptions) => Promise<EmailResult>;
}

export interface EmailOptions {
  to: string;
  cc?: string[];
  bcc?: string[];
  from?: string;
  fromName?: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: EmailAttachment[];
  template?: string;
  templateData?: Record<string, any>;
  priority?: 'low' | 'normal' | 'high';
  trackOpens?: boolean;
  trackClicks?: boolean;
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
  disposition?: 'attachment' | 'inline';
  cid?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: string;
  timestamp: Date;
}

// Validation schemas
const EmailSchema = z.object({
  to: z.string().email(),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  from: z.string().email().optional(),
  fromName: z.string().max(100).optional(),
  subject: z.string().min(1).max(200),
  text: z.string().min(1),
  html: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high']).optional(),
  trackOpens: z.boolean().optional(),
  trackClicks: z.boolean().optional()
});

class CommunicationService {
  private emailProviders: EmailProvider[] = [];
  private deliveryLog: Map<string, any> = new Map();
  
  constructor() {
    this.initializeProviders();
  }

  /**
   * Initialize email providers
   */
  private initializeProviders() {
    // Add email providers based on environment variables
    if (process.env.RESEND_API_KEY) {
      this.emailProviders.push(new ResendProvider());
    }

    // Fallback providers for development
    if (this.emailProviders.length === 0) {
      this.emailProviders.push(new MockEmailProvider());
    }
  }

  /**
   * Send email with automatic fallback and retry
   */
  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    // Validate input
    const validation = EmailSchema.safeParse(options);
    if (!validation.success) {
      return {
        success: false,
        error: `Validation failed: ${validation.error.errors.map(e => e.message).join(', ')}`,
        provider: 'validation',
        timestamp: new Date()
      };
    }

    // Sanitize inputs
    const sanitizedOptions = this.sanitizeEmailOptions(options);

    // Try each email provider until one succeeds
    let lastError = '';
    for (const provider of this.emailProviders) {
      try {
        const result = await provider.send(sanitizedOptions);
        
        // Log delivery attempt
        this.logDelivery('email', result, sanitizedOptions);
        
        if (result.success) {
          return result;
        }
        
        lastError = result.error || 'Unknown error';
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Provider error';
        console.error(`Email provider ${provider.name} failed:`, error);
      }
    }

    // All providers failed
    const failureResult = {
      success: false,
      error: `All email providers failed. Last error: ${lastError}`,
      provider: 'all-failed',
      timestamp: new Date()
    };

    this.logDelivery('email', failureResult, sanitizedOptions);
    return failureResult;
  }

  /**
   * Send quote via email with professional template
   */
  async sendQuoteEmail(
    customerEmail: string,
    quoteData: any,
    companyData: any
  ): Promise<EmailResult> {
    const quoteTemplate = this.generateQuoteEmailTemplate(quoteData, companyData);
    
    return this.sendEmail({
      to: customerEmail,
      from: companyData.email || process.env.DEFAULT_FROM_EMAIL || 'quotes@paintingapp.com',
      fromName: companyData.company_name || 'Professional Painting',
      subject: `Your Painting Quote - ${quoteData.quote_id}`,
      text: quoteTemplate.text,
      html: quoteTemplate.html,
      trackOpens: true,
      trackClicks: true
    });
  }

  /**
   * Send notification to company
   */
  async sendCompanyNotification(
    companyEmail: string,
    type: 'new_quote' | 'quote_accepted' | 'quote_declined',
    data: any
  ): Promise<EmailResult> {
    const templates = {
      new_quote: {
        subject: `New Quote Created - ${data.quote_id}`,
        text: `A new quote has been created for ${data.customer_name}.\n\nQuote ID: ${data.quote_id}\nAmount: $${data.final_price}\nCustomer: ${data.customer_name}\nEmail: ${data.customer_email || 'Not provided'}\nPhone: ${data.customer_phone || 'Not provided'}\n\nView in dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
      },
      quote_accepted: {
        subject: `Quote Accepted - ${data.quote_id}`,
        text: `Great news! ${data.customer_name} has accepted quote ${data.quote_id} for $${data.final_price}.\n\nNext steps:\n1. Contact customer to schedule\n2. Confirm project details\n3. Order materials\n\nView quote: ${process.env.NEXT_PUBLIC_APP_URL}/quotes/${data.id}`
      },
      quote_declined: {
        subject: `Quote Declined - ${data.quote_id}`,
        text: `Quote ${data.quote_id} for ${data.customer_name} has been declined.\n\nYou may want to follow up with a revised quote or additional information.\n\nView quote: ${process.env.NEXT_PUBLIC_APP_URL}/quotes/${data.id}`
      }
    };

    const template = templates[type];
    
    return this.sendEmail({
      to: companyEmail,
      subject: template.subject,
      text: template.text,
      priority: type === 'quote_accepted' ? 'high' : 'normal'
    });
  }

  /**
   * Generate professional quote email template
   */
  private generateQuoteEmailTemplate(quoteData: any, companyData: any): {
    text: string;
    html: string;
  } {
    const text = `
Dear ${quoteData.customer_name},

Thank you for your interest in our painting services! We've prepared a detailed quote for your project.

QUOTE DETAILS
Quote ID: ${quoteData.quote_id}
Project: ${quoteData.project_type} painting
Address: ${quoteData.address || 'As discussed'}

PRICING
${quoteData.rooms ? quoteData.rooms.map((room: any) => `${room.name}: ${room.wallsSquareFootage} sq ft`).join('\n') : ''}
Total: $${quoteData.final_price?.toFixed(2) || quoteData.total_revenue?.toFixed(2)}

${quoteData.special_requests ? `SPECIAL REQUESTS:\n${quoteData.special_requests}\n` : ''}

To accept this quote or ask questions, please reply to this email or call us at ${companyData.phone || '(555) 123-4567'}.

Best regards,
${companyData.company_name || 'Professional Painting'}
${companyData.email || ''}
${companyData.phone || ''}
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .quote-details { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .total { font-size: 18px; font-weight: bold; color: #2563eb; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 14px; }
        .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${companyData.company_name || 'Professional Painting'}</h1>
        <p>Your Painting Quote is Ready</p>
    </div>
    
    <div class="content">
        <p>Dear ${quoteData.customer_name},</p>
        
        <p>Thank you for your interest in our painting services! We've prepared a detailed quote for your project.</p>
        
        <div class="quote-details">
            <h3>Quote Details</h3>
            <p><strong>Quote ID:</strong> ${quoteData.quote_id}</p>
            <p><strong>Project:</strong> ${quoteData.project_type} painting</p>
            <p><strong>Address:</strong> ${quoteData.address || 'As discussed'}</p>
            
            ${quoteData.rooms ? `
            <h4>Areas to Paint:</h4>
            <ul>
                ${quoteData.rooms.map((room: any) => `<li>${room.name}: ${room.wallsSquareFootage} sq ft</li>`).join('')}
            </ul>
            ` : ''}
            
            <p class="total">Total: $${quoteData.final_price?.toFixed(2) || quoteData.total_revenue?.toFixed(2)}</p>
        </div>
        
        ${quoteData.special_requests ? `
        <div class="quote-details">
            <h4>Special Requests:</h4>
            <p>${quoteData.special_requests}</p>
        </div>
        ` : ''}
        
        <p>To accept this quote or ask questions, please reply to this email or call us.</p>
        
        <a href="tel:${companyData.phone || '(555) 123-4567'}" class="button">Call Us</a>
        <a href="mailto:${companyData.email || ''}" class="button">Email Us</a>
    </div>
    
    <div class="footer">
        <p>${companyData.company_name || 'Professional Painting'}</p>
        <p>${companyData.email || ''} | ${companyData.phone || ''}</p>
    </div>
</body>
</html>
    `.trim();

    return { text, html };
  }

  /**
   * Sanitize email options
   */
  private sanitizeEmailOptions(options: EmailOptions): EmailOptions {
    return {
      ...options,
      to: InputSanitizer.sanitizeEmail(options.to),
      cc: options.cc?.map(email => InputSanitizer.sanitizeEmail(email)),
      bcc: options.bcc?.map(email => InputSanitizer.sanitizeEmail(email)),
      from: options.from ? InputSanitizer.sanitizeEmail(options.from) : options.from,
      fromName: options.fromName ? InputSanitizer.sanitizeString(options.fromName) : options.fromName,
      subject: InputSanitizer.sanitizeString(options.subject),
      text: InputSanitizer.sanitizeString(options.text),
      html: options.html ? InputSanitizer.sanitizeHtml(options.html) : options.html
    };
  }

  /**
   * Log delivery attempts for tracking and debugging
   */
  private logDelivery(type: 'email', result: EmailResult, options: any): void {
    const logEntry = {
      type,
      result,
      options: {
        to: options.to,
        subject: options.subject,
        timestamp: new Date(),
        success: result.success,
        provider: result.provider
      }
    };

    // Store in memory (use database in production)
    this.deliveryLog.set(`${type}_${Date.now()}_${Math.random()}`, logEntry);

    // Clean up old logs (keep last 1000)
    if (this.deliveryLog.size > 1000) {
      const keys = Array.from(this.deliveryLog.keys());
      for (let i = 0; i < keys.length - 1000; i++) {
        this.deliveryLog.delete(keys[i]);
      }
    }

    console.log(`${type.toUpperCase()} delivery:`, logEntry);
  }

  /**
   * Get delivery statistics
   */
  getDeliveryStats(): {
    email: { sent: number; failed: number; rate: number };
  } {
    const logs = Array.from(this.deliveryLog.values());
    
    const emailLogs = logs.filter(log => log.type === 'email');
    
    const emailSent = emailLogs.filter(log => log.result.success).length;
    const emailFailed = emailLogs.length - emailSent;
    const emailRate = emailLogs.length > 0 ? (emailSent / emailLogs.length) * 100 : 0;

    return {
      email: { sent: emailSent, failed: emailFailed, rate: emailRate }
    };
  }

  /**
   * Test email configuration
   */
  async testEmailConfiguration(testEmail: string): Promise<EmailResult> {
    return this.sendEmail({
      to: testEmail,
      subject: 'Email Configuration Test',
      text: 'This is a test email to verify your email configuration is working correctly.',
      html: '<p>This is a test email to verify your email configuration is working correctly.</p>'
    });
  }
}

// Email Provider Implementations

class ResendProvider implements EmailProvider {
  name = 'resend';

  async send(options: EmailOptions): Promise<EmailResult> {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const result = await resend.emails.send({
        from: options.from || process.env.DEFAULT_FROM_EMAIL || 'ProPaint Quote <onboarding@resend.dev>',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      });

      return {
        success: true,
        messageId: result.data?.id,
        provider: this.name,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name,
        timestamp: new Date()
      };
    }
  }
}

// Mock provider for development
class MockEmailProvider implements EmailProvider {
  name = 'mock-email';

  async send(options: EmailOptions): Promise<EmailResult> {
    console.log('MOCK EMAIL SENT:', {
      to: options.to,
      subject: options.subject,
      text: options.text.substring(0, 100) + '...'
    });

    return {
      success: true,
      messageId: `mock_email_${Date.now()}`,
      provider: this.name,
      timestamp: new Date()
    };
  }
}

// Export singleton instance
export const communicationService = new CommunicationService();