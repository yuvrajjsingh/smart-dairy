import { Schema, Document, models, model } from "mongoose";

export interface IMilkRate extends Document {
  animalType: "Cow" | "Buffalo";
  ratePerLiter: number;
  effectiveFrom: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MilkRateSchema = new Schema<IMilkRate>(
  {
    animalType: {
      type: String,
      enum: ["Cow", "Buffalo"],
      required: true,
    },

    ratePerLiter: {
      type: Number,
      required: true,
      min: 0,
    },

    effectiveFrom: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default models.MilkRate ||
  model<IMilkRate>("MilkRate", MilkRateSchema);