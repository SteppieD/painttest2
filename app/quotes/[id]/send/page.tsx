"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Mail, 
  MessageSquare, 
  Download, 
  ArrowLeft, 
  Send, 
  Check,
  Copy,
  ExternalLink,
  Phone
} from "lucide-react";

interface Quote {
  id: string;
  quote_id: string;
  customer_name: string;
  address: string;
  quote_amount: number;
  status: string;
  project_type: string;
  created_at: string;
  company_name: string;
  quote_details: any;
}

export default function QuoteSendPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  // Form states
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  
  // Send status
  const [emailSent, setEmailSent] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const response = await fetch(`/api/quotes/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setQuote(data);
          
          // Pre-fill form data
          setCustomerEmail(data.customer_email || "");
          setCustomerPhone(data.customer_phone || "");
          setEmailSubject(`Your Painting Quote from ${data.company_name}`);
          setEmailMessage(`Hi ${data.customer_name},

Attached is your professional painting quote for ${data.address}.

Quote Details:
• Project: ${data.project_type} painting
• Total Investment: $${data.quote_amount.toLocaleString()}
• Quote Valid Until: ${new Date(new Date(data.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}

You can view and download your quote anytime at: ${window.location.origin}/quotes/${params.id}/view

We're excited to work with you on this project! Please reply to this email or call us if you have any questions.

Best regards,
${data.company_name}`);

          setSmsMessage(`Hi ${data.customer_name}! Your painting quote for ${data.address} is ready: $${data.quote_amount.toLocaleString()}. View it here: ${window.location.origin}/quotes/${params.id}/view`);
        }
      } catch (error) {
        console.error('Error fetching quote:', error);
        toast({
          title: "Error",
          description: "Failed to load quote details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchQuote();
    }
  }, [params.id, toast]);

  const handleSendEmail = async () => {
    if (!customerEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter the customer's email address",
        variant: "destructive"
      });
      return;
    }

    setSending(true);
    try {
      const response = await fetch(`/api/quotes/${params.id}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: customerEmail,
          subject: emailSubject,
          message: emailMessage
        })
      });

      if (response.ok) {
        setEmailSent(true);
        toast({
          title: "Email Sent!",
          description: `Quote sent successfully to ${customerEmail}`
        });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      toast({
        title: "Send Failed",
        description: "Could not send email. Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleSendSMS = async () => {
    if (!customerPhone.trim()) {
      toast({
        title: "Phone Required",
        description: "Please enter the customer's phone number",
        variant: "destructive"
      });
      return;
    }

    setSending(true);
    try {
      const response = await fetch(`/api/quotes/${params.id}/send-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: customerPhone,
          message: smsMessage
        })
      });

      if (response.ok) {
        setSmsSent(true);
        toast({
          title: "SMS Sent!",
          description: `Quote sent successfully to ${customerPhone}`
        });
      } else {
        throw new Error('Failed to send SMS');
      }
    } catch (error) {
      toast({
        title: "Send Failed",
        description: "Could not send SMS. Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/quotes/${params.id}/view`;
    try {
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      toast({
        title: "Link Copied!",
        description: "Quote link copied to clipboard"
      });
      setTimeout(() => setLinkCopied(false), 3000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy link to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleDownloadPDF = () => {
    window.open(`/api/quotes/${params.id}/pdf`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Quote Not Found</h2>
              <p className="text-gray-600 mb-4">The quote you're looking for doesn't exist.</p>
              <Button onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/quotes/${params.id}/preview`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Send Quote</h1>
            <p className="text-gray-600">
              {quote.customer_name} • Quote #{quote.quote_id} • ${quote.quote_amount.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Email Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-600" />
                Send via Email
                {emailSent && <Check className="h-5 w-5 ml-auto text-green-600" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Customer Email
                </label>
                <Input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="customer@email.com"
                  disabled={emailSent}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Subject Line
                </label>
                <Input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  disabled={emailSent}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Message
                </label>
                <Textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={8}
                  disabled={emailSent}
                />
              </div>
              
              <Button
                onClick={handleSendEmail}
                disabled={sending || emailSent || !customerEmail.trim()}
                className="w-full"
              >
                {emailSent ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Email Sent Successfully
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {sending ? 'Sending...' : 'Send Email'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* SMS Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                Send via SMS
                {smsSent && <Check className="h-5 w-5 ml-auto text-green-600" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Customer Phone
                </label>
                <Input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  disabled={smsSent}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  SMS Message ({smsMessage.length}/160)
                </label>
                <Textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  rows={6}
                  maxLength={160}
                  disabled={smsSent}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Keep it under 160 characters for best delivery
                </p>
              </div>
              
              <Button
                onClick={handleSendSMS}
                disabled={sending || smsSent || !customerPhone.trim()}
                className="w-full"
                variant="outline"
              >
                {smsSent ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    SMS Sent Successfully
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4 mr-2" />
                    {sending ? 'Sending...' : 'Send SMS'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Options */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Additional Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="w-full"
              >
                {linkCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Public Link
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              
              <Button
                onClick={() => window.open(`/quotes/${params.id}/view`, '_blank')}
                variant="outline"
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview Quote
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Success Summary */}
        {(emailSent || smsSent) && (
          <Card className="mt-6 bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Check className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-green-900">Quote Delivered!</h3>
              </div>
              <div className="space-y-2 text-sm text-green-800">
                {emailSent && (
                  <p>✓ Email sent to {customerEmail}</p>
                )}
                {smsSent && (
                  <p>✓ SMS sent to {customerPhone}</p>
                )}
                <p>✓ Customer can view quote anytime at the public link</p>
                <p>✓ Quote is valid for 30 days from issue date</p>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => router.push('/dashboard')}
                  size="sm"
                >
                  Back to Dashboard
                </Button>
                <Button
                  onClick={() => router.push('/create-quote')}
                  variant="outline"
                  size="sm"
                >
                  Create Another Quote
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}