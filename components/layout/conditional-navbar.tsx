'use client';

import { usePathname } from 'next/navigation';
import { ACNavbar } from '@/components/adcreative/ACNavbar';

// Pages that should NOT show the navbar
const PAGES_WITHOUT_NAVBAR = [
  '/access-code',
  '/admin',
  '/setup',
  '/create-quote',
  '/dashboard',
  '/dashboard-modern',
  '/quotes',
  '/settings',
  '/forgot-code',
  '/trial-success',
  '/payment-success',
  '/subscription/manage'
];

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Check if current path starts with any of the excluded paths
  const shouldHideNavbar = PAGES_WITHOUT_NAVBAR.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  
  // Don't show navbar on excluded pages
  if (shouldHideNavbar) {
    return null;
  }
  
  return <ACNavbar />;
}