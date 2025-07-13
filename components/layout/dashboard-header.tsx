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
    <header className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/dashboard">
            <img 
              src="/paint-logo-transparent.png" 
              alt="Paint Quote App Dashboard - Professional painting estimate software" 
             
             
             
            />
            <span>Paint Quote App</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home />
              Dashboard
            </Link>
            
            {/* Quotes Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsQuotesOpen(true)}
              onMouseLeave={() => setIsQuotesOpen(false)}
            >
              <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                <FileText />
                Quotes
                <ChevronDown className="w-4 h-4" />
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
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard/customers') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users />
              Customers
            </Link>
            
            <Link 
              href="/dashboard/analytics" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard/analytics') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 />
              Analytics
            </Link>
            
            <Link 
              href="/settings" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/settings') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'
              }`}
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
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/dashboard') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={closeMobileMenu}
              >
                <Home />
                Dashboard
              </Link>
              
              {/* Mobile Quotes Section */}
              <div>
                <button
                  onClick={() => setIsQuotesOpen(!isQuotesOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <span>
                    <FileText />
                    Quotes
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isQuotesOpen ? 'rotate-180' : ''}`} />
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
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/dashboard/customers') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={closeMobileMenu}
              >
                <Users />
                Customers
              </Link>
              
              <Link 
                href="/dashboard/analytics" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/dashboard/analytics') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={closeMobileMenu}
              >
                <BarChart3 />
                Analytics
              </Link>
              
              <Link 
                href="/settings" 
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/settings') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'
                }`}
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