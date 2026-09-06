import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Transaction from "@/models/Transaction";
import WalletTransaction from "@/models/WalletTransaction";

export async function GET(req: NextRequest) {

  try {

    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {

      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 401,
        }
      );

    }

    const payload = (await verifyToken(token)) as {
      id: string;
    };

    const transactions = await Transaction.find({
      seller: payload.id,
    })
      .populate("buyer", "username email")
      .populate("animalId", "animalName animalType")
      .sort({
        createdAt: -1,
      });

    return NextResponse.json({

      success: true,

      transactions,

    });

  } catch (error) {

    console.error(error);

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
export async function POST(req: NextRequest) {

  try {

    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {

      return NextResponse.json(
        { success: false },
        { status: 401 }
      );

    }

    const payload = (await verifyToken(token)) as {
      id: string;
    };

    const body = await req.json();
    if (
      !body.buyer ||
      !body.animalId ||
      !body.animalType ||
      !body.session ||
      body.quantity == null ||
      body.fat == null ||
      body.snf == null ||
      body.rate == null
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    const totalAmount = Number(body.quantity) * Number(body.rate);
    if (
      Number(body.quantity) <= 0 ||
      Number(body.rate) <= 0 ||
      Number(body.fat) < 0 ||
      Number(body.snf) < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid values",
        },
        {
          status: 400,
        }
      );
    }

    const transaction = await Transaction.create({


      seller: payload.id,
      buyer: body.buyer,
      animalId: body.animalId,
      animalType: body.animalType,
      session: body.session,
      quantity: Number(body.quantity),
      fat: Number(body.fat),
      snf: Number(body.snf),
      rate: Number(body.rate),
      totalAmount,
      paymentStatus: "Pending",
      remarks: body.remarks || "",
      transactionDate: new Date(),


    });
    await WalletTransaction.create({
      customerId: body.buyer,
      animalId: body.animalId,
      type: "Credit",
      amount: totalAmount,
      reason: "Milk Sale",
      status: "Completed",
    });

    return NextResponse.json({

      success: true,

      transaction,

    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );

  }

}