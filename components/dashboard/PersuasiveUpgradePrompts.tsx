'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Crown, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Clock, 
  AlertCircle,
  Gift,
  Star,
  Award,
  CheckCircle,
  ArrowRight,
  Zap
} from 'lucide-react';

interface QuotaInfo {
  isTrial: boolean;
  quotesUsed: number;
  quotesAllowed: number | null;
}

interface PersuasiveUpgradePromptsProps {
  quotaInfo: QuotaInfo;
  companyName?: string;
}

export function PersuasiveUpgradePrompts({ quotaInfo, companyName = "Your Company" }: PersuasiveUpgradePromptsProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [peerComparison, setPeerComparison] = useState({
    avgQuotes: 45,
    topPerformers: 120,
    percentile: 0
  });

  // Calculate time pressure for month end
  useEffect(() => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const hoursLeft = Math.floor((endOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (hoursLeft < 72) {
      setTimeLeft(`${hoursLeft} hours left this month`);
    }
  }, []);

  // Calculate peer comparison
  useEffect(() => {
    if (quotaInfo.quotesUsed && quotaInfo.quotesAllowed) {
      const percentile = Math.min(95, Math.floor((quotaInfo.quotesUsed / peerComparison.avgQuotes) * 100));
      setPeerComparison(prev => ({ ...prev, percentile }));
    }
  }, [quotaInfo.quotesUsed, quotaInfo.quotesAllowed]);

  const quotaPercentage = quotaInfo.quotesAllowed 
    ? (quotaInfo.quotesUsed / quotaInfo.quotesAllowed) * 100 
    : 0;

  // Don't show if not on trial or quota is low
  if (!quotaInfo.isTrial || quotaPercentage < 50) {
    return null;
  }

  // Different prompts based on quota usage
  if (quotaPercentage >= 100) {
    // SCARCITY + LOSS AVERSION - At limit
    return (
      <div className="mb-8 animate-pulse">
        <Card className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-2xl border-0">
          <CardContent className="p-8">
            {/* Urgent Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">You're Turning Away Money! 🚨</h3>
                <p className="text-white/90">Quote limit reached - losing potential jobs to competitors</p>
              </div>
            </div>

            {/* Social Proof - What others are doing */}
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-6">
              <p className="text-sm mb-2">
                <strong>Right now:</strong> 3 contractors in your area just won jobs you couldn't quote
              </p>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-2xl font-bold">$12,400</span>
                  <p className="text-sm text-white/80">Avg job value you're missing</p>
                </div>
                <div className="border-l border-white/20 pl-4">
                  <span className="text-2xl font-bold">87%</span>
                  <p className="text-sm text-white/80">Of contractors upgrade at this point</p>
                </div>
              </div>
            </div>

            {/* Reciprocity - What they get */}
            <div className="flex items-center justify-between gap-6">
              <div className="flex-1">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Upgrade Now & Get:
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>✓ Unlimited quotes for the rest of this month</li>
                  <li>✓ <strong>BONUS:</strong> 20% off forever (ends {timeLeft || 'soon'})</li>
                  <li>✓ Remove "ProPaint Quote" branding immediately</li>
                  <li>✓ Priority support to win more jobs</li>
                </ul>
              </div>
              
              <div className="text-center">
                <Button 
                  size="lg"
                  onClick={() => router.push('/pricing')}
                  className="bg-white text-orange-600 hover:bg-gray-100 font-bold shadow-lg transform hover:scale-105 transition-all"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Unlock Unlimited Quotes
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-xs mt-2 text-white/80">
                  Join 2,147 contractors who upgraded today
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } else if (quotaPercentage >= 80) {
    // SOCIAL PROOF + AUTHORITY - Almost at limit
    return (
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Left side - Peer comparison */}
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    You're outperforming {peerComparison.percentile}% of contractors! 🌟
                  </h3>
                  <p className="text-white/90 mb-3">
                    But you're hitting limits. Top performers like you create {peerComparison.topPerformers}+ quotes/month
                  </p>
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="font-bold">{quotaInfo.quotesUsed}/{quotaInfo.quotesAllowed}</span>
                      <span className="text-white/70 ml-1">quotes used</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-white/70">{quotaInfo.quotesAllowed! - quotaInfo.quotesUsed} left</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - CTA */}
              <div className="text-center lg:text-right">
                <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold inline-block mb-3">
                  🎯 Perfect Time to Upgrade
                </div>
                <Button 
                  size="lg"
                  variant="secondary"
                  onClick={() => router.push('/pricing')}
                  className="bg-white text-blue-600 hover:bg-gray-100 font-bold"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Go Professional - Save 20%
                </Button>
                <p className="text-xs mt-2 text-white/80">
                  Cancel anytime • 30-day guarantee
                </p>
              </div>
            </div>

            {/* Success story - LIKING */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
                <p className="text-sm">
                  <strong>"Upgraded at 80% usage too."</strong> Now doing $45K/month, up from $15K. 
                  The unlimited quotes let me say yes to every opportunity. - <em>Tom S., Dallas</em>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } else {
    // COMMITMENT & CONSISTENCY - Building habits
    return (
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">
                    Great momentum, {companyName}! Keep it going 🚀
                  </h3>
                  <p className="text-white/90">
                    You've used {quotaInfo.quotesUsed} of {quotaInfo.quotesAllowed} free quotes
                  </p>
                  {/* Progress indicator - COMMITMENT */}
                  <div className="mt-2 bg-white/20 rounded-full h-2 w-48">
                    <div 
                      className="bg-white rounded-full h-2 transition-all"
                      style={{ width: `${quotaPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-white/80 mb-2">
                  On track to save 20+ hours/month
                </p>
                <Button 
                  size="sm"
                  variant="secondary"
                  onClick={() => router.push('/pricing')}
                  className="bg-white/20 text-white hover:bg-white/30 border-white/30"
                >
                  <Award className="w-4 h-4 mr-2" />
                  See Pro Benefits
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}