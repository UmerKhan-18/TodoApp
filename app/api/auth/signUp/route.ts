import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database";
import User from "@/model/user.model";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    // No manual hashing here — let the pre("save") middleware handle it
    const newUser = new User({ username, email, password });
    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully", user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error.message || error);
    return NextResponse.json({ message: "Signup failed", error: error.message }, { status: 500 });
  }
}

