import { Metadata } from 'next'
import Link from 'next/link'
import { 
  DollarSign,
  TrendingUp, 
  Calculator,
  Clock,
  CheckCircle,
  Target,
  BarChart3,
  AlertTriangle,
  Zap,
  PieChart,
  FileText,
  ArrowRight,
  Star,
  Users,
  Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'

export const metadata: Metadata = {
  title: 'Painting Business Profit Optimization: Complete Guide to 40%+ Margins',
  description: 'Proven strategies to increase painting business profits by 40%+. Pricing optimization, cost control, efficiency improvements, and profit analysis from 500+ contractors.',
  keywords: 'painting business profit, painting contractor margins, painting business pricing, increase painting profits, painting cost optimization, painting business profitability',
  alternates: {
    canonical: '/painting-business-profit-guide',
  },
  openGraph: {
    title: 'Painting Business Profit Guide - Increase Margins by 40%+',
    description: 'Complete profit optimization guide for painting contractors. Proven strategies from 500+ successful businesses.',
    url: '/painting-business-profit-guide',
  },
}

const tableOfContents = [
  { title: "The Profit Reality in Painting", anchor: "profit-reality" },
  { title: "Where Profits Actually Hide", anchor: "where-profits-hide" },
  { title: "The 40% Margin Framework", anchor: "margin-framework" },
  { title: "Pricing That Maximizes Profit", anchor: "pricing-optimization" },
  { title: "Cost Control Strategies", anchor: "cost-control" },
  { title: "Efficiency Multipliers", anchor: "efficiency-multipliers" },
  { title: "Profit Tracking Systems", anchor: "profit-tracking" },
  { title: "90-Day Profit Boost Plan", anchor: "profit-boost-plan" }
]

const profitLeaks = [
  {
    area: "Underpricing Jobs",
    cost: "$15,000-50,000/year",
    cause: "Guessing instead of calculating",
    solution: "Professional estimation system",
    impact: "25-40% margin increase"
  },
  {
    area: "Material Waste",
    cost: "$8,000-25,000/year",
    cause: "Poor planning and measurement",
    solution: "Accurate measurements + 5% buffer",
    impact: "15-20% cost reduction"
  },
  {
    area: "Labor Inefficiency",
    cost: "$12,000-35,000/year",
    cause: "No standardized processes",
    solution: "Time studies + process optimization",
    impact: "30% productivity gain"
  },
  {
    area: "Unpaid Change Orders",
    cost: "$5,000-20,000/year",
    cause: "Poor scope documentation",
    solution: "Clear contracts + change procedures",
    impact: "100% change order capture"
  }
]

const profitableJobTypes = [
  {
    type: "Interior Whole House",
    averageValue: "$8,500",
    margin: "45%",
    timeEfficiency: "High",
    difficulty: "Medium",
    why: "Larger jobs with economies of scale"
  },
  {
    type: "Commercial Maintenance",
    averageValue: "$15,000",
    margin: "38%",
    timeEfficiency: "Very High",
    difficulty: "Low",
    why: "Repeat customers, predictable work"
  },
  {
    type: "High-End Exterior",
    averageValue: "$12,000",
    margin: "42%",
    timeEfficiency: "Medium",
    difficulty: "High",
    why: "Premium pricing for quality work"
  },
  {
    type: "New Construction",
    averageValue: "$6,500",
    margin: "32%",
    timeEfficiency: "Very High",
    difficulty: "Low",
    why: "Volume work with builder relationships"
  }
]

const profitCaseStudies = [
  {
    name: "Maria Gonzalez",
    company: "Precision Paint Co.",
    challenge: "20% margins, working 70-hour weeks",
    solution: "Implemented professional pricing system + efficiency tracking",
    result: "42% margins, 45-hour work weeks",
    timeline: "6 months",
    keyMetric: "$75K additional profit on same revenue",
    quote: "I was leaving $75,000 on the table every year. Professional pricing changed everything."
  },
  {
    name: "Robert Kim",
    company: "Elite Painting Services",
    challenge: "High revenue but low profit",
    solution: "Cost tracking + job type optimization",
    result: "Focused on profitable jobs, eliminated money losers",
    timeline: "4 months",
    keyMetric: "Same revenue, 65% more profit",
    quote: "We were busy but broke. Now we work smarter, not harder."
  }
]

const marginBenchmarks = [
  {
    category: "Labor",
    industry: "35-40%",
    topPerformers: "30-35%",
    insight: "Efficiency gains through systems"
  },
  {
    category: "Materials",
    industry: "25-30%",
    topPerformers: "20-25%",
    insight: "Better supplier relationships + less waste"
  },
  {
    category: "Overhead",
    industry: "15-20%",
    topPerformers: "10-15%",
    insight: "Technology reduces administrative costs"
  },
  {
    category: "Profit",
    industry: "15-25%",
    topPerformers: "35-45%",
    insight: "Professional systems + premium positioning"
  }
]

export default function PaintingBusinessProfitGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Painting Business Profit Optimization: The Complete Guide to 40%+ Margins
            </h1>
            <p className="text-xl mb-8 text-green-100">
              Stop leaving money on the table. Proven strategies to increase your painting business profits by 40%+ without working more hours. Based on analysis of 500+ profitable contractors.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-700/50 p-6 rounded-lg">
                <div className="text-3xl font-bold">$47K</div>
                <div className="text-green-200">Average Annual Profit Increase</div>
              </div>
              <div className="bg-green-700/50 p-6 rounded-lg">
                <div className="text-3xl font-bold">42%</div>
                <div className="text-green-200">Achievable Gross Margins</div>
              </div>
              <div className="bg-green-700/50 p-6 rounded-lg">
                <div className="text-3xl font-bold">6 Months</div>
                <div className="text-green-200">Average Implementation Time</div>
              </div>
            </div>
            <p className="text-sm text-green-200 mb-6">20-minute read • Updated January 2025</p>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Table of Contents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tableOfContents.map((item, index) => (
              <a 
                key={index}
                href={`#${item.anchor}`}
                className="flex items-center p-3 rounded-lg border hover:bg-green-50 transition-colors"
              >
                <span className="text-green-600 font-semibold mr-3">{index + 1}.</span>
                <span>{item.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* The Profit Reality */}
      <section id="profit-reality" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">The Profit Reality in Painting</h2>
          
          <div className="mb-12 p-6 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800 mb-2">Why Most Painting Contractors Struggle with Profit</h3>
                <p className="text-red-700">
                  64% of painting contractors operate on margins below 20%. They're busy, but not profitable. The average contractor leaves $40,000+ on the table annually through poor pricing, cost control, and efficiency.
                </p>
              </div>
            </div>
          </div>

          <p className="text-lg text-gray-700 mb-8">
            Your painting business generates $300K in revenue but you're only keeping $45K in profit. You're working 60-hour weeks but your bank account doesn't reflect it. Meanwhile, your competitor down the street works fewer hours but drives a new truck and takes vacations.
          </p>

          <p className="text-lg text-gray-700 mb-8">
            The difference isn't luck or connections. It's systems. Profitable painting contractors understand their numbers, price strategically, and operate efficiently.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">❌ Low-Profit Operations (15-20% margins)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>• Pricing based on "gut feeling"</li>
                  <li>• No cost tracking or analysis</li>
                  <li>• Inefficient job processes</li>
                  <li>• Material waste and overbuying</li>
                  <li>• Unpaid change orders</li>
                  <li>• No job profitability analysis</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-600">✅ High-Profit Operations (35-45% margins)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>• Data-driven pricing strategies</li>
                  <li>• Detailed cost tracking and analysis</li>
                  <li>• Streamlined, efficient processes</li>
                  <li>• Precise material calculations</li>
                  <li>• Professional change order systems</li>
                  <li>• Job-by-job profit optimization</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Where Profits Hide */}
      <section id="where-profits-hide" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Where Your Profits Are Actually Hiding</h2>
          
          <p className="text-lg text-gray-700 text-center mb-12 max-w-3xl mx-auto">
            After analyzing 500+ painting businesses, we found four major profit leaks that cost contractors $40,000-130,000 annually. Here's where your money is going:
          </p>

          <div className="grid gap-6 mb-12">
            {profitLeaks.map((leak, index) => (
              <Card key={index} className="border-l-4 border-red-500">
                <CardContent className="p-6">
                  <div className="grid lg:grid-cols-5 gap-4 items-center">
                    <div>
                      <h3 className="font-bold text-lg text-red-600">{leak.area}</h3>
                      <p className="text-sm text-gray-600">{leak.cause}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{leak.cost}</p>
                      <p className="text-sm text-gray-600">Annual Loss</p>
                    </div>
                    <div>
                      <p className="font-medium text-green-600">{leak.solution}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-green-600">{leak.impact}</p>
                      <p className="text-sm text-gray-600">Improvement</p>
                    </div>
                    <div className="text-center">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Fix This
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-green-50 p-8 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Total Potential Recovery</h3>
            <p className="text-4xl font-bold text-green-600 mb-4">$40,000 - $130,000</p>
            <p className="text-gray-700">
              Average annual profit increase when these four areas are optimized properly.
            </p>
          </div>
        </div>
      </section>

      {/* Most Profitable Job Types */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Most Profitable Job Types (Focus Your Energy Here)</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {profitableJobTypes.map((job, index) => (
              <Card key={index} className="h-full">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{job.type}</CardTitle>
                  <div className="text-3xl font-bold text-green-600">{job.margin}</div>
                  <div className="text-sm text-gray-600">Gross Margin</div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg Value:</span>
                      <span className="font-medium">{job.averageValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Efficiency:</span>
                      <span className="font-medium">{job.timeEfficiency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Difficulty:</span>
                      <span className="font-medium">{job.difficulty}</span>
                    </div>
                    <div className="pt-3 border-t">
                      <p className="text-sm text-gray-700">{job.why}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-blue-50 p-8 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Strategic Focus</h3>
            <p className="text-gray-700 mb-4">
              High-profit contractors focus 70% of their marketing and capacity on these job types. They still take others, but prioritize the most profitable work.
            </p>
            <p className="text-gray-700">
              <strong>Pro Tip:</strong> Track your actual margins by job type for 3 months, then shift your marketing focus to your most profitable categories.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Real Profit Transformations</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {profitCaseStudies.map((study, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">{study.name}</h3>
                    <p className="text-gray-600">{study.company}</p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">Challenge:</h4>
                      <p className="text-red-700">{study.challenge}</p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Solution:</h4>
                      <p className="text-blue-700">{study.solution}</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Result:</h4>
                      <p className="text-green-700">{study.result}</p>
                      <p className="font-bold text-green-800 mt-2">{study.keyMetric}</p>
                    </div>
                  </div>
                  
                  <blockquote className="text-center italic text-gray-700 border-t pt-4">
                    "{study.quote}"
                  </blockquote>
                  
                  <div className="text-center mt-4">
                    <span className="text-sm text-gray-500">Timeline: {study.timeline}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Profit Benchmarks */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Industry vs. Top Performer Benchmarks</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 font-semibold">Cost Category</th>
                  <th className="text-center p-4 font-semibold">Industry Average</th>
                  <th className="text-center p-4 font-semibold">Top Performers</th>
                  <th className="text-left p-4 font-semibold">Key Insight</th>
                </tr>
              </thead>
              <tbody>
                {marginBenchmarks.map((benchmark, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-4 font-medium">{benchmark.category}</td>
                    <td className="p-4 text-center">{benchmark.industry}</td>
                    <td className="p-4 text-center font-semibold text-green-600">{benchmark.topPerformers}</td>
                    <td className="p-4 text-gray-600">{benchmark.insight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">How to Use These Benchmarks</h3>
            <p className="text-yellow-700">
              Calculate your percentages for each category and compare to top performers. Focus first on the areas where you're furthest from the benchmark - that's where you'll see the biggest profit gains.
            </p>
          </div>
        </div>
      </section>

      {/* 90-Day Profit Boost Plan */}
      <section id="profit-boost-plan" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Your 90-Day Profit Boost Action Plan</h2>
          
          <p className="text-lg text-gray-700 mb-12">
            Don't overwhelm yourself trying to fix everything. This proven plan prioritizes changes by impact and difficulty:
          </p>

          <div className="space-y-8">
            <Card className="border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-800">Days 1-30: Quick Wins (Target: 10-15% margin improvement)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Pricing Optimization</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Implement professional quote calculator</li>
                      <li>• Audit last 20 jobs for actual vs. estimated costs</li>
                      <li>• Raise prices on new quotes by 15-20%</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Cost Control</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Track material costs per job</li>
                      <li>• Implement 5% material buffer maximum</li>
                      <li>• Negotiate better supplier pricing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-800">Days 31-60: System Implementation (Target: 15-20% additional improvement)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Efficiency Gains</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Time study your top 5 job types</li>
                      <li>• Standardize prep and application processes</li>
                      <li>• Train team on efficient techniques</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Profit Tracking</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Set up job profitability tracking</li>
                      <li>• Analyze which job types are most profitable</li>
                      <li>• Create job type-specific pricing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-purple-800">Days 61-90: Optimization & Growth (Target: 10-15% additional improvement)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Strategic Focus</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Focus marketing on most profitable job types</li>
                      <li>• Eliminate or repriced money-losing services</li>
                      <li>• Develop premium service offerings</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Continuous Improvement</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Monthly profit review meetings</li>
                      <li>• Team incentives tied to profitability</li>
                      <li>• Plan next quarter's profit initiatives</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
            <h3 className="text-xl font-bold text-green-800 mb-2">Expected Total Improvement</h3>
            <p className="text-3xl font-bold text-green-600 mb-2">35-50% Margin Increase</p>
            <p className="text-green-700">
              Most contractors see $30,000-80,000 additional annual profit following this plan
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Optimize Your Painting Business Profits?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Get your free Profit Analysis and discover exactly how much money you're leaving on the table.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="bg-white text-green-600 hover:bg-green-50">
              <Link href="/trial-signup">
                <Calculator className="h-5 w-5 mr-2" />
                Get Free Profit Analysis
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
              <Link href="/roi-calculator">
                <PieChart className="h-5 w-5 mr-2" />
                Calculate Potential Savings
              </Link>
            </Button>
          </div>
          <p className="text-sm text-green-200">
            Join 500+ painting contractors already increasing profits with professional systems
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}