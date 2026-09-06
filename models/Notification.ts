import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead:{
    type:Boolean,
    default:false
    },
  },
  {
    timestamps: true,
  }
);

export default
mongoose.models.Notification ||
mongoose.model("Notification", NotificationSchema);