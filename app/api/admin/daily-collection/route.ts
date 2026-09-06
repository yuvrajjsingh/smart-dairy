import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MilkRecords from "@/models/MilkRecords";

export async function GET() {
  try {
    await connectDB();

    const records = await MilkRecords.find().sort({
      createdAt: -1,
    });

    const days = [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ];

    const grouped: Record<string, number> = {};

    days.forEach((d) => (grouped[d] = 0));

    records.forEach((record: any) => {
      const day = days[new Date(record.createdAt).getDay()];
      grouped[day] += Number(record.milk || 0);
    });

    return NextResponse.json({
      success: true,
      chart: grouped,
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