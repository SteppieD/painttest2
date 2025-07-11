import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/shared/footer'
import { ArrowRight, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div>
      
      <section>
        <div>
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>
            Sorry, we couldn't find the page you're looking for. But don't worry - 
            we can help you get back on track with professional painting quotes!
          </p>
          
          <div>
            <Button asChild size="lg">
              <Link href="/trial-signup">
                <ArrowRight />
                Start Free Trial
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                <Home />
                Back to Homepage
              </Link>
            </Button>
          </div>
          
          <div>
            <h3>Looking for something specific?</h3>
            <div>
              <Link href="/professional-painting-software">
                Professional Software
              </Link>
              <Link href="/how-to-scale-painting-business">
                Business Scaling Guide
              </Link>
              <Link href="/painting-business-profit-guide">
                Profit Optimization
              </Link>
              <Link href="/digital-transformation-painting-contractors">
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