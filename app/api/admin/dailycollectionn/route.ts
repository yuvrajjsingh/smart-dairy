import { NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import Transaction from "@/models/Transaction";


export async function GET(){

  try{

    await connectDB();


    const start = new Date();
    start.setHours(0,0,0,0);


    const end = new Date();
    end.setHours(23,59,59,999);



    const records = await Transaction.find({
      transactionDate:{
        $gte:start,
        $lte:end
      }
    })
    .populate(
      "seller",
      "username email"
    )
    .populate(
      "animalId",
      "animalId animalName animalType"
    )
    .sort({
      createdAt:-1
    });



    const formatted = records.map((item:any)=>({

      _id:item._id,

      customerId:item.seller,

      animalId:item.animalId,

      milk:item.quantity,

      payment:item.totalAmount,

      createdAt:item.createdAt

    }));


    return NextResponse.json({
      records:formatted
    });



  }catch(error){

    console.log(error);

    return NextResponse.json(
      {
        message:"Failed to fetch collection"
      },
      {
        status:500
      }
    );

  }

}