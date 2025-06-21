/**
 * Professional PDF Quote Generator
 * 
 * Generates beautiful, branded PDF quotes for client delivery
 * Uses Puppeteer for HTML-to-PDF conversion with full styling support
 */

interface QuoteData {
  id: string;
  quote_id: string;
  customer_name: string;
  address: string;
  project_type: string;
  sqft?: number;
  paint_quality?: string;
  total_cost: number;
  final_price?: number;
  timeline?: string;
  created_at: string;
  company_name?: string;
  company_phone?: string;
  company_email?: string;
  company_logo?: string;
  walls_sqft?: number;
  ceilings_sqft?: number;
  trim_sqft?: number;
  number_of_doors?: number;
  number_of_windows?: number;
  room_data?: string;
  payment_terms?: {
    schedule: string;
    terms: string;
  };
  prep_work?: string;
  special_requests?: string;
}

export class PDFQuoteGenerator {
  
  // Generate professional PDF quote
  async generateQuotePDF(quote: QuoteData): Promise<Buffer> {
    const htmlContent = this.generateQuoteHTML(quote);
    
    // In a production environment, you would use Puppeteer here
    // For now, we'll simulate PDF generation and provide the HTML template
    return Buffer.from(htmlContent, 'utf8');
  }

  // Generate the HTML template for PDF conversion
  private generateQuoteHTML(quote: QuoteData): string {
    const baseHTML = this.generateBaseHTML(quote);
    
    // Apply branding if available
    return this.applyBrandingToHTML(quote, baseHTML);
  }

