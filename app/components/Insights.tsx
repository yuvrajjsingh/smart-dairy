export default function Insights() {

return(

<section className="px-10 pb-32">

<h2
className="
text-center
text-5xl
font-bold
mb-16
"
>

Smart Insights

</h2>


<div
className="
max-w-6xl
mx-auto
grid
md:grid-cols-3
gap-8
"
>

<Card
title="Milk Quality"
value="Excellent"
/>

<Card
title="Animal Health"
value="Healthy"
/>

<Card
title="Payment Status"
value="Completed"
/>

</div>

</section>

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
hover:scale-105
transition
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
"
>

{value}

</h3>

</div>

);

}