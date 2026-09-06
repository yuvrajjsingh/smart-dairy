"use client";

import {
useEffect,
useState
}
from "react";

import {
motion
}
from "framer-motion";

type Notification={

id:number;

icon:string;

title:string;

value:string;

};

export default function Notifications(){

const[
alerts,
setAlerts
]=
useState<Notification[]>([]);

const[
loading,
setLoading
]=
useState(true);

useEffect(()=>{

async function loadNotifications(){

try{

/*
BACKEND READY

later create:

GET /api/notifications

returns:

[
{
id:1,
icon:"💧",
title:"Water Intake",
value:"Increase to 80L"
}
]

*/

const res=
await fetch(
"/api/notifications"
);

if(
!res.ok
)
throw Error();

const data=
await res.json();

setAlerts(
data
);

}

catch{

/* temporary fallback */

setAlerts([

{
id:1,
icon:"💧",
title:"Water Intake",
value:"Increase to 80L"
},

{
id:2,
icon:"🐄",
title:"Pregnancy",
value:"Month 5"
},

{
id:3,
icon:"🍽",
title:"Feed Reminder",
value:"Evening Meal"
},

{
id:4,
icon:"📈",
title:"Milk Quality",
value:"+6% Improvement"
}

]);

}

finally{

setLoading(
false
);

}

}

loadNotifications();

},[]);

return(

<section
className="
px-10
pb-32
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

Notifications

</h2>

<div
className="
max-w-6xl
mx-auto
space-y-6
"
>

{
loading
?

<div
className="
text-center
text-green-300
"
>

Loading...

</div>

:

alerts.map(
(
item,
index
)=>(

<motion.div

key={
item.id
}

initial={{
opacity:0,
x:-50
}}

whileInView={{
opacity:1,
x:0
}}

transition={{
delay:index*0.15
}}

whileHover={{
scale:1.02
}}

className="
bg-white/5
border
border-green-900
rounded-3xl
p-8
flex
justify-between
items-center
"

>

<div
className="
flex
gap-6
"
>

<div
className="
text-5xl
"
>

{
item.icon
}

</div>

<div>

<h3
className="
text-2xl
font-bold
"
>

{
item.title
}

</h3>

<p
className="
text-green-300
mt-2
"
>

{
item.value
}

</p>

</div>

</div>

<div>

🔔

</div>

</motion.div>

)

)

}

</div>

</section>

);

}