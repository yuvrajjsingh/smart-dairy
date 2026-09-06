"use client";

import { useEffect, useState } from "react";

export default function DailyCollectionChart() {
  const [chart, setChart] = useState<
    {
      label: string;
      value: number;
    }[]
  >([]);

  useEffect(() => {
    async function load() {
      const res = await fetch(
        "/api/admin/daily-collection",
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) return;

      setChart(
        Object.entries(data.chart).map(
          ([label, value]) => ({
            label,
            value: Number(value),
          })
        )
      );
    }

    load();
  }, []);

  return (
    <section className="mt-20">

      <h2 className="text-4xl font-black mb-10">
        🥛 Daily Milk Collection
      </h2>

      <div className="bg-white/5 rounded-3xl p-10">

        <div className="grid grid-cols-7 gap-6 h-[340px] items-end">

          {chart.map((item) => (

            <div
              key={item.label}
              className="flex flex-col items-center"
            >

              <div
                className="w-full rounded-t-3xl bg-gradient-to-t from-green-900 to-green-400"
                style={{
                  height: `${Math.max(item.value * 8, 20)}px`,
                }}
              />

              <p className="mt-4">{item.label}</p>

              <p className="text-green-400 font-bold">
                {item.value} L
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}