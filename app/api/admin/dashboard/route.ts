import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import User from "@/models/User";
import Animal from "@/models/Animal";
import Wallet from "@/models/Wallet";
import WalletTransaction from "@/models/WalletTransaction";
import MilkRecords from "@/models/MilkRecords";

export async function GET() {
  try {

    await connectDB();

    const totalCustomers =
      await User.countDocuments({
        role: "user",
      });

    const totalAnimals =
      await Animal.countDocuments();

    const totalScans =
      await MilkRecords.countDocuments();

    const wallets =
      await Wallet.find();

    const totalWalletBalance =
      wallets.reduce(
        (sum, w) => sum + w.balance,
        0
      );

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const todayScans =
      await MilkRecords.find({
        createdAt: {
          $gte: today,
        },
      });

    const todayMilk =
      todayScans.reduce(
        (sum, scan) => sum + scan.milk,
        0
      );

    const todayEarnings =
      todayScans.reduce(
        (sum, scan) => sum + scan.payment,
        0
      );

    const pendingWithdrawals =
      await WalletTransaction.countDocuments({
        type: "Debit",
        status: "Pending",
      });

    const completedWithdrawals =
      await WalletTransaction.countDocuments({
        type: "Debit",
        status: "Completed",
      });

    return NextResponse.json({
      success: true,

      stats: {
        totalCustomers,
        totalAnimals,
        totalScans,
        totalWalletBalance,
        todayMilk,
        todayEarnings,
        pendingWithdrawals,
        completedWithdrawals,
      },
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );

  }
}