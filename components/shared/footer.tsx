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
      className="py-12 px-4 text-white"
      style={{ 
        backgroundColor: '#1f2937',
        color: '#f9fafb',
        borderTop: '1px solid rgba(55, 65, 81, 0.5)'
      }}
    >
      <div className="container mx-auto max-w-6xl">
        {/* Trust Indicators */}
        <div className="text-center mb-12 border-b border-gray-700 pb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img 
              src="/paint-logo-transparent.png" 
              alt="Paint Quote App - Professional painting estimate software footer logo" 
              className="w-8 h-8"
              width="32"
              height="32"
            />
            <span className="text-2xl font-bold" style={{ color: '#ffffff' }}>Paint Quote App</span>
          </div>
          
          {/* Social Proof Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
              </div>
              <div className="text-2xl font-bold text-blue-400 mb-1">4.9/5</div>
              <div className="text-gray-300 text-sm">Customer Rating</div>
            </div>
            <div className="text-center">
              <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400 mb-1">5,000+</div>
              <div className="text-gray-300 text-sm">Active Contractors</div>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400 mb-1">$2.3M+</div>
              <div className="text-gray-300 text-sm">Quotes Generated</div>
            </div>
          </div>
          
          <p className="text-gray-300 max-w-2xl mx-auto">
            Trusted by professional painting contractors nationwide. Join thousands of painters who've increased their quote accuracy and win rates with ProPaint Quote.
          </p>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4 text-blue-400">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-gray-300 hover:text-white transition-colors">All Features</Link></li>
              <li><Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing Plans</Link></li>
              <li><Link href="/trial-signup" className="text-gray-300 hover:text-white transition-colors">Free Trial</Link></li>
              <li><Link href="/demo" className="text-gray-300 hover:text-white transition-colors">Live Demo</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-green-400">Free Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/painting-estimate-calculator" className="text-gray-300 hover:text-white transition-colors">Paint Calculator</Link></li>
              <li><Link href="/painting-quote-templates" className="text-gray-300 hover:text-white transition-colors">Quote Templates</Link></li>
              <li><Link href="/how-to-quote-painting-jobs-professionally" className="text-gray-300 hover:text-white transition-colors">Quoting Guide</Link></li>
              <li><Link href="/painting-business-tips" className="text-gray-300 hover:text-white transition-colors">Business Tips</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-purple-400">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/tutorials" className="text-gray-300 hover:text-white transition-colors">Video Tutorials</Link></li>
              <li><Link href="/api-docs" className="text-gray-300 hover:text-white transition-colors">API Documentation</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-orange-400">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/testimonials" className="text-gray-300 hover:text-white transition-colors">Success Stories</Link></li>
              <li><Link href="/painting-contractor-software-case-study" className="text-gray-300 hover:text-white transition-colors">Case Studies</Link></li>
              <li><Link href="/careers" className="text-gray-300 hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300">hello@paintquoteapp.com</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-5 h-5 text-purple-400" />
              <span className="text-gray-300">Available Nationwide</span>
            </div>
          </div>
        </div>

        {/* Security & Trust */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Shield className="w-6 h-6 text-green-400" />
              <span className="text-gray-300 text-sm">Enterprise-grade security • SOC 2 compliant • 99.9% uptime</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/security" className="text-gray-300 hover:text-white transition-colors">Security</Link>
              <Link href="/sitemap.xml" className="text-gray-300 hover:text-white transition-colors">Sitemap</Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-300">&copy; 2024 ProPaint Quote. All rights reserved. Built by painters, for painters.</p>
          <p className="text-sm mt-2 text-gray-400">Helping professional contractors win more jobs since 2024.</p>
        </div>
      </div>
    </footer>
  );
}