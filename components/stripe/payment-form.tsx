'use client';

import { useState, useEffect } from 'react';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { formatAmountFromCents } from '@/lib/stripe/config';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  quoteId: number;
  amount: number;
  customerEmail?: string;
  customerName?: string;
  onSuccess?: () => void;
}

function CheckoutForm({ amount, onSuccess }: { amount: number; onSuccess?: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/quotes/payment-success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      toast({
        title: 'Payment failed',
        description: error.message,
        variant: 'destructive',
      });
      setIsLoading(false);
    } else {
      toast({
        title: 'Payment successful!',
        description: 'Thank you for your payment.',
      });
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement 
        options={{
          layout: 'tabs',
        }}
      />
      
      <div>
        <div>
          <span>Total Amount:</span>
          <span>
            {formatAmountFromCents(amount)}
          </span>
        </div>
        
        <Button
          type="submit"
          disabled={isLoading || !stripe || !elements}
         
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 />
              Processing...
            </>
          ) : (
            `Pay ${formatAmountFromCents(amount)}`
          )}
        </Button>
      </div>
    </form>
  );
}

export function PaymentForm({ 
  quoteId, 
  amount, 
  customerEmail, 
  customerName,
  onSuccess 
}: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Create PaymentIntent as soon as the component loads
    fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quoteId,
        customerEmail,
        customerName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setClientSecret(data.clientSecret);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error creating payment intent:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to initialize payment',
          variant: 'destructive',
        });
        setLoading(false);
      });
  }, [quoteId, customerEmail, customerName, toast]);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Loader2 />
        </CardContent>
      </Card>
    );
  }

  if (!clientSecret) {
    return (
      <Card>
        <CardContent>
          <p>Failed to initialize payment. Please try again.</p>
        </CardContent>
      </Card>
    );
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#ef2b70',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm amount={amount} onSuccess={onSuccess} />
        </Elements>
      </CardContent>
    </Card>
  );
}