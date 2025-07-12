'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, DollarSign, MapPin, User, Clock, CheckCircle, XCircle, Send, FileText, Edit } from 'lucide-react';

interface Quote {
  id: string | number;
  quote_id?: string;
  projectId: string;
  clientName: string;
  propertyAddress: string;
  projectType: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'completed';
  baseCosts: any;
  markupPercentage: number;
  finalPrice: number;
  createdAt: string;
  updatedAt?: string;
}

export default function QuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    filterAndSortQuotes();
  }, [quotes, filter, searchTerm, sortBy]);

  const fetchQuotes = async () => {
    try {
      const response = await fetch('/api/quotes');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched quotes data:', data);
        setQuotes(data.quotes || []);
      } else {
        console.error('Failed to fetch quotes:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortQuotes = () => {
    let filtered = [...quotes];

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(quote => quote.status === filter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(quote => 
        quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(quote.quote_id || quote.id).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest':
          return b.finalPrice - a.finalPrice;
        case 'lowest':
          return a.finalPrice - b.finalPrice;
        default:
          return 0;
      }
    });

    setFilteredQuotes(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'sent': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText />;
      case 'pending': return <Clock />;
      case 'sent': return <Send />;
      case 'accepted': return <CheckCircle />;
      case 'rejected': return <XCircle />;
      case 'completed': return <CheckCircle />;
      default: return <FileText />;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div>
        <div>
          <div></div>
          <p>Loading quotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div>
        <div>
          <div>
            <div>
              <button
                onClick={() => router.push('/dashboard')}
               
              >
                <ArrowLeft />
              </button>
              <h1>All Quotes</h1>
            </div>
            <button
              onClick={() => router.push('/create-quote')}
             
            >
              <span>Create New Quote</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div>
        <div>
          <div>
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search by client name, address, or quote ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
               
              />
            </div>

            {/* Status Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
             
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
             
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Price</option>
              <option value="lowest">Lowest Price</option>
            </select>
          </div>

          {/* Results count */}
          <div>
            Showing {filteredQuotes.length} of {quotes.length} quotes
          </div>
        </div>
      </div>

      {/* Quotes Grid */}
      <div>
        {filteredQuotes.length === 0 ? (
          <div>
            <FileText />
            <h3>No quotes found</h3>
            <p>
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your filters or search term.'
                : 'Create your first quote to get started.'}
            </p>
            {filter === 'all' && !searchTerm && (
              <button
                onClick={() => router.push('/create-quote')}
               
              >
                Create First Quote
              </button>
            )}
          </div>
        ) : (
          <div>
            {filteredQuotes.map((quote) => (
              <div
                key={quote.id}
               
                onClick={() => router.push(`/quotes/${quote.id}/review`)}
              >
                {/* Quote Header */}
                <div>
                  {/* Status Badge */}
                  <div>
                    <span`}>
                      {getStatusIcon(quote.status)}
                      <span>{quote.status}</span>
                    </span>
                    <span>{formatDate(quote.createdAt)}</span>
                  </div>

                  {/* Client Info */}
                  <div>
                    <div>
                      <User />
                      <div>
                        <p>{quote.clientName}</p>
                        <p>{quote.projectType} Project</p>
                      </div>
                    </div>

                    <div>
                      <MapPin />
                      <p>{quote.propertyAddress}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <div>
                      <span>Total Quote</span>
                      <span>{formatCurrency(quote.finalPrice)}</span>
                    </div>
                    {quote.markupPercentage > 0 && (
                      <p>
                        Includes {quote.markupPercentage}% markup
                      </p>
                    )}
                  </div>
                </div>

                {/* Hover Actions */}
                <div>
                  <span>Quote #{quote.quote_id || quote.id}</span>
                  <div>
                    <span>View Details</span>
                    <ArrowLeft />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}