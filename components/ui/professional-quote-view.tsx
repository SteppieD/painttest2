"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  FileText, Download, Send, Printer, Check, Calendar, 
  Shield, Clock, Palette, Home, Mail, Phone, MapPin,
  DollarSign, Ruler, Brush, X, Eye, Trophy, Star
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuoteData {
  id: string
  customerName: string
  customerAddress: string
  projectType: string
  wallArea: number
  linearFeet: number
  ceilingHeight: number
  paintRequired: number
  paintBrand: string
  paintType: string
  paintCostPerGallon: number
  laborRate: number
  paintCost: number
  laborCost: number
  totalCost: number
  excludes: string[]
  createdAt: string
  companyInfo?: {
    name: string
    logo?: string
    phone: string
    email: string
    address: string
    license?: string
  }
}

interface ProfessionalQuoteViewProps {
  quoteData: QuoteData
  onClose?: () => void
  onSend?: () => void
  onDownload?: () => void
  onPrint?: () => void
}

export function ProfessionalQuoteView({ 
  quoteData, 
  onClose,
  onSend,
  onDownload,
  onPrint
}: ProfessionalQuoteViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'terms'>('overview')
  
  const companyInfo = quoteData.companyInfo || {
    name: 'ProPaint Contractors',
    phone: '(555) 123-4567',
    email: 'quotes@propaintcontractors.com',
    address: '123 Main Street, City, State 12345',
    license: 'License #123456'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const quoteValidUntil = new Date()
  quoteValidUntil.setDate(quoteValidUntil.getDate() + 30)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Professional Painting Quote</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrint}
                className="text-white hover:bg-white/20"
              >
                <Printer className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDownload}
                className="text-white hover:bg-white/20"
              >
                <Download className="w-5 h-5" />
              </Button>
              {onClose && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Company Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-1">{companyInfo.name}</h2>
              <p className="text-white/80 text-sm">{companyInfo.license}</p>
            </div>
            <div className="text-right text-sm space-y-1">
              <p className="flex items-center justify-end gap-2">
                <Phone className="w-4 h-4" />
                {companyInfo.phone}
              </p>
              <p className="flex items-center justify-end gap-2">
                <Mail className="w-4 h-4" />
                {companyInfo.email}
              </p>
              <p className="flex items-center justify-end gap-2">
                <MapPin className="w-4 h-4" />
                {companyInfo.address}
              </p>
            </div>
          </div>
        </div>

        {/* Quote Number & Date */}
        <div className="bg-gray-50 px-6 py-3 border-b">
          <div className="flex justify-between items-center text-sm">
            <div>
              <span className="text-gray-600">Quote #</span>
              <span className="font-mono font-bold ml-2">{quoteData.id}</span>
            </div>
            <div>
              <span className="text-gray-600">Date:</span>
              <span className="font-medium ml-2">{new Date(quoteData.createdAt).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-gray-600">Valid Until:</span>
              <span className="font-medium ml-2">{quoteValidUntil.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="px-6 py-4 border-b bg-white">
          <div className="flex items-start gap-3">
            <Home className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <h3 className="font-semibold text-lg">{quoteData.customerName}</h3>
              <p className="text-gray-600">{quoteData.customerAddress}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b bg-gray-50">
          <div className="flex">
            {(['overview', 'details', 'terms'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-3 font-medium capitalize transition-colors",
                  activeTab === tab
                    ? "bg-white text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 400px)' }}>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Project Summary */}
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Project Summary
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Project Type</p>
                    <p className="font-semibold capitalize">{quoteData.projectType} Painting</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Wall Area</p>
                    <p className="font-semibold">{quoteData.wallArea.toLocaleString()} sq ft</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Paint Selected</p>
                    <p className="font-semibold">{quoteData.paintBrand} {quoteData.paintType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Paint Required</p>
                    <p className="font-semibold">{quoteData.paintRequired} gallons</p>
                  </div>
                </div>
              </Card>

              {/* Cost Breakdown */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Cost Breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-gray-400" />
                      <span>Paint & Materials</span>
                      <span className="text-xs text-gray-500">
                        ({quoteData.paintRequired} gal × {formatCurrency(quoteData.paintCostPerGallon)})
                      </span>
                    </div>
                    <span className="font-medium">{formatCurrency(quoteData.paintCost)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2">
                      <Brush className="w-4 h-4 text-gray-400" />
                      <span>Labor</span>
                      <span className="text-xs text-gray-500">
                        ({quoteData.wallArea} sq ft × {formatCurrency(quoteData.laborRate)})
                      </span>
                    </div>
                    <span className="font-medium">{formatCurrency(quoteData.laborCost)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Quote</span>
                      <span className="text-2xl font-bold text-primary-600">
                        {formatCurrency(quoteData.totalCost)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* What's Included */}
              <Card className="p-6 bg-green-50 border-green-200">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  What's Included
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Professional surface preparation and cleaning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Premium {quoteData.paintBrand} {quoteData.paintType} paint</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Professional application by experienced painters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Complete cleanup and inspection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>2-year warranty on workmanship</span>
                  </li>
                </ul>
              </Card>

              {/* What's Not Included */}
              {quoteData.excludes.length > 0 && (
                <Card className="p-6 bg-orange-50 border-orange-200">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <X className="w-5 h-5 text-orange-600" />
                    Not Included
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {quoteData.excludes.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <X className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span className="capitalize">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Project Specifications */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-blue-600" />
                  Project Specifications
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-600">Linear Feet of Walls</p>
                      <p className="font-semibold">{quoteData.linearFeet} ft</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Ceiling Height</p>
                      <p className="font-semibold">{quoteData.ceilingHeight} ft</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Wall Area</p>
                      <p className="font-semibold">{quoteData.wallArea.toLocaleString()} sq ft</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-600">Paint Coverage Rate</p>
                      <p className="font-semibold">350 sq ft per gallon</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Number of Coats</p>
                      <p className="font-semibold">2 coats</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Estimated Duration</p>
                      <p className="font-semibold">2-3 days</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Timeline */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Project Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-purple-600">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Day 1: Preparation</p>
                      <p className="text-sm text-gray-600">Surface cleaning, taping, and drop cloth placement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-purple-600">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Day 2: Painting</p>
                      <p className="text-sm text-gray-600">First coat application and drying time</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-purple-600">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Day 3: Finishing</p>
                      <p className="text-sm text-gray-600">Second coat, touch-ups, and cleanup</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quality Assurance */}
              <Card className="p-6 bg-blue-50 border-blue-200">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Quality Assurance
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>All painters are licensed and insured professionals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>We use only premium grade paints and materials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Final walkthrough and inspection with customer</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>100% satisfaction guarantee</span>
                  </li>
                </ul>
              </Card>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Terms & Conditions</h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">1. Quote Validity</h4>
                    <p>This quote is valid for 30 days from the date of issue. Prices are subject to change after this period.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">2. Payment Terms</h4>
                    <p>50% deposit required upon acceptance of quote. Remaining balance due upon completion of work.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">3. Scope of Work</h4>
                    <p>This quote includes only the work specifically described above. Additional work will require a separate quote.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">4. Warranty</h4>
                    <p>We provide a 2-year warranty on all workmanship. Paint manufacturer warranties apply to materials.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">5. Customer Responsibilities</h4>
                    <p>Customer must provide clear access to work areas and remove or protect valuable items.</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-green-50 border-green-200">
                <h3 className="font-semibold text-lg mb-4">Why Choose {companyInfo.name}?</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Trophy className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Over 15 years of professional painting experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Fully licensed, bonded, and insured</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>4.9/5 average rating from 500+ satisfied customers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>On-time completion guarantee</span>
                  </li>
                </ul>
              </Card>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t bg-gray-50 p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <p className="text-sm text-gray-600 text-center sm:text-left">
              <Clock className="w-4 h-4 inline mr-1" />
              This quote is valid until {quoteValidUntil.toLocaleDateString()}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onDownload}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button
                onClick={onSend}
                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white gap-2"
              >
                <Send className="w-4 h-4" />
                Send to Customer
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}