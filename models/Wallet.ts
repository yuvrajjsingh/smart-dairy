import mongoose,{Schema} from "mongoose";

const WalletSchema = new Schema(
{
    customerId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true,
    },

    balance:{
        type:Number,
        default:0,
    },

    totalCredits:{
        type:Number,
        default:0,
    },

    totalDebits:{
        type:Number,
        default:0,
    },
    pendingBalance: {
  type: Number,
  default: 0,
},
},
{
    timestamps:true,
}
);

export default
mongoose.models.Wallet ||
mongoose.model("Wallet",WalletSchema);