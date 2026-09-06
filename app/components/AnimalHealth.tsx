"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
type Customer={
animalId?:string
animalAge?:string
month?:string
water?:string
feed?:string
supplements?:string
growth?:string
health?:string
animalName?:string
animalType?:string
username?:string
};
export default function AnimalHealth(){
const[
animals,
setAnimals
]=useState<Customer[]>([]);
const[
animal,
setAnimal
]=useState<Customer | null>(null);
useEffect(() => {
  const customers: Customer[] = JSON.parse(
    localStorage.getItem("customers") || "[]"
  );

  setAnimals(customers);

  if (customers.length > 0) {
    setAnimal(customers[0]);
  }
}, []);
return(
<motion.section
id="health"
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
className="px-10 pb-32">
<h2
className="
text-center
text-5xl
font-bold
mb-16
"
>
Animal Health AI
</h2>
<div
className="
max-w-7xl
mx-auto
mb-14
overflow-x-auto
"
>
<div
className="
flex
gap-4
pb-2
"
>
{
animals.map(
(item,index)=>(
<button
key={index}
onClick={()=>
setAnimal(
item
)
}
className={`
px-8
py-4
rounded-full
border
duration-300
${
animal?.animalId
===
item.animalId
?
"bg-green-500 text-black"
:
"bg-white/5 border-green-700"
}
`}
>
🐄
{
item.animalId
||
`ID ${index+1}`
}
—
{
item.username
||
item.animalName
}
</button>
))
}
</div>
</div>
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
title="Estimated Age"
value={
animal?.animalAge
?
`${animal.animalAge} Years`
:
"--"
}
/>
<Card
title="Pregnancy Month"
value={
animal?.month
||
"--"
}
/>
<Card
title="Daily Water"
value={
animal?.water
||
"--"
}
/>
<Card
title="Feed Intake"
value={
animal?.feed
||
"--"
}
/>
<Card
title="Supplements"
value={
animal?.supplements
||
"--"
}
/>
<Card
title="Milk Boost Plan"
value={
animal?.growth
||
"--"
}
/>
</div>
<div
className="
max-w-6xl
mx-auto
mt-12
bg-white/5
rounded-3xl
p-10
border
border-green-900
"
>
<h3
className="
text-3xl
font-bold
mb-8
"
>
AI Diet Recommendation

</h3>
<div className="space-y-5">
<Item
label="Morning"
value={
animal?.feed
||
"No recommendation"
}
/>
<Item
label="Afternoon"
value={
animal?.supplements
||
"No recommendation"
}
/>
<Item
label="Evening"
value={
animal?.water
||
"No recommendation"
}
/>
</div>
</div>
</motion.section>
);
}
function Card({
title,
value,
}:{
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
"
>
<p className="text-gray-400">
{title}
</p>
<h3
className="
text-3xl
font-bold
mt-5
text-green-300
"
>
{value}
</h3>
</div>
);
}
function Item({
label,
value
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
<h4
className="
text-xl
font-bold
"
>
{label}
</h4>
<p className="mt-3">
{value}
</p>
</div>
);
}