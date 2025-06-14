import { NextRequest, NextResponse } from "next/server";
import { processOnboardingMessage } from "@/lib/onboarding-assistant";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, currentStep, companyData, productData, conversationHistory } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const result = await processOnboardingMessage({
      message,
      currentStep,
      companyData,
      productData,
      conversationHistory,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in onboarding assistant API:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}