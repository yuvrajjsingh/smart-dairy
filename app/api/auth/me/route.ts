import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import User from "@/models/User";

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

    const user = await User.findById(payload.id).select(
      "-password"
    );

    if (!user) {
      return NextResponse.json(
        { success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}