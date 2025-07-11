import Link from 'next/link';
import { 
  Palette,
  Star,
  Users,
  TrendingUp,
  Shield,
  Mail,
  MapPin,
  Phone,
  ArrowRight
} from 'lucide-react';

export function ImprovedFooter() {
  return (
    <footer>
      {/* Trust Indicators Section - Bright & Eye-catching */}
      <div>
        <div>
          <div>
            <div>
              <div>
                <Palette />
              </div>
              <div>
                <h3>ProPaint Quote</h3>
                <p>Professional Painting Software</p>
              </div>
            </div>
            
            {/* Bright Social Proof Stats */}
            <div>
              <div>
                <div>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} />
                  ))}
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
          </div>
          
          <p>
            Trusted by professional painting contractors nationwide. Join thousands of painters who've increased their quote accuracy and win rates.
          </p>
        </div>
      </div>

      {/* Main Footer Content - Clean & Readable */}
      <div>
        <div>
          <div>
            {/* Product */}
            <div>
              <h3>Product</h3>
              <ul>
                <li><Link href="/features">All Features</Link></li>
                <li><Link href="/pricing">Pricing Plans</Link></li>
                <li><Link href="/trial-signup">Free Trial</Link></li>
                <li><Link href="/demo">Live Demo</Link></li>
              </ul>
            </div>
            
            {/* Free Resources */}
            <div>
              <h3>Free Resources</h3>
              <ul>
                <li><Link href="/painting-estimate-calculator-free">Paint Calculator</Link></li>
                <li><Link href="/painting-quote-templates-free">Quote Templates</Link></li>
                <li><Link href="/how-to-quote-painting-jobs-professionally">Quoting Guide</Link></li>
                <li><Link href="/blog">Business Tips</Link></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3>Support</h3>
              <ul>
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
                <li><Link href="/tutorials">Video Tutorials</Link></li>
                <li><Link href="/api">API Docs</Link></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h3>Get In Touch</h3>
              <div>
                <div>
                  <Mail />
                  <a href="mailto:support@paintquoteapp.com">
                    support@paintquoteapp.com
                  </a>
                </div>
                <div>
                  <Phone />
                  <a href="tel:1-800-PAINTER">
                    1-800-PAINTER
                  </a>
                </div>
                <div>
                  <Link 
                    href="/trial-signup" 
                   
                  >
                    Start Free Trial
                    <ArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Simple & Clean */}
      <div>
        <div>
          <div>
            <div>
              © 2025 ProPaint Quote. All rights reserved.
            </div>
            <div>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/security">Security</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}