"use client";

import { useEffect, useState } from "react";

export default function ReportsPage() {

const [report,setReport]=useState<any>(null);

useEffect(()=>{

loadReport();

},[]);

async function loadReport(){

const res=await fetch(
"/api/admin/reports",
{
credentials:"include"
}
);

const data=await res.json();

if(res.ok){

setReport(data);

}

}

if(!report){

return(

<div className="min-h-screen flex justify-center items-center bg-black text-white">

Loading...

</div>

);

}

return(

<main className="min-h-screen bg-black text-white p-10">

<h1 className="text-5xl font-black mb-10">

📊 Dairy Reports

</h1>

<div className="grid md:grid-cols-4 gap-6">

<Card
title="Today's Milk"
value={`${report.todayMilk} L`}
/>

<Card
title="Today's Revenue"
value={`₹${report.todayRevenue}`}
/>

<Card
title="Average Fat"
value={`${report.avgFat}%`}
/>

<Card
title="Average Protein"
value={`${report.avgProtein}%`}
/>

<Card
title="Average SNF"
value={`${report.avgSNF}%`}
/>

<Card
title="Excellent Quality"
value={report.excellent}
/>

<Card
title="Good Quality"
value={report.good}
/>

<Card
title="Average Quality"
value={report.average}
/>

</div>

</main>

);

}

function Card({

title,
value

}:{

title:string;

value:any;

}){

return(

<div className="bg-white/5 rounded-3xl p-8">

<p className="text-gray-400">

{title}

</p>

<h2 className="text-5xl font-black mt-5">

{value}

</h2>

</div>

);

}