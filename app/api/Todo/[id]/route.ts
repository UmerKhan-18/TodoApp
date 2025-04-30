import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database";
import Todo from "@/model/todo.model";

// GET
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await context.params;

  try {
    const todo = await Todo.findById(id);
    return NextResponse.json({ todo });
  } catch (error) {
    console.error("Error fetching todo:", error);
    return NextResponse.json({ message: "Failed to fetch todo" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await context.params;

  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json({ message: "Failed to delete todo" }, { status: 500 });
  }
}

// PUT
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await context.params;

  try {
    const { title, description, completed } = await req.json();
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description, completed },
      { new: true }
    );

    if (!updatedTodo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Todo updated successfully", todo: updatedTodo });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json({ message: "Failed to update todo" }, { status: 500 });
  }
}
