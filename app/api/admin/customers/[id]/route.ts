import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";

import User from "@/models/User";
import Wallet from "@/models/Wallet";
import WalletTransaction from "@/models/WalletTransaction";
import Animal from "@/models/Animal";
import MilkRecords from "@/models/MilkRecords";
import Notification from "@/models/Notification";
import Withdrawal from "@/models/Withdrawal";
import Transaction from "@/models/Transaction";
import Payment from "@/models/Payment";

type RouteContext = {
  params: {
    id: string;
  };
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    const customer = await User.findById(params.id).select("-password");

    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404, headers: { "Cache-Control": "no-store" } }
      );
    }

    const wallet = await Wallet.findOne({ customerId: params.id });
    const milkHistory = await MilkRecords.find({ customerId: params.id })
      .populate("animalId", "animalId animalName animalType")
      .sort({ createdAt: -1 });
    const animals = await Animal.find({ owner: params.id });
    const transactions = await WalletTransaction.find({
      customerId: params.id,
    })
      .populate("animalId", "animalId animalName animalType")
      .sort({ createdAt: -1 });

    const totalMilk = milkHistory.reduce(
      (sum, milk) => sum + Number(milk.milk || 0),
      0
    );
    const totalEarnings = milkHistory.reduce(
      (sum, milk) => sum + Number(milk.payment || 0),
      0
    );

    return NextResponse.json(
      {
        success: true,
        customer,
        wallet,
        animals,
        transactions,
        milkHistory,
        statistics: {
          totalMilk,
          totalEarnings,
          totalTransactions: transactions.length,
          totalAnimals: animals.length,
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Admin Customer Details Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const payload = (await verifyToken(token)) as { role?: string };

    if (payload.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403, headers: { "Cache-Control": "no-store" } }
      );
    }

    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json(
        { success: false, message: "Invalid customer ID" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    await connectDB();

    const customerId = new mongoose.Types.ObjectId(params.id);

    // Never allow this customer endpoint to remove an administrator.
    const adminAccount = await User.findOne({
      _id: customerId,
      role: "admin",
    }).select("_id");

    if (adminAccount) {
      return NextResponse.json(
        { success: false, message: "Admin accounts cannot be deleted here" },
        { status: 403, headers: { "Cache-Control": "no-store" } }
      );
    }

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const dairyTransactions = await Transaction.find({
          $or: [{ seller: customerId }, { buyer: customerId }],
        })
          .select("_id")
          .session(session);

        const dairyTransactionIds = dairyTransactions.map(
          (transaction) => transaction._id
        );

        await Payment.deleteMany(
          {
            $or: [
              { paidBy: customerId },
              { paidTo: customerId },
              { transaction: { $in: dairyTransactionIds } },
            ],
          },
          { session }
        );

        await Transaction.deleteMany(
          {
            $or: [{ seller: customerId }, { buyer: customerId }],
          },
          { session }
        );

        await MilkRecords.deleteMany({ customerId }, { session });
        await WalletTransaction.deleteMany({ customerId }, { session });
        await Withdrawal.deleteMany({ customerId }, { session });
        await Notification.deleteMany({ customerId }, { session });
        await Animal.deleteMany({ owner: customerId }, { session });
        await Wallet.deleteOne({ customerId }, { session });

        // Also removes any orphaned customer data if the User document
        // was already removed. This makes retries safe and repeatable.
        await User.deleteOne(
          { _id: customerId, role: "user" },
          { session }
        );
      });
    } finally {
      await session.endSession();
    }

    return NextResponse.json(
      {
        success: true,
        message: "Customer and related records deleted successfully",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Admin Customer Deletion Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Customer deletion failed. No changes were saved.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
