import Link from 'next/link';
import { 
  Play, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  Users, 
  Target, 
  Smartphone, 
  Calculator, 
  TrendingUp,
  Shield,
  Zap,
  PhoneCall,
  Calendar,
  Award,
  Eye,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'Live Demo - See ProPaint Quote in Action | Professional Painting Software',
  description: 'Watch a live demo of ProPaint Quote - the painting contractor software trusted by 5,000+ professionals. See how to create quotes in 5 minutes and increase win rates by 40%.',
  keywords: 'painting software demo, quote software demonstration, contractor tool preview, painting estimator demo, live software walkthrough',
  path: '/demo',
});

export default function DemoPage() {
  // Social proof statistics
  const demoStats = [
    { icon: Users, number: "5,000+", label: "Active Contractors", color: "text-blue-600" },
    { icon: Target, number: "40%", label: "Higher Win Rates", color: "text-green-600" },
    { icon: Clock, number: "5 Min", label: "Average Quote Time", color: "text-purple-600" },
    { icon: Award, number: "95%", label: "Quote Accuracy", color: "text-orange-600" }
  ];

  // Demo features to highlight
  const demoFeatures = [
    {
      icon: Calculator,
      title: "Smart Quote Calculator",
      description: "Watch how AI-powered calculations ensure 95% accuracy every time",
      duration: "2 minutes",
      highlight: "Industry-leading formulas"
    },
    {
      icon: Smartphone,
      title: "Mobile Quoting",
      description: "See how contractors create quotes on-site using just their phone",
      duration: "3 minutes", 
      highlight: "Works offline"
    },
    {
      icon: TrendingUp,
      title: "Professional Presentations",
      description: "Discover how beautiful quotes convert 40% more prospects",
      duration: "2 minutes",
      highlight: "Impress every customer"
    },
    {
      icon: BarChart3,
      title: "Business Analytics",
      description: "Learn how data-driven insights increase profit margins",
      duration: "3 minutes",
      highlight: "Track what matters"
    }
  ];

  // Customer success stories for social proof
  const successStories = [
    {
      quote: "The demo convinced me immediately. I saw how professional our quotes could look and knew this would help us win more jobs.",
      author: "Mike Johnson",
      company: "Elite Painting Co.",
      result: "70% win rate increase",
      avatar: "M"
    },
    {
      quote: "Within 15 minutes of the demo, I understood how this would save us hours every day. The ROI was obvious.",
      author: "Sarah Martinez", 
      company: "ProPaint Solutions",
      result: "3x faster quotes",
      avatar: "S"
    },
    {
      quote: "The demo showed exactly what we needed - professional presentations that close more deals. Game changer.",
      author: "David Chen",
      company: "Precision Painters",
      result: "$15K job closed on-site",
      avatar: "D"
    }
  ];

  return (
    <div>
      <KofiHeader />

      {/* Hero Section */}
      <section>
        <div>
          {/* Social Proof Badge */}
          <div>
            <Star />
            <span>Trusted by 5,000+ Professional Painting Contractors</span>
          </div>
          
          <h1>
            See Why Contractors Choose <span>ProPaint Quote</span>
          </h1>
          <p>
            Watch a live demonstration of the painting contractor software that's helping professionals 
            increase win rates by 40% and create quotes in 5 minutes instead of hours.
          </p>
          
          {/* Demo Stats */}
          <div>
            {demoStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index}>
                  <Icon mx-auto mb-2`} />
                  <div>{stat.number}</div>
                  <div>{stat.label}</div>
                </div>
              );
            })}
          </div>
          
          {/* Primary CTA */}
          <div>
            <Button size="lg">
              <Play />
              Watch Live Demo Now
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/trial-signup">
                Skip Demo - Start Free Trial
                <ArrowRight />
              </Link>
            </Button>
          </div>
          
          <p>
            ⚡ 10-minute demo • No software download required • See real features
          </p>
        </div>
      </section>

      {/* Demo Video Section */}
      <section>
        <div>
          <div>
            <h2>
              10-Minute Demo: Everything You Need to See
            </h2>
            <p>
              Watch real contractors use ProPaint Quote to transform their quoting process
            </p>
          </div>
          
          {/* Video Placeholder with Play Button */}
          <div>
            <div>
              <div>
                <div>
                  <Play />
                </div>
                <h3>Click to Watch Demo</h3>
                <p>See ProPaint Quote in action - real features, real results</p>
              </div>
            </div>
            
            {/* Demo Duration Badge */}
            <div>
              <Clock />
              10:23
            </div>
          </div>
          
          {/* Demo Highlights */}
          <div>
            {demoFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div>
                      <div>
                        <Icon />
                      </div>
                      <div>
                        <CardTitle>{feature.title}</CardTitle>
                        <div>{feature.duration} in demo</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{feature.description}</p>
                    <div>
                      <CheckCircle />
                      {feature.highlight}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section>
        <div>
          <div>
            <h2>
              What Contractors Say After the Demo
            </h2>
            <p>
              Real feedback from painting professionals who've seen ProPaint Quote in action
            </p>
          </div>
          
          <div>
            {successStories.map((story, index) => (
              <Card key={index}>
                <CardContent>
                  {/* Quote */}
                  <div>
                    <div>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} />
                      ))}
                    </div>
                    <p>"{story.quote}"</p>
                  </div>
                  
                  {/* Author Info */}
                  <div>
                    <div>
                      {story.avatar}
                    </div>
                    <div>
                      <div>{story.author}</div>
                      <div>{story.company}</div>
                    </div>
                  </div>
                  
                  {/* Result Badge */}
                  <div>
                    <TrendingUp />
                    {story.result}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo CTA */}
      <section>
        <div>
          <div>
            <h2>
              Ready to Try It Yourself?
            </h2>
            <p>
              Don't just watch - experience ProPaint Quote firsthand with our interactive demo account
            </p>
            
            <div>
              <div>
                <div>
                  <Eye />
                  <h3>Interactive Demo</h3>
                  <p>Try all features with demo data</p>
                </div>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/dashboard-modern">
                    Try Interactive Demo
                    <Zap />
                  </Link>
                </Button>
                <p>Access code: DEMO2024</p>
              </div>
              
              <div>
                <div>
                  <PhoneCall />
                  <h3>Personalized Demo</h3>
                  <p>1-on-1 demo with your project data</p>
                </div>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">
                    Schedule Personal Demo
                    <Calendar />
                  </Link>
                </Button>
                <p>15-minute call • Free consultation</p>
              </div>
            </div>
            
            <div>
              <div>
                <Shield />
                <span>Risk-Free: Start with 1 Free Quote</span>
              </div>
              <div>
                <span>✓ No credit card required</span>
                <span>✓ Full feature access</span>
                <span>✓ Setup in 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <div>
          <div>
            <h2>
              Demo Questions & Answers
            </h2>
            <p>
              Common questions about our demo and software
            </p>
          </div>
          
          <div>
            {[
              {
                q: "How long is the demo?",
                a: "Our comprehensive demo is about 10 minutes and covers all major features. You can also try our interactive demo anytime with access code DEMO2024."
              },
              {
                q: "Can I try the software after watching the demo?",
                a: "Absolutely! You can start with 1 free quote immediately after the demo. No credit card required, and you'll have access to all features."
              },
              {
                q: "Do I need to download anything for the demo?",
                a: "No downloads required. Both our video demo and interactive demo run directly in your web browser on any device."
              },
              {
                q: "Can I get a personalized demo with my project data?",
                a: "Yes! We offer free 15-minute personalized demos where we'll use your actual project data to show you exactly how ProPaint Quote works for your business."
              },
              {
                q: "What if I have questions during the demo?",
                a: "For live questions, schedule a personalized demo. For the video demo, our support team is available via chat or email to answer any questions."
              }
            ].map((faq, index) => (
              <div key={index}>
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ImprovedFooter />

      {/* Structured Data for Demo Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": "ProPaint Quote Software Demo",
            "description": "Watch how professional painting contractors create quotes in 5 minutes and increase win rates by 40%",
            "thumbnailUrl": "https://propaintquote.com/demo-thumbnail.jpg",
            "uploadDate": "2025-01-01",
            "duration": "PT10M23S",
            "contentUrl": "https://propaintquote.com/demo-video",
            "embedUrl": "https://propaintquote.com/demo",
            "publisher": {
              "@type": "Organization",
              "name": "ProPaint Quote",
              "url": "https://propaintquote.com"
            }
          })
        }}
      />
    </div>
  );
}