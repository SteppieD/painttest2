'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsResourcesOpen(false);
    setIsProductOpen(false);
    setIsSolutionsOpen(false);
    setIsCompanyOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 min-w-0">
            <img 
              src="/paint-logo-transparent.png" 
              alt="Paint Quote App - Professional painting estimate software for contractors" 
              className="w-8 h-8 flex-shrink-0"
              width="32"
              height="32"
            />
            <span className="text-xl md:text-2xl font-bold text-gray-900 truncate">Paint Quote App</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 flex-1 justify-end min-w-0">
            {/* Product Dropdown */}
            <div 
              className="nav-main-item"
              onMouseEnter={() => setIsProductOpen(true)}
              onMouseLeave={() => setIsProductOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                Product
                <ChevronDown className="nav-chevron w-4 h-4" />
              </button>
              
              {isProductOpen && (
                <div className="nav-dropdown show">
                  <Link href="/features" className="nav-dropdown-item">
                    <Zap className="nav-dropdown-icon nav-icon-blue" />
                    <div className="nav-dropdown-content">
                      <span className="nav-dropdown-title">Features</span>
                      <span className="nav-dropdown-description">Everything included in our platform</span>
                    </div>
                  </Link>
                  <Link href="/demo" className="nav-dropdown-item">
                    <BarChart3 className="nav-dropdown-icon nav-icon-green" />
                    <div className="nav-dropdown-content">
                      <span className="nav-dropdown-title">Watch Demo</span>
                      <span className="nav-dropdown-description">See Paint Quote App in action</span>
                    </div>
                  </Link>
                  <Link href="/integrations" className="nav-dropdown-item">
                    <Shield className="nav-dropdown-icon nav-icon-purple" />
                    <div className="nav-dropdown-content">
                      <span className="nav-dropdown-title">Integrations</span>
                      <span className="nav-dropdown-description">Connect with QuickBooks, Stripe & more</span>
                    </div>
                  </Link>
                  <Link href="/security" className="nav-dropdown-item">
                    <Shield className="nav-dropdown-icon nav-icon-gray" />
                    <div className="nav-dropdown-content">
                      <span className="nav-dropdown-title">Security</span>
                      <span className="nav-dropdown-description">Enterprise-grade protection</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div 
              className="nav-main-item"
              onMouseEnter={() => setIsSolutionsOpen(true)}
              onMouseLeave={() => setIsSolutionsOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                Solutions
                <ChevronDown className="nav-chevron w-4 h-4" />
              </button>
              
              {isSolutionsOpen && (
                <div className="nav-dropdown show">
                  <Link href="/painting-contractors" className="nav-dropdown-item">
                    <Users className="nav-dropdown-icon nav-icon-blue" />
                    <div className="nav-dropdown-content">
                      <span className="nav-dropdown-title">For Contractors</span>
                      <span className="nav-dropdown-description">Tailored for painting businesses</span>
                    </div>
                  </Link>
                  <Link href="/enterprise" className="nav-dropdown-item">
                    <Building2 className="nav-dropdown-icon nav-icon-purple" />
                    <div className="nav-dropdown-content">
                      <span className="nav-dropdown-title">Enterprise</span>
                      <span className="nav-dropdown-description">Solutions for large teams</span>
                    </div>
                  </Link>
                  <Link href="/commercial-painting-estimating" className="nav-dropdown-item">
                    <Briefcase className="nav-dropdown-icon nav-icon-green" />
                    <div className="nav-dropdown-content">
                      <span className="nav-dropdown-title">Commercial</span>
                      <span className="nav-dropdown-description">Handle large-scale projects</span>
                    </div>
                  </Link>
                  <Link href="/locations" className="nav-dropdown-item">
                    <MapPin className="nav-dropdown-icon nav-icon-red" />
                    <div className="nav-dropdown-content">
                      <span className="nav-dropdown-title">By Location</span>
                      <span className="nav-dropdown-description">Find contractors in your area</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Resources Dropdown */}
            <div 
              className="nav-main-item"
              onMouseEnter={() => setIsResourcesOpen(true)}
              onMouseLeave={() => setIsResourcesOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                Resources
                <ChevronDown className="nav-chevron w-4 h-4" />
              </button>
              
              {isResourcesOpen && (
                <div className="nav-dropdown show" style={{ minWidth: '320px' }}>
                  {/* Free Tools Section */}
                  <div className="nav-dropdown-section">
                    <h3 className="nav-dropdown-section-title">Free Tools</h3>
                  </div>
                  <Link href="/painting-estimate-calculator-free" className="nav-dropdown-item">
                    <Calculator className="nav-dropdown-icon nav-icon-blue" />
                    <div className="nav-dropdown-content">
                      <span className="nav-dropdown-title">Quote Calculator</span>
                      <span className="nav-dropdown-description">Generate instant painting estimates</span>
                    </div>
                  </Link>
                  <Link href="/paint-estimate-templates" className="nav-dropdown-item">
                    <FileText className="nav-dropdown-icon nav-icon-green" />
                    <div className="nav-dropdown-content">
                      <span className="nav-dropdown-title">Quote Templates</span>
                      <span className="nav-dropdown-description">Professional, ready-to-use formats</span>
                    </div>
                  </Link>
                  <Link href="/roi-calculator" className="nav-dropdown-item">
                    <TrendingUp className="nav-dropdown-icon nav-icon-purple" />
                    <div className="nav-dropdown-content">
                      <span className="nav-dropdown-title">ROI Calculator</span>
                      <span className="nav-dropdown-description">Calculate your potential savings</span>
                    </div>
                  </Link>
                  
                  {/* Learning Center Section */}
                  <div className="nav-dropdown-section">
                    <h3 className="nav-dropdown-section-title">Learning Center</h3>
                  </div>
                  <Link href="/how-to-quote-painting-jobs-professionally" className="nav-dropdown-item">
                    <BookOpen className="nav-dropdown-icon nav-icon-indigo" />
                    <div className="nav-dropdown-content">
                      <span className="nav-dropdown-title">Quoting Guide</span>
                      <span className="nav-dropdown-description">Expert strategies for winning bids</span>
                    </div>
                  </Link>
                  <Link href="/painting-contractor-software-case-study" className="nav-dropdown-item">
                    <Award className="nav-dropdown-icon nav-icon-emerald" />
                    <div className="nav-dropdown-content">
                      <span className="nav-dropdown-title">Success Stories</span>
                      <span className="nav-dropdown-description">Real contractors, real results</span>
                    </div>
                  </Link>
                  <Link href="/blog" className="nav-dropdown-item">
                    <FileText className="nav-dropdown-icon nav-icon-gray" />
                    <div className="nav-dropdown-content">
                      <span className="nav-dropdown-title">Blog</span>
                      <span className="nav-dropdown-description">Industry tips & insights</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              href="/pricing" 
              className={`${isActive('/pricing') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Pricing
            </Link>
            
            {/* Company Dropdown */}
            <div 
              className="nav-main-item"
              onMouseEnter={() => setIsCompanyOpen(true)}
              onMouseLeave={() => setIsCompanyOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                Company
                <ChevronDown className="nav-chevron w-4 h-4" />
              </button>
              
              {isCompanyOpen && (
                <div className="nav-dropdown show">
                  <Link href="/about" className="nav-dropdown-item">
                    <Building2 className="nav-dropdown-icon nav-icon-blue" />
                    <div className="nav-dropdown-content">
                      <span className="nav-dropdown-title">About Us</span>
                      <span className="nav-dropdown-description">Our mission & story</span>
                    </div>
                  </Link>
                  <Link href="/careers" className="nav-dropdown-item">
                    <Briefcase className="nav-dropdown-icon nav-icon-green" />
                    <div className="nav-dropdown-content">
                      <span className="nav-dropdown-title">Careers</span>
                      <span className="nav-dropdown-description">Join our growing team</span>
                    </div>
                  </Link>
                  <Link href="/contact" className="nav-dropdown-item">
                    <Users className="nav-dropdown-icon nav-icon-purple" />
                    <div className="nav-dropdown-content">
                      <span className="nav-dropdown-title">Contact</span>
                      <span className="nav-dropdown-description">Get in touch with sales</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            <Link 
              href="/access-code" 
              className="nav-cta-secondary"
            >
              Sign In
            </Link>
            <Button asChild className="nav-cta-primary bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              <Link href="/trial-signup">Start Free Trial</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
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
          <div className="lg:hidden mt-4 pb-4 border-t">
            <nav className="flex flex-col space-y-4 pt-4">
              {/* Mobile Product Section */}
              <div className="space-y-2">
                <button
                  onClick={() => setIsProductOpen(!isProductOpen)}
                  className="flex items-center justify-between w-full text-gray-600 hover:text-gray-900 py-2"
                >
                  Product
                  <ChevronDown className={`w-4 h-4 transition-transform ${isProductOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isProductOpen && (
                  <div className="pl-4 space-y-2 border-l-2 border-gray-100">
                    <Link 
                      href="/features" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Features
                    </Link>
                    <Link 
                      href="/demo" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Watch Demo
                    </Link>
                    <Link 
                      href="/integrations" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Integrations
                    </Link>
                    <Link 
                      href="/security" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Security
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Mobile Solutions Section */}
              <div className="space-y-2">
                <button
                  onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
                  className="flex items-center justify-between w-full text-gray-600 hover:text-gray-900 py-2"
                >
                  Solutions
                  <ChevronDown className={`w-4 h-4 transition-transform ${isSolutionsOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isSolutionsOpen && (
                  <div className="pl-4 space-y-2 border-l-2 border-gray-100">
                    <Link 
                      href="/painting-contractors" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      For Contractors
                    </Link>
                    <Link 
                      href="/enterprise" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Enterprise
                    </Link>
                    <Link 
                      href="/commercial-painting-estimating" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Commercial
                    </Link>
                    <Link 
                      href="/locations" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      By Location
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Mobile Resources Section */}
              <div className="space-y-2">
                <button
                  onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                  className="flex items-center justify-between w-full text-gray-600 hover:text-gray-900 py-2"
                >
                  Resources
                  <ChevronDown className={`w-4 h-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isResourcesOpen && (
                  <div className="pl-4 space-y-2 border-l-2 border-gray-100">
                    <Link 
                      href="/painting-estimate-calculator-free" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Quote Calculator
                    </Link>
                    <Link 
                      href="/paint-estimate-templates" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Quote Templates
                    </Link>
                    <Link 
                      href="/roi-calculator" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      ROI Calculator
                    </Link>
                    <Link 
                      href="/how-to-quote-painting-jobs-professionally" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Quoting Guide
                    </Link>
                    <Link 
                      href="/painting-contractor-software-case-study" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Success Stories
                    </Link>
                    <Link 
                      href="/blog" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Blog
                    </Link>
                  </div>
                )}
              </div>
              
              <Link 
                href="/pricing" 
                className={`${isActive('/pricing') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'} py-2`}
                onClick={closeMobileMenu}
              >
                Pricing
              </Link>
              
              {/* Mobile Company Section */}
              <div className="space-y-2">
                <button
                  onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                  className="flex items-center justify-between w-full text-gray-600 hover:text-gray-900 py-2"
                >
                  Company
                  <ChevronDown className={`w-4 h-4 transition-transform ${isCompanyOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCompanyOpen && (
                  <div className="pl-4 space-y-2 border-l-2 border-gray-100">
                    <Link 
                      href="/about" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      About Us
                    </Link>
                    <Link 
                      href="/careers" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Careers
                    </Link>
                    <Link 
                      href="/contact" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Contact
                    </Link>
                  </div>
                )}
              </div>
              <Link 
                href="/access-code" 
                className="text-gray-600 hover:text-gray-900 py-2"
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>
              <Button asChild className="mt-4">
                <Link href="/trial-signup" onClick={closeMobileMenu}>Start Free Trial</Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}