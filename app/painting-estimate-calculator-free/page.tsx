import Link from 'next/link';
import Image from 'next/image';
import { 
  Calculator, 
  Download, 
  Smartphone,
  CheckCircle,
  Star,
  Users,
  Clock,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { ImageHeroSection } from '@/components/seo/ImageHeroSection';
import { professionalImages } from '@/lib/image-config';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'Free Painting Estimate Calculator App - Download for iPhone & Android',
  description: 'Free painting estimate calculator app for contractors. Download for iPhone & Android. Calculate accurate painting quotes instantly with our professional estimating software.',
  keywords: 'painting estimate calculator app, free painting estimate app, painting estimate app iphone, painting estimate calculator app free download, paint estimating app, free painting estimate app for android',
  path: '/painting-estimate-calculator-free',
});

export default function PaintingEstimateCalculatorFreePage() {
  return (
    <div>
      <KofiHeader />

      {/* Hero Section with Professional Image */}
      <ImageHeroSection
        title={<>Free Painting Estimate <span>Calculator App</span></>}
        subtitle="Download the most accurate painting estimate calculator app for iPhone and Android. Calculate professional painting quotes instantly, even offline. Used by over 10,000+ contractors nationwide."
        imageSrc={professionalImages.seoPages.calculator}
        imageAlt="Professional contractor using painting estimate calculator app"
        imageTitle="Digital Painting Quote Calculator for Contractors"
        backgroundClass="bg-gradient-to-br from-blue-50 to-indigo-100"
      >
        <div>
            <Button variant="primary" size="lg" asChild>
              <Link href="/trial-signup">
                <Download />
                Download Free App
              </Link>
            </Button>
            <Button variant="outline_white" size="lg" asChild>
              <Link href="/painting-estimate-calculator">
                <Calculator />
                Try Online Calculator
              </Link>
            </Button>
          </div>

          <div>
            <div>
              <CheckCircle />
              <span>Free Download</span>
            </div>
            <div>
              <CheckCircle />
              <span>Works Offline</span>
            </div>
            <div>
              <CheckCircle />
              <span>iPhone & Android</span>
            </div>
          </div>
        
        {/* App Store Rating */}
        <div>
          <div>
            {[1,2,3,4,5].map(i => (
              <Star key={i} />
            ))}
            <span>4.9/5 (2,847 reviews)</span>
          </div>
          <div>•</div>
          <div>
            <Users />
            <span>10,000+ active users</span>
          </div>
        </div>
      </ImageHeroSection>

      {/* App Features */}
      <section>
        <div>
          <div>
            <h2>
              Most Advanced Painting Calculator App
            </h2>
            <p>
              Everything you need to create accurate painting estimates on your phone or tablet
            </p>
          </div>

          <div>
            <Card>
              <CardHeader>
                <Smartphone />
                <CardTitle>Mobile-First Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Optimized for on-site estimates. Calculate painting quotes while walking through properties with your smartphone or tablet.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calculator />
                <CardTitle>Accurate Calculations</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Industry-standard formulas ensure accurate material costs, labor estimates, and markup calculations every time.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock />
                <CardTitle>5-Minute Estimates</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Generate professional painting quotes in under 5 minutes. Respond to leads faster than your competition.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Download />
                <CardTitle>Works Offline</CardTitle>
              </CardHeader>
              <CardContent>
                <p>No internet required for calculations. Perfect for basements, remote locations, or areas with poor cell service.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign />
                <CardTitle>Cost Database</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Built-in database of paint costs, labor rates, and material prices. Automatically updated for accuracy.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users />
                <CardTitle>Team Sync</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Share estimates with team members instantly. Keep everyone on the same page with cloud synchronization.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Download Options */}
      <section>
        <div>
          <h2>
            Download for iPhone & Android
          </h2>
          <p>
            Get the free painting estimate calculator app on your preferred device
          </p>

          <div>
            <Card>
              <div>
                <Smartphone />
                <h3>iPhone App</h3>
                <p>iOS 12.0 or later. Compatible with iPhone and iPad.</p>
                <Button size="lg" asChild>
                  <Link href="/trial-signup">
                    <Download />
                    Download for iPhone
                  </Link>
                </Button>
              </div>
            </Card>

            <Card>
              <div>
                <Smartphone />
                <h3>Android App</h3>
                <p>Android 6.0 or later. Optimized for all screen sizes.</p>
                <Button size="lg" asChild>
                  <Link href="/trial-signup">
                    <Download />
                    Download for Android
                  </Link>
                </Button>
              </div>
            </Card>
          </div>

          <div>
            <p>No app store account? Try our web calculator:</p>
            <Button variant="outline" size="lg" asChild>
              <Link href="/painting-estimate-calculator">
                <Calculator />
                Use Web Calculator
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section>
        <div>
          <h2>
            Trusted by Painting Contractors
          </h2>
          <p>
            See what professionals say about our painting estimate calculator app
          </p>

          <div>
            <Card>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p>"Best painting calculator app I've used. Saved me hours every week on estimates."</p>
              <p>- Mike Johnson, Johnson Painting</p>
            </Card>

            <Card>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p>"Finally, a painting app that works offline. Perfect for job sites with no signal."</p>
              <p>- Sarah Davis, Elite Painting Co.</p>
            </Card>

            <Card>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p>"Accurate estimates every time. My quotes are more competitive and profitable now."</p>
              <p>- Tom Rodriguez, Pro Paint Services</p>
            </Card>
          </div>

          <div>
            <div>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
            </div>
            <p>4.9/5 stars • 2,000+ reviews</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div>
          <h2>
            Download Your Free Painting Calculator App
          </h2>
          <p>
            Join thousands of contractors who create accurate estimates in minutes
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/trial-signup">
              <Download />
              Get Free App Now
            </Link>
          </Button>
          <p>
            Free download • No credit card required • Works offline
          </p>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  );
}