  // Generate base HTML template
  private generateBaseHTML(quote: QuoteData): string {
    const finalPrice = quote.final_price || quote.total_cost || 0;
    const companyName = quote.company_name || "Professional Painting Services";
    const validityDate = this.getValidityDate(quote.created_at);
    const rooms = this.parseRoomData(quote.room_data);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Professional Painting Quote - ${quote.customer_name}</title>
    <style>
        ${this.getPDFStyles()}
    </style>
</head>
<body>
    <!-- Header with Branding -->
    <div class="pdf-header">
        <div class="company-branding">
            ${quote.company_logo ? 
                `<img src="${quote.company_logo}" alt="${companyName}" class="company-logo" />` : 
                `<div class="company-logo-placeholder">
                    <div class="logo-icon">🎨</div>
                </div>`
            }
            <div class="company-info">
                <h1 class="company-name">${companyName}</h1>
                <div class="company-tagline">Licensed & Insured Professional Painting</div>
                <div class="company-contact">
                    <span>${quote.company_phone || '(555) 123-4567'}</span>
                    <span class="separator">•</span>
                    <span>${quote.company_email || 'contact@paintingpro.com'}</span>
                </div>
            </div>
        </div>
        <div class="quote-info">
            <div class="quote-title">PROFESSIONAL QUOTE</div>
            <div class="quote-number">Quote #${quote.quote_id}</div>
            <div class="quote-date">${this.formatDate(quote.created_at)}</div>
        </div>
    </div>

    <!-- Quote Details Section -->
    <div class="quote-section">
        <div class="section-header">
            <h2>Project Details</h2>
        </div>
        <div class="two-column-layout">
            <div class="column">
                <div class="detail-group">
                    <label>Customer:</label>
                    <value>${quote.customer_name}</value>
                </div>
                <div class="detail-group">
                    <label>Property Address:</label>
                    <value>${quote.address}</value>
                </div>
                <div class="detail-group">
                    <label>Project Type:</label>
                    <value class="capitalize">${quote.project_type} Painting</value>
                </div>
                <div class="detail-group">
                    <label>Total Area:</label>
                    <value>${quote.sqft ? `${quote.sqft.toLocaleString()} sq ft` : 'Custom Scope'}</value>
                </div>
            </div>
            <div class="column">
                <div class="detail-group">
                    <label>Paint Quality:</label>
                    <value class="capitalize">${quote.paint_quality || 'Premium'} Grade</value>
                </div>
                <div class="detail-group">
                    <label>Project Timeline:</label>
                    <value>${quote.timeline || '3-5 Business Days'}</value>
                </div>
                <div class="detail-group">
                    <label>Quote Valid Until:</label>
                    <value>${validityDate}</value>
                </div>
                <div class="detail-group">
                    <label>Quote Prepared:</label>
                    <value>${this.formatDate(quote.created_at)}</value>
                </div>
            </div>
        </div>
    </div>

    <!-- Surface Breakdown -->
    ${this.generateSurfaceBreakdown(quote)}

    <!-- Room Breakdown -->
    ${rooms.length > 0 ? this.generateRoomBreakdown(rooms) : ''}

    <!-- Services Included -->
    <div class="quote-section">
        <div class="section-header">
            <h2>Services Included</h2>
        </div>
        <div class="services-grid">
            <div class="service-item">
                <div class="service-check">✓</div>
                <div class="service-details">
                    <div class="service-title">Complete Surface Preparation</div>
                    <div class="service-description">Thorough cleaning, sanding, and priming as needed for optimal adhesion</div>
                </div>
            </div>
            <div class="service-item">
                <div class="service-check">✓</div>
                <div class="service-details">
                    <div class="service-title">Premium Paint & Materials</div>
                    <div class="service-description">High-quality paints with excellent coverage and durability</div>
                </div>
            </div>
            <div class="service-item">
                <div class="service-check">✓</div>
                <div class="service-details">
                    <div class="service-title">Professional Application</div>
                    <div class="service-description">Expert painting techniques for smooth, even finish</div>
                </div>
            </div>
            <div class="service-item">
                <div class="service-check">✓</div>
                <div class="service-details">
                    <div class="service-title">Daily Cleanup & Protection</div>
                    <div class="service-description">Your property carefully protected throughout the project</div>
                </div>
            </div>
            <div class="service-item">
                <div class="service-check">✓</div>
                <div class="service-details">
                    <div class="service-title">Quality Assurance</div>
                    <div class="service-description">Final walkthrough to ensure your complete satisfaction</div>
                </div>
            </div>
            <div class="service-item">
                <div class="service-check">✓</div>
                <div class="service-details">
                    <div class="service-title">Complete Post-Project Cleanup</div>
                    <div class="service-description">Leave your space spotless and ready to enjoy</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Investment Summary -->
    <div class="quote-section investment-section">
        <div class="section-header">
            <h2>Investment Summary</h2>
        </div>
        <div class="investment-details">
            <div class="investment-breakdown">
                <div class="breakdown-item">
                    <span>Surface Area:</span>
                    <span>${quote.sqft ? `${quote.sqft.toLocaleString()} sq ft` : 'Custom Scope'}</span>
                </div>
                ${quote.walls_sqft ? `
                <div class="breakdown-item sub-item">
                    <span>Walls:</span>
                    <span>${quote.walls_sqft.toLocaleString()} sq ft</span>
                </div>` : ''}
                ${quote.ceilings_sqft ? `
                <div class="breakdown-item sub-item">
                    <span>Ceilings:</span>
                    <span>${quote.ceilings_sqft.toLocaleString()} sq ft</span>
                </div>` : ''}
                ${quote.trim_sqft ? `
                <div class="breakdown-item sub-item">
                    <span>Trim:</span>
                    <span>${quote.trim_sqft.toLocaleString()} sq ft</span>
                </div>` : ''}
                <div class="breakdown-separator"></div>
                <div class="breakdown-item total-item">
                    <span>Total Project Investment:</span>
                    <span class="total-price">${this.formatCurrency(finalPrice)}</span>
                </div>
            </div>
            <div class="investment-notes">
                <div class="note">✓ All materials and labor included</div>
                <div class="note">✓ No hidden fees or surprises</div>
                <div class="note">✓ Professional insurance coverage</div>
            </div>
        </div>
    </div>

    <!-- Payment Terms -->
    ${quote.payment_terms ? this.generatePaymentTerms(quote.payment_terms) : ''}

    <!-- Guarantees -->
    <div class="quote-section guarantees-section">
        <div class="section-header">
            <h2>Our Guarantees</h2>
        </div>
        <div class="guarantees-grid">
            <div class="guarantee-item">
                <div class="guarantee-icon">🏆</div>
                <div class="guarantee-title">1-Year Warranty</div>
                <div class="guarantee-description">Complete workmanship guarantee on all painting services</div>
            </div>
            <div class="guarantee-item">
                <div class="guarantee-icon">🛡️</div>
                <div class="guarantee-title">Licensed & Insured</div>
                <div class="guarantee-description">Full liability and worker's compensation coverage</div>
            </div>
            <div class="guarantee-item">
                <div class="guarantee-icon">⭐</div>
                <div class="guarantee-title">Satisfaction Promise</div>
                <div class="guarantee-description">We're not done until you're completely satisfied</div>
            </div>
        </div>
    </div>

    <!-- Next Steps -->
    <div class="quote-section next-steps-section">
        <div class="section-header">
            <h2>Ready to Get Started?</h2>
        </div>
        <div class="next-steps-content">
            <div class="steps-list">
                <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-text">Accept this quote by signing and returning, or contact us with any questions</div>
                </div>
                <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-text">We'll schedule a convenient start date within 1-2 weeks</div>
                </div>
                <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-text">Enjoy your beautifully transformed space with professional quality</div>
                </div>
            </div>
            <div class="contact-cta">
                <div class="cta-title">Questions or Ready to Schedule?</div>
                <div class="cta-contact">
                    <div class="contact-method">
                        <strong>Call:</strong> ${quote.company_phone || '(555) 123-4567'}
                    </div>
                    <div class="contact-method">
                        <strong>Email:</strong> ${quote.company_email || 'contact@paintingpro.com'}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div class="pdf-footer">
        <div class="footer-content">
            <div class="footer-left">
                <div class="company-name">${companyName}</div>
                <div class="footer-tagline">Professional Painting Services</div>
            </div>
            <div class="footer-right">
                <div class="quote-validity">Quote valid until ${validityDate}</div>
                <div class="quote-reference">Quote #${quote.quote_id}</div>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  // Generate CSS styles for professional PDF layout
  private getPDFStyles(): string {
    return `
        @page {
            margin: 0.75in;
            size: letter;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #2d3748;
            background: white;
        }
        
        .pdf-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #3182ce;
        }
        
        .company-branding {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .company-logo {
            width: 60px;
            height: 60px;
            object-fit: contain;
        }
        
        .company-logo-placeholder {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #3182ce, #2b77cb);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .logo-icon {
            font-size: 28px;
            color: white;
        }
        
        .company-name {
            font-size: 20px;
            font-weight: bold;
            color: #2d3748;
            margin-bottom: 4px;
        }
        
        .company-tagline {
            font-size: 10px;
            color: #718096;
            margin-bottom: 6px;
        }
        
        .company-contact {
            font-size: 9px;
            color: #4a5568;
        }
        
        .separator {
            margin: 0 6px;
            color: #cbd5e0;
        }
        
        .quote-info {
            text-align: right;
        }
        
        .quote-title {
            font-size: 16px;
            font-weight: bold;
            color: #3182ce;
            margin-bottom: 4px;
        }
        
        .quote-number {
            font-size: 12px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 2px;
        }
        
        .quote-date {
            font-size: 10px;
            color: #718096;
        }
        
        .quote-section {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }
        
        .section-header {
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .section-header h2 {
            font-size: 14px;
            font-weight: bold;
            color: #2d3748;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .two-column-layout {
            display: flex;
            gap: 30px;
        }
        
        .column {
            flex: 1;
        }
        
        .detail-group {
            display: flex;
            margin-bottom: 8px;
            gap: 10px;
        }
        
        .detail-group label {
            font-weight: 600;
            color: #4a5568;
            min-width: 100px;
            font-size: 10px;
        }
        
        .detail-group value {
            color: #2d3748;
            font-size: 10px;
        }
        
        .capitalize {
            text-transform: capitalize;
        }
        
        .surface-breakdown {
            display: flex;
            gap: 20px;
            margin-bottom: 15px;
        }
        
        .surface-item {
            flex: 1;
            padding: 12px;
            background: #f7fafc;
            border-radius: 6px;
            text-align: center;
        }
        
        .surface-label {
            font-size: 9px;
            color: #718096;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        
        .surface-value {
            font-size: 12px;
            font-weight: bold;
            color: #2d3748;
        }
        
        .room-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        
        .room-item {
            padding: 12px;
            background: #f7fafc;
            border-radius: 6px;
            border-left: 3px solid #3182ce;
        }
        
        .room-name {
            font-weight: bold;
            font-size: 11px;
            color: #2d3748;
            margin-bottom: 6px;
        }
        
        .room-details {
            font-size: 9px;
            color: #4a5568;
            line-height: 1.3;
        }
        
        .services-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }
        
        .service-item {
            display: flex;
            gap: 10px;
            align-items: flex-start;
        }
        
        .service-check {
            width: 16px;
            height: 16px;
            background: #38a169;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
            font-weight: bold;
            flex-shrink: 0;
        }
        
        .service-title {
            font-weight: 600;
            font-size: 10px;
            color: #2d3748;
            margin-bottom: 2px;
        }
        
        .service-description {
            font-size: 9px;
            color: #718096;
            line-height: 1.3;
        }
        
        .investment-section {
            background: linear-gradient(135deg, #f7fafc, #edf2f7);
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        
        .investment-details {
            display: flex;
            gap: 30px;
            align-items: flex-start;
        }
        
        .investment-breakdown {
            flex: 1;
        }
        
        .breakdown-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 10px;
        }
        
        .sub-item {
            margin-left: 15px;
            color: #718096;
            font-size: 9px;
        }
        
        .breakdown-separator {
            height: 1px;
            background: #cbd5e0;
            margin: 10px 0;
        }
        
        .total-item {
            font-weight: bold;
            font-size: 12px;
            color: #2d3748;
            padding-top: 8px;
            border-top: 2px solid #3182ce;
        }
        
        .total-price {
            font-size: 16px;
            color: #3182ce;
        }
        
        .investment-notes {
            flex: 1;
            padding-left: 20px;
            border-left: 1px solid #e2e8f0;
        }
        
        .note {
            font-size: 9px;
            color: #38a169;
            margin-bottom: 4px;
        }
        
        .guarantees-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
        }
        
        .guarantee-item {
            text-align: center;
            padding: 15px 10px;
            background: #f7fafc;
            border-radius: 6px;
        }
        
        .guarantee-icon {
            font-size: 24px;
            margin-bottom: 8px;
        }
        
        .guarantee-title {
            font-weight: bold;
            font-size: 10px;
            color: #2d3748;
            margin-bottom: 4px;
        }
        
        .guarantee-description {
            font-size: 8px;
            color: #718096;
            line-height: 1.3;
        }
        
        .next-steps-content {
            display: flex;
            gap: 30px;
        }
        
        .steps-list {
            flex: 1;
        }
        
        .step-item {
            display: flex;
            gap: 12px;
            margin-bottom: 12px;
            align-items: flex-start;
        }
        
        .step-number {
            width: 20px;
            height: 20px;
            background: #3182ce;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9px;
            font-weight: bold;
            flex-shrink: 0;
        }
        
        .step-text {
            font-size: 10px;
            color: #4a5568;
            line-height: 1.4;
        }
        
        .contact-cta {
            flex: 1;
            padding: 15px;
            background: #3182ce;
            color: white;
            border-radius: 6px;
            text-align: center;
        }
        
        .cta-title {
            font-weight: bold;
            font-size: 11px;
            margin-bottom: 10px;
        }
        
        .contact-method {
            font-size: 10px;
            margin-bottom: 4px;
        }
        
        .pdf-footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
            page-break-inside: avoid;
        }
        
        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .footer-left .company-name {
            font-size: 12px;
            font-weight: bold;
            color: #2d3748;
        }
        
        .footer-tagline {
            font-size: 8px;
            color: #718096;
        }
        
        .footer-right {
            text-align: right;
        }
        
        .quote-validity,
        .quote-reference {
            font-size: 8px;
            color: #718096;
        }
        
        .payment-terms {
            background: #fffbf0;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #f6ad55;
        }
        
        .payment-schedule {
            font-size: 10px;
            color: #744210;
            margin-bottom: 8px;
        }
        
        .payment-details {
            font-size: 9px;
            color: #975a16;
            line-height: 1.4;
        }
    `;
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

  private formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private getValidityDate(dateString: string): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 30);
    return this.formatDate(date.toISOString());
  }

