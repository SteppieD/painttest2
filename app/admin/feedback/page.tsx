'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Star, Mail, Calendar, User, Globe, Monitor } from 'lucide-react';

interface Feedback {
  id: string;
  message: string;
  email?: string;
  name?: string;
  type: 'app' | 'website';
  page?: string;
  rating?: number;
  timestamp: string;
  status: 'new' | 'read' | 'resolved';
  companyName?: string;
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'app' | 'website'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'resolved'>('all');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch('/api/feedback');
      const data = await response.json();
      
      if (data.success) {
        setFeedback(data.feedback);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setFeedback(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: 'read' as const } : item
      )
    );
  };

  const markAsResolved = (id: string) => {
    setFeedback(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: 'resolved' as const } : item
      )
    );
  };

  const filteredFeedback = feedback.filter(item => {
    if (filter !== 'all' && item.type !== filter) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: feedback.length,
    app: feedback.filter(f => f.type === 'app').length,
    website: feedback.filter(f => f.type === 'website').length,
    new: feedback.filter(f => f.status === 'new').length,
    avgRating: feedback.filter(f => f.rating).reduce((acc, f) => acc + (f.rating || 0), 0) / 
               feedback.filter(f => f.rating).length || 0,
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Feedback</h1>
        <p className="text-gray-600">Manage and respond to user feedback</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="text-gray-400" size={24} />
            <span className="text-2xl font-bold">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-600">Total Feedback</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Monitor className="text-blue-500" size={24} />
            <span className="text-2xl font-bold">{stats.app}</span>
          </div>
          <p className="text-sm text-gray-600">App Feedback</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Globe className="text-green-500" size={24} />
            <span className="text-2xl font-bold">{stats.website}</span>
          </div>
          <p className="text-sm text-gray-600">Website Feedback</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              New
            </span>
            <span className="text-2xl font-bold">{stats.new}</span>
          </div>
          <p className="text-sm text-gray-600">Unread</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Star className="text-yellow-500 fill-yellow-500" size={24} />
            <span className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</span>
          </div>
          <p className="text-sm text-gray-600">Avg Rating</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setFilter('app')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'app'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              App
            </button>
            <button
              onClick={() => setFilter('website')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'website'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Website
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('new')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'new'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              New
            </button>
            <button
              onClick={() => setStatusFilter('read')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'read'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Read
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'resolved'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading feedback...</p>
          </div>
        ) : filteredFeedback.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
            <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-600">No feedback found</p>
          </div>
        ) : (
          filteredFeedback.map((item) => (
            <div
              key={item.id}
              className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${
                item.status === 'new' ? 'border-l-4 border-l-orange-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className={`p-2 rounded-lg ${
                    item.type === 'app' ? 'bg-blue-50' : 'bg-green-50'
                  }`}>
                    {item.type === 'app' ? (
                      <Monitor className={`${
                        item.type === 'app' ? 'text-blue-600' : 'text-green-600'
                      }`} size={20} />
                    ) : (
                      <Globe className="text-green-600" size={20} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      {item.name && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <User size={14} />
                          <span>{item.name}</span>
                        </div>
                      )}
                      {item.email && (
                        <a
                          href={`mailto:${item.email}`}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                          <Mail size={14} />
                          <span>{item.email}</span>
                        </a>
                      )}
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    {item.rating && (
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={
                              star <= item.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                    )}

                    <p className="text-gray-800 mb-2">{item.message}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {item.page && <span>Page: {item.page}</span>}
                      {item.companyName && <span>Company: {item.companyName}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'new'
                        ? 'bg-red-100 text-red-800'
                        : item.status === 'read'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {item.status}
                  </span>
                  
                  {item.status === 'new' && (
                    <button
                      onClick={() => markAsRead(item.id)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Mark as Read
                    </button>
                  )}
                  
                  {item.status !== 'resolved' && (
                    <button
                      onClick={() => markAsResolved(item.id)}
                      className="text-xs text-green-600 hover:underline"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}