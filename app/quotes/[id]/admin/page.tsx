'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  Mail, 
  Download, 
  Send, 
  Eye, 
  Copy, 
  Phone,
  FileText,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Clock
} from 'lucide-react';

interface QuoteData {
  id: string;
  quote_id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  address: string;
  project_type: string;
  total_cost: number;
  final_price?: number;
  timeline?: string;
  created_at: string;
  status?: string;
  company_name?: string;
  company_email?: string;
  company_phone?: string;
}

export default function QuoteAdminPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailAddress, setEmailAddress] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    loadQuote();
  }, [params.id]);

  const loadQuote = async () => {
    try {
      const response = await fetch(`/api/quotes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setQuote(data);
        setEmailAddress(data.customer_email || '');
      }
    } catch (error) {
      console.error('Error loading quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmail = async (action: 'send_quote' | 'follow_up' | 'acceptance_confirmation') => {
    if (!emailAddress.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingEmail(true);
    try {
      const response = await fetch(`/api/quotes/${params.id}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          recipient_email: emailAddress
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Email Sent!",
          description: `Quote email sent successfully to ${emailAddress}`,
        });
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const previewEmail = (action: 'send_quote' | 'follow_up' | 'acceptance_confirmation') => {
    window.open(`/api/quotes/${params.id}/email?action=${action}&format=html`, '_blank');
  };

  const downloadPDF = () => {
    window.open(`/api/quotes/${params.id}/pdf`, '_blank');
  };

  const copyCustomerLink = async () => {
    const customerUrl = `${window.location.origin}/quotes/${quote?.quote_id}/customer`;
    try {
      await navigator.clipboard.writeText(customerUrl);
      toast({
        title: "Link Copied!",
        description: "Customer quote link copied to clipboard",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div>
        <div>
          <div></div>
          <p>Loading quote...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div>
        <Card>
          <CardContent>
            <h2>Quote Not Found</h2>
            <p>The quote you're looking for doesn't exist.</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const finalPrice = quote.final_price || quote.total_cost || 0;

  return (
    <div>
      {/* Header */}
      <div>
        <div>
          <div>
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/admin')}
              >
                <ArrowLeft />
              </Button>
              <div>
                <h1>Quote Management</h1>
                <p>Quote #{quote.quote_id}</p>
              </div>
            </div>
            
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyCustomerLink}
              >
                <Copy />
                Customer Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/quotes/${quote.quote_id}/customer`, '_blank')}
              >
                <Eye />
                Preview
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Quote Overview */}
        <div>
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>
                <User />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <User />
                <span>{quote.customer_name}</span>
              </div>
              <div>
                <MapPin />
                <span>{quote.address}</span>
              </div>
              {quote.customer_email && (
                <div>
                  <Mail />
                  <a href={`mailto:${quote.customer_email}`}>
                    {quote.customer_email}
                  </a>
                </div>
              )}
              {quote.customer_phone && (
                <div>
                  <Phone />
                  <a href={`tel:${quote.customer_phone}`}>
                    {quote.customer_phone}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle>
                <FileText />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <FileText />
                <span>{quote.project_type} Painting</span>
              </div>
              <div>
                <Calendar />
                <span>{quote.timeline || '3-5 Business Days'}</span>
              </div>
              <div>
                <Clock />
                <span>Created {formatDate(quote.created_at)}</span>
              </div>
              <div>
                <DollarSign />
                <span>{formatCurrency(finalPrice)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Badge />
                Quote Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <span>Status:</span>
                <Badge variant={quote.status === 'accepted' ? 'default' : 'secondary'}>
                  {quote.status || 'Pending'}
                </Badge>
              </div>
              <div>
                Quote expires: {new Date(new Date(quote.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Delivery Section */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Mail />
              Email Quote Delivery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <label>
                  Recipient Email Address
                </label>
                <Input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="customer@example.com"
                 
                />
              </div>
            </div>
            
            <div>
              {/* Send Quote Email */}
              <div>
                <Button
                  onClick={() => sendEmail('send_quote')}
                  disabled={isSendingEmail || !emailAddress.trim()}
                 
                >
                  {isSendingEmail ? (
                    <>
                      <div />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send />
                      Send Quote
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => previewEmail('send_quote')}
                 
                >
                  <Eye />
                  Preview
                </Button>
              </div>

              {/* Send Follow-up */}
              <div>
                <Button
                  onClick={() => sendEmail('follow_up')}
                  disabled={isSendingEmail || !emailAddress.trim()}
                  variant="outline"
                 
                >
                  <Mail />
                  Follow-up
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => previewEmail('follow_up')}
                 
                >
                  <Eye />
                  Preview
                </Button>
              </div>

              {/* Acceptance Confirmation */}
              <div>
                <Button
                  onClick={() => sendEmail('acceptance_confirmation')}
                  disabled={isSendingEmail || !emailAddress.trim()}
                  variant="outline"
                 
                >
                  <Mail />
                  Confirmation
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => previewEmail('acceptance_confirmation')}
                 
                >
                  <Eye />
                  Preview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Actions */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Download />
              Document Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Button
                onClick={downloadPDF}
                variant="outline"
               
              >
                <Download />
                Download PDF
              </Button>
              
              <Button
                onClick={() => window.open(`/quotes/${quote.quote_id}/customer`, '_blank')}
                variant="outline"
               
              >
                <Eye />
                Customer View
              </Button>
              
              <Button
                onClick={copyCustomerLink}
                variant="outline"
               
              >
                <Copy />
                Copy Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}