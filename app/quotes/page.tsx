"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  FileText, Search, Filter, Download, Eye, Send, Trash2,
  Calendar, DollarSign, Home, CheckCircle, Clock, X, 
  TrendingUp, Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import { ProfessionalQuoteView } from '@/components/ui/professional-quote-view'

interface Quote {
  id: string
  customerName: string
  customerAddress: string
  total: number
  createdAt: string
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected'
  projectType: string
  area: number
  paintCost?: number
  laborCost?: number
  surfaces?: any
  paint?: any
  laborRate?: number
  excludes?: string[]
}

export default function QuotesPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'customer'>('date')
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [showQuoteView, setShowQuoteView] = useState(false)

  useEffect(() => {
    // Check authentication
    const authData = sessionStorage.getItem('paintQuoteAuth')
    if (!authData) {
      router.push('/trial-signup')
      return
    }

    try {
      const session = JSON.parse(authData)
      // Load quotes from localStorage
      const savedQuotes = JSON.parse(localStorage.getItem(`quotes_${session.companyId}`) || '[]')
      setQuotes(savedQuotes)
      setFilteredQuotes(savedQuotes)
      setIsLoading(false)
    } catch (error) {
      console.error('Failed to load quotes:', error)
      router.push('/trial-signup')
    }
  }, [router])

  useEffect(() => {
    // Filter and sort quotes
    let filtered = [...quotes]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(quote => 
        quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.customerAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(quote => quote.status === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'amount':
          return b.total - a.total
        case 'customer':
          return a.customerName.localeCompare(b.customerName)
        default:
          return 0
      }
    })

    setFilteredQuotes(filtered)
  }, [quotes, searchTerm, statusFilter, sortBy])

  const updateQuoteStatus = (quoteId: string, newStatus: Quote['status']) => {
    const authData = sessionStorage.getItem('paintQuoteAuth')
    if (!authData) return

    try {
      const session = JSON.parse(authData)
      const updatedQuotes = quotes.map(quote => 
        quote.id === quoteId ? { ...quote, status: newStatus } : quote
      )
      setQuotes(updatedQuotes)
      localStorage.setItem(`quotes_${session.companyId}`, JSON.stringify(updatedQuotes))
    } catch (error) {
      console.error('Failed to update quote status:', error)
    }
  }

  const deleteQuote = (quoteId: string) => {
    if (!confirm('Are you sure you want to delete this quote?')) return

    const authData = sessionStorage.getItem('paintQuoteAuth')
    if (!authData) return

    try {
      const session = JSON.parse(authData)
      const updatedQuotes = quotes.filter(quote => quote.id !== quoteId)
      setQuotes(updatedQuotes)
      localStorage.setItem(`quotes_${session.companyId}`, JSON.stringify(updatedQuotes))
    } catch (error) {
      console.error('Failed to delete quote:', error)
    }
  }

  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'viewed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: Quote['status']) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />
      case 'sent':
        return <Send className="w-4 h-4" />
      case 'viewed':
        return <Eye className="w-4 h-4" />
      case 'rejected':
        return <X className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Calculate stats
  const stats = {
    total: quotes.length,
    totalValue: quotes.reduce((sum, q) => sum + q.total, 0),
    accepted: quotes.filter(q => q.status === 'accepted').length,
    pending: quotes.filter(q => q.status === 'draft' || q.status === 'sent').length
  }

  return (
    <>
      <Header />
      
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900">
                  My Quotes
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage and track all your painting quotes in one place
                </p>
              </div>
              <Link href="/get-quote">
                <Button className="bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Quote
                </Button>
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Quotes</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Value</p>
                      <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Accepted</p>
                      <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by customer name, address, or quote ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border rounded-lg text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="viewed">Viewed</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 border rounded-lg text-sm"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="amount">Sort by Amount</option>
                    <option value="customer">Sort by Customer</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quotes List */}
          <Card>
            <CardContent className="p-0">
              {filteredQuotes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quote ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredQuotes.map((quote) => (
                        <tr key={quote.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {quote.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {quote.customerName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {quote.customerAddress}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center gap-2">
                              <Home className="w-4 h-4 text-gray-400" />
                              <span className="capitalize">{quote.projectType}</span>
                              <span className="text-gray-500">• {quote.area} sq ft</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(quote.total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(quote.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                              getStatusColor(quote.status)
                            )}>
                              {getStatusIcon(quote.status)}
                              <span className="capitalize">{quote.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedQuote(quote)
                                  setShowQuoteView(true)
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateQuoteStatus(quote.id, 'sent')}
                                disabled={quote.status !== 'draft'}
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteQuote(quote.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'No quotes found matching your filters' 
                      : 'No quotes created yet'}
                  </p>
                  <Link href="/get-quote">
                    <Button variant="outline">
                      Create Your First Quote
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Professional Quote View Modal */}
      {showQuoteView && selectedQuote && (
        <ProfessionalQuoteView
          quoteData={{
            id: selectedQuote.id,
            customerName: selectedQuote.customerName,
            customerAddress: selectedQuote.customerAddress,
            projectType: selectedQuote.projectType,
            wallArea: selectedQuote.area,
            linearFeet: selectedQuote.surfaces?.walls?.linearFeet || 0,
            ceilingHeight: selectedQuote.surfaces?.walls?.height || 0,
            paintRequired: Math.ceil(selectedQuote.area / 350) || 0,
            paintBrand: selectedQuote.paint?.brand || 'Sherwin Williams',
            paintType: selectedQuote.paint?.product || 'Premium',
            paintCostPerGallon: selectedQuote.paint?.pricePerGallon || 50,
            laborRate: selectedQuote.laborRate || 1.50,
            paintCost: selectedQuote.paintCost || 0,
            laborCost: selectedQuote.laborCost || 0,
            totalCost: selectedQuote.total,
            excludes: selectedQuote.excludes || ['ceilings', 'doors', 'trim', 'primer'],
            createdAt: selectedQuote.createdAt
          }}
          onClose={() => {
            setShowQuoteView(false)
            setSelectedQuote(null)
          }}
          onSend={() => {
            updateQuoteStatus(selectedQuote.id, 'sent')
            setShowQuoteView(false)
            setSelectedQuote(null)
          }}
          onDownload={() => {
            // TODO: Implement PDF download
            console.log('Download quote:', selectedQuote.id)
          }}
          onPrint={() => {
            window.print()
          }}
        />
      )}
      
      <Footer />
    </>
  )
}