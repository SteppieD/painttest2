import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'
import { ArrowRight, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. But don't worry - 
            we can help you get back on track with professional painting quotes!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/trial-signup">
                <ArrowRight className="h-5 w-5 mr-2" />
                Start Free Trial
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                <Home className="h-5 w-5 mr-2" />
                Back to Homepage
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Looking for something specific?</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <Link href="/professional-painting-software" className="text-blue-600 hover:text-blue-800">
                Professional Software
              </Link>
              <Link href="/how-to-scale-painting-business" className="text-blue-600 hover:text-blue-800">
                Business Scaling Guide
              </Link>
              <Link href="/painting-business-profit-guide" className="text-blue-600 hover:text-blue-800">
                Profit Optimization
              </Link>
              <Link href="/digital-transformation-painting-contractors" className="text-blue-600 hover:text-blue-800">
                Digital Transformation
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}