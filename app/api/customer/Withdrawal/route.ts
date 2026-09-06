import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import WalletTransaction from "@/models/WalletTransaction";


export async function POST(req: Request) {

  try {

    await connectDB();

    const body = await req.json();


    const withdrawal = await WalletTransaction.create({

      customerId: body.customerId,

      type: "Debit",

      amount: body.amount,

      reason: "Withdrawal Request",

      upiId: body.upiId,

      status: "Pending"

    });


    return NextResponse.json({
      success: true,
      withdrawal
    });


  } catch(error) {

    console.log(error);

    return NextResponse.json(
      {
        success:false,
        message:"Withdrawal failed"
      },
      {
        status:500
      }
    );

  }

}