'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Copy, ArrowRight, Zap, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Footer } from '@/components/shared/footer';

export default function TrialSuccessPage() {
  const router = useRouter();
  const [accessCode, setAccessCode] = useState('');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Get access code and email from localStorage
    const storedCode = localStorage.getItem('companyAccessCode');
    const storedEmail = localStorage.getItem('trialEmail');
    if (storedCode) {
      setAccessCode(storedCode);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
    
    // Clear the temporary storage
    localStorage.removeItem('trialEmail');
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(accessCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGetStarted = () => {
    // Store company info in session for dashboard access
    if (accessCode) {
      // Note: In a real app, you'd fetch the company data from the backend
      localStorage.setItem(
        "paintquote_company",
        JSON.stringify({
          accessCode: accessCode,
          loginTime: Date.now(),
        })
      );
      router.push('/setup-chat');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="min-h-[80vh] flex items-center py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              You're all set!
            </h1>
            
            <p className="text-xl text-gray-600">
              Check your email for your welcome message. Here's your access code:
            </p>
          </div>

          {/* Access Code Display */}
          <div className="ac-card shadow-xl border-2 mb-8">
            <div className="ac-card-body p-8">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">Your Access Code</p>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-4xl font-mono font-bold text-primary-pink">
                      {accessCode || 'Loading...'}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="ac-btn ac-btn-secondary ac-btn-sm"
                      title="Copy access code"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  Save this code - you'll need it to sign in to your account
                </p>

                <button
                  onClick={handleGetStarted}
                  className="ac-btn ac-btn-primary ac-btn-lg"
                >
                  Complete Setup
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div className="ac-card">
            <div className="ac-card-body p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary-pink" />
                What happens next?
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-purple-600">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Check your email</h3>
                    <p className="text-gray-600">We sent your access code and quick start guide to {email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-purple-600">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Complete your setup</h3>
                    <p className="text-gray-600">Tell us about your business and customize your preferences (2 minutes)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-purple-600">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Create your first quote</h3>
                    <p className="text-gray-600">See how fast you can create professional quotes with AI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email reminder */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Can't find our email?</span> Check your spam folder or{' '}
                <button className="underline hover:no-underline">request a new one</button>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}