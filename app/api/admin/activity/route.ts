import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";

import User from "@/models/User";
import MilkRecords from "@/models/MilkRecords";
import WalletTransaction from "@/models/WalletTransaction";

export async function GET(req: NextRequest) {
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

    const admin = await User.findById(payload.id);

    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Access Denied",
        },
        {
          status: 403,
        }
      );
    }

    const milkScans = await MilkRecords.find()
      .populate("customerId", "username")
      .sort({ createdAt: -1 })
      .limit(5);

    const withdrawals = await WalletTransaction.find({
      type: "Debit",
    })
      .populate("customerId", "username")
      .sort({ createdAt: -1 })
      .limit(5);

    const customers = await User.find({
      role: "user",
    })
      .sort({ createdAt: -1 })
      .limit(5);

    const activity: any[] = [];

    milkScans.forEach((scan: any) => {
      activity.push({
        type: "Milk Scan",
        username: scan.customerId?.username || "Unknown",
        text: `${scan.customerId?.username} completed a milk scan`,
        createdAt: scan.createdAt,
      });
    });

    withdrawals.forEach((withdraw: any) => {
      activity.push({
        type: "Withdrawal",
        username: withdraw.customerId?.username || "Unknown",
        text: `${withdraw.customerId?.username} requested ₹${withdraw.amount} withdrawal`,
        createdAt: withdraw.createdAt,
      });
    });

    customers.forEach((customer: any) => {
      activity.push({
        type: "Customer",
        username: customer.username,
        text: `${customer.username} joined Smart Dairy`,
        createdAt: customer.createdAt,
      });
    });

    activity.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      activity: activity.slice(0, 10),
    });
  } catch (error) {
    console.error(error);

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