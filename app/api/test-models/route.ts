import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import User from "@/models/User";
import Animal from "@/models/Animal";
import Transaction from "@/models/Transaction";
import Payment from "@/models/Payment";
import Expense from "@/models/Expense";
import MilkRate from "@/models/MilkRate";

export async function GET() {
  try {
    await connectDB();

    const result = {
      database: "Connected ✅",
      collections: {
        users: await User.countDocuments(),
        animals: await Animal.countDocuments(),
        transactions: await Transaction.countDocuments(),
        payments: await Payment.countDocuments(),
        expenses: await Expense.countDocuments(),
        milkrates: await MilkRate.countDocuments(),
      },
    };

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown Error",
    });
  }
}   