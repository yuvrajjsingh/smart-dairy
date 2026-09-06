"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
type Customer={
username:string;
email:string;
animalName?:string;
animalType?:string;
animalAge?:string;
animalId?:string;
milk?:string;
quality?:string;
payment?:string;
month?:string;
health?:string;
feed?:string;
water?:string;
supplements?:string;
growth?:string;
createdAt?:string;
};
export default function AnimalProfile(){
const [animals,
setAnimals]=
useState<Customer[]>([]);
const [selected,
setSelected]=
useState<Customer|null>(
null
);
useEffect(()=>{

const customers=
JSON.parse(

localStorage.getItem(
"customers"
)
||
"[]"
) as Customer[];
const recent=
customers
.filter(
(c)=>
c.animalId
)
.reverse()
.slice(
0,
6
);
setAnimals(
recent
);
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
className="px-10 pb-32"
>
<h2
className="
text-center
text-5xl
font-bold
mb-16
"
>
Recent Animal Profiles
</h2>
<div
className="
grid
md:grid-cols-2
lg:grid-cols-3
gap-8
max-w-7xl
mx-auto
"
>
{
animals.length===0
?
(
<div
className="
col-span-full
text-center
text-gray-400
text-xl
"
>
No animals added yet
</div>
)
:
animals.map(
(animal,index)=>(
<div
key={
animal.animalId
||
index
}
onClick={()=>
setSelected(
animal
)
}
className="
bg-white/5
border
border-green-900
rounded-3xl
p-10
hover:scale-[1.03]
duration-500
cursor-pointer
"
>



<Item
label="Owner"
value={
animal.username
}
/>

<Item
label="Animal ID"
value={
animal.animalId
||
"Unknown"
}
/>

<Item
label="Breed"
value={
animal.animalType
||
"Unknown"
}
/>

<Item
label="Age"
value={
animal.animalAge
?
`${animal.animalAge} Years`
:
"Unknown"
}
/>

<Item
label="Pregnancy"
value={
animal.month
||
"Unknown"
}
/>

<Item
label="Health"
value={
animal.health
||
"Unknown"
}
/>

</div>

)

)

}

</div>
{

selected && (

<div
className="
fixed
inset-0
bg-black/70
backdrop-blur-xl
flex
items-center
justify-center
z-50
"
>

<div
className="
w-[800px]
bg-black
border
border-green-600
rounded-[40px]
p-12
relative
"
>

<button

onClick={()=>
setSelected(
null
)
}

className="
absolute
right-8
top-8
text-3xl
"

>

✕

</button>

<h2
className="
text-5xl
font-black
mb-10
"
>

🐄 AI Animal Analysis

</h2>

<div
className="
grid
grid-cols-2
gap-8
"
>

<Item
label="Owner"
value={selected.username}
/>

<Item
label="Animal ID"
value={
selected.animalId
||
"-"
}
/>

<Item
label="Breed"
value={
selected.animalType
||
"-"
}
/>

<Item
label="Health"
value={
selected.health
||
"-"
}
/>

<Item
label="Feed"
value={
selected.feed
||
"18 Kg/day"
}
/>

<Item
label="Water"
value={
selected.water
||
"80 L/day"
}
/>

<Item
label="Supplements"
value={
selected.supplements
||
"Calcium"
}
/>

<Item
label="Expected Growth"
value={
selected.growth
||
"+10%"
}
/>

</div>

<div
className="
mt-10
bg-green-900/20
rounded-3xl
p-8
"
>

<h3
className="
text-2xl
font-bold
mb-4
"
>

🤖 AI Recommendation

</h3>

<p
className="
text-gray-300
leading-8
"
>

Increase hydration,
maintain mineral intake,
continue current feed cycle,
monitor health weekly.

</p>

</div>

</div>

</div>

)

}
</motion.section>

);

}

function Item({
label,
value,
}:{
label:string
value:string
}){

return(

<div
className="
bg-black/20
rounded-2xl
p-6
"
>

<p className="text-gray-400">

{label}

</p>

<h3
className="
text-2xl
font-bold
mt-3
text-green-300
"
>

{value}

</h3>

</div>

);

}