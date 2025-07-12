import Link from 'next/link';
import { 
  Palette,
  Star,
  Users,
  TrendingUp,
  Shield,
  Mail,
  MapPin
} from 'lucide-react';

export function Footer() {
  return (
    <footer 
     
     
    >
      <div>
        {/* Trust Indicators */}
        <div>
          <div>
            <img 
              src="/paint-logo-transparent.png" 
              alt="Paint Quote App - Professional painting estimate software footer logo" 
             
             
             
            />
            <span>Paint Quote App</span>
          </div>
          
          {/* Social Proof Stats */}
          <div>
            <div>
              <div>
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
              </div>
              <div>4.9/5</div>
              <div>Customer Rating</div>
            </div>
            <div>
              <Users />
              <div>5,000+</div>
              <div>Active Contractors</div>
            </div>
            <div>
              <TrendingUp />
              <div>$2.3M+</div>
              <div>Quotes Generated</div>
            </div>
          </div>
          
          <p>
            Trusted by professional painting contractors nationwide. Join thousands of painters who've increased their quote accuracy and win rates with ProPaint Quote.
          </p>
        </div>

        {/* Footer Links */}
        <div>
          <div>
            <h3>Product</h3>
            <ul>
              <li><Link href="/features">All Features</Link></li>
              <li><Link href="/pricing">Pricing Plans</Link></li>
              <li><Link href="/trial-signup">Free Trial</Link></li>
              <li><Link href="/demo">Live Demo</Link></li>
            </ul>
          </div>
          
          <div>
            <h3>Free Resources</h3>
            <ul>
              <li><Link href="/painting-estimate-calculator">Paint Calculator</Link></li>
              <li><Link href="/painting-quote-templates">Quote Templates</Link></li>
              <li><Link href="/how-to-quote-painting-jobs-professionally">Quoting Guide</Link></li>
              <li><Link href="/painting-business-tips">Business Tips</Link></li>
            </ul>
          </div>
          
          <div>
            <h3>Support</h3>
            <ul>
              <li><Link href="/help">Help Center</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/tutorials">Video Tutorials</Link></li>
              <li><Link href="/api-docs">API Documentation</Link></li>
            </ul>
          </div>
          
          <div>
            <h3>Company</h3>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/testimonials">Success Stories</Link></li>
              <li><Link href="/painting-contractor-software-case-study">Case Studies</Link></li>
              <li><Link href="/careers">Careers</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <div>
            <div>
              <Mail />
              <span>hello@paintquoteapp.com</span>
            </div>
            <div>
              <MapPin />
              <span>Available Nationwide</span>
            </div>
          </div>
        </div>

        {/* Security & Trust */}
        <div>
          <div>
            <div>
              <Shield />
              <span>Enterprise-grade security • SOC 2 compliant • 99.9% uptime</span>
            </div>
            <div>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/security">Security</Link>
              <Link href="/sitemap.xml">Sitemap</Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div>
          <p>&copy; 2024 ProPaint Quote. All rights reserved. Built by painters, for painters.</p>
          <p>Helping professional contractors win more jobs since 2024.</p>
        </div>
      </div>
    </footer>
  );
}