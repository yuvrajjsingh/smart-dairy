"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type ChartItem = {
  label: string;
  value: number;
};

export default function MonthlyEarnings() {

  const [chart, setChart] = useState<ChartItem[]>([]);

  useEffect(() => {

    async function loadChart() {

      try {

        const res = await fetch(
          "/api/admin/charts/monthly-earnings",
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (res.ok) {

          setChart(data.chart);

        }

      } catch (err) {

        console.error(err);

      }

    }

    loadChart();

  }, []);

  return (

    <section
      className="
      px-10
      pb-20
      "
    >

      <div
        className="
        flex
        justify-between
        items-center
        mb-12
        "
      >

        <h1
          className="
          text-5xl
          font-black
          "
        >

          💰 Monthly Earnings

        </h1>

        <div
          className="
          text-2xl
          font-bold
          text-green-400
          "
        >

          ₹
          {
            chart.reduce(
              (a, b) => a + b.value,
              0
            )
          }

        </div>

      </div>

      <div
        className="
        bg-white/5
        border
        border-green-700
        rounded-[40px]
        p-12
        "
      >

        <div
          className="
          grid
          grid-cols-12
          gap-6
          items-end
          h-[420px]
          "
        >

          {

            chart.map(
              (
                item,
                index
              ) => {

                const height =
                  Math.max(
                    item.value / 120,
                    20
                  );

                return (

                  <div
                    key={item.label}
                    className="
                    flex
                    flex-col
                    items-center
                    "
                  >

                    <motion.div

                      initial={{
                        height:0
                      }}

                      animate={{
                        height
                      }}

                      transition={{
                        duration:0.7,
                        delay:index*0.05
                      }}

                      whileHover={{
                        scale:1.05
                      }}

                      style={{
                        height:`${height}px`
                      }}

                      className="
                      w-full
                      rounded-t-[28px]
                      bg-gradient-to-t
                      from-green-950
                      via-green-500
                      to-green-300
                      shadow-[0_0_40px_rgba(34,197,94,.5)]
                      "
                    />

                    <p
                      className="
                      mt-4
                      text-gray-300
                      "
                    >

                      {item.label}

                    </p>

                    <p
                      className="
                      text-green-400
                      font-bold
                      "
                    >

                      ₹{item.value}

                    </p>

                  </div>

                );

              }

            )

          }

        </div>

      </div>

    </section>

  );

}