import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database";
import Todo from "@/model/todo.model";
import { getUserIdFromRequest } from "@/lib/auth";

// GET
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await context.params; // Await the async params

  const userId = getUserIdFromRequest(req);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    // Check if the todo belongs to the current user
    if (todo.user.toString() !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ todo });
  } catch (error) {
    console.error("Error fetching todo:", error);
    return NextResponse.json({ message: "Failed to fetch todo" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await context.params; // Await the async params
  const userId = getUserIdFromRequest(req);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    if (todo.user.toString() !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await todo.deleteOne();
    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json({ message: "Failed to delete todo" }, { status: 500 });
  }
}

// PUT
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await context.params; // Await the async params
  const userId = getUserIdFromRequest(req);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    if (todo.user.toString() !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { title, description, completed } = await req.json();

    // Only update fields if provided
    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (completed !== undefined) todo.completed = completed;

    await todo.save();

    return NextResponse.json({ message: "Todo updated successfully", todo });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json({ message: "Failed to update todo" }, { status: 500 });
  }
}
