import Link from 'next/link';
import { 
  Clock, 
  Zap, 
  CheckCircle, 
  Users, 
  Target, 
  Quote,
  ArrowRight,
  Star,
  TrendingUp,
  BarChart3,
  Timer,
  Award
} from 'lucide-react';
import { KofiHeader } from '@/components/shared/kofi-header';
import { ImprovedFooter } from '@/components/shared/improved-footer';
import { Button } from '@/components/ui/button';
import { generatePageMetadata } from '@/lib/metadata-utils';

export const metadata = generatePageMetadata({
  title: 'Painting Estimate Software Success Story: From 4 Hours to 18 Minutes | Real Results',
  description: 'See how painting contractors save 85% time with estimate software. Real success stories from contractors who cut quote time from hours to minutes.',
  keywords: 'painting estimate software success story, painting estimating software results, painting quote software time savings, painting contractor efficiency software, painting estimate software testimonials',
  path: '/painting-estimate-software-success-story',
});

export default function PaintingEstimateSoftwareSuccessStory() {
  return (
    <div>
      <KofiHeader />
      
      <main>
        {/* Hero Section */}
        <div>
          <div>
            <Clock />
            Time Savings Success Story • Real Results
          </div>
          
          <h1>
            Painting Estimate Software Success Story: <span>From 4 Hours to 18 Minutes</span>
          </h1>
          
          <p>
            Real painting contractors share how estimate software transformed their businesses, 
            <strong> saving 85% of quote time</strong> and allowing them to quote 
            <strong> 10x more jobs monthly</strong>.
          </p>
          
          <div>
            <Button asChild size="lg">
              <Link href="/trial-signup">
                Start Saving Time Today
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/painting-estimate-calculator">Try Free Estimate Tool</Link>
            </Button>
          </div>
        </div>

        {/* Time Savings Stats */}
        <div>
          <h2>
            Painting Estimate Software Time Savings Results
          </h2>
          
          <div>
            <div>
              <div>
                <Clock />
              </div>
              <div>85%</div>
              <div>Time Savings</div>
            </div>
            
            <div>
              <div>
                <Timer />
              </div>
              <div>18min</div>
              <div>Average Quote Time</div>
            </div>
            
            <div>
              <div>
                <TrendingUp />
              </div>
              <div>1,200%</div>
              <div>Productivity Increase</div>
            </div>
            
            <div>
              <div>
                <Award />
              </div>
              <div>92%</div>
              <div>Customer Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Main Success Story */}
        <div>
          <div>
            <h2>Featured Success Story</h2>
            <div>
              <Award />
              Customer Spotlight
            </div>
          </div>
          
          <div>
            <div>
              <h3>Elite Painting Solutions - Phoenix, AZ</h3>
              <p>Family-owned painting business serving Phoenix since 2018</p>
            </div>
            
            {/* Before/After Comparison */}
            <div>
              <div>
                <h4>Before Estimate Software</h4>
                <div>
                  <div>
                    <span>Quote Creation Time</span>
                    <span>3.5-4.5 hours</span>
                  </div>
                  <div>
                    <span>Quotes Per Week</span>
                    <span>4-6</span>
                  </div>
                  <div>
                    <span>Accuracy Issues</span>
                    <span>25% rework</span>
                  </div>
                  <div>
                    <span>Client Response</span>
                    <span>48-72 hours</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4>After ProPaint Quote</h4>
                <div>
                  <div>
                    <span>Quote Creation Time</span>
                    <span>15-25 minutes</span>
                  </div>
                  <div>
                    <span>Quotes Per Week</span>
                    <span>35-45</span>
                  </div>
                  <div>
                    <span>Accuracy Issues</span>
                    <span>2% rework</span>
                  </div>
                  <div>
                    <span>Client Response</span>
                    <span>Same day</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Quote />
              <blockquote>
                "The time savings are incredible. What used to take me an entire afternoon now takes 18 minutes. 
                I can quote jobs on-site and give customers immediate responses. We've grown from 4 quotes per week 
                to 40+ quotes per week, and our win rate increased from 28% to 52%. It's completely transformed our business."
              </blockquote>
              <div>
                <strong>Robert Martinez</strong>, Owner - Elite Painting Solutions
              </div>
              <div>
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Time Comparison Chart */}
        <div>
          <h2>
            Estimate Creation Time: Manual vs Software
          </h2>
          
          <div>
            <div>
              <div>
                <span>Manual Estimate Process</span>
                <span>4.2 hours average</span>
              </div>
              <div>
                <div></div>
              </div>
              <div>Site visit → Manual calculations → Pricing research → Proposal creation → Follow-up</div>
            </div>
            
            <div>
              <div>
                <span>ProPaint Quote Software</span>
                <span>18 minutes average</span>
              </div>
              <div>
                <div></div>
              </div>
              <div>Measurements → One-click paint selection → Instant calculations → Professional proposal → Send immediately</div>
            </div>
          </div>
          
          <div>
            <div>
              <Zap />
              <span>93% Time Reduction</span>
            </div>
          </div>
        </div>

        {/* More Success Stories */}
        <div>
          <h2>
            More Painting Estimate Software Success Stories
          </h2>
          
          {/* Success Story Grid */}
          <div>
            {/* Story 1 */}
            <div>
              <div>
                <div>
                  <Users />
                </div>
                <div>
                  <h3>Perfect Paint Co.</h3>
                  <p>Seattle, WA</p>
                </div>
              </div>
              
              <div>
                <div>
                  <div>Before</div>
                  <div>3.8 hrs</div>
                </div>
                <div>
                  <div>After</div>
                  <div>22 min</div>
                </div>
              </div>
              
              <blockquote>
                "We increased our quote capacity by 900%. Now we can respond to leads the same day instead of next week."
              </blockquote>
              <div>— Jennifer Liu, Owner</div>
            </div>
            
            {/* Story 2 */}
            <div>
              <div>
                <div>
                  <Target />
                </div>
                <div>
                  <h3>Precision Painters</h3>
                  <p>Charlotte, NC</p>
                </div>
              </div>
              
              <div>
                <div>
                  <div>Before</div>
                  <div>5.2 hrs</div>
                </div>
                <div>
                  <div>After</div>
                  <div>16 min</div>
                </div>
              </div>
              
              <blockquote>
                "The mobile quoting feature is a game-changer. We close 60% of deals on-site now vs. 15% before."
              </blockquote>
              <div>— Marcus Johnson, Co-Owner</div>
            </div>
            
            {/* Story 3 */}
            <div>
              <div>
                <div>
                  <BarChart3 />
                </div>
                <div>
                  <h3>Artisan Painting</h3>
                  <p>Miami, FL</p>
                </div>
              </div>
              
              <div>
                <div>
                  <div>Before</div>
                  <div>4.5 hrs</div>
                </div>
                <div>
                  <div>After</div>
                  <div>19 min</div>
                </div>
              </div>
              
              <blockquote>
                "Accuracy improved dramatically. No more embarrassing pricing errors or forgotten materials in quotes."
              </blockquote>
              <div>— Sofia Rodriguez, Estimator</div>
            </div>
            
            {/* Story 4 */}
            <div>
              <div>
                <div>
                  <Zap />
                </div>
                <div>
                  <h3>Fast Track Painting</h3>
                  <p>Portland, OR</p>
                </div>
              </div>
              
              <div>
                <div>
                  <div>Before</div>
                  <div>6.1 hrs</div>
                </div>
                <div>
                  <div>After</div>
                  <div>14 min</div>
                </div>
              </div>
              
              <blockquote>
                "From 8 quotes per month to 75 quotes per month. Our business doubled in size within 6 months."
              </blockquote>
              <div>— Alex Kim, Owner</div>
            </div>
          </div>
        </div>

        {/* ROI of Time Savings */}
        <div>
          <h2>
            The ROI of Time Savings with Painting Estimate Software
          </h2>
          
          <div>
            <div>
              <div>
                <Clock />
              </div>
              <h3>Time Saved</h3>
              <div>3.5 hours</div>
              <p>Per quote vs. manual process</p>
            </div>
            
            <div>
              <div>
                <TrendingUp />
              </div>
              <h3>Extra Quotes</h3>
              <div>8-12x</div>
              <p>More quotes possible monthly</p>
            </div>
            
            <div>
              <div>
                <Award />
              </div>
              <h3>Value Created</h3>
              <div>$2,800+</div>
              <p>Monthly value of time saved</p>
            </div>
          </div>
          
          <div>
            <h3>Software pays for itself in 2.1 days</h3>
            <p>Based on average contractor hourly rate of $85 and time savings achieved</p>
          </div>
        </div>

        {/* Call to Action */}
        <div>
          <h2>Start Saving Time with Your Estimates Today</h2>
          <p>
            Join thousands of painting contractors who've transformed their quoting process
          </p>
          
          <div>
            <Button asChild size="lg">
              <Link href="/trial-signup">
                Start Free Trial - Create First Quote in 5 Minutes
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/painting-estimate-calculator">Try Free Estimate Tool</Link>
            </Button>
          </div>
          
          <p>
            ✅ No credit card required ✅ 18-minute average quote time ✅ Professional proposals ✅ Mobile ready
          </p>
        </div>
      </main>
      
      <ImprovedFooter />
    </div>
  );
}