import { Metadata } from 'next'
import { KofiHeader } from '@/components/shared/kofi-header'
import { ImprovedFooter } from '@/components/shared/improved-footer'
import { ROICalculator } from '@/components/marketing/roi-calculator'

export const metadata: Metadata = {
  title: 'ROI Calculator - See How Much More You Could Earn | ProPaint Quote',
  description: 'Calculate your potential revenue increase with professional painting quotes. See how much more you could earn with 40-60% higher win rates and faster response times.',
  keywords: 'painting contractor ROI, quote calculator, painting business revenue, contractor earnings calculator',
}

export default function ROICalculatorPage() {
  return (
    <div>
      <KofiHeader />
      
      {/* Hero Section */}
      <section>
        <div>
          <h1>
            Calculate Your Revenue Potential
          </h1>
          <p>
            See exactly how much more revenue you could generate with professional quotes and faster response times
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section>
        <ROICalculator />
      </section>

      {/* Why These Numbers Matter */}
      <section>
        <div>
          <h2>
            Why These Numbers Matter
          </h2>
          
          <div>
            <div>
              <div>
                <span>24h</span>
              </div>
              <h3>Speed Wins Jobs</h3>
              <p>
                Research shows that the 24-48 hour response window is make-or-break. After that, win probability drops 15-25% per day.
              </p>
            </div>
            
            <div>
              <div>
                <span>60%</span>
              </div>
              <h3>Professional Presentation</h3>
              <p>
                Professional-looking estimates drive 40-60% higher win rates. Customers see quality tools as a signal of quality work.
              </p>
            </div>
            
            <div>
              <div>
                <span>4.5h</span>
              </div>
              <h3>Time Savings</h3>
              <p>
                Manual quotes take 2-6 hours. Our app reduces that to 6 minutes. That's 4.5 hours saved per quote you can spend on profitable work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section>
        <div>
          <h2>
            Real Results from Painting Contractors
          </h2>
          
          <div>
            <div>
              <div>
                <div>
                  <div>
                    <span>MJ</span>
                  </div>
                  <div>
                    <h4>Mike Johnson</h4>
                    <p>Solo Contractor, Texas</p>
                  </div>
                </div>
                <p>
                  "My closing rate has skyrocketed. The estimates look super professional and I can deliver them while I'm still at the customer's house."
                </p>
                <div>
                  <div>
                    <span>Monthly Revenue Increase:</span>
                    <span>+$8,400</span>
                  </div>
                  <div>
                    <span>Time Saved per Month:</span>
                    <span>67 hours</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div>
                <div>
                  <div>
                    <span>SR</span>
                  </div>
                  <div>
                    <h4>Sarah Rodriguez</h4>
                    <p>Small Team (3 employees), California</p>
                  </div>
                </div>
                <p>
                  "Our quotation rate increased from 50 to over 200 per month. It has increased the speed that we can win work four times over."
                </p>
                <div>
                  <div>
                    <span>Monthly Revenue Increase:</span>
                    <span>+$15,200</span>
                  </div>
                  <div>
                    <span>Quote Volume Increase:</span>
                    <span>300%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  )
}