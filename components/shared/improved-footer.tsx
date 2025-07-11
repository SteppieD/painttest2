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
    <footer className="bg-white border-t border-gray-200">
      {/* Trust Indicators Section - Bright & Eye-catching */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Paint Quote Pro</h3>
                <p className="text-sm text-gray-600">Professional Painting Software</p>
              </div>
            </div>
            
            {/* Bright Social Proof Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
                <div className="flex items-center justify-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">4.9/5</div>
                <div className="text-gray-700 font-medium">Customer Rating</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                <Users className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-600 mb-2">5,000+</div>
                <div className="text-gray-700 font-medium">Active Contractors</div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                <TrendingUp className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-purple-600 mb-2">$2.3M+</div>
                <div className="text-gray-700 font-medium">Quotes Generated</div>
              </div>
            </div>
          </div>
          
          <p className="text-center text-lg text-gray-700 max-w-2xl mx-auto">
            Trusted by professional painting contractors nationwide. Join thousands of painters who've increased their quote accuracy and win rates.
          </p>
        </div>
      </div>

      {/* Main Footer Content - Clean & Readable */}
      <div className="bg-white py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Product */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Product</h3>
              <ul className="space-y-3">
                <li><Link href="/features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">All Features</Link></li>
                <li><Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Pricing Plans</Link></li>
                <li><Link href="/trial-signup" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Free Trial</Link></li>
                <li><Link href="/demo" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Live Demo</Link></li>
              </ul>
            </div>
            
            {/* Free Resources */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Free Resources</h3>
              <ul className="space-y-3">
                <li><Link href="/painting-estimate-calculator-free" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Paint Calculator</Link></li>
                <li><Link href="/painting-quote-templates-free" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Quote Templates</Link></li>
                <li><Link href="/how-to-quote-painting-jobs-professionally" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Quoting Guide</Link></li>
                <li><Link href="/blog" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Business Tips</Link></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Support</h3>
              <ul className="space-y-3">
                <li><Link href="/help" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Help Center</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Contact Us</Link></li>
                <li><Link href="/tutorials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Video Tutorials</Link></li>
                <li><Link href="/api" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">API Docs</Link></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Get In Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <a href="mailto:support@paintquoteapp.com" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                    support@paintquoteapp.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <a href="tel:1-800-PAINTER" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                    1-800-PAINTER
                  </a>
                </div>
                <div className="mt-6">
                  <Link 
                    href="/trial-signup" 
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                  >
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Simple & Clean */}
      <div className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600">
              © 2025 Paint Quote Pro. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</Link>
              <Link href="/security" className="text-gray-600 hover:text-blue-600 transition-colors">Security</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}