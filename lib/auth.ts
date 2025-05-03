import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export function getUserIdFromRequest(req: NextRequest): string | null {
  const token = req.cookies.get("token")?.value;
  console.log("Token from request:", token); // Debugging line
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("JWT_SECRET used to verify:", JWT_SECRET);
    console.log("Decoded Token:", decoded);

    return (decoded as { userId: string }).userId;
  } catch (err) {
    console.error("JWT Verification failed:", err);
    return null;
  }
  
}
