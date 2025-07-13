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
    <header className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">ProPaint Quote</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Features */}
          <Link 
            href="/features" 
            className={`text-gray-600 hover:text-gray-900 font-medium ${
              isActive('/features') ? 'text-gray-900' : ''
            }`}
          >
            Features
          </Link>

          {/* Solutions Dropdown */}
          <div 
           
            onMouseEnter={() => setActiveDropdown('solutions')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button>
              Solutions
              <ChevronDown />
            </button>
            
            {activeDropdown === 'solutions' && (
              <div>
                <Link href="/painting-contractors">
                  <Users />
                  <div>
                    <div>For Contractors</div>
                    <div>Tailored for painting businesses</div>
                  </div>
                </Link>
                <Link href="/enterprise">
                  <Building2 />
                  <div>
                    <div>Enterprise</div>
                    <div>Solutions for large teams</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Resources Dropdown */}
          <div 
           
            onMouseEnter={() => setActiveDropdown('resources')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button>
              Resources
              <ChevronDown />
            </button>
            
            {activeDropdown === 'resources' && (
              <div>
                <Link href="/painting-estimate-calculator-free">
                  <Calculator />
                  <div>
                    <div>Quote Calculator</div>
                    <div>Free estimation tool</div>
                  </div>
                </Link>
                <Link href="/painting-quote-templates-free">
                  <FileText />
                  <div>
                    <div>Quote Templates</div>
                    <div>Professional templates</div>
                  </div>
                </Link>
                <Link href="/how-to-quote-painting-jobs-professionally">
                  <BookOpen />
                  <div>
                    <div>Quoting Guide</div>
                    <div>Expert strategies</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link 
            href="/pricing" 
            className={`text-gray-600 hover:text-gray-900 font-medium ${
              isActive('/pricing') ? 'text-gray-900' : ''
            }`}
          >
            Pricing
          </Link>

          <Link 
            href="/about" 
            className={`text-gray-600 hover:text-gray-900 font-medium ${
              isActive('/about') ? 'text-gray-900' : ''
            }`}
          >
            About
          </Link>
        </nav>

        {/* Desktop CTA Buttons */}
        <div>
          {/* Show quota counter if logged in */}
          {companyId && (
            <QuotaCounter 
              companyId={companyId} 
              variant="header" 
              showUpgrade={true}
             
            />
          )}
          
          {companyId ? (
            <Link href="/dashboard">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/access-code">
                Sign In
              </Link>
              <Link href="/trial-signup">
                Start Free Trial
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X />
          ) : (
            <Menu />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <nav className="pt-4 pb-2 space-y-2">
          <Link 
            href="/features" 
           
            onClick={toggleMobileMenu}
          >
            Features
          </Link>
          
          <div>
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'mobile-solutions' ? null : 'mobile-solutions')}
              className="flex items-center justify-between w-full px-3 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Solutions
              <ChevronDown className={`w-4 h-4 transition-transform ${
                activeDropdown === 'mobile-solutions' ? 'rotate-180' : ''
              }`} />
            </button>
            {activeDropdown === 'mobile-solutions' && (
              <div>
                <Link href="/painting-contractors" onClick={toggleMobileMenu}>
                  For Contractors
                </Link>
                <Link href="/enterprise" onClick={toggleMobileMenu}>
                  Enterprise
                </Link>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'mobile-resources' ? null : 'mobile-resources')}
              className="flex items-center justify-between w-full px-3 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Resources
              <ChevronDown className={`w-4 h-4 transition-transform ${
                activeDropdown === 'mobile-resources' ? 'rotate-180' : ''
              }`} />
            </button>
            {activeDropdown === 'mobile-resources' && (
              <div>
                <Link href="/painting-estimate-calculator-free" onClick={toggleMobileMenu}>
                  Quote Calculator
                </Link>
                <Link href="/painting-quote-templates-free" onClick={toggleMobileMenu}>
                  Quote Templates
                </Link>
                <Link href="/how-to-quote-painting-jobs-professionally" onClick={toggleMobileMenu}>
                  Quoting Guide
                </Link>
              </div>
            )}
          </div>

          <Link href="/pricing" onClick={toggleMobileMenu}>
            Pricing
          </Link>
          
          <Link href="/about" onClick={toggleMobileMenu}>
            About
          </Link>

          {/* Mobile CTA Buttons */}
          <div>
            {companyId ? (
              <Link href="/dashboard" onClick={toggleMobileMenu}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/access-code" onClick={toggleMobileMenu}>
                  Sign In
                </Link>
                <Link href="/trial-signup" onClick={toggleMobileMenu}>
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