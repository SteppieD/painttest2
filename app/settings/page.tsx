"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  User, Building2, CreditCard, Bell, Shield, Palette,
  Save, ChevronRight, Mail, Phone, MapPin, DollarSign
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface CompanySettings {
  companyName: string
  email: string
  phone: string
  address: string
  defaultLaborRate: number
  defaultMarkup: number
  preferredPaintBrand: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('company')
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    companyName: '',
    email: '',
    phone: '',
    address: '',
    defaultLaborRate: 1.50,
    defaultMarkup: 35,
    preferredPaintBrand: 'Sherwin Williams'
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Check authentication
    const authData = sessionStorage.getItem('paintQuoteAuth')
    if (!authData) {
      router.push('/trial-signup')
      return
    }

    try {
      const session = JSON.parse(authData)
      
      // Load company settings
      const savedSettings = localStorage.getItem(`settings_${session.companyId}`)
      if (savedSettings) {
        setCompanySettings(JSON.parse(savedSettings))
      } else {
        // Use defaults from session
        setCompanySettings(prev => ({
          ...prev,
          companyName: session.companyName || '',
          email: session.email || ''
        }))
      }
      
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to load settings:', error)
      router.push('/trial-signup')
    }
  }, [router])

  const saveSettings = () => {
    const authData = sessionStorage.getItem('paintQuoteAuth')
    if (!authData) return

    setIsSaving(true)
    try {
      const session = JSON.parse(authData)
      
      // Save settings to localStorage
      localStorage.setItem(`settings_${session.companyId}`, JSON.stringify(companySettings))
      
      // Update session with company name
      session.companyName = companySettings.companyName
      session.email = companySettings.email
      sessionStorage.setItem('paintQuoteAuth', JSON.stringify(session))
      
      // Show success message
      setTimeout(() => {
        setIsSaving(false)
        alert('Settings saved successfully!')
      }, 500)
    } catch (error) {
      console.error('Failed to save settings:', error)
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'company', label: 'Company Info', icon: Building2 },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield }
  ]

  return (
    <>
      <Header />
      
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900">
              Settings
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your account and customize your experience
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-0">
                  <nav className="space-y-1 p-4">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                          activeTab === tab.id
                            ? "bg-primary-50 text-primary-600"
                            : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <tab.icon className="w-5 h-5" />
                          {tab.label}
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'company' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                    <CardDescription>
                      Update your company details that appear on quotes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={companySettings.companyName}
                          onChange={(e) => setCompanySettings(prev => ({
                            ...prev,
                            companyName: e.target.value
                          }))}
                          placeholder="ABC Painting Co."
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={companySettings.email}
                            onChange={(e) => setCompanySettings(prev => ({
                              ...prev,
                              email: e.target.value
                            }))}
                            placeholder="quotes@example.com"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={companySettings.phone}
                            onChange={(e) => setCompanySettings(prev => ({
                              ...prev,
                              phone: e.target.value
                            }))}
                            placeholder="(555) 123-4567"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="address">Business Address</Label>
                        <Input
                          id="address"
                          value={companySettings.address}
                          onChange={(e) => setCompanySettings(prev => ({
                            ...prev,
                            address: e.target.value
                          }))}
                          placeholder="123 Main St, City, State 12345"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="laborRate">Default Labor Rate (per sq ft)</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              id="laborRate"
                              type="number"
                              step="0.25"
                              value={companySettings.defaultLaborRate}
                              onChange={(e) => setCompanySettings(prev => ({
                                ...prev,
                                defaultLaborRate: parseFloat(e.target.value) || 0
                              }))}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="markup">Default Markup %</Label>
                          <Input
                            id="markup"
                            type="number"
                            value={companySettings.defaultMarkup}
                            onChange={(e) => setCompanySettings(prev => ({
                              ...prev,
                              defaultMarkup: parseInt(e.target.value) || 0
                            }))}
                            placeholder="35"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="paintBrand">Preferred Paint Brand</Label>
                        <select
                          id="paintBrand"
                          value={companySettings.preferredPaintBrand}
                          onChange={(e) => setCompanySettings(prev => ({
                            ...prev,
                            preferredPaintBrand: e.target.value
                          }))}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="Sherwin Williams">Sherwin Williams</option>
                          <option value="Benjamin Moore">Benjamin Moore</option>
                          <option value="Behr">Behr</option>
                          <option value="PPG">PPG</option>
                          <option value="Valspar">Valspar</option>
                        </select>
                      </div>

                      <div className="flex justify-end">
                        <Button 
                          onClick={saveSettings}
                          disabled={isSaving}
                          className="bg-gradient-to-r from-primary-500 to-accent-500 text-white"
                        >
                          {isSaving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'billing' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Billing & Subscription</CardTitle>
                    <CardDescription>
                      Manage your subscription and payment methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg border border-primary-200">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">Free Trial</h3>
                            <p className="text-sm text-gray-600">1 quote included</p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Upgrade to create unlimited quotes and unlock all features
                        </p>
                        <Link href="/pricing">
                          <Button className="w-full">
                            Upgrade to Pro
                          </Button>
                        </Link>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Available Plans</h4>
                        <div className="space-y-3">
                          <div className="p-4 border rounded-lg hover:border-primary-300 transition-colors">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium">Professional</h5>
                                <p className="text-sm text-gray-600">Perfect for growing contractors</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">$79/mo</p>
                                <p className="text-xs text-gray-600">or $790/year</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg hover:border-primary-300 transition-colors">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium">Business</h5>
                                <p className="text-sm text-gray-600">For established painting businesses</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">$149/mo</p>
                                <p className="text-xs text-gray-600">or $1,490/year</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'preferences' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Quote Preferences</CardTitle>
                    <CardDescription>
                      Customize how your quotes are generated
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <Palette className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p>Quote customization options coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'notifications' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Control how you receive updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p>Notification preferences coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'security' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p>Security options coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}