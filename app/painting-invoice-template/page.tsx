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
    <div className="min-h-screen bg-white">
      <KofiHeader />
      
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-1 text-sm font-semibold bg-blue-100 text-blue-800 border-blue-200">
              Free Professional Templates
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Painting Invoice Template for Professional Contractors
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Painting invoice template free download in Excel, PDF, and Word formats. 
              Professional invoices that get you paid 3x faster with proper formatting, 
              payment terms, and legal protection.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/trial-signup">
                  Download Invoice Templates
                  <Download className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="#templates">
                  View Template Examples
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4 text-green-500" />
                Professional formats
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-4 h-4 text-green-500" />
                Instant download
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-green-500" />
                Legal compliance
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Statistics */}
      <section className="py-12 px-4 bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {paymentStats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.stat}</div>
                <div className="text-gray-400 text-sm">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Invoice Components */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Makes a Professional Painting Invoice
            </h2>
            <p className="text-xl text-gray-600">
              Essential components every invoice must include
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {invoiceComponents.map((component, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{component.component}</CardTitle>
                  <Badge variant="outline" className="w-fit">{component.importance}</Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {component.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
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
      <section id="templates" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Painting Invoice Format
            </h2>
            <p className="text-xl text-gray-600">
              Professional templates for every contractor's needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {invoiceFormats.map((format, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{format.icon}</div>
                  <CardTitle className="text-xl">{format.format}</CardTitle>
                  <p className="text-sm text-gray-600 mt-2">{format.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {format.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm font-semibold text-blue-600 mb-4">
                    Best for: {format.bestFor}
                  </p>
                  <Button className="w-full" asChild>
                    <Link href="/trial-signup">
                      Download Template
                      <Download className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Invoice Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sample Painting Invoice
            </h2>
            <p className="text-xl text-gray-600">
              See what a professional invoice looks like
            </p>
          </div>
          
          <Card className="shadow-2xl overflow-hidden">
            <div className="bg-blue-600 text-white p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Pro Paint Services LLC</h3>
                  <p className="text-blue-100">123 Main Street, Austin, TX 78701</p>
                  <p className="text-blue-100">Phone: (512) 555-0123 | License: #TX123456</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">INVOICE</p>
                  <p className="text-blue-100">#2024-0156</p>
                  <p className="text-blue-100">Date: March 15, 2024</p>
                </div>
              </div>
            </div>
            
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Bill To:</h4>
                  <p className="text-gray-600">Sarah Johnson</p>
                  <p className="text-gray-600">456 Oak Avenue</p>
                  <p className="text-gray-600">Austin, TX 78702</p>
                  <p className="text-gray-600">(512) 555-0456</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Job Details:</h4>
                  <p className="text-gray-600">Interior Painting - 3 Bedroom Home</p>
                  <p className="text-gray-600">Start Date: March 10, 2024</p>
                  <p className="text-gray-600">Completion: March 13, 2024</p>
                </div>
              </div>
              
              <table className="w-full mb-8">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Qty</th>
                    <th className="text-right py-2">Rate</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b">
                    <td className="py-3">Interior Painting - Labor</td>
                    <td className="text-right">32 hrs</td>
                    <td className="text-right">$65/hr</td>
                    <td className="text-right font-semibold">$2,080.00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Premium Paint (Sherwin Williams)</td>
                    <td className="text-right">12 gal</td>
                    <td className="text-right">$45/gal</td>
                    <td className="text-right font-semibold">$540.00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Primer</td>
                    <td className="text-right">3 gal</td>
                    <td className="text-right">$35/gal</td>
                    <td className="text-right font-semibold">$105.00</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Supplies & Materials</td>
                    <td className="text-right">1</td>
                    <td className="text-right">$125</td>
                    <td className="text-right font-semibold">$125.00</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300">
                    <td colSpan={3} className="text-right py-3 font-semibold">Subtotal:</td>
                    <td className="text-right font-semibold">$2,850.00</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-right py-3 font-semibold">Tax (8.25%):</td>
                    <td className="text-right font-semibold">$235.13</td>
                  </tr>
                  <tr className="text-xl">
                    <td colSpan={3} className="text-right py-3 font-bold">Total Due:</td>
                    <td className="text-right font-bold text-blue-600">$3,085.13</td>
                  </tr>
                </tfoot>
              </table>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-2">Payment Terms:</h4>
                <p className="text-sm text-gray-600 mb-2">Payment due within 15 days of invoice date</p>
                <p className="text-sm text-gray-600 mb-2">Late payments subject to 1.5% monthly interest</p>
                <p className="text-sm text-gray-600">Accepted payment methods: Check, Cash, Credit Card, Zelle</p>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center mt-8">
            <Button size="lg" asChild>
              <Link href="/trial-signup">
                Get This Template
                <Download className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Avoid These Invoice Mistakes
            </h2>
            <p className="text-xl text-gray-600">
              Common errors that delay payment
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invoiceMistakes.map((mistake, index) => (
              <Card key={index} className="border-l-4 border-red-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    {mistake.mistake}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Consequence:</span> {mistake.consequence}
                  </p>
                  <p className="text-sm text-green-600">
                    <span className="font-semibold">Fix:</span> {mistake.solution}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Invoice Best Practices for Faster Payment
            </h2>
            <p className="text-xl text-gray-600">
              Professional tips from successful contractors
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {bestPractices.map((practice, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    {practice.practice}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">{practice.reason}</p>
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="text-sm font-semibold text-blue-800">
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
      <section className="py-20 px-4 bg-blue-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Legal Requirements for Painting Invoices
            </h2>
            <p className="text-xl text-gray-600">
              Stay compliant and protect your business
            </p>
          </div>
          
          <Card className="overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800 text-white">
                    <th className="px-6 py-4 text-left">Invoice Element</th>
                    <th className="px-6 py-4 text-left">Required By</th>
                    <th className="px-6 py-4 text-left">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {legalRequirements.map((req, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{req.element}</td>
                      <td className="px-6 py-4">{req.required}</td>
                      <td className="px-6 py-4 text-gray-600">{req.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Digital Invoice Benefits */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="overflow-hidden shadow-xl">
            <div className="grid md:grid-cols-2">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8 md:p-12">
                <h2 className="text-3xl font-bold mb-4">
                  Go Digital with Smart Invoicing
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Smartphone className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Send from Job Site</h3>
                      <p className="text-blue-100 text-sm">Invoice immediately after completion</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Automatic Reminders</h3>
                      <p className="text-blue-100 text-sm">Never chase payments again</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">Online Payments</h3>
                      <p className="text-blue-100 text-sm">Get paid 3x faster</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8 md:p-12">
                <h3 className="text-2xl font-bold mb-6">Digital Invoice Features</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Create invoices in 2 minutes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Track payment status</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Accept credit cards</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Export to QuickBooks</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Store client history</span>
                  </li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href="/trial-signup">
                    Try Digital Invoicing
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Get Professional Painting Invoice Templates
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Download free painting invoice templates or upgrade to digital invoicing. 
            Join 5,000+ contractors getting paid faster with professional invoices.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <Link href="/trial-signup">
                Download Templates Free
                <Download className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 text-white border-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/painting-contractor-app">
                Try Mobile Invoicing
                <Smartphone className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-blue-100">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Excel, PDF, Word formats
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Legal compliance
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Get paid faster
            </span>
          </div>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  );
}