import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Wallet from "@/models/Wallet";
import WalletTransaction from "@/models/WalletTransaction";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = body;
if (!amount || amount <= 0) {
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
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET!
      )
      .update(
        razorpay_order_id + "|" + razorpay_payment_id
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed",
        },
        {
          status: 400,
        }
      );
    }
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
const existingTransaction = await WalletTransaction.findOne({
  paymentId: razorpay_payment_id,
});

if (existingTransaction) {
  return NextResponse.json(
    {
      success: false,
      message: "Payment already processed",
    },
    {
      status: 400,
    }
  );
}

    wallet.balance += amount;
    wallet.totalCredits += amount;

    await wallet.save();

   await WalletTransaction.create({
  customerId: payload.id,

  walletId: wallet._id,

  amount,

  type: "Credit",

  reason: "Wallet Recharge",

  status: "Completed",

  paymentId: razorpay_payment_id,

  orderId: razorpay_order_id,
});
    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Verification failed",
      },
      {
        status: 500,
      }
    );
  }
}