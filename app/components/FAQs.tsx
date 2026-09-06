"use client";

import { motion } from "framer-motion";
export default function FAQs({
language
}:{
language:string
}){
    const faq={

English:[

{
q:"How is milk analyzed?",
a:"The system evaluates fat, protein, water and quality metrics."
},

{
q:"How is payment calculated?",
a:"Milk quality and composition determine pricing."
},

{
q:"How are diet recommendations generated?",
a:"Animal condition and milk metrics are combined to generate plans."
},

{
q:"Can farmers track previous records?",
a:"Yes, dashboard history stores previous scans and analysis."
}

],

"हिन्दी":[

{
q:"दूध का विश्लेषण कैसे किया जाता है?",
a:"सिस्टम वसा, प्रोटीन, पानी और गुणवत्ता मापता है।"
},

{
q:"भुगतान कैसे निर्धारित होता है?",
a:"दूध की गुणवत्ता और संरचना के अनुसार भुगतान तय होता है।"
},

{
q:"आहार सुझाव कैसे बनते हैं?",
a:"पशु स्वास्थ्य और दूध डेटा के आधार पर सुझाव बनते हैं।"
},

{
q:"क्या पुराने रिकॉर्ड देख सकते हैं?",
a:"हाँ, डैशबोर्ड पिछले स्कैन और विश्लेषण दिखाता है।"
}

]

};

<div className="max-w-6xl mx-auto space-y-8">

{

faq[
language as keyof typeof faq
]
.map(

(item,index)=>(

<div

key={index}

className="
bg-white/5
border
border-green-900
rounded-3xl
p-8
"

>

<h3
className="
text-3xl
font-bold
"
>

{item.q}

</h3>

<p
className="
mt-6
text-gray-300
"
>

{item.a}

</p>

</div>

)

)

}

</div>

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
}} id="faq" className="px-10 pb-32">

<h2
className="
text-center
text-5xl
font-bold
mb-16
"
>

{
language==="English"
?
"Frequently Asked Questions"
:
"अक्सर पूछे जाने वाले प्रश्न"
}
</h2>


<div
className="
max-w-5xl
mx-auto
space-y-6
"
>

{
faq[
language as keyof typeof faq
].map(
(
item:{
q:string
a:string
},
index:number
)=>(

<div
key={index}

className="
bg-white/5
border
border-green-900
rounded-3xl
p-8
"
>

<h3
className="
text-2xl
font-bold
"
>

{item.q}

</h3>

<p
className="
mt-4
text-gray-300
"
>

{item.a}

</p>

</div>

))}

</div>

</motion.section>

);

}