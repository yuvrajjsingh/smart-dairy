"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CustomerProfile() {
  const { id } = useParams();

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/customer/${id}`, {
        credentials: "include",
      });

      const json = await res.json();

      if (res.ok) {
        setData(json);
      }
    }

    if (id) {
      load();
    }
  }, [id]);

  if (!data) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-black mb-10">
        👤 Customer Profile
      </h1>

      {/* TOP CARDS */}

      <div className="grid md:grid-cols-4 gap-6 mb-12">

        <div className="bg-white/5 rounded-3xl p-8">
          <h2 className="text-gray-400">Username</h2>
          <p className="text-3xl font-bold mt-3">
            {data.customer.username}
          </p>
        </div>

        <div className="bg-white/5 rounded-3xl p-8">
          <h2 className="text-gray-400">Email</h2>
          <p className="text-xl mt-3">
            {data.customer.email}
          </p>
        </div>

        <div className="bg-white/5 rounded-3xl p-8">
          <h2 className="text-gray-400">Wallet Balance</h2>
          <p className="text-4xl font-black text-green-400 mt-3">
            ₹{data.wallet?.balance ?? 0}
          </p>
        </div>

        <div className="bg-white/5 rounded-3xl p-8">
          <h2 className="text-gray-400">Animals</h2>
          <p className="text-4xl font-black mt-3">
            {data.animals?.length ?? 0}
          </p>
        </div>

      </div>
      <div className="mt-12">

<h2
className="
text-4xl
font-black
mb-8
"
>

📊 Customer Statistics

</h2>

<div
className="
grid
md:grid-cols-4
gap-6
"
>

<StatCard
title="Total Milk"
value={`${data.statistics.totalMilk} L`}
/>

<StatCard
title="Total Earnings"
value={`₹${data.statistics.totalEarnings}`}
/>

<StatCard
title="Transactions"
value={data.statistics.totalTransactions}
/>

<StatCard
title="Animals"
value={data.statistics.totalAnimals}
/>

</div>

</div>

      {/* ================= MILK HISTORY ================= */}

      <div className="mt-14">

        <h2 className="text-4xl font-black mb-8">
          🥛 Milk History
        </h2>

        {!data.milkHistory || data.milkHistory.length === 0 ? (

          <div className="bg-white/5 rounded-3xl p-10 text-center">
            No Milk Records Found
          </div>

        ) : (

          <div className="space-y-5">

            {data.milkHistory.map((milk: any) => (

              <div
                key={milk._id}
                className="bg-white/5 rounded-3xl p-8 border border-green-700"
              >

                <div className="grid md:grid-cols-7 gap-5 items-center">

                  <div>
                    <p className="text-gray-400">Animal</p>
                    <p className="font-bold">
                      {milk.animalId?.animalName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {milk.animalId?.animalId}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">Milk</p>
                    <p>{milk.milk} L</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Fat</p>
                    <p>{milk.fat}%</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Protein</p>
                    <p>{milk.protein}%</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Quality</p>
                    <p>{milk.quality}</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Payment</p>
                    <p className="text-green-400 font-bold">
                      ₹{milk.payment}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">Date</p>
                    <p>
                      {new Date(milk.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* ================= WALLET HISTORY ================= */}

      <div className="mt-16">

        <h2 className="text-4xl font-black mb-8">
          💰 Wallet History
        </h2>

        {!data.transactions || data.transactions.length === 0 ? (

          <div className="bg-white/5 rounded-3xl p-10 text-center">
            No Wallet Transactions
          </div>

        ) : (

          <div className="space-y-5">

            {data.transactions.map((tx: any) => (

              <div
                key={tx._id}
                className="bg-white/5 rounded-3xl p-8 border border-green-700"
              >

                <div className="grid md:grid-cols-6 gap-5 items-center">

                  <div>
                    <p className="text-gray-400">Type</p>

                    <p
                      className={
                        tx.type === "Credit"
                          ? "text-green-400 font-bold"
                          : "text-red-400 font-bold"
                      }
                    >
                      {tx.type}
                    </p>

                  </div>

                  <div>
                    <p className="text-gray-400">Reason</p>
                    <p>{tx.reason}</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Amount</p>
                    <p className="font-bold">
                      ₹{tx.amount}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400">Status</p>
                    <p>{tx.status}</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Animal</p>
                    <p>{tx.animalId?.animalName ?? "--"}</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Date</p>
                    <p>
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* ================= ANIMALS ================= */}

      <div className="mt-16">

        <h2 className="text-4xl font-black mb-8">
          🐄 Animals
        </h2>

        {!data.animals || data.animals.length === 0 ? (

          <div className="bg-white/5 rounded-3xl p-10 text-center">
            No Animals
          </div>

        ) : (

          <div className="grid md:grid-cols-2 gap-6">

            {data.animals.map((animal: any) => (

              <div
                key={animal._id}
                className="bg-white/5 rounded-3xl p-8"
              >

                <h2 className="text-2xl font-bold">
                  {animal.animalName}
                </h2>

                <p>ID : {animal.animalId}</p>

                <p>Type : {animal.animalType}</p>

                <p>Age : {animal.age} Years</p>

                <p>
                  Pregnancy :
                  {" "}
                  {animal.pregnancyMonth || 0}
                  {" "}
                  Months
                </p>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}
function StatCard({
title,
value,
}:{
title:string;
value:string|number;
}){

return(

<div
className="
bg-white/5
rounded-3xl
p-8
border
border-green-700
"
>

<p className="text-gray-400">

{title}

</p>

<h2
className="
text-4xl
font-black
mt-4
"
>

{value}

</h2>

</div>

);

}