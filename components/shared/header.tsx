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
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/paint-quote-logo.png" 
              alt="Paint Quote App" 
              className="w-8 h-8"
            />
            <span className="text-2xl font-bold text-gray-900">Paint Quote App</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {/* Product Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsProductOpen(true)}
              onMouseLeave={() => setIsProductOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                Product
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isProductOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <Link href="/features" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Features</div>
                      <div className="text-sm text-gray-500">Everything included</div>
                    </div>
                  </Link>
                  <Link href="/demo" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Watch Demo</div>
                      <div className="text-sm text-gray-500">See it in action</div>
                    </div>
                  </Link>
                  <Link href="/integrations" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">Integrations</div>
                      <div className="text-sm text-gray-500">Connect your tools</div>
                    </div>
                  </Link>
                  <Link href="/security" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">Security</div>
                      <div className="text-sm text-gray-500">Enterprise-grade</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsSolutionsOpen(true)}
              onMouseLeave={() => setIsSolutionsOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                Solutions
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isSolutionsOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <Link href="/painting-contractors" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">For Contractors</div>
                      <div className="text-sm text-gray-500">Painting businesses</div>
                    </div>
                  </Link>
                  <Link href="/enterprise" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">Enterprise</div>
                      <div className="text-sm text-gray-500">Large teams</div>
                    </div>
                  </Link>
                  <Link href="/commercial-painting-estimating" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <Briefcase className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Commercial</div>
                      <div className="text-sm text-gray-500">Large projects</div>
                    </div>
                  </Link>
                  <Link href="/locations" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="font-medium text-gray-900">By Location</div>
                      <div className="text-sm text-gray-500">Find local contractors</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Resources Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsResourcesOpen(true)}
              onMouseLeave={() => setIsResourcesOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                Resources
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isResourcesOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg border py-2 z-50">
                  {/* Free Tools Section */}
                  <div className="px-4 py-2 border-b">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Free Tools</h3>
                  </div>
                  <Link href="/painting-estimate-calculator-free" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Quote Calculator</div>
                      <div className="text-sm text-gray-500">Instant estimates</div>
                    </div>
                  </Link>
                  <Link href="/paint-estimate-templates" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Quote Templates</div>
                      <div className="text-sm text-gray-500">Professional formats</div>
                    </div>
                  </Link>
                  <Link href="/roi-calculator" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">ROI Calculator</div>
                      <div className="text-sm text-gray-500">See your savings</div>
                    </div>
                  </Link>
                  
                  {/* Learning Center Section */}
                  <div className="px-4 py-2 border-b border-t mt-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Learning Center</h3>
                  </div>
                  <Link href="/how-to-quote-painting-jobs-professionally" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    <div>
                      <div className="font-medium text-gray-900">Quoting Guide</div>
                      <div className="text-sm text-gray-500">Expert strategies</div>
                    </div>
                  </Link>
                  <Link href="/painting-contractor-software-case-study" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="font-medium text-gray-900">Success Stories</div>
                      <div className="text-sm text-gray-500">Real results</div>
                    </div>
                  </Link>
                  <Link href="/blog" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">Blog</div>
                      <div className="text-sm text-gray-500">Tips & insights</div>
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
              className="relative"
              onMouseEnter={() => setIsCompanyOpen(true)}
              onMouseLeave={() => setIsCompanyOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                Company
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isCompanyOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <Link href="/about" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">About Us</div>
                      <div className="text-sm text-gray-500">Our story</div>
                    </div>
                  </Link>
                  <Link href="/careers" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <Briefcase className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Careers</div>
                      <div className="text-sm text-gray-500">Join our team</div>
                    </div>
                  </Link>
                  <Link href="/contact" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <Users className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">Contact</div>
                      <div className="text-sm text-gray-500">Get in touch</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            <Link 
              href="/access-code" 
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              Sign In
            </Link>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
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