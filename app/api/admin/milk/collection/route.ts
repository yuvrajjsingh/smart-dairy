import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import WalletTransaction from "@/models/WalletTransaction";

export const dynamic = "force-dynamic";


export async function POST(req: Request) {

  try {

    await connectDB();

    const body = await req.json();

    console.log("MILK COLLECTION BODY:", body);


    const amount =
      Number(body.quantity) * Number(body.rate);



    const transaction = await Transaction.create({

      seller: body.customerId,

      // temporary testing
      buyer: body.customerId,

      animalId: body.animalId,

      animalType: body.animalType,

      session: body.session,

      quantity: Number(body.quantity),

      fat: Number(body.fat),

      snf: Number(body.snf),

      rate: Number(body.rate),

      totalAmount: amount,

      paymentStatus: "Pending",

      remarks: body.remarks || ""

    });



    const wallet = await WalletTransaction.create({

      customerId: body.customerId,

      animalId: body.animalId,

      type: "Credit",

      amount: amount,

      reason: "Milk Payment",

      status: "Completed"

    });



    return NextResponse.json({

      success:true,

      transaction,

      wallet

    });



  } catch(error:any) {


    console.log(
      "MILK COLLECTION ERROR:",
      error
    );


    return NextResponse.json(

      {
        success:false,
        message:error.message || "Transaction failed"
      },

      {
        status:500
      }

    );

  }

}