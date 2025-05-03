
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Clear the cookie for logout
    const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: false,
      maxAge: 0, // Expiring the cookie immediately
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: "Logout failed" }, { status: 500 });
  }
}
