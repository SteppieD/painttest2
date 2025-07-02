/**
 * Professional Email Templates for Quote Delivery
 * 
 * Beautiful, branded email templates for sending quotes to customers
 * Includes responsive design and professional styling
 */

interface QuoteData {
  id: string;
  quote_id: string;
  customer_name: string;
  address: string;
  project_type: string;
  total_cost: number;
  final_price?: number;
  timeline?: string;
  created_at: string;
  company_name?: string;
  company_phone?: string;
  company_email?: string;
  company_logo?: string;
  sqft?: number;
}

export class EmailTemplateGenerator {
  
  // Main quote delivery email template
  generateQuoteDeliveryEmail(quote: QuoteData, quoteUrl: string): {
    subject: string;
    html: string;
    text: string;
  } {
    const finalPrice = quote.final_price || quote.total_cost || 0;
    const companyName = quote.company_name || "Professional Painting Services";
    
    return {
      subject: `Your Professional Painting Quote - ${this.formatCurrency(finalPrice)} - ${companyName}`,
      html: this.generateQuoteDeliveryHTML(quote, quoteUrl),
      text: this.generateQuoteDeliveryText(quote, quoteUrl)
    };
  }

  // Follow-up email template
  generateFollowUpEmail(quote: QuoteData, quoteUrl: string, daysSinceQuote: number): {
    subject: string;
    html: string;
    text: string;
  } {
    const companyName = quote.company_name || "Professional Painting Services";
    
    let subject: string;
    if (daysSinceQuote <= 3) {
      subject = `Quick follow-up on your painting quote - ${companyName}`;
    } else if (daysSinceQuote <= 7) {
      subject = `Still interested in your painting project? - ${companyName}`;
    } else {
      subject = `Last chance: Your painting quote expires soon - ${companyName}`;
    }

    return {
      subject,
      html: this.generateFollowUpHTML(quote, quoteUrl, daysSinceQuote),
      text: this.generateFollowUpText(quote, quoteUrl, daysSinceQuote)
    };
  }

  // Quote acceptance confirmation email
  generateAcceptanceConfirmationEmail(quote: QuoteData): {
    subject: string;
    html: string;
    text: string;
  } {
    const companyName = quote.company_name || "Professional Painting Services";
    
    return {
      subject: `Quote Accepted! Next Steps for Your Painting Project - ${companyName}`,
      html: this.generateAcceptanceConfirmationHTML(quote),
      text: this.generateAcceptanceConfirmationText(quote)
    };
  }

