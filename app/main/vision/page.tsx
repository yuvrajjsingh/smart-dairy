"use client";

import { useRouter } from "next/navigation";

export default function VisionPage(){

const router=useRouter();

return(

<main
className="
min-h-screen
bg-gradient-to-b
from-[#03170f]
via-[#041d14]
to-[#020b08]
text-white
relative
"
>

{/* soft green glow */}

<div
className="
absolute
pointer-events-none
top-[-200px]
left-1/2
-translate-x-1/2
w-[1100px]
h-[900px]
bg-emerald-500/15
blur-[220px]
rounded-full
"
/>

{/* secondary glow */}

<div
className="
absolute
pointer-events-none
bottom-0
right-0
w-[700px]
h-[700px]
bg-green-400/10
blur-[180px]
rounded-full
"
/>
<section
className="
flex
items-center
justify-center
min-h-[80vh]
px-8
"
>

<div
className="
max-w-5xl
w-full
rounded-[50px]
bg-white/5
backdrop-blur-3xl
border
border-green-700
p-20
text-center
"
>

<div
className="
inline-block
px-8
py-3
rounded-full
bg-green-500/10
text-green-300
mb-10
"
>

SMART DAIRY • FUTURE

</div>


<h1
className="
text-7xl
font-black
leading-tight
"
>

“Every Drop Of Milk
<br/>
Tells A Story.”

</h1>


<p
className="
mt-10
text-2xl
text-gray-300
leading-relaxed
"
>

AI transforms raw dairy data into
powerful insights.

Track quality.

Understand health.

Receive payments instantly.

Build a smarter farm.

</p>


<div
className="
mt-20
grid
md:grid-cols-3
gap-8
"
>

<Card
emoji="🥛"
title="Milk Intelligence"
/>

<Card
emoji="🧠"
title="AI Decisions"
/>

<Card
emoji="💸"
title="Smart Payments"
/>

</div>


<div
className="
mt-20
text-green-400
text-xl
italic
"
>

The future of dairy starts with data.

</div>

</div>

</section>

</main>

);

}


function Card({
emoji,
title
}:any){

return(

<div
className="
bg-black/40
rounded-[35px]
border
border-green-800
p-10
hover:scale-105
duration-500
"
>

<div
className="
text-6xl
mb-6
"
>

{emoji}

</div>

<h2
className="
text-2xl
font-bold
"
>

{title}

</h2>

</div>

);

}