"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quoteInfo, setQuoteInfo] = useState<{
    quoteId?: string;
    amount?: string;
    company?: string;
    newCompany?: string;
    companyName?: string;
    redirect?: string;
  }>({});

  useEffect(() => {
    const quoteId = searchParams.get("quoteId") ?? undefined;
    const amount = searchParams.get("amount") ?? undefined;
    const company = searchParams.get("company") ?? undefined;
    const newCompany = searchParams.get("newCompany") ?? undefined;
    const companyName = searchParams.get("companyName") ?? undefined;
    const redirect = searchParams.get("redirect") ?? undefined;

    setQuoteInfo({ quoteId, amount, company, newCompany, companyName, redirect });
  }, [searchParams]);

  return (
    <div
     
    >
      <div
       
      >
        {quoteInfo.newCompany === "true" ? (
          <>
            <div>🎉</div>
            <h1
             
            >
              Welcome!
            </h1>
            <p>
              New company &quot;{quoteInfo.companyName}&quot; has been created
              successfully!
            </p>
            <p
             
            >
              You can now start creating quotes for your company.
            </p>
          </>
        ) : quoteInfo.quoteId ? (
          <>
            <div>✅</div>
            <h1
             
            >
              Quote Saved!
            </h1>
            <div
             
            >
              <p>
                <strong>Quote ID:</strong> #{quoteInfo.quoteId}
              </p>
              <p>
                <strong>Amount:</strong> ${quoteInfo.amount}
              </p>
              {quoteInfo.company && (
                <p>
                  <strong>Company:</strong>{" "}
                  {decodeURIComponent(quoteInfo.company)}
                </p>
              )}
            </div>
            <p>
              Your quote has been saved successfully!
            </p>
          </>
        ) : (
          <>
            <div>😊</div>
            <h1
             
            >
              Success!
            </h1>
            <p>
              Access code verified! You&apos;re logged in successfully.
            </p>
          </>
        )}

        <div
         
        >
          <button
            onClick={() => {
              if (quoteInfo.newCompany === "true") {
                router.push("/setup-chat");
              } else {
                router.push(quoteInfo.redirect || "/dashboard");
              }
            }}
           
          >
            {quoteInfo.newCompany === "true" ? "🚀 Set Up Company Profile" : 
             quoteInfo.redirect === "/" ? "🏠 Continue to Homepage" : "📊 View Dashboard"}
          </button>

          <button
            onClick={() => router.push("/create-quote")}
           
          >
            + New Quote
          </button>

          <button
            onClick={() => router.push("/")}
           
          >
            🏠 Home
          </button>
        </div>

        <p>
          Company workspace active ✓
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
