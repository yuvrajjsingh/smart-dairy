"use client";
import {
useEffect,
useState
} from "react";
import {
useRouter
} from "next/navigation";
export default function SelectAnimal(){
const router=
useRouter();
const[
animals,
setAnimals
]=
useState<any[]>([]);
useEffect(() => {

  async function loadAnimals() {
    try {
      const res = await fetch(
        "/api/customer/animal/list",
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        router.push("/customer");
        return;
      }
      setAnimals(data.animals);
    } catch (err) {
      console.error(err);
    }
  }
  loadAnimals();

}, [router]);
async function openAnimal(animal: any) {
  try {
    const res = await fetch(
      "/api/customer/select-animal",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          animalId: animal._id,
        }),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      alert(data.message);
      return;
    }
    router.push("/customer/dashboard");
  } catch (error) {
    console.error(error);
    alert("Failed to select animal.");
  }
}
return(
<main
className="
min-h-screen
bg-gradient-to-b
from-green-950
to-black
text-white
p-10
"
>
<div
className="
max-w-6xl
mx-auto
"
>
<div
className="
flex
justify-between
items-center
mb-16
"
>
<h1
className="
text-5xl
font-black
"
>
🐄 Select Animal
</h1>
<button
onClick={()=>
router.push(
"/customer/animal"
)
}
className="
px-8
py-4
rounded-2xl
bg-green-600
hover:scale-105
duration-300
"
>
＋ Add Animal
</button>
</div>
{
animals.length===0
?
<div
className="
text-center
mt-32
"
>
<h2
className="
text-4xl
font-bold
"
>
No Animals Found
</h2>
<p
className="
text-gray-400
mt-4
"
>
Register your first animal
</p>
<button
onClick={()=>
router.push(
"/customer/animal"
)
}
className="
mt-8
px-8
py-4
rounded-2xl
bg-green-500
"
>
Register Animal
</button>
</div>
:
<div
className="
grid
md:grid-cols-2
gap-8
"
>
{
animals.map(
(animal)=>(
<div
key={
animal.animalId
}
className="
bg-white/5
backdrop-blur-xl
rounded-[35px]
p-10
border
border-green-700
hover:scale-[1.02]
duration-500
"
>
<div className="text-6xl mb-6">
{
animal.animalType === "Cow"
? "🐄"
: animal.animalType === "Buffalo"
? "🐃"
: "🐐"
}
</div>
<h2
className="
text-3xl
font-bold
"
>
{
animal.animalName
}
</h2>
<p className="mt-4">
ID:
{
animal.animalId
}
</p>
<p>
Type:
{
animal.animalType
}
</p>
<p>
Age: {animal.age} Years
</p>
{
animal.pregnancyMonth > 0 && (
<p>
Pregnancy Month: {animal.pregnancyMonth}
</p>
)
}
<div
className="
flex
gap-4
mt-8
"
>

<button
onClick={() => openAnimal(animal)}
className="
flex-1
bg-green-500
py-4
rounded-2xl
font-bold
"
>
Open Dashboard
</button>

<button
onClick={async()=>{

const confirmDelete =
window.confirm(
"Delete this animal?"
);

if(!confirmDelete) return;

try{

const res =
await fetch(
`/api/customer/animal/delete?id=${animal._id}`,
{
method:"DELETE",
credentials:"include"
}
);

const data =
await res.json();

if(!res.ok){

alert(data.message);

return;

}

setAnimals(prev =>
prev.filter(a => a._id !== animal._id)
);

alert("Animal Deleted");

}

catch(error){

console.error(error);

alert("Something went wrong");

}

}}

className="
px-6
rounded-2xl
bg-red-500
"
>

🗑

</button>

</div>

</div>

)

)

}

</div>

}

</div>

</main>

);

}