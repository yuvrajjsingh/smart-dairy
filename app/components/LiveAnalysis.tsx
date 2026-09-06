"use client";

import {
useEffect,
useState
}
from "react";

import PaymentModel from "./PaymentModel";

type Customer = {
    animalName: string;
    animalId: string;
    animalType: string;

    milk: number;

    fat: number;

    protein: number;

    snf: number;

    density: number;

    lactose: number;

    waterPercent: number;

    quality: string;

    payment: number;

    createdAt: string;
};

function Metric({
name,
value
}:{
name:string;
value:string;
}){

return(

<div
className="
flex
justify-between
bg-black/20
p-5
rounded-xl
"
>

<span>
{name}
</span>

<span
className="
text-green-300
font-bold
"
>

{value}

</span>

</div>

);

}

export default function LiveAnalysis(){

const [user, setUser] = useState<Customer | null>(null);

const [loading, setLoading] = useState(true);
async function loadData() {

    try {

        setLoading(true);

        const res = await fetch(
            "/api/customer/latest-scan",
            {
                credentials: "include",
                cache: "no-store",
            }
        );

        const data = await res.json();

        if (res.ok) {

            setUser(data.scan);

        } else {

            setUser(null);

        }

    } catch (error) {

        console.error(error);

        setUser(null);

    } finally {

        setLoading(false);

    }

}
useEffect(() => {

    loadData();

    function refreshLatestScan() {

        loadData();

    }

    window.addEventListener(
        "milkScanCompleted",
        refreshLatestScan
    );

    return () => {

        window.removeEventListener(
            "milkScanCompleted",
            refreshLatestScan
        );

    };

}, []);
return(

<section
className="
px-10
pb-32
"
>

<h2
className="
text-center
text-5xl
font-bold
mb-20
"
>

Live Milk Analysis

</h2>

<div
className="
max-w-6xl
mx-auto
bg-white/5
rounded-3xl
p-10
border
border-green-900
"
>

{

loading

?

<div
className="
text-center
text-green-300
text-2xl
"
>

Loading Analysis...

</div>

:

<div
className="
grid
md:grid-cols-2
gap-10
"
>

<div>

<h3
className="
text-3xl
mb-8
"
>

Latest Scan

</h3>

<div
className="
space-y-5
"
>

<Metric
name="Animal"
value={
user?.animalName ?? "No Animal"
}
/>

<Metric
name="Animal ID"
value={
user?.animalId ?? "--"
}
/>

<Metric
name="Milk Produced"
value={`${user?.milk ?? 0} L`}
/>

<Metric
name="Quality"
value={user?.quality ?? "No Scan"}
/>

<Metric
    name="Fat"
    value={`${user?.fat ?? 0}%`}
/>

<Metric
    name="Protein"
    value={`${user?.protein ?? 0}%`}
/>

<Metric
    name="SNF"
    value={`${user?.snf ?? 0}%`}
/>

<Metric
    name="Water"
    value={`${user?.waterPercent ?? 0}%`}
/>

<Metric
    name="Scanned At"
    value={
        user
            ? new Date(user.createdAt).toLocaleString()
            : "--"
    }
/>

</div>

</div>

<div
className="
bg-green-950
rounded-3xl
p-8
"
>

<h3
className="
text-3xl
"
>

Payment Summary

</h3>

<div
className="
mt-10
"
>

<div
className="
flex
justify-between
"
>

<span>

Milk Income

</span>

<span>

{
`₹${user?.payment ?? 0}`
}

</span>

</div>

<div
className="
flex
justify-between
mt-4
"
>

<span>

Bonus

</span>

<span>

Auto Calculated

</span>

</div>

<div
className="
flex
justify-between
mt-8
"
>

<span
className="
font-bold
"
>

Total

</span>

<span
className="
font-bold
"
>

{
`₹${user?.payment ?? 0}`
}

</span>

</div>

</div>

{
user && (
<PaymentModel
    amount={`₹${user.payment}`}
    customer={user.animalId}
/>
)
}
</div>

</div>

}

</div>

</section>

);

}