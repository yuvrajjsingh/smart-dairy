import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MilkRecords from "@/models/MilkRecords";

export async function GET() {

  try {

    await connectDB();

    const records =
      await MilkRecords.find();

    const grouped: Record<string, number> = {};

    records.forEach((milk:any)=>{

      const month =
        new Date(milk.createdAt)
        .toLocaleString(
          "en-US",
          {
            month:"short"
          }
        );

      grouped[month] =
        (grouped[month] || 0)
        +
        Number(
          milk.payment || 0
        );

    });

    const months = [

      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"

    ];

    const chart =
      months.map(month=>({

        label:month,

        value:
          grouped[month] || 0

      }));

    return NextResponse.json({

      success:true,

      chart,

    });

  }

  catch(error){

    console.error(error);

    return NextResponse.json(

      {
        success:false
      },

      {
        status:500
      }

    );

  }

}