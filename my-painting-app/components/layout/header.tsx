"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { COMPANY_INFO, SERVICE_AREAS, PAINTING_SERVICES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/paint-logo-transparent.png"
              alt={COMPANY_INFO.name}
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="font-display font-bold text-xl text-primary-700">
              {COMPANY_INFO.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Services Dropdown */}
            <div className="relative">
              <button
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                onMouseEnter={() => setActiveDropdown('services')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <span>Services</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {activeDropdown === 'services' && (
                <div 
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border p-2"
                  onMouseEnter={() => setActiveDropdown('services')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {PAINTING_SERVICES.map((service) => (
                    <Link
                      key={service.id}
                      href={`/services/${service.id}`}
                      className="block px-4 py-2 rounded hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    >
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-gray-600">{service.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Locations Dropdown */}
            <div className="relative">
              <button
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                onMouseEnter={() => setActiveDropdown('locations')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <span>Locations</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {activeDropdown === 'locations' && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border p-2 max-h-96 overflow-y-auto"
                  onMouseEnter={() => setActiveDropdown('locations')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {SERVICE_AREAS.map((area) => (
                    <Link
                      key={`${area.city}-${area.state}`}
                      href={`/locations/${area.city.toLowerCase().replace(' ', '-')}-${area.state.toLowerCase()}`}
                      className="block px-4 py-2 rounded hover:bg-primary-50 hover:text-primary-700 transition-colors"
                    >
                      {area.city}, {area.state}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/calculator" className="text-gray-700 hover:text-primary-600 transition-colors">
              Quote Calculator
            </Link>
            
            <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
              About
            </Link>
            
            <Link href="/blog" className="text-gray-700 hover:text-primary-600 transition-colors">
              Blog
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">{COMPANY_INFO.phone}</span>
            </a>
            
            <Button asChild>
              <Link href="/get-quote">Get Free Quote</Link>
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
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="flex items-center space-x-2 text-primary-600"
              >
                <Phone className="w-4 h-4" />
                <span className="font-medium">{COMPANY_INFO.phone}</span>
              </a>
              
              <Button asChild className="w-full">
                <Link href="/get-quote" onClick={() => setIsMenuOpen(false)}>
                  Get Free Quote
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}