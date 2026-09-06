import { NextResponse } from "next/server";
import razorpay from "@/lib/razorpay";

export async function GET() {
  return NextResponse.json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID,
  });
}