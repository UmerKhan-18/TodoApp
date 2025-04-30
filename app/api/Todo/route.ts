import connectDB from "@/lib/database";
import Todo from "@/model/todo.model";
import { NextRequest, NextResponse } from "next/server";


//Create Todo
export async function POST(request : NextRequest) {
  try{
    const {title, description, completed} = await request.json();
    await connectDB();
    const todo = await Todo.create({title, description, completed})
    return NextResponse.json(
      {message: "Todo Created Succesfully", todo}, { status: 201 });
  }  
  catch(error) {
    console.log("Error Creating todo: ", error);
    return NextResponse.json(
      { message: "Failed to Create Todo" },
      { status: 500 }
    );
    
  }
}

//Read Todo
export async function GET() {
  await connectDB();
  try{
    const todos = await Todo.find();
    return NextResponse.json({
      todos
    })
  }
  catch(error) {
    console.log("Error Reading todo: ", error);
    return NextResponse.json(
      { message: "Failed to Get Todo" },
      { status: 500 }
    )
  }
}
