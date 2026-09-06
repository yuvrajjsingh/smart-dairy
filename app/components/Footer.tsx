export default function Footer(){
return(
<footer
className="
relative
overflow-hidden
mt-24
border-t
border-green-900/30
bg-gradient-to-b
from-[#060606]
via-[#050807]
to-black
px-10
pt-20
pb-10
"
>
<div
className="
max-w-7xl
mx-auto
grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-4
gap-14
items-start
"
>
<div>
<h2
className="
text-4xl
font-black
"
>
🥛 Smart Dairy
</h2>
<p
className="
mt-6
text-zinc-400
leading-8
max-w-[320px]
"
>
AI-powered dairy intelligence
for milk analysis,
animal monitoring,
payments and farm growth.
</p>
<div
className="
mt-10
grid
grid-cols-3
gap-5
"
>
<MiniStat value="24/7" label="Monitoring"/>
<MiniStat value="99%" label="Accuracy"/>
<MiniStat value="<2s" label="Scan"/>
</div>
<div
className="
flex
flex-wrap
gap-3
mt-8
"
>
<Badge text="● System Online"/>
<Badge text="⚡ Live Analytics"/>
<Badge text="🛡 Secure Payments"/>
</div>
</div>
<div>
<h3 className="text-lg font-bold mb-6">
Platform
</h3>
<div className="space-y-4 text-zinc-400">
<p className="hover:text-green-300 hover:translate-x-1 duration-300 cursor-pointer">
Dashboard
</p>
<p className="hover:text-green-300 hover:translate-x-1 duration-300 cursor-pointer">
Milk Scanner
</p>
<p className="hover:text-green-300 hover:translate-x-1 duration-300 cursor-pointer">
Animal Health AI
</p>
<p className="hover:text-green-300 hover:translate-x-1 duration-300 cursor-pointer">
Live Analytics
</p>
</div>
</div>
<div>
<h3 className="text-lg font-bold mb-6">
Company
</h3>
<div className="space-y-4 text-zinc-400">
<p className="hover:text-green-300 hover:translate-x-1 duration-300 cursor-pointer">
About
</p>
<p className="hover:text-green-300 hover:translate-x-1 duration-300 cursor-pointer">
Careers
</p>
<p className="hover:text-green-300 hover:translate-x-1 duration-300 cursor-pointer">
Privacy
</p>
<p className="hover:text-green-300 hover:translate-x-1 duration-300 cursor-pointer">
Terms
</p>
</div>
</div>
<div>
<h3 className="text-lg font-bold mb-6">
Resources
</h3>
<div className="space-y-4 text-zinc-400">
<p className="hover:text-green-300 hover:translate-x-1 duration-300 cursor-pointer">
Documentation
</p>
<p className="hover:text-green-300 hover:translate-x-1 duration-300 cursor-pointer">
Help Center
</p>
<p className="hover:text-green-300 hover:translate-x-1 duration-300 cursor-pointer">
Support
</p>
<p className="hover:text-green-300 hover:translate-x-1 duration-300 cursor-pointer">
API Access
</p>
</div>
</div>
</div>
<div
className="
max-w-7xl
mx-auto
mt-16
"
>
<div
className="
flex
items-center
gap-3
text-green-400
text-sm
"
>
<div
className="
w-2
h-2
rounded-full
bg-green-500
animate-pulse
"
/>
Platform operational
</div>
<div
className="
mt-8
pt-8
border-t
border-white/5
flex
justify-between
items-center
flex-wrap
gap-6
"
>
<p className="text-zinc-500">
© 2026 Smart Dairy
</p>

<div
className="
flex
gap-6
text-zinc-500
"
>
<p>
Built for Modern Dairy Farms
</p>
<p>
v1.3 • Summer Release
</p>
</div>
</div>
</div>
</footer>
);
}
function Badge({
text
}:{
text:string
}){
return(
<div
className="
px-4
py-2
rounded-full
bg-white/5
border
border-green-900/40
text-zinc-300
text-sm
backdrop-blur
"
>
{text}
</div>
);
}
function MiniStat({
value,
label
}:{
value:string
label:string
}){
return(
<div>
<h3
className="
text-2xl
font-black
text-green-300
"
>
{value}
</h3>
<p
className="
text-zinc-500
text-sm
"
>
{label}
</p>
</div>
);
}