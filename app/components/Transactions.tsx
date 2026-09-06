
"use client";

import {
useEffect,
useState
} from "react";

type Transaction={

id:number;

transactionId?:string;

customer?:string;

customerId?:string;

animalId?:string;

animalName?:string;

amount:string;

status:string;

date:string;

milk?:string;

quality?:string;

upi?:string;

};
export default function Transactions(){

const[
history,
setHistory
]=
useState<Transaction[]>([]);
useEffect(()=>{

const stored=
JSON.parse(

localStorage.getItem(
"transactions"
)

||

"[]"

);

setHistory(

stored

.sort(
(a:Transaction,b:Transaction)=>

b.id-a.id

)

.slice(
0,
6
)

);

},[]);
return(

<section
id="transactions"
className="
px-10
pb-32
scroll-mt-32
"
>

<h2
className="
text-center
text-5xl
font-bold
mb-16
"
>

Transactions

</h2>

<div
className="
max-w-5xl
mx-auto
space-y-6
"
>


{

history.length===0

?

<div
className="
text-center
bg-white/5
rounded-3xl
p-14
border
border-green-900
"
>

<h3
className="
text-3xl
font-bold
"
>

No Transactions Yet

</h3>

<p
className="
mt-4
text-gray-400
"
>

Complete a milk scan to see payment history

</p>

</div>

:

history.map(
(item)=>(

<div
key={item.id}
className="
bg-white/5
rounded-3xl
p-8
border
border-green-900
"
>

<div
className="
flex
justify-between
"
>

<span
className="
text-3xl
font-bold
"
>
{item.amount}
</span>

<span
className="
text-green-300
"
>
{item.status}
</span>

</div>

<div
className="
mt-4
text-gray-400
space-y-1
"
>

<p>
Milk:
{item.milk || "--"}
</p>

<p>
Quality:
{item.quality || "--"}
</p>

<p>
{item.date}
</p>

</div>

</div>

)
)}

</div>

</section>

);
}