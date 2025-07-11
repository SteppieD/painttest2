interface EmailQuoteData {
  customerName: string
  customerEmail: string
  quoteId: string
  total: number
  projectType: string
  area: number
  companyName?: string
  quoteUrl: string
}

export class QuoteEmailTemplates {
  static quoteDelivery(data: EmailQuoteData): { subject: string; html: string; text: string } {
    const subject = `Your Painting Quote is Ready - ${data.companyName || 'ProPaint Quote'}`
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Quote is Ready</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                ${data.companyName || 'ProPaint Quote'}
              </h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">
                Professional Painting Services
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px;">
                Hi ${data.customerName},
              </h2>
              
              <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Thank you for considering us for your painting project! We've prepared a detailed quote based on your requirements.
              </p>
              
              <!-- Quote Summary -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Quote Summary</h3>
                <table width="100%" style="color: #4b5563; font-size: 16px;">
                  <tr>
                    <td style="padding: 8px 0;">Quote ID:</td>
                    <td style="text-align: right; font-weight: bold;">#${data.quoteId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">Project Type:</td>
                    <td style="text-align: right; font-weight: bold;">${data.projectType.charAt(0).toUpperCase() + data.projectType.slice(1)} Painting</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">Total Area:</td>
                    <td style="text-align: right; font-weight: bold;">${data.area.toLocaleString()} sq ft</td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 0 0 0; font-size: 20px; font-weight: bold; color: #059669;">Total Investment:</td>
                    <td style="padding: 20px 0 0 0; text-align: right; font-size: 24px; font-weight: bold; color: #059669;">
                      $${data.total.toLocaleString()}
                    </td>
                  </tr>
                </table>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${data.quoteUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  View Full Quote Details
                </a>
              </div>
              
              <!-- Benefits -->
              <div style="margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">Why Choose Us?</h3>
                <ul style="margin: 0; padding-left: 20px; color: #4b5563; line-height: 1.8;">
                  <li>Licensed & insured professionals</li>
                  <li>2-year workmanship guarantee</li>
                  <li>Premium quality paints only</li>
                  <li>Clean, respectful crew</li>
                  <li>On-time project completion</li>
                </ul>
              </div>
              
              <!-- Next Steps -->
              <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px;">Ready to Get Started?</h4>
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  This quote is valid for 30 days. Simply reply to this email or call us to schedule your project!
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin: 0 0 10px 0;">
                Questions? We're here to help!
              </p>
              <p style="margin: 0;">
                📧 info@propaintquote.com | 📱 (555) 123-4567
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
    
    const text = `
Hi ${data.customerName},

Thank you for considering us for your painting project! We've prepared a detailed quote based on your requirements.

QUOTE SUMMARY
Quote ID: #${data.quoteId}
Project Type: ${data.projectType.charAt(0).toUpperCase() + data.projectType.slice(1)} Painting
Total Area: ${data.area.toLocaleString()} sq ft
Total Investment: $${data.total.toLocaleString()}

View your full quote details: ${data.quoteUrl}

WHY CHOOSE US?
• Licensed & insured professionals
• 2-year workmanship guarantee
• Premium quality paints only
• Clean, respectful crew
• On-time project completion

READY TO GET STARTED?
This quote is valid for 30 days. Simply reply to this email or call us to schedule your project!

Questions? We're here to help!
📧 info@propaintquote.com | 📱 (555) 123-4567

Best regards,
${data.companyName || 'ProPaint Quote'} Team
    `
    
    return { subject, html, text }
  }
  
  static followUp(data: EmailQuoteData, daysSinceQuote: number): { subject: string; html: string; text: string } {
    let subject: string
    let content: { greeting: string; message: string; urgency?: string }
    
    if (daysSinceQuote <= 3) {
      subject = `Quick question about your painting project - ${data.companyName || 'ProPaint Quote'}`
      content = {
        greeting: `Hi ${data.customerName},`,
        message: `I wanted to follow up on the quote we sent a few days ago for your ${data.projectType} painting project. Do you have any questions about the quote or our process?`,
        urgency: `We have availability starting next week if you'd like to get your project scheduled.`
      }
    } else if (daysSinceQuote <= 7) {
      subject = `Your painting quote expires soon - ${data.companyName || 'ProPaint Quote'}`
      content = {
        greeting: `Hi ${data.customerName},`,
        message: `Just a friendly reminder that your painting quote for ${data.area.toLocaleString()} sq ft is still available. We'd love to help transform your space!`,
        urgency: `This quote expires in ${30 - daysSinceQuote} days. Lock in your price by scheduling now!`
      }
    } else {
      subject = `Last chance: Your painting quote expires soon`
      content = {
        greeting: `Hi ${data.customerName},`,
        message: `Your quote for $${data.total.toLocaleString()} expires in just ${30 - daysSinceQuote} days. We don't want you to miss out on this pricing!`,
        urgency: `Schedule now to secure your spot and lock in this price. Prices may increase after your quote expires.`
      }
    }
    
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px;">${content.greeting}</h2>
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">${content.message}</p>
              ${content.urgency ? `<p style="margin: 0 0 30px 0; color: #dc2626; font-weight: bold;">${content.urgency}</p>` : ''}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.quoteUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Review Your Quote
                </a>
              </div>
              
              <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 14px;">
                Or simply reply to this email - we're here to answer any questions!
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `
    
    const text = `${content.greeting}

${content.message}

${content.urgency || ''}

Review your quote: ${data.quoteUrl}

Or simply reply to this email - we're here to answer any questions!

Best regards,
${data.companyName || 'ProPaint Quote'} Team`
    
    return { subject, html, text }
  }
}