import Link from 'next/link';
import { 
  Check, 
  Star, 
  Zap, 
  Users, 
  Crown, 
  ArrowRight,
  CheckCircle,
  X,
  Sparkles,
  TrendingUp,
  Shield,
  Clock,
  Calculator,
  Smartphone,
  Target,
  Award,
  Percent
} from 'lucide-react';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { TestimonialCarousel } from '@/components/marketing/testimonial-carousel';
import { ModernPricingTable } from '@/components/stripe/modern-pricing-table';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'Pricing',
  description: 'Transparent pricing for ProPaint Quote. Start free, upgrade as you grow. No contracts, no hidden fees.',
  keywords: 'painting software pricing, painting quote software cost, contractor software pricing',
  path: '/pricing',
});

export default function PricingPage() {
  // CIALDINI PRINCIPLE: Social Proof with real customer data
  const socialProofStats = [
    { number: "5,000+", label: "Active Contractors", icon: Users },
    { number: "40%", label: "Win Rate Increase", icon: TrendingUp },
    { number: "$73M+", label: "Quotes Generated", icon: Calculator },
    { number: "4.9/5", label: "Customer Rating", icon: Star }
  ];

  // CIALDINI PRINCIPLE: Authority through feature comparison
  const featureComparison = [
    { feature: "Monthly Quotes", free: "10 Quotes", professional: "Unlimited", business: "Unlimited" },
    { feature: "Mobile App", free: true, professional: true, business: true },
    { feature: "Custom Branding", free: false, professional: true, business: true },
    { feature: "Analytics Dashboard", free: "Basic", professional: "Advanced", business: "Enterprise" },
    { feature: "Team Management", free: false, professional: false, business: "Up to 5 users" },
    { feature: "API Access", free: false, professional: false, business: true },
    { feature: "Phone Support", free: false, professional: true, business: "Dedicated Manager" },
    { feature: "Custom Integrations", free: false, professional: "QuickBooks", business: "Unlimited" }
  ];

  return (
    <div>
      <KofiHeader />
      
      <section>
        <div>
          <div>
            <div>
              <Star />
              <span>Trusted by 5,000+ Professional Contractors</span>
            </div>
            
            <h1>
              Simple Pricing That <span>Scales With You</span>
            </h1>
            <p>
              Start free, upgrade when ready. No contracts, no hidden fees. 
              Join thousands of contractors winning 40% more jobs.
            </p>
          
            <div>
              {socialProofStats.map((stat, index) => {
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
            
            <p>⚡ Most contractors see ROI within their first quote</p>
          </div>
        </div>
      </section>

      <section>
        <div>
          <div>
            <div>
              <Percent />
              <span>Save 20% with Annual Billing</span>
            </div>
            <h2>
              Choose Your <span>Growth Plan</span>
            </h2>
            <p>
              Every plan includes all core features. Upgrade anytime as your business grows.
            </p>
          </div>
          
          <ModernPricingTable />
        </div>
      </section>

      <section>
        <div>
          <div>
            <h2>
              Compare All <span>Features</span>
            </h2>
            <p>
              See exactly what's included in each plan. No hidden features or surprise limitations.
            </p>
          </div>
          
          <div>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Features</th>
                    <th>Perfect Start</th>
                    <th>
                      <div>
                        <span>Professional</span>
                        <span>Most Popular</span>
                      </div>
                    </th>
                    <th>Business</th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((row, index) => (
                    <tr key={index}>
                      <td>{row.feature}</td>
                      <td>
                        {typeof row.free === 'boolean' ? (
                          row.free ? <Check /> : <X />
                        ) : (
                          <span>{row.free}</span>
                        )}
                      </td>
                      <td>
                        {typeof row.professional === 'boolean' ? (
                          row.professional ? <Check /> : <X />
                        ) : (
                          <span>{row.professional}</span>
                        )}
                      </td>
                      <td>
                        {typeof row.business === 'boolean' ? (
                          row.business ? <Check /> : <X />
                        ) : (
                          <span>{row.business}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <TestimonialCarousel />

      <section>
        <div>
          <div>
            <h2>
              Calculate Your <span>ROI</span>
            </h2>
            <p>
              See how much revenue ProPaint Quote can generate for your business
            </p>
          </div>
          
          <div>
            <div>
            <div>
              <div>
                <Calculator />
                <h3>Average Contractor</h3>
                <div>
                  <div>Quotes per month: <span>20</span></div>
                  <div>Average quote value: <span>$3,500</span></div>
                  <div>Current win rate: <span>30%</span></div>
                </div>
              </div>
              
              <div>
                <TrendingUp />
                <h3>With ProPaint Quote</h3>
                <div>
                  <div>Win rate increase: <span>+40%</span></div>
                  <div>New win rate: <span>42%</span></div>
                  <div>Time saved per quote: <span>3 hours</span></div>
                </div>
              </div>
              
              <div>
                <Target />
                <h3>Monthly Impact</h3>
                <div>
                  <div>Additional revenue: <span>$8,400</span></div>
                  <div>Time saved: <span>60 hours</span></div>
                  <div>ROI: <span>29,000%</span></div>
                </div>
              </div>
            </div>
            
              <div>
                <div>
                  ProPaint Quote pays for itself with just 1 additional job per month
                </div>
                <Link href="/trial-signup">
                  Start Earning More Today
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div>
          <div>
            <h2>
              Frequently Asked <span>Questions</span>
            </h2>
            <p>
              Get answers to common questions about our pricing and features
            </p>
          </div>
          
          <div>
            {[
              {
                q: "Can I really start with 10 free quotes?",
                a: "Absolutely! No credit card required. You get full access to all features for your first 10 quotes. 95% of contractors who try us end up upgrading within 30 days because they see immediate results and revenue increase."
              },
              {
                q: "What happens if I exceed my monthly quote limit?",
                a: "We'll send you a friendly reminder when you're at 80% of your limit. You can upgrade anytime or purchase additional quotes. We never cut off access mid-month - your business comes first."
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes, no contracts or cancellation fees. You can cancel anytime from your account settings. We're confident you'll love the results, which is why we make it risk-free."
              },
              {
                q: "Do you offer discounts for annual payments?",
                a: "Yes! Save 20% when you pay annually. Plus, annual customers get priority support and exclusive features first. Most contractors save $200+ per year this way."
              },
              {
                q: "Is there a setup fee?",
                a: "No setup fees, ever. We include free onboarding for all paid plans, including data migration from your existing tools. Our success team will get you up and running in under 30 minutes."
              },
              {
                q: "What kind of support do you provide?",
                a: "All plans include email support. Starter+ plans get chat support. Professional+ plans get phone support. Business plans get a dedicated success manager. Average response time is under 2 hours."
              }
            ].map((faq, index) => (
              <div key={index}>
                <div>
                  <h3>{faq.q}</h3>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div>
          <div>
            <Sparkles />
            <span>Limited Time: 10 Free Quotes for Early Adopters</span>
          </div>
          
          <h2>
            Ready to <span>14x Your Quote Speed?</span>
          </h2>
          <p>
            Join 5,000+ contractors who've transformed their businesses. 
            Start free, see results immediately, scale as you grow.
          </p>
          
          <div>
            <Link href="/trial-signup">
              Start Free Trial - 10 Quotes Included
              <ArrowRight />
            </Link>
            <Link href="/demo">
              Watch Live Demo
            </Link>
          </div>
          
          <div>
            <span>✓ No credit card required</span>
            <span>✓ Full feature access</span>
            <span>✓ Cancel anytime</span>
          </div>
          
          <div>
            <div>
              {[...Array(5)].map((_, i) => (
                <Star key={i} />
              ))}
            </div>
            <p>
              "Best investment I've made for my painting business. ROI was immediate." - Mike Johnson, Elite Painting Co.
            </p>
          </div>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  );
}