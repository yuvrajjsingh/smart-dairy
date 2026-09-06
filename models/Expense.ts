import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IExpense extends Document {
  title: string;
  category: "Feed" | "Medicine" | "Transport" | "Electricity" | "Salary" | "Other";
  amount: number;
  description?: string;
  expenseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Feed",
        "Medicine",
        "Transport",
        "Electricity",
        "Salary",
        "Other",
      ],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      default: "",
    },

    expenseDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Expense || model<IExpense>("Expense", ExpenseSchema);