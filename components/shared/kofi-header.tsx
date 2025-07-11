'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { QuotaCounter } from '@/components/ui/quota-counter';
import { 
  Palette, 
  Menu, 
  X,
  ChevronDown,
  Calculator,
  FileText,
  BookOpen,
  Smartphone,
  Users,
  TrendingUp,
  Building2,
  Shield,
  Zap,
  BarChart3,
  Award,
  Briefcase,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function KofiHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const pathname = usePathname();

  // Get company ID from localStorage/sessionStorage
  useEffect(() => {
    // Check sessionStorage first
    const storedCompanyId = sessionStorage.getItem('companyId');
    if (storedCompanyId) {
      setCompanyId(storedCompanyId);
    } else {
      // Check localStorage for company data
      const companyData = localStorage.getItem('paintquote_company');
      if (companyData) {
        try {
          const company = JSON.parse(companyData);
          if (company.id) {
            setCompanyId(company.id.toString());
          }
        } catch (e) {
          console.error('Error parsing company data:', e);
        }
      }
    }
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveDropdown(null);
  };

  const handleDropdownToggle = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="kofi-header">
      <div className="kofi-nav">
        {/* Logo */}
        <Link href="/" className="kofi-logo" onClick={closeAllMenus}>
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <span className="hidden sm:block">ProPaint Quote</span>
          <span className="block sm:hidden">PQP</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex kofi-nav-links">
          {/* Product Dropdown */}
          <div className="relative">
            <button 
              className="kofi-nav-link flex items-center gap-1"
              onMouseEnter={() => setActiveDropdown('product')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              Product
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {activeDropdown === 'product' && (
              <div 
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 kofi-card z-50"
                onMouseEnter={() => setActiveDropdown('product')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="kofi-card-body">
                  <Link href="/features" className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors" onClick={closeAllMenus}>
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Features</div>
                      <div className="text-sm text-gray-600">Everything included in our platform</div>
                    </div>
                  </Link>
                  <Link href="/demo" className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors" onClick={closeAllMenus}>
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Watch Demo</div>
                      <div className="text-sm text-gray-600">See Paint Quote Pro in action</div>
                    </div>
                  </Link>
                  <Link href="/integrations" className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors" onClick={closeAllMenus}>
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Integrations</div>
                      <div className="text-sm text-gray-600">Connect with QuickBooks & more</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Solutions Dropdown */}
          <div className="relative">
            <button 
              className="kofi-nav-link flex items-center gap-1"
              onMouseEnter={() => setActiveDropdown('solutions')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              Solutions
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {activeDropdown === 'solutions' && (
              <div 
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 kofi-card z-50"
                onMouseEnter={() => setActiveDropdown('solutions')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="kofi-card-body">
                  <Link href="/painting-contractors" className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors" onClick={closeAllMenus}>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">For Contractors</div>
                      <div className="text-sm text-gray-600">Tailored for painting businesses</div>
                    </div>
                  </Link>
                  <Link href="/enterprise" className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors" onClick={closeAllMenus}>
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Enterprise</div>
                      <div className="text-sm text-gray-600">Solutions for large teams</div>
                    </div>
                  </Link>
                  <Link href="/commercial-painting-estimating" className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors" onClick={closeAllMenus}>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Commercial</div>
                      <div className="text-sm text-gray-600">Handle large-scale projects</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Resources Dropdown */}
          <div className="relative">
            <button 
              className="kofi-nav-link flex items-center gap-1"
              onMouseEnter={() => setActiveDropdown('resources')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              Resources
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {activeDropdown === 'resources' && (
              <div 
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-96 kofi-card z-50"
                onMouseEnter={() => setActiveDropdown('resources')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="kofi-card-body">
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Free Tools</h3>
                    <Link href="/painting-estimate-calculator-free" className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors" onClick={closeAllMenus}>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calculator className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Quote Calculator</div>
                        <div className="text-sm text-gray-600">Generate instant painting estimates</div>
                      </div>
                    </Link>
                    <Link href="/paint-estimate-templates" className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors" onClick={closeAllMenus}>
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Quote Templates</div>
                        <div className="text-sm text-gray-600">Professional, ready-to-use formats</div>
                      </div>
                    </Link>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Learning Center</h3>
                    <Link href="/how-to-quote-painting-jobs-professionally" className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors" onClick={closeAllMenus}>
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Quoting Guide</div>
                        <div className="text-sm text-gray-600">Expert strategies for winning bids</div>
                      </div>
                    </Link>
                    <Link href="/painting-contractor-software-case-study" className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors" onClick={closeAllMenus}>
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Success Stories</div>
                        <div className="text-sm text-gray-600">Real contractors, real results</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link 
            href="/pricing" 
            className={`kofi-nav-link ${isActive('/pricing') ? 'active' : ''}`}
          >
            Pricing
          </Link>

          {/* Company Dropdown */}
          <div className="relative">
            <button 
              className="kofi-nav-link flex items-center gap-1"
              onMouseEnter={() => setActiveDropdown('company')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              Company
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {activeDropdown === 'company' && (
              <div 
                className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 kofi-card z-50"
                onMouseEnter={() => setActiveDropdown('company')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div className="kofi-card-body">
                  <Link href="/about" className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors" onClick={closeAllMenus}>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">About Us</div>
                      <div className="text-sm text-gray-600">Our mission & story</div>
                    </div>
                  </Link>
                  <Link href="/contact" className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors" onClick={closeAllMenus}>
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Contact</div>
                      <div className="text-sm text-gray-600">Get in touch with sales</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Show quota counter if user is logged in */}
          {companyId && (
            <QuotaCounter 
              companyId={companyId} 
              variant="header" 
              showUpgrade={true}
              className="mr-3"
            />
          )}
          
          {companyId ? (
            <Link 
              href="/dashboard" 
              className="kofi-btn kofi-btn-ghost"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link 
                href="/access-code" 
                className="kofi-btn kofi-btn-ghost"
              >
                Sign In
              </Link>
              <Link 
                href="/trial-signup" 
                className="kofi-btn kofi-btn-primary"
              >
                Start Free Trial
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="kofi-container">
            <nav className="py-4 space-y-4">
              {/* Mobile Product Section */}
              <div>
                <button
                  onClick={() => handleDropdownToggle('mobile-product')}
                  className="flex items-center justify-between w-full py-2 text-gray-700 font-medium"
                >
                  Product
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'mobile-product' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === 'mobile-product' && (
                  <div className="mt-2 pl-4 space-y-2">
                    <Link href="/features" className="block py-2 text-gray-600" onClick={closeAllMenus}>Features</Link>
                    <Link href="/demo" className="block py-2 text-gray-600" onClick={closeAllMenus}>Watch Demo</Link>
                    <Link href="/integrations" className="block py-2 text-gray-600" onClick={closeAllMenus}>Integrations</Link>
                  </div>
                )}
              </div>

              {/* Mobile Solutions Section */}
              <div>
                <button
                  onClick={() => handleDropdownToggle('mobile-solutions')}
                  className="flex items-center justify-between w-full py-2 text-gray-700 font-medium"
                >
                  Solutions
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'mobile-solutions' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === 'mobile-solutions' && (
                  <div className="mt-2 pl-4 space-y-2">
                    <Link href="/painting-contractors" className="block py-2 text-gray-600" onClick={closeAllMenus}>For Contractors</Link>
                    <Link href="/enterprise" className="block py-2 text-gray-600" onClick={closeAllMenus}>Enterprise</Link>
                    <Link href="/commercial-painting-estimating" className="block py-2 text-gray-600" onClick={closeAllMenus}>Commercial</Link>
                  </div>
                )}
              </div>

              {/* Mobile Resources Section */}
              <div>
                <button
                  onClick={() => handleDropdownToggle('mobile-resources')}
                  className="flex items-center justify-between w-full py-2 text-gray-700 font-medium"
                >
                  Resources
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'mobile-resources' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === 'mobile-resources' && (
                  <div className="mt-2 pl-4 space-y-2">
                    <Link href="/painting-estimate-calculator-free" className="block py-2 text-gray-600" onClick={closeAllMenus}>Quote Calculator</Link>
                    <Link href="/paint-estimate-templates" className="block py-2 text-gray-600" onClick={closeAllMenus}>Quote Templates</Link>
                    <Link href="/how-to-quote-painting-jobs-professionally" className="block py-2 text-gray-600" onClick={closeAllMenus}>Quoting Guide</Link>
                    <Link href="/painting-contractor-software-case-study" className="block py-2 text-gray-600" onClick={closeAllMenus}>Success Stories</Link>
                  </div>
                )}
              </div>

              <Link href="/pricing" className="block py-2 text-gray-700 font-medium" onClick={closeAllMenus}>
                Pricing
              </Link>

              {/* Mobile Company Section */}
              <div>
                <button
                  onClick={() => handleDropdownToggle('mobile-company')}
                  className="flex items-center justify-between w-full py-2 text-gray-700 font-medium"
                >
                  Company
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'mobile-company' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === 'mobile-company' && (
                  <div className="mt-2 pl-4 space-y-2">
                    <Link href="/about" className="block py-2 text-gray-600" onClick={closeAllMenus}>About Us</Link>
                    <Link href="/contact" className="block py-2 text-gray-600" onClick={closeAllMenus}>Contact</Link>
                  </div>
                )}
              </div>

              {/* Mobile CTA Buttons */}
              <div className="pt-4 space-y-3">
                <Link href="/access-code" className="kofi-btn kofi-btn-ghost w-full" onClick={closeAllMenus}>
                  Sign In
                </Link>
                <Link href="/trial-signup" className="kofi-btn kofi-btn-primary w-full" onClick={closeAllMenus}>
                  Start Free Trial
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}