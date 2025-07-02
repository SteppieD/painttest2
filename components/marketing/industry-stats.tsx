'use client'

import { Clock, TrendingUp, Users, DollarSign, Target, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  icon: React.ReactNode
  value: string
  label: string
  description: string
  color: string
}

function StatCard({ icon, value, label, description, color }: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-200">
      <CardContent className="p-6 text-center">
        <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mx-auto mb-4`}>
          {icon}
        </div>
        <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{value}</div>
        <div className="text-lg font-semibold text-gray-800 mb-2">{label}</div>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}

interface IndustryStatsProps {
  className?: string
  title?: string
  subtitle?: string
}

export function IndustryStats({ 
  className, 
  title = "The Numbers Don't Lie",
  subtitle = "Research-backed insights from the painting contractor industry"
}: IndustryStatsProps) {
  const stats = [
    {
      icon: <Clock className="w-8 h-8 text-red-600" />,
      value: "6 Hours",
      label: "Manual Quote Time",
      description: "Traditional quoting process takes 2-6 hours including site visit, calculations, and formatting",
      color: "bg-red-100"
    },
    {
      icon: <Zap className="w-8 h-8 text-green-600" />,
      value: "6 Minutes",
      label: "With Our App",
      description: "Professional quotes created on-site with mobile app, including all calculations and branding",
      color: "bg-green-100"
    },
    {
      icon: <Target className="w-8 h-8 text-orange-600" />,
      value: "24-48h",
      label: "Critical Window",
      description: "Response time window that makes or breaks the deal. After 48 hours, win probability drops exponentially",
      color: "bg-orange-100"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      value: "40-60%",
      label: "Higher Win Rates",
      description: "Professional appearance and faster response times drive significantly higher conversion rates",
      color: "bg-blue-100"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-purple-600" />,
      value: "$2,800",
      label: "Average Job Value",
      description: "Industry average painting job value. Each lost quote due to slow response costs real money",
      color: "bg-purple-100"
    },
    {
      icon: <Users className="w-8 h-8 text-teal-600" />,
      value: "134K+",
      label: "Small Contractors",
      description: "Painting contractors with 1-4 employees who need professional tools but lack enterprise budgets",
      color: "bg-teal-100"
    }
  ]

  return (
    <section className={`py-20 px-4 ${className}`}>
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              description={stat.description}
              color={stat.color}
            />
          ))}
        </div>

        {/* Key Insights */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Key Market Insights</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <div className="text-3xl font-bold mb-2">96%</div>
                <p>Of contractors have digital transformation strategies</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">15-25%</div>
                <p>Win probability decrease per day of quote delay</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">74.9%</div>
                <p>Of painting businesses have 1-4 employees</p>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="mt-12 text-center">
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg max-w-4xl mx-auto">
            <h4 className="text-lg font-bold text-yellow-800 mb-2">The Problem</h4>
            <p className="text-yellow-700">
              <strong>Most contractors lose jobs to timing, not pricing.</strong> While you're spending hours calculating estimates, 
              competitors with professional tools are delivering quotes the same day and winning the work.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}