// import { MongoClient } from "mongodb";

// const uri = process.env.MONGODB_URI as string;

// if (!uri) {
//   throw new Error("Please add MONGODB_URI to .env.local");
// }

// let client: MongoClient;
// let clientPromise: Promise<MongoClient>;

// declare global {
//   // prevents multiple connections in dev
//   var _mongoClientPromise: Promise<MongoClient>;
// }

// if (!global._mongoClientPromise) {
//   client = new MongoClient(uri);
//   global._mongoClientPromise = client.connect();
// }

// clientPromise = global._mongoClientPromise;

// export default clientPromise;

/*import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI in .env.local");
}

let cached = (global as typeof global & {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}).mongoose;

if (!cached) {
  cached = (global as typeof global & {
    mongoose: {
      conn: typeof mongoose | null;
      promise: Promise<typeof mongoose> | null;
    };
  }).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI, {
      dbName: "smart-dairy",
    });
  }

  cached!.conn = await cached!.promise;

  return cached!.conn;
}*/
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

export async function connectDB() {
  console.log("URI:", MONGODB_URI);

  try {
    const conn = await mongoose.connect(MONGODB_URI);

    console.log("Connected!");

    return conn;
  } catch (err) {
    console.error("Mongo Error:", err);
    throw err;
  }
}