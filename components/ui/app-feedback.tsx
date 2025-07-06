'use client';

import { usePathname } from 'next/navigation';
import { FeedbackBox } from './feedback-box';
import { useEffect, useState } from 'react';

// Pages where we don't want to show the feedback button
const PUBLIC_PAGES = [
  '/',
  '/pricing',
  '/features',
  '/about',
  '/contact',
  '/demo',
  '/blog',
  '/faq',
  '/help',
  '/terms',
  '/privacy',
  '/painting-estimate-calculator',
  '/how-to-quote-painting-jobs-professionally',
  '/painting-contractor-software-case-study',
];

export function AppFeedback() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const companyData = localStorage.getItem('paintquote_company');
    setIsLoggedIn(!!companyData);
  }, [pathname]);

  // Don't show on public pages or if not logged in
  if (PUBLIC_PAGES.includes(pathname) || pathname.startsWith('/locations/') || !isLoggedIn) {
    return null;
  }

  return <FeedbackBox type="app" position="fixed" />;
}