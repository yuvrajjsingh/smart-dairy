import Wallet from "@/models/Wallet";
import WalletTransaction from "@/models/WalletTransaction";
import { NextRequest, NextResponse } from "next/server";
import Notification from "@/models/Notification";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";

import Animal from "@/models/Animal";
import MilkRecords from "@/models/MilkRecords";

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
      role: string;
    };

    const body = await req.json();

    const { animalId, litres } = body;

    if (!animalId || !litres) {
      return NextResponse.json(
        {
          success: false,
          message: "Animal and litres are required",
        },
        {
          status: 400,
        }
      );
    }

    const animal = await Animal.findById(animalId);

    if (!animal) {
      return NextResponse.json(
        {
          success: false,
          message: "Animal not found",
        },
        {
          status: 404,
        }
      );
    }

    // Generate Milk Values

    const fat = +(Math.random() * 2 + 4).toFixed(1);

    const snf = +(Math.random() * 1 + 8).toFixed(1);

    const protein = +(Math.random() * 0.8 + 3).toFixed(1);

    const water = +(Math.random() * 3).toFixed(1);

    const density = +(1.026 + Math.random() * 0.008).toFixed(3);

    const lactose = +(Math.random() * 0.8 + 4.2).toFixed(1);

    // Quality

    let quality = "Average";

    if (fat >= 5.5) {
      quality = "Excellent";
    } else if (fat >= 4.5) {
      quality = "Good";
    }

    // Rate

    let rate = 34;

    if (fat >= 6) {
      rate = 45;
    } else if (fat >= 5) {
      rate = 42;
    } else if (fat >= 4) {
      rate = 38;
    }

    const payment = +(rate * Number(litres)).toFixed(2);

    // Save Record

    const scan = await MilkRecords.create({
      customerId: payload.id,

      animalId: animal._id,

      milk: Number(litres),

      fat,

      protein,

      snf,

      density,

      lactose,

      waterPercent: water,

      quality,

      ratePerLitre: rate,

      payment,
    });
    /* ---------------- WALLET ---------------- */

let wallet = await Wallet.findOne({
  customerId: payload.id,
});

if (!wallet) {
  wallet = await Wallet.create({
    customerId: payload.id,
    balance: 0,
    totalCredits: 0,
    totalDebits: 0,
  });
}

/* ---------------- CREDIT MONEY ---------------- */

wallet.balance += payment;
wallet.totalCredits += payment;

await wallet.save();

/* ---------------- TRANSACTION ---------------- */

await WalletTransaction.create({
  customerId: payload.id,

  animalId: animal._id,

  milkRecordId: scan._id,

  type: "Credit",

  amount: payment,

  reason: `Milk Collection (${litres} L)`,

  status: "Completed",
});
await Notification.create({
  customerId: payload.id,

  title: "Milk Payment Credited",

  message: `₹${payment} has been added to your wallet.`,
});

    return NextResponse.json({
  success: true,
  message: "Milk scanned successfully",

  scan,

  wallet: {
    balance: wallet.balance,
    totalCredits: wallet.totalCredits,
    totalDebits: wallet.totalDebits,
  },
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}