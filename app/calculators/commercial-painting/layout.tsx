import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commercial Painting Calculator | Building & Office Painting Estimator | ProPaint Quote',
  description: 'Free commercial painting calculator for offices, warehouses, retail spaces. Get accurate quotes for large-scale painting projects in seconds. Trusted by commercial contractors.',
  keywords: 'commercial painting calculator, office painting calculator, warehouse painting estimator, commercial paint cost calculator, building painting calculator',
}

export default function CommercialPaintingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}