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
import { 
  Zap, CheckCircle, Copy, FileText, Clock, 
  Shield, Users, TrendingUp, AlertCircle 
} from 'lucide-react'

export default function EnhancedTrialSignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [showAccessCode, setShowAccessCode] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const generateAccessCode = (companyName: string) => {
    // Generate a unique access code based on company name
    const prefix = companyName.substring(0, 6).toUpperCase().replace(/[^A-Z]/g, '')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${prefix}${random}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!companyName || !email) {
      setError('Please fill in all fields')
      return
    }

    setIsLoading(true)

    try {
      // Generate access code
      const code = generateAccessCode(companyName)
      setAccessCode(code)
      setShowAccessCode(true)
      
      // Create session data
      const sessionData = {
        companyId: `company_${Date.now()}`,
        companyName,
        email,
        accessCode: code,
        quotesUsed: 0,
        quotesLimit: 1, // Free trial includes 1 quote
        trialStartDate: new Date().toISOString(),
        trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
        isLoggedIn: true
      }
      
      // Save to session storage
      sessionStorage.setItem('paintQuoteAuth', JSON.stringify(sessionData))
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
    } catch (error) {
      console.error('Error creating trial account:', error)
      setError('Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const copyAccessCode = () => {
    navigator.clipboard.writeText(accessCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const proceedToDashboard = () => {
    router.push('/dashboard')
  }

  if (showAccessCode) {
    return (
      <>
        <Header />
        
        <main className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-2xl">
                <CardHeader className="text-center pb-8">
                  <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    Welcome to ProPaint Quote!
                  </CardTitle>
                  <CardDescription className="text-lg mt-2">
                    Your free trial has been activated
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-2">Your Access Code</h3>
                    <div className="flex items-center justify-between bg-white/20 rounded-lg p-4">
                      <span className="text-2xl font-mono font-bold">{accessCode}</span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={copyAccessCode}
                        className="bg-white/30 hover:bg-white/40 text-white"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    <p className="text-sm opacity-90 mt-3">
                      Save this code - you'll use it to sign in after creating your account
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Your Free Trial Includes:</h4>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>1 Professional Quote (No credit card required)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>AI Quote Assistant</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Full Dashboard Access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Mobile & Desktop Compatible</span>
                      </li>
                    </ul>
                  </div>

                  <Button 
                    onClick={proceedToDashboard}
                    className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white"
                    size="lg"
                  >
                    Go to Dashboard
                  </Button>
                  
                  <p className="text-center text-sm text-gray-600">
                    Already have an access code? <Link href="/login" className="text-primary-600 hover:underline">Sign in here →</Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      
      <main className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Form */}
              <div>
                <div className="mb-8">
                  <h1 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-4">
                    Start Free in 30 Seconds
                  </h1>
                  
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Create Professional Quotes 14x Faster
                  </p>
                  
                  <p className="text-gray-600 mt-2">
                    Join 5,000+ contractors winning more jobs with AI-powered quotes. No credit card required. Get your first quote free.
                  </p>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Start Your Free Trial</CardTitle>
                    <CardDescription>
                      No credit card required • Instant access • 1 free quote included
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="ABC Painting Co."
                          required
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@example.com"
                          required
                          disabled={isLoading}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          We'll email you your access code and account details
                        </p>
                      </div>
                      
                      {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {error}
                        </div>
                      )}
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white"
                        size="lg"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5 mr-2" />
                            Create Free Trial Account
                          </>
                        )}
                      </Button>
                    </form>
                    
                    <p className="text-center text-sm text-gray-600 mt-6">
                      Already have an access code? <Link href="/login" className="text-primary-600 hover:underline">Sign in here →</Link>
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right Column - Benefits */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Save 3+ Hours Per Quote</h3>
                        <p className="text-gray-600">
                          Create professional quotes in minutes, not hours. Our AI handles all the calculations while you focus on closing deals.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Win 47% More Jobs</h3>
                        <p className="text-gray-600">
                          Professional quotes delivered instantly impress customers and help you close deals on the spot.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Join 5,000+ Contractors</h3>
                        <p className="text-gray-600">
                          Trusted by painting professionals across the country who've transformed their quoting process.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="text-center pt-4">
                  <div className="flex items-center justify-center gap-6 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600">4.9/5 from 500+ reviews</span>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    No credit card required • Setup in 2 minutes • Cancel anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}