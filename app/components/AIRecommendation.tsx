"use client";

import {
useEffect,
useState
} from "react";

import { motion } from "framer-motion";

type Customer={
health?:string;

feed?:string;

water?:string;

supplements?:string;

growth?:string;

quality?:string;
};

export default function AIRecommendation(){

const [user,
setUser]=
useState<Customer|null>(
null
);
const [recommendation,
setRecommendation]=
useState({

feed:"Loading...",

water:"Loading...",

supplements:"Loading...",

growth:"Loading...",

health:"Loading..."

});
useEffect(()=>{

const stored=
localStorage.getItem(
"currentUser"
);

if(!stored)return;

const user=
JSON.parse(
stored
);

setRecommendation({

feed:
Number(
user.animalAge
)>5
?
"22 Kg/day"
:
"18 Kg/day",

water:
user.milk?.includes("3")
?
"90 L/day"
:
"75 L/day",

supplements:
"Calcium + Minerals",

growth:
"+12%",

health:
"Healthy"

});

},[]);
return(

<motion.section

initial={{
opacity:0,
y:60
}}

whileInView={{
opacity:1,
y:0
}}

transition={{
duration:0.8
}}

viewport={{
once:true
}}

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

AI Recommendations

</h2>

<div
className="
max-w-7xl
mx-auto
grid
md:grid-cols-2
lg:grid-cols-3
gap-8
"
>

<Card
icon="🥛"
title="Milk Quality"
value={
user?.quality
||
"Waiting..."
}
/>

<Card
icon="🐄"
title="Animal Condition"
value={
user?.health
||
"Waiting..."
}
/>

<Card
icon="🍽"
title="Feed"
value={
user?.feed
||
"Not Generated"
}
/>

<Card
icon="💧"
title="Water"
value={
user?.water
||
"Not Generated"
}
/>

<Card
icon="🧪"
title="Supplements"
value={
user?.supplements
||
"Not Generated"
}
/>

<Card
icon="📈"
title="Expected Milk Growth"
value={
user?.growth
||
"Not Generated"
}
/>

</div>

</motion.section>

);

}

function Card({
icon,
title,
value
}:{
icon:string
title:string
value:string
}){

return(

<div
className="
bg-white/5
rounded-3xl
p-8
border
border-green-900
hover:scale-105
duration-500
backdrop-blur-xl
"
>

<div
className="
text-5xl
"
>

{icon}

</div>

<h3
className="
mt-6
text-2xl
font-bold
"
>

{title}

</h3>

<p
className="
mt-4
text-green-300
text-xl
"
>

{value}

</p>

</div>

);

}