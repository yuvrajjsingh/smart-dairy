import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Wallet from "@/models/Wallet";
import WalletTransaction from "@/models/WalletTransaction";
import Notification from "@/models/Notification";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const payload = (await verifyToken(token)) as {
      id: string;
      username: string;
      role: string;
    };

    if (payload.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required",
        },
        { status: 403 }
      );
    }

    const transaction = await WalletTransaction.findById(params.id);

    if (!transaction) {
      return NextResponse.json(
        {
          success: false,
          message: "Withdrawal request not found",
        },
        { status: 404 }
      );
    }

    if (transaction.type !== "Debit") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid withdrawal transaction",
        },
        { status: 400 }
      );
    }

    if (transaction.status !== "Pending") {
      return NextResponse.json(
        {
          success: false,
          message: "Withdrawal has already been processed",
        },
        { status: 400 }
      );
    }

    const wallet = await Wallet.findOne({
      customerId: transaction.customerId,
    });

    if (!wallet) {
      return NextResponse.json(
        {
          success: false,
          message: "Wallet not found",
        },
        { status: 404 }
      );
    }

    const amount = Number(transaction.amount);
    const pendingBalance = Number(wallet.pendingBalance || 0);
    const balance = Number(wallet.balance || 0);

    if (amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid withdrawal amount",
        },
        { status: 400 }
      );
    }

    if (pendingBalance < amount) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid pending withdrawal amount",
        },
        { status: 400 }
      );
    }

    if (balance < amount) {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient wallet balance",
        },
        { status: 400 }
      );
    }

    wallet.balance = balance - amount;
    wallet.pendingBalance = pendingBalance - amount;
    wallet.totalDebits =
      Number(wallet.totalDebits || 0) + amount;

    await wallet.save();

    transaction.status = "Approved";
    transaction.approvedBy = payload.id;
    transaction.approvedAt = new Date();

    await transaction.save();

    await Notification.create({
      customerId: transaction.customerId,
      title: "Withdrawal Approved",
      message: `₹${amount} withdrawal has been approved.`,
    });

    return NextResponse.json({
      success: true,
      message: "Withdrawal approved successfully",
    });
  } catch (error) {
    console.error("Approve Withdrawal Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}