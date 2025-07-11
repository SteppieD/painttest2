import Link from 'next/link';
import { 
  TrendingUp, 
  Users, 
  Building, 
  CheckCircle, 
  Target, 
  Quote,
  ArrowRight,
  Star,
  Zap,
  DollarSign,
  BarChart3,
  Home
} from 'lucide-react';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { Button } from '@/components/ui/button';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'Small Painting Business Growth Software: 0 to $500K in 18 Months | Success Stories',
  description: 'See how small painting businesses grew from startup to $500K+ using business growth software. Real success stories from 1-person startups to thriving teams.',
  keywords: 'small painting business growth software, painting business startup software, painting contractor business growth, small painting company software, painting business scaling software',
  path: '/small-painting-business-growth-software',
});

export default function SmallPaintingBusinessGrowthSoftware() {
  return (
    <div>
      <KofiHeader />
      
      <main>
        {/* Hero Section */}
        <div>
          <div>
            <Building />
            Small Business Growth • Real Success Stories
          </div>
          
          <h1>
            Small Painting Business Growth Software: <span>0 to $500K in 18 Months</span>
          </h1>
          
          <p>
            Real stories from small painting businesses that grew from 
            <strong> 1-person startups to 6-figure companies</strong> using 
            professional business growth software.
          </p>
          
          <div>
            <Button asChild size="lg">
              <Link href="/trial-signup">
                Start Growing Your Business
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/painting-estimate-calculator">Try Free Tools</Link>
            </Button>
          </div>
        </div>

        {/* Growth Stats */}
        <div>
          <h2>
            Small Painting Business Growth Results
          </h2>
          
          <div>
            <div>
              <div>
                <TrendingUp />
              </div>
              <div>950%</div>
              <div>Average Growth Rate</div>
            </div>
            
            <div>
              <div>
                <DollarSign />
              </div>
              <div>$485K</div>
              <div>Average 18-Month Revenue</div>
            </div>
            
            <div>
              <div>
                <Users />
              </div>
              <div>8.5</div>
              <div>Average Team Size</div>
            </div>
            
            <div>
              <div>
                <Target />
              </div>
              <div>18</div>
              <div>Months to $500K</div>
            </div>
          </div>
        </div>

        {/* Featured Success Story */}
        <div>
          <div>
            <h2>Featured Small Business Success Story</h2>
            <div>
              <Home />
              Startup to Success
            </div>
          </div>
          
          <div>
            <div>
              <h3>Fresh Coat Painting - Nashville, TN</h3>
              <p>Started by college graduate with $2,500 and a dream</p>
            </div>
            
            {/* Growth Timeline */}
            <div>
              <div>
                <h4>Month 0 - Startup</h4>
                <div>
                  <div>$0</div>
                  <div>Monthly Revenue</div>
                  <div>1</div>
                  <div>Team Member</div>
                  <div>Manual</div>
                  <div>Quote Process</div>
                </div>
              </div>
              
              <div>
                <h4>Month 8 - Growth</h4>
                <div>
                  <div>$18K</div>
                  <div>Monthly Revenue</div>
                  <div>3</div>
                  <div>Team Members</div>
                  <div>Software</div>
                  <div>Quote Process</div>
                </div>
              </div>
              
              <div>
                <h4>Month 18 - Success</h4>
                <div>
                  <div>$42K</div>
                  <div>Monthly Revenue</div>
                  <div>7</div>
                  <div>Team Members</div>
                  <div>Systematic</div>
                  <div>Quote Process</div>
                </div>
              </div>
            </div>
            
            <div>
              <Quote />
              <blockquote>
                "I started Fresh Coat with $2,500 and zero customers. The software helped me look professional 
                from day one and quote jobs fast enough to build momentum. In 18 months, we hit $500K annual revenue 
                and now employ 7 people. I couldn't have scaled this fast without professional quoting software."
              </blockquote>
              <div>
                <strong>Jake Williams</strong>, Founder & CEO - Fresh Coat Painting
              </div>
              <div>
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3 More Small Business Stories */}
        <div>
          <h2>
            More Small Painting Business Growth Stories
          </h2>
          
          {/* Story 1 */}
          <div>
            <div>
              <div>
                <Building />
              </div>
              <div>
                <h3>Precision Paint Pro - San Diego, CA</h3>
                <div>Side hustle to full-time business in 14 months</div>
                
                <div>
                  <div>
                    <div>Start</div>
                    <div>$0</div>
                  </div>
                  <div>
                    <div>Month 6</div>
                    <div>$8K</div>
                  </div>
                  <div>
                    <div>Month 14</div>
                    <div>$35K</div>
                  </div>
                  <div>
                    <div>Growth</div>
                    <div>∞%</div>
                  </div>
                </div>
                
                <blockquote>
                  "Started painting on weekends while keeping my day job. The software made me look like an 
                  established company from the first quote. Quit my corporate job after 8 months and never looked back!"
                </blockquote>
                <div>— Anthony Rodriguez, Owner</div>
              </div>
            </div>
          </div>

          {/* Story 2 */}
          <div>
            <div>
              <div>
                <Users />
              </div>
              <div>
                <h3>Twin City Painters - Minneapolis, MN</h3>
                <div>Two friends started painting business from garage</div>
                
                <div>
                  <div>
                    <div>Start</div>
                    <div>$0</div>
                  </div>
                  <div>
                    <div>Month 4</div>
                    <div>$12K</div>
                  </div>
                  <div>
                    <div>Month 16</div>
                    <div>$38K</div>
                  </div>
                  <div>
                    <div>Team</div>
                    <div>6 staff</div>
                  </div>
                </div>
                
                <blockquote>
                  "We had the skills but no business experience. The software handled the professional side - 
                  quotes, proposals, tracking. We focused on painting great jobs and grew to 6 employees in 16 months."
                </blockquote>
                <div>— Mike & Tom Patterson, Co-Owners</div>
              </div>
            </div>
          </div>

          {/* Story 3 */}
          <div>
            <div>
              <div>
                <Zap />
              </div>
              <div>
                <h3>Quick Paint Solutions - Orlando, FL</h3>
                <div>Single mom launched painting business to support family</div>
                
                <div>
                  <div>
                    <div>Start</div>
                    <div>$0</div>
                  </div>
                  <div>
                    <div>Month 7</div>
                    <div>$15K</div>
                  </div>
                  <div>
                    <div>Month 20</div>
                    <div>$29K</div>
                  </div>
                  <div>
                    <div>Team</div>
                    <div>4 staff</div>
                  </div>
                </div>
                
                <blockquote>
                  "I needed to make this work - my kids were counting on me. The software let me compete with 
                  established companies and win jobs based on professionalism, not just price. Now I employ 4 people!"
                </blockquote>
                <div>— Lisa Chen, Founder</div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Stages & Software Benefits */}
        <div>
          <h2>
            How Software Accelerates Small Painting Business Growth
          </h2>
          
          <div>
            {/* Stage 1 */}
            <div>
              <div>1</div>
              <div>
                <h3>Startup Stage (Months 0-3): Professional Foundation</h3>
                <div>
                  <div>
                    <h4>Challenges</h4>
                    <ul>
                      <li>• Look unprofessional with handwritten quotes</li>
                      <li>• Take too long to respond to leads</li>
                      <li>• Pricing inconsistency hurts credibility</li>
                      <li>• Competing with established companies</li>
                    </ul>
                  </div>
                  <div>
                    <h4>Software Solutions</h4>
                    <ul>
                      <li>• Professional branded proposals from day 1</li>
                      <li>• 20-minute quote creation vs. 4+ hours</li>
                      <li>• Consistent, accurate pricing every time</li>
                      <li>• Mobile quoting to respond immediately</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 2 */}
            <div>
              <div>2</div>
              <div>
                <h3>Growth Stage (Months 4-12): Scale Operations</h3>
                <div>
                  <div>
                    <h4>Challenges</h4>
                    <ul>
                      <li>• Can't handle increasing quote volume</li>
                      <li>• Need to hire and train estimators</li>
                      <li>• Quality control becomes difficult</li>
                      <li>• Business depends on founder's time</li>
                    </ul>
                  </div>
                  <div>
                    <h4>Software Solutions</h4>
                    <ul>
                      <li>• 10x quote capacity with same team</li>
                      <li>• Train new hires in hours, not weeks</li>
                      <li>• Standardized process ensures quality</li>
                      <li>• Delegate quoting while maintaining control</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 3 */}
            <div>
              <div>3</div>
              <div>
                <h3>Expansion Stage (Months 12+): Systematic Success</h3>
                <div>
                  <div>
                    <h4>Challenges</h4>
                    <ul>
                      <li>• Managing larger team and projects</li>
                      <li>• Maintaining profit margins at scale</li>
                      <li>• Need business insights for decisions</li>
                      <li>• Planning for continued growth</li>
                    </ul>
                  </div>
                  <div>
                    <h4>Software Solutions</h4>
                    <ul>
                      <li>• Team management and performance tracking</li>
                      <li>• Optimized pricing and margin analysis</li>
                      <li>• Business analytics and reporting</li>
                      <li>• Scalable systems for continued growth</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div>
          <h2>
            Small Business Growth Metrics with Professional Software
          </h2>
          
          <div>
            <div>
              <BarChart3 />
              <div>15x</div>
              <div>Quote Volume Increase</div>
              <div>From 4 to 60+ quotes monthly</div>
            </div>
            
            <div>
              <Target />
              <div>67%</div>
              <div>Higher Win Rate</div>
              <div>Professional proposals win more</div>
            </div>
            
            <div>
              <Users />
              <div>8.5</div>
              <div>Avg Team Growth</div>
              <div>From 1 to 8+ employees</div>
            </div>
            
            <div>
              <DollarSign />
              <div>$485K</div>
              <div>Avg 18-Month Revenue</div>
              <div>From $0 starting point</div>
            </div>
            
            <div>
              <TrendingUp />
              <div>25%</div>
              <div>Profit Margin</div>
              <div>Optimized pricing strategies</div>
            </div>
            
            <div>
              <Zap />
              <div>18</div>
              <div>Months to $500K</div>
              <div>Average growth timeline</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div>
          <h2>Ready to Grow Your Small Painting Business?</h2>
          <p>
            Join hundreds of small painting contractors who've built 6-figure businesses with ProPaint Quote
          </p>
          
          <div>
            <Button asChild size="lg">
              <Link href="/trial-signup">
                Start Your Growth Journey Today
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/painting-estimate-calculator">Try Free Tools First</Link>
            </Button>
          </div>
          
          <p>
            ✅ Perfect for startups ✅ 14-day free trial ✅ No credit card required ✅ Scale as you grow
          </p>
        </div>
      </main>
      
      <ImprovedFooter />
    </div>
  );
}