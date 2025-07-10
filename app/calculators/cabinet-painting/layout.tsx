import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cabinet Painting Calculator | Kitchen Cabinet Refinishing Cost | ProPaint Quote',
  description: 'Free cabinet painting calculator. Get accurate quotes for kitchen cabinets, bathroom vanities, and custom cabinetry. Professional pricing in 30 seconds.',
  keywords: 'cabinet painting calculator, kitchen cabinet painting cost, cabinet refinishing calculator, cabinet painting estimator, kitchen cabinet paint calculator',
}

export default function CabinetPaintingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}