  // Generate HTML email template for quote delivery
  private generateQuoteDeliveryHTML(quote: QuoteData, quoteUrl: string): string {
    const finalPrice = quote.final_price || quote.total_cost || 0;
    const companyName = quote.company_name || "Professional Painting Services";
    
    const baseHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Professional Painting Quote</title>
    <style>
        ${this.getEmailStyles()}
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <div class="company-branding">
                ${quote.company_logo ? 
                    `<img src="${quote.company_logo}" alt="${companyName}" class="company-logo" />` : 
                    `<div class="company-logo-placeholder">🎨</div>`
                }
                <div class="company-info">
                    <h1 class="company-name">${companyName}</h1>
                    <div class="company-tagline">Professional Painting Services</div>
                </div>
            </div>
        </div>

        <!-- Welcome Message -->
        <div class="email-content">
            <h2 class="greeting">Hello ${quote.customer_name}!</h2>
            
            <p class="intro-message">
                Thank you for your interest in our professional painting services. We've prepared a detailed quote for your ${quote.project_type} painting project at ${quote.address}.
            </p>

            <!-- Quote Summary Card -->
            <div class="quote-summary-card">
                <div class="quote-header">
                    <div class="quote-title">Your Professional Quote</div>
                    <div class="quote-number">Quote #${quote.quote_id}</div>
                </div>
                
                <div class="quote-details">
                    <div class="detail-row">
                        <span class="detail-label">Project:</span>
                        <span class="detail-value">${quote.project_type.charAt(0).toUpperCase() + quote.project_type.slice(1)} Painting</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Property:</span>
                        <span class="detail-value">${quote.address}</span>
                    </div>
                    ${quote.sqft ? `
                    <div class="detail-row">
                        <span class="detail-label">Total Area:</span>
                        <span class="detail-value">${quote.sqft.toLocaleString()} sq ft</span>
                    </div>
                    ` : ''}
                    <div class="detail-row">
                        <span class="detail-label">Timeline:</span>
                        <span class="detail-value">${quote.timeline || '3-5 Business Days'}</span>
                    </div>
                </div>

                <div class="price-section">
                    <div class="price-label">Total Investment</div>
                    <div class="price-value">${this.formatCurrency(finalPrice)}</div>
                    <div class="price-note">All materials and labor included</div>
                </div>
            </div>

            <!-- Key Benefits -->
            <div class="benefits-section">
                <h3>Why Choose ${companyName}?</h3>
                <div class="benefits-grid">
                    <div class="benefit-item">
                        <div class="benefit-icon">✓</div>
                        <div class="benefit-text">Licensed & Insured</div>
                    </div>
                    <div class="benefit-item">
                        <div class="benefit-icon">✓</div>
                        <div class="benefit-text">1-Year Warranty</div>
                    </div>
                    <div class="benefit-item">
                        <div class="benefit-icon">✓</div>
                        <div class="benefit-text">Premium Materials</div>
                    </div>
                    <div class="benefit-item">
                        <div class="benefit-icon">✓</div>
                        <div class="benefit-text">Professional Crew</div>
                    </div>
                </div>
            </div>

            <!-- Call to Action -->
            <div class="cta-section">
                <h3>Ready to Transform Your Space?</h3>
                <p>Click the button below to view your complete quote and accept online:</p>
                
                <div class="cta-buttons">
                    <a href="${quoteUrl}" class="btn-primary">View Complete Quote</a>
                </div>
                
                <p class="cta-note">
                    Have questions? Simply reply to this email or call us at 
                    <a href="tel:${quote.company_phone || '(555) 123-4567'}">${quote.company_phone || '(555) 123-4567'}</a>
                </p>
            </div>

            <!-- Urgency/Validity -->
            <div class="urgency-section">
                <div class="urgency-card">
                    <div class="urgency-icon">⏰</div>
                    <div class="urgency-content">
                        <div class="urgency-title">Quote Valid for 30 Days</div>
                        <div class="urgency-text">This quote expires on ${this.getValidityDate(quote.created_at)}. Schedule now to secure these prices!</div>
                    </div>
                </div>
            </div>

            <!-- Social Proof -->
            <div class="social-proof-section">
                <h3>Join Our Satisfied Customers</h3>
                <div class="testimonial">
                    <div class="testimonial-stars">⭐⭐⭐⭐⭐</div>
                    <div class="testimonial-text">
                        "Exceptional work and professionalism. Our home looks amazing and the crew was incredibly respectful of our property."
                    </div>
                    <div class="testimonial-author">- Sarah M., Homeowner</div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <div class="footer-content">
                <div class="company-contact">
                    <div class="contact-item">
                        <strong>${companyName}</strong>
                    </div>
                    <div class="contact-item">
                        📞 ${quote.company_phone || '(555) 123-4567'}
                    </div>
                    <div class="contact-item">
                        ✉️ ${quote.company_email || 'contact@paintingpro.com'}
                    </div>
                </div>
                
                <div class="footer-links">
                    <a href="${quoteUrl}">View Quote</a>
                    <span class="separator">•</span>
                    <a href="mailto:${quote.company_email || 'contact@paintingpro.com'}">Contact Us</a>
                </div>
                
                <div class="footer-disclaimer">
                    This quote is valid for 30 days from the date of issue. Licensed and insured professional painting services.
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

    // Apply branding if available
    return this.applyBrandingToHTML(quote, baseHTML);
  }

