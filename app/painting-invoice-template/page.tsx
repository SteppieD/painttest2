import Link from 'next/link';
import { 
  FileText,
  Download,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Clock,
  Shield,
  Smartphone,
  Star,
  AlertCircle,
  Printer,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'Painting Invoice Template - Free Professional Invoice for Contractors',
  description: 'Painting invoice template free download for contractors. Professional invoice templates for painting jobs with payment terms, itemized costs, and legal protection. Excel, PDF, and Word formats.',
  keywords: 'painting invoice template, painting invoice template free, painting contractor invoice, painting invoice example, painting invoice format, paint job invoice template, painting invoice sample, contractor invoice template',
  path: '/painting-invoice-template',
});

export default function PaintingInvoiceTemplatePage() {
  // Invoice components
  const invoiceComponents = [
    {
      component: "Header Section",
      includes: [
        "Your company logo and branding",
        "Business name and contact info",
        "License and insurance numbers",
        "Invoice number and date"
      ],
      importance: "Professional first impression"
    },
    {
      component: "Client Information",
      includes: [
        "Customer name and address",
        "Contact phone and email",
        "Job site address",
        "Project reference number"
      ],
      importance: "Clear identification"
    },
    {
      component: "Service Details",
      includes: [
        "Itemized labor costs",
        "Materials and supplies",
        "Surface preparation work",
        "Number of coats applied"
      ],
      importance: "Transparency builds trust"
    },
    {
      component: "Payment Terms",
      includes: [
        "Total amount due",
        "Payment due date",
        "Accepted payment methods",
        "Late payment penalties"
      ],
      importance: "Clear expectations"
    }
  ];

  // Invoice formats available
  const invoiceFormats = [
    {
      format: "Excel Invoice Template",
      description: "Fully customizable with automatic calculations",
      features: [
        "Auto-calculating totals",
        "Tax calculations",
        "Customizable fields",
        "Professional formatting"
      ],
      bestFor: "Contractors who need flexibility",
      icon: "📊"
    },
    {
      format: "PDF Invoice Template",
      description: "Print-ready professional format",
      features: [
        "Polished appearance",
        "Easy to email",
        "Non-editable by clients",
        "Works on all devices"
      ],
      bestFor: "Quick professional invoices",
      icon: "📄"
    },
    {
      format: "Word Invoice Template",
      description: "Easy to edit and customize",
      features: [
        "Simple customization",
        "Add company letterhead",
        "Save as PDF",
        "Mail merge capable"
      ],
      bestFor: "Basic invoice needs",
      icon: "📝"
    },
    {
      format: "Digital Invoice System",
      description: "Online invoicing with payment processing",
      features: [
        "Send from phone",
        "Accept online payments",
        "Automatic reminders",
        "Payment tracking"
      ],
      bestFor: "Modern contractors",
      icon: "💻"
    }
  ];

  // Common invoice mistakes
  const invoiceMistakes = [
    {
      mistake: "Missing Invoice Numbers",
      consequence: "Accounting chaos",
      solution: "Use sequential numbering system"
    },
    {
      mistake: "No Payment Terms",
      consequence: "Late payments",
      solution: "Clear NET 15/30 terms"
    },
    {
      mistake: "Vague Descriptions",
      consequence: "Payment disputes",
      solution: "Detailed line items"
    },
    {
      mistake: "No Late Fees",
      consequence: "Slow payments",
      solution: "1.5% monthly late fee"
    },
    {
      mistake: "Missing License Info",
      consequence: "Less credibility",
      solution: "Include all credentials"
    }
  ];

  // Payment statistics
  const paymentStats = [
    { stat: "87%", description: "Get paid faster with professional invoices" },
    { stat: "14 days", description: "Average payment time (vs 45 days)" },
    { stat: "92%", description: "Fewer payment disputes" },
    { stat: "3x", description: "More likely to get referrals" }
  ];

  // Invoice best practices
  const bestPractices = [
    {
      practice: "Send Immediately",
      reason: "Clients pay faster when work is fresh in mind",
      tip: "Invoice same day as job completion"
    },
    {
      practice: "Include Photos",
      reason: "Visual proof prevents disputes",
      tip: "Before/after photos with invoice"
    },
    {
      practice: "Offer Multiple Payment Options",
      reason: "Removes payment friction",
      tip: "Accept cards, checks, digital payments"
    },
    {
      practice: "Set Clear Due Dates",
      reason: "Creates urgency for payment",
      tip: "NET 15 for residential, NET 30 for commercial"
    }
  ];

  // Legal requirements by element
  const legalRequirements = [
    { element: "Business License Number", required: "Most states", purpose: "Legitimacy verification" },
    { element: "Insurance Information", required: "Commercial jobs", purpose: "Liability protection" },
    { element: "Tax ID Number", required: "All invoices", purpose: "Tax compliance" },
    { element: "Payment Terms", required: "All invoices", purpose: "Legal enforceability" },
    { element: "Detailed Scope", required: "Best practice", purpose: "Dispute prevention" }
  ];

  return (
    <div>
      <KofiHeader />
      
      {/* Hero Section */}
      <section>
        <div>
          <div>
            <Badge>
              Free Professional Templates
            </Badge>
            <h1>
              Painting Invoice Template for Professional Contractors
            </h1>
            <p>
              Painting invoice template free download in Excel, PDF, and Word formats. 
              Professional invoices that get you paid 3x faster with proper formatting, 
              payment terms, and legal protection.
            </p>
            
            <div>
              <Button size="lg" asChild>
                <Link href="/trial-signup">
                  Download Invoice Templates
                  <Download />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#templates">
                  View Template Examples
                  <ArrowRight />
                </Link>
              </Button>
            </div>
            
            <div>
              <span>
                <FileText />
                Professional formats
              </span>
              <span>
                <Download />
                Instant download
              </span>
              <span>
                <Shield />
                Legal compliance
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Statistics */}
      <section>
        <div>
          <div>
            {paymentStats.map((stat, index) => (
              <div key={index}>
                <div>{stat.stat}</div>
                <div>{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Invoice Components */}
      <section>
        <div>
          <div>
            <h2>
              What Makes a Professional Painting Invoice
            </h2>
            <p>
              Essential components every invoice must include
            </p>
          </div>
          
          <div>
            {invoiceComponents.map((component, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{component.component}</CardTitle>
                  <Badge variant="outline">{component.importance}</Badge>
                </CardHeader>
                <CardContent>
                  <ul>
                    {component.includes.map((item, idx) => (
                      <li key={idx}>
                        <CheckCircle />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Invoice Formats */}
      <section id="templates">
        <div>
          <div>
            <h2>
              Choose Your Painting Invoice Format
            </h2>
            <p>
              Professional templates for every contractor's needs
            </p>
          </div>
          
          <div>
            {invoiceFormats.map((format, index) => (
              <Card key={index}>
                <CardHeader>
                  <div>{format.icon}</div>
                  <CardTitle>{format.format}</CardTitle>
                  <p>{format.description}</p>
                </CardHeader>
                <CardContent>
                  <ul>
                    {format.features.map((feature, idx) => (
                      <li key={idx}>
                        <CheckCircle />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <p>
                    Best for: {format.bestFor}
                  </p>
                  <Button asChild>
                    <Link href="/trial-signup">
                      Download Template
                      <Download />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Invoice Preview */}
      <section>
        <div>
          <div>
            <h2>
              Sample Painting Invoice
            </h2>
            <p>
              See what a professional invoice looks like
            </p>
          </div>
          
          <Card>
            <div>
              <div>
                <div>
                  <h3>Pro Paint Services LLC</h3>
                  <p>123 Main Street, Austin, TX 78701</p>
                  <p>Phone: (512) 555-0123 | License: #TX123456</p>
                </div>
                <div>
                  <p>INVOICE</p>
                  <p>#2024-0156</p>
                  <p>Date: March 15, 2024</p>
                </div>
              </div>
            </div>
            
            <CardContent>
              <div>
                <div>
                  <h4>Bill To:</h4>
                  <p>Sarah Johnson</p>
                  <p>456 Oak Avenue</p>
                  <p>Austin, TX 78702</p>
                  <p>(512) 555-0456</p>
                </div>
                <div>
                  <h4>Job Details:</h4>
                  <p>Interior Painting - 3 Bedroom Home</p>
                  <p>Start Date: March 10, 2024</p>
                  <p>Completion: March 13, 2024</p>
                </div>
              </div>
              
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Interior Painting - Labor</td>
                    <td>32 hrs</td>
                    <td>$65/hr</td>
                    <td>$2,080.00</td>
                  </tr>
                  <tr>
                    <td>Premium Paint (Sherwin Williams)</td>
                    <td>12 gal</td>
                    <td>$45/gal</td>
                    <td>$540.00</td>
                  </tr>
                  <tr>
                    <td>Primer</td>
                    <td>3 gal</td>
                    <td>$35/gal</td>
                    <td>$105.00</td>
                  </tr>
                  <tr>
                    <td>Supplies & Materials</td>
                    <td>1</td>
                    <td>$125</td>
                    <td>$125.00</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3}>Subtotal:</td>
                    <td>$2,850.00</td>
                  </tr>
                  <tr>
                    <td colSpan={3}>Tax (8.25%):</td>
                    <td>$235.13</td>
                  </tr>
                  <tr>
                    <td colSpan={3}>Total Due:</td>
                    <td>$3,085.13</td>
                  </tr>
                </tfoot>
              </table>
              
              <div>
                <h4>Payment Terms:</h4>
                <p>Payment due within 15 days of invoice date</p>
                <p>Late payments subject to 1.5% monthly interest</p>
                <p>Accepted payment methods: Check, Cash, Credit Card, Zelle</p>
              </div>
            </CardContent>
          </Card>
          
          <div>
            <Button size="lg" asChild>
              <Link href="/trial-signup">
                Get This Template
                <Download />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section>
        <div>
          <div>
            <h2>
              Avoid These Invoice Mistakes
            </h2>
            <p>
              Common errors that delay payment
            </p>
          </div>
          
          <div>
            {invoiceMistakes.map((mistake, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>
                    <AlertCircle />
                    {mistake.mistake}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <span>Consequence:</span> {mistake.consequence}
                  </p>
                  <p>
                    <span>Fix:</span> {mistake.solution}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section>
        <div>
          <div>
            <h2>
              Invoice Best Practices for Faster Payment
            </h2>
            <p>
              Professional tips from successful contractors
            </p>
          </div>
          
          <div>
            {bestPractices.map((practice, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>
                    <Star />
                    {practice.practice}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{practice.reason}</p>
                  <div>
                    <p>
                      💡 Pro Tip: {practice.tip}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Requirements */}
      <section>
        <div>
          <div>
            <h2>
              Legal Requirements for Painting Invoices
            </h2>
            <p>
              Stay compliant and protect your business
            </p>
          </div>
          
          <Card>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Invoice Element</th>
                    <th>Required By</th>
                    <th>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {legalRequirements.map((req, index) => (
                    <tr key={index}>
                      <td>{req.element}</td>
                      <td>{req.required}</td>
                      <td>{req.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Digital Invoice Benefits */}
      <section>
        <div>
          <Card>
            <div>
              <div>
                <h2>
                  Go Digital with Smart Invoicing
                </h2>
                <div>
                  <div>
                    <Smartphone />
                    <div>
                      <h3>Send from Job Site</h3>
                      <p>Invoice immediately after completion</p>
                    </div>
                  </div>
                  <div>
                    <Mail />
                    <div>
                      <h3>Automatic Reminders</h3>
                      <p>Never chase payments again</p>
                    </div>
                  </div>
                  <div>
                    <DollarSign />
                    <div>
                      <h3>Online Payments</h3>
                      <p>Get paid 3x faster</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3>Digital Invoice Features</h3>
                <ul>
                  <li>
                    <CheckCircle />
                    <span>Create invoices in 2 minutes</span>
                  </li>
                  <li>
                    <CheckCircle />
                    <span>Track payment status</span>
                  </li>
                  <li>
                    <CheckCircle />
                    <span>Accept credit cards</span>
                  </li>
                  <li>
                    <CheckCircle />
                    <span>Export to QuickBooks</span>
                  </li>
                  <li>
                    <CheckCircle />
                    <span>Store client history</span>
                  </li>
                </ul>
                <Button asChild>
                  <Link href="/trial-signup">
                    Try Digital Invoicing
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div>
          <h2>
            Get Professional Painting Invoice Templates
          </h2>
          <p>
            Download free painting invoice templates or upgrade to digital invoicing. 
            Join 5,000+ contractors getting paid faster with professional invoices.
          </p>
          
          <div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/trial-signup">
                Download Templates Free
                <Download />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/painting-contractor-app">
                Try Mobile Invoicing
                <Smartphone />
              </Link>
            </Button>
          </div>
          
          <div>
            <span>
              <CheckCircle />
              Excel, PDF, Word formats
            </span>
            <span>
              <CheckCircle />
              Legal compliance
            </span>
            <span>
              <CheckCircle />
              Get paid faster
            </span>
          </div>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  );
}