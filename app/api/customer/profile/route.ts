import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import User from "@/models/User";
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

    const user = await User.findById(payload.id)
      .select("-password")
      .lean();

    if (!user) {

      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );

    }

   const animals = await Animal.find({
  owner: payload.id,
}).lean();
   const selectedAnimal =
  animals.length > 0 ? animals[0] : null;

    return NextResponse.json({

      success: true,

      user,

      animals,

      selectedAnimal,

    });

  }

  catch (error) {

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