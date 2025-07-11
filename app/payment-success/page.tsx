'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Simulate checking payment status
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div>
        <div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <div>
          <div>
            <CheckCircle />
          </div>
          <h1>Payment Successful!</h1>
          <p>Thank you for your subscription</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>Your account is now active and ready to use</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <span>1</span>
              </div>
              <div>
                <h3>Check Your Email</h3>
                <p>We've sent a receipt and login instructions to your email address.</p>
              </div>
            </div>

            <div>
              <div>
                <span>2</span>
              </div>
              <div>
                <h3>Access Your Dashboard</h3>
                <p>Start creating professional quotes and managing your business.</p>
              </div>
            </div>

            <div>
              <div>
                <span>3</span>
              </div>
              <div>
                <h3>Download the Mobile App</h3>
                <p>Create quotes on-site with our mobile app for iOS and Android.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <Link href="/dashboard">
            <Button size="lg">
              Go to Dashboard
              <ArrowRight />
            </Button>
          </Link>
          <Link href="/subscription/manage">
            <Button variant="outline" size="lg">
              <FileText />
              View Receipt
            </Button>
          </Link>
        </div>

        {sessionId && (
          <div>
            <p>
              Session ID: <code>{sessionId}</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div>
        <div>
          <div></div>
          <div></div>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}