import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MilkRecords from "@/models/MilkRecords";

export async function GET() {

  try {

    await connectDB();

    const records = await MilkRecords.find();

    return NextResponse.json({

      success: true,

      records,

    });

  }

  catch {

    return NextResponse.json({

      success:false

    });

  }

}