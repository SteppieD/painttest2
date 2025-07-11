import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Calculator, 
  Zap, 
  Users, 
  Star,
  ArrowRight,
  CheckCircle,
  Palette,
  Clock,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';

export const metadata: Metadata = {
  title: 'Ko-fi Inspired Design Demo - Paint Quote Pro',
  description: 'Demo of Ko-fi inspired design system for Paint Quote Pro',
};

export default function KofiDemoPage() {
  return (
    <div>
      <KofiHeader />
      
      {/* Ko-fi Hero Section */}
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
                <div>
                  <TrendingUp />
                </div>
                <div>278%</div>
                <div>Average ROI in 90 days</div>
              </div>
            </div>
            
            <div>
              <div>
                <div>
                  <Clock />
                </div>
                <div>30 sec</div>
                <div>Average quote creation time</div>
              </div>
            </div>
            
            <div>
              <div>
                <div>
                  <DollarSign />
                </div>
                <div>$47K</div>
                <div>Monthly revenue increase</div>
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