'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Palette, 
  Home,
  FileText,
  Settings,
  Calculator,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuotesOpen, setIsQuotesOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsQuotesOpen(false);
  };

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const handleLogout = () => {
    // Clear the session from localStorage
    localStorage.removeItem('paintquote_company');
    // Redirect to homepage
    router.push('/');
  };

  return (
    <header>
      <div>
        <div>
          <Link href="/dashboard">
            <img 
              src="/paint-logo-transparent.png" 
              alt="Paint Quote App Dashboard - Professional painting estimate software" 
             
              width="32"
              height="32"
            />
            <span>Paint Quote App</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav>
            <Link 
              href="/dashboard" 
             `}
            >
              <Home />
              Dashboard
            </Link>
            
            {/* Quotes Dropdown */}
            <div 
             
              onMouseEnter={() => setIsQuotesOpen(true)}
              onMouseLeave={() => setIsQuotesOpen(false)}
            >
              <button`}>
                <FileText />
                Quotes
                <ChevronDown />
              </button>
              
              {isQuotesOpen && (
                <div>
                  <Link href="/create-quote">
                    <Calculator />
                    <div>
                      <div>Create Quote</div>
                      <div>New estimate</div>
                    </div>
                  </Link>
                  <Link href="/quotes">
                    <FileText />
                    <div>
                      <div>View Quotes</div>
                      <div>All quotes</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              href="/dashboard/customers" 
             `}
            >
              <Users />
              Customers
            </Link>
            
            <Link 
              href="/dashboard/analytics" 
             `}
            >
              <BarChart3 />
              Analytics
            </Link>
            
            <Link 
              href="/settings" 
             `}
            >
              <Settings />
              Settings
            </Link>
            
            <div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
               
              >
                <LogOut />
                Logout
              </Button>
            </div>
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
              <Link 
                href="/dashboard" 
               `}
                onClick={closeMobileMenu}
              >
                <Home />
                Dashboard
              </Link>
              
              {/* Mobile Quotes Section */}
              <div>
                <button
                  onClick={() => setIsQuotesOpen(!isQuotesOpen)}
                 `}
                >
                  <span>
                    <FileText />
                    Quotes
                  </span>
                  <ChevronDown`} />
                </button>
                
                {isQuotesOpen && (
                  <div>
                    <Link 
                      href="/create-quote" 
                     
                      onClick={closeMobileMenu}
                    >
                      Create Quote
                    </Link>
                    <Link 
                      href="/quotes" 
                     
                      onClick={closeMobileMenu}
                    >
                      View All Quotes
                    </Link>
                  </div>
                )}
              </div>
              
              <Link 
                href="/dashboard/customers" 
               `}
                onClick={closeMobileMenu}
              >
                <Users />
                Customers
              </Link>
              
              <Link 
                href="/dashboard/analytics" 
               `}
                onClick={closeMobileMenu}
              >
                <BarChart3 />
                Analytics
              </Link>
              
              <Link 
                href="/settings" 
               `}
                onClick={closeMobileMenu}
              >
                <Settings />
                Settings
              </Link>
              
              <div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                 
                >
                  <LogOut />
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}