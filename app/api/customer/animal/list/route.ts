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
        { success: false },
        { status: 401 }
      );
    }

    const payload = (await verifyToken(token)) as {
      id: string;
    };

   const animals = await Animal.find({
  owner: payload.id,
}).lean();

    return NextResponse.json({
      success: true,
      animals,
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );

  }
}