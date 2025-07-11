interface QuoteData {
  id: string
  customerName: string
  customerEmail?: string
  address: string
  projectType: string
  area: number
  paintGallons?: number
  paintCost: number
  laborCost: number
  total: number
  createdAt: Date
  companyName?: string
  companyLogo?: string
  excludes?: string[]
}

export class QuotePDFGenerator {
  static generateHTML(quote: QuoteData): string {
    const currentDate = new Date().toLocaleDateString()
    const excludesList = quote.excludes?.join(', ') || 'None'
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Quote #${quote.id}</title>
  <style>
    @page {
      size: letter;
      margin: 0.5in;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .company-info h1 {
      margin: 0;
      font-size: 32px;
      color: #1f2937;
    }
    
    .company-info p {
      margin: 5px 0;
      color: #6b7280;
    }
    
    .quote-number {
      text-align: right;
      color: #6b7280;
    }
    
    .quote-number h2 {
      margin: 0;
      font-size: 24px;
      color: #1f2937;
    }
    
    .customer-info {
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    
    .customer-info h3 {
      margin-top: 0;
      color: #1f2937;
    }
    
    .project-details {
      margin-bottom: 30px;
    }
    
    .project-details h3 {
      color: #1f2937;
      margin-bottom: 15px;
    }
    
    .details-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .detail-label {
      color: #6b7280;
    }
    
    .detail-value {
      font-weight: 600;
      color: #1f2937;
    }
    
    .pricing-section {
      background-color: #f3f4f6;
      padding: 25px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    
    .pricing-section h3 {
      margin-top: 0;
      color: #1f2937;
    }
    
    .pricing-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .pricing-item:last-child {
      border-bottom: none;
    }
    
    .total-row {
      font-size: 24px;
      font-weight: bold;
      color: #059669;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 2px solid #1f2937;
    }
    
    .terms-section {
      margin-bottom: 30px;
      padding: 20px;
      background-color: #fef3c7;
      border-radius: 8px;
    }
    
    .terms-section h3 {
      margin-top: 0;
      color: #92400e;
    }
    
    .terms-section ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    
    .terms-section li {
      color: #92400e;
      margin-bottom: 5px;
    }
    
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    
    .signature-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 50px;
    }
    
    .signature-box {
      border-bottom: 2px solid #333;
      padding-bottom: 5px;
      margin-bottom: 10px;
    }
    
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .pricing-section {
        break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-info">
      <h1>${quote.companyName || 'ProPaint Quote'}</h1>
      <p>Professional Painting Services</p>
      <p>License #12345 • Bonded & Insured</p>
    </div>
    <div class="quote-number">
      <h2>QUOTE</h2>
      <p>#${quote.id}</p>
      <p>${currentDate}</p>
    </div>
  </div>
  
  <div class="customer-info">
    <h3>Customer Information</h3>
    <p><strong>${quote.customerName}</strong></p>
    <p>${quote.address}</p>
    ${quote.customerEmail ? `<p>${quote.customerEmail}</p>` : ''}
  </div>
  
  <div class="project-details">
    <h3>Project Details</h3>
    <div class="details-grid">
      <div class="detail-item">
        <span class="detail-label">Project Type:</span>
        <span class="detail-value">${quote.projectType.charAt(0).toUpperCase() + quote.projectType.slice(1)} Painting</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Total Area:</span>
        <span class="detail-value">${quote.area.toLocaleString()} sq ft</span>
      </div>
      ${quote.paintGallons ? `
      <div class="detail-item">
        <span class="detail-label">Paint Required:</span>
        <span class="detail-value">${quote.paintGallons} gallons</span>
      </div>
      ` : ''}
      <div class="detail-item">
        <span class="detail-label">Excludes:</span>
        <span class="detail-value">${excludesList}</span>
      </div>
    </div>
  </div>
  
  <div class="pricing-section">
    <h3>Investment Summary</h3>
    <div class="pricing-item">
      <span>Materials (Paint & Supplies)</span>
      <span>$${quote.paintCost.toLocaleString()}</span>
    </div>
    <div class="pricing-item">
      <span>Professional Labor</span>
      <span>$${quote.laborCost.toLocaleString()}</span>
    </div>
    <div class="pricing-item total-row">
      <span>Total Investment</span>
      <span>$${quote.total.toLocaleString()}</span>
    </div>
  </div>
  
  <div class="terms-section">
    <h3>Terms & Conditions</h3>
    <ul>
      <li>This quote is valid for 30 days from the date above</li>
      <li>50% deposit required to begin work</li>
      <li>Balance due upon completion</li>
      <li>All work guaranteed for 2 years</li>
      <li>Price includes all labor, materials, and cleanup</li>
    </ul>
  </div>
  
  <div class="signature-section">
    <div>
      <div class="signature-box"></div>
      <p>Customer Signature & Date</p>
    </div>
    <div>
      <div class="signature-box"></div>
      <p>Contractor Signature & Date</p>
    </div>
  </div>
  
  <div class="footer">
    <p>Thank you for considering us for your painting project!</p>
    <p>Questions? Contact us at (555) 123-4567 or info@propaintquote.com</p>
  </div>
</body>
</html>
    `
  }
  
  static async generatePDF(quote: QuoteData): Promise<Blob> {
    // In a real implementation, this would use a library like Puppeteer or jsPDF
    // For now, we'll return the HTML as a blob that can be displayed
    const html = this.generateHTML(quote)
    return new Blob([html], { type: 'text/html' })
  }
}