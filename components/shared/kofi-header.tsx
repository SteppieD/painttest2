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

export function KofiHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const pathname = usePathname();

  // Get company ID from localStorage/sessionStorage
  useEffect(() => {
    // Check sessionStorage first
    const storedCompanyId = sessionStorage.getItem('companyId');
    if (storedCompanyId) {
      setCompanyId(storedCompanyId);
    } else {
      // Check localStorage for company data
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

  const handleDropdownToggle = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header>
      <div>
        {/* Logo */}
        <Link href="/" onClick={closeAllMenus}>
          <div>
            <Palette />
          </div>
          <span>ProPaint Quote</span>
          <span>PQP</span>
        </Link>

        {/* Desktop Navigation */}
        <nav>
          {/* Product Dropdown */}
          <div>
            <button 
             
              onMouseEnter={() => setActiveDropdown('product')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              Product
              <ChevronDown />
            </button>
            
            {activeDropdown === 'product' && (
              <div 
               
                onMouseEnter={() => setActiveDropdown('product')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div>
                  <Link href="/features" onClick={closeAllMenus}>
                    <div>
                      <Zap />
                    </div>
                    <div>
                      <div>Features</div>
                      <div>Everything included in our platform</div>
                    </div>
                  </Link>
                  <Link href="/demo" onClick={closeAllMenus}>
                    <div>
                      <BarChart3 />
                    </div>
                    <div>
                      <div>Watch Demo</div>
                      <div>See Paint Quote Pro in action</div>
                    </div>
                  </Link>
                  <Link href="/integrations" onClick={closeAllMenus}>
                    <div>
                      <Shield />
                    </div>
                    <div>
                      <div>Integrations</div>
                      <div>Connect with QuickBooks & more</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Solutions Dropdown */}
          <div>
            <button 
             
              onMouseEnter={() => setActiveDropdown('solutions')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              Solutions
              <ChevronDown />
            </button>
            
            {activeDropdown === 'solutions' && (
              <div 
               
                onMouseEnter={() => setActiveDropdown('solutions')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div>
                  <Link href="/painting-contractors" onClick={closeAllMenus}>
                    <div>
                      <Users />
                    </div>
                    <div>
                      <div>For Contractors</div>
                      <div>Tailored for painting businesses</div>
                    </div>
                  </Link>
                  <Link href="/enterprise" onClick={closeAllMenus}>
                    <div>
                      <Building2 />
                    </div>
                    <div>
                      <div>Enterprise</div>
                      <div>Solutions for large teams</div>
                    </div>
                  </Link>
                  <Link href="/commercial-painting-estimating" onClick={closeAllMenus}>
                    <div>
                      <Briefcase />
                    </div>
                    <div>
                      <div>Commercial</div>
                      <div>Handle large-scale projects</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Resources Dropdown */}
          <div>
            <button 
             
              onMouseEnter={() => setActiveDropdown('resources')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              Resources
              <ChevronDown />
            </button>
            
            {activeDropdown === 'resources' && (
              <div 
               
                onMouseEnter={() => setActiveDropdown('resources')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div>
                  <div>
                    <h3>Free Tools</h3>
                    <Link href="/painting-estimate-calculator-free" onClick={closeAllMenus}>
                      <div>
                        <Calculator />
                      </div>
                      <div>
                        <div>Quote Calculator</div>
                        <div>Generate instant painting estimates</div>
                      </div>
                    </Link>
                    <Link href="/paint-estimate-templates" onClick={closeAllMenus}>
                      <div>
                        <FileText />
                      </div>
                      <div>
                        <div>Quote Templates</div>
                        <div>Professional, ready-to-use formats</div>
                      </div>
                    </Link>
                  </div>
                  
                  <div>
                    <h3>Learning Center</h3>
                    <Link href="/how-to-quote-painting-jobs-professionally" onClick={closeAllMenus}>
                      <div>
                        <BookOpen />
                      </div>
                      <div>
                        <div>Quoting Guide</div>
                        <div>Expert strategies for winning bids</div>
                      </div>
                    </Link>
                    <Link href="/painting-contractor-software-case-study" onClick={closeAllMenus}>
                      <div>
                        <Award />
                      </div>
                      <div>
                        <div>Success Stories</div>
                        <div>Real contractors, real results</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link 
            href="/pricing"
          >
            Pricing
          </Link>

          {/* Company Dropdown */}
          <div>
            <button 
             
              onMouseEnter={() => setActiveDropdown('company')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              Company
              <ChevronDown />
            </button>
            
            {activeDropdown === 'company' && (
              <div 
               
                onMouseEnter={() => setActiveDropdown('company')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <div>
                  <Link href="/about" onClick={closeAllMenus}>
                    <div>
                      <Building2 />
                    </div>
                    <div>
                      <div>About Us</div>
                      <div>Our mission & story</div>
                    </div>
                  </Link>
                  <Link href="/contact" onClick={closeAllMenus}>
                    <div>
                      <Users />
                    </div>
                    <div>
                      <div>Contact</div>
                      <div>Get in touch with sales</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Desktop CTA Buttons */}
        <div>
          {/* Show quota counter if user is logged in */}
          {companyId && (
            <QuotaCounter 
              companyId={companyId} 
              variant="header" 
              showUpgrade={true}
             
            />
          )}
          
          {companyId ? (
            <Link 
              href="/dashboard" 
             
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link 
                href="/access-code" 
               
              >
                Sign In
              </Link>
              <Link 
                href="/trial-signup" 
               
              >
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
      {isMobileMenuOpen && (
        <div>
          <div>
            <nav>
              {/* Mobile Product Section */}
              <div>
                <button
                  onClick={() => handleDropdownToggle('mobile-product')}
                 
                >
                  Product
                  <ChevronDown />
                </button>
                
                {activeDropdown === 'mobile-product' && (
                  <div>
                    <Link href="/features" onClick={closeAllMenus}>Features</Link>
                    <Link href="/demo" onClick={closeAllMenus}>Watch Demo</Link>
                    <Link href="/integrations" onClick={closeAllMenus}>Integrations</Link>
                  </div>
                )}
              </div>

              {/* Mobile Solutions Section */}
              <div>
                <button
                  onClick={() => handleDropdownToggle('mobile-solutions')}
                 
                >
                  Solutions
                  <ChevronDown />
                </button>
                
                {activeDropdown === 'mobile-solutions' && (
                  <div>
                    <Link href="/painting-contractors" onClick={closeAllMenus}>For Contractors</Link>
                    <Link href="/enterprise" onClick={closeAllMenus}>Enterprise</Link>
                    <Link href="/commercial-painting-estimating" onClick={closeAllMenus}>Commercial</Link>
                  </div>
                )}
              </div>

              {/* Mobile Resources Section */}
              <div>
                <button
                  onClick={() => handleDropdownToggle('mobile-resources')}
                 
                >
                  Resources
                  <ChevronDown />
                </button>
                
                {activeDropdown === 'mobile-resources' && (
                  <div>
                    <Link href="/painting-estimate-calculator-free" onClick={closeAllMenus}>Quote Calculator</Link>
                    <Link href="/paint-estimate-templates" onClick={closeAllMenus}>Quote Templates</Link>
                    <Link href="/how-to-quote-painting-jobs-professionally" onClick={closeAllMenus}>Quoting Guide</Link>
                    <Link href="/painting-contractor-software-case-study" onClick={closeAllMenus}>Success Stories</Link>
                  </div>
                )}
              </div>

              <Link href="/pricing" onClick={closeAllMenus}>
                Pricing
              </Link>

              {/* Mobile Company Section */}
              <div>
                <button
                  onClick={() => handleDropdownToggle('mobile-company')}
                 
                >
                  Company
                  <ChevronDown />
                </button>
                
                {activeDropdown === 'mobile-company' && (
                  <div>
                    <Link href="/about" onClick={closeAllMenus}>About Us</Link>
                    <Link href="/contact" onClick={closeAllMenus}>Contact</Link>
                  </div>
                )}
              </div>

              {/* Mobile CTA Buttons */}
              <div>
                <Link href="/access-code" onClick={closeAllMenus}>
                  Sign In
                </Link>
                <Link href="/trial-signup" onClick={closeAllMenus}>
                  Start Free Trial
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}