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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quote...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Quote Not Found</h2>
            <p className="text-gray-600 mb-4">The quote you're looking for doesn't exist.</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const finalPrice = quote.final_price || quote.total_cost || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/admin')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Quote Management</h1>
                <p className="text-sm text-gray-500">Quote #{quote.quote_id}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyCustomerLink}
              >
                <Copy className="w-4 h-4 mr-2" />
                Customer Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/quotes/${quote.quote_id}/customer`, '_blank')}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 py-8">
        {/* Quote Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{quote.customer_name}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <span className="text-sm text-gray-600">{quote.address}</span>
              </div>
              {quote.customer_email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${quote.customer_email}`} className="text-sm text-blue-600 hover:underline">
                    {quote.customer_email}
                  </a>
                </div>
              )}
              {quote.customer_phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${quote.customer_phone}`} className="text-sm text-blue-600 hover:underline">
                    {quote.customer_phone}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="font-medium capitalize">{quote.project_type} Painting</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{quote.timeline || '3-5 Business Days'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Created {formatDate(quote.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="font-bold text-lg text-green-600">{formatCurrency(finalPrice)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge className="w-5 h-5" />
                Quote Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge variant={quote.status === 'accepted' ? 'default' : 'secondary'}>
                  {quote.status || 'Pending'}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                Quote expires: {new Date(new Date(quote.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Email Delivery Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Email Quote Delivery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Email Address
                </label>
                <Input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="customer@example.com"
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Send Quote Email */}
              <div className="space-y-2">
                <Button
                  onClick={() => sendEmail('send_quote')}
                  disabled={isSendingEmail || !emailAddress.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isSendingEmail ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Quote
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => previewEmail('send_quote')}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>

              {/* Send Follow-up */}
              <div className="space-y-2">
                <Button
                  onClick={() => sendEmail('follow_up')}
                  disabled={isSendingEmail || !emailAddress.trim()}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Follow-up
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => previewEmail('follow_up')}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>

              {/* Acceptance Confirmation */}
              <div className="space-y-2">
                <Button
                  onClick={() => sendEmail('acceptance_confirmation')}
                  disabled={isSendingEmail || !emailAddress.trim()}
                  variant="outline"
                  className="w-full"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Confirmation
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => previewEmail('acceptance_confirmation')}
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-green-600" />
              Document Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button
                onClick={downloadPDF}
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              
              <Button
                onClick={() => window.open(`/quotes/${quote.quote_id}/customer`, '_blank')}
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Customer View
              </Button>
              
              <Button
                onClick={copyCustomerLink}
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}