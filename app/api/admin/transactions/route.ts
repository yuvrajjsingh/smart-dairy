import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import WalletTransaction from "@/models/WalletTransaction";

export async function GET() {
  try {
    await connectDB();

    const transactions = await WalletTransaction.find()
      .populate("customerId", "username email")
      .populate("animalId", "animalId animalName animalType")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      transactions,
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