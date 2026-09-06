"use client";

import { useEffect, useState } from "react";

type Request = {

_id:string;

customerId:{
username:string;
email:string;
};

amount:number;

upiId:string;

createdAt:string;

};

export default function Withdrawals(){

const[
requests,
setRequests
]=useState<Request[]>([]);
const [
loading,
setLoading
]=useState("");
const pendingRequests =
requests.length;

const pendingAmount =
requests.reduce(
(a,b)=>a+b.amount,
0
);

const approvedToday = 0;

const totalRequests = requests.length;

async function load(){

const res=
await fetch(
"/api/admin/withdrawals",
{
credentials:"include",
}
);

const data=
await res.json();

if(res.ok){

setRequests(data.requests);

}

}
const [search,setSearch]=useState("");

const filteredRequests =
requests.filter(r=>

r.customerId.username
.toLowerCase()
.includes(search.toLowerCase())

);
useEffect(()=>{

load();

const timer=setInterval(

load,

5000

);

return()=>clearInterval(timer);

},[]);

async function approve(id:string){

if(
!confirm("Approve this withdrawal?")
){
return;
}

setLoading(id);

await fetch(
`/api/admin/withdrawals/${id}/approve`,
{
method:"POST",
credentials:"include",
}
);

alert("Withdrawal Approved");

setLoading("");

load();

}

async function reject(id:string){

if(
!confirm("Reject this withdrawal?")
){
return;
}

setLoading(id);

await fetch(
`/api/admin/withdrawals/${id}/reject`,
{
method:"POST",
credentials:"include",
}
);

alert("Withdrawal Rejected");

setLoading("");

load();

}
return(

<main
className="
min-h-screen
bg-black
text-white
p-10
">
<div className="grid md:grid-cols-4 gap-6 mb-10">

<Card
title="Pending Requests"
value={pendingRequests}
/>

<Card
title="Pending Amount"
value={`₹${pendingAmount}`}
/>

<Card
title="Approved Today"
value={`₹${approvedToday}`}
/>

<Card
title="Total Requests"
value={totalRequests}
/>
<input
placeholder="Search Farmer"
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="
bg-white/5
border
border-green-700
rounded-xl
px-5
py-3
"
/>


</div>
<h1
className="
text-5xl
font-black
mb-12
">

Pending Withdrawals

</h1>

<div
className="
space-y-6
">

{
requests.length===0 ? (

<div
className="
bg-white/5
rounded-3xl
p-10
text-center
">

No Pending Withdrawals

</div>

) : (

filteredRequests
.sort(
(a,b)=>
new Date(b.createdAt).getTime()
-
new Date(a.createdAt).getTime()
)
.map((r)=>(

<div

key={r._id}

className="
bg-white/5
rounded-3xl
p-8
flex
justify-between
items-center
">

<div>

<div
className="
flex
items-center
gap-4
mb-5
"
>

<div
className="
w-14
h-14
rounded-full
bg-green-700
flex
items-center
justify-center
text-2xl
"
>

👨‍🌾

</div>

<div>

<h2
className="
text-2xl
font-bold
"
>

{r.customerId.username}

</h2>

<p
className="text-gray-400"
>

{r.customerId.email}

</p>

</div>

</div>

<p
className="
text-3xl
font-black
text-green-400
"
>

₹{r.amount}

</p>

<div
className="
mt-4
"
>

<p
className="
text-gray-400
"
>
🏦 Destination
</p>
<p
className="
font-semibold
"
>
{r.upiId}
</p>
</div>
<p
className="
mt-4
"
>
Status :
<span
className="
text-yellow-400
ml-2
"
>
Pending
</span>
</p>
<p
className="
text-gray-500
mt-2
"
>
{new Date(r.createdAt).toLocaleString()}
</p>
</div>
<div
className="
flex
flex-col
gap-4
">

<button

onClick={()=>
approve(r._id)
}
disabled={loading===r._id}

className="
bg-green-600
px-6
py-3
rounded-2xl
">
{
loading===r._id
?
"Processing..."
:
"Approve"
}
</button>
<button
onClick={()=>
reject(r._id)
}
disabled={loading===r._id}
className="
bg-red-600
px-6
py-3
rounded-2xl
">
{
loading===r._id
?
"Processing..."
:
"Reject"
}
</button>
</div>
</div>
))
)}
</div>
</main>
);
}
function Card({
title,
value,
}:{
title:string;
value:string|number;
}){
return(
<div
className="
bg-white/5
rounded-3xl
p-8
border
border-green-700
"
>

<p
className="text-gray-400"
>

{title}

</p>

<h2
className="
text-4xl
font-black
text-green-400
mt-3
"
>

{value}

</h2>

</div>

);

}