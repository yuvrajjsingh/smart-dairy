"use client";

import { useEffect, useState } from "react";

export default function Notifications(){

const[notifications,setNotifications]=useState<any[]>([]);

useEffect(()=>{

load();

},[]);

async function load(){

const res=
await fetch("/api/customer/notifications",{

credentials:"include"

});

const data=
await res.json();

if(res.ok){

setNotifications(data.notifications);

}

}

return(

<main className="min-h-screen bg-black text-white p-10">

<h1 className="text-5xl font-black mb-10">

🔔 Notifications

</h1>

<div className="space-y-5">

{

notifications.map((n)=>(

<div

key={n._id}

className={`
rounded-3xl
p-6
border

${n.read
?"bg-white/5"
:"bg-green-900"}

`}

>

<h2 className="font-bold">

{n.title}

</h2>

<p>

{n.message}

</p>

<p className="text-gray-400 mt-2">

{new Date(n.createdAt).toLocaleString()}

</p>

</div>

))

}

</div>

</main>

);

}