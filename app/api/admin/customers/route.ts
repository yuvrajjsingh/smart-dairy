import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {

  try {

    await connectDB();

    const customers = await User.find({
  role: "user",
}).select("-password");
    return NextResponse.json({
      success: true,
      customers,
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