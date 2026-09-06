"use client";

import { useEffect, useState } from "react";

type MilkRecord = {
  _id: string;
  customerId: {
    username: string;
    email: string;
  };
  animalId: {
    animalId: string;
    animalName: string;
    animalType: string;
  };
  milk: number;
  payment: number;
  createdAt: string;
};

export default function MilkCollection() {
  const [records, setRecords] = useState<MilkRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMilk() {
      try {
        const res = await fetch("/api/admin/daily-collection", {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setRecords(data.records || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadMilk();
  }, []);

  const totalMilk = records.reduce(
    (sum, item) => sum + Number(item.milk),
    0
  );

  return (
    <div className="mt-16 bg-white/5 rounded-3xl p-8">

      <h2 className="text-3xl font-bold mb-8">
        🥛 Today's Milk Collection
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : records.length === 0 ? (
        <p className="text-gray-400">
          No Milk Collection Found
        </p>
      ) : (
        <>
          <div className="space-y-4">

            {records.map((item) => (
              <div
                key={item._id}
                className="flex justify-between bg-black/30 rounded-2xl p-5"
              >
                <div>
                  <h3 className="font-bold">
                    {item.customerId?.username}
                  </h3>

                  <p className="text-gray-400">
                    {item.animalId?.animalName} (
                    {item.animalId?.animalType})
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-green-400">
                    {item.milk} L
                  </p>

                  <p>
                    ₹{item.payment}
                  </p>
                </div>
              </div>
            ))}

          </div>

          <div className="mt-8 border-t border-green-700 pt-5 flex justify-between text-xl font-bold">
            <span>Total Milk</span>
            <span>{totalMilk.toFixed(2)} L</span>
          </div>
        </>
      )}
    </div>
  );
}