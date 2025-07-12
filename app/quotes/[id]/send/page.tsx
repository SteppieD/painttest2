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
      <div>
        <div>
          <div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div>
        <div>
          <Card>
            <CardContent>
              <h2>Quote Not Found</h2>
              <p>The quote you're looking for doesn't exist.</p>
              <Button onClick={() => router.push('/dashboard')}>
                <ArrowLeft />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/quotes/${params.id}/preview`)}
          >
            <ArrowLeft />
          </Button>
          <div>
            <h1>Send Quote</h1>
            <p>
              {quote.customer_name} • Quote #{quote.quote_id} • ${quote.quote_amount.toLocaleString()}
            </p>
          </div>
        </div>

        <div>
          {/* Email Section */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Mail />
                Send via Email
                {emailSent && <Check />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label>
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
                <label>
                  Subject Line
                </label>
                <Input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  disabled={emailSent}
                />
              </div>
              
              <div>
                <label>
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
               
              >
                {emailSent ? (
                  <>
                    <Check />
                    Email Sent Successfully
                  </>
                ) : (
                  <>
                    <Send />
                    {sending ? 'Sending...' : 'Send Email'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* SMS Section */}
          <Card>
            <CardHeader>
              <CardTitle>
                <MessageSquare />
                Send via SMS
                {smsSent && <Check />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label>
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
                <label>
                  SMS Message ({smsMessage.length}/160)
                </label>
                <Textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  rows={6}
                  maxLength={160}
                  disabled={smsSent}
                />
                <p>
                  Keep it under 160 characters for best delivery
                </p>
              </div>
              
              <Button
                onClick={handleSendSMS}
                disabled={sending || smsSent || !customerPhone.trim()}
               
                variant="outline"
              >
                {smsSent ? (
                  <>
                    <Check />
                    SMS Sent Successfully
                  </>
                ) : (
                  <>
                    <Phone />
                    {sending ? 'Sending...' : 'Send SMS'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Options */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Button
                onClick={handleCopyLink}
                variant="outline"
               
              >
                {linkCopied ? (
                  <>
                    <Check />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Copy />
                    Copy Public Link
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
               
              >
                <Download />
                Download PDF
              </Button>
              
              <Button
                onClick={() => window.open(`/quotes/${params.id}/view`, '_blank')}
                variant="outline"
               
              >
                <ExternalLink />
                Preview Quote
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Success Summary */}
        {(emailSent || smsSent) && (
          <Card>
            <CardContent>
              <div>
                <Check />
                <h3>Quote Delivered!</h3>
              </div>
              <div>
                {emailSent && (
                  <p>✓ Email sent to {customerEmail}</p>
                )}
                {smsSent && (
                  <p>✓ SMS sent to {customerPhone}</p>
                )}
                <p>✓ Customer can view quote anytime at the public link</p>
                <p>✓ Quote is valid for 30 days from issue date</p>
              </div>
              
              <div>
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