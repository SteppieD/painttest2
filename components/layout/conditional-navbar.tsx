'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/shared/header';
import { DashboardHeader } from '@/components/layout/dashboard-header';

// Pages that should show the dashboard header instead of the main navbar
const DASHBOARD_PAGES = [
  '/dashboard',
  '/dashboard-modern',
  '/create-quote',
  '/quotes',
  '/settings'
];

// Pages that should NOT show any navbar
const PAGES_WITHOUT_NAVBAR = [
  '/access-code',
  '/admin',
  '/setup',
  '/forgot-code',
  '/trial-success',
  '/payment-success',
  '/subscription/manage'
];

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Check if current path should show dashboard header
  const shouldShowDashboard = DASHBOARD_PAGES.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  
  // Check if current path should hide all navigation
  const shouldHideNavbar = PAGES_WITHOUT_NAVBAR.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  
  // Don't show any navbar on excluded pages
  if (shouldHideNavbar) {
    return null;
  }
  
  // Show dashboard header for logged-in pages
  if (shouldShowDashboard) {
    return <DashboardHeader />;
  }
  
  // Show main navbar for public pages
  return <Header />;
}