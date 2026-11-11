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

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    const customer = await User.findById(params.id).select("-password");

    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404 }
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

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("Admin Customer Details Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const payload = (await verifyToken(token)) as { role?: string };

    if (payload.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json(
        { success: false, message: "Invalid customer ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const customer = await User.findOne({
      _id: params.id,
      role: "user",
    }).select("_id");

    if (!customer) {
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404 }
      );
    }

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        // Find dairy transactions involving this customer so their linked
        // payment records can be removed in the same database transaction.
        const dairyTransactions = await Transaction.find({
          $or: [{ seller: customer._id }, { buyer: customer._id }],
        })
          .select("_id")
          .session(session);

        const dairyTransactionIds = dairyTransactions.map(
          (transaction) => transaction._id
        );

        await Payment.deleteMany(
          {
            $or: [
              { paidBy: customer._id },
              { paidTo: customer._id },
              { transaction: { $in: dairyTransactionIds } },
            ],
          },
          { session }
        );

        await Transaction.deleteMany(
          {
            $or: [{ seller: customer._id }, { buyer: customer._id }],
          },
          { session }
        );
        await MilkRecords.deleteMany({ customerId: customer._id }, { session });
        await WalletTransaction.deleteMany(
          { customerId: customer._id },
          { session }
        );
        await Withdrawal.deleteMany({ customerId: customer._id }, { session });
        await Notification.deleteMany(
          { customerId: customer._id },
          { session }
        );
        await Animal.deleteMany({ owner: customer._id }, { session });
        await Wallet.deleteOne({ customerId: customer._id }, { session });

        const deletedCustomer = await User.deleteOne(
          { _id: customer._id, role: "user" },
          { session }
        );

        if (deletedCustomer.deletedCount !== 1) {
          throw new Error("Customer deletion did not complete");
        }
      });
    } finally {
      await session.endSession();
    }

    return NextResponse.json({
      success: true,
      message: "Customer and related records deleted successfully",
    });
  } catch (error) {
    console.error("Admin Customer Deletion Error:", error);
    return NextResponse.json(
      { success: false, message: "Customer deletion failed. No changes were saved." },
      { status: 500 }
    );
  }
}
