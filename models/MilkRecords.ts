import mongoose, {
  Schema,
  models,
  model,
  Document,
} from "mongoose";
export interface IMilkRecord extends Document {
  customerId: mongoose.Types.ObjectId;
  animalId: mongoose.Types.ObjectId;
  milk: number;
  fat: number;
  snf: number;
  protein: number;
  density: number;
  lactose: number;
  waterPercent: number;
  quality: string;
  ratePerLitre: number;
  payment: number;
  createdAt: Date;
}
const MilkRecordSchema = new Schema(
{
customerId:{
type:Schema.Types.ObjectId,
ref:"User",
required:true,
},
animalId:{
type:Schema.Types.ObjectId,
ref:"Animal",
required:true,
},
milk:{
type:Number,
required:true,
},
fat:{
type:Number,
required:true,
},
snf:{
type:Number,
required:true,
},
protein:{
type:Number,
required:true,
},
density:{
type:Number,
required:true,
},
lactose:{
type:Number,
required:true,
},
waterPercent:{
type:Number,
required:true,
},
quality:{
type:String,
required:true,
},
ratePerLitre:{
type:Number,
required:true,
},
payment:{
type:Number,
required:true,
},
paymentStatus: {
  type: String,
  enum: ["Pending", "Paid"],
  default: "Pending",
}
},
{
timestamps:true,
});

export default
models.MilkRecord
||
model<IMilkRecord>(
"MilkRecord",
MilkRecordSchema
);