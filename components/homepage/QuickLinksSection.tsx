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
    <section>
      <div>
        <div>
          <h2>
            Explore Paint Quote Pro Resources
          </h2>
          <p>
            Free tools, guides, and resources for painting contractors
          </p>
        </div>
        
        <div>
          {quickLinks.map((section, idx) => (
            <div key={idx}>
              <h3>
                {section.category}
              </h3>
              <ul>
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link 
                      href={link.href}
                     
                    >
                      <link.icon />
                      <span>{link.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div>
          <div>
            <h3>Service Locations</h3>
            <div>
              <Link href="/locations">All Locations</Link>
              <span>|</span>
              <Link href="/locations/new-york-ny">New York</Link>
              <span>|</span>
              <Link href="/locations/los-angeles-ca">Los Angeles</Link>
              <span>|</span>
              <Link href="/locations/chicago-il">Chicago</Link>
              <span>|</span>
              <Link href="/locations/houston-tx">Houston</Link>
              <span>|</span>
              <Link href="/locations/phoenix-az">Phoenix</Link>
              <span>|</span>
              <Link href="/locations/philadelphia-pa">Philadelphia</Link>
              <span>|</span>
              <Link href="/locations/san-antonio-tx">San Antonio</Link>
              <span>|</span>
              <Link href="/locations/san-diego-ca">San Diego</Link>
              <span>|</span>
              <Link href="/locations/dallas-tx">Dallas</Link>
            </div>
          </div>
          
          <div>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/sitemap.xml">Sitemap</Link>
          </div>
        </div>
      </div>
    </section>
  );
}