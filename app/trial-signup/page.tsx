"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Zap, CheckCircle, ArrowRight } from 'lucide-react'

export default function TrialSignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Create user account and send welcome email
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error creating trial account:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <>
        <Header />
        
        <main className="pt-16 min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <div className="mx-auto mb-8 w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-6">
                Trial Account Created!
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Welcome to ProPaint Solutions! Your 7-day free trial has started. You can create up to 3 quotes during your trial.
              </p>
              
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white p-6 rounded-2xl mb-8">
                <h3 className="text-2xl font-bold mb-2">Your Access Code: TRIAL2024</h3>
                <p className="opacity-90">Use this code to access your dashboard and start creating quotes</p>
              </div>
              
              <Button size="lg" asChild className="text-lg font-semibold h-14 px-10" variant="kofi">
                <Link href="/get-quote">
                  Start Your First Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
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
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Zap className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-4">
                Start Your Free Trial
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Get 7 days free access to our AI-powered quote system. No credit card required.
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Create Your Trial Account</CardTitle>
                <CardDescription>
                  Join thousands of painting contractors who save hours every week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email address"
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-primary-800">What's Included:</h3>
                    <ul className="space-y-1 text-sm text-primary-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        3 AI-powered quotes
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Professional quote templates
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Email support
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        7 days free access
                      </li>
                    </ul>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold" 
                    variant="kofi"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Start Free Trial'}
                  </Button>
                  
                  <p className="text-sm text-gray-600 text-center">
                    By signing up, you agree to our{' '}
                    <Link href="/terms" className="text-primary-600 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}