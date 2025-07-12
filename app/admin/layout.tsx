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
  CreditCard,
  MessageSquare
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
      label: 'Feedback',
      href: '/admin/feedback',
      icon: MessageSquare,
      active: pathname.startsWith('/admin/feedback')
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
      <div>
        <div>
          <div></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!adminUser) {
    return null;
  }

  return (
    <div>
      {/* Mobile Header */}
      <div>
        <div>
          <Shield />
          <h1>Admin Portal</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <div>
        {/* Sidebar */}
        <div lg:translate-x-0 transition-transform duration-200 ease-in-out fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:shadow-none border-r`}>
          
          {/* Desktop Header */}
          <div>
            <Shield />
            <h1>Admin Portal</h1>
          </div>

          {/* Navigation */}
          <nav>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  variant={item.active ? "default" : "ghost"}
                 `}
                  onClick={() => {
                    router.push(item.href);
                    setIsMenuOpen(false);
                  }}
                >
                  <Icon />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div>
            <Card>
              <div>
                <div>{adminUser.full_name}</div>
                <div>{adminUser.email}</div>
                <div>{adminUser.role.replace('_', ' ')}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
               
                onClick={handleLogout}
              >
                <LogOut />
                Logout
              </Button>
            </Card>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMenuOpen && (
          <div 
           
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div>
          {/* Page Content */}
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}