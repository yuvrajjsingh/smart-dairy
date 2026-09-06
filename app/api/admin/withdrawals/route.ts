import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";

import WalletTransaction from "@/models/WalletTransaction";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // -------------------------
    // Check authentication
    // -------------------------

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // -------------------------
    // Verify JWT
    // -------------------------

    const payload = (await verifyToken(token)) as {
      id: string;
      role?: string;
    };

    // -------------------------
    // Check admin role
    // -------------------------

    if (payload.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        {
          status: 403,
        }
      );
    }

    // -------------------------
    // Get pending withdrawals
    // -------------------------

    const requests = await WalletTransaction.find({
      type: "Debit",
      status: "Pending",
    })
      .populate("customerId", "username email")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Admin Withdrawals Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}