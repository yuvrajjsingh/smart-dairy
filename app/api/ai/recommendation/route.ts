import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";
import Animal, { IAnimal } from "@/models/Animal";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Check Gemini API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Gemini API key is not configured.",
        },
        { status: 500 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Get logged-in user's token
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Verify JWT
    const payload = (await verifyToken(token)) as {
      id: string;
      role: string;
    };

    // Only customers/users should use this
    if (payload.role !== "user") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied",
        },
        { status: 403 }
      );
    }

    // Get data sent by frontend
    const body = await req.json();

    const { animalId, symptoms } = body;

    if (!animalId) {
      return NextResponse.json(
        {
          success: false,
          message: "Animal ID is required.",
        },
        { status: 400 }
      );
    }

    // Find the animal belonging to the logged-in user
    const animal = await Animal.findOne({
      _id: animalId,
      owner: payload.id,
    }).lean<IAnimal>();

    if (!animal) {
      return NextResponse.json(
        {
          success: false,
          message: "Animal not found.",
        },
        { status: 404 }
      );
    }

    // Prompt sent to AI
    const prompt = `
You are an AI assistant for a dairy farm management application called Smart Dairy.

Your job is to provide GENERAL animal health, feeding and dairy-management guidance.

IMPORTANT:
- Do not diagnose diseases.
- Do not replace a veterinarian.
- If serious symptoms are mentioned, recommend contacting a veterinarian.
- Give practical and easy-to-understand recommendations.
- Use the animal information provided below.
- Do not invent information.

Animal information:

Name: ${animal.animalName}
Animal ID: ${animal.animalId}
Animal Type: ${animal.animalType}
Age: ${animal.age || "Not provided"} years
Weight: ${animal.weight || "Not provided"} kg
Milk Capacity: ${animal.milkCapacity || "Not provided"} litres/day
Pregnancy Month: ${animal.pregnancyMonth || "Not provided"}
Health: ${animal.health || "Not provided"}
Feed: ${animal.feed || "Not provided"}
Water: ${animal.water || "Not provided"}
Supplements: ${animal.supplements || "Not provided"}
Growth: ${animal.growth || "Not provided"}

Farmer's observation:

${symptoms || "No specific symptoms provided."}

Provide the response using these sections:

1. Health observation
2. Possible general causes
3. Feeding recommendation
4. Water recommendation
5. Supplement/management recommendation
6. Things the farmer should monitor
7. When to contact a veterinarian

Keep the response concise, practical and easy for a farmer to understand.
`;

    // Call Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const recommendation = response.text;

    // Send result back to frontend
    return NextResponse.json({
      success: true,
      recommendation,
      animal: {
        id: animal.animalId,
        name: animal.animalName,
        type: animal.animalType,
      },
    });
  } catch (error) {
    console.error("AI Recommendation Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate AI recommendation.",
      },
      { status: 500 }
    );
  }
}