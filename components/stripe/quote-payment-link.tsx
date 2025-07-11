'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Link2, Copy, Loader2, ExternalLink } from 'lucide-react';

interface QuotePaymentLinkProps {
  quoteId: number;
  existingLink?: string;
  amount: number;
}

export function QuotePaymentLink({ quoteId, existingLink, amount }: QuotePaymentLinkProps) {
  const [paymentLink, setPaymentLink] = useState(existingLink || '');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createPaymentLink = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stripe/create-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create payment link');
      }

      const { paymentLink } = await response.json();
      setPaymentLink(paymentLink);
      
      toast({
        title: 'Payment link created!',
        description: 'You can now share this link with your customer.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentLink);
    toast({
      title: 'Copied!',
      description: 'Payment link copied to clipboard.',
    });
  };

  if (!paymentLink) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Link2 />
            Payment Link
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Create a secure payment link to share with your customer.
          </p>
          <Button onClick={createPaymentLink} disabled={loading}>
            {loading ? (
              <>
                <Loader2 />
                Creating...
              </>
            ) : (
              <>
                <Link2 />
                Create Payment Link
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link2 />
          Payment Link Ready
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <div>
            <p>Share this link with your customer:</p>
            <div>
              <input
                type="text"
                value={paymentLink}
                readOnly
               
              />
              <Button size="sm" variant="outline" onClick={copyToClipboard}>
                <Copy />
              </Button>
            </div>
          </div>
          
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(paymentLink, '_blank')}
            >
              <ExternalLink />
              Preview Link
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={createPaymentLink}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 />
                  Regenerating...
                </>
              ) : (
                'Regenerate Link'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}