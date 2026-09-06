"use client";

import Link from "next/link";

export default function Login(){

return(

<main
className="
relative
min-h-screen
overflow-hidden
text-white
"
>

{/* VIDEO */}

<video
autoPlay
muted
loop
playsInline
className="
absolute
inset-0
w-full
h-full
object-cover
"
>

<source
src="/videos/nature.mp4"
type="video/mp4"
/>

</video>


{/* OVERLAY */}

<div
className="
absolute
inset-0
bg-black/60
"
/>


{/* CONTENT */}

<div
className="
relative
z-10
min-h-screen
flex
items-center
justify-center
px-6
"
>

<div
className="
max-w-6xl
grid
md:grid-cols-2
gap-16
items-center
"
>

{/* LEFT */}

<div>

<h1
className="
text-6xl
font-black
"
>

🥛 Smart Dairy

</h1>

<p
className="
mt-8
text-xl
leading-9
text-green-100
"
>

Transforming dairy intelligence through AI.

Analyze milk quality,
monitor animal health,
estimate nutrition,
track productivity,
and enable transparent
digital transactions.

Built to support farmers,
collection centers and
modern dairy operations.

</p>

</div>


{/* RIGHT */}

<div
className="
bg-black/40
backdrop-blur-xl
rounded-[40px]
p-12
border
border-green-600
"
>

<h2
className="
text-4xl
font-bold
text-center
mb-10
"
>

Login

</h2>


<Link href="/admin/login">

<button
className="
w-full
bg-green-500
py-5
rounded-2xl
text-xl
mb-6
hover:scale-105
duration-300
"
>

Admin Login

</button>

</Link>


<Link href="/customer">

<button
className="
w-full
border
border-white
py-5
rounded-2xl
text-xl
hover:bg-white/10
duration-300
"
>

Customer Login

</button>

</Link>
<Link href="/customer/watchdemo">

<button
className="
w-full
mt-5

bg-white/5
backdrop-blur-xl

border
border-green-500

py-5
rounded-2xl

text-xl
font-semibold

hover:bg-green-950
hover:scale-105

duration-300
"
>

Watch Demo 

</button>

</Link>
</div>

</div>

</div>

</main>

);

}