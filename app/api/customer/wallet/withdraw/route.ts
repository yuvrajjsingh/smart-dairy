import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";

import Wallet from "@/models/Wallet";
import WalletTransaction from "@/models/WalletTransaction";
import Notification from "@/models/Notification";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

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

    const payload = (await verifyToken(token)) as {
      id: string;
    };

    const { amount, upiId } = await req.json();

    const withdrawalAmount = Number(amount);

    // -------------------------
    // Amount validation
    // -------------------------

    if (!withdrawalAmount || withdrawalAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid amount",
        },
        {
          status: 400,
        }
      );
    }

    if (withdrawalAmount < 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Minimum withdrawal is ₹100",
        },
        {
          status: 400,
        }
      );
    }

    if (withdrawalAmount > 50000) {
      return NextResponse.json(
        {
          success: false,
          message: "Maximum withdrawal is ₹50,000",
        },
        {
          status: 400,
        }
      );
    }

    // -------------------------
    // UPI validation
    // -------------------------

    const upiRegex =
      /^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/;

    if (!upiRegex.test(upiId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid UPI ID",
        },
        {
          status: 400,
        }
      );
    }

    // -------------------------
    // Find wallet
    // -------------------------

    const wallet = await Wallet.findOne({
      customerId: payload.id,
    });

    if (!wallet) {
      return NextResponse.json(
        {
          success: false,
          message: "Wallet not found",
        },
        {
          status: 404,
        }
      );
    }

    // -------------------------
    // Available balance
    // -------------------------

    const availableBalance =
      wallet.balance - (wallet.pendingBalance || 0);

    if (withdrawalAmount > availableBalance) {
      return NextResponse.json(
        {
          success: false,
          message: `Insufficient available balance. Available: ₹${availableBalance}`,
        },
        {
          status: 400,
        }
      );
    }

    // -------------------------
    // Prevent multiple pending withdrawals
    // -------------------------

    const existingPending =
      await WalletTransaction.findOne({
        customerId: payload.id,
        type: "Debit",
        status: "Pending",
      });

    if (existingPending) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You already have a pending withdrawal request.",
        },
        {
          status: 400,
        }
      );
    }

    // -------------------------
    // Reserve money
    // -------------------------

    wallet.pendingBalance =
      (wallet.pendingBalance || 0) + withdrawalAmount;

    await wallet.save();

    // -------------------------
    // Create transaction
    // -------------------------

    await WalletTransaction.create({
      customerId: payload.id,

      type: "Debit",

      amount: withdrawalAmount,

      upiId,

      reason: "Wallet Withdrawal",

      status: "Pending",
    });

    // -------------------------
    // Notification
    // -------------------------

    await Notification.create({
      customerId: payload.id,

      title: "Withdrawal Requested",

      message: `₹${withdrawalAmount} withdrawal request has been submitted.`,
    });

    return NextResponse.json({
      success: true,
      message: "Withdrawal request sent to admin.",
    });
  } catch (error) {
    console.error("Withdrawal Error:", error);

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