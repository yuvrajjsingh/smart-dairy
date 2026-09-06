
"use client";

import { useEffect, useState } from "react";

type Wallet = {
  _id: string;

  customerId: {
    username: string;
    email: string;
  };

  balance: number;

  totalCredits: number;

  totalDebits: number;
};

export default function AdminWallet() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadWallets() {
    try {
      const res = await fetch("/api/admin/wallet", {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setWallets(data.wallets);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadWallets();

    const timer = setInterval(loadWallets, 5000);

    return () => clearInterval(timer);
  }, []);

  const filteredWallets = wallets
    .filter((wallet) =>
      wallet.customerId.username
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => b.balance - a.balance);

  const totalBalance = wallets.reduce(
    (a, b) => a + b.balance,
    0
  );

  const totalCredits = wallets.reduce(
    (a, b) => a + b.totalCredits,
    0
  );

  const totalDebits = wallets.reduce(
    (a, b) => a + b.totalDebits,
    0
  );

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-black mb-10">
        💰 Customer Wallets
      </h1>

      {/* Dashboard Cards */}

      <div className="grid md:grid-cols-4 gap-6 mb-10">

        <Card
          title="Total Balance"
          value={`₹${totalBalance}`}
        />

        <Card
          title="Total Credits"
          value={`₹${totalCredits}`}
        />

        <Card
          title="Total Debits"
          value={`₹${totalDebits}`}
        />

        <Card
          title="Farmers"
          value={wallets.length}
        />

      </div>

      {/* Search */}

      <input
        placeholder="Search Farmer..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="
        w-full
        mb-8
        p-4
        rounded-2xl
        bg-white/5
        border
        border-green-700
        outline-none
        "
      />

      {/* Loading */}

      {loading && (
        <div className="text-center text-gray-400 py-10">
          Loading...
        </div>
      )}

      {/* Empty */}

      {!loading &&
        filteredWallets.length === 0 && (
          <div
            className="
            bg-white/5
            rounded-3xl
            p-10
            text-center
            "
          >
            No Wallets Found
          </div>
        )}

      {/* Wallet Table */}

      {!loading &&
        filteredWallets.length > 0 && (

          <div
            className="
            overflow-auto
            rounded-3xl
            border
            border-green-700
            "
          >

            <table className="w-full">

              <thead className="bg-green-900">

                <tr>

                  <th className="p-5 text-left">
                    Farmer
                  </th>

                  <th className="p-5 text-left">
                    Email
                  </th>

                  <th className="p-5 text-center">
                    Balance
                  </th>

                  <th className="p-5 text-center">
                    Credits
                  </th>

                  <th className="p-5 text-center">
                    Debits
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredWallets.map((wallet) => (

                  <tr
                    key={wallet._id}
                    className="
                    border-t
                    border-green-800
                    hover:bg-white/5
                    "
                  >

                    <td className="p-5 font-bold">

                      👨‍🌾 {wallet.customerId.username}

                    </td>

                    <td className="p-5">

                      {wallet.customerId.email}

                    </td>

                    <td
                      className="
                      p-5
                      text-center
                      text-green-400
                      font-bold
                      "
                    >
                      ₹{wallet.balance}
                    </td>

                    <td
                      className="
                      p-5
                      text-center
                      text-blue-400
                      font-bold
                      "
                    >
                      ₹{wallet.totalCredits}
                    </td>

                    <td
                      className="
                      p-5
                      text-center
                      text-red-400
                      font-bold
                      "
                    >
                      ₹{wallet.totalDebits}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

    </main>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div
      className="
      bg-white/5
      border
      border-green-700
      rounded-3xl
      p-8
      "
    >

      <p className="text-gray-400">

        {title}

      </p>

      <h2
        className="
        text-4xl
        font-black
        text-green-400
        mt-4
        "
      >

        {value}

      </h2>

    </div>
  );
}