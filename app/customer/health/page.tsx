"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Animal = {
  _id?: string;
  customerId?: string;
  email?: string;
  animalId?: string;
  animalName?: string;
  animalType?: string;
  animalAge?: string;
  month?: string;
  water?: string;
  feed?: string;
  supplements?: string;
  growth?: string;
  health?: string;
};

export default function HealthPage() {
  const router = useRouter();

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [selected, setSelected] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);

  const [symptoms, setSymptoms] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    async function loadAnimals() {
      try {
        const res = await fetch("/api/customer/profile", {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          router.push("/customer");
          return;
        }

        setAnimals(data.animals);

        if (data.selectedAnimal) {
          setSelected(data.selectedAnimal);
        } else if (data.animals.length > 0) {
          setSelected(data.animals[0]);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    loadAnimals();
  }, [router]);

  async function generateRecommendation() {
    if (!selected?._id) {
      alert("Please select an animal first.");
      return;
    }

    setAiLoading(true);
    setRecommendation("");

    try {
      const res = await fetch("/api/ai/recommendation", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          animalId: selected._id,
          symptoms,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to generate recommendation.");
        return;
      }

      setRecommendation(data.recommendation);
    } catch (error) {
      console.error("AI Error:", error);
      alert("Something went wrong while contacting AI.");
    } finally {
      setAiLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-3xl text-green-400">
        Loading AI Health...
      </div>
    );
  }

  return (
    <main
      className="
        min-h-screen
        bg-gradient-to-b
        from-black
        via-[#04140e]
        to-black
        text-white
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-10
          py-16
        "
      >

        <div
          className="
            flex
            justify-between
            items-center
            mb-14
          "
        >
          <div>
            <h1
              className="
                text-6xl
                font-black
              "
            >
              🧠 Animal Health AI
            </h1>

            <p
              className="
                text-gray-400
                mt-4
              "
            >
              AI generated recommendations
              for your animals
            </p>
          </div>

          <button
            onClick={() =>
              router.push("/customer/dashboard")
            }
            className="
              px-8
              py-4
              rounded-full
              border
              border-green-700
              hover:bg-green-950
            "
          >
            ← Dashboard
          </button>
        </div>

        <div
          className="
            flex
            gap-5
            overflow-auto
            pb-8
          "
        >
          {animals.map((a) => (
            <button
              key={a.animalId}
              onClick={() =>
                setSelected(a)
              }
              className={`
                min-w-[260px]
                rounded-[30px]
                p-6
                text-left
                duration-300

                ${
                  selected?.animalId === a.animalId
                    ? "bg-green-500 text-black"
                    : "bg-white/5 border border-green-700"
                }
              `}
            >
              <h3
                className="
                  text-2xl
                  font-bold
                "
              >
                🐄 {a.animalName}
              </h3>

              <p>
                {a.animalId}
              </p>
            </button>
          ))}
        </div>

        {animals.length === 0 && (
          <div
            className="
              bg-white/5
              border
              border-green-800
              rounded-[40px]
              p-14
              text-center
              mb-10
            "
          >
            <h2
              className="
                text-3xl
                font-bold
              "
            >
              No Animals Added
            </h2>

            <p
              className="
                mt-3
                text-gray-400
              "
            >
              Add an animal to receive health recommendations.
            </p>
          </div>
        )}

        <div
          className="
            grid
            lg:grid-cols-3
            gap-8
          "
        >
          <Card
            title="Age"
            value={
              selected?.animalAge
                ? `${selected.animalAge} Years`
                : "--"
            }
          />

          <Card
            title="Pregnancy"
            value={
              selected?.month
              ||
              "--"
            }
          />

          <Card
            title="Health"
            value={
              selected?.health
              ||
              "Excellent"
            }
          />

          <Card
            title="Water"
            value={
              selected?.water
              ||
              "45L/day"
            }
          />

          <Card
            title="Feed"
            value={
              selected?.feed
              ||
              "Balanced Feed"
            }
          />

          <Card
            title="Supplements"
            value={
              selected?.supplements
              ||
              "Mineral Mix"
            }
          />
        </div>

        {/* ================= AI RECOMMENDATION ================= */}

        <div className="mt-12 rounded-[32px] border border-green-700 bg-gradient-to-br from-green-950/80 to-black p-8 shadow-2xl">

          <div className="mb-8">
            <h2 className="text-3xl font-black text-white">
              🧠 Ask Smart Dairy AI
            </h2>

            <p className="mt-2 text-gray-400">
              Get personalized general health and feeding recommendations
              based on your selected animal.
            </p>
          </div>

          {/* Selected animal */}

          {selected && (
            <div className="mb-6 rounded-2xl border border-green-800 bg-black/40 p-5">

              <p className="text-sm text-gray-400">
                Selected Animal
              </p>

              <p className="mt-1 text-xl font-bold text-green-400">
                {selected.animalName || selected.animalId}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {selected.animalType || "Animal"}
              </p>

            </div>
          )}

          {/* Symptoms input */}

          <div>

            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Describe the animal's problem or symptoms
            </label>

            <textarea
              value={symptoms}
              onChange={(e) =>
                setSymptoms(e.target.value)
              }
              placeholder="Example: My cow is eating less than usual and milk production has decreased..."
              className="min-h-[150px] w-full resize-none rounded-2xl border border-green-900 bg-black/50 p-5 text-white outline-none transition placeholder:text-gray-600 focus:border-green-500"
            />

          </div>

          {/* Generate button */}

          <button
            onClick={generateRecommendation}
            disabled={aiLoading || !selected}
            className="mt-6 rounded-2xl bg-green-500 px-7 py-4 font-bold text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {aiLoading
              ? "🧠 AI is analyzing..."
              : "✨ Generate AI Recommendation"}
          </button>

          {/* AI result */}

          {recommendation && (
            <div className="mt-10 rounded-2xl border border-green-800 bg-black/50 p-7">

              <h3 className="mb-5 text-2xl font-bold text-green-400">
                ✨ AI Recommendation
              </h3>

              <div className="whitespace-pre-wrap leading-8 text-gray-300">
                {recommendation}
              </div>

            </div>
          )}

        </div>

        {/* ================= END AI RECOMMENDATION ================= */}

      </div>
    </main>
  );
}

function Card({
  title,
  value
}: any) {

  return (
    <div
      className="
        rounded-[35px]
        bg-white/5
        border
        border-green-800
        p-10
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
          text-4xl
          font-bold
          mt-5
          text-green-300
        "
      >
        {value}
      </h2>

    </div>
  );
}