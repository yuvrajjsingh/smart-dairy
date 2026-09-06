import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Animal from "@/models/Animal";

export async function GET(req: NextRequest) {
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
    };

    const { searchParams } = new URL(req.url);

    const animalId = searchParams.get("animalId");

    if (!animalId) {
      return NextResponse.json(
        {
          success: false,
          message: "Animal ID required",
        },
        {
          status: 400,
        }
      );
    }

    const animal = await Animal.findOne({
      _id: animalId,
      customerId: payload.id,
    });

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

    return NextResponse.json({
      success: true,
      animal,
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