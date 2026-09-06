import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Wallet from "@/models/Wallet";

export async function GET(){

await connectDB();

const wallets=

await Wallet.find()

.populate(
"customerId",
"username"
)

.sort({
balance:-1
})

.limit(10);

return NextResponse.json({

success:true,

wallets,

});

}