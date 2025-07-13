import Link from 'next/link';
import { 
  Smartphone,
  CheckCircle,
  ArrowRight,
  Star,
  Download,
  Clock,
  DollarSign,
  Users,
  Camera,
  FileText,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  BarChart3,
  Cloud
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'Painting Contractor App - Mobile Quote & Business Management',
  description: 'Painting contractor app for iOS and Android. Create professional quotes on-site, manage customers, track jobs, and grow your painting business. 5,000+ contractors save 10 hours weekly.',
  keywords: 'painting contractor app, painting business app, painting estimate app, contractor mobile app, painting quote app, painting job management app, contractor business app, painting contractor software mobile',
  path: '/painting-contractor-app',
});

export default function PaintingContractorAppPage() {
  // App features
  const appFeatures = [
    {
      icon: <FileText />,
      title: "On-Site Quote Creation",
      description: "Create professional quotes in 5 minutes while with customers",
      benefit: "Close 3x more deals"
    },
    {
      icon: <Camera />,
      title: "Photo Measurements",
      description: "Snap photos to calculate room dimensions automatically",
      benefit: "80% faster estimates"
    },
    {
      icon: <Users />,
      title: "Customer Management",
      description: "Track leads, customers, and job history in one place",
      benefit: "Never lose a lead"
    },
    {
      icon: <BarChart3 />,
      title: "Business Analytics",
      description: "Real-time revenue, job tracking, and performance metrics",
      benefit: "Data-driven growth"
    },
    {
      icon: <Clock />,
      title: "Job Scheduling",
      description: "Calendar view with crew assignments and reminders",
      benefit: "Zero double-bookings"
    },
    {
      icon: <Cloud />,
      title: "Cloud Sync",
      description: "Access your business from any device, anywhere",
      benefit: "Work from anywhere"
    }
  ];

  // Time savings breakdown
  const timeSavings = [
    { task: "Creating quotes", before: "45 min", after: "5 min", saved: "40 min/quote" },
    { task: "Customer follow-up", before: "2 hours/day", after: "15 min", saved: "1.75 hours/day" },
    { task: "Job scheduling", before: "1 hour/day", after: "10 min", saved: "50 min/day" },
    { task: "Invoicing", before: "30 min", after: "2 min", saved: "28 min/invoice" },
    { task: "Revenue tracking", before: "3 hours/week", after: "Real-time", saved: "3 hours/week" }
  ];

  // App workflow
  const workflow = [
    {
      step: "1",
      title: "Download & Setup",
      description: "Install from App Store or Google Play, create account in 2 minutes"
    },
    {
      step: "2",
      title: "Customize Settings",
      description: "Add your logo, set pricing, choose paint brands"
    },
    {
      step: "3",
      title: "Create First Quote",
      description: "Use camera or manual entry to build professional quote"
    },
    {
      step: "4",
      title: "Send to Customer",
      description: "Email or text quote instantly, get e-signatures"
    },
    {
      step: "5",
      title: "Track Everything",
      description: "Monitor jobs, payments, and business growth"
    }
  ];

  // Pricing plans
  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      features: [
        "Up to 50 quotes/month",
        "Basic customer management",
        "Email support",
        "1 user account",
        "Standard templates"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      features: [
        "Unlimited quotes",
        "Advanced CRM features",
        "Priority support",
        "5 user accounts",
        "Custom branding",
        "Photo measurements",
        "Analytics dashboard"
      ],
      cta: "Most Popular",
      popular: true
    },
    {
      name: "Business",
      price: "$149",
      period: "/month",
      features: [
        "Everything in Pro",
        "Unlimited users",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "Training included",
        "White-label options"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  // Success stories
  const successStories = [
    {
      quote: "This app transformed my business. I'm creating quotes 10x faster and winning more jobs.",
      author: "Carlos Rodriguez",
      company: "Rodriguez Painting LLC",
      metric: "+156% revenue",
      rating: 5
    },
    {
      quote: "The photo measurement feature alone saves me 2 hours per day. Game changer!",
      author: "Sarah Chen",
      company: "Premium Painters Inc",
      metric: "10 hrs/week saved",
      rating: 5
    },
    {
      quote: "Finally, an app designed BY contractors FOR contractors. Everything just makes sense.",
      author: "Mike Thompson",
      company: "Thompson & Sons",
      metric: "45% more quotes won",
      rating: 5
    }
  ];

  // App stats
  const appStats = [
    { stat: "5,000+", label: "Active Contractors" },
    { stat: "250K+", label: "Quotes Created" },
    { stat: "4.8/5", label: "App Store Rating" },
    { stat: "$125M+", label: "Quotes Generated" }
  ];

  return (
    <div>
      <KofiHeader />
      
      {/* Hero Section */}
      <section>
        <div>
          <div>
            <div>
              <Badge>
                #1 Contractor App
              </Badge>
              <h1>
                Painting Contractor App for Growing Your Business
              </h1>
              <p>
                Painting contractor app that lets you create professional quotes on-site, 
                manage customers, and track jobs from your phone. Join 5,000+ contractors 
                saving 10 hours per week.
              </p>
              
              <div>
                <Button size="lg" asChild>
                  <Link href="/trial-signup">
                    Download Free App
                    <Download />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#features">
                    See Features
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
              
              <div>
                <div>
                  <Smartphone />
                  <span>iOS & Android</span>
                </div>
                <div>
                  <Star />
                  <span>4.8/5 Rating</span>
                </div>
                <div>
                  <Users />
                  <span>5,000+ Users</span>
                </div>
              </div>
            </div>
            
            <div>
              <div></div>
              <Card>
                <div>
                  <Smartphone />
                  <h3>Available Now</h3>
                  <p>Download on iOS & Android</p>
                </div>
                <div>
                  <Button asChild>
                    <Link href="/trial-signup">
                      <div>
                        <p>Download on the</p>
                        <p>App Store</p>
                      </div>
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/trial-signup">
                      <div>
                        <p>Get it on</p>
                        <p>Google Play</p>
                      </div>
                    </Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* App Stats */}
      <section>
        <div>
          <div>
            {appStats.map((stat, index) => (
              <div key={index}>
                <div>{stat.stat}</div>
                <div>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features">
        <div>
          <div>
            <h2>
              Everything You Need in One Painting Contractor App
            </h2>
            <p>
              Professional tools that work as hard as you do
            </p>
          </div>
          
          <div>
            {appFeatures.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div>
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                  <Badge>
                    {feature.benefit}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Time Savings */}
      <section>
        <div>
          <div>
            <h2>
              Save 10+ Hours Every Week
            </h2>
            <p>
              See exactly where the painting contractor app saves you time
            </p>
          </div>
          
          <Card>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Before App</th>
                    <th>With App</th>
                    <th>Time Saved</th>
                  </tr>
                </thead>
                <tbody>
                  {timeSavings.map((item, index) => (
                    <tr key={index}>
                      <td>{item.task}</td>
                      <td>{item.before}</td>
                      <td>{item.after}</td>
                      <td>{item.saved}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3}>Total Weekly Savings:</td>
                    <td>10+ hours</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Workflow */}
      <section>
        <div>
          <div>
            <h2>
              Start Using the App in 5 Minutes
            </h2>
            <p>
              Simple setup process to get you quoting faster
            </p>
          </div>
          
          <div>
            {workflow.map((step, index) => (
              <div key={index}>
                <div>
                  <div>
                    {step.step}
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                {index < workflow.length - 1 && (
                  <ArrowRight />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section>
        <div>
          <div>
            <h2>
              Contractors Love Our App
            </h2>
            <p>
              Real results from painting professionals
            </p>
          </div>
          
          <div>
            {successStories.map((story, index) => (
              <Card key={index}>
                <CardContent>
                  <div>
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} />
                    ))}
                  </div>
                  <p>"{story.quote}"</p>
                  <div>
                    <p>{story.author}</p>
                    <p>{story.company}</p>
                    <Badge>
                      {story.metric}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section>
        <div>
          <div>
            <h2>
              Simple Pricing for Every Painting Business
            </h2>
            <p>
              Start free, upgrade as you grow
            </p>
          </div>
          
          <div>
            {pricingPlans.map((plan, index) => (
              <Card key={index}>
                {plan.popular && (
                  <div>
                    <Badge>Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div>
                    <span>{plan.price}</span>
                    <span>{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul>
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>
                        <CheckCircle />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild>
                    <Link href="/trial-signup">
                      {plan.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div>
            <p>
              All plans include 14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Mobile Benefits */}
      <section>
        <div>
          <Card>
            <div>
              <div>
                <h2>
                  Why Mobile Matters for Contractors
                </h2>
                <div>
                  <div>
                    <Zap />
                    <div>
                      <h3>Close Deals On-Site</h3>
                      <p>Customers are 3x more likely to sign when you quote immediately</p>
                    </div>
                  </div>
                  <div>
                    <Globe />
                    <div>
                      <h3>Work From Anywhere</h3>
                      <p>Manage your business from job sites, home, or vacation</p>
                    </div>
                  </div>
                  <div>
                    <Shield />
                    <div>
                      <h3>Never Lose Data</h3>
                      <p>Cloud backup protects your business information</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3>App Highlights</h3>
                <div>
                  <div>
                    <CheckCircle />
                    <span>Works offline at job sites</span>
                  </div>
                  <div>
                    <CheckCircle />
                    <span>Syncs across all devices</span>
                  </div>
                  <div>
                    <CheckCircle />
                    <span>Integrates with QuickBooks</span>
                  </div>
                  <div>
                    <CheckCircle />
                    <span>Accepts digital signatures</span>
                  </div>
                  <div>
                    <CheckCircle />
                    <span>Processes payments</span>
                  </div>
                  <div>
                    <CheckCircle />
                    <span>Sends automatic reminders</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div>
          <h2>
            Join 5,000+ Contractors Growing with Our App
          </h2>
          <p>
            Download the painting contractor app that saves you 10+ hours per week 
            and helps you win more jobs. Free 14-day trial.
          </p>
          
          <div>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/trial-signup">
                Download Free App
                <Download />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/features">
                Compare Features
                <ArrowRight />
              </Link>
            </Button>
          </div>
          
          <div>
            <span>
              <CheckCircle />
              iOS & Android
            </span>
            <span>
              <CheckCircle />
              14-day free trial
            </span>
            <span>
              <CheckCircle />
              No credit card
            </span>
          </div>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  );
}