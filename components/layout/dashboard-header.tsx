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
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <img 
              src="/paint-quote-logo.png" 
              alt="Paint Quote App" 
              className="w-8 h-8"
            />
            <span className="text-2xl font-bold text-gray-900">Paint Quote App</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className={`flex items-center gap-2 ${isActive('/dashboard') && !isActive('/dashboard/') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            
            {/* Quotes Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsQuotesOpen(true)}
              onMouseLeave={() => setIsQuotesOpen(false)}
            >
              <button className={`flex items-center gap-2 ${isActive('/quotes') || isActive('/create-quote') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}>
                <FileText className="w-4 h-4" />
                Quotes
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isQuotesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <Link href="/create-quote" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <Calculator className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Create Quote</div>
                      <div className="text-sm text-gray-500">New estimate</div>
                    </div>
                  </Link>
                  <Link href="/quotes" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">View Quotes</div>
                      <div className="text-sm text-gray-500">All quotes</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              href="/dashboard/customers" 
              className={`flex items-center gap-2 ${isActive('/dashboard/customers') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Users className="w-4 h-4" />
              Customers
            </Link>
            
            <Link 
              href="/dashboard/analytics" 
              className={`flex items-center gap-2 ${isActive('/dashboard/analytics') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Link>
            
            <Link 
              href="/settings" 
              className={`flex items-center gap-2 ${isActive('/settings') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            
            <div className="ml-6 pl-6 border-l">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t">
            <nav className="flex flex-col space-y-4 pt-4">
              <Link 
                href="/dashboard" 
                className={`flex items-center gap-2 py-2 ${isActive('/dashboard') && !isActive('/dashboard/') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={closeMobileMenu}
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              
              {/* Mobile Quotes Section */}
              <div className="space-y-2">
                <button
                  onClick={() => setIsQuotesOpen(!isQuotesOpen)}
                  className={`flex items-center justify-between w-full py-2 ${isActive('/quotes') || isActive('/create-quote') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Quotes
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isQuotesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isQuotesOpen && (
                  <div className="pl-6 space-y-2 border-l-2 border-gray-100">
                    <Link 
                      href="/create-quote" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      Create Quote
                    </Link>
                    <Link 
                      href="/quotes" 
                      className="block text-gray-600 hover:text-gray-900 py-2"
                      onClick={closeMobileMenu}
                    >
                      View All Quotes
                    </Link>
                  </div>
                )}
              </div>
              
              <Link 
                href="/dashboard/customers" 
                className={`flex items-center gap-2 py-2 ${isActive('/dashboard/customers') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={closeMobileMenu}
              >
                <Users className="w-4 h-4" />
                Customers
              </Link>
              
              <Link 
                href="/dashboard/analytics" 
                className={`flex items-center gap-2 py-2 ${isActive('/dashboard/analytics') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={closeMobileMenu}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Link>
              
              <Link 
                href="/settings" 
                className={`flex items-center gap-2 py-2 ${isActive('/settings') ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={closeMobileMenu}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              
              <div className="pt-4 mt-4 border-t">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
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