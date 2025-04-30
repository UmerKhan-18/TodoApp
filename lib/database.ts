import mongoose from "mongoose";

declare global {
  var mongooseConnection: typeof mongoose | null;
}

if (!global.mongooseConnection) {
  global.mongooseConnection = null;
}

const connectDB = async () => {
  if (global.mongooseConnection) return;

  try {
    global.mongooseConnection = await mongoose.connect(process.env.MONGO_URI!);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect");
  }
};

export default connectDB;
