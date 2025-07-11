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
  Zap,
  Users,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function UnifiedHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const pathname = usePathname();
  
  // Debug logging
  useEffect(() => {
    console.log('UnifiedHeader mounted');
  }, []);

  // Get company ID from storage
  useEffect(() => {
    const storedCompanyId = sessionStorage.getItem('companyId');
    if (storedCompanyId) {
      setCompanyId(storedCompanyId);
    } else {
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

  const isActive = (path: string) => pathname === path;

  return (
    <header className="unified-header">
      <div className="unified-nav">
        {/* Logo */}
        <Link href="/" className="unified-logo">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <span>ProPaint Quote</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="unified-nav-links">
          {/* Features */}
          <Link 
            href="/features" 
            className={`unified-nav-link ${isActive('/features') ? 'active' : ''}`}
          >
            Features
          </Link>

          {/* Solutions Dropdown */}
          <div 
            className="unified-dropdown"
            onMouseEnter={() => setActiveDropdown('solutions')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="unified-nav-link flex items-center gap-1">
              Solutions
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {activeDropdown === 'solutions' && (
              <div className="unified-dropdown-menu">
                <Link href="/painting-contractors" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">For Contractors</div>
                    <div className="text-sm text-gray-600">Tailored for painting businesses</div>
                  </div>
                </Link>
                <Link href="/enterprise" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <Building2 className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Enterprise</div>
                    <div className="text-sm text-gray-600">Solutions for large teams</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Resources Dropdown */}
          <div 
            className="unified-dropdown"
            onMouseEnter={() => setActiveDropdown('resources')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="unified-nav-link flex items-center gap-1">
              Resources
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {activeDropdown === 'resources' && (
              <div className="unified-dropdown-menu">
                <Link href="/painting-estimate-calculator-free" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <Calculator className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Quote Calculator</div>
                    <div className="text-sm text-gray-600">Free estimation tool</div>
                  </div>
                </Link>
                <Link href="/painting-quote-templates-free" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <FileText className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Quote Templates</div>
                    <div className="text-sm text-gray-600">Professional templates</div>
                  </div>
                </Link>
                <Link href="/how-to-quote-painting-jobs-professionally" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <BookOpen className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Quoting Guide</div>
                    <div className="text-sm text-gray-600">Expert strategies</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link 
            href="/pricing" 
            className={`unified-nav-link ${isActive('/pricing') ? 'active' : ''}`}
          >
            Pricing
          </Link>

          <Link 
            href="/about" 
            className={`unified-nav-link ${isActive('/about') ? 'active' : ''}`}
          >
            About
          </Link>
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Show quota counter if logged in */}
          {companyId && (
            <QuotaCounter 
              companyId={companyId} 
              variant="header" 
              showUpgrade={true}
              className="mr-3"
            />
          )}
          
          {companyId ? (
            <Link href="/dashboard" className="unified-btn unified-btn-ghost">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/access-code" className="unified-btn unified-btn-ghost">
                Sign In
              </Link>
              <Link href="/trial-signup" className="unified-btn unified-btn-primary">
                Start Free Trial
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="unified-mobile-toggle lg:hidden"
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
      <div className={`unified-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="space-y-4">
          <Link 
            href="/features" 
            className="block py-2 text-gray-700 font-medium"
            onClick={toggleMobileMenu}
          >
            Features
          </Link>
          
          <div>
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'mobile-solutions' ? null : 'mobile-solutions')}
              className="flex items-center justify-between w-full py-2 text-gray-700 font-medium"
            >
              Solutions
              <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'mobile-solutions' ? 'rotate-180' : ''}`} />
            </button>
            {activeDropdown === 'mobile-solutions' && (
              <div className="mt-2 pl-4 space-y-2">
                <Link href="/painting-contractors" className="block py-2 text-gray-600" onClick={toggleMobileMenu}>
                  For Contractors
                </Link>
                <Link href="/enterprise" className="block py-2 text-gray-600" onClick={toggleMobileMenu}>
                  Enterprise
                </Link>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'mobile-resources' ? null : 'mobile-resources')}
              className="flex items-center justify-between w-full py-2 text-gray-700 font-medium"
            >
              Resources
              <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'mobile-resources' ? 'rotate-180' : ''}`} />
            </button>
            {activeDropdown === 'mobile-resources' && (
              <div className="mt-2 pl-4 space-y-2">
                <Link href="/painting-estimate-calculator-free" className="block py-2 text-gray-600" onClick={toggleMobileMenu}>
                  Quote Calculator
                </Link>
                <Link href="/painting-quote-templates-free" className="block py-2 text-gray-600" onClick={toggleMobileMenu}>
                  Quote Templates
                </Link>
                <Link href="/how-to-quote-painting-jobs-professionally" className="block py-2 text-gray-600" onClick={toggleMobileMenu}>
                  Quoting Guide
                </Link>
              </div>
            )}
          </div>

          <Link href="/pricing" className="block py-2 text-gray-700 font-medium" onClick={toggleMobileMenu}>
            Pricing
          </Link>
          
          <Link href="/about" className="block py-2 text-gray-700 font-medium" onClick={toggleMobileMenu}>
            About
          </Link>

          {/* Mobile CTA Buttons */}
          <div className="pt-4 space-y-3">
            {companyId ? (
              <Link href="/dashboard" className="unified-btn unified-btn-ghost w-full" onClick={toggleMobileMenu}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/access-code" className="unified-btn unified-btn-ghost w-full" onClick={toggleMobileMenu}>
                  Sign In
                </Link>
                <Link href="/trial-signup" className="unified-btn unified-btn-primary w-full" onClick={toggleMobileMenu}>
                  Start Free Trial
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}