'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
      <nav className={`ac-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="ac-navbar-container">
          {/* Logo */}
          <Link href="/" className="ac-navbar-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#ef2b70"/>
              <path d="M10 22L16 10L22 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12.5 18H19.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Paint Quote Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="ac-navbar-menu">
            {navItems.map((item) => (
              <li key={item.label} className="ac-navbar-item">
                {item.dropdown ? (
                  <div
                    className="ac-navbar-dropdown"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className="ac-navbar-link ac-navbar-dropdown-trigger">
                      {item.label}
                      <ChevronDown size={16} />
                    </button>
                    {openDropdown === item.label && (
                      <div className="ac-navbar-dropdown-menu">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="ac-navbar-dropdown-link"
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
                    className={`ac-navbar-link ${pathname === item.href ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* CTA Buttons */}
          <div className="ac-navbar-cta">
            {isLoggedIn ? (
              <Link href="/dashboard" className="ac-btn ac-btn-ghost ac-btn-sm">
                Dashboard
              </Link>
            ) : (
              <>
                <button 
                  onClick={() => setShowLoginPopup(true)} 
                  className="ac-btn ac-btn-ghost ac-btn-sm"
                >
                  Login
                </button>
                <Link href="/trial-signup" className="ac-btn ac-btn-primary ac-btn-sm">
                  Try For Free
                </Link>
              </>
            )}
            
            {/* Mobile Menu Toggle */}
            <button
              className="ac-mobile-menu-toggle"
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
        <div className="ac-mobile-menu">
          <div className="ac-mobile-menu-backdrop" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="ac-mobile-menu-content">
            <div className="ac-mobile-menu-header">
              <Link href="/" className="ac-navbar-logo" onClick={() => setIsMobileMenuOpen(false)}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill="#ef2b70"/>
                  <path d="M10 22L16 10L22 22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12.5 18H19.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>Paint Quote Pro</span>
              </Link>
              <button
                className="ac-mobile-menu-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close mobile menu"
              >
                <X size={24} />
              </button>
            </div>
            
            <ul className="ac-mobile-menu-list">
              {navItems.map((item) => (
                <li key={item.label} className="ac-mobile-menu-item">
                  {item.dropdown ? (
                    <div className="ac-mobile-menu-dropdown">
                      <button
                        className="ac-mobile-menu-link ac-mobile-menu-dropdown-trigger"
                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      >
                        {item.label}
                        <ChevronDown size={16} className={openDropdown === item.label ? 'rotate-180' : ''} />
                      </button>
                      {openDropdown === item.label && (
                        <div className="ac-mobile-menu-dropdown-content">
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className="ac-mobile-menu-dropdown-link"
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
                      className={`ac-mobile-menu-link ${pathname === item.href ? 'active' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            
            <div className="ac-mobile-menu-footer">
              {isLoggedIn ? (
                <Link href="/dashboard" className="ac-btn ac-btn-ghost ac-btn-lg" onClick={() => setIsMobileMenuOpen(false)}>
                  Dashboard
                </Link>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setShowLoginPopup(true);
                    }} 
                    className="ac-btn ac-btn-ghost ac-btn-lg w-full"
                  >
                    Login
                  </button>
                  <Link href="/trial-signup" className="ac-btn ac-btn-primary ac-btn-lg" onClick={() => setIsMobileMenuOpen(false)}>
                    Try For Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Dropdown Styles */
        .ac-navbar-dropdown {
          position: relative;
        }

        .ac-navbar-dropdown-trigger {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          font: inherit;
          cursor: pointer;
        }

        .ac-navbar-dropdown-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 50%;
          transform: translateX(-50%);
          margin-top: 0;
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
          min-width: 240px;
          padding: 12px;
          z-index: 50;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .ac-navbar-dropdown::before {
          content: '';
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          height: 8px;
        }

        .ac-navbar-dropdown-link {
          display: block;
          padding: 10px 14px;
          margin: 2px 0;
          color: #374151;
          text-decoration: none;
          border-radius: 10px;
          transition: all 150ms ease;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
        }

        .ac-navbar-dropdown-link:hover {
          background: #f3f4f6;
          color: #ef2b70;
        }

        /* Mobile Menu Styles */
        .ac-mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 60;
        }

        .ac-mobile-menu-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
        }

        .ac-mobile-menu-content {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: 320px;
          background: white;
          overflow-y: auto;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .ac-mobile-menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .ac-mobile-menu-close {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          color: #6b7280;
        }

        .ac-mobile-menu-list {
          list-style: none;
          padding: 24px;
        }

        .ac-mobile-menu-item {
          margin-bottom: 8px;
        }

        .ac-mobile-menu-link {
          display: block;
          padding: 12px 16px;
          color: #374151;
          text-decoration: none;
          font-weight: 500;
          border-radius: 8px;
          transition: all 150ms ease;
        }

        .ac-mobile-menu-link:hover,
        .ac-mobile-menu-link.active {
          background: #fef3c7;
          color: #ef2b70;
        }

        .ac-mobile-menu-dropdown-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: none;
          border: none;
          font: inherit;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
        }

        .ac-mobile-menu-dropdown-trigger svg {
          transition: transform 200ms ease;
        }

        .rotate-180 {
          transform: rotate(180deg);
        }

        .ac-mobile-menu-dropdown-content {
          padding-left: 16px;
          margin-top: 4px;
        }

        .ac-mobile-menu-dropdown-link {
          display: block;
          padding: 10px 16px;
          color: #6b7280;
          text-decoration: none;
          font-size: 14px;
          border-radius: 6px;
          transition: all 150ms ease;
        }

        .ac-mobile-menu-dropdown-link:hover {
          background: #f3f4f6;
          color: #ef2b70;
        }

        .ac-mobile-menu-footer {
          padding: 24px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
      `}</style>

      {/* Login Popup */}
      <LoginPopup 
        open={showLoginPopup} 
        onOpenChange={setShowLoginPopup} 
      />
    </>
  );
}