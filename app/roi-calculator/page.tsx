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
    <div className="min-h-screen bg-white">
      <KofiHeader />
      
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Calculate Your Revenue Potential
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            See exactly how much more revenue you could generate with professional quotes and faster response times
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 px-4">
        <ROICalculator />
      </section>

      {/* Why These Numbers Matter */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why These Numbers Matter
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">24h</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Speed Wins Jobs</h3>
              <p className="text-gray-600">
                Research shows that the 24-48 hour response window is make-or-break. After that, win probability drops 15-25% per day.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">60%</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Professional Presentation</h3>
              <p className="text-gray-600">
                Professional-looking estimates drive 40-60% higher win rates. Customers see quality tools as a signal of quality work.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">4.5h</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Time Savings</h3>
              <p className="text-gray-600">
                Manual quotes take 2-6 hours. Our app reduces that to 6 minutes. That's 4.5 hours saved per quote you can spend on profitable work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Real Results from Painting Contractors
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg border">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-blue-600">MJ</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">Mike Johnson</h4>
                    <p className="text-sm text-gray-600">Solo Contractor, Texas</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-3">
                  "My closing rate has skyrocketed. The estimates look super professional and I can deliver them while I'm still at the customer's house."
                </p>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Revenue Increase:</span>
                    <span className="font-bold text-green-600">+$8,400</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Saved per Month:</span>
                    <span className="font-bold text-blue-600">67 hours</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg border">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-green-600">SR</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold">Sarah Rodriguez</h4>
                    <p className="text-sm text-gray-600">Small Team (3 employees), California</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-3">
                  "Our quotation rate increased from 50 to over 200 per month. It has increased the speed that we can win work four times over."
                </p>
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Revenue Increase:</span>
                    <span className="font-bold text-green-600">+$15,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quote Volume Increase:</span>
                    <span className="font-bold text-blue-600">300%</span>
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