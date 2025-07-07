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
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-3xl mx-auto">
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
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Quote Not Found</h2>
              <p className="text-gray-600">Unable to find your quote information.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-3xl mx-auto py-8">
        {/* Success Message */}
        <Card className="border-green-200 shadow-xl mb-6">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-green-800 mb-2">Payment Successful!</h1>
            <p className="text-lg text-green-700 mb-6">
              Thank you for your payment. Your painting project is confirmed!
            </p>
            <Badge className="bg-green-100 text-green-800 px-4 py-2 text-base">
              Quote #{quote.quote_id || quote.id} - Paid
            </Badge>
          </CardContent>
        </Card>

        {/* Quote Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-blue-600" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-semibold">{quote.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Project Address</p>
                <p className="font-semibold">{quote.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount Paid</p>
                <p className="font-semibold text-green-600 text-xl">
                  ${(quote.total_cost || quote.final_price || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Date</p>
                <p className="font-semibold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              What Happens Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Email Confirmation</h4>
                <p className="text-gray-600 text-sm">
                  You'll receive a detailed receipt and project confirmation via email shortly.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Project Scheduling</h4>
                <p className="text-gray-600 text-sm">
                  We'll contact you within 24 hours to schedule your project start date.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Pre-Project Walkthrough</h4>
                <p className="text-gray-600 text-sm">
                  Our team will conduct a final walkthrough before starting work.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center justify-center gap-2"
                onClick={() => window.print()}
              >
                <Download className="w-4 h-4" />
                Download Receipt
              </Button>
              <Button 
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push(`/quotes/${params.id}/customer`)}
              >
                <FileText className="w-4 h-4" />
                View Full Quote
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 mb-4">
              Our team is here to answer any questions about your upcoming project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                <a href={`tel:${quote.company_phone || '(555) 123-4567'}`} className="text-blue-600 hover:underline">
                  {quote.company_phone || '(555) 123-4567'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <a href={`mailto:${quote.company_email || 'contact@paintingcompany.com'}`} className="text-blue-600 hover:underline">
                  {quote.company_email || 'contact@paintingcompany.com'}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Thank you for choosing {quote.company_name || "us"} for your painting project!
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Transaction ID: {params.id}-{Date.now()}
          </p>
        </div>
      </div>
    </div>
  );
}