import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import User from "@/models/User";
import Wallet from "@/models/Wallet";
import WalletTransaction from "@/models/WalletTransaction";
import Animal from "@/models/Animal";
import MilkRecords from "@/models/MilkRecords";
export async function GET(
_req: NextRequest,
{
params,
}:{
params:{id:string}
}
){

try{

await connectDB();

const customer =
await User.findById(params.id)
.select("-password");

if(!customer){

return NextResponse.json(
{
success:false,
message:"Customer not found"
},
{
status:404
}
);

}

const wallet =
await Wallet.findOne({
customerId:params.id
});
const milkHistory = await MilkRecords.find({
  customerId: params.id,
})
.populate(
  "animalId",
  "animalId animalName animalType"
)
.sort({
  createdAt: -1,
});
const animals =
await Animal.find({
owner:params.id
});

const transactions =
await WalletTransaction.find({
customerId:params.id
})
.populate(
"animalId",
"animalId animalName animalType"
)
.sort({
createdAt:-1
});
const totalMilk = milkHistory.reduce(
  (sum, milk) => sum + Number(milk.milk || 0),
  0
);

const totalEarnings = milkHistory.reduce(
  (sum, milk) => sum + Number(milk.payment || 0),
  0
);

const totalTransactions = transactions.length;

const statistics = {

  totalMilk,

  totalEarnings,

  totalTransactions,

  totalAnimals: animals.length,

};
return NextResponse.json({

success: true,

customer,

wallet,

animals,

transactions,

milkHistory,

statistics,

});
}

catch(error){

console.error(error);

return NextResponse.json(
{
success:false
},
{
status:500
}
);

}

}