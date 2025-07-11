'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  dropdown?: {
    label: string;
    href: string;
    description?: string;
  }[];
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { 
    label: 'Solutions', 
    href: '#',
    dropdown: [
      { 
        label: 'Interior Painting', 
        href: '/interior-painting-quote-calculator',
        description: 'Room-by-room estimates'
      },
      { 
        label: 'Exterior Painting', 
        href: '/exterior-painting-estimate-calculator',
        description: 'House exterior quotes'
      },
      { 
        label: 'Commercial', 
        href: '/commercial-painting-estimating-software',
        description: 'Large project estimates'
      },
    ]
  },
  { label: 'Pricing', href: '/pricing' },
  { 
    label: 'Resources', 
    href: '#',
    dropdown: [
      { 
        label: 'Free Calculator', 
        href: '/painting-estimate-calculator',
        description: 'Instant paint estimates'
      },
      { 
        label: 'Quote Templates', 
        href: '/paint-estimate-templates',
        description: 'Professional templates'
      },
      { 
        label: 'Interior Calculator', 
        href: '/interior-painting-quote-calculator',
        description: 'Room-by-room quotes'
      },
      { 
        label: 'Exterior Calculator', 
        href: '/exterior-painting-estimate-calculator',
        description: 'House exterior estimates'
      },
      { 
        label: 'Quoting Guide', 
        href: '/how-to-quote-painting-jobs-professionally',
        description: 'Expert strategies'
      },
      { 
        label: 'Case Studies', 
        href: '/painting-contractor-software-case-study',
        description: 'Real success stories'
      },
    ]
  },
];

export function ACNavbarClean() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const companyData = localStorage.getItem("paintquote_company");
    setIsLoggedIn(!!companyData);
  }, [pathname]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <>
      <nav`}>
        <div>
          <div>
            {/* Logo */}
            <Link href="/">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#ef2b70"/>
                <path d="M16 6C11.5817 6 8 9.58172 8 14C8 18.4183 11.5817 22 16 22C16 22 16 26 16 26C16 26 24 22 24 14C24 9.58172 20.4183 6 16 6Z" fill="white"/>
                <circle cx="12" cy="12" r="1.5" fill="#ef2b70"/>
                <circle cx="20" cy="12" r="1.5" fill="#ef2b70"/>
                <circle cx="12" cy="16" r="1.5" fill="#ef2b70"/>
                <circle cx="20" cy="16" r="1.5" fill="#ef2b70"/>
                <circle cx="16" cy="14" r="1.5" fill="#ef2b70"/>
              </svg>
              <span>Paint Quote Pro</span>
            </Link>

            {/* Desktop Navigation */}
            <nav>
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.dropdown ? (
                    <div
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button>
                        <span>{item.label}</span>
                        <ChevronDown />
                      </button>
                      
                      {openDropdown === item.label && (
                        <div>
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                             
                            >
                              <div>
                                {subItem.label}
                              </div>
                              {subItem.description && (
                                <div>
                                  {subItem.description}
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                     `}
                     
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div>
              {isLoggedIn ? (
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
                    Login
                  </Link>
                  <Link
                    href="/trial-signup"
                   
                   
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
                  >
                    Try For Free
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
             
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div>
          <div onClick={() => setIsMobileMenuOpen(false)} />
          
          <nav>
            <div>
              <span>Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div>
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.dropdown ? (
                    <>
                      <button
                       
                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      >
                        {item.label}
                        <ChevronDown`} />
                      </button>
                      {openDropdown === item.label && (
                        <div>
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                             
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                     
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              
              <div>
                {isLoggedIn ? (
                  <Link
                    href="/dashboard"
                   
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/access-code"
                     
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/trial-signup"
                     
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Try For Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}