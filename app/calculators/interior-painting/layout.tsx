import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Interior Painting Calculator | Instant Room Painting Quotes | ProPaint Quote',
  description: 'Free interior painting calculator. Get accurate room painting quotes in 30 seconds. Calculate walls, ceilings, trim costs instantly. Used by 2,500+ contractors.',
  keywords: 'interior painting calculator, room painting calculator, interior paint calculator, wall paint calculator, ceiling paint calculator, interior painting cost estimator',
}

export default function InteriorPaintingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}