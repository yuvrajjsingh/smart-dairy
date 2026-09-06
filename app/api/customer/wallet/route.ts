import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";

import { verifyToken } from "@/lib/jwt";

import Wallet from "@/models/Wallet";

import WalletTransaction from "@/models/WalletTransaction";

export async function GET(req: NextRequest) {

    try {

        await connectDB();

        const token = req.cookies.get("token")?.value;

        if (!token) {

            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );

        }

        const payload = await verifyToken(token) as {
            id: string;
        };

        let wallet = await Wallet.findOne({
            customerId: payload.id,
        });

        if (!wallet) {

            wallet = await Wallet.create({
                customerId: payload.id,
                balance: 0,
            });

        }

        const transactions =
            await WalletTransaction.find({

                customerId: payload.id,

            })

            .sort({ createdAt: -1 });

        return NextResponse.json({

        success: true,

wallet: {
  balance: wallet.balance,
  totalCredits: wallet.totalCredits,
  totalDebits: wallet.totalDebits,
  pendingBalance: wallet.pendingBalance,
},

      transactions,

     });

    }

    catch (err) {

        console.error(err);

        return NextResponse.json(

            { message: "Server Error" },

            { status: 500 }

        );

    }

}