// import clientPromise from "@/lib/mongodb";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const client = await clientPromise;

//     await client.db("smart-dairy").command({ ping: 1 });

//     return NextResponse.json({
//       success: true,
//       message: "MongoDB Connected Successfully 🚀",
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json({
//       success: false,
//       error,
//     });
//   }
// }

//import { connectDB } from "@/lib/mongodb";

//export async function GET() {
  //try {
  //  await connectDB();

  //  return Response.json({
 //     success: true,
  //    message: "MongoDB connected successfully 🚀",
 //   });
 // } catch (error) {
 //   return Response.json({
 //     success: false,
 //     error: error instanceof Error ? error.message : "Unknown error",
 //   });
 // }
//}
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      message: "MongoDB Connected!",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json({
      success: false,
      error: String(err),
    });
  }
}