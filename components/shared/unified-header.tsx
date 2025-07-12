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
    <header>
      <div>
        {/* Logo */}
        <Link href="/">
          <div>
            <Palette />
          </div>
          <span>ProPaint Quote</span>
        </Link>

        {/* Desktop Navigation */}
        <nav>
          {/* Features */}
          <Link 
            href="/features" 
           `}
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
           `}
          >
            Pricing
          </Link>

          <Link 
            href="/about" 
           `}
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
      <div`}>
        <nav>
          <Link 
            href="/features" 
           
            onClick={toggleMobileMenu}
          >
            Features
          </Link>
          
          <div>
            <button
              onClick={() => setActiveDropdown(activeDropdown === 'mobile-solutions' ? null : 'mobile-solutions')}
             
            >
              Solutions
              <ChevronDown`} />
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
             
            >
              Resources
              <ChevronDown`} />
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