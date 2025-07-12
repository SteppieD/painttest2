"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CustomerQuoteDisplay } from "@/components/ui/customer-quote-display";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function PublicQuotePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchQuote(params.id as string);
    }
  }, [params.id]);

  const fetchQuote = async (quoteId: string) => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}/public`);
      
      if (response.ok) {
        const data = await response.json();
        setQuote(data);
      } else if (response.status === 404) {
        setError("Quote not found. Please check your quote link and try again.");
      } else {
        setError("Unable to load quote. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuote = async () => {
    try {
      const response = await fetch(`/api/quotes/${params.id}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast({
          title: "Quote Accepted!",
          description: "Thank you! The contractor will contact you shortly to schedule your project.",
        });
        
        // Update quote status locally
        setQuote((prev: any) => ({ ...prev, status: 'accepted' }));
      } else {
        throw new Error("Failed to accept quote");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to accept quote. Please contact the contractor directly.",
        variant: "destructive",
      });
    }
  };

  const handleRejectQuote = async () => {
    try {
      const response = await fetch(`/api/quotes/${params.id}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast({
          title: "Quote Declined",
          description: "The contractor has been notified of your decision.",
        });
        
        // Update quote status locally
        setQuote((prev: any) => ({ ...prev, status: 'rejected' }));
      } else {
        throw new Error("Failed to reject quote");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to decline quote. Please contact the contractor directly.",
        variant: "destructive",
      });
    }
  };

  const handleRequestChanges = () => {
    // For now, just show a message directing them to contact the contractor
    toast({
      title: "Contact Contractor",
      description: "Please contact the contractor directly using the information provided to discuss changes.",
    });
  };

  if (loading) {
    return (
      <div>
        <div>
          <Loader2 />
          <h2>Loading Your Quote</h2>
          <p>Please wait while we retrieve your painting quote...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div>
          <div>
            <span>❌</span>
          </div>
          <h2>Quote Not Available</h2>
          <p>{error}</p>
          <p>
            If you believe this is an error, please contact your painting contractor directly.
          </p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return null;
  }

  return (
    <div>
      <CustomerQuoteDisplay
        quote={quote}
        onAccept={handleAcceptQuote}
        onReject={handleRejectQuote}
        onRequestChanges={handleRequestChanges}
      />
    </div>
  );
}