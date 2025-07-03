import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing Plans - Start Free, Grow Your Painting Business | ProPaint Quote',
  description: 'Simple, transparent pricing for painting contractors. Start with 1 free quote. Join 5,000+ professionals who increased win rates by 40%. No contracts, cancel anytime.',
  keywords: 'painting software pricing, quote software cost, painting business tools, contractor software plans, painting estimate software pricing',
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Painting Software Pricing - Trusted by 5,000+ Contractors',
    description: 'Transparent pricing that grows with your business. Start free, upgrade when ready. See 40% higher win rates.',
    url: '/pricing',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}