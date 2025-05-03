import connectDB from "@/lib/database";
import Todo from "@/model/todo.model";
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/auth"; // 🔁 imported from helper

// ✅ Create Todo
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, description, completed } = await request.json();
    await connectDB();

    const todo = await Todo.create({
      title,
      description,
      completed,
      user: userId, // associate with user
    });

    return NextResponse.json(
      { message: "Todo Created Successfully", todo },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error Creating todo:", error);
    return NextResponse.json(
      { message: "Failed to Create Todo" },
      { status: 500 }
    );
  }
}

// ✅ Read Todos for logged-in user only
export async function GET(request: NextRequest) {
  await connectDB();
  try {
    const userId = getUserIdFromRequest(request);
    console.log("User ID from token:", userId);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const todos = await Todo.find({ user: userId });

    return NextResponse.json({ todos });
  } catch (error) {
    console.log("Error Reading todos:", error);
    return NextResponse.json(
      { message: "Failed to Get Todos" },
      { status: 500 }
    );
  }
}
