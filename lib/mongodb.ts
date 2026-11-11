import mongoose from "mongoose";

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in the environment");
  }

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
