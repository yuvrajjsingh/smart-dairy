"use client";
import Link from "next/link";
import {
useEffect,
useState
} from "react";

import Reports from "./components/Reports";
import MilkScanAnalytics from "./components/MilkScanAnalytics";
import MonthlyEarnings from "./components/MonthlyEarnings";
import Transactions from "./components/Transactions";
import DailyCollectionChart from "./components/DailyCollectionChart";
import MilkCollection from "./components/MilkCollection";
import MilkCollectionForm from "./components/MilkCollectionForm";
type Customer = {
_id:string;
username:string;
email?:string;
animalId?:string;
animalName?:string;
animalType?:string;
animalAge?:string;
payment?:string;
milk?:string;
quality?:string;
health?:string;
feed?:string;
water?:string;
supplements?:string;
growth?:string;
month?:string;
lastLogin?:string;
lastScan?:string;
history?:number[];
};
export default function Admin(){
const [customers, setCustomers] = useState<Customer[]>([]);
const [activity, setActivity] = useState<any[]>([]);
const [stats, setStats] = useState({
  totalCustomers: 0,
  totalAnimals: 0,
  totalScans: 0,
  totalWalletBalance: 0,
  todayMilk: 0,
  todayEarnings: 0,
  pendingWithdrawals: 0,
  completedWithdrawals: 0,
});
useEffect(() => {
  async function loadData() {
    try {
      const dashboardRes = await fetch(
  "/api/admin/dashboard",
  {
    credentials: "include",
  }
);
const dashboardData = await dashboardRes.json();
if (dashboardRes.ok) {
  setStats(dashboardData.stats);
}
      const customersRes = await fetch(
        "/api/admin/customers",
        {
          credentials: "include",
        }
      );
      const customersData = await customersRes.json();
      if (customersRes.ok) {
        setCustomers(customersData.customers);
      }
      const activityRes = await fetch(
  "/api/admin/activity",
  {
    credentials: "include",
  }
);

const activityData = await activityRes.json();
if (activityRes.ok) {
  setActivity(activityData.activity);
}
    } catch (err) {
      console.error(err);
    }
  }
  loadData();
}, []);
return(
<main
className="
min-h-screen
bg-linear-to-b
from-green-950
to-black
text-white
p-10
"
>

<h1
className="
text-6xl
font-black
"
>

🥛 Smart Dairy Admin

</h1>


<p
className="
mt-6
text-gray-300
"
>

Manage farmers,
milk collection,
payments,
animal insights
and analytics.
</p>
<div
className="
grid
md:grid-cols-5
gap-8
mt-12
"
>
<StatCard
title="Customers"
value={stats.totalCustomers}/>
<StatCard
title="Animals"
value={stats.totalAnimals}/>
<StatCard
title="Revenue"
value={`₹${stats.todayEarnings.toLocaleString()}`}/>
<StatCard
title="Transactions"
value={stats.totalScans}/>
<StatCard
title="Milk Collected"
value={`${stats.todayMilk} L`}/>
<StatCard
title="Wallet Balance"
value={`₹${stats.totalWalletBalance.toLocaleString()}`}
/>
<StatCard
title="Pending Withdrawals"
value={stats.pendingWithdrawals}
/>
<StatCard
title="Completed Withdrawals"
value={stats.completedWithdrawals}
/>
</div>
<div
className="
mt-16
bg-white/5
rounded-3xl
p-8
"
>
<h2
className="
text-3xl
font-bold
mb-8
"
>
Recent Customers
</h2>

<div
className="
space-y-5
"
>

{

customers
.slice(-5)
.reverse()
.map(

(
user: Customer,
index: number
)=>(

<div
key={
user._id ||
user.email ||
index
}
className="
flex
justify-between
bg-black/30
p-5
rounded-2xl
"

>

<div>

<p>
#{index+1}
</p>

<h3>
{user.username}
</h3>

<p>
{user.animalId
||
"No Animal"}
</p>

</div>

<div>

₹{
user.payment
||
0
}

</div>

</div>

)

)

}

</div>

</div>
<MilkCollection/>
<MilkCollectionForm/>

<div
className="
mt-16
bg-white/5
rounded-3xl
p-10
"
>


<h2
className="
text-3xl
font-bold
"
>

Recent Activity

</h2>


<div className="space-y-5 mt-8">

{
activity.map((item: any) => (

<Activity
key={item.createdAt + item.text}
text={item.text}

/>

))
}

</div>

</div>

  

<div
className="
mt-20
bg-white/5
rounded-3xl
p-10
"
>

<h2
className="
text-3xl
font-bold
mb-8
"
>

⚡ Quick Actions

</h2>

<div
className="
flex
flex-wrap
justify-center
gap-6
"
>
  <Reports />

  <MilkScanAnalytics />

  <MonthlyEarnings />

  <Transactions />

  <DailyCollectionChart/>

</div>

</div>
<div
className="
mt-12
flex
gap-6
justify-center
"
>
<Link href="/admin/customer">

<button
className="
group
relative
overflow-hidden
px-10
py-5
rounded-3xl
bg-gradient-to-r
from-emerald-500
to-green-600
shadow-[0_15px_40px_rgba(34,197,94,0.35)]
hover:scale-105
hover:-translate-y-1
duration-500
font-semibold
text-lg
min-w-[260px]
"

>

<span
className="
relative
z-10
flex
items-center
justify-center
gap-3
"

>

👥
Manage Customers

</span>

</button>

</Link>

<Link href="/main">

<button
className="
group
relative
overflow-hidden
px-10
py-5
rounded-3xl
bg-white/5
backdrop-blur-xl
border
border-white/10
hover:bg-white/10
hover:border-green-500
hover:scale-105
hover:-translate-y-1
duration-500
font-semibold
text-lg
min-w-[300px]
"

>

<span
className="
flex
items-center
justify-center
gap-3
"

>

🚀
Open Main Application

</span>

</button>
</Link>
<Link href="/admin/withdrawals">
<button
className="
px-10
py-5
rounded-3xl
bg-red-600
font-bold
hover:scale-105
duration-300
">
💸 Withdrawal Requests
</button>
</Link>
</div>
</main>
);
}
function StatCard({
title,
value
}:{
title:string
value:string|number
}){

return(

<div
className="
bg-gradient-to-br
from-green-900
to-black
rounded-[32px]
p-8
border
border-green-700
hover:scale-[1.03]
duration-500
"
>

<p
className="
text-gray-300
"
>
{title}
</p>

<h2
className="
text-6xl
font-black
mt-4
"
>
{value}
</h2>

</div>

);

}

function Box({
title,
value
}:{
title:string
value:string
}){

return(

<div
className="
bg-white/5
rounded-3xl
p-8
"
>

<p className="text-gray-400">

{title}

</p>

<h2
className="
text-5xl
mt-5
"
>

{value}

</h2>

</div>

);

}



function Activity({
text
}:{
text:string
}){

return(

<div
className="
bg-black/30
rounded-2xl
p-5
"
>

{text}

</div>

);

}