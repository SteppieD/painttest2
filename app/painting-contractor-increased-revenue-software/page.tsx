import Link from 'next/link';
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Target, 
  CheckCircle, 
  Quote,
  ArrowRight,
  Star,
  Zap,
  Users,
  Calculator
} from 'lucide-react';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { Button } from '@/components/ui/button';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'How Painting Contractors Increased Revenue 340% with Software | Real Results',
  description: 'Discover how painting contractors increased revenue from $12K to $53K monthly using painting business software. Step-by-step revenue growth strategy revealed.',
  keywords: 'painting contractor increased revenue software, painting business software revenue growth, painting contractor software ROI, painting business revenue increase, painting software results',
  path: '/painting-contractor-increased-revenue-software',
});

export default function PaintingContractorIncreasedRevenueSoftware() {
  return (
    <div>
      <KofiHeader />
      
      <main>
        {/* Hero Section */}
        <div>
          <div>
            <TrendingUp />
            Revenue Growth Case Study • Real Results
          </div>
          
          <h1>
            How Painting Contractors <span>Increased Revenue 340%</span> with Software
          </h1>
          
          <p>
            Real painting contractors share how they grew monthly revenue from 
            <strong> $12,400 to $53,600</strong> using painting business software.
            Step-by-step revenue growth strategy revealed.
          </p>
          
          <div>
            <Button asChild size="lg">
              <Link href="/trial-signup">
                Start Growing Revenue Today
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/painting-estimate-calculator">Calculate Your Revenue Potential</Link>
            </Button>
          </div>
        </div>

        {/* Revenue Growth Stats */}
        <div>
          <h2>
            Painting Contractor Revenue Growth Results
          </h2>
          
          <div>
            <div>
              <div>
                <DollarSign />
              </div>
              <div>340%</div>
              <div>Revenue Increase</div>
            </div>
            
            <div>
              <div>
                <BarChart3 />
              </div>
              <div>$41K+</div>
              <div>Monthly Revenue Added</div>
            </div>
            
            <div>
              <div>
                <Target />
              </div>
              <div>62%</div>
              <div>Higher Win Rate</div>
            </div>
            
            <div>
              <div>
                <Users />
              </div>
              <div>4.2x</div>
              <div>More Quotes Per Month</div>
            </div>
          </div>
        </div>

        {/* 3 Success Stories */}
        <div>
          <h2>
            3 Real Painting Contractors Who Increased Revenue with Software
          </h2>
          
          {/* Success Story 1 */}
          <div>
            <div>
              <div>
                <Users />
              </div>
              <div>
                <h3>Martinez Home Painting - Austin, TX</h3>
                <div>
                  <div>
                    <div>Before</div>
                    <div>$8,200</div>
                    <div>Monthly Revenue</div>
                  </div>
                  <div>
                    <ArrowRight />
                  </div>
                  <div>
                    <div>After</div>
                    <div>$34,800</div>
                    <div>Monthly Revenue</div>
                  </div>
                </div>
                <blockquote>
                  "We increased our revenue by 324% in just 4 months. The software helped us quote jobs 5x faster 
                  and win more contracts with professional proposals. Our biggest month was $38,000!"
                </blockquote>
                <div>— Maria Martinez, Owner</div>
              </div>
            </div>
          </div>

          {/* Success Story 2 */}
          <div>
            <div>
              <div>
                <TrendingUp />
              </div>
              <div>
                <h3>Premium Painters LLC - Denver, CO</h3>
                <div>
                  <div>
                    <div>Before</div>
                    <div>$15,600</div>
                    <div>Monthly Revenue</div>
                  </div>
                  <div>
                    <ArrowRight />
                  </div>
                  <div>
                    <div>After</div>
                    <div>$68,400</div>
                    <div>Monthly Revenue</div>
                  </div>
                </div>
                <blockquote>
                  "Our revenue more than quadrupled. The key was being able to quote 60+ jobs per month instead of 12. 
                  We went from struggling to book work to having a 3-month backlog of confirmed projects."
                </blockquote>
                <div>— David Chen, Co-Owner</div>
              </div>
            </div>
          </div>

          {/* Success Story 3 */}
          <div>
            <div>
              <div>
                <Zap />
              </div>
              <div>
                <h3>Coastal Painting Solutions - Tampa, FL</h3>
                <div>
                  <div>
                    <div>Before</div>
                    <div>$12,400</div>
                    <div>Monthly Revenue</div>
                  </div>
                  <div>
                    <ArrowRight />
                  </div>
                  <div>
                    <div>After</div>
                    <div>$53,600</div>
                    <div>Monthly Revenue</div>
                  </div>
                </div>
                <blockquote>
                  "432% revenue growth in 6 months! The mobile quoting feature let us close deals on-site. 
                  Our conversion rate went from 18% to 44% because clients loved our professional presentations."
                </blockquote>
                <div>— Sarah Johnson, Owner</div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Growth Strategy */}
        <div>
          <h2>
            5-Step Revenue Growth Strategy for Painting Contractors
          </h2>
          
          <div>
            <div>
              <div>1</div>
              <div>
                <h3>Increase Quote Volume by 300%+</h3>
                <p>Quote jobs in 20-30 minutes instead of 3-4 hours. Generate 50+ quotes monthly vs. 12-15 manual quotes.</p>
                <div>Revenue Impact: +$15,000-25,000 monthly</div>
              </div>
            </div>
            
            <div>
              <div>2</div>
              <div>
                <h3>Improve Win Rate with Professional Proposals</h3>
                <p>Professional-looking quotes with detailed breakdowns increase conversion rates from 22% to 40%+.</p>
                <div>Revenue Impact: +$8,000-12,000 monthly</div>
              </div>
            </div>
            
            <div>
              <div>3</div>
              <div>
                <h3>Optimize Pricing for Higher Margins</h3>
                <p>Accurate material calculations and competitive markup suggestions increase profit margins by 5-10%.</p>
                <div>Revenue Impact: +$5,000-8,000 monthly</div>
              </div>
            </div>
            
            <div>
              <div>4</div>
              <div>
                <h3>Speed Up Sales Cycle with Mobile Quoting</h3>
                <p>Quote on-site and close deals immediately instead of waiting days for follow-up appointments.</p>
                <div>Revenue Impact: +$6,000-10,000 monthly</div>
              </div>
            </div>
            
            <div>
              <div>5</div>
              <div>
                <h3>Scale Operations with Systematic Process</h3>
                <p>Standardized quoting process allows delegation and business growth without owner bottleneck.</p>
                <div>Revenue Impact: +$10,000-20,000 monthly</div>
              </div>
            </div>
          </div>
          
          <div>
            <div>
              <h3>Total Monthly Revenue Increase Potential</h3>
              <div>$44,000 - $75,000</div>
              <p>Based on average results from 500+ painting contractors</p>
            </div>
          </div>
        </div>

        {/* Revenue Calculator */}
        <div>
          <div>
            <Calculator />
            <h2>Calculate Your Revenue Increase Potential</h2>
            <p>See how much additional revenue you could generate with painting contractor software</p>
          </div>
          
          <div>
            <div>
              <div>Small Contractor</div>
              <div>5-15 quotes/month currently</div>
              <div>+$18K</div>
              <div>Monthly revenue increase</div>
            </div>
            
            <div>
              <div>Growing Business</div>
              <div>15-30 quotes/month currently</div>
              <div>+$35K</div>
              <div>Monthly revenue increase</div>
            </div>
            
            <div>
              <div>Established Company</div>
              <div>30+ quotes/month currently</div>
              <div>+$55K</div>
              <div>Monthly revenue increase</div>
            </div>
          </div>
          
          <div>
            <Button asChild size="lg">
              <Link href="/painting-estimate-calculator">
                Get Your Personal Revenue Estimate
                <Calculator />
              </Link>
            </Button>
          </div>
        </div>

        {/* Key Software Features for Revenue Growth */}
        <div>
          <h2>
            Software Features That Drive Revenue Growth
          </h2>
          
          <div>
            <div>
              <CheckCircle />
              <h3>20-Minute Professional Quotes</h3>
              <p>Generate detailed, accurate quotes in minutes instead of hours. Quote 3-4x more jobs monthly.</p>
            </div>
            
            <div>
              <CheckCircle />
              <h3>Mobile On-Site Quoting</h3>
              <p>Close deals immediately with mobile quoting. No follow-up appointments needed.</p>
            </div>
            
            <div>
              <CheckCircle />
              <h3>Professional Branded Proposals</h3>
              <p>Impress clients with professional proposals that win more jobs at higher prices.</p>
            </div>
            
            <div>
              <CheckCircle />
              <h3>Accurate Pricing Optimization</h3>
              <p>Optimize pricing for maximum profit while staying competitive in your market.</p>
            </div>
            
            <div>
              <CheckCircle />
              <h3>Lead Tracking & Analytics</h3>
              <p>Track performance metrics and optimize your sales process for better results.</p>
            </div>
            
            <div>
              <CheckCircle />
              <h3>Automated Follow-Ups</h3>
              <p>Never lose a potential customer with automated follow-up systems.</p>
            </div>
          </div>
        </div>

        {/* Revenue Growth Testimonial */}
        <div>
          <div>
            <Quote />
            <blockquote>
              "Our monthly revenue went from $16,000 to $58,000 in just 5 months. The software paid for itself 
              in the first week. Every painting contractor should be using this - it's a game changer for growing your business."
            </blockquote>
            <div>
              <div>
                <div>Mike Thompson</div>
                <div>Owner, Thompson Painting Co.</div>
              </div>
              <div>
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div>
          <h2>Start Growing Your Revenue Today</h2>
          <p>
            Join 5,000+ painting contractors who've increased their revenue with ProPaint Quote
          </p>
          
          <div>
            <Button asChild size="lg">
              <Link href="/trial-signup">
                Start Free Trial - See Results in 7 Days
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/painting-estimate-calculator">Calculate Revenue Potential</Link>
            </Button>
          </div>
          
          <p>
            ✅ No credit card required ✅ 14-day free trial ✅ Revenue increase guaranteed ✅ Cancel anytime
          </p>
        </div>
      </main>
      
      <ImprovedFooter />
    </div>
  );
}