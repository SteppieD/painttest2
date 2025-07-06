'use client';

import { useState, useEffect } from 'react';
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
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isUseCasesOpen, setIsUseCasesOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is logged in by looking for company data in localStorage
    const companyData = localStorage.getItem("paintquote_company");
    setIsLoggedIn(!!companyData);
  }, [pathname]); // Re-check on route changes

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsResourcesOpen(false);
    setIsUseCasesOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-8 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#ef2b70] to-[#d91e5a] group-hover:shadow-md transition-all duration-200">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 leading-tight">
                Paint Quote Pro
              </span>
              <span className="text-xs text-gray-500">
                AI Painting Estimates
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-12 flex-1 justify-center">
            <Link 
              href="/" 
              className={`${isActive('/') ? 'text-[#ef2b70]' : 'text-gray-700 hover:text-[#ef2b70]'} transition-colors duration-200 font-medium text-base`}
            >
              Home
            </Link>
            <Link 
              href="/features" 
              className={`${isActive('/features') ? 'text-[#ef2b70]' : 'text-gray-700 hover:text-[#ef2b70]'} transition-colors duration-200 font-medium text-base`}
            >
              Features
            </Link>
            
            {/* Solutions Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsUseCasesOpen(true)}
              onMouseLeave={() => setTimeout(() => setIsUseCasesOpen(false), 100)}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-[#ef2b70] transition-colors duration-200 font-medium text-base">
                Solutions
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUseCasesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Invisible bridge to prevent gap */}
              <div className="absolute top-full left-0 h-4 w-full" />
              
              {isUseCasesOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-3 z-50"
                  onMouseEnter={() => setIsUseCasesOpen(true)}
                  onMouseLeave={() => setIsUseCasesOpen(false)}
                >
                  {/* Use Cases Section */}
                  <div className="px-3 pb-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-1">Use Cases</div>
                    <Link href="/interior-painting-quote-calculator" className="block px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                      <div className="font-medium text-gray-900">Interior Painting</div>
                      <div className="text-sm text-gray-500">Room-by-room estimates</div>
                    </Link>
                    <Link href="/exterior-painting-estimate-calculator" className="block px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                      <div className="font-medium text-gray-900">Exterior Painting</div>
                      <div className="text-sm text-gray-500">House exterior quotes</div>
                    </Link>
                    <Link href="/commercial-painting-estimating-software" className="block px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                      <div className="font-medium text-gray-900">Commercial</div>
                      <div className="text-sm text-gray-500">Large project estimates</div>
                    </Link>
                  </div>
                  
                  <div className="border-t border-gray-100 my-2"></div>
                  
                  {/* Business Solutions Section */}
                  <div className="px-3 pt-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-1">Business Solutions</div>
                    <Link href="/painting-contractors" className="block px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                      <div className="font-medium text-gray-900">For Contractors</div>
                      <div className="text-sm text-gray-500">Professional painting businesses</div>
                    </Link>
                    <Link href="/how-to-scale-painting-business" className="block px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                      <div className="font-medium text-gray-900">Scaling Your Business</div>
                      <div className="text-sm text-gray-500">Growth strategies for painters</div>
                    </Link>
                    <Link href="/painting-business-software" className="block px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                      <div className="font-medium text-gray-900">Business Management</div>
                      <div className="text-sm text-gray-500">Complete business software</div>
                    </Link>
                    <Link href="/painting-estimate-software" className="block px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                      <div className="font-medium text-gray-900">Estimate Software</div>
                      <div className="text-sm text-gray-500">Professional quoting tools</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Resources Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsResourcesOpen(true)}
              onMouseLeave={() => setTimeout(() => setIsResourcesOpen(false), 100)}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-[#ef2b70] transition-colors duration-200 font-medium text-base">
                Resources
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isResourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Invisible bridge to prevent gap */}
              <div className="absolute top-full left-0 h-4 w-full" />
              
              {isResourcesOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-3 z-50"
                  onMouseEnter={() => setIsResourcesOpen(true)}
                  onMouseLeave={() => setIsResourcesOpen(false)}
                >
                  <Link href="/painting-estimate-calculator" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all duration-200">
                    <div>
                      <div className="font-medium text-gray-900">Free Calculator</div>
                      <div className="text-sm text-gray-500">Instant paint estimates</div>
                    </div>
                  </Link>
                  <Link href="/paint-estimate-templates" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all duration-200">
                    <div>
                      <div className="font-medium text-gray-900">Quote Templates</div>
                      <div className="text-sm text-gray-500">Professional templates</div>
                    </div>
                  </Link>
                  <Link href="/interior-painting-quote-calculator" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all duration-200">
                    <div>
                      <div className="font-medium text-gray-900">Interior Calculator</div>
                      <div className="text-sm text-gray-500">Room-by-room quotes</div>
                    </div>
                  </Link>
                  <Link href="/exterior-painting-estimate-calculator" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all duration-200">
                    <div>
                      <div className="font-medium text-gray-900">Exterior Calculator</div>
                      <div className="text-sm text-gray-500">House exterior estimates</div>
                    </div>
                  </Link>
                  <Link href="/house-painting-cost-calculator" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all duration-200">
                    <div>
                      <div className="font-medium text-gray-900">House Cost Calculator</div>
                      <div className="text-sm text-gray-500">Complete house pricing</div>
                    </div>
                  </Link>
                  <Link href="/paint-contractor-app" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all duration-200">
                    <div>
                      <div className="font-medium text-gray-900">Contractor App</div>
                      <div className="text-sm text-gray-500">Mobile painting quotes</div>
                    </div>
                  </Link>
                  <Link href="/how-to-quote-painting-jobs-professionally" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all duration-200">
                    <div>
                      <div className="font-medium text-gray-900">Quoting Guide</div>
                      <div className="text-sm text-gray-500">Expert strategies</div>
                    </div>
                  </Link>
                  <Link href="/painting-estimate-calculator-free" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all duration-200">
                    <div>
                      <div className="font-medium text-gray-900">Mobile App</div>
                      <div className="text-sm text-gray-500">Quote on-site</div>
                    </div>
                  </Link>
                  <Link href="/painting-contractor-software-case-study" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-all duration-200">
                    <div>
                      <div className="font-medium text-gray-900">Case Studies</div>
                      <div className="text-sm text-gray-500">Real success stories</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              href="/pricing" 
              className={`${isActive('/pricing') ? 'text-[#ef2b70]' : 'text-gray-700 hover:text-[#ef2b70]'} transition-colors duration-200 font-medium text-base`}
            >
              Pricing
            </Link>
          </nav>
          
          {/* Right side - Login & CTA */}
          <div className="hidden lg:flex items-center gap-6">
            {isLoggedIn ? (
              <Link 
                href="/dashboard" 
                className="text-gray-700 hover:text-[#ef2b70] transition-colors duration-200 font-medium text-base"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/access-code" 
                  className="text-gray-700 hover:text-[#ef2b70] transition-colors duration-200 font-medium text-base"
                >
                  Login
                </Link>
                <Link href="/trial-signup" className="px-6 py-2.5 bg-[#ef2b70] text-white font-semibold rounded-full hover:bg-[#d91e5a] transition-all duration-200 shadow-sm hover:shadow-md">
                  Try For Free Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-gray-600 hover:text-[#ef2b70] focus:outline-none focus:ring-2 focus:ring-[#ef2b70] focus:ring-offset-2 rounded-xl transition-all duration-200"
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
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-3 pt-4">
              <Link 
                href="/" 
                className={`${isActive('/') ? 'text-[#ef2b70] font-semibold' : 'text-gray-700 hover:text-[#ef2b70]'} py-3 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium`}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link 
                href="/features" 
                className={`${isActive('/features') ? 'text-[#ef2b70] font-semibold' : 'text-gray-700 hover:text-[#ef2b70]'} py-3 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium`}
                onClick={closeMobileMenu}
              >
                Features
              </Link>
              
              {/* Mobile Solutions Section */}
              <div className="space-y-2">
                <button
                  onClick={() => setIsUseCasesOpen(!isUseCasesOpen)}
                  className="flex items-center justify-between w-full text-gray-700 hover:text-[#ef2b70] py-3 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Solutions
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUseCasesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isUseCasesOpen && (
                  <div className="pl-4 space-y-1 border-l-2 border-gray-200">
                    {/* Use Cases */}
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">Use Cases</div>
                    <Link 
                      href="/interior-painting-quote-calculator" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Interior Painting
                    </Link>
                    <Link 
                      href="/exterior-painting-estimate-calculator" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Exterior Painting
                    </Link>
                    <Link 
                      href="/commercial-painting-estimating-software" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Commercial
                    </Link>
                    
                    {/* Business Solutions */}
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1 pt-3">Business Solutions</div>
                    <Link 
                      href="/painting-contractors" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      For Contractors
                    </Link>
                    <Link 
                      href="/how-to-scale-painting-business" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Scaling Your Business
                    </Link>
                    <Link 
                      href="/painting-business-software" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Business Management
                    </Link>
                    <Link 
                      href="/painting-estimate-software" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Estimate Software
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Mobile Resources Section */}
              <div className="space-y-2">
                <button
                  onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                  className="flex items-center justify-between w-full text-gray-700 hover:text-[#ef2b70] py-3 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Resources
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isResourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isResourcesOpen && (
                  <div className="pl-4 space-y-1 border-l-2 border-gray-200">
                    <Link 
                      href="/painting-estimate-calculator" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Free Calculator
                    </Link>
                    <Link 
                      href="/paint-estimate-templates" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Quote Templates
                    </Link>
                    <Link 
                      href="/interior-painting-quote-calculator" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Interior Calculator
                    </Link>
                    <Link 
                      href="/exterior-painting-estimate-calculator" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Exterior Calculator
                    </Link>
                    <Link 
                      href="/house-painting-cost-calculator" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      House Cost Calculator
                    </Link>
                    <Link 
                      href="/paint-contractor-app" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Contractor App
                    </Link>
                    <Link 
                      href="/how-to-quote-painting-jobs-professionally" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Quoting Guide
                    </Link>
                    <Link 
                      href="/painting-estimate-calculator-free" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Mobile App
                    </Link>
                    <Link 
                      href="/painting-contractor-software-case-study" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Case Studies
                    </Link>
                  </div>
                )}
              </div>
              
              <Link 
                href="/pricing" 
                className={`${isActive('/pricing') ? 'text-[#ef2b70] font-semibold' : 'text-gray-700 hover:text-[#ef2b70]'} py-3 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium`}
                onClick={closeMobileMenu}
              >
                Pricing
              </Link>
              {isLoggedIn ? (
                <Link 
                  href="/dashboard" 
                  className="text-gray-600 hover:text-[#ef2b70] py-3 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    href="/access-code" 
                    className="text-gray-600 hover:text-[#ef2b70] py-3 px-2 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                    onClick={closeMobileMenu}
                  >
                    Sign In
                  </Link>
                  <div className="pt-4">
                    <Link 
                      href="/trial-signup" 
                      onClick={closeMobileMenu}
                      className="block w-full text-center px-6 py-3 bg-[#FFE4E9] text-[#ef2b70] font-semibold rounded-lg hover:bg-[#FFD1DA] transition-all duration-200"
                    >
                      Start Free Trial
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}