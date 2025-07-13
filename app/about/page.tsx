import Link from 'next/link';
import { 
  Palette, 
  ArrowRight,
  Target,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  Star,
  Heart,
  MapPin,
  Clock,
  Shield,
  Zap,
  Building,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Briefcase,
  Lightbulb,
  Trophy,
  ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { KofiHeader } from '@/components/shared/kofi-header';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'About ProPaint Quote - Leading Painting Contractor Software | Built by Painters',
  description: 'Discover the story behind ProPaint Quote - the painting contractor software trusted by 5,000+ professionals. Built by painters, for painters. Learn our mission to help contractors win 40% more jobs.',
  keywords: 'about painting software, painting contractor company, quote software founders, painting business tools, contractor software story, painting industry leaders',
  path: '/about',
});

export default function AboutPage() {
  // Company stats and achievements
  const companyStats = [
    { icon: Users, number: "5,000+", label: "Active Contractors", color: "text-blue-600" },
    { icon: Target, number: "95%", label: "Quote Accuracy", color: "text-green-600" },
    { icon: Clock, number: "5 Min", label: "Average Quote Time", color: "text-purple-600" },
    { icon: TrendingUp, number: "40%", label: "Higher Win Rates", color: "text-orange-600" }
  ];

  // Founder stories and testimonials
  const founderStories = [
    {
      quote: "I was losing jobs because my quotes took 2 hours to prepare. Competitors were getting back to customers in 30 minutes.",
      author: "Mike Rodriguez",
      title: "Co-Founder & Former Painting Contractor",
      years: "15 years in painting",
      avatar: "M"
    },
    {
      quote: "Spreadsheets and calculators weren't cutting it. We needed software built by people who actually understand painting.",
      author: "Sarah Chen", 
      title: "Co-Founder & Software Engineer",
      years: "Former contractor, 10 years tech",
      avatar: "S"
    }
  ];

  // Timeline milestones
  const milestones = [
    {
      year: "2019",
      title: "The Problem",
      description: "Co-founders Mike and Sarah meet at a contractor expo, both frustrated with slow quoting processes"
    },
    {
      year: "2020", 
      title: "First Prototype",
      description: "Built the first version in Mike's garage, tested with 50 local contractors"
    },
    {
      year: "2021",
      title: "Industry Validation", 
      description: "500 contractors using ProPaint Quote, average 40% increase in win rates reported"
    },
    {
      year: "2022",
      title: "National Growth",
      description: "Expanded to all 50 states, reached 2,000 active contractors"
    },
    {
      year: "2023",
      title: "AI Innovation",
      description: "Launched AI-powered quote assistance, reducing quote time to under 5 minutes"
    },
    {
      year: "2024",
      title: "Industry Leader",
      description: "5,000+ contractors trust ProPaint Quote, #1 painting software by usage"
    }
  ];

  return (
    <div>
      <KofiHeader />

      {/* Hero Section */}
      <section>
        <div>
          <div>
            <div>
              <Star />
              <span>Trusted by 5,000+ Professional Painting Contractors</span>
            </div>
            
            <h1>
              Built by <span>Painters</span>, for <span>Painters</span>
            </h1>
            <p>
              ProPaint Quote was created by professional painting contractors who got tired of losing jobs 
              to faster competitors. We built the software we wished we had when we were spending hours 
              on quotes that should take minutes.
            </p>
          
            <div>
              {companyStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index}>
                    <div>
                      <div>
                        <Icon />
                      </div>
                      <div>{stat.number}</div>
                      <div>{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div>
              <Link href="/demo">
                <Zap />
                See Our Story in Action
              </Link>
              <Link href="/access-code">
                Join Our Community
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Stories Section */}
      <section>
        <div>
          <div>
            <h2>
              The Founders Who Lived the Problem
            </h2>
            <p>
              Real contractors who built the solution they wished they had
            </p>
          </div>
          
          <div>
            {founderStories.map((story, index) => (
              <div key={index}>
                <div>
                  <div>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} />
                    ))}
                  </div>
                  <p>"{story.quote}"</p>
                  <div>
                    <div>
                      {story.avatar}
                    </div>
                    <div>
                      <div>{story.author}</div>
                      <div>{story.title}</div>
                      <div>{story.years}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section>
        <div>
          <div>
            <h2>
              Our Journey: From Garage to Industry Leader
            </h2>
            <p>
              How two frustrated contractors built the #1 painting software
            </p>
          </div>
          
          <div>
            {milestones.map((milestone, index) => (
              <div key={index}>
                <div>
                  <div>
                    {milestone.year}
                  </div>
                </div>
                <div>
                  <div>
                    <div>
                      <h3>{milestone.title}</h3>
                      <p>{milestone.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Impact Section */}
      <section>
        <div>
          <div>
            <div>
              <h2>
                Our Mission: Empower Every Painting Contractor
              </h2>
              <p>
                We believe every painting contractor - from solo painters to growing companies - deserves access to 
                professional tools that help them create accurate quotes, win more jobs, and build successful businesses.
              </p>
              <p>
                Too many skilled painters lose jobs not because of their craft, but because their estimates take too long 
                or don't look professional enough. We're changing that reality, one contractor at a time.
              </p>
              
              <div>
                <div>
                  <h3>Our Impact So Far:</h3>
                  <div>
                    <div>
                      <CheckCircle />
                      <span>$50M+ in quotes generated</span>
                    </div>
                    <div>
                      <CheckCircle />
                      <span>500,000+ hours saved</span>
                    </div>
                    <div>
                      <CheckCircle />
                      <span>Average 40% win rate increase</span>
                    </div>
                    <div>
                      <CheckCircle />
                      <span>All 50 states covered</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Link href="/demo">
                See Our Mission in Action
                <ArrowRight />
              </Link>
            </div>
            
            <div>
              <div>
                <div>
                  <div>
                    <div>
                      <Heart />
                    </div>
                    <h3>Built with Love</h3>
                  </div>
                  <p>
                    Every feature is crafted by people who understand the daily challenges of running a painting business.
                  </p>
                </div>
              </div>
              
              <div>
                <div>
                  <div>
                    <div>
                      <Shield />
                    </div>
                    <h3>Reliable & Secure</h3>
                  </div>
                  <p>
                    Enterprise-grade security with 99.9% uptime. Your business data is always safe and accessible.
                  </p>
                </div>
              </div>
              
              <div>
                <div>
                  <div>
                    <div>
                      <ThumbsUp />
                    </div>
                    <h3>Community Driven</h3>
                  </div>
                  <p>
                    New features come from contractor feedback. Your voice shapes the future of ProPaint Quote.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team & Values Section */}
      <section>
        <div>
          <div>
            <h2>
              Our Values Drive Everything We Do
            </h2>
            <p>
              Built on principles that matter to contractors
            </p>
          </div>
          
          <div>
            <div>
              <div>
                <div>
                  <Lightbulb />
                </div>
                <h3>Innovation for Real Problems</h3>
                <p>
                  Every feature solves a real contractor pain point. We don't build technology for technology's sake - we build solutions that matter.
                </p>
              </div>
            </div>
            
            <div>
              <div>
                <div>
                  <Users />
                </div>
                <h3>Community First</h3>
                <p>
                  We're part of the painting community. Your feedback shapes our roadmap, and your success drives our motivation.
                </p>
              </div>
            </div>
            
            <div>
              <div>
                <div>
                  <Trophy />
                </div>
                <h3>Excellence in Simplicity</h3>
                <p>
                  Professional tools should be powerful yet simple. We obsess over making complex calculations feel effortless.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <div>
              <div>
                <h3>Get in Touch</h3>
                <p>
                  Questions about ProPaint Quote? We'd love to hear from you.
                </p>
              </div>
              
              <div>
                <div>
                  <div>
                    <Phone />
                  </div>
                  <h4>Call Us</h4>
                  <p>1-800-PROPAINT</p>
                  <p>Mon-Fri 8AM-6PM EST</p>
                </div>
                
                <div>
                  <div>
                    <Mail />
                  </div>
                  <h4>Email Support</h4>
                  <p>support@propaintquote.com</p>
                  <p>24-hour response time</p>
                </div>
                
                <div>
                  <div>
                    <Calendar />
                  </div>
                  <h4>Book a Demo</h4>
                  <p>Personal 1-on-1 walkthrough</p>
                  <p>15 minutes, free</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Preview */}
      <section>
        <div>
          <div>
            <h2>
              Real Results from Real Contractors
            </h2>
            <p>
              See how ProPaint Quote is transforming painting businesses
            </p>
          </div>
          
          <div>
            <div>
              <div>
                <div>
                  <DollarSign />
                </div>
                <h3>$500K+</h3>
                <p>Additional Revenue</p>
                <p>Average in first year</p>
              </div>
            </div>
            
            <div>
              <div>
                <div>
                  <Clock />
                </div>
                <h3>10 Hours</h3>
                <p>Saved Per Week</p>
                <p>Time back for more jobs</p>
              </div>
            </div>
            
            <div>
              <div>
                <div>
                  <Briefcase />
                </div>
                <h3>300%</h3>
                <p>Business Growth</p>
                <p>Average in 18 months</p>
              </div>
            </div>
          </div>
          
          <div>
            <Link href="/painting-contractor-software-case-study">
              Read Complete Success Stories
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div>
          <h2>
            Ready to Transform Your Painting Business?
          </h2>
          <p>
            Join 5,000+ contractors who create professional quotes in 5 minutes and win 40% more jobs
          </p>
          
          <div>
            <Link href="/trial-signup">
              Start Free Trial Today
              <ArrowRight />
            </Link>
            <Link href="/demo">
              Watch Live Demo
              <Zap />
            </Link>
          </div>
          
          <div>
            <span>✓ 1 Free Quote to Start</span>
            <span>✓ No Credit Card Required</span>
            <span>✓ Setup in 5 Minutes</span>
          </div>
        </div>
      </section>

      <ImprovedFooter />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "ProPaint Quote",
            "description": "Professional painting contractor software built by painters, for painters. Trusted by 5,000+ contractors nationwide.",
            "url": "https://propaintquote.com",
            "logo": "https://propaintquote.com/paint-logo-transparent.png",
            "foundingDate": "2019",
            "founder": [
              {
                "@type": "Person",
                "name": "Mike Rodriguez",
                "jobTitle": "Co-Founder & Former Painting Contractor"
              },
              {
                "@type": "Person", 
                "name": "Sarah Chen",
                "jobTitle": "Co-Founder & Software Engineer"
              }
            ],
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "US"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "1-800-PROPAINT",
              "contactType": "customer service",
              "email": "support@propaintquote.com"
            },
            "sameAs": [
              "https://facebook.com/propaintquote",
              "https://twitter.com/propaintquote",
              "https://linkedin.com/company/propaintquote"
            ]
          })
        }}
      />
    </div>
  );
}