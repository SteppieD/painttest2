'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { LoginPopup } from '@/components/ui/login-popup';

interface NavItem {
  label: string;
  href: string;
  dropdown?: {
    label: string;
    href: string;
  }[];
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { 
    label: 'Solutions', 
    href: '#',
    dropdown: [
      { label: 'Interior Painting', href: '/interior-painting-quote-calculator' },
      { label: 'Exterior Painting', href: '/exterior-painting-estimate-calculator' },
      { label: 'Commercial', href: '/commercial-painting-estimating-software' },
    ]
  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Resources', href: '/how-to-quote-painting-jobs-professionally' },
];

export function ACNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check if user is logged in by looking for company data in localStorage
    const companyData = localStorage.getItem("paintquote_company");
    setIsLoggedIn(!!companyData);
  }, [pathname]); // Re-check on route changes

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav`}>
        <div>
          {/* Logo */}
          <Link href="/">
            <Image 
              src="/paint-quote-logo.png" 
              alt="Paint Quote Pro" 
             
             
             
            />
            <span>Paint Quote Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <ul>
            {navItems.map((item) => (
              <li key={item.label}>
                {item.dropdown ? (
                  <div
                   
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button>
                      {item.label}
                      <ChevronDown size={16} />
                    </button>
                    {openDropdown === item.label && (
                      <div>
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                           
                          >
                            {subItem.label}
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
              </li>
            ))}
          </ul>

          {/* CTA Buttons */}
          <div>
            {isLoggedIn ? (
              <Link href="/dashboard">
                Dashboard
              </Link>
            ) : (
              <>
                <button 
                  onClick={() => setShowLoginPopup(true)} 
                 
                >
                  Login
                </button>
                <Link href="/trial-signup">
                  Try For Free
                </Link>
              </>
            )}
            
            {/* Mobile Menu Toggle */}
            <button
             
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
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
          <div>
            <div>
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Image 
                  src="/paint-quote-logo.png" 
                  alt="Paint Quote Pro" 
                 
                 
                 
                />
                <span>Paint Quote Pro</span>
              </Link>
              <button
               
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close mobile menu"
              >
                <X size={24} />
              </button>
            </div>
            
            <ul>
              {navItems.map((item) => (
                <li key={item.label}>
                  {item.dropdown ? (
                    <div>
                      <button
                       
                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      >
                        {item.label}
                        <ChevronDown size={16} />
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
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                     `}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            
            <div>
              {isLoggedIn ? (
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  Dashboard
                </Link>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setShowLoginPopup(true);
                    }} 
                   
                  >
                    Login
                  </button>
                  <Link href="/trial-signup" onClick={() => setIsMobileMenuOpen(false)}>
                    Try For Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      

      {/* Login Popup */}
      <LoginPopup 
        open={showLoginPopup} 
        onOpenChange={setShowLoginPopup} 
      />
    </>
  );
}