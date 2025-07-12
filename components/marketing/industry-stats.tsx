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
    <Card>
      <CardContent>
        <div rounded-full flex items-center justify-center mx-auto mb-4`}>
          {icon}
        </div>
        <div>{value}</div>
        <div>{label}</div>
        <p>{description}</p>
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
      icon: <Clock />,
      value: "6 Hours",
      label: "Manual Quote Time",
      description: "Traditional quoting process takes 2-6 hours including site visit, calculations, and formatting",
      color: "bg-red-100"
    },
    {
      icon: <Zap />,
      value: "6 Minutes",
      label: "With Our App",
      description: "Professional quotes created on-site with mobile app, including all calculations and branding",
      color: "bg-green-100"
    },
    {
      icon: <Target />,
      value: "24-48h",
      label: "Critical Window",
      description: "Response time window that makes or breaks the deal. After 48 hours, win probability drops exponentially",
      color: "bg-orange-100"
    },
    {
      icon: <TrendingUp />,
      value: "40-60%",
      label: "Higher Win Rates",
      description: "Professional appearance and faster response times drive significantly higher conversion rates",
      color: "bg-blue-100"
    },
    {
      icon: <DollarSign />,
      value: "$2,800",
      label: "Average Job Value",
      description: "Industry average painting job value. Each lost quote due to slow response costs real money",
      color: "bg-purple-100"
    },
    {
      icon: <Users />,
      value: "134K+",
      label: "Small Contractors",
      description: "Painting contractors with 1-4 employees who need professional tools but lack enterprise budgets",
      color: "bg-teal-100"
    }
  ]

  return (
    <section`}>
      <div>
        <div>
          <h2>
            {title}
          </h2>
          <p>
            {subtitle}
          </p>
        </div>

        <div>
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
        <div>
          <div>
            <h3>Key Market Insights</h3>
            <div>
              <div>
                <div>96%</div>
                <p>Of contractors have digital transformation strategies</p>
              </div>
              <div>
                <div>15-25%</div>
                <p>Win probability decrease per day of quote delay</p>
              </div>
              <div>
                <div>74.9%</div>
                <p>Of painting businesses have 1-4 employees</p>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div>
          <div>
            <h4>The Problem</h4>
            <p>
              <strong>Most contractors lose jobs to timing, not pricing.</strong> While you're spending hours calculating estimates, 
              competitors with professional tools are delivering quotes the same day and winning the work.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}