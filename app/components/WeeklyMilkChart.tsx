"use client";

import {
useEffect,
useState
} from "react";
type Scan={
date:string;
milk:string;
};
export default function WeeklyMilkChart(){
const[
chart,
setChart
]=useState<number[]>([
0,0,0,0,0,0,0
]);
useEffect(() => {
  async function loadChart() {
    try {
      const res = await fetch("/api/customer/milk/weekly",
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) return;
      const values = [0, 0, 0, 0, 0, 0, 0];
      const records = data.records.slice(0,7).reverse(); 
           records.forEach(
        (tx: any, index: number) => {
          values[index]=Number(tx.milk);
        }
      );
      setChart(values);
    }
    catch (err) {
      console.error(err);
    }
  }
  loadChart();
}, []);
const days=[
"Mon",
"Tue",
"Wed",
"Thu",
"Fri",
"Sat",
"Sun"
];
return(
<section
className="
mt-20
bg-gradient-to-br
from-green-950/40
to-black
border
border-green-800
rounded-[40px]
p-10
backdrop-blur-xl
"
>
<div
className="
flex
justify-between
items-center
mb-12
"
>
<div>
<h2
className="
text-4xl
font-black
"
>
📊 Weekly Milk Trend
</h2>
<p
className="
text-gray-400
mt-2
"
>
Last 7 days
</p>
</div>
<div
className="
text-green-400
text-xl
font-bold
"
>
{
chart.reduce((a,b)=>a+b,0).toFixed(1)
} L
</div>
</div>
<div
className="
h-[320px]
flex
items-end
justify-between
gap-5
"
>
{
chart.map(
(
value,
i
)=>(
<div
key={i}
className="
flex
flex-col
items-center
w-full
"
>
<p
className="
mb-3
text-green-300
font-bold
"
>
{
value
}
</p>

<div
className="
w-full
rounded-t-[30px]
bg-gradient-to-t
from-green-500
to-emerald-300
transition-all
duration-700
shadow-[0_0_50px_rgba(34,197,94,0.45)]
"
style={{
height:
`${
Math.max(
value*8,
20
)
}px`
}}
></div>
<p
className="
mt-4
text-gray-400
"
>
{
days[i]
}
</p>
</div>
)
)
}
</div>
</section>
);
}