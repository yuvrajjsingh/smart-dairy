import { NextResponse } from "next/server";

export async function GET() {
  const data = {
    users: 120,
    revenue: 5400,
    activeSessions: 32,
  };

  return NextResponse.json(data);
}