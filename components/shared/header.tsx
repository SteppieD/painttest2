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
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsResourcesOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#ef2b70] to-[#ff6b9d] group-hover:shadow-lg transition-all duration-200">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              ProPaint Quote
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              href="/features" 
              className={`${isActive('/features') ? 'text-[#ef2b70] font-medium' : 'text-gray-700 hover:text-[#ef2b70]'} transition-colors duration-200 text-sm font-medium`}
            >
              Features
            </Link>
            <Link 
              href="/painting-contractors" 
              className={`${isActive('/painting-contractors') ? 'text-[#ef2b70] font-medium' : 'text-gray-700 hover:text-[#ef2b70]'} transition-colors duration-200 text-sm font-medium`}
            >
              For Contractors
            </Link>
            <Link 
              href="/locations" 
              className={`${isActive('/locations') || pathname.startsWith('/locations/') ? 'text-[#ef2b70] font-medium' : 'text-gray-700 hover:text-[#ef2b70]'} transition-colors duration-200 text-sm font-medium`}
            >
              Locations
            </Link>
            
            {/* Resources Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsResourcesOpen(true)}
              onMouseLeave={() => setIsResourcesOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-700 hover:text-[#ef2b70] transition-colors duration-200 text-sm font-medium">
                Resources
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isResourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isResourcesOpen && (
                <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 backdrop-blur-sm">
                  <Link href="/painting-estimate-calculator" className="flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 group">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 group-hover:shadow-md transition-all duration-200">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-[#ef2b70] transition-colors duration-200">Free Calculator</div>
                      <div className="text-xs text-gray-500">Instant paint estimates</div>
                    </div>
                  </Link>
                  <Link href="/paint-estimate-templates" className="flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 group">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 group-hover:shadow-md transition-all duration-200">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-[#ef2b70] transition-colors duration-200">Quote Templates</div>
                      <div className="text-xs text-gray-500">Professional templates</div>
                    </div>
                  </Link>
                  <Link href="/interior-painting-quote-calculator" className="flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 group">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 group-hover:shadow-md transition-all duration-200">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-[#ef2b70] transition-colors duration-200">Interior Calculator</div>
                      <div className="text-xs text-gray-500">Room-by-room quotes</div>
                    </div>
                  </Link>
                  <Link href="/exterior-painting-estimate-calculator" className="flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 group">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 group-hover:shadow-md transition-all duration-200">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-[#ef2b70] transition-colors duration-200">Exterior Calculator</div>
                      <div className="text-xs text-gray-500">House exterior estimates</div>
                    </div>
                  </Link>
                  <Link href="/house-painting-cost-calculator" className="flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 group">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 group-hover:shadow-md transition-all duration-200">
                      <Calculator className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-[#ef2b70] transition-colors duration-200">House Cost Calculator</div>
                      <div className="text-xs text-gray-500">Complete house pricing</div>
                    </div>
                  </Link>
                  <Link href="/paint-contractor-app" className="flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 group">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 group-hover:shadow-md transition-all duration-200">
                      <Smartphone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-[#ef2b70] transition-colors duration-200">Contractor App</div>
                      <div className="text-xs text-gray-500">Mobile painting quotes</div>
                    </div>
                  </Link>
                  <Link href="/how-to-quote-painting-jobs-professionally" className="flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 group">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 group-hover:shadow-md transition-all duration-200">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-[#ef2b70] transition-colors duration-200">Quoting Guide</div>
                      <div className="text-xs text-gray-500">Expert strategies</div>
                    </div>
                  </Link>
                  <Link href="/painting-estimate-calculator-free" className="flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 group">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 group-hover:shadow-md transition-all duration-200">
                      <Smartphone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-[#ef2b70] transition-colors duration-200">Mobile App</div>
                      <div className="text-xs text-gray-500">Quote on-site</div>
                    </div>
                  </Link>
                  <Link href="/painting-contractor-software-case-study" className="flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 group">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 group-hover:shadow-md transition-all duration-200">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-[#ef2b70] transition-colors duration-200">Case Studies</div>
                      <div className="text-xs text-gray-500">Real success stories</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              href="/pricing" 
              className={`${isActive('/pricing') ? 'text-[#ef2b70] font-medium' : 'text-gray-700 hover:text-[#ef2b70]'} transition-colors duration-200 text-sm font-medium`}
            >
              Pricing
            </Link>
            <Link 
              href="/about" 
              className={`${isActive('/about') ? 'text-[#ef2b70] font-medium' : 'text-gray-700 hover:text-[#ef2b70]'} transition-colors duration-200 text-sm font-medium`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`${isActive('/contact') ? 'text-[#ef2b70] font-medium' : 'text-gray-700 hover:text-[#ef2b70]'} transition-colors duration-200 text-sm font-medium`}
            >
              Contact
            </Link>
            <Link 
              href="/access-code" 
              className="text-gray-600 hover:text-[#ef2b70] transition-colors duration-200 text-sm font-medium"
            >
              Sign In
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/trial-signup" className="px-6 py-2.5 bg-gradient-to-r from-[#ef2b70] to-[#ff6b9d] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 border-0">
                Start Free Trial
              </Link>
            </div>
          </nav>

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
                href="/features" 
                className={`${isActive('/features') ? 'text-[#ef2b70] font-semibold' : 'text-gray-700 hover:text-[#ef2b70]'} py-3 px-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 font-medium`}
                onClick={closeMobileMenu}
              >
                Features
              </Link>
              <Link 
                href="/painting-contractors" 
                className={`${isActive('/painting-contractors') ? 'text-[#ef2b70] font-semibold' : 'text-gray-700 hover:text-[#ef2b70]'} py-3 px-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 font-medium`}
                onClick={closeMobileMenu}
              >
                For Contractors
              </Link>
              <Link 
                href="/locations" 
                className={`${isActive('/locations') || pathname.startsWith('/locations/') ? 'text-[#ef2b70] font-semibold' : 'text-gray-700 hover:text-[#ef2b70]'} py-3 px-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 font-medium`}
                onClick={closeMobileMenu}
              >
                Locations
              </Link>
              
              {/* Mobile Resources Section */}
              <div className="space-y-2">
                <button
                  onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                  className="flex items-center justify-between w-full text-gray-700 hover:text-[#ef2b70] py-3 px-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 font-medium"
                >
                  Resources
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isResourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isResourcesOpen && (
                  <div className="pl-4 space-y-1 border-l-2 border-pink-100">
                    <Link 
                      href="/painting-estimate-calculator" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Free Calculator
                    </Link>
                    <Link 
                      href="/paint-estimate-templates" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Quote Templates
                    </Link>
                    <Link 
                      href="/interior-painting-quote-calculator" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Interior Calculator
                    </Link>
                    <Link 
                      href="/exterior-painting-estimate-calculator" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Exterior Calculator
                    </Link>
                    <Link 
                      href="/house-painting-cost-calculator" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      House Cost Calculator
                    </Link>
                    <Link 
                      href="/paint-contractor-app" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Contractor App
                    </Link>
                    <Link 
                      href="/how-to-quote-painting-jobs-professionally" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Quoting Guide
                    </Link>
                    <Link 
                      href="/painting-estimate-calculator-free" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Mobile App
                    </Link>
                    <Link 
                      href="/painting-contractor-software-case-study" 
                      className="block text-gray-600 hover:text-[#ef2b70] py-2 px-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200"
                      onClick={closeMobileMenu}
                    >
                      Case Studies
                    </Link>
                  </div>
                )}
              </div>
              
              <Link 
                href="/pricing" 
                className={`${isActive('/pricing') ? 'text-[#ef2b70] font-semibold' : 'text-gray-700 hover:text-[#ef2b70]'} py-3 px-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 font-medium`}
                onClick={closeMobileMenu}
              >
                Pricing
              </Link>
              <Link 
                href="/about" 
                className={`${isActive('/about') ? 'text-[#ef2b70] font-semibold' : 'text-gray-700 hover:text-[#ef2b70]'} py-3 px-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 font-medium`}
                onClick={closeMobileMenu}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className={`${isActive('/contact') ? 'text-[#ef2b70] font-semibold' : 'text-gray-700 hover:text-[#ef2b70]'} py-3 px-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 font-medium`}
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
              <Link 
                href="/access-code" 
                className="text-gray-600 hover:text-[#ef2b70] py-3 px-2 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 font-medium"
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>
              <div className="pt-4">
                <Link 
                  href="/trial-signup" 
                  onClick={closeMobileMenu}
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-[#ef2b70] to-[#ff6b9d] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  Start Free Trial
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}