"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Rocket, Clock, Settings, ChevronRight, DollarSign, Calculator } from 'lucide-react'

export default function SetupPage() {
  const router = useRouter()
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [chargeRates, setChargeRates] = useState({
    interiorWalls: '2.50',
    interiorCeilings: '3.00',
    exteriorWalls: '4.00',
    baseboards: '2.00',
    doors: '85',
    windows: '45'
  })

  const handleQuickStart = () => {
    // Save default charge rates
    sessionStorage.setItem('paintQuoteSetup', JSON.stringify({
      setupMethod: 'quick',
      chargeRates: {
        interiorWalls: 2.50,
        interiorCeilings: 3.00,
        exteriorWalls: 4.00,
        baseboards: 2.00,
        doors: 85,
        windows: 45
      },
      laborPercentage: 70, // 70% of charge rate is labor
      setupCompleted: new Date().toISOString()
    }))
    
    router.push('/dashboard')
  }

  const handleCustomSetup = () => {
    // Save custom charge rates
    sessionStorage.setItem('paintQuoteSetup', JSON.stringify({
      setupMethod: 'custom',
      chargeRates: {
        interiorWalls: parseFloat(chargeRates.interiorWalls),
        interiorCeilings: parseFloat(chargeRates.interiorCeilings),
        exteriorWalls: parseFloat(chargeRates.exteriorWalls),
        baseboards: parseFloat(chargeRates.baseboards),
        doors: parseFloat(chargeRates.doors),
        windows: parseFloat(chargeRates.windows)
      },
      laborPercentage: 70,
      setupCompleted: new Date().toISOString()
    }))
    
    router.push('/dashboard')
  }

  const handleSkipSetup = () => {
    sessionStorage.setItem('paintQuoteSetup', JSON.stringify({
      setupMethod: 'skipped',
      setupSkipped: new Date().toISOString()
    }))
    
    router.push('/dashboard')
  }

  if (!selectedPath) {
    return (
      <>
        <Header />
        
        <main className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h1 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-6">
                Let's Set Up Your Business
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose how you'd like to configure your pricing. You can always change this later.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleQuickStart()}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Rocket className="w-12 h-12 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">30 seconds</span>
                  </div>
                  <CardTitle>Quick Start</CardTitle>
                  <CardDescription>
                    Use industry-standard charge rates and start quoting immediately
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>✓ Interior walls: $2.50/sq ft</p>
                    <p>✓ Exterior walls: $4.00/sq ft</p>
                    <p>✓ Doors: $85/each</p>
                    <p>✓ Ready to quote instantly</p>
                  </div>
                  <Button className="w-full mt-4" variant="kofi">
                    Start Now <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedPath('custom')}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Settings className="w-12 h-12 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-600">2 minutes</span>
                  </div>
                  <CardTitle>Custom Setup</CardTitle>
                  <CardDescription>
                    Enter your exact charge rates for accurate quotes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>✓ Set your exact pricing</p>
                    <p>✓ Configure all surface types</p>
                    <p>✓ Customize labor percentages</p>
                    <p>✓ Full control over rates</p>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Customize <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow md:col-span-2"
                onClick={() => handleSkipSetup()}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-6 h-6 text-gray-600" />
                        Set Up Later
                      </CardTitle>
                      <CardDescription>
                        Skip setup and configure pricing when creating your first quote
                      </CardDescription>
                    </div>
                    <Button variant="ghost">
                      Skip for now →
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </main>
        
        <Footer />
      </>
    )
  }

  // Custom Setup Form
  return (
    <>
      <Header />
      
      <main className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Configure Your Charge Rates
              </h1>
              <p className="text-lg text-gray-600">
                Enter your charge rates per square foot or per unit. These rates should include both labor and materials.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  Charge Rates
                </CardTitle>
                <CardDescription>
                  Your all-inclusive rates (labor + materials) for each surface type
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="interiorWalls">Interior Walls ($/sq ft)</Label>
                    <Input
                      id="interiorWalls"
                      type="number"
                      step="0.25"
                      value={chargeRates.interiorWalls}
                      onChange={(e) => setChargeRates(prev => ({ ...prev, interiorWalls: e.target.value }))}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Industry avg: $2.00-3.50</p>
                  </div>

                  <div>
                    <Label htmlFor="interiorCeilings">Interior Ceilings ($/sq ft)</Label>
                    <Input
                      id="interiorCeilings"
                      type="number"
                      step="0.25"
                      value={chargeRates.interiorCeilings}
                      onChange={(e) => setChargeRates(prev => ({ ...prev, interiorCeilings: e.target.value }))}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Industry avg: $2.50-4.00</p>
                  </div>

                  <div>
                    <Label htmlFor="exteriorWalls">Exterior Walls ($/sq ft)</Label>
                    <Input
                      id="exteriorWalls"
                      type="number"
                      step="0.25"
                      value={chargeRates.exteriorWalls}
                      onChange={(e) => setChargeRates(prev => ({ ...prev, exteriorWalls: e.target.value }))}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Industry avg: $3.50-5.50</p>
                  </div>

                  <div>
                    <Label htmlFor="baseboards">Baseboards ($/linear ft)</Label>
                    <Input
                      id="baseboards"
                      type="number"
                      step="0.25"
                      value={chargeRates.baseboards}
                      onChange={(e) => setChargeRates(prev => ({ ...prev, baseboards: e.target.value }))}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Industry avg: $1.50-3.00</p>
                  </div>

                  <div>
                    <Label htmlFor="doors">Doors & Frames ($/unit)</Label>
                    <Input
                      id="doors"
                      type="number"
                      step="5"
                      value={chargeRates.doors}
                      onChange={(e) => setChargeRates(prev => ({ ...prev, doors: e.target.value }))}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Industry avg: $75-125</p>
                  </div>

                  <div>
                    <Label htmlFor="windows">Windows ($/unit)</Label>
                    <Input
                      id="windows"
                      type="number"
                      step="5"
                      value={chargeRates.windows}
                      onChange={(e) => setChargeRates(prev => ({ ...prev, windows: e.target.value }))}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Industry avg: $35-65</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Understanding Charge Rates</h3>
                  <p className="text-sm text-blue-700">
                    Your charge rate includes both labor (typically 70%) and materials (typically 30%). 
                    This all-inclusive rate simplifies quoting and ensures consistent pricing.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={handleCustomSetup}
                    className="flex-1"
                    variant="kofi"
                  >
                    Save & Continue
                  </Button>
                  <Button 
                    onClick={() => setSelectedPath(null)}
                    variant="outline"
                  >
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}