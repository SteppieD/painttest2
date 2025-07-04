import { Metadata } from 'next';
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
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { ImageHeroSection } from '@/components/seo/ImageHeroSection';
import { professionalImages } from '@/lib/image-config';

export const metadata: Metadata = {
  title: 'Free Painting Estimate Calculator App - Download for iPhone & Android | ProPaint Quote',
  description: 'Free painting estimate calculator app for contractors. Download for iPhone & Android. Calculate accurate painting quotes instantly with our professional estimating software.',
  keywords: 'painting estimate calculator app, free painting estimate app, painting estimate app iphone, painting estimate calculator app free download, paint estimating app, free painting estimate app for android',
  openGraph: {
    title: 'Free Painting Estimate Calculator App - iPhone & Android',
    description: 'Professional painting estimate calculator app. Free download for contractors. Calculate accurate quotes instantly on mobile.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Painting Estimate Calculator App',
    description: 'Download free painting calculator app for iPhone & Android. Professional estimates in minutes.',
  }
};

export default function PaintingEstimateCalculatorFreePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section with Professional Image */}
      <ImageHeroSection
        title={<>Free Painting Estimate <span className="text-blue-600">Calculator App</span></>}
        subtitle="Download the most accurate painting estimate calculator app for iPhone and Android. Calculate professional painting quotes instantly, even offline. Used by over 10,000+ contractors nationwide."
        imageSrc={professionalImages.seoPages.calculator}
        imageAlt="Professional contractor using painting estimate calculator app"
        imageTitle="Digital Painting Quote Calculator for Contractors"
        backgroundClass="bg-gradient-to-br from-blue-50 to-indigo-100"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="primary" size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/trial-signup">
                <Download className="w-5 h-5 mr-2" />
                Download Free App
              </Link>
            </Button>
            <Button variant="outline_white" size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/painting-estimate-calculator">
                <Calculator className="w-5 h-5 mr-2" />
                Try Online Calculator
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Free Download</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Works Offline</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>iPhone & Android</span>
            </div>
          </div>
        
        {/* App Store Rating */}
        <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mt-8">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-2">4.9/5 (2,847 reviews)</span>
          </div>
          <div className="hidden sm:block">•</div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>10,000+ active users</span>
          </div>
        </div>
      </ImageHeroSection>

      {/* App Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Most Advanced Painting Calculator App
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create accurate painting estimates on your phone or tablet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Smartphone className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Mobile-First Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Optimized for on-site estimates. Calculate painting quotes while walking through properties with your smartphone or tablet.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Calculator className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Accurate Calculations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Industry-standard formulas ensure accurate material costs, labor estimates, and markup calculations every time.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Clock className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>5-Minute Estimates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Generate professional painting quotes in under 5 minutes. Respond to leads faster than your competition.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Download className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle>Works Offline</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">No internet required for calculations. Perfect for basements, remote locations, or areas with poor cell service.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <DollarSign className="w-12 h-12 text-red-600 mb-4" />
                <CardTitle>Cost Database</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Built-in database of paint costs, labor rates, and material prices. Automatically updated for accuracy.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Users className="w-12 h-12 text-indigo-600 mb-4" />
                <CardTitle>Team Sync</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Share estimates with team members instantly. Keep everyone on the same page with cloud synchronization.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Download Options */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Download for iPhone & Android
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Get the free painting estimate calculator app on your preferred device
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8">
              <div className="text-center">
                <Smartphone className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">iPhone App</h3>
                <p className="text-gray-600 mb-6">iOS 12.0 or later. Compatible with iPhone and iPad.</p>
                <Button size="lg" className="w-full" asChild>
                  <Link href="/trial-signup">
                    <Download className="w-5 h-5 mr-2" />
                    Download for iPhone
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="p-8">
              <div className="text-center">
                <Smartphone className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Android App</h3>
                <p className="text-gray-600 mb-6">Android 6.0 or later. Optimized for all screen sizes.</p>
                <Button size="lg" className="w-full" asChild>
                  <Link href="/trial-signup">
                    <Download className="w-5 h-5 mr-2" />
                    Download for Android
                  </Link>
                </Button>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">No app store account? Try our web calculator:</p>
            <Button variant="outline" size="lg" asChild>
              <Link href="/painting-estimate-calculator">
                <Calculator className="w-5 h-5 mr-2" />
                Use Web Calculator
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Painting Contractors
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            See what professionals say about our painting estimate calculator app
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"Best painting calculator app I've used. Saved me hours every week on estimates."</p>
              <p className="font-medium">- Mike Johnson, Johnson Painting</p>
            </Card>

            <Card className="p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"Finally, a painting app that works offline. Perfect for job sites with no signal."</p>
              <p className="font-medium">- Sarah Davis, Elite Painting Co.</p>
            </Card>

            <Card className="p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"Accurate estimates every time. My quotes are more competitive and profitable now."</p>
              <p className="font-medium">- Tom Rodriguez, Pro Paint Services</p>
            </Card>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-xl text-gray-600 mb-8">4.9/5 stars • 2,000+ reviews</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Download Your Free Painting Calculator App
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of contractors who create accurate estimates in minutes
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
            <Link href="/trial-signup">
              <Download className="w-5 h-5 mr-2" />
              Get Free App Now
            </Link>
          </Button>
          <p className="text-blue-200 mt-4 text-sm">
            Free download • No credit card required • Works offline
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}