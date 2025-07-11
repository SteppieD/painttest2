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
    <header>
      <div>
        <div>
          <Link href="/">
            <img 
              src="/paint-logo-transparent.png" 
              alt="Paint Quote App - Professional painting estimate software for contractors" 
             
             
             
            />
            <span>Paint Quote App</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav>
            {/* Product Dropdown */}
            <div 
             
              onMouseEnter={() => setIsProductOpen(true)}
              onMouseLeave={() => setIsProductOpen(false)}
            >
              <button>
                Product
                <ChevronDown />
              </button>
              
              {isProductOpen && (
                <div>
                  <Link href="/features">
                    <Zap />
                    <div>
                      <span>Features</span>
                      <span>Everything included in our platform</span>
                    </div>
                  </Link>
                  <Link href="/demo">
                    <BarChart3 />
                    <div>
                      <span>Watch Demo</span>
                      <span>See Paint Quote App in action</span>
                    </div>
                  </Link>
                  <Link href="/integrations">
                    <Shield />
                    <div>
                      <span>Integrations</span>
                      <span>Connect with QuickBooks, Stripe & more</span>
                    </div>
                  </Link>
                  <Link href="/security">
                    <Shield />
                    <div>
                      <span>Security</span>
                      <span>Enterprise-grade protection</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div 
             
              onMouseEnter={() => setIsSolutionsOpen(true)}
              onMouseLeave={() => setIsSolutionsOpen(false)}
            >
              <button>
                Solutions
                <ChevronDown />
              </button>
              
              {isSolutionsOpen && (
                <div>
                  <Link href="/painting-contractors">
                    <Users />
                    <div>
                      <span>For Contractors</span>
                      <span>Tailored for painting businesses</span>
                    </div>
                  </Link>
                  <Link href="/enterprise">
                    <Building2 />
                    <div>
                      <span>Enterprise</span>
                      <span>Solutions for large teams</span>
                    </div>
                  </Link>
                  <Link href="/commercial-painting-estimating">
                    <Briefcase />
                    <div>
                      <span>Commercial</span>
                      <span>Handle large-scale projects</span>
                    </div>
                  </Link>
                  <Link href="/locations">
                    <MapPin />
                    <div>
                      <span>By Location</span>
                      <span>Find contractors in your area</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Resources Dropdown */}
            <div 
             
              onMouseEnter={() => setIsResourcesOpen(true)}
              onMouseLeave={() => setIsResourcesOpen(false)}
            >
              <button>
                Resources
                <ChevronDown />
              </button>
              
              {isResourcesOpen && (
                <div>
                  {/* Free Tools Section */}
                  <div>
                    <h3>Free Tools</h3>
                  </div>
                  <Link href="/painting-estimate-calculator-free">
                    <Calculator />
                    <div>
                      <span>Quote Calculator</span>
                      <span>Generate instant painting estimates</span>
                    </div>
                  </Link>
                  <Link href="/paint-estimate-templates">
                    <FileText />
                    <div>
                      <span>Quote Templates</span>
                      <span>Professional, ready-to-use formats</span>
                    </div>
                  </Link>
                  <Link href="/roi-calculator">
                    <TrendingUp />
                    <div>
                      <span>ROI Calculator</span>
                      <span>Calculate your potential savings</span>
                    </div>
                  </Link>
                  
                  {/* Learning Center Section */}
                  <div>
                    <h3>Learning Center</h3>
                  </div>
                  <Link href="/how-to-quote-painting-jobs-professionally">
                    <BookOpen />
                    <div>
                      <span>Quoting Guide</span>
                      <span>Expert strategies for winning bids</span>
                    </div>
                  </Link>
                  <Link href="/painting-contractor-software-case-study">
                    <Award />
                    <div>
                      <span>Success Stories</span>
                      <span>Real contractors, real results</span>
                    </div>
                  </Link>
                  <Link href="/blog">
                    <FileText />
                    <div>
                      <span>Blog</span>
                      <span>Industry tips & insights</span>
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
            
            {/* Company Dropdown */}
            <div 
             
              onMouseEnter={() => setIsCompanyOpen(true)}
              onMouseLeave={() => setIsCompanyOpen(false)}
            >
              <button>
                Company
                <ChevronDown />
              </button>
              
              {isCompanyOpen && (
                <div>
                  <Link href="/about">
                    <Building2 />
                    <div>
                      <span>About Us</span>
                      <span>Our mission & story</span>
                    </div>
                  </Link>
                  <Link href="/careers">
                    <Briefcase />
                    <div>
                      <span>Careers</span>
                      <span>Join our growing team</span>
                    </div>
                  </Link>
                  <Link href="/contact">
                    <Users />
                    <div>
                      <span>Contact</span>
                      <span>Get in touch with sales</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            <Link 
              href="/access-code" 
             
            >
              Sign In
            </Link>
            <Button asChild>
              <Link href="/trial-signup">Start Free Trial</Link>
            </Button>
          </nav>

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
        {isMobileMenuOpen && (
          <div>
            <nav>
              {/* Mobile Product Section */}
              <div>
                <button
                  onClick={() => setIsProductOpen(!isProductOpen)}
                 
                >
                  Product
                  <ChevronDown`} />
                </button>
                
                {isProductOpen && (
                  <div>
                    <Link 
                      href="/features" 
                     
                      onClick={closeMobileMenu}
                    >
                      Features
                    </Link>
                    <Link 
                      href="/demo" 
                     
                      onClick={closeMobileMenu}
                    >
                      Watch Demo
                    </Link>
                    <Link 
                      href="/integrations" 
                     
                      onClick={closeMobileMenu}
                    >
                      Integrations
                    </Link>
                    <Link 
                      href="/security" 
                     
                      onClick={closeMobileMenu}
                    >
                      Security
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Mobile Solutions Section */}
              <div>
                <button
                  onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
                 
                >
                  Solutions
                  <ChevronDown`} />
                </button>
                
                {isSolutionsOpen && (
                  <div>
                    <Link 
                      href="/painting-contractors" 
                     
                      onClick={closeMobileMenu}
                    >
                      For Contractors
                    </Link>
                    <Link 
                      href="/enterprise" 
                     
                      onClick={closeMobileMenu}
                    >
                      Enterprise
                    </Link>
                    <Link 
                      href="/commercial-painting-estimating" 
                     
                      onClick={closeMobileMenu}
                    >
                      Commercial
                    </Link>
                    <Link 
                      href="/locations" 
                     
                      onClick={closeMobileMenu}
                    >
                      By Location
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Mobile Resources Section */}
              <div>
                <button
                  onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                 
                >
                  Resources
                  <ChevronDown`} />
                </button>
                
                {isResourcesOpen && (
                  <div>
                    <Link 
                      href="/painting-estimate-calculator-free" 
                     
                      onClick={closeMobileMenu}
                    >
                      Quote Calculator
                    </Link>
                    <Link 
                      href="/paint-estimate-templates" 
                     
                      onClick={closeMobileMenu}
                    >
                      Quote Templates
                    </Link>
                    <Link 
                      href="/roi-calculator" 
                     
                      onClick={closeMobileMenu}
                    >
                      ROI Calculator
                    </Link>
                    <Link 
                      href="/how-to-quote-painting-jobs-professionally" 
                     
                      onClick={closeMobileMenu}
                    >
                      Quoting Guide
                    </Link>
                    <Link 
                      href="/painting-contractor-software-case-study" 
                     
                      onClick={closeMobileMenu}
                    >
                      Success Stories
                    </Link>
                    <Link 
                      href="/blog" 
                     
                      onClick={closeMobileMenu}
                    >
                      Blog
                    </Link>
                  </div>
                )}
              </div>
              
              <Link 
                href="/pricing" 
                py-2`}
                onClick={closeMobileMenu}
              >
                Pricing
              </Link>
              
              {/* Mobile Company Section */}
              <div>
                <button
                  onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                 
                >
                  Company
                  <ChevronDown`} />
                </button>
                
                {isCompanyOpen && (
                  <div>
                    <Link 
                      href="/about" 
                     
                      onClick={closeMobileMenu}
                    >
                      About Us
                    </Link>
                    <Link 
                      href="/careers" 
                     
                      onClick={closeMobileMenu}
                    >
                      Careers
                    </Link>
                    <Link 
                      href="/contact" 
                     
                      onClick={closeMobileMenu}
                    >
                      Contact
                    </Link>
                  </div>
                )}
              </div>
              <Link 
                href="/access-code" 
               
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>
              <Button asChild>
                <Link href="/trial-signup" onClick={closeMobileMenu}>Start Free Trial</Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}