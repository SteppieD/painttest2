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
    <div>
      <KofiHeader />

      {/* Hero Section */}
      <section>
        <div>
          <div>
            <BookOpen />
            <span>Expert Painting Business Insights</span>
          </div>
          
          <h1>
            Painting Business <span>Success Stories</span> & Expert Tips
          </h1>
          <p>
            Learn from successful painting contractors who've grown their businesses. 
            Get practical advice, proven strategies, and industry insights delivered weekly.
          </p>
          
          {/* Search Bar */}
          <div>
            <div>
              <Search />
              <Input 
                type="text" 
                placeholder="Search painting business topics..."
               
              />
            </div>
          </div>
          
          <div>
            <div>
              <TrendingUp />
              <span>48 Business Growth Articles</span>
            </div>
            <div>
              <Star />
              <span>Expert-Vetted Content</span>
            </div>
            <div>
              <Calendar />
              <span>Updated Weekly</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section>
        <div>
          <div>
            <h2>
              Featured Articles
            </h2>
            <p>
              Most popular insights from successful painting contractors
            </p>
          </div>
          
          <div>
            {featuredPosts.map((post, index) => (
              <Card key={post.id}`}>
                <div>
                  {/* Category Badge */}
                  <div>
                    <span>
                      Featured
                    </span>
                  </div>
                  
                  {/* Featured Image Placeholder */}
                  <div flex items-center justify-center`}>
                    <BookOpen />
                  </div>
                </div>
                
                <CardHeader>
                  <div>
                    <span>
                      {post.category}
                    </span>
                    <div>
                      <Clock />
                      <span>{post.readTime}</span>
                    </div>
                    <span>{formatDate(post.date)}</span>
                  </div>
                  
                  <CardTitle hover:text-blue-600 transition-colors`}>
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p>{post.excerpt}</p>
                  <Button variant="outline" asChild>
                    <Link href={`/blog/${post.slug}`}>
                      Read Full Article
                      <ArrowRight />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section>
        <div>
          <div>
            {/* Recent Posts */}
            <div>
              <div>
                <h2>Recent Articles</h2>
                <div>
                  <Filter />
                  <select>
                    <option>All Categories</option>
                    <option>Business Growth</option>
                    <option>Pricing Strategy</option>
                    <option>Technology</option>
                    <option>Marketing</option>
                  </select>
                </div>
              </div>
              
              <div>
                {recentPosts.map((post) => (
                  <Card key={post.id}>
                    <div>
                      {/* Image */}
                      <div>
                        <div>
                          <BookOpen />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div>
                        <div>
                          <span>
                            {post.category}
                          </span>
                          <div>
                            <Clock />
                            <span>{post.readTime}</span>
                          </div>
                          <span>{formatDate(post.date)}</span>
                        </div>
                        
                        <h3>
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h3>
                        
                        <p>{post.excerpt}</p>
                        
                        <Link 
                          href={`/blog/${post.slug}`}
                         
                        >
                          Read More
                          <ChevronRight />
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Newsletter Signup */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Business Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Get expert painting business advice delivered to your inbox every Tuesday.
                  </p>
                  <div>
                    <Input type="email" placeholder="Your email address" />
                    <Button>
                      Subscribe Free
                    </Button>
                  </div>
                  <p>
                    Join 2,500+ contractors. Unsubscribe anytime.
                  </p>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    {categories.map((category) => (
                      <Link 
                        key={category.name}
                        href={`/blog/category/${category.name.toLowerCase().replace(' ', '-')}`}
                       
                      >
                        <span>{category.name}</span>
                        <span`}>
                          {category.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    {['Pricing', 'Quotes', 'Marketing', 'Software', 'Business Growth', 'Customer Service', 'Mobile Apps', 'Profit Margins'].map((tag) => (
                      <Link 
                        key={tag}
                        href={`/blog/tag/${tag.toLowerCase()}`}
                       
                      >
                        <Tag />
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
      <section>
        <div>
          <h2>
            Ready to Put These Tips Into Action?
          </h2>
          <p>
            Start creating professional quotes that win more jobs. 
            Join thousands of contractors who've transformed their businesses.
          </p>
          <Button size="lg" variant="outline_white" asChild>
            <Link href="/trial-signup">
              Start Free Trial Today
              <ArrowRight />
            </Link>
          </Button>
          <p>
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