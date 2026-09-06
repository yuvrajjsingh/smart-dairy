import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Animal from "@/models/Animal";

export async function DELETE(req: NextRequest) {

  try {

    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {

      return NextResponse.json(
        {
          success:false,
          message:"Unauthorized"
        },
        {
          status:401
        }
      );

    }

  const payload = (await verifyToken(token)) as {
  id: string;
  username: string;
  role: string;
  };

    const id =
      req.nextUrl.searchParams.get("id");

    if(!id){

      return NextResponse.json(
        {
          success:false,
          message:"Animal ID Missing"
        },
        {
          status:400
        }
      );

    }

    const animal =
      await Animal.findOneAndDelete({

        _id:id,

        owner: payload.id,

      });

    if(!animal){

      return NextResponse.json(
        {
          success:false,
          message:"Animal not found"
        },
        {
          status:404
        }
      );

    }

    return NextResponse.json({

      success:true,

      message:"Animal deleted"

    });

  }

  catch(error){

    console.error(error);

    return NextResponse.json(
      {
        success:false,
        message:"Server Error"
      },
      {
        status:500
      }
    );

  }

}