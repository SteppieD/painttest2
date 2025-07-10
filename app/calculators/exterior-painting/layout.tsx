import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Exterior Painting Calculator | House Painting Cost Estimator | ProPaint Quote',
  description: 'Free exterior painting calculator. Get accurate house painting quotes in 30 seconds. Calculate siding, trim, and exterior surface costs instantly. Used by 2,500+ contractors.',
  keywords: 'exterior painting calculator, house painting calculator, exterior paint estimator, siding paint calculator, exterior painting cost calculator',
}

export default function ExteriorPaintingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}