import Link from 'next/link';
import { 
  Calculator, 
  FileText, 
  Building, 
  DollarSign,
  BookOpen,
  Users,
  Smartphone,
  Award
} from 'lucide-react';

export function QuickLinksSection() {
  const quickLinks = [
    {
      category: "Calculators & Tools",
      links: [
        { href: "/painting-estimate-calculator", text: "Free Painting Calculator", icon: Calculator },
        { href: "/painting-estimate-calculator-free", text: "Estimate Calculator Free", icon: Calculator },
        { href: "/paint-coverage-calculator", text: "Paint Coverage Calculator", icon: DollarSign },
        { href: "/exterior-painting-estimate-calculator", text: "Exterior Estimate Calculator", icon: Building },
        { href: "/exterior-painting-quote-calculator", text: "Exterior Quote Calculator", icon: Building },
        { href: "/house-painting-cost-calculator", text: "House Cost Calculator", icon: DollarSign },
        { href: "/roi-calculator", text: "ROI Calculator", icon: DollarSign }
      ]
    },
    {
      category: "Resources & Guides",
      links: [
        { href: "/painting-quote-templates-free", text: "Free Quote Templates", icon: FileText },
        { href: "/painting-quote-templates", text: "Quote Templates", icon: FileText },
        { href: "/paint-estimate-templates", text: "Estimate Templates", icon: FileText },
        { href: "/painting-invoice-template", text: "Invoice Templates", icon: FileText },
        { href: "/how-to-quote-painting-jobs", text: "How to Quote Jobs", icon: BookOpen },
        { href: "/how-to-quote-painting-jobs-professionally", text: "Professional Quoting", icon: BookOpen },
        { href: "/how-to-scale-painting-business", text: "Scale Your Business", icon: BookOpen },
        { href: "/painting-business-tips", text: "Business Tips", icon: BookOpen },
        { href: "/painting-business-profit-guide", text: "Profit Guide", icon: BookOpen }
      ]
    },
    {
      category: "Software & Apps",
      links: [
        { href: "/painting-estimating-software", text: "Painting Estimating Software", icon: Smartphone },
        { href: "/painting-estimate-software", text: "Paint Estimate Software", icon: Smartphone },
        { href: "/painting-business-software", text: "Painting Business Software", icon: Smartphone },
        { href: "/professional-painting-software", text: "Painting Contractor Software", icon: Smartphone },
        { href: "/commercial-painting-estimating-software", text: "Commercial Painting Software", icon: Building },
        { href: "/mobile-painting-estimate-app", text: "Mobile Painting Estimate App", icon: Smartphone },
        { href: "/painting-contractor-app", text: "Painting Contractor App", icon: Smartphone }
      ]
    },
    {
      category: "Success & Support",
      links: [
        { href: "/case-studies", text: "Case Studies", icon: Award },
        { href: "/testimonials", text: "Customer Reviews", icon: Users },
        { href: "/painting-contractor-increased-revenue-software", text: "Revenue Success", icon: Award },
        { href: "/painting-estimate-software-success-story", text: "Success Story", icon: Award },
        { href: "/small-painting-business-growth-software", text: "Small Business Growth", icon: Award },
        { href: "/about", text: "About Us", icon: Users },
        { href: "/contact", text: "Contact Sales", icon: Users },
        { href: "/demo", text: "Live Demo", icon: Smartphone },
        { href: "/help", text: "Help Center", icon: BookOpen },
        { href: "/tutorials", text: "Tutorials", icon: BookOpen },
        { href: "/awards", text: "Awards", icon: Award },
        { href: "/blog", text: "Blog", icon: BookOpen }
      ]
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Paint Quote Pro Resources
          </h2>
          <p className="text-xl text-gray-600">
            Free tools, guides, and resources for painting contractors
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {quickLinks.map((section, idx) => (
            <div key={idx} className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">
                {section.category}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link 
                      href={link.href}
                      className="flex items-center gap-2 text-gray-600 hover:text-primary-pink transition-colors"
                    >
                      <link.icon className="w-4 h-4" />
                      <span className="text-sm">{link.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Service Locations</h3>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <Link href="/locations" className="text-gray-600 hover:text-primary-pink">All Locations</Link>
              <span className="text-gray-400">|</span>
              <Link href="/locations/new-york-ny" className="text-gray-600 hover:text-primary-pink">New York</Link>
              <span className="text-gray-400">|</span>
              <Link href="/locations/los-angeles-ca" className="text-gray-600 hover:text-primary-pink">Los Angeles</Link>
              <span className="text-gray-400">|</span>
              <Link href="/locations/chicago-il" className="text-gray-600 hover:text-primary-pink">Chicago</Link>
              <span className="text-gray-400">|</span>
              <Link href="/locations/houston-tx" className="text-gray-600 hover:text-primary-pink">Houston</Link>
              <span className="text-gray-400">|</span>
              <Link href="/locations/phoenix-az" className="text-gray-600 hover:text-primary-pink">Phoenix</Link>
              <span className="text-gray-400">|</span>
              <Link href="/locations/philadelphia-pa" className="text-gray-600 hover:text-primary-pink">Philadelphia</Link>
              <span className="text-gray-400">|</span>
              <Link href="/locations/san-antonio-tx" className="text-gray-600 hover:text-primary-pink">San Antonio</Link>
              <span className="text-gray-400">|</span>
              <Link href="/locations/san-diego-ca" className="text-gray-600 hover:text-primary-pink">San Diego</Link>
              <span className="text-gray-400">|</span>
              <Link href="/locations/dallas-tx" className="text-gray-600 hover:text-primary-pink">Dallas</Link>
            </div>
          </div>
          
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/privacy" className="text-gray-600 hover:text-primary-pink">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-600 hover:text-primary-pink">Terms of Service</Link>
            <Link href="/sitemap.xml" className="text-gray-600 hover:text-primary-pink">Sitemap</Link>
          </div>
        </div>
      </div>
    </section>
  );
}