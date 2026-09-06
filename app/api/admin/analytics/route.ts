import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import User from "@/models/User";
import Animal from "@/models/Animal";
import Transaction from "@/models/Transaction";

export async function GET(req: NextRequest) {

  try {

    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {

      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    }

   const payload = (await verifyToken(token)) as{
      id: string;
    };

    const admin = await User.findById(payload.id);

    if (!admin || admin.role !== "admin") {

      return NextResponse.json(
        { success: false, message: "Access Denied" },
        { status: 403 }
      );

    }

    const totalCustomers = await User.countDocuments({
      role: "user",
    });

    const totalAnimals = await Animal.countDocuments();

    const totalTransactions = await Transaction.countDocuments();

    const transactions = await Transaction.find();

    const totalRevenue = transactions.reduce(
      (sum, tx) => sum + tx.totalAmount,
      0
    );

    const totalMilk = transactions.reduce(
      (sum, tx) => sum + tx.quantity,
      0
    );

    return NextResponse.json({

      success: true,

      analytics: {

        customers: totalCustomers,

        animals: totalAnimals,

        transactions: totalTransactions,

        revenue: totalRevenue,

        milk: totalMilk,

      },

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