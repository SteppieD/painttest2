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
            <Link 
              href="/features" 
              className={`${isActive('/features') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Features
            </Link>
            <Link 
              href="/painting-contractors" 
              className={`${isActive('/painting-contractors') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              For Contractors
            </Link>
            <Link 
              href="/locations" 
              className={`${isActive('/locations') || pathname.startsWith('/locations/') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Locations
            </Link>
            
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
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <Link href="/painting-estimate-calculator" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Free Calculator</div>
                      <div className="text-sm text-gray-500">Instant paint estimates</div>
                    </div>
                  </Link>
                  <Link href="/paint-estimate-templates" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Quote Templates</div>
                      <div className="text-sm text-gray-500">Professional templates</div>
                    </div>
                  </Link>
                  <Link href="/interior-painting-quote-calculator" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Interior Calculator</div>
                      <div className="text-sm text-gray-500">Room-by-room quotes</div>
                    </div>
                  </Link>
                  <Link href="/exterior-painting-estimate-calculator" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <Calculator className="w-5 h-5 text-emerald-600" />
                    <div>
                      <div className="font-medium text-gray-900">Exterior Calculator</div>
                      <div className="text-sm text-gray-500">House exterior estimates</div>
                    </div>
                  </Link>
                  <Link href="/house-painting-cost-calculator" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <Calculator className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium text-gray-900">House Cost Calculator</div>
                      <div className="text-sm text-gray-500">Complete house pricing</div>
                    </div>
                  </Link>
                  <Link href="/paint-contractor-app" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <Smartphone className="w-5 h-5 text-violet-600" />
                    <div>
                      <div className="font-medium text-gray-900">Contractor App</div>
                      <div className="text-sm text-gray-500">Mobile painting quotes</div>
                    </div>
                  </Link>
                  <Link href="/how-to-quote-painting-jobs-professionally" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">Quoting Guide</div>
                      <div className="text-sm text-gray-500">Expert strategies</div>
                    </div>
                  </Link>
                  <Link href="/painting-estimate-calculator-free" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <Smartphone className="w-5 h-5 text-indigo-600" />
                    <div>
                      <div className="font-medium text-gray-900">Mobile App</div>
                      <div className="text-sm text-gray-500">Quote on-site</div>
                    </div>
                  </Link>
                  <Link href="/painting-contractor-software-case-study" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
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
              className={`${isActive('/pricing') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Pricing
            </Link>
            <Link 
              href="/about" 
              className={`${isActive('/about') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`${isActive('/contact') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Contact
            </Link>
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
              <Link 
                href="/features" 
                className={`${isActive('/features') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'} py-2`}
                onClick={closeMobileMenu}
              >
                Features
              </Link>
              <Link 
                href="/painting-contractors" 
                className={`${isActive('/painting-contractors') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'} py-2`}
                onClick={closeMobileMenu}
              >
                For Contractors
              </Link>
              <Link 
                href="/locations" 
                className={`${isActive('/locations') || pathname.startsWith('/locations/') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'} py-2`}
                onClick={closeMobileMenu}
              >
                Locations
              </Link>
              
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
                      href="/painting-estimate-calculator" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Free Calculator
                    </Link>
                    <Link 
                      href="/paint-estimate-templates" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Quote Templates
                    </Link>
                    <Link 
                      href="/interior-painting-quote-calculator" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Interior Calculator
                    </Link>
                    <Link 
                      href="/exterior-painting-estimate-calculator" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Exterior Calculator
                    </Link>
                    <Link 
                      href="/house-painting-cost-calculator" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      House Cost Calculator
                    </Link>
                    <Link 
                      href="/paint-contractor-app" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Contractor App
                    </Link>
                    <Link 
                      href="/how-to-quote-painting-jobs-professionally" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Quoting Guide
                    </Link>
                    <Link 
                      href="/painting-estimate-calculator-free" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Mobile App
                    </Link>
                    <Link 
                      href="/painting-contractor-software-case-study" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Case Studies
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
              <Link 
                href="/about" 
                className={`${isActive('/about') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'} py-2`}
                onClick={closeMobileMenu}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className={`${isActive('/contact') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'} py-2`}
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
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