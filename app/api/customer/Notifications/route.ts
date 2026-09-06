import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";

import Notification from "@/models/Notification";

export async function GET(req: NextRequest) {

    await connectDB();

    const token=req.cookies.get("token")?.value;

    if(!token){

        return NextResponse.json(
            {success:false},
            {status:401}
        );

    }

    const payload=await verifyToken(token) as {id:string};

    const notifications=
    await Notification.find({

        customerId:payload.id

    }).sort({

        createdAt:-1

    });

    return NextResponse.json({

        success:true,

        notifications

    });

}