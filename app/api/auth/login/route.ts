import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    console.log("1️⃣ Login API called");

    await connectDB();
    console.log("2️⃣ Database connected");

    const body = await req.json();
    console.log("3️⃣ Body:", body);

    const { username, password } = body;

    if (!username || !password) {
      console.log("❌ Username/password missing");

      return NextResponse.json(
        {
          success: false,
          message: "Username and password are required",
        },
        { status: 400 }
      );
    }

    console.log("Connected DB:", User.db.db?.databaseName);

    const user = await User.findOne({ username });
    console.log("4️⃣ User Found:", user);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Username not found",
        },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("5️⃣ Password Match:", isMatch);

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect password",
        },
        { status: 401 }
      );
    }

    const token = await createToken({
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    });

    console.log("6️⃣ Token Created");

    const response = NextResponse.json({
      success: true,
      message: "Login successful",

      user: {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },

    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log("7️⃣ Response Sent");

    return response;
  } catch (error) {
    console.error("🔥 LOGIN ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}