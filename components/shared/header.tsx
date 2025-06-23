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
    <header className="neomorphism-nav border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 neomorphism-interactive px-4 py-2 rounded-2xl">
            <div className="neomorphism-flat p-2 rounded-xl">
              <Palette className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900 neomorphism-text">ProPaint Quote</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4">
            <Link 
              href="/features" 
              className={`neomorphism-button px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive('/features') 
                  ? 'neomorphism-button-primary' 
                  : 'text-gray-700 hover:neomorphism-blue'
              }`}
            >
              Features
            </Link>
            
            {/* Resources Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsResourcesOpen(true)}
              onMouseLeave={() => setIsResourcesOpen(false)}
            >
              <button className="neomorphism-button px-4 py-2 rounded-xl flex items-center gap-2 text-gray-700 hover:neomorphism-blue transition-all duration-200">
                Resources
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isResourcesOpen && (
                <div className="neomorphism-modal absolute top-full left-0 mt-3 w-64 py-3 z-50 border-0">
                  <Link href="/painting-estimate-calculator" className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl hover:neomorphism-subtle transition-all duration-200">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Free Calculator</div>
                      <div className="text-sm text-gray-500">Instant paint estimates</div>
                    </div>
                  </Link>
                  <Link href="/painting-quote-templates" className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl hover:neomorphism-subtle transition-all duration-200">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Quote Templates</div>
                      <div className="text-sm text-gray-500">Professional templates</div>
                    </div>
                  </Link>
                  <Link href="/how-to-quote-painting-jobs-professionally" className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl hover:neomorphism-subtle transition-all duration-200">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">Quoting Guide</div>
                      <div className="text-sm text-gray-500">Expert strategies</div>
                    </div>
                  </Link>
                  <Link href="/painting-estimate-calculator-free" className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl hover:neomorphism-subtle transition-all duration-200">
                    <Smartphone className="w-5 h-5 text-indigo-600" />
                    <div>
                      <div className="font-medium text-gray-900">Mobile App</div>
                      <div className="text-sm text-gray-500">Quote on-site</div>
                    </div>
                  </Link>
                  <Link href="/painting-contractor-software-case-study" className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl hover:neomorphism-subtle transition-all duration-200">
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
              className={`neomorphism-button px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive('/pricing') 
                  ? 'neomorphism-button-primary' 
                  : 'text-gray-700 hover:neomorphism-blue'
              }`}
            >
              Pricing
            </Link>
            <Link 
              href="/about" 
              className={`neomorphism-button px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive('/about') 
                  ? 'neomorphism-button-primary' 
                  : 'text-gray-700 hover:neomorphism-blue'
              }`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`neomorphism-button px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive('/contact') 
                  ? 'neomorphism-button-primary' 
                  : 'text-gray-700 hover:neomorphism-blue'
              }`}
            >
              Contact
            </Link>
            <Link 
              href="/access-code" 
              className="neomorphism-button px-4 py-2 rounded-xl text-gray-700 hover:neomorphism-green transition-all duration-200"
            >
              Sign In
            </Link>
            <Link href="/trial-signup" className="neomorphism-button-primary px-6 py-3 rounded-2xl font-semibold hover:scale-105 transition-all duration-200">
              Start Free Trial
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden neomorphism-button p-3 text-gray-700 hover:neomorphism-blue focus:outline-none rounded-xl transition-all duration-200"
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
                      href="/painting-quote-templates" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Quote Templates
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