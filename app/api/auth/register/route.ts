import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

const {
  name,
  username,
  email,
  password,
  phone,
  address,
} = body;
    // Validation
    if (
  !name ||
  !username ||
  !email ||
  !password ||
  !phone ||
  !address
){
      
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }
    const existingUsername = await User.findOne({
  username,
});

if (existingUsername) {
  return NextResponse.json(
    {
      success: false,
      message: "Username already exists",
    },
    { status: 409 }
  );
}

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already registered",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
  name,
  username,
  email,
  password: hashedPassword,
  phone,
  address,
  role: "user",
});

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}