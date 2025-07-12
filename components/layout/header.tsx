"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { COMPANY_INFO, SERVICE_AREAS, PAINTING_SERVICES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [quotaInfo, setQuotaInfo] = useState<{ used: number; limit: number } | null>(null)
  
  useEffect(() => {
    // Check if user is logged in and get quota info
    const authData = sessionStorage.getItem('paintQuoteAuth')
    if (authData) {
      try {
        const session = JSON.parse(authData)
        setQuotaInfo({
          used: session.quotesUsed || 0,
          limit: session.quotesLimit || 10
        })
      } catch (error) {
        console.error('Failed to parse auth data:', error)
      }
    }
  }, [])

  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100/50 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/30 transition-all duration-200">
              <Image
                src="/images/paint-logo-transparent.png"
                alt={COMPANY_INFO.name}
                width={28}
                height={28}
                className="w-7 h-7 filter brightness-0 invert"
              />
            </div>
            <span className="font-display font-bold text-xl text-gray-900 group-hover:text-primary-600 transition-colors">
              {COMPANY_INFO.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            {/* Services Dropdown */}
            <div className="relative">
              <button
                className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 font-medium transition-all duration-200 px-3 py-2 rounded-lg hover:bg-primary-50"
                onMouseEnter={() => setActiveDropdown('services')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <span>Services</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {activeDropdown === 'services' && (
                <div 
                  className="absolute top-full left-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100/50 p-3 backdrop-blur-lg"
                  onMouseEnter={() => setActiveDropdown('services')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {PAINTING_SERVICES.map((service) => (
                    <Link
                      key={service.id}
                      href={`/services/${service.id}`}
                      className="block px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-blue-50 hover:text-primary-700 transition-all duration-200 group"
                    >
                      <div className="font-semibold text-gray-900 group-hover:text-primary-700">{service.name}</div>
                      <div className="text-sm text-gray-500 group-hover:text-primary-600 mt-1">{service.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Locations Dropdown */}
            <div className="relative">
              <button
                className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 font-medium transition-all duration-200 px-3 py-2 rounded-lg hover:bg-primary-50"
                onMouseEnter={() => setActiveDropdown('locations')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <span>Locations</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {activeDropdown === 'locations' && (
                <div 
                  className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100/50 p-3 max-h-96 overflow-y-auto backdrop-blur-lg"
                  onMouseEnter={() => setActiveDropdown('locations')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {SERVICE_AREAS.map((area) => (
                    <Link
                      key={`${area.city}-${area.state}`}
                      href={`/locations/${area.city.toLowerCase().replace(' ', '-')}-${area.state.toLowerCase()}`}
                      className="block px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-blue-50 hover:text-primary-700 transition-all duration-200 font-medium text-gray-700"
                    >
                      {area.city}, {area.state}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/calculator" className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-200 px-3 py-2 rounded-lg hover:bg-primary-50">
              Quote Calculator
            </Link>
            
            <Link href="/pricing" className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-200 px-3 py-2 rounded-lg hover:bg-primary-50">
              Pricing
            </Link>
            
            <Link href="/about" className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-200 px-3 py-2 rounded-lg hover:bg-primary-50">
              About
            </Link>
            
            <Link href="/blog" className="text-gray-600 hover:text-primary-600 font-medium transition-all duration-200 px-3 py-2 rounded-lg hover:bg-primary-50">
              Blog
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {quotaInfo && (
              <div className={cn(
                "text-sm font-medium px-3 py-1 rounded-full",
                quotaInfo.limit === -1 ? "bg-green-100 text-green-700" :
                quotaInfo.used >= quotaInfo.limit * 0.8 ? "bg-red-100 text-red-700" :
                quotaInfo.used >= quotaInfo.limit * 0.5 ? "bg-yellow-100 text-yellow-700" :
                "bg-gray-100 text-gray-700"
              )}>
                {quotaInfo.limit === -1 ? "Unlimited" : `${quotaInfo.used}/${quotaInfo.limit}`} quotes
              </div>
            )}
            <Button asChild variant="kofi" size="default">
              <Link href="/get-quote">Try Quote Builder</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b shadow-lg">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link 
              href="/services" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/locations" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Locations
            </Link>
            <Link 
              href="/calculator" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Quote Calculator
            </Link>
            <Link 
              href="/about" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/blog" 
              className="block py-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            
            <div className="pt-4 border-t space-y-4">
              <Button asChild className="w-full">
                <Link href="/get-quote" onClick={() => setIsMenuOpen(false)}>
                  Try Quote Builder
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}