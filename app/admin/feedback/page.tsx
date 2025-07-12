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
    <div>
      <div>
        <h1>User Feedback</h1>
        <p>Manage and respond to user feedback</p>
      </div>

      {/* Stats Cards */}
      <div>
        <div>
          <div>
            <MessageSquare size={24} />
            <span>{stats.total}</span>
          </div>
          <p>Total Feedback</p>
        </div>

        <div>
          <div>
            <Monitor size={24} />
            <span>{stats.app}</span>
          </div>
          <p>App Feedback</p>
        </div>

        <div>
          <div>
            <Globe size={24} />
            <span>{stats.website}</span>
          </div>
          <p>Website Feedback</p>
        </div>

        <div>
          <div>
            <span>
              New
            </span>
            <span>{stats.new}</span>
          </div>
          <p>Unread</p>
        </div>

        <div>
          <div>
            <Star size={24} />
            <span>{stats.avgRating.toFixed(1)}</span>
          </div>
          <p>Avg Rating</p>
        </div>
      </div>

      {/* Filters */}
      <div>
        <div>
          <div>
            <button
              onClick={() => setFilter('all')}
             `}
            >
              All Types
            </button>
            <button
              onClick={() => setFilter('app')}
             `}
            >
              App
            </button>
            <button
              onClick={() => setFilter('website')}
             `}
            >
              Website
            </button>
          </div>

          <div>
            <button
              onClick={() => setStatusFilter('all')}
             `}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('new')}
             `}
            >
              New
            </button>
            <button
              onClick={() => setStatusFilter('read')}
             `}
            >
              Read
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
             `}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div>
        {loading ? (
          <div>
            <div></div>
            <p>Loading feedback...</p>
          </div>
        ) : filteredFeedback.length === 0 ? (
          <div>
            <MessageSquare size={48} />
            <p>No feedback found</p>
          </div>
        ) : (
          filteredFeedback.map((item) => (
            <div
              key={item.id}
             `}
            >
              <div>
                <div>
                  <div`}>
                    {item.type === 'app' ? (
                      <Monitor`} size={20} />
                    ) : (
                      <Globe size={20} />
                    )}
                  </div>
                  <div>
                    <div>
                      {item.name && (
                        <div>
                          <User size={14} />
                          <span>{item.name}</span>
                        </div>
                      )}
                      {item.email && (
                        <a
                          href={`mailto:${item.email}`}
                         
                        >
                          <Mail size={14} />
                          <span>{item.email}</span>
                        </a>
                      )}
                      <div>
                        <Calendar size={14} />
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    {item.rating && (
                      <div>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                           
                          />
                        ))}
                      </div>
                    )}

                    <p>{item.message}</p>

                    <div>
                      {item.page && <span>Page: {item.page}</span>}
                      {item.companyName && <span>Company: {item.companyName}</span>}
                    </div>
                  </div>
                </div>

                <div>
                  <span
                   `}
                  >
                    {item.status}
                  </span>
                  
                  {item.status === 'new' && (
                    <button
                      onClick={() => markAsRead(item.id)}
                     
                    >
                      Mark as Read
                    </button>
                  )}
                  
                  {item.status !== 'resolved' && (
                    <button
                      onClick={() => markAsResolved(item.id)}
                     
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