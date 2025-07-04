'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Gift, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function TrialSuccessPage() {
  const [accessCode, setAccessCode] = useState('');

  useEffect(() => {
    // Get access code from localStorage or session
    const storedCode = localStorage.getItem('companyAccessCode');
    if (storedCode) {
      setAccessCode(storedCode);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <Gift className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to ProPaint Quote!</h1>
          <p className="text-xl text-gray-600">Your 14-day free trial is now active</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Your Trial Includes
            </CardTitle>
            <CardDescription>Everything you need to grow your painting business</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Unlimited professional quotes</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">AI-powered quote assistance</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Customer management system</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Business analytics dashboard</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Mobile app access</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Email and priority support</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {accessCode && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Important: Save Your Access Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-3">
                Your unique access code is:
              </p>
              <div className="bg-white rounded-lg p-4 text-center">
                <code className="text-2xl font-mono font-bold text-blue-600">{accessCode}</code>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Use this code to log in from any device. We've also sent this to your email.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/setup">
            <Button className="w-full" size="lg" variant="default">
              Complete Setup (2 min)
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="w-full" size="lg" variant="outline">
              Skip to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>No credit card required • Cancel anytime</p>
          <p className="mt-2">
            Questions? Email us at{' '}
            <a href="mailto:support@propaintquote.com" className="text-blue-600 hover:underline">
              support@propaintquote.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}