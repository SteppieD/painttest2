import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Free Painting Calculators | Interior, Exterior, Commercial & Cabinet | ProPaint Quote',
  description: 'Professional painting calculators for all project types. Get accurate estimates for interior rooms, exterior homes, commercial buildings, and cabinet refinishing in seconds.',
  keywords: 'painting calculator, paint estimate calculator, painting cost calculator, free painting calculator, professional painting estimator',
}

export default function CalculatorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}