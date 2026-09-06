import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/jwt";

import Wallet from "@/models/Wallet";
import WalletTransaction from "@/models/WalletTransaction";
import Notification from "@/models/Notification";

export async function PATCH(
req:NextRequest,
{
params,
}:{
params:{id:string}
}
){

try{

await connectDB();

const token=req.cookies.get("token")?.value;

if(!token){

return NextResponse.json(
{
success:false,
message:"Unauthorized"
},
{
status:401
}
);

}

const admin=await verifyToken(token) as{
id:string;
role:string;
};

if(admin.role!=="admin"){

return NextResponse.json(
{
success:false,
message:"Access Denied"
},
{
status:403
}
);

}

const transaction=
await WalletTransaction.findById(params.id);

if(!transaction){

return NextResponse.json(
{
success:false,
message:"Transaction not found"
},
{
status:404
}
);

}

if(transaction.status!=="Pending"){

return NextResponse.json(
{
success:false,
message:"Already Processed"
},
{
status:400
}
);

}

const wallet=
await Wallet.findOne({
customerId:transaction.customerId
});

if(!wallet){

return NextResponse.json(
{
success:false,
message:"Wallet not found"
},
{
status:404
}
);

}

if(wallet.balance<transaction.amount){

return NextResponse.json(
{
success:false,
message:"Insufficient Wallet Balance"
},
{
status:400
}
);

}

wallet.balance-=transaction.amount;

await wallet.save();

transaction.status="Completed";

transaction.approvedBy=admin.id;

transaction.approvedAt=new Date();

await transaction.save();

await Notification.create({

customerId:transaction.customerId,

title:"Withdrawal Approved",

message:`₹${transaction.amount} has been transferred.`

});

return NextResponse.json({

success:true,

message:"Withdrawal Approved"

});

}

catch(error){

console.error(error);

return NextResponse.json(

{
success:false,
message:"Server Error"
},

{
status:500
}

);

}

}