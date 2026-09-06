import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import WalletTransaction from "@/models/WalletTransaction";


export async function POST(req:Request){

try{

await connectDB();

const body = await req.json();


const payment = await WalletTransaction.create({

customerId: body.customerId,

animalId: body.animalId,

type:"Credit",

amount: body.amount,

reason:"Milk Payment",

status:"Completed"

});


return NextResponse.json({
success:true,
payment
});


}
catch(error){

console.log(error);

return NextResponse.json(
{
success:false,
message:"Payment failed"
},
{
status:500
}
);

}

}