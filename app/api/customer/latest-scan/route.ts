import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";

import MilkRecords from "@/models/MilkRecords";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    /* ---------------- JWT ---------------- */

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

    /* ---------------- FIND LATEST SCAN ---------------- */

    const latestScan = await MilkRecords.findOne({
  customerId: payload.id,
})
.sort({ createdAt: -1 })
.populate(
  "animalId",
  "animalName animalId animalType"
);
    if (!latestScan) {
      return NextResponse.json(
        {
          success: false,
          message: "No milk scan found.",
        },
        {
          status: 404,
        }
      );
    }

    const animal = latestScan.animalId as any;

    return NextResponse.json({
      success: true,

      scan: {
        id: latestScan._id,

        animalName: animal?.animalName,

        animalId: animal?.animalId,

        animalType: animal?.animalType,

        milk: latestScan.milk,

        fat: latestScan.fat,

        protein: latestScan.protein,

        snf: latestScan.snf,

        density: latestScan.density,

        lactose: latestScan.lactose,

        waterPercent: latestScan.waterPercent,

        quality: latestScan.quality,

        ratePerLitre: latestScan.ratePerLitre,

        payment: latestScan.payment,

        createdAt: latestScan.createdAt,
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