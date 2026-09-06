import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Wallet from "@/models/Wallet";

export async function GET(){

try{

await connectDB();

const wallets=
await Wallet.find();

const totalBalance=
wallets.reduce(
(a,b)=>a+b.balance,
0
);

const totalCredits=
wallets.reduce(
(a,b)=>a+b.totalCredits,
0
);

const totalDebits=
wallets.reduce(
(a,b)=>a+b.totalDebits,
0
);

return NextResponse.json({

success:true,

totalBalance,

totalCredits,

totalDebits,

farmers:wallets.length,

});

}
catch{

return NextResponse.json({

success:false,

},{
status:500
});

}

}