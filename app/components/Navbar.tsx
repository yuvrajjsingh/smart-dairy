"use client";

import {
useEffect,
useState
}
from "react";
export default function Navbar() {
    const [active,
setActive]=
useState("");
useEffect(()=>{

const handle=()=>{

const sections=[

"features",

"health",

"milk-collection",
"transactions"

];

sections.forEach(
(id)=>{

const el=
document
.getElementById(id);

if(
el
){

const top=
el.offsetTop-180;

const bottom=
top+
el.offsetHeight;

if(
window.scrollY>=top
&&
window.scrollY<bottom
){

setActive(id);

}

}

}

);

};

window.addEventListener(
"scroll",
handle
);

return()=>{

window.removeEventListener(
"scroll",
handle
);

};

},[]);
  return (

<nav
className="
fixed
top-0
left-0
right-0
z-50
backdrop-blur-xl
bg-black/60
border-b
border-green-900/30
flex
justify-between
items-center
px-10
py-6
"
>
<h1 className="text-2xl font-bold">
🥛 Smart Dairy
</h1>
<div
className="
hidden
md:flex
gap-8
"
>
<a
href="#features"

className={

active==="features"

?

"text-green-400"

:

""

}

>
Features
</a>

<a
href="#health"

className={

active==="health"

?

"text-green-400"

:

""

}
>
Health
</a>
<a
href="#scanner"

className={`
transition
duration-300

${
active==="scanner"

?

"text-green-400"

:

"hover:text-green-300"

}
`}
>

scanner
</a>




<a href="/login">

<button
className="
border
border-white
px-6
py-3
rounded-xl
hover:bg-white/10
"
>

Logout

</button>

</a>
</div>
</nav>

);
}