"use client";
import Link from "next/link";
import {
useEffect,
useState
} from "react";
type Customer = {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
};
export default function Customers(){
const [
customers,
setCustomers
]=
useState<Customer[]>([]);

const [
search,
setSearch
]=
useState("");

useEffect(() => {
  async function loadCustomers() {
    const res = await fetch("/api/admin/customers", {
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      setCustomers(data.customers);
    }
  }

  loadCustomers();
}, []);


async function removeCustomer(id: string) {

  const res = await fetch(`/api/admin/customers/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    alert("Delete failed");
    return;
  }

  setCustomers(prev =>
    prev.filter(c => c._id !== id)
  );

}
const filtered=

customers.filter(

(c:Customer)=>
(c.username || "")

.toLowerCase()

.includes(

search
.toLowerCase()

)

);


return(

<main
className="
min-h-screen
bg-black
text-white
p-10
"
>
<Link href="/admin">

<button
className="
mb-8
bg-gray-700
hover:bg-gray-600
duration-300
px-6
py-3
rounded-2xl
"

>

← Go to Admin Dashboard

</button>

</Link>

<h1
className="
text-5xl
font-black
mb-10
"
>
All Customers
</h1>
<div
className="
bg-green-900
p-8
rounded-3xl
mb-8
"
>
<p>
Total Customers
</p>
<h2
className="
text-6xl
mt-4
"
>
{customers.length}
</h2>
</div>
<input
value={search}
onChange={(e)=>
setSearch(
e.target.value
)
}
placeholder="Search customer"
className="
w-full
mb-10
p-5
bg-white/5
rounded-3xl
"
/>
<div
className="
space-y-6
"
>
{
filtered.map(
(user:Customer,index:number)=>(
<div
key={user._id}
className="
bg-white/5
p-8
rounded-3xl
flex
justify-between
"

>

<Link
href={`/admin/customer/${user._id}`}
className="flex-1"
>

<div>

<p>

#{index+1}

</p>

<h2>

<a
href={`/admin/customer/${user._id}`}
className="text-green-400 hover:underline"
>

{user.username}

</a>

</h2>

<p>

{user.email}

</p>

<p>

Joined:

{new Date(user.createdAt).toLocaleDateString()}

</p>

</div>

</Link>

<div className="flex gap-3">

<Link href={`/admin/customer/${user._id}`}>

<button
className="
bg-green-600
hover:bg-green-700
duration-300
px-6
py-3
rounded-2xl
"
>

View Profile

</button>

</Link>

<button

onClick={()=>
removeCustomer(user._id)
}

className="
bg-red-500
hover:bg-red-700
duration-300
px-6
py-3
rounded-2xl
"

>

Delete

</button>

</div>

</div>

)

)

}

</div>

</main>

);

}
