"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Zap, Users, Building, ArrowRight } from 'lucide-react'

const ACCESS_CODES = {
  'DEMO2024': { type: 'demo', name: 'Demo Account', quotesLimit: 3 },
  'PAINTER001': { type: 'contractor', name: 'Professional Contractor', quotesLimit: 10 },
  'CONTRACTOR123': { type: 'business', name: 'Business Account', quotesLimit: 50 },
  'TRIAL2024': { type: 'trial', name: 'Free Trial', quotesLimit: 3 },
  'PRO2024': { type: 'professional', name: 'Professional Plan', quotesLimit: -1 }, // unlimited
}

export default function AccessCodePage() {
  const [accessCode, setAccessCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const code = accessCode.toUpperCase()
      const account = ACCESS_CODES[code as keyof typeof ACCESS_CODES]
      
      if (!account) {
        setError('Invalid access code. Please check your code and try again.')
        return
      }

      // Store session data
      sessionStorage.setItem('paintQuoteAuth', JSON.stringify({
        accessCode: code,
        accountType: account.type,
        accountName: account.name,
        quotesLimit: account.quotesLimit,
        quotesUsed: 0,
        loginTime: new Date().toISOString()
      }))

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      
      <main className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Zap className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-4">
                Access Your Account
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Enter your access code to start creating professional quotes
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Enter Access Code</CardTitle>
                <CardDescription>
                  Use your unique access code to log into your quote dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="accessCode">Access Code</Label>
                    <Input
                      id="accessCode"
                      type="text"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      required
                      placeholder="Enter your access code"
                      className="mt-2 text-center text-lg font-mono"
                      autoComplete="off"
                    />
                    {error && (
                      <p className="text-sm text-red-600 mt-2">{error}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold" 
                    variant="kofi"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Accessing...' : (
                      <>
                        Access Dashboard
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
                
                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-semibold mb-4 text-center">Demo Access Codes</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span className="font-mono">DEMO2024</span>
                      </div>
                      <span className="text-gray-600">Demo Account</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="font-mono">PAINTER001</span>
                      </div>
                      <span className="text-gray-600">Contractor</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-purple-600" />
                        <span className="font-mono">CONTRACTOR123</span>
                      </div>
                      <span className="text-gray-600">Business</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Don't have an access code?
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/trial-signup">Start Free Trial</Link>
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