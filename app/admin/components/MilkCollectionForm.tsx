"use client";

import { useEffect, useState } from "react";

export default function MilkCollectionForm() {

    const [customers, setCustomers] = useState<any[]>([]);
    const [animals, setAnimals] = useState<any[]>([]);

    const [form, setForm] = useState({
        customerId: "",
        animalId: "",
        animalType: "Cow",
        session: "Morning",
        quantity: "",
        fat: "",
        snf: "",
        rate: "",
    });


    useEffect(() => {

        async function loadData() {

            try {

                const customerRes = await fetch(
                    "/api/admin/customers",
                    {
                        credentials: "include",
                    }
                );

                const customerData = await customerRes.json();

                console.log(
                    "Customers:",
                    customerData.customers
                );

                setCustomers(
                    customerData.customers || []
                );



                const animalRes = await fetch(
                    "/api/admin/animals",
                    {
                        credentials: "include",
                    }
                );

                const animalData = await animalRes.json();

                console.log(
                    "Animals:",
                    animalData.animals
                );

                setAnimals(
                    animalData.animals || []
                );


            } catch (error) {

                console.log(error);

            }

        }


        loadData();

    }, []);


    async function saveCollection() {

        console.log("SAVE BUTTON CLICKED");

        try {

            const res = await fetch(
                "/api/admin/milk/collection",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(form)
                }
            );

            console.log("STATUS:", res.status);

            const data = await res.json();

            console.log("RESPONSE:", data);


            if (data.success) {
                alert("Milk Collection Saved ✅");
            }
            else {
                alert("Failed");
            }


        } catch (error) {

            console.log("ERROR:", error);

        }

    }


    return (

        <div className="
    bg-white/5
    rounded-3xl
    p-8
    mt-10
    ">


            <h2 className="
      text-3xl
      font-bold
      mb-6
      ">
                🥛 Add Milk Collection
            </h2>



            <select

                className="
      w-full
      p-4
      bg-black
      rounded-xl
      mb-4
      "

                value={form.customerId}

                onChange={(e) =>

                    setForm({
                        ...form,
                        customerId: e.target.value
                    })

                }

            >

                <option value="">
                    Select Customer
                </option>


                {
                    customers.map((c) => (

                        <option
                            key={c._id}
                            value={c._id}
                        >

                            {c.username}

                        </option>

                    ))
                }


            </select>




            <select

                className="
      w-full
      p-4
      bg-black
      rounded-xl
      mb-4
      "

                value={form.animalId}

                onChange={(e) =>

                    setForm({
                        ...form,
                        animalId: e.target.value
                    })

                }

            >

                <option value="">
                    Select Animal
                </option>


                {
                    animals.map((a) => (

                        <option
                            key={a._id}
                            value={a._id}
                        >

                            {a.animalName} - {a.animalType}

                        </option>

                    ))
                }


            </select>




            <select

                className="
      w-full
      p-4
      bg-black
      rounded-xl
      mb-4
      "

                value={form.session}

                onChange={(e) =>

                    setForm({
                        ...form,
                        session: e.target.value
                    })

                }

            >

                <option>
                    Morning
                </option>

                <option>
                    Evening
                </option>


            </select>




            <input

                className="
      w-full
      p-4
      bg-black
      rounded-xl
      mb-4
      "

                placeholder="Milk Quantity (L)"

                onChange={(e) =>

                    setForm({
                        ...form,
                        quantity: e.target.value
                    })

                }

            />




            <input

                className="
      w-full
      p-4
      bg-black
      rounded-xl
      mb-4
      "

                placeholder="Fat %"

                onChange={(e) =>

                    setForm({
                        ...form,
                        fat: e.target.value
                    })

                }

            />




            <input

                className="
      w-full
      p-4
      bg-black
      rounded-xl
      mb-4
      "

                placeholder="SNF"

                onChange={(e) =>

                    setForm({
                        ...form,
                        snf: e.target.value
                    })

                }

            />




            <input

                className="
      w-full
      p-4
      bg-black
      rounded-xl
      mb-4
      "

                placeholder="Rate per litre"

                onChange={(e) =>

                    setForm({
                        ...form,
                        rate: e.target.value
                    })

                }

            />




            <button

                onClick={saveCollection}

                className="
      bg-green-600
      px-8
      py-4
      rounded-xl
      font-bold
      "

            >

                Save Collection

            </button>



        </div>

    );

}