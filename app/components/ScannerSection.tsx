"use client";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
export default function ScannerSection(){
    const router = useRouter();
const[
progress,
setProgress
]=useState(0);
const[
loading,
setLoading
]=useState(false);

const [currentResult, setCurrentResult] = useState({
  quality: "",
  payment: "",
  fat: "",
  protein: "",
});
const [selectedAnimal,setSelectedAnimal]=useState<any>(null);


const [scanData, setScanData] = useState({
  milk: 0,
  fat: 0,
  protein: 0,
  snf: 0,
  density: 0,
  lactose: 0,
  water: 0,
  quality: "",
});
useEffect(() => {

    async function loadScannerData() {

        try {

            const res = await fetch(
                "/api/customer/profile",
                {
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (res.ok) {

                setSelectedAnimal(data.selectedAnimal);

            }

        } catch (error) {

            console.error(error);

        }

    }

    loadScannerData();

}, []);

async function startScan(){
  if(!selectedAnimal){
    alert("Please select an animal first.");
    router.push("/customer/select-animal");
    return;
  }
if(loading)return;
setLoading(true);
let value=0;
const timer = setInterval(async () => {
  value+=10;
setProgress(value);
if (value >= 100) {

  clearInterval(timer);
  setLoading(false);
  setProgress(100);

  const res = await fetch("/api/customer/milk", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      animalId: selectedAnimal._id,
      litres: 10,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message);
    return;
  }

  const scan = data.scan;

 setScanData({
  milk: scan.milk,
  fat: scan.fat,
  protein: scan.protein,
  snf: scan.snf,
  density: scan.density,
  lactose: scan.lactose,
  water: scan.waterPercent,
  quality: scan.quality,
});

  setCurrentResult({
    quality: scan.quality,
    payment: `₹${scan.payment}`,
    fat: `${scan.fat}%`,
    protein: `${scan.protein}%`,
  });

  // Notify whole application that a new scan was completed
window.dispatchEvent(
    new Event("milkScanCompleted")
);
router.refresh();
}
},250);
}

function reset(){
    setProgress(0);
    setLoading(false);
   setScanData({
  milk: 0,
  fat: 0,
  protein: 0,
  snf: 0,
  density: 0,
  lactose: 0,
  water: 0,
  quality: "Average",
});
}
return(
<main
id="scanner"
className="
min-h-screen
bg-gradient-to-b
from-[#04150f]
via-[#07241a]
to-[#03110c]
text-white
pb-32
"
>
{/* TOP */}
<div
className="
flex
justify-center
pt-12
pb-6
"
>

<h1
className="
text-6xl
font-black
text-center
"
>

🥛 Your Scanner

</h1>

</div>
{/* HERO */}
<section
className="
max-w-7xl
mx-auto
mt-12
px-8
"
>
<div
className="
rounded-[40px]
bg-white/5
backdrop-blur-2xl
border
border-green-700
p-14
"
>
<div
className="
grid
lg:grid-cols-3
gap-10
items-center
"
>
<Info
icon="🎯"
title="Accurate"
desc="High precision results"
/>
<div
className="
flex
flex-col
items-center
"
>
<div
className="
w-[300px]
h-[300px]
rounded-full
border-[8px]
border-green-500
flex
items-center
justify-center
shadow-[0_0_80px_rgba(34,197,94,0.3)]
"
>
<div
className="
text-[150px]
"
>
🥛
</div>
</div>
<h2
className="
mt-10
text-3xl
"
>
Insert milk and start analysis
</h2>
<button
disabled={loading}
onClick={startScan}
className="
mt-10
bg-gradient-to-r
from-green-400
to-emerald-500
px-16
py-5
rounded-full
text-black
font-bold
hover:scale-105
duration-300
"
>
{
loading
?
`Scanning ${progress}%`
:
"Start Scan"
}
</button>
</div>
<Info
icon="⚡"
title="Smart AI"
desc="Instant milk analysis"
/>
</div>
</div>
</section>
{/* PROGRESS */}
<section
className="
max-w-7xl
mx-auto
px-8
mt-10
"
>
<div
className="
rounded-[40px]
bg-white/5
border
border-green-700
p-10
"
>
<h2
className="
text-center
text-green-300
text-2xl
"
>
{
loading
?
"Scanning..."
:
"Ready To Scan"
}
</h2>
<div
className="
mt-8
bg-black/40
rounded-full
h-6
overflow-hidden
"
>
<div
style={{
width:
`${progress}%`
}}
className="
h-full
bg-green-500
transition-all
duration-500
"
/>
</div>
<h2
className="
text-center
text-7xl
font-black
mt-8
"
>
{progress}%
</h2>
</div>
</section>
{/* RESULTS */}
{
progress===100
&&
<>
{/* RESULTS */}
<section
className="
max-w-7xl
mx-auto
px-8
mt-10
pb-24
"
>
<div
className="
grid
md:grid-cols-2
gap-8
"
>
<Result
title="Quality"
value={currentResult.quality}
/>
<Result
title="Payment"
value={currentResult.payment}
/>
<Result
title="Fat"
value={currentResult.fat}
/>
<Result
title="Protein"
value={currentResult.protein}
/>
<Result
title="SNF"
value={`${scanData.snf}%`}
/>

<Result
title="Milk"
value={`${scanData.milk} L`}
/>

<Result
title="Water"
value={`${scanData.water}%`}
/>

</div>
<div
className="
mt-10
rounded-3xl
bg-green-900/40
border
border-green-500
p-8
text-center
"
>

<h2 className="text-3xl font-bold">
✅ Scan Completed
</h2>

<p className="mt-4 text-xl">

₹{currentResult.payment.replace("₹","")}

has been credited to your Wallet.

</p>

<p className="mt-2 text-green-300">

You can withdraw this amount anytime from Wallet.

</p>

</div>
<button
onClick={reset}
className="
mt-10
w-full
bg-green-500
py-5
rounded-full
text-black
font-bold
"
>
Scan Again
</button>
</section>

</>
}
</main>
);

}
function Info({
icon,
title,
desc
}:any){

return(
<div
className="
bg-white/5
rounded-[30px]
p-8
border
border-green-700
"
>
<div className="text-6xl">
{icon}
</div>
<h2
className="
text-3xl
font-bold
mt-6
"
>
{title}
</h2>

<p
className="
mt-3
text-gray-400
"
>
{desc}
</p>
</div>
);
}
function Result({
title,
value
}:any){
return(
<div
className="
bg-white/5
rounded-[30px]
p-10
border
border-green-700
"
>
<p
className="
text-gray-400
"
>
{title}
</p>

<h2
className="
text-6xl
font-black
text-green-300
mt-4
"
>
{value}
</h2>
</div>
);
}