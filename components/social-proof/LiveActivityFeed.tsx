'use client';

import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Award, Clock, Users, CheckCircle, DollarSign } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'quote_created' | 'job_won' | 'time_saved' | 'milestone';
  name: string;
  location: string;
  value?: string;
  message: string;
  time: string;
  icon: React.ReactNode;
}

export function LiveActivityFeed({ variant = 'default' }: { variant?: 'default' | 'compact' | 'minimal' }) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState({
    quotesToday: 2847,
    revenueToday: 487000,
    activeNow: 247
  });

  // Generate realistic contractor names and locations
  const contractors = [
    { name: 'Mike Rodriguez', location: 'Dallas, TX' },
    { name: 'Sarah Johnson', location: 'Phoenix, AZ' },
    { name: 'Tom Williams', location: 'Miami, FL' },
    { name: 'Lisa Chen', location: 'Denver, CO' },
    { name: 'John Martinez', location: 'Austin, TX' },
    { name: 'Emily Davis', location: 'Seattle, WA' },
    { name: 'Robert Taylor', location: 'Atlanta, GA' },
    { name: 'Maria Garcia', location: 'Los Angeles, CA' }
  ];

  const generateActivity = (): ActivityItem => {
    const contractor = contractors[Math.floor(Math.random() * contractors.length)];
    const activityTypes = [
      {
        type: 'quote_created' as const,
        value: `$${(Math.random() * 8000 + 2000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
        message: 'created a quote for',
        icon: <DollarSign className="w-4 h-4 text-green-600" />
      },
      {
        type: 'job_won' as const,
        value: `$${(Math.random() * 12000 + 3000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
        message: 'won a job worth',
        icon: <Award className="w-4 h-4 text-yellow-600" />
      },
      {
        type: 'time_saved' as const,
        value: `${Math.floor(Math.random() * 4 + 1)} hours`,
        message: 'saved',
        icon: <Clock className="w-4 h-4 text-blue-600" />
      },
      {
        type: 'milestone' as const,
        message: 'reached 100 quotes this month',
        icon: <TrendingUp className="w-4 h-4 text-purple-600" />
      }
    ];

    const activity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    
    return {
      id: Date.now().toString() + Math.random(),
      type: activity.type,
      name: contractor.name,
      location: contractor.location,
      value: activity.value,
      message: activity.message,
      time: 'just now',
      icon: activity.icon
    };
  };

  // Initial activities
  useEffect(() => {
    const initialActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'quote_created',
        name: 'Mike Rodriguez',
        location: 'Dallas, TX',
        value: '$4,200',
        message: 'created a quote for',
        time: '2 min ago',
        icon: <DollarSign className="w-4 h-4 text-green-600" />
      },
      {
        id: '2',
        type: 'job_won',
        name: 'Sarah Johnson',
        location: 'Phoenix, AZ',
        value: '$8,500',
        message: 'won a job worth',
        time: '5 min ago',
        icon: <Award className="w-4 h-4 text-yellow-600" />
      },
      {
        id: '3',
        type: 'time_saved',
        name: 'Tom Williams',
        location: 'Miami, FL',
        value: '3 hours',
        message: 'saved',
        time: '7 min ago',
        icon: <Clock className="w-4 h-4 text-blue-600" />
      }
    ];
    setActivities(initialActivities);
  }, []);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update stats
      setStats(prev => ({
        quotesToday: prev.quotesToday + Math.floor(Math.random() * 3),
        revenueToday: prev.revenueToday + Math.floor(Math.random() * 5000),
        activeNow: Math.max(150, prev.activeNow + Math.floor(Math.random() * 10) - 5)
      }));

      // Add new activity
      setActivities(prev => {
        const newActivity = generateActivity();
        const updated = [newActivity, ...prev].slice(0, 5);
        
        // Update times
        return updated.map((activity, index) => {
          if (index === 0) return activity;
          const times = ['2 min ago', '5 min ago', '7 min ago', '10 min ago', '12 min ago'];
          return { ...activity, time: times[index] || '15 min ago' };
        });
      });
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, []);

  if (variant === 'minimal') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 animate-pulse">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-green-600 animate-spin" />
          <p className="text-sm font-medium text-green-800">
            <strong>{stats.activeNow}</strong> contractors creating quotes right now • 
            <strong> {stats.quotesToday.toLocaleString()}</strong> quotes today
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            Live Activity
          </h3>
          <span className="text-xs text-gray-500">{stats.activeNow} active now</span>
        </div>
        <div className="space-y-2">
          {activities.slice(0, 3).map((activity) => (
            <div key={activity.id} className="flex items-center gap-2 text-sm">
              {activity.icon}
              <span className="text-gray-700">
                <strong>{activity.name.split(' ')[0]}</strong> {activity.message} {activity.value}
              </span>
              <span className="text-gray-400 text-xs ml-auto">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">What's Happening Now</h3>
              <p className="text-sm text-white/80">Real-time contractor activity</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <span className="text-sm font-medium">{stats.activeNow} active</span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center justify-around text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-gray-600">
              <strong className="text-gray-900">{stats.quotesToday.toLocaleString()}</strong> quotes today
            </span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-gray-600">
              <strong className="text-gray-900">${(stats.revenueToday / 1000).toFixed(0)}K</strong> generated
            </span>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className={`flex items-start gap-3 ${index === 0 ? 'animate-slideIn' : ''}`}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <strong className="font-semibold">{activity.name}</strong>
                  <span className="text-gray-600"> from {activity.location}</span>
                </p>
                <p className="text-sm text-gray-700">
                  {activity.message} {activity.value && (
                    <strong className="text-green-600 font-semibold">{activity.value}</strong>
                  )}
                </p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}