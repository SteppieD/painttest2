import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Smartphone,
  Zap,
  TrendingUp, 
  Calculator,
  Clock,
  CheckCircle,
  Target,
  BarChart3,
  AlertTriangle,
  FileText,
  Users,
  Building2,
  ArrowRight,
  Star,
  Wifi,
  Cloud,
  Shield,
  DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Footer } from '@/components/shared/footer'

export const metadata: Metadata = {
  title: 'Digital Transformation for Painting Contractors: Complete Modernization Guide',
  description: 'Transform your traditional painting business with digital tools and systems. Proven strategies to increase efficiency by 60%+ and profits by 40%+ through smart technology adoption.',
  keywords: 'painting contractor technology, digital transformation painting, painting business software, painting contractor apps, modernize painting business, painting technology solutions',
  alternates: {
    canonical: '/digital-transformation-painting-contractors',
  },
  openGraph: {
    title: 'Digital Transformation for Painting Contractors - Complete Guide',
    description: 'Modernize your painting business with proven digital strategies. 60%+ efficiency gains, 40%+ profit increases.',
    url: '/digital-transformation-painting-contractors',
  },
}

const tableOfContents = [
  { title: "The Digital Divide in Painting", anchor: "digital-divide" },
  { title: "Why Digital Transformation Matters Now", anchor: "why-now" },
  { title: "The Modern Painting Business Stack", anchor: "business-stack" },
  { title: "Technology ROI Calculator", anchor: "technology-roi" },
  { title: "Implementation Roadmap", anchor: "implementation-roadmap" },
  { title: "Overcoming Resistance", anchor: "overcoming-resistance" },
  { title: "Success Stories", anchor: "success-stories" },
  { title: "Your 6-Month Digital Plan", anchor: "digital-plan" }
]

const digitalGaps = [
  {
    area: "Quote Creation",
    traditional: "2-4 hours per quote",
    digital: "6 minutes per quote",
    improvement: "95% time savings",
    impact: "40x more quotes possible"
  },
  {
    area: "Customer Communication",
    traditional: "Phone calls and text messages",
    digital: "Automated updates and portals",
    improvement: "80% less admin time",
    impact: "Better customer experience"
  },
  {
    area: "Job Management",
    traditional: "Paper schedules and clipboards",
    digital: "Mobile apps and real-time updates",
    improvement: "60% efficiency gain",
    impact: "More jobs, better coordination"
  },
  {
    area: "Business Analysis",
    traditional: "Guessing and gut feeling",
    digital: "Real-time analytics and insights",
    improvement: "Data-driven decisions",
    impact: "25% profit improvement"
  }
]

const technologyStack = [
  {
    category: "Quote & Estimation",
    tools: ["Professional quote software", "Mobile measurement apps", "Pricing calculators"],
    benefit: "95% faster quotes, consistent pricing",
    priority: "Critical",
    cost: "$50-200/month"
  },
  {
    category: "Customer Management",
    tools: ["CRM system", "Communication automation", "Customer portals"],
    benefit: "Better relationships, repeat business",
    priority: "High",
    cost: "$30-150/month"
  },
  {
    category: "Project Management",
    tools: ["Job scheduling", "Team coordination", "Progress tracking"],
    benefit: "60% efficiency improvement",
    priority: "High",
    cost: "$40-120/month"
  },
  {
    category: "Financial Management",
    tools: ["Invoicing automation", "Expense tracking", "Profit analysis"],
    benefit: "Faster payments, better margins",
    priority: "Medium",
    cost: "$25-100/month"
  },
  {
    category: "Marketing & Growth",
    tools: ["Website optimization", "Social media tools", "Review management"],
    benefit: "300% more leads, better reputation",
    priority: "Medium",
    cost: "$50-300/month"
  }
]