  // Generate CSS styles for email
  private getEmailStyles(): string {
    return `
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #2d3748;
            background-color: #f7fafc;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .email-header {
            background: linear-gradient(135deg, #3182ce, #2b77cb);
            padding: 30px 40px;
            text-align: center;
        }
        
        .company-branding {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
        }
        
        .company-logo {
            width: 50px;
            height: 50px;
            border-radius: 8px;
        }
        
        .company-logo-placeholder {
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
        
        .company-name {
            color: white;
            font-size: 24px;
            font-weight: bold;
            margin: 0;
        }
        
        .company-tagline {
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            margin: 5px 0 0 0;
        }
        
        .email-content {
            padding: 40px;
        }
        
        .greeting {
            color: #2d3748;
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 20px 0;
        }
        
        .intro-message {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        
        .quote-summary-card {
            background: linear-gradient(135deg, #f7fafc, #edf2f7);
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
        }
        
        .quote-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #cbd5e0;
        }
        
        .quote-title {
            font-size: 18px;
            font-weight: bold;
            color: #2d3748;
        }
        
        .quote-number {
            font-size: 14px;
            color: #718096;
            font-weight: 600;
        }
        
        .quote-details {
            margin-bottom: 20px;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .detail-label {
            color: #718096;
            font-weight: 600;
        }
        
        .detail-value {
            color: #2d3748;
            text-align: right;
        }
        
        .price-section {
            text-align: center;
            padding: 20px;
            background: white;
            border-radius: 8px;
            border: 2px solid #3182ce;
        }
        
        .price-label {
            font-size: 14px;
            color: #718096;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .price-value {
            font-size: 32px;
            font-weight: bold;
            color: #3182ce;
            margin-bottom: 5px;
        }
        
        .price-note {
            font-size: 12px;
            color: #38a169;
        }
        
        .benefits-section {
            margin-bottom: 30px;
        }
        
        .benefits-section h3 {
            color: #2d3748;
            font-size: 18px;
            margin-bottom: 15px;
        }
        
        .benefits-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }
        
        .benefit-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
        }
        
        .benefit-icon {
            width: 20px;
            height: 20px;
            background: #38a169;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
        }
        
        .benefit-text {
            color: #4a5568;
            font-weight: 600;
        }
        
        .cta-section {
            text-align: center;
            margin-bottom: 30px;
            padding: 25px;
            background: linear-gradient(135deg, #f0fff4, #f7fafc);
            border-radius: 12px;
            border: 1px solid #c6f6d5;
        }
        
        .cta-section h3 {
            color: #2d3748;
            font-size: 20px;
            margin-bottom: 10px;
        }
        
        .cta-section p {
            color: #4a5568;
            margin-bottom: 20px;
        }
        
        .cta-buttons {
            margin-bottom: 20px;
        }
        
        .btn-primary {
            display: inline-block;
            background: linear-gradient(135deg, #3182ce, #2b77cb);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            transition: transform 0.2s;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
        }
        
        .cta-note {
            font-size: 14px;
            color: #718096;
        }
        
        .cta-note a {
            color: #3182ce;
            text-decoration: none;
            font-weight: 600;
        }
        
        .urgency-section {
            margin-bottom: 30px;
        }
        
        .urgency-card {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 20px;
            background: linear-gradient(135deg, #fffbf0, #fef5e7);
            border: 1px solid #f6ad55;
            border-radius: 8px;
        }
        
        .urgency-icon {
            font-size: 24px;
        }
        
        .urgency-title {
            font-weight: bold;
            color: #744210;
            margin-bottom: 5px;
        }
        
        .urgency-text {
            font-size: 14px;
            color: #975a16;
        }
        
        .social-proof-section {
            margin-bottom: 30px;
            text-align: center;
        }
        
        .social-proof-section h3 {
            color: #2d3748;
            margin-bottom: 20px;
        }
        
        .testimonial {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .testimonial-stars {
            font-size: 16px;
            margin-bottom: 10px;
        }
        
        .testimonial-text {
            font-style: italic;
            color: #4a5568;
            margin-bottom: 10px;
            line-height: 1.6;
        }
        
        .testimonial-author {
            font-size: 14px;
            color: #718096;
            font-weight: 600;
        }
        
        .email-footer {
            background: #2d3748;
            color: white;
            padding: 30px 40px;
        }
        
        .footer-content {
            text-align: center;
        }
        
        .company-contact {
            margin-bottom: 20px;
        }
        
        .contact-item {
            margin-bottom: 5px;
            font-size: 14px;
        }
        
        .footer-links {
            margin-bottom: 20px;
            font-size: 14px;
        }
        
        .footer-links a {
            color: #90cdf4;
            text-decoration: none;
        }
        
        .separator {
            margin: 0 10px;
            color: #718096;
        }
        
        .footer-disclaimer {
            font-size: 12px;
            color: #a0aec0;
            line-height: 1.4;
        }
        
        @media only screen and (max-width: 600px) {
            .email-content {
                padding: 20px;
            }
            
            .email-header {
                padding: 20px;
            }
            
            .company-branding {
                flex-direction: column;
                gap: 10px;
            }
            
            .quote-header {
                flex-direction: column;
                gap: 10px;
                text-align: center;
            }
            
            .detail-row {
                flex-direction: column;
                gap: 5px;
            }
            
            .detail-value {
                text-align: left;
                font-weight: 600;
            }
            
            .benefits-grid {
                grid-template-columns: 1fr;
            }
            
            .price-value {
                font-size: 24px;
            }
        }
    `;
  }

