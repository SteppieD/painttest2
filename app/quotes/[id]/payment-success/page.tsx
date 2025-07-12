"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Receipt, 
  Calendar, 
  Mail,
  Phone,
  FileText,
  Download,
  ArrowRight
} from "lucide-react";

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const response = await fetch(`/api/quotes/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setQuote(data);
        }
      } catch (error) {
        console.error('Error fetching quote:', error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchQuote();
    }
  }, [params.id]);

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
              <p>Unable to find your quote information.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        {/* Success Message */}
        <Card>
          <CardContent>
            <CheckCircle />
            <h1>Payment Successful!</h1>
            <p>
              Thank you for your payment. Your painting project is confirmed!
            </p>
            <Badge>
              Quote #{quote.quote_id || quote.id} - Paid
            </Badge>
          </CardContent>
        </Card>

        {/* Quote Summary */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Receipt />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                <p>Customer</p>
                <p>{quote.customer_name}</p>
              </div>
              <div>
                <p>Project Address</p>
                <p>{quote.address}</p>
              </div>
              <div>
                <p>Amount Paid</p>
                <p>
                  ${(quote.total_cost || quote.final_price || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p>Payment Date</p>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Calendar />
              What Happens Next?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div>
                1
              </div>
              <div>
                <h4>Email Confirmation</h4>
                <p>
                  You'll receive a detailed receipt and project confirmation via email shortly.
                </p>
              </div>
            </div>
            <div>
              <div>
                2
              </div>
              <div>
                <h4>Project Scheduling</h4>
                <p>
                  We'll contact you within 24 hours to schedule your project start date.
                </p>
              </div>
            </div>
            <div>
              <div>
                3
              </div>
              <div>
                <h4>Pre-Project Walkthrough</h4>
                <p>
                  Our team will conduct a final walkthrough before starting work.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent>
            <div>
              <Button 
                variant="outline" 
               
                onClick={() => window.print()}
              >
                <Download />
                Download Receipt
              </Button>
              <Button 
               
                onClick={() => router.push(`/quotes/${params.id}/customer`)}
              >
                <FileText />
                View Full Quote
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Our team is here to answer any questions about your upcoming project.
            </p>
            <div>
              <div>
                <Phone />
                <a href={`tel:${quote.company_phone || '(555) 123-4567'}`}>
                  {quote.company_phone || '(555) 123-4567'}
                </a>
              </div>
              <div>
                <Mail />
                <a href={`mailto:${quote.company_email || 'contact@paintingcompany.com'}`}>
                  {quote.company_email || 'contact@paintingcompany.com'}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div>
          <p>
            Thank you for choosing {quote.company_name || "us"} for your painting project!
          </p>
          <p>
            Transaction ID: {params.id}-{Date.now()}
          </p>
        </div>
      </div>
    </div>
  );
}