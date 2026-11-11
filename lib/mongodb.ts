import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in the environment");
}

export async function connectDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      dbName: "smart-dairy",
    });

    console.log("MongoDB connected:", conn.connection.name);
    return conn;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}
