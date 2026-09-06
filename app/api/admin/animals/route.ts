import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Animal from "@/models/Animal";

export async function GET() {
  try {
    await connectDB();

    const animals = await Animal.find()
      .populate("owner", "username email")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      animals,
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