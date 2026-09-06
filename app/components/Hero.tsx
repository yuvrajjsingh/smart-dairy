   "use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (

    <motion.section id="hero"
    
initial={{
opacity:0,
scale:0.98
}}

animate={{
opacity:1,
scale:1
}}

transition={{
duration:1
}}
      className="
      flex
      flex-col
      items-center
      justify-center
      text-center
      mt-24
      px-6
      "
    >

      <div
className="
relative

w-full
max-w-[980px]

mx-auto

rounded-[40px]

px-12
py-16

bg-gradient-to-br
from-[#07110d]
via-black
to-[#0c1410]

border-2
border-emerald-400/80

shadow-[0_0_0_1px_rgba(34,197,94,0.15),0_30px_100px_rgba(0,0,0,0.75)]

backdrop-blur-xl

overflow-hidden
"
>
        <div className="mb-6">
          <span
            className="
            px-5
            py-2
             from-green-950/90
             via-black
             to-black
             bg-white/5
            "
          >
            AI Powered Dairy Intelligence
          </span>

        </div>


        <h1 className="text-5xl
         md:text-6xl font-bold leading-tight">

          Analyze Milk.

          <br />

          Instant Payment.

        </h1>


        <p
          className="
          mt-8
          text-green-100
          text-lg
          md:text-xl
          max-w-3xl
          mx-auto
          "
        >

          Detect milk quality,
          estimate pricing,
          monitor animal health
          and provide instant
          digital transactions.

        </p>


        <div
          className="
          flex
          justify-center
          gap-6
          mt-10
          "
        >

          <div
className="
mt-14
flex
justify-center
"
>

<button
className="
group
relative
overflow-hidden
px-12
py-5
rounded-full
bg-linear-to-r
from-emerald-500
via-green-500
to-emerald-600
text-white
font-semibold
text-xl
shadow-[0_20px_60px_rgba(34,197,94,0.35)]
hover:scale-105
hover:-translate-y-1
duration-500
"

>

<span
className="
relative
z-10
flex
items-center
gap-3
"

>

▶
Watch Demo

</span>

<div
className="
absolute
inset-0
opacity-0
group-hover:opacity-100
bg-white/10
duration-500
"
/>

</button>

</div>


        </div>


        <div
          className="
          flex
          justify-center
          gap-12
          mt-14
          "
        >

          <div>

            <h2 className="text-4xl font-bold">
              2s
            </h2>

            <p className="text-gray-400">
              Scan Time
            </p>

          </div>


          <div>

            <h2 className="text-4xl font-bold">
              99%
            </h2>

            <p className="text-gray-400">
              Accuracy
            </p>

          </div>


          <div>

            <h2 className="text-4xl font-bold">
              ₹ Instant
            </h2>

            <p className="text-gray-400">
              Payment
            </p>

          </div>

        </div>

      </div>

    </motion.section>

  );
} 