  private parseRoomData(roomData?: string): any[] {
    if (!roomData) return [];
    try {
      const parsed = JSON.parse(roomData);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private generateSurfaceBreakdown(quote: QuoteData): string {
    const surfaces = [];
    
    if (quote.walls_sqft && quote.walls_sqft > 0) {
      surfaces.push(`
        <div class="surface-item">
          <div class="surface-label">Walls</div>
          <div class="surface-value">${quote.walls_sqft.toLocaleString()} sq ft</div>
        </div>
      `);
    }
    
    if (quote.ceilings_sqft && quote.ceilings_sqft > 0) {
      surfaces.push(`
        <div class="surface-item">
          <div class="surface-label">Ceilings</div>
          <div class="surface-value">${quote.ceilings_sqft.toLocaleString()} sq ft</div>
        </div>
      `);
    }
    
    if (quote.trim_sqft && quote.trim_sqft > 0) {
      surfaces.push(`
        <div class="surface-item">
          <div class="surface-label">Trim</div>
          <div class="surface-value">${quote.trim_sqft.toLocaleString()} sq ft</div>
        </div>
      `);
    }

    if (surfaces.length === 0) return '';

    return `
      <div class="quote-section">
        <div class="section-header">
          <h2>Surface Breakdown</h2>
        </div>
        <div class="surface-breakdown">
          ${surfaces.join('')}
        </div>
      </div>
    `;
  }

  private generateRoomBreakdown(rooms: any[]): string {
    if (rooms.length === 0) return '';

    const roomItems = rooms.map(room => `
      <div class="room-item">
        <div class="room-name">${room.name}</div>
        <div class="room-details">
          <div>Dimensions: ${room.length}' × ${room.width}' × ${room.height}'</div>
          ${room.ceiling_area > 0 ? `<div>Ceiling: ${room.ceiling_area} sq ft</div>` : ''}
          ${room.wall_area > 0 ? `<div>Walls: ${room.wall_area} sq ft</div>` : ''}
          ${(room.number_of_doors > 0 || room.number_of_windows > 0) ? 
            `<div>Features: ${room.number_of_doors > 0 ? `${room.number_of_doors} doors` : ''}${room.number_of_doors > 0 && room.number_of_windows > 0 ? ', ' : ''}${room.number_of_windows > 0 ? `${room.number_of_windows} windows` : ''}</div>` : ''
          }
        </div>
      </div>
    `).join('');

    return `
      <div class="quote-section">
        <div class="section-header">
          <h2>Room Breakdown (${rooms.length} rooms)</h2>
        </div>
        <div class="room-grid">
          ${roomItems}
        </div>
      </div>
    `;
  }

  private generatePaymentTerms(paymentTerms: { schedule: string; terms: string }): string {
    return `
      <div class="quote-section">
        <div class="section-header">
          <h2>Payment Terms</h2>
        </div>
        <div class="payment-terms">
          <div class="payment-schedule">
            <strong>Payment Schedule:</strong> ${paymentTerms.schedule}
          </div>
          <div class="payment-details">
            ${paymentTerms.terms}
          </div>
          <div class="payment-details" style="margin-top: 8px; text-align: center; border-top: 1px solid #f6ad55; padding-top: 8px;">
            We accept cash, check, and all major credit cards
          </div>
        </div>
      </div>
    `;
  }

  // Apply branding to PDF HTML template
  private applyBrandingToHTML(quote: QuoteData, htmlTemplate: string): string {
    // For now, return the template as-is
    // In the future, this will integrate with the company branding system
    // to apply custom colors and logos from the branding API
    
    // TODO: Integrate with CompanyBrandingManager when branding data is available
    // const branding = await fetch(`/api/companies/${quote.company_id}/branding`);
    // return CompanyBrandingManager.applyBrandingToPDFTemplate(htmlTemplate, branding);
    
    return htmlTemplate;
  }
}

export const pdfQuoteGenerator = new PDFQuoteGenerator();