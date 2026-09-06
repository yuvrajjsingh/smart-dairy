"use client";

import { useEffect, useState } from "react";

export default function MilkScanPage() {

  const [animals, setAnimals] = useState<any[]>([]);

  const [animalId, setAnimalId] = useState("");

  const [milk, setMilk] = useState("");

  const [fat, setFat] = useState("");

  const [protein, setProtein] = useState("");

  const [waterPercent, setWaterPercent] = useState("");

  const [loading, setLoading] = useState(false);

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

        if (res.ok) {

          setAnimals(data.animals);

        }

      } catch (error) {

        console.error(error);

      }

    }

    loadAnimals();

  }, []);

  async function saveMilkReport() {

    if (
      !animalId ||
      !milk ||
      !fat ||
      !protein ||
      !waterPercent
    ) {

      alert("Fill all fields");

      return;

    }

    setLoading(true);

    try {

      const res = await fetch(
        "/api/admin/milkscan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({

            animalId,

            milk,

            fat,

            protein,

            waterPercent,

          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {

        alert(data.message);

        setLoading(false);

        return;

      }

      alert("Milk Report Saved ✅");

      setAnimalId("");

      setMilk("");

      setFat("");

      setProtein("");

      setWaterPercent("");

    } catch (error) {

      console.error(error);

      alert("Something went wrong");

    }

    setLoading(false);

  }

  return (

    <main
      className="
      min-h-screen
      bg-gradient-to-b
      from-green-950
      to-black
      text-white
      flex
      justify-center
      items-center
      p-10
      "
    >

      <div
        className="
        w-full
        max-w-2xl
        bg-white/5
        backdrop-blur-xl
        rounded-[40px]
        p-12
        border
        border-green-700
        "
      >

        <h1
          className="
          text-5xl
          font-black
          text-center
          mb-10
          "
        >

          🥛 Milk Scanner

        </h1>

        <select

          value={animalId}

          onChange={(e)=>
            setAnimalId(e.target.value)
          }

          className="
          w-full
          p-5
          rounded-2xl
          bg-black
          mb-5
          "
        >

          <option value="">

            Select Animal

          </option>

          {

            animals.map((animal)=>(

              <option

                key={animal._id}

                value={animal._id}

              >

                {animal.animalName}
                {" - "}
                {animal.animalId}

              </option>

            ))

          }

        </select>

        <input

          placeholder="Milk Quantity (L)"

          value={milk}

          onChange={(e)=>
            setMilk(e.target.value)
          }

          className="
          w-full
          p-5
          rounded-2xl
          bg-black
          mb-5
          "

        />

        <input

          placeholder="Fat %"

          value={fat}

          onChange={(e)=>
            setFat(e.target.value)
          }

          className="
          w-full
          p-5
          rounded-2xl
          bg-black
          mb-5
          "

        />

        <input

          placeholder="Protein %"

          value={protein}

          onChange={(e)=>
            setProtein(e.target.value)
          }

          className="
          w-full
          p-5
          rounded-2xl
          bg-black
          mb-5
          "

        />

        <input

          placeholder="Water %"

          value={waterPercent}

          onChange={(e)=>
            setWaterPercent(e.target.value)
          }

          className="
          w-full
          p-5
          rounded-2xl
          bg-black
          mb-8
          "

        />

        <button

          onClick={saveMilkReport}

          disabled={loading}

          className="
          w-full
          py-5
          rounded-3xl
          bg-green-600
          font-bold
          text-xl
          disabled:opacity-50
          "

        >

          {

            loading

            ?

            "Saving..."

            :

            "Save Milk Report"

          }

        </button>

      </div>

    </main>

  );

}