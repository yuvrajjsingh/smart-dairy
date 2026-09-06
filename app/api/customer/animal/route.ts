import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Animal from "@/models/Animal";
import Notification from "@/models/Notification";

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
        { status: 401 }
      );
    }

    const payload = (await verifyToken(token)) as {
      id: string;
      role: string;
    };

    if (payload.role !== "user") {
      return NextResponse.json(
        {
          success: false,
          message: "Access Denied",
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    const {
      animalName,
      animalType,
      age,
      pregnancyMonth,
    } = body;

    if (
      !animalName ||
      !animalType ||
      !age
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Fill all required fields",
        },
        { status: 400 }
      );
    }

    const animalId =
      "SD-" +
      Math.floor(100000 + Math.random() * 900000);

    const animal = await Animal.create({
      owner: payload.id,

      animalId,

      animalName,

      animalType,

      age: Number(age),

      pregnancyMonth: Number(pregnancyMonth || 0),
    });
    await Notification.create({
  customerId: payload.id,
  title: "Animal Added",
  message: `${animal.animalName} has been registered successfully.`,
});

    return NextResponse.json({
      success: true,
      animal,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}