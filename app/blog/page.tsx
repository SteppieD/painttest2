import { Metadata } from 'next';
import Link from 'next/link';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  Star,
  Calendar,
  User,
  Tag,
  Search,
  Filter,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';

export const metadata: Metadata = {
  title: 'Painting Business Blog - Expert Tips & Strategies | ProPaint Quote',
  description: 'Get expert painting business advice, quoting strategies, and industry insights. Learn how to grow your painting company with tips from successful contractors.',
  keywords: 'painting business tips, painting contractor advice, painting business blog, quoting strategies, painting industry insights, contractor business growth',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Painting Business Blog - Expert Tips from Successful Contractors',
    description: 'Discover proven strategies to grow your painting business. Expert advice on quoting, pricing, marketing, and operations from industry leaders.',
    url: '/blog',
    siteName: 'ProPaint Quote',
    type: 'website',
  },
};

export default function BlogPage() {
  // Featured blog posts
  const featuredPosts = [
    {
      id: 1,
      title: "How to Increase Your Painting Quote Win Rate by 40%",
      excerpt: "Discover the proven strategies that successful contractors use to win more jobs. From professional presentations to pricing psychology, learn what really works.",
      category: "Business Growth",
      readTime: "8 min read",
      date: "2025-01-15",
      featured: true,
      slug: "increase-painting-quote-win-rate"
    },
    {
      id: 2,
      title: "The Complete Guide to Pricing Painting Jobs in 2025",
      excerpt: "Master the art of painting job pricing with our comprehensive guide. Includes regional pricing data, material costs, and profit margin strategies.",
      category: "Pricing Strategy",
      readTime: "12 min read", 
      date: "2025-01-10",
      featured: true,
      slug: "complete-guide-pricing-painting-jobs-2025"
    },
    {
      id: 3,
      title: "Mobile Apps Every Painting Contractor Needs in 2025",
      excerpt: "The essential mobile tools that are transforming how painting contractors work. From estimation to project management, discover game-changing apps.",
      category: "Technology",
      readTime: "6 min read",
      date: "2025-01-08",
      featured: true,
      slug: "mobile-apps-painting-contractors-2025"
    }
  ];

  // Recent blog posts
  const recentPosts = [
    {
      id: 4,
      title: "Interior vs Exterior Painting: Pricing Differences Explained",
      excerpt: "Understanding the cost factors and pricing strategies for interior and exterior painting projects.",
      category: "Pricing",
      readTime: "5 min read",
      date: "2025-01-05",
      slug: "interior-vs-exterior-painting-pricing"
    },
    {
      id: 5,
      title: "Marketing Your Painting Business on a Tight Budget",
      excerpt: "Effective marketing strategies that don't break the bank. Learn how to get more leads without spending big.",
      category: "Marketing",
      readTime: "7 min read",
      date: "2025-01-03",
      slug: "marketing-painting-business-tight-budget"
    },
    {
      id: 6,
      title: "Paint Quality Guide: When to Use Premium vs Budget Options",
      excerpt: "Help your customers choose the right paint quality for their project and budget with this comprehensive guide.",
      category: "Materials",
      readTime: "9 min read",
      date: "2024-12-28",
      slug: "paint-quality-guide-premium-vs-budget"
    },
    {
      id: 7,
      title: "Seasonal Painting Business: Maximizing Winter Revenue",
      excerpt: "Strategies to keep your painting business profitable during the slower winter months.",
      category: "Seasonal Tips",
      readTime: "6 min read",
      date: "2024-12-25",
      slug: "seasonal-painting-business-winter-revenue"
    },
    {
      id: 8,
      title: "Customer Communication: How to Handle Difficult Clients",
      excerpt: "Professional strategies for managing challenging customer situations while maintaining relationships.",
      category: "Customer Service",
      readTime: "8 min read",
      date: "2024-12-20",
      slug: "customer-communication-difficult-clients"
    },
    {
      id: 9,
      title: "Insurance and Licensing: Protecting Your Painting Business",
      excerpt: "Essential insurance coverage and licensing requirements every painting contractor should know.",
      category: "Business Operations",
      readTime: "10 min read",
      date: "2024-12-18",
      slug: "insurance-licensing-painting-business"
    }
  ];

  // Blog categories
  const categories = [
    { name: "Business Growth", count: 12, color: "bg-blue-100 text-blue-800" },
    { name: "Pricing Strategy", count: 8, color: "bg-green-100 text-green-800" },
    { name: "Technology", count: 6, color: "bg-purple-100 text-purple-800" },
    { name: "Marketing", count: 10, color: "bg-orange-100 text-orange-800" },
    { name: "Customer Service", count: 7, color: "bg-indigo-100 text-indigo-800" },
    { name: "Materials", count: 5, color: "bg-red-100 text-red-800" }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <KofiHeader />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            <span>Expert Painting Business Insights</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Painting Business <span className="text-blue-600">Success Stories</span> & Expert Tips
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Learn from successful painting contractors who've grown their businesses. 
            Get practical advice, proven strategies, and industry insights delivered weekly.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input 
                type="text" 
                placeholder="Search painting business topics..."
                className="pl-10 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span>48 Business Growth Articles</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Expert-Vetted Content</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span>Updated Weekly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Articles
            </h2>
            <p className="text-xl text-gray-600">
              Most popular insights from successful painting contractors
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post, index) => (
              <Card key={post.id} className={`border-0 shadow-lg hover:shadow-xl transition-shadow ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
                <div className="relative">
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                  
                  {/* Featured Image Placeholder */}
                  <div className={`bg-gradient-to-br from-blue-100 to-indigo-100 ${index === 0 ? 'h-64' : 'h-48'} flex items-center justify-center`}>
                    <BookOpen className="w-16 h-16 text-blue-600" />
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                    <span>{formatDate(post.date)}</span>
                  </div>
                  
                  <CardTitle className={`${index === 0 ? 'text-2xl' : 'text-xl'} hover:text-blue-600 transition-colors`}>
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Button variant="outline" asChild className="w-full">
                    <Link href={`/blog/${post.slug}`}>
                      Read Full Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Recent Posts */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Recent Articles</h2>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select className="border rounded-lg px-3 py-2 text-sm">
                    <option>All Categories</option>
                    <option>Business Growth</option>
                    <option>Pricing Strategy</option>
                    <option>Technology</option>
                    <option>Marketing</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-6">
                {recentPosts.map((post) => (
                  <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {/* Image */}
                      <div className="md:col-span-1">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 md:h-full rounded-lg flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="md:col-span-3 p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                            {post.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                          </div>
                          <span>{formatDate(post.date)}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h3>
                        
                        <p className="text-gray-600 mb-4">{post.excerpt}</p>
                        
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Read More
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Newsletter Signup */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Weekly Business Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Get expert painting business advice delivered to your inbox every Tuesday.
                  </p>
                  <div className="space-y-3">
                    <Input type="email" placeholder="Your email address" />
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Subscribe Free
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Join 2,500+ contractors. Unsubscribe anytime.
                  </p>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <Link 
                        key={category.name}
                        href={`/blog/category/${category.name.toLowerCase().replace(' ', '-')}`}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{category.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                          {category.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Tags */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Popular Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['Pricing', 'Quotes', 'Marketing', 'Software', 'Business Growth', 'Customer Service', 'Mobile Apps', 'Profit Margins'].map((tag) => (
                      <Link 
                        key={tag}
                        href={`/blog/tag/${tag.toLowerCase()}`}
                        className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Put These Tips Into Action?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start creating professional quotes that win more jobs. 
            Join thousands of contractors who've transformed their businesses.
          </p>
          <Button size="lg" variant="outline_white" asChild className="text-lg px-8 py-6">
            <Link href="/trial-signup">
              Start Free Trial Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <p className="text-blue-200 mt-4 text-sm">
            1 Free Quote • No credit card required • Setup in 5 minutes
          </p>
        </div>
      </section>

      <ImprovedFooter />

      {/* Structured Data for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "ProPaint Quote Painting Business Blog",
            "description": "Expert painting business advice, quoting strategies, and industry insights",
            "url": "https://propaintquote.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "ProPaint Quote",
              "url": "https://propaintquote.com"
            },
            "blogPost": featuredPosts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "url": `https://propaintquote.com/blog/${post.slug}`,
              "datePublished": post.date,
              "author": {
                "@type": "Organization",
                "name": "ProPaint Quote"
              }
            }))
          })
        }}
      />
    </div>
  );
}