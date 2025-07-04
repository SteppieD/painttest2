import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar,
  Clock,
  ArrowRight,
  User,
  Tag,
  Share2,
  Bookmark
} from 'lucide-react';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { Button } from '@/components/ui/button';
import { professionalImages } from '@/lib/image-config';

export const metadata: Metadata = {
  title: 'Top Paint Color Trends for 2025 - Professional Painting Guide',
  description: 'Discover the hottest paint color trends for 2025. Expert insights on popular colors, finishes, and techniques that will dominate residential and commercial painting projects.',
  keywords: 'paint color trends 2025, popular paint colors, painting trends, color of the year, interior paint colors, exterior paint trends',
  openGraph: {
    title: 'Top Paint Color Trends for 2025 - Professional Guide',
    description: 'Expert insights on the paint colors and techniques that will dominate 2025.',
    type: 'article',
    publishedTime: '2024-12-20T00:00:00.000Z',
    authors: ['ProPaint Quote Team'],
  }
};

export default function PaintingColorTrends2025Page() {
  const publishDate = new Date('2024-12-20');
  const readingTime = '7 min read';
  const author = 'Sarah Johnson, Color Expert';

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section with Featured Image */}
      <article className="py-8">
        <div className="container mx-auto max-w-4xl px-4">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {publishDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {readingTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {author}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Top Paint Color Trends for 2025: What Professional Painters Need to Know
            </h1>

            <p className="text-xl text-gray-600 mb-6">
              Stay ahead of the curve with our comprehensive guide to the paint colors and techniques 
              that will dominate residential and commercial projects in 2025.
            </p>

            {/* Article Actions */}
            <div className="flex items-center gap-4 pb-6 border-b">
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Bookmark className="w-4 h-4" />
                Save
              </Button>
              <div className="ml-auto flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Interior Design, Color Trends, Professional Tips</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl mb-12">
            <Image
              src={professionalImages.blog.colorSelection}
              alt="Professional painter helping client choose paint colors for 2025"
              width={1200}
              height={600}
              className="w-full h-auto"
              priority
            />
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-sm text-gray-600">Helping clients choose the perfect colors for their space</p>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl mb-8">
              As we approach 2025, the painting industry is witnessing a fascinating shift in color preferences. 
              From earthy neutrals to bold statement hues, this year's trends reflect a desire for both comfort 
              and self-expression. Here's what every professional painter should know.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6">1. Warm Earth Tones Take Center Stage</h2>
            
            <div className="grid md:grid-cols-2 gap-8 my-8">
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src={professionalImages.services.residential}
                  alt="Warm earth tone paint colors in modern living room"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              <div className="flex items-center">
                <div>
                  <p>
                    Terracotta, ochre, and warm beiges are making a major comeback. These colors create 
                    inviting spaces that feel both sophisticated and grounded. Perfect for:
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li>• Living rooms and bedrooms</li>
                    <li>• Commercial spaces seeking warmth</li>
                    <li>• Accent walls and feature areas</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6">2. Bold Blues and Deep Greens</h2>
            
            <p>
              Moving away from the gray-dominated palette of recent years, 2025 sees a surge in rich, 
              saturated blues and greens. These colors work beautifully in both residential and commercial settings.
            </p>

            <div className="bg-blue-50 rounded-xl p-6 my-8">
              <h3 className="text-xl font-semibold mb-3">Pro Tip: Color Pairing</h3>
              <p className="mb-0">
                When working with bold colors, recommend pairing them with warm whites or soft neutrals 
                to create balance. This approach helps clients feel confident about embracing color while 
                maintaining versatility.
              </p>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6">3. The Rise of "Quiet Luxury" Neutrals</h2>

            <div className="relative rounded-lg overflow-hidden my-8">
              <Image
                src={professionalImages.services.interior}
                alt="Quiet luxury neutral paint colors in elegant interior"
                width={1200}
                height={600}
                className="w-full h-auto"
              />
            </div>

            <p>
              Sophisticated neutrals like warm grays, soft taupes, and creamy whites continue to dominate 
              high-end residential projects. These "quiet luxury" colors create timeless backdrops that 
              allow furniture and art to shine.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6">4. Techniques and Finishes Trending in 2025</h2>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">Textured Finishes</h3>
                <p className="text-sm mb-0">
                  Limewash and Roman clay effects are increasingly popular, offering depth and character 
                  that flat paint can't achieve.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3">Color Drenching</h3>
                <p className="text-sm mb-0">
                  Painting walls, trim, and ceiling in the same color creates immersive, cocoon-like 
                  spaces that feel modern and bold.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6">How to Leverage These Trends in Your Business</h2>

            <div className="bg-orange-50 rounded-xl p-8 my-8">
              <h3 className="text-2xl font-semibold mb-4">Action Steps for Painting Contractors:</h3>
              <ol className="space-y-3">
                <li><strong>1. Update Your Portfolio:</strong> Showcase projects featuring trending colors to attract style-conscious clients.</li>
                <li><strong>2. Educate Your Team:</strong> Ensure your painters understand color theory and can discuss trends confidently.</li>
                <li><strong>3. Stock Samples:</strong> Keep popular color samples on hand for client consultations.</li>
                <li><strong>4. Use Digital Tools:</strong> Leverage visualization software to help clients see trending colors in their space.</li>
              </ol>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6">Looking Ahead</h2>

            <p>
              As we move through 2025, expect to see these color trends evolve and adapt to regional preferences. 
              The key for professional painters is to stay informed while understanding that the best color choice 
              is always the one that makes your client happy.
            </p>

            <div className="border-t pt-8 mt-12">
              <h3 className="text-xl font-semibold mb-4">Ready to Quote Your Next Project?</h3>
              <p className="mb-6">
                Use our professional quoting software to create stunning proposals that showcase trending colors 
                and win more jobs.
              </p>
              <Link href="/trial-signup">
                <Button size="lg" className="gap-2">
                  Start Your Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          <div className="mt-16 pt-8 border-t">
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/blog/pricing-painting-jobs-2025" className="group">
                <div className="bg-gray-50 rounded-lg p-4 group-hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold mb-2 group-hover:text-orange-600 transition-colors">
                    How to Price Painting Jobs in 2025
                  </h4>
                  <p className="text-sm text-gray-600">Updated pricing strategies for modern contractors</p>
                </div>
              </Link>
              <Link href="/blog/eco-friendly-painting-guide" className="group">
                <div className="bg-gray-50 rounded-lg p-4 group-hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold mb-2 group-hover:text-orange-600 transition-colors">
                    Eco-Friendly Painting: A Contractor's Guide
                  </h4>
                  <p className="text-sm text-gray-600">Sustainable practices that win more clients</p>
                </div>
              </Link>
              <Link href="/blog/commercial-painting-tips" className="group">
                <div className="bg-gray-50 rounded-lg p-4 group-hover:shadow-lg transition-shadow">
                  <h4 className="font-semibold mb-2 group-hover:text-orange-600 transition-colors">
                    Commercial Painting: Tips for Success
                  </h4>
                  <p className="text-sm text-gray-600">Strategies for landing and managing big projects</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}