import mongoose, { Schema } from "mongoose";

const WalletTransactionSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    animalId: {
      type: Schema.Types.ObjectId,
      ref: "Animal",
    },

    milkRecordId: {
      type: Schema.Types.ObjectId,
      ref: "MilkRecord",
    },

    type: {
      type: String,
      enum: ["Credit", "Debit"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
      default: "Milk Scan",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Completed",
        "Failed",
      ],
      default: "Completed",
    },

    upiId: {
      type: String,
      default: "",
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: {
      type: Date,
    },

    rejectedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default
  mongoose.models.WalletTransaction ||
  mongoose.model("WalletTransaction", WalletTransactionSchema);