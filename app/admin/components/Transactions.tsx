"use client";

import {
useEffect,
useState
} from "react";

type Transaction = {

  _id: string;

  customerId: {
    username: string;
    email: string;
  };

  animalId?: {
  animalId: string;
  animalName: string;
  animalType: string;
};

  type: "Credit" | "Debit";

  amount: number;

reason:
| "Milk Scan"
| "Wallet Withdrawal";

status:
| "Pending"
| "Completed"
| "Rejected";

  createdAt: string;

};

export default function AdminTransactions(){

const[
transactions,
setTransactions
]=
useState<Transaction[]>([]);
const [typeFilter, setTypeFilter] = useState("All");

const [search, setSearch] = useState("");

const [dateFilter, setDateFilter] = useState("");

  async function loadTransactions() {

    try {

      const res = await fetch(
        "/api/admin/transactions",
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {

        setTransactions(data.transactions);

      }

    } catch (err) {

      console.error(err);

    }

  }
useEffect(() => {


  loadTransactions();

}, []);
const filteredTransactions = transactions.filter((tx) => {

  const customerMatch =
    tx.customerId.username
      .toLowerCase()
      .includes(search.toLowerCase());

  const typeMatch =
    typeFilter === "All"
      ? true
      : tx.type === typeFilter;

  const dateMatch =
    dateFilter === ""
      ? true
      : tx.createdAt.slice(0,10) === dateFilter;

  return (
    customerMatch &&
    typeMatch &&
    dateMatch
  );

});
async function approve(id:string){

const res = await fetch(

`/api/admin/transactions/${id}/approve`,

{

method:"PATCH",

credentials:"include"

}

);

const data = await res.json();

alert(data.message);

await loadTransactions();
}

async function reject(id: string) {

    const res = await fetch(
        `/api/admin/transactions/${id}/reject`,
        {
            method: "PATCH",
            credentials: "include",
        }
    );

    const data = await res.json();

    alert(data.message);

    await loadTransactions();
}
return(

<main
className="
min-h-screen
bg-black
text-white
p-10
"
>

<h1
className="
text-5xl
font-black
mb-12
text-center
"
>

💰 Customer Transactions

</h1>
<div className="flex flex-wrap gap-5 mb-8">

<input
type="text"
placeholder="Search Customer"
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="
px-5
py-3
rounded-2xl
bg-white/5
border
border-green-700
outline-none
"
/>

<select
value={typeFilter}
onChange={(e)=>setTypeFilter(e.target.value)}
className="
px-5
py-3
rounded-2xl
bg-white/5
border
border-green-700
"
>

<option value="All">
All
</option>

<option value="Credit">
Credit
</option>

<option value="Debit">
Debit
</option>

</select>

<input
type="date"
value={dateFilter}
onChange={(e)=>setDateFilter(e.target.value)}
className="
px-5
py-3
rounded-2xl
bg-white/5
border
border-green-700
"
/>

</div>
<div
className="
overflow-auto
rounded-3xl
border
border-green-700
"
>

<table
className="
w-full
text-left
"
>

<thead
className="
bg-green-950
"
>

<tr>

<th className="p-6">
Customer
</th>

<th className="p-6">
Animal ID
</th>

<th className="p-6">
Animal
</th>

<th className="p-6">Type</th>

<th className="p-6">Reason</th>

<th className="p-6">
Amount
</th>

<th className="p-6">
Status
</th>

<th className="p-6">
Action
</th>

<th className="p-6">
Date
</th>

</tr>

</thead>

<tbody>

{
filteredTransactions.length === 0 ? (

<tr>

<td
colSpan={8}
className="p-10 text-center text-gray-400"
>

No Transactions Found

</td>

</tr>

) : (
filteredTransactions.map(
(tx)=>(

<tr
  key={tx._id}
  className="
    border-t
    border-green-900
    hover:bg-white/5
  "
>

  <td className="p-6">

    <p className="font-bold">
      {tx.customerId.username}
    </p>

    <p className="text-gray-400">
      {tx.customerId.email}
    </p>

  </td>

  <td className="p-6">
    {tx.animalId?.animalId ?? "--"}
  </td>

  <td className="p-6">

    <p>
      {tx.animalId?.animalName ?? "--"}
    </p>

    <p className="text-gray-400">
      {tx.animalId?.animalType ?? "--"}
    </p>

  </td>

  <td className="p-6">
    {tx.type}
  </td>

  <td className="p-6">
    {tx.reason}
  </td>

  <td className="p-6 text-green-400 font-bold">
    ₹{tx.amount}
  </td>

  <td className="p-6">

<p
className={
tx.status==="Completed"
? "text-green-400"
: tx.status==="Pending"
? "text-yellow-400"
: "text-red-400"
}
>

{tx.status}

</p>

{
tx.type==="Debit"
&&
tx.status==="Pending"
&&
<div className="flex gap-2 mt-3">

<button
onClick={()=>approve(tx._id)}
className="
bg-green-500
px-4
py-2
rounded-xl
text-black
font-bold
"
>

Approve

</button>

<button
onClick={()=>reject(tx._id)}
className="
bg-red-500
px-4
py-2
rounded-xl
text-white
font-bold
"
>

Reject

</button>

</div>
}

</td>

  <td className="p-6">
    {new Date(tx.createdAt).toLocaleString()}
  </td>

</tr>

)

)
)
}

</tbody>

</table>

</div>

</main>

);

}