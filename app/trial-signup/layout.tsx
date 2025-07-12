import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'Start Your Free Trial',
  description: 'Start your free trial of ProPaint Quote. No credit card required. Create professional painting quotes in 30 seconds.',
  keywords: 'painting software free trial, painting quote software trial, contractor software trial',
  path: '/trial-signup',
});

export default function TrialSignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}