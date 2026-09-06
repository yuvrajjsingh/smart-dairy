"use client";

import {
useEffect,
useState
} from "react";

import {
motion
} from "framer-motion";

type Record={
date:string
milk:string
customer?:string
};

export default function MilkHistory(){

const[
mode,
setMode
]=useState<
"weekly"
|
"monthly"
>(
"weekly"
);

const[
data,
setData
]=useState<
{
label:string
value:number
}[]
>([]);

useEffect(() => {

  async function loadChart() {

    const res = await fetch(
      `/api/admin/milk-history?mode=${mode}`,
      {
        credentials: "include",
      }
    );

    const json = await res.json();

    if (res.ok) {

      setData(json.chart);

    }

  }

  loadChart();

}, [mode]);

return(

<section
id="milk-collection"
className="
px-10
pb-32
scroll-mt-32
"
>
<div
className="
flex
justify-between
items-center
max-w-7xl
mx-auto
mb-16
"
>

<h2
className="
text-5xl
font-black
"
>

Milk Collection

</h2>

<div
className="
flex
gap-4
"
>

<button

onClick={()=>
setMode(
"weekly"
)
}

className={`
px-8
py-4
rounded-full
duration-300

${
mode==="weekly"

?

"bg-green-500 text-black"

:

"bg-white/5"

}
`}

>

Weekly

</button>

<button

onClick={()=>
setMode(
"monthly"
)
}

className={`
px-8
py-4
rounded-full
duration-300

${
mode==="monthly"

?

"bg-green-500 text-black"

:

"bg-white/5"

}
`}

>

Monthly

</button>

</div>

</div>


<div
className="
max-w-7xl
mx-auto

bg-white/5

rounded-[40px]

p-12

border

border-green-800
"
>

<div
className="
grid

grid-cols-7

gap-8

items-end

h-[420px]
"
>

{

data.map(
(
item,
index
)=>{

const height=
Math.max(
item.value*
8,
25
);

return(

<div

key={
item.label
}

className="
flex
flex-col
items-center
justify-end
"

>

<motion.div

initial={{
height:0
}}

animate={{
height
}}

transition={{
duration:0.7,
delay:index*0.08
}}

whileHover={{
scale:1.05
}}

style={{
height:
`${height}px`
}}

className="
w-full

rounded-t-[30px]

bg-gradient-to-t

from-green-950

via-green-500

to-green-300

shadow-[0_0_40px_rgba(34,197,94,.4)]
"

/>

<p
className="
mt-6
"
>

{
item.label
}

</p>

<p
className="
text-green-300
font-bold
"
>

{
item.value
}L

</p>

</div>

);

}

)

}

</div>

</div>

</section>

);

}