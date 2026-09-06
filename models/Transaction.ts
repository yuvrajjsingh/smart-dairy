import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ITransaction extends Document {
  session: "Morning" | "Evening";
  remarks?:string;
  seller: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  animalId: mongoose.Types.ObjectId;
  animalType: "Cow" | "Buffalo";
  quantity: number;
  fat: number;
  snf: number;
  rate: number;
  totalAmount: number;
  paymentStatus: "Pending" | "Paid";
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    animalId: {
  type: Schema.Types.ObjectId,
  ref: "Animal",
  required: true,
},

    animalType: {
      type: String,
      enum: ["Cow", "Buffalo"],
      required: true,
    },
    session:{
      type: String,
      enum:["Morning","Evening"],
      required: true,
    },
    remarks:{
      type: String,
      default: "",
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    fat: {
      type: Number,
      required: true,
      min: 0,
    },

    snf: {
      type: Number,
      required: true,
      min: 0,
    },

    rate: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    transactionDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Transaction ||
  model<ITransaction>("Transaction", TransactionSchema);