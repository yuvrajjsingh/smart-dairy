import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import MilkRecords from "@/models/MilkRecords";

export async function GET(){

await connectDB();

const records=await MilkRecords.find();

const today=new Date();

const todayRecords=records.filter(r=>{

const d=new Date(r.createdAt);

return(

d.getDate()===today.getDate() &&
d.getMonth()===today.getMonth() &&
d.getFullYear()===today.getFullYear()

);

});

const sum=(arr:any[],field:string)=>

arr.reduce((a,b)=>a+b[field],0);

const avg=(arr:any[],field:string)=>

arr.length
?
(sum(arr,field)/arr.length).toFixed(2)
:
0;

return NextResponse.json({

todayMilk:sum(todayRecords,"milk"),

todayRevenue:sum(todayRecords,"payment"),

avgFat:avg(records,"fat"),

avgProtein:avg(records,"protein"),

avgSNF:avg(records,"snf"),

excellent:records.filter(r=>r.quality==="Excellent").length,

good:records.filter(r=>r.quality==="Good").length,

average:records.filter(r=>r.quality==="Average").length

});

}