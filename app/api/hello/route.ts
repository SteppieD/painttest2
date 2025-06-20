import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello from API route" });
}

export async function POST() {
  return NextResponse.json({ message: "POST request received" });
}