  // Generate text version of quote delivery email
  private generateQuoteDeliveryText(quote: QuoteData, quoteUrl: string): string {
    const finalPrice = quote.final_price || quote.total_cost || 0;
    const companyName = quote.company_name || "Professional Painting Services";
    
    return `
Hello ${quote.customer_name}!

Thank you for your interest in our professional painting services. We've prepared a detailed quote for your ${quote.project_type} painting project at ${quote.address}.

YOUR QUOTE SUMMARY:
- Quote #${quote.quote_id}
- Project: ${quote.project_type.charAt(0).toUpperCase() + quote.project_type.slice(1)} Painting
- Property: ${quote.address}
- Timeline: ${quote.timeline || '3-5 Business Days'}
- Total Investment: ${this.formatCurrency(finalPrice)}

WHY CHOOSE ${companyName.toUpperCase()}?
✓ Licensed & Insured
✓ 1-Year Warranty  
✓ Premium Materials
✓ Professional Crew

READY TO TRANSFORM YOUR SPACE?
View your complete quote and accept online: ${quoteUrl}

Have questions? Simply reply to this email or call us at ${quote.company_phone || '(555) 123-4567'}

IMPORTANT: This quote is valid for 30 days (expires ${this.getValidityDate(quote.created_at)})

Thank you for choosing ${companyName}!

${companyName}
${quote.company_phone || '(555) 123-4567'}
${quote.company_email || 'contact@paintingpro.com'}
`;
  }

  // Generate follow-up email HTML
  private generateFollowUpHTML(quote: QuoteData, quoteUrl: string, daysSinceQuote: number): string {
    const finalPrice = quote.final_price || quote.total_cost || 0;
    const companyName = quote.company_name || "Professional Painting Services";
    
    let messageContent: string;
    let urgencyClass: string;
    
    if (daysSinceQuote <= 3) {
      messageContent = `
        <p>We wanted to follow up on the painting quote we sent you a few days ago. Have you had a chance to review it?</p>
        <p>We understand that choosing the right painting contractor is an important decision, and we're here to answer any questions you might have about our proposal.</p>
      `;
      urgencyClass = 'low-urgency';
    } else if (daysSinceQuote <= 7) {
      messageContent = `
        <p>We hope you've had a chance to review the painting quote we prepared for your ${quote.project_type} project. We'd love to help transform your space!</p>
        <p>Many of our customers find it helpful to discuss their questions over the phone. Would you like to schedule a brief call to go over any details?</p>
      `;
      urgencyClass = 'medium-urgency';
    } else {
      messageContent = `
        <p>Your painting quote expires in just a few days! We wanted to reach out one more time to see if you'd like to move forward with your ${quote.project_type} painting project.</p>
        <p>To keep the same pricing, we'll need to hear from you by ${this.getValidityDate(quote.created_at)}. After that, we'll need to prepare a new quote based on current material costs.</p>
      `;
      urgencyClass = 'high-urgency';
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Following up on your painting quote</title>
    <style>
        ${this.getEmailStyles()}
        .${urgencyClass} .urgency-card {
            ${urgencyClass === 'high-urgency' ? 'background: linear-gradient(135deg, #fed7d7, #fbb6ce); border-color: #f56565;' : 
              urgencyClass === 'medium-urgency' ? 'background: linear-gradient(135deg, #fffbf0, #fef5e7); border-color: #f6ad55;' : 
              'background: linear-gradient(135deg, #f0fff4, #f7fafc); border-color: #48bb78;'}
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <div class="company-branding">
                ${quote.company_logo ? 
                    `<img src="${quote.company_logo}" alt="${companyName}" class="company-logo" />` : 
                    `<div class="company-logo-placeholder">🎨</div>`
                }
                <div class="company-info">
                    <h1 class="company-name">${companyName}</h1>
                    <div class="company-tagline">Professional Painting Services</div>
                </div>
            </div>
        </div>

        <div class="email-content">
            <h2 class="greeting">Hi ${quote.customer_name},</h2>
            
            ${messageContent}

            <div class="quote-summary-card">
                <div class="quote-header">
                    <div class="quote-title">Your Quote Recap</div>
                    <div class="quote-number">Quote #${quote.quote_id}</div>
                </div>
                
                <div class="price-section">
                    <div class="price-label">Total Investment</div>
                    <div class="price-value">${this.formatCurrency(finalPrice)}</div>
                    <div class="price-note">All materials and labor included</div>
                </div>
            </div>

            <div class="cta-section">
                <h3>Questions? Ready to Schedule?</h3>
                <div class="cta-buttons">
                    <a href="${quoteUrl}" class="btn-primary">View Complete Quote</a>
                </div>
                <p class="cta-note">
                    Or call us directly at <a href="tel:${quote.company_phone || '(555) 123-4567'}">${quote.company_phone || '(555) 123-4567'}</a>
                </p>
            </div>

            <div class="urgency-section ${urgencyClass}">
                <div class="urgency-card">
                    <div class="urgency-icon">${urgencyClass === 'high-urgency' ? '⚠️' : urgencyClass === 'medium-urgency' ? '⏰' : '💡'}</div>
                    <div class="urgency-content">
                        <div class="urgency-title">
                            ${urgencyClass === 'high-urgency' ? 'Quote Expires Soon!' : 
                              urgencyClass === 'medium-urgency' ? 'Still Interested?' : 
                              'No Pressure!'}
                        </div>
                        <div class="urgency-text">
                            ${urgencyClass === 'high-urgency' ? `Secure these prices by ${this.getValidityDate(quote.created_at)}` : 
                              urgencyClass === 'medium-urgency' ? 'We have availability in the next 2-3 weeks' : 
                              'Take your time - we\'re here when you\'re ready'}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="email-footer">
            <div class="footer-content">
                <div class="company-contact">
                    <div class="contact-item"><strong>${companyName}</strong></div>
                    <div class="contact-item">📞 ${quote.company_phone || '(555) 123-4567'}</div>
                    <div class="contact-item">✉️ ${quote.company_email || 'contact@paintingpro.com'}</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  // Generate follow-up text email
  private generateFollowUpText(quote: QuoteData, quoteUrl: string, daysSinceQuote: number): string {
    const finalPrice = quote.final_price || quote.total_cost || 0;
    const companyName = quote.company_name || "Professional Painting Services";
    
    let messageContent: string;
    
    if (daysSinceQuote <= 3) {
      messageContent = "We wanted to follow up on the painting quote we sent you a few days ago. Have you had a chance to review it? We're here to answer any questions you might have.";
    } else if (daysSinceQuote <= 7) {
      messageContent = "We hope you've had a chance to review the painting quote we prepared for your project. Many customers find it helpful to discuss their questions over the phone. Would you like to schedule a brief call?";
    } else {
      messageContent = `Your painting quote expires in just a few days! To keep the same pricing, we'll need to hear from you by ${this.getValidityDate(quote.created_at)}.`;
    }

    return `
Hi ${quote.customer_name},

${messageContent}

YOUR QUOTE RECAP:
Quote #${quote.quote_id}
Total Investment: ${this.formatCurrency(finalPrice)}

View complete quote: ${quoteUrl}
Call us: ${quote.company_phone || '(555) 123-4567'}

Thank you for considering ${companyName}!
`;
  }

  // Generate acceptance confirmation email HTML
  private generateAcceptanceConfirmationHTML(quote: QuoteData): string {
    const companyName = quote.company_name || "Professional Painting Services";
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quote Accepted - Next Steps</title>
    <style>${this.getEmailStyles()}</style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <div class="company-branding">
                ${quote.company_logo ? 
                    `<img src="${quote.company_logo}" alt="${companyName}" class="company-logo" />` : 
                    `<div class="company-logo-placeholder">🎨</div>`
                }
                <div class="company-info">
                    <h1 class="company-name">${companyName}</h1>
                    <div class="company-tagline">Professional Painting Services</div>
                </div>
            </div>
        </div>

        <div class="email-content">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 48px; color: #38a169; margin-bottom: 10px;">✅</div>
                <h2 style="color: #38a169; margin: 0;">Quote Accepted!</h2>
                <p style="color: #4a5568; margin: 10px 0;">Thank you for choosing ${companyName}</p>
            </div>
            
            <p>Hello ${quote.customer_name},</p>
            
            <p>Wonderful news! We've received your quote acceptance and we're excited to transform your space with professional painting.</p>
            
            <div class="quote-summary-card">
                <div class="quote-header">
                    <div class="quote-title">Project Confirmed</div>
                    <div class="quote-number">Quote #${quote.quote_id}</div>
                </div>
                <div style="text-align: center; padding: 20px;">
                    <div style="color: #38a169; font-weight: bold; margin-bottom: 10px;">✓ ACCEPTED</div>
                    <div style="color: #4a5568;">We'll contact you within 24 hours to schedule your project start date.</div>
                </div>
            </div>

            <div style="background: #f0fff4; border: 1px solid #c6f6d5; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #22543d; margin-top: 0;">What Happens Next?</h3>
                <div style="color: #2f855a; line-height: 1.6;">
                    <div style="margin-bottom: 10px;">📞 <strong>Within 24 hours:</strong> We'll call to schedule your project start date</div>
                    <div style="margin-bottom: 10px;">📋 <strong>Before we start:</strong> We'll confirm all project details and answer any final questions</div>
                    <div style="margin-bottom: 10px;">🎨 <strong>Project day:</strong> Our professional crew will arrive on time and ready to work</div>
                    <div>✨ <strong>Completion:</strong> Final walkthrough to ensure your complete satisfaction</div>
                </div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <p style="color: #4a5568;">Questions before we start? Contact us anytime:</p>
                <p>
                    <a href="tel:${quote.company_phone || '(555) 123-4567'}" style="color: #3182ce; text-decoration: none; font-weight: bold;">${quote.company_phone || '(555) 123-4567'}</a>
                    <span style="margin: 0 10px; color: #cbd5e0;">•</span>
                    <a href="mailto:${quote.company_email || 'contact@paintingpro.com'}" style="color: #3182ce; text-decoration: none; font-weight: bold;">${quote.company_email || 'contact@paintingpro.com'}</a>
                </p>
            </div>
        </div>

        <div class="email-footer">
            <div class="footer-content">
                <div class="company-contact">
                    <div class="contact-item"><strong>Welcome to the ${companyName} family!</strong></div>
                    <div class="contact-item">We're excited to transform your space</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  // Generate acceptance confirmation text email
  private generateAcceptanceConfirmationText(quote: QuoteData): string {
    const companyName = quote.company_name || "Professional Painting Services";
    
    return `
✅ QUOTE ACCEPTED!

Hello ${quote.customer_name},

Wonderful news! We've received your quote acceptance and we're excited to transform your space with professional painting.

PROJECT CONFIRMED:
Quote #${quote.quote_id}
Status: ✓ ACCEPTED

WHAT HAPPENS NEXT:
📞 Within 24 hours: We'll call to schedule your project start date
📋 Before we start: We'll confirm all project details  
🎨 Project day: Our professional crew will arrive on time
✨ Completion: Final walkthrough to ensure satisfaction

Questions before we start?
Call: ${quote.company_phone || '(555) 123-4567'}
Email: ${quote.company_email || 'contact@paintingpro.com'}

Welcome to the ${companyName} family!
We're excited to transform your space.

${companyName}
Professional Painting Services
`;
  }

  // Apply branding to HTML template
  private applyBrandingToHTML(quote: QuoteData, htmlTemplate: string): string {
    // For now, return the template as-is
    // In the future, this will integrate with the company branding system
    // to apply custom colors and logos from the branding API
    
    // TODO: Integrate with CompanyBrandingManager when branding data is available
    // const branding = await fetch(`/api/companies/${quote.company_id}/branding`);
    // return CompanyBrandingManager.applyBrandingToEmailTemplate(htmlTemplate, branding);
    
    return htmlTemplate;
  }

  // Helper methods
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  private getValidityDate(dateString: string): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

export const emailTemplateGenerator = new EmailTemplateGenerator();