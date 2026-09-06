"use client";
import {
useState,
useEffect
} from "react";
import VisionPage from "./vision/page";
import Navbar from "../components/Navbar";
import HowItWorks from "../components/HowItWorks";
import ScannerSection from "../components/ScannerSection";
import LiveAnalysis from "../components/LiveAnalysis";
import Insights from "../components/Insights";
import AnimalHealth from "../components/AnimalHealth";
import AnimalProfile from "../components/AnimalProfile";
import Notifications from "../components/Notifications";
import Footer from "../components/Footer";
export default function Home() {
  const [stats,setStats]=useState({

milk:0,

revenue:0,

health:0,

transactions:0

});

useEffect(()=>{

const customers=
JSON.parse(
localStorage.getItem(
"customers"
)
||
"[]"
);

const transactions=
JSON.parse(
localStorage.getItem(
"transactions"
)
||
"[]"
);

const milk=

customers.reduce(

(sum:any,c:any)=>

sum+

Number(

String(
c.milk||0
)

.replace(
"L",
""
)

),

0

);

const revenue=

transactions.reduce(

(sum:any,t:any)=>

sum+

Number(

String(
t.amount||0
)

.replace(
"₹",
""
)

),

0

);

const health=

customers.length

?

Math.round(

customers.reduce(

(sum:any,c:any)=>

sum+

Number(

String(
c.quality||0
)

.replace(
"%",""
)

),

0

)

/

customers.length

)

:

0;

setStats({

milk,

revenue,

health,

transactions:
transactions.length

});

},[]);
  return (
    <main
className="
min-h-screen
bg-gradient-to-b
from-green-950
via-black
to-black
text-white
relative
"
>

{/* BACKGROUND EFFECTS */}

<div
className="
absolute
top-40
left-20
w-96
h-96
bg-green-500/10
rounded-full
blur-[150px]
"
/>

<div
className="
absolute
top-[800px]
right-20
w-96
h-96
bg-green-400/10
rounded-full
blur-[150px]
"
/>

<div
className="
absolute
bottom-40
left-[30%]
w-[500px]
h-[500px]
bg-green-700/10
rounded-full
blur-[180px]
"
/>


{/* CURSOR GLOW */}

<div
className="
fixed
top-[20%]
left-[20%]
w-[600px]
h-[600px]
bg-green-500/5
rounded-full
blur-[220px]
pointer-events-none
animate-pulse
"
/>

<Navbar />

<div className="pt-20">

<VisionPage />

</div>

<HowItWorks />

<ScannerSection />

<LiveAnalysis />

<Insights />

<AnimalHealth />

<AnimalProfile />

<Notifications />

<section
className="
px-10
pt-32
pb-32
"
>
  <h2
className="
text-center
text-5xl
font-extrabold
mb-16
"
>
Dashboard Preview
</h2>

<div
className="
max-w-6xl
mx-auto
grid
md:grid-cols-2
lg:grid-cols-4
gap-8
"
>

<Card
title="Milk Today"
value={`${stats.milk} L`}
/>

<Card
title="Revenue"
value={`₹${stats.revenue}`}
/>

<Card
title="Health Score"
value={`${stats.health}%`}
/>

<Card
title="Transactions"
value={`${stats.transactions}`}
/>

</div>

</section>



<Footer />

</main>
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
bg-linear-to-br
from-green-950
to-black
rounded-3xl
p-8
border
border-green-900
hover:scale-105
duration-300
"
>

<p
className="
text-gray-400
"
>

{title}

</p>

<h3
className="
text-4xl
font-bold
mt-6
"
>

{value}

</h3>

</div>

);

}