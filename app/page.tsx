import Link from 'next/link';
import { 
  Calculator, 
  Clock, 
  CheckCircle, 
  Star,
  ArrowRight,
  Users,
  TrendingUp,
  Shield,
  Smartphone,
  FileText,
  BookOpen,
  Zap,
  DollarSign,
  BarChart3,
  Award,
  Check,
  Palette
} from 'lucide-react';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'Paint Quote Pro - Professional Painting Quote Software for Contractors',
  description: 'Win 40-60% more painting jobs with professional quotes in 30 seconds. Trusted by 5,000+ painting contractors. Start free trial today.',
  keywords: 'painting quote software, painting estimate software, contractor quoting app, painting business tools',
  path: '/',
});

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section>
        <div>
          <div>
            <h1>
              Win More Painting Jobs with <span>Professional Quotes</span>
            </h1>
            <p>
              Create stunning, professional painting quotes in 30 seconds. Trusted by 5,000+ contractors nationwide. 
              Increase your win rate by 40% with our AI-powered quoting platform.
            </p>
            <div>
              <Link href="/trial-signup">
                Start Free Trial
                <ArrowRight />
              </Link>
              <Link href="/demo">
                Watch Demo
              </Link>
            </div>
            
            <div>
              <div>
                <div>
                  <CheckCircle />
                  <span>Free 14-day trial</span>
                </div>
                <div>
                  <CheckCircle />
                  <span>No credit card required</span>
                </div>
                <div>
                  <CheckCircle />
                  <span>Setup in 2 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section>
        <div>
          <div>
            <div>
              {[...Array(5)].map((_, i) => (
                <Star key={i} />
              ))}
            </div>
            <p>
              Trusted by <span>5,000+</span> painting contractors
            </p>
          </div>
          
          <div>
            <div>
              <div>
                <div>5,000+</div>
                <div>Active Contractors</div>
              </div>
            </div>
            
            <div>
              <div>
                <div>$73M+</div>
                <div>Quotes Generated</div>
              </div>
            </div>
            
            <div>
              <div>
                <div>99%</div>
                <div>Accuracy Rate</div>
              </div>
            </div>
            
            <div>
              <div>
                <div>4.9/5</div>
                <div>Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div>
          <div>
            <h2>Everything You Need to Win More Jobs</h2>
            <p>
              Professional tools designed specifically for painting contractors
            </p>
          </div>
          
          <div>
            <div>
              <div>
                <div>
                  <Calculator />
                </div>
                <h3>Instant Quotes</h3>
                <p>
                  Create professional painting quotes in 30 seconds with our AI-powered calculator. 
                  No more hours of manual calculations.
                </p>
                <Link href="/painting-estimate-calculator-free">
                  Try Calculator
                </Link>
              </div>
            </div>
            
            <div>
              <div>
                <div>
                  <Palette />
                </div>
                <h3>Professional Templates</h3>
                <p>
                  Beautiful, branded quote templates that impress customers and increase your win rate. 
                  Fully customizable to match your brand.
                </p>
                <Link href="/paint-estimate-templates">
                  View Templates
                </Link>
              </div>
            </div>
            
            <div>
              <div>
                <div>
                  <Zap />
                </div>
                <h3>Smart Automation</h3>
                <p>
                  Automated follow-ups, digital signatures, and payment processing. 
                  Focus on painting while we handle the paperwork.
                </p>
                <Link href="/features">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section>
        <div>
          <div>
            <h2>How It Works</h2>
            <p>
              Three simple steps to professional quotes
            </p>
          </div>
          
          <div>
            <div>
              <div>
                1
              </div>
              <h3>Enter Project Details</h3>
              <p>
                Simply describe the painting project or use our room templates for instant setup.
              </p>
            </div>
            
            <div>
              <div>
                2
              </div>
              <h3>AI Calculates Everything</h3>
              <p>
                Our AI instantly calculates materials, labor, and provides accurate pricing based on your location.
              </p>
            </div>
            
            <div>
              <div>
                3
              </div>
              <h3>Send Professional Quote</h3>
              <p>
                Generate a beautiful, branded quote and send it directly to your customer's email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section>
        <div>
          <div>
            <div>
              <h2>Why 5,000+ Contractors Choose Paint Quote Pro</h2>
              <div>
                <div>
                  <div>
                    <CheckCircle />
                  </div>
                  <div>
                    <h4>Increase Win Rate by 40%</h4>
                    <p>Professional quotes impress customers and build trust</p>
                  </div>
                </div>
                
                <div>
                  <div>
                    <Clock />
                  </div>
                  <div>
                    <h4>Save 5+ Hours Per Week</h4>
                    <p>Automated calculations and instant quote generation</p>
                  </div>
                </div>
                
                <div>
                  <div>
                    <DollarSign />
                  </div>
                  <div>
                    <h4>Increase Revenue by 278%</h4>
                    <p>Accurate pricing and faster turnaround times</p>
                  </div>
                </div>
                
                <div>
                  <div>
                    <Smartphone />
                  </div>
                  <div>
                    <h4>Work From Anywhere</h4>
                    <p>Mobile-optimized for on-site estimates and quotes</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div>
                <div>
                  <TrendingUp />
                </div>
                <h3>278% ROI</h3>
                <p>Average return on investment in just 90 days</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section>
        <div>
          <div>
            <div>
              <div>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <blockquote>
                "Paint Quote Pro increased our revenue by $47,000 per month. The professional quotes 
                helped us win 60% more jobs than before."
              </blockquote>
              <div>
                <div>
                  MR
                </div>
                <div>
                  <div>Miguel Rodriguez</div>
                  <div>Rodriguez Painting, Texas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div>
          <h2>
            Ready to Win More Painting Jobs?
          </h2>
          <p>
            Join 5,000+ contractors who've increased their win rates with Paint Quote Pro. 
            Start your free trial today - no credit card required.
          </p>
          <div>
            <Link href="/trial-signup">
              Start Free Trial
              <ArrowRight />
            </Link>
            <Link href="/demo">
              Watch Demo
            </Link>
          </div>
          
          <div>
            <div>
              <div>
                <CheckCircle />
                <span>Free 14-day trial</span>
              </div>
              <div>
                <CheckCircle />
                <span>No credit card required</span>
              </div>
              <div>
                <CheckCircle />
                <span>Setup in 2 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  );
}