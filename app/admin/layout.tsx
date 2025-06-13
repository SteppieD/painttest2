"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Users, 
  Key, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Shield,
  Home,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/session');
      if (response.ok) {
        const data = await response.json();
        setAdminUser(data.user);
      } else {
        // Redirect to admin login if not authenticated
        if (pathname !== '/admin/auth/login') {
          router.push('/admin/auth/login');
        }
      }
    } catch (error) {
      console.error('Admin auth check failed:', error);
      if (pathname !== '/admin/auth/login') {
        router.push('/admin/auth/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigationItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: Home,
      active: pathname === '/admin'
    },
    {
      label: 'Customers',
      href: '/admin/customers',
      icon: Users,
      active: pathname.startsWith('/admin/customers')
    },
    {
      label: 'Access Codes',
      href: '/admin/access-codes',
      icon: Key,
      active: pathname.startsWith('/admin/access-codes')
    },
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      active: pathname.startsWith('/admin/analytics')
    },
    {
      label: 'Subscriptions',
      href: '/admin/subscriptions',
      icon: CreditCard,
      active: pathname.startsWith('/admin/subscriptions')
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      active: pathname.startsWith('/admin/settings')
    }
  ];

  // Show login page without layout
  if (pathname === '/admin/auth/login') {
    return children;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!adminUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-200 ease-in-out fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:shadow-none border-r`}>
          
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center gap-3 p-6 border-b">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Admin Portal</h1>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2 mt-4 lg:mt-0">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  variant={item.active ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    item.active 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    router.push(item.href);
                    setIsMenuOpen(false);
                  }}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <Card className="p-3">
              <div className="text-sm">
                <div className="font-medium text-gray-900">{adminUser.full_name}</div>
                <div className="text-gray-500">{adminUser.email}</div>
                <div className="text-xs text-blue-600 capitalize mt-1">{adminUser.role.replace('_', ' ')}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </Card>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}