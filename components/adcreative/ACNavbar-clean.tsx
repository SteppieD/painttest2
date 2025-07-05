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
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-200 ${
        isScrolled ? 'shadow-md' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#ef2b70"/>
                <path d="M16 6C11.5817 6 8 9.58172 8 14C8 18.4183 11.5817 22 16 22C16 22 16 26 16 26C16 26 24 22 24 14C24 9.58172 20.4183 6 16 6Z" fill="white"/>
                <circle cx="12" cy="12" r="1.5" fill="#ef2b70"/>
                <circle cx="20" cy="12" r="1.5" fill="#ef2b70"/>
                <circle cx="12" cy="16" r="1.5" fill="#ef2b70"/>
                <circle cx="20" cy="16" r="1.5" fill="#ef2b70"/>
                <circle cx="16" cy="14" r="1.5" fill="#ef2b70"/>
              </svg>
              <span className="text-xl font-semibold text-gray-900">Paint Quote Pro</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <div key={item.label} className="relative">
                  {item.dropdown ? (
                    <div
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <button className="flex items-center space-x-1 text-gray-700 hover:text-[#ef2b70] transition-colors duration-100 py-2">
                        <span className="text-sm font-medium">{item.label}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      
                      {openDropdown === item.label && (
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 max-h-96 overflow-y-auto">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className="block px-4 py-2 hover:bg-gray-50"
                            >
                              <div className="text-sm font-medium text-gray-900">
                                {subItem.label}
                              </div>
                              {subItem.description && (
                                <div className="text-xs text-gray-500 mt-0.5">
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
                      className={`text-sm font-medium transition-colors duration-100 ${
                        pathname === item.href 
                          ? 'text-[#ef2b70]' 
                          : 'text-gray-700 hover:text-[#ef2b70]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-[#ef2b70] transition-colors duration-100"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/access-code"
                    className="text-sm font-medium text-gray-700 hover:text-[#ef2b70] transition-colors duration-100"
                  >
                    Login
                  </Link>
                  <Link
                    href="/trial-signup"
                    className="bg-[#ef2b70] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#d91e5a] transition-colors duration-100"
                  >
                    Try For Free
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsMobileMenuOpen(false)} />
          
          <nav className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-lg font-semibold">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="px-4 py-6">
              {navItems.map((item) => (
                <div key={item.label} className="mb-4">
                  {item.dropdown ? (
                    <>
                      <button
                        className="flex items-center justify-between w-full text-left py-2 text-gray-900 font-medium"
                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      >
                        {item.label}
                        <ChevronDown className={`w-4 h-4 transform transition-transform ${
                          openDropdown === item.label ? 'rotate-180' : ''
                        }`} />
                      </button>
                      {openDropdown === item.label && (
                        <div className="ml-4 mt-2 space-y-2">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className="block py-2 text-sm text-gray-600 hover:text-[#ef2b70]"
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
                      className="block py-2 text-gray-900 font-medium hover:text-[#ef2b70]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              
              <div className="mt-6 pt-6 border-t space-y-3">
                {isLoggedIn ? (
                  <Link
                    href="/dashboard"
                    className="block w-full text-center py-2 text-gray-700 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/access-code"
                      className="block w-full text-center py-2 text-gray-700 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/trial-signup"
                      className="block w-full text-center bg-[#ef2b70] text-white py-2 rounded-lg font-medium"
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