import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Sparkles, 
  Zap, 
  TrendingUp,
  Users,
  Target,
  Clock,
  ArrowRight,
  CheckCircle,
  Star,
  Smartphone,
  Calculator,
  PaintBucket,
  ChartBar,
  Shield,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/shared/footer';

// Import the new design system
import '@/styles/adcreative-inspired.css';

export const metadata: Metadata = {
  title: 'Modern Design Preview | ProPaint Quote',
  description: 'Experience the new vibrant, modern design inspired by cutting-edge SaaS platforms',
};

export default function ModernDesignPreview() {
  const stats = [
    { number: "5,000+", label: "Active Contractors", icon: Users },
    { number: "40%", label: "Win Rate Increase", icon: TrendingUp },
    { number: "30 sec", label: "Quote Creation", icon: Clock },
    { number: "4.9/5", label: "Customer Rating", icon: Star }
  ];

  const features = [
    {
      icon: Calculator,
      title: "AI-Powered Estimates",
      description: "Smart calculations that learn from your quote history and suggest optimal pricing"
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Create professional quotes on-site from any device, even offline"
    },
    {
      icon: ChartBar,
      title: "Business Intelligence",
      description: "Track win rates, revenue trends, and optimize your pricing strategy"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and SOC 2 compliance for total data protection"
    }
  ];

  const testimonials = [
    {
      quote: "ProPaint Quote transformed our business. We're winning 70% more jobs!",
      author: "Mike Johnson",
      company: "Elite Painting Co.",
      rating: 5
    },
    {
      quote: "The mobile app is incredible. I close deals right in the customer's driveway.",
      author: "Sarah Martinez",
      company: "ProPaint Solutions",
      rating: 5
    },
    {
      quote: "From $180K to $420K revenue in 18 months. This software pays for itself!",
      author: "David Chen",
      company: "Precision Painters",
      rating: 5
    }
  ];

  return (
    <div>

      {/* Hero Section with AdCreative.ai Style */}
      <section>
        <div>
          <div>
            {/* Animated Badge */}
            <div>
              <Sparkles />
              <span>Introducing Our New Design</span>
            </div>
            
            <h1>
              Create <span>Stunning Quotes</span><br />
              Win More Painting Jobs
            </h1>
            
            <p>
              Join 5,000+ painting contractors using AI-powered quoting software. 
              Create professional estimates in 30 seconds, increase win rates by 40%, 
              and grow your business with data-driven insights.
            </p>
            
            <div>
              <button>
                Start Free Trial
                <ArrowRight />
              </button>
              <button>
                Watch Demo
                <Zap />
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div>
              <div>
                <CheckCircle />
                <span>No credit card required</span>
              </div>
              <div>
                <CheckCircle />
                <span>5 minute setup</span>
              </div>
              <div>
                <CheckCircle />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section>
        <div>
          <div>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index}>
                  <div>
                    <Icon />
                  </div>
                  <div>{stat.number}</div>
                  <div>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <div>
          <div>
            <h2>
              Everything You Need to <span>Grow</span>
            </h2>
            <p>
              Professional tools designed specifically for painting contractors, 
              backed by AI and loved by thousands.
            </p>
          </div>
          
          <div>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index}>
                  <div>
                    <Icon />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div>
          <div>
            <h2>
              Contractors <span>Love</span> ProPaint Quote
            </h2>
            <p>
              Real stories from painting professionals who transformed their business
            </p>
          </div>
          
          <div>
            {testimonials.map((testimonial, index) => (
              <div key={index}>
                <div>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} />
                  ))}
                </div>
                <p>"{testimonial.quote}"</p>
                <div>
                  <div>{testimonial.author}</div>
                  <div>{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div>
          <div>
            <Rocket />
            <h2>
              Ready to <span>Transform</span> Your Business?
            </h2>
            <p>
              Join 5,000+ contractors who are winning more jobs and growing faster with ProPaint Quote.
            </p>
            
            <button>
              Start Your Free Trial
              <ArrowRight />
            </button>
            
            <div>
              <div>
                <CheckCircle />
                <span>14-day free trial</span>
              </div>
              <div>
                <CheckCircle />
                <span>No credit card</span>
              </div>
              <div>
                <CheckCircle />
                <span>Full access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design System Preview */}
      <section>
        <div>
          <div>
            <h2>Design System Elements</h2>
            <p>Preview of AdCreative.ai-inspired components</p>
          </div>
          
          <div>
            {/* Buttons */}
            <div>
              <h3>Buttons</h3>
              <div>
                <button>Primary Button</button>
                <button>Secondary Button</button>
                <button disabled>
                  Disabled Button
                </button>
              </div>
            </div>
            
            {/* Badges */}
            <div>
              <h3>Badges</h3>
              <div>
                <div>
                  <Sparkles />
                  Default Badge
                </div>
                <div>
                  <Zap />
                  Pink Badge
                </div>
              </div>
            </div>
            
            {/* Typography */}
            <div>
              <h3>Typography</h3>
              <div>
                <h1>Hero Heading</h1>
                <h2>Heading 1</h2>
                <h3>Heading 2</h3>
                <p>Large body text for important descriptions</p>
                <p>Gradient Text Effect</p>
              </div>
            </div>
            
            {/* Cards */}
            <div>
              <h3>Card Styles</h3>
              <div>
                <div>
                  <div>
                    <PaintBucket />
                  </div>
                  <h4>Feature Card</h4>
                  <p>Hover me to see the effect</p>
                </div>
                <div>
                  <h4>Standard Card</h4>
                  <p>With top border on hover</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}