import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    message: "API working correctly",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown'
  });
}

export async function POST() {
  return NextResponse.json({ 
    message: "POST method working",
    timestamp: new Date().toISOString()
  });
}