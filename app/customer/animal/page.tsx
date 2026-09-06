"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Animal(){

const router=
useRouter();

const [animalName,setAnimalName]=
useState("");

const [animalType,setAnimalType]=
useState("");
const [isPregnant, setIsPregnant] = useState(false);
const [age,setAge]=
useState("");

const [month,setMonth]=
useState("");
async function saveAnimal() {


/* VALIDATE INPUTS */

if(
!animalName.trim() ||
!animalType.trim() ||
!age.trim()
){
alert("Please fill all details");
return;
}

if(isPregnant && !month.trim()){
alert("Select pregnancy month");
return;
}

try {

  const res = await fetch("/api/customer/animal", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
body: JSON.stringify({
  animalName,
  animalType,
  age: Number(age),
  pregnancyMonth: isPregnant
    ? Number(month)
    : 0,
}),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message);
    return;
  }

  alert("Animal Added Successfully ✅");
router.replace("/customer/select-animal");
router.refresh();
} catch (error) {

  console.error(error);

  alert("Something went wrong.");

}
}
return(
<main
className="
min-h-screen
bg-black
text-white
flex
justify-center
items-center
p-10
"
>

<div
className="
w-full
max-w-2xl
bg-white/5
rounded-[40px]
p-12
backdrop-blur-xl
border
border-green-700
"
>

<h1
className="
text-5xl
font-black
mb-10
text-center
"
>

🐄 Add Animal

</h1>

<input
placeholder="Animal Name"
value={animalName}
onChange={(e)=>
setAnimalName(
e.target.value
)}
className="
w-full
p-5
mb-5
bg-black
rounded-2xl
"
/>

<select
value={animalType}
onChange={(e) => setAnimalType(e.target.value)}
className="
w-full
p-5
mb-5
bg-black
rounded-2xl
text-white
"
>
  <option value="">Select Animal Type</option>

  <option value="Cow">🐄 Cow</option>

  <option value="Buffalo">🐃 Buffalo</option>

  <option value="Goat">🐐 Goat</option>
</select>
<select
value={age}
onChange={(e)=>setAge(e.target.value)}
className="
w-full
p-5
mb-5
bg-black
rounded-2xl
text-white
"
>

<option value="">Select Animal Age</option>

{Array.from({ length: 21 }, (_, i) => (
<option key={i} value={i}>
{i} Year{i !== 1 ? "s" : ""}
</option>
))}

</select>
<p className="mb-3 font-semibold">
Is the animal pregnant?
</p>

<div className="flex gap-6 mb-6">

<label className="flex items-center gap-2">

<input
type="radio"
checked={isPregnant}
onChange={() => setIsPregnant(true)}
/>

Yes

</label>

<label className="flex items-center gap-2">

<input
type="radio"
checked={!isPregnant}
onChange={() => {
setIsPregnant(false);
setMonth("");
}}
/>

No

</label>

</div>

{isPregnant && (
<select
value={month}
onChange={(e)=>setMonth(e.target.value)}
className="
w-full
p-5
mb-10
bg-black
rounded-2xl
text-white
"
>

<option value="">Pregnancy Month</option>


{Array.from({ length: 9 }, (_, i) => (

<option
key={i+1}
value={i+1}
>

Month {i+1}

</option>

))}

</select>
)}

<div className="space-y-4">

<button
onClick={saveAnimal}
disabled={
  !animalName ||
  !animalType ||
  !age ||
  (isPregnant && !month)
}
className="
w-full
py-5
rounded-3xl
bg-gradient-to-r
from-green-500
to-emerald-700
text-xl
font-bold
disabled:opacity-50
disabled:cursor-not-allowed
"
>

Save Animal

</button>


<button
onClick={()=>
router.back()
}
className="
w-full
py-4
rounded-3xl
border
border-gray-600
hover:bg-white/5
duration-300
"
>

← Go Back

</button>


<button
onClick={()=>
router.push(
"/customer/select-animal"
)
}
className="
w-full
py-4
rounded-3xl
bg-black
border
border-green-700
hover:bg-green-950
duration-300
"
>

Select Animal →

</button>

</div>

</div>

</main>

);

} 