const transformationCaseStudies = [
  {
    name: "James Wilson",
    company: "Wilson Professional Painting",
    before: {
      revenue: "$180K/year",
      margin: "18%",
      hours: "65 hours/week",
      quotes: "8 per week"
    },
    after: {
      revenue: "$450K/year",
      margin: "42%",
      hours: "40 hours/week",
      quotes: "25 per week"
    },
    timeline: "8 months",
    keyTechnology: "Professional quote system + CRM + mobile apps",
    quote: "Technology didn't replace my expertise - it amplified it. Now I can focus on growing the business instead of drowning in paperwork.",
    specificGains: [
      "Quote time: 3 hours → 6 minutes",
      "Customer response rate: 35% → 78%",
      "Team efficiency: +60%",
      "Net profit: $32K → $189K"
    ]
  },
  {
    name: "Lisa Chang",
    company: "Elite Residential Painting",
    before: {
      revenue: "$250K/year",
      margin: "22%",
      hours: "70 hours/week",
      quotes: "12 per week"
    },
    after: {
      revenue: "$680K/year",
      margin: "38%",
      hours: "45 hours/week",
      quotes: "35 per week"
    },
    timeline: "10 months",
    keyTechnology: "Full digital transformation + team training",
    quote: "My customers tell me I'm the most professional contractor they've worked with. The technology makes us look like a million-dollar company.",
    specificGains: [
      "Customer satisfaction: 89% → 97%",
      "Repeat business: 25% → 65%",
      "Administrative time: -70%",
      "Team productivity: +55%"
    ]
  }
]

const adoptionBarriers = [
  {
    barrier: "\"Technology is too complicated\"",
    reality: "Modern tools are designed for non-tech users",
    solution: "Start with simple, intuitive tools with good support"
  },
  {
    barrier: "\"My customers prefer the old way\"",
    reality: "Customers appreciate professionalism and efficiency",
    solution: "Professional systems actually improve customer experience"
  },
  {
    barrier: "\"Technology is too expensive\"",
    reality: "ROI is typically 300-500% in first year",
    solution: "Calculate actual cost vs. time saved and revenue gained"
  },
  {
    barrier: "\"I don't have time to learn\"",
    reality: "Learning curve is 1-2 weeks for massive long-term gains",
    solution: "Block time for training like you would for a major job"
  }
]

const roiCalculation = {
  investment: {
    software: "$150/month ($1,800/year)",
    training: "$500 one-time",
    setup: "$300 one-time",
    total: "$2,600 first year"
  },
  returns: {
    timesSaved: "20 hours/week × $75/hour = $78,000/year",
    moreQuotes: "15 additional quotes/week × $5,000 × 40% win rate × 35% margin = $105,000/year",
    betterPricing: "20% margin improvement × $300K revenue = $60,000/year",
    total: "$243,000/year"
  },
  roi: "9,350% first year ROI"
}

export default function DigitalTransformationPaintingContractorsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Digital Transformation for Painting Contractors: Stop Working Harder, Start Working Smarter
            </h1>
            <p className="text-xl mb-8 text-purple-100">
              Traditional painting contractors are being left behind. Modern technology can increase your efficiency by 60%+, profits by 40%+, and give you your life back. Here's your complete modernization roadmap.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-purple-700/50 p-6 rounded-lg">
                <div className="text-3xl font-bold">83%</div>
                <div className="text-purple-200">Still Use Manual Processes</div>
              </div>
              <div className="bg-purple-700/50 p-6 rounded-lg">
                <div className="text-3xl font-bold">60%</div>
                <div className="text-purple-200">Efficiency Improvement Possible</div>
              </div>
              <div className="bg-purple-700/50 p-6 rounded-lg">
                <div className="text-3xl font-bold">$75K</div>
                <div className="text-purple-200">Average Annual Time Savings Value</div>
              </div>
            </div>
            <p className="text-sm text-purple-200 mb-6">25-minute read • Updated January 2025</p>
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
                className="flex items-center p-3 rounded-lg border hover:bg-purple-50 transition-colors"
              >
                <span className="text-purple-600 font-semibold mr-3">{index + 1}.</span>
                <span>{item.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* The Digital Divide */}
      <section id="digital-divide" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">The Digital Divide in Painting</h2>
          
          <div className="mb-12 p-6 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-orange-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">The Reality Check</h3>
                <p className="text-orange-700">
                  While other industries embraced digital transformation, 83% of painting contractors still use manual processes from the 1990s. They're losing to competitors who quote faster, communicate better, and operate more efficiently.
                </p>
              </div>
            </div>
          </div>

          <p className="text-lg text-gray-700 mb-8">
            Your competition isn't just other painters anymore. It's contractors who can quote in 6 minutes while you take 3 hours. Who track every job's profitability while you guess. Who delight customers with professional systems while you scramble with spreadsheets.
          </p>

          <p className="text-lg text-gray-700 mb-8">
            The gap is widening every day. But the good news? Catching up is easier than you think, and the payoff is massive.
          </p>

          <div className="grid gap-6 mb-12">
            {digitalGaps.map((gap, index) => (
              <Card key={index} className="border-l-4 border-purple-500">
                <CardContent className="p-6">
                  <div className="grid lg:grid-cols-4 gap-4 items-center">
                    <div>
                      <h3 className="font-bold text-lg">{gap.area}</h3>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Traditional</p>
                      <p className="font-medium text-red-600">{gap.traditional}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Digital</p>
                      <p className="font-medium text-green-600">{gap.digital}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-purple-600">{gap.improvement}</p>
                      <p className="text-sm text-gray-600">{gap.impact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology ROI */}
      <section id="technology-roi" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">The Numbers Don't Lie: Technology ROI</h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Annual Investment</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <span>Professional Software Suite</span>
                  <span className="font-bold">{roiCalculation.investment.software}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <span>Training & Onboarding</span>
                  <span className="font-bold">{roiCalculation.investment.training}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <span>Setup & Configuration</span>
                  <span className="font-bold">{roiCalculation.investment.setup}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-100 rounded-lg border-2 border-red-300">
                  <span className="font-bold">Total Investment</span>
                  <span className="font-bold text-xl">{roiCalculation.investment.total}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6">Annual Returns</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span>Time Savings Value</span>
                  <span className="font-bold">{roiCalculation.returns.timesSaved}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span>Additional Revenue</span>
                  <span className="font-bold">{roiCalculation.returns.moreQuotes}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span>Better Pricing Profits</span>
                  <span className="font-bold">{roiCalculation.returns.betterPricing}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-100 rounded-lg border-2 border-green-300">
                  <span className="font-bold">Total Returns</span>
                  <span className="font-bold text-xl">{roiCalculation.returns.total}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center p-8 bg-purple-50 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Return on Investment</h3>
            <p className="text-5xl font-bold text-purple-600 mb-4">{roiCalculation.roi}</p>
            <p className="text-gray-700">
              For every $1 invested in technology, successful contractors see $93.50 in returns the first year.
            </p>
          </div>
        </div>
      </section>

      {/* The Modern Technology Stack */}
      <section id="business-stack" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">The Modern Painting Business Technology Stack</h2>
          
          <p className="text-lg text-gray-700 text-center mb-12 max-w-3xl mx-auto">
            You don't need every tool on day one. Start with high-impact areas and build your stack systematically:
          </p>

          <div className="grid gap-6">
            {technologyStack.map((stack, index) => (
              <Card key={index} className="border-l-4 border-purple-500">
                <CardContent className="p-6">
                  <div className="grid lg:grid-cols-5 gap-4 items-center">
                    <div>
                      <h3 className="font-bold text-lg mb-2">{stack.category}</h3>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        stack.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                        stack.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {stack.priority} Priority
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <ul className="text-sm space-y-1">
                        {stack.tools.map((tool, idx) => (
                          <li key={idx}>• {tool}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-green-600">{stack.benefit}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-purple-600">{stack.cost}</p>
                      <p className="text-sm text-gray-600">Investment</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 p-8 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Implementation Priority</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Month 1-2: Critical</h4>
                <p className="text-sm">Quote & estimation tools. Biggest immediate impact on efficiency and profitability.</p>
              </div>
              <div>
                <h4 className="font-semibold text-orange-600 mb-2">Month 3-4: High Priority</h4>
                <p className="text-sm">Customer management and project coordination. Improves service quality and team efficiency.</p>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-600 mb-2">Month 5-6: Medium Priority</h4>
                <p className="text-sm">Financial management and marketing tools. Optimizes operations and drives growth.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="success-stories" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Real Digital Transformation Success Stories</h2>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {transformationCaseStudies.map((study, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">{study.name}</h3>
                    <p className="text-gray-600">{study.company}</p>
                    <p className="text-sm text-purple-600 font-medium">Transformation Timeline: {study.timeline}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-3">Before Digital</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Revenue:</span>
                          <span className="font-medium">{study.before.revenue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Margin:</span>
                          <span className="font-medium">{study.before.margin}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Work Hours:</span>
                          <span className="font-medium">{study.before.hours}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quotes/Week:</span>
                          <span className="font-medium">{study.before.quotes}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-3">After Digital</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Revenue:</span>
                          <span className="font-medium">{study.after.revenue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Margin:</span>
                          <span className="font-medium">{study.after.margin}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Work Hours:</span>
                          <span className="font-medium">{study.after.hours}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quotes/Week:</span>
                          <span className="font-medium">{study.after.quotes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Key Technologies:</h4>
                    <p className="text-gray-700 text-sm">{study.keyTechnology}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Specific Improvements:</h4>
                    <ul className="text-sm space-y-1">
                      {study.specificGains.map((gain, idx) => (
                        <li key={idx} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {gain}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <blockquote className="text-center italic text-gray-700 border-t pt-6">
                    "{study.quote}"
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Overcoming Resistance */}
      <section id="overcoming-resistance" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Overcoming Technology Resistance</h2>
          
          <p className="text-lg text-gray-700 mb-12">
            The biggest barrier to digital transformation isn't technical - it's mental. Here are the most common objections and the reality:
          </p>

          <div className="space-y-6">
            {adoptionBarriers.map((barrier, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="grid lg:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-bold text-red-600 mb-2">Common Objection</h3>
                      <p className="text-gray-700">{barrier.barrier}</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-600 mb-2">Reality</h3>
                      <p className="text-gray-700">{barrier.reality}</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-green-600 mb-2">Solution</h3>
                      <p className="text-gray-700">{barrier.solution}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 p-8 bg-purple-50 rounded-lg">
            <h3 className="text-xl font-bold mb-4">The Truth About Technology Adoption</h3>
            <p className="text-gray-700 mb-4">
              Every successful contractor who embraced technology says the same thing: "I wish I had started sooner." The learning curve is measured in days, but the benefits last for years.
            </p>
            <p className="text-gray-700">
              Your customers expect professionalism. Your competition is getting faster and more efficient. The question isn't whether to modernize - it's how quickly you can get started.
            </p>
          </div>
        </div>
      </section>

      {/* 6-Month Digital Plan */}
      <section id="digital-plan" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Your 6-Month Digital Transformation Plan</h2>
          
          <p className="text-lg text-gray-700 mb-12">
            Don't try to digitize everything at once. This proven timeline maximizes ROI while minimizing disruption:
          </p>

          <div className="space-y-8">
            <Card className="border-purple-200">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-purple-800">Months 1-2: Core Systems (Quote & Customer Management)</CardTitle>
                <p className="text-purple-600">Focus: Immediate efficiency gains and professional image</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Implementation</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Choose and set up professional quote software</li>
                      <li>• Import customer database and historical data</li>
                      <li>• Train on new quote creation process</li>
                      <li>• Set up automated customer communications</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Expected Results</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• 90%+ reduction in quote creation time</li>
                      <li>• Professional quotes that win more jobs</li>
                      <li>• Better customer communication</li>
                      <li>• More organized customer information</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader className="bg-blue-50">
                <CardTitle className="text-blue-800">Months 3-4: Operations & Team (Project Management & Coordination)</CardTitle>
                <p className="text-blue-600">Focus: Team efficiency and project coordination</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Implementation</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Set up job scheduling and tracking system</li>
                      <li>• Train team on mobile apps and processes</li>
                      <li>• Implement quality control checklists</li>
                      <li>• Create standard operating procedures</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Expected Results</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• 50%+ improvement in team coordination</li>
                      <li>• Better quality control and consistency</li>
                      <li>• Real-time project visibility</li>
                      <li>• Reduced administrative overhead</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-800">Months 5-6: Growth & Optimization (Analytics & Marketing)</CardTitle>
                <p className="text-green-600">Focus: Business intelligence and growth acceleration</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Implementation</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Set up business analytics and reporting</li>
                      <li>• Implement marketing automation tools</li>
                      <li>• Create online presence and review management</li>
                      <li>• Optimize processes based on data insights</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Expected Results</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Data-driven business decisions</li>
                      <li>• 200%+ increase in lead generation</li>
                      <li>• Better online reputation management</li>
                      <li>• Continuous process optimization</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 p-8 bg-green-50 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-green-800 mb-4">6-Month Transformation Results</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-3xl font-bold text-green-600">60%+</p>
                <p className="text-green-700">Efficiency Improvement</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">40%+</p>
                <p className="text-green-700">Profit Increase</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">25+</p>
                <p className="text-green-700">Hours/Week Saved</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Painting Business?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Get your free Digital Readiness Assessment and discover exactly which technologies will have the biggest impact on your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-purple-50">
              <Link href="/trial-signup">
                <Zap className="h-5 w-5 mr-2" />
                Get Free Digital Assessment
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
              <Link href="/contact">
                <Smartphone className="h-5 w-5 mr-2" />
                Schedule Technology Demo
              </Link>
            </Button>
          </div>
          <p className="text-sm text-purple-200">
            Join 2,000+ painting contractors already transforming their business with modern technology
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}