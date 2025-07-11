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
    <div>
      <section>
        <div>
          <div>
            <div>
              <CheckCircle />
            </div>
            
            <h1>
              You're all set!
            </h1>
            
            <p>
              Check your email for your welcome message. Here's your access code:
            </p>
          </div>

          {/* Access Code Display */}
          <div>
            <div>
              <div>
                <p>Your Access Code</p>
                
                <div>
                  <div>
                    <span>
                      {accessCode || 'Loading...'}
                    </span>
                    <button
                      onClick={handleCopy}
                     
                      title="Copy access code"
                    >
                      <Copy />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <p>
                  Save this code - you'll need it to sign in to your account
                </p>

                <button
                  onClick={handleGetStarted}
                 
                >
                  Complete Setup
                  <ArrowRight />
                </button>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div>
            <div>
              <h2>
                <Zap />
                What happens next?
              </h2>
              
              <div>
                <div>
                  <div>
                    <span>1</span>
                  </div>
                  <div>
                    <h3>Check your email</h3>
                    <p>We sent your access code and quick start guide to {email}</p>
                  </div>
                </div>
                
                <div>
                  <div>
                    <span>2</span>
                  </div>
                  <div>
                    <h3>Complete your setup</h3>
                    <p>Tell us about your business and customize your preferences (2 minutes)</p>
                  </div>
                </div>
                
                <div>
                  <div>
                    <span>3</span>
                  </div>
                  <div>
                    <h3>Create your first quote</h3>
                    <p>See how fast you can create professional quotes with AI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email reminder */}
          <div>
            <Mail />
            <div>
              <p>
                <span>Can't find our email?</span> Check your spam folder or{' '}
                <button>request a new one</button>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}