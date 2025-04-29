import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB Connected");
  } 
  catch(error) {
    console.log('Error connecting to MongoDB', error);
  }
}

export default connectDB;