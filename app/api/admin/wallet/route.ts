import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Wallet from "@/models/Wallet";

export async function GET(){

try{

await connectDB();

const wallets=
await Wallet.find()

.populate(
"customerId",
"username email"
)

.sort({
balance:-1
});

return NextResponse.json({

success:true,

wallets,

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