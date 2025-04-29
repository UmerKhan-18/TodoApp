import connectDB from "@/lib/database";
import Todo from "@/model/todo.model";
import { NextRequest, NextResponse } from "next/server";


interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, {params}: Params) {
  await connectDB();

  try{
    const todo = await Todo.findById(params.id);
    return NextResponse.json({ todo });
  }
  catch(error) {
    console.error("Error fetching todo:", error);
    return NextResponse.json(
      { message: "Failed to fetch todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  await connectDB();

  try {
    const deletedTodo = await Todo.findByIdAndDelete(params.id);

    if (!deletedTodo) {
      return NextResponse.json({ message: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { message: "Failed to delete todo" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  await connectDB();

  try {
    const { title, description, completed } = await request.json();

    const updatedTodo = await Todo.findByIdAndUpdate(
      params.id,
      { title, description, completed },
      { new: true }
    );

    if (!updatedTodo) {
      return NextResponse.json(
        { message: "Todo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Todo updated successfully",
      todo: updatedTodo,
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { message: "Failed to update todo" },
      { status: 500 }
    );
  }
}