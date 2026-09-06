"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function WalletPage() {
  const router = useRouter();

  const [wallet, setWallet] = useState<any>(null);

  const [transactions, setTransactions] = useState<any[]>([]);

  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState(500);
  const hasPendingWithdrawal =
transactions.some(
t =>
t.type === "Debit" &&
t.status === "Pending"
);
const sortedTransactions = [...transactions].sort(
  (a, b) =>
    new Date(b.createdAt).getTime() -
    new Date(a.createdAt).getTime()
);
  async function loadWallet() {
    try {
      const res = await fetch("/api/customer/wallet", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setWallet(data.wallet);

      setTransactions(data.transactions);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {

  // Load wallet data
  loadWallet();

  // Auto refresh wallet
  const timer = setInterval(() => {
    loadWallet();
  }, 5000);

  // Load Razorpay Checkout script
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);

  return () => {
    clearInterval(timer);

    // Remove Razorpay script when leaving the page
    document.body.removeChild(script);
  };

}, []);

async function withdrawMoney() {

  setLoading(true);

  try {

   const upiRegex =
/^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/;

if(!upiRegex.test(upiId)){

alert("Enter a valid UPI ID");

setLoading(false);

return;

}

    if (amount <= 0) {
      alert("Enter amount");
      setLoading(false);
      return;
    }
    if(amount > (wallet?.balance || 0)){

alert("Insufficient Wallet Balance");

setLoading(false);

return;

}
if(amount < 100){

alert("Minimum withdrawal is ₹100");

setLoading(false);

return;

}
if(amount > 50000){

alert("Maximum withdrawal is ₹50,000");

setLoading(false);

return;

}

    const res = await fetch("/api/customer/wallet/withdraw", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        upiId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      setLoading(false);
      return;
    }

alert("Withdrawal request sent to Admin.");
 

    setAmount(0);
    setUpiId("");

    await loadWallet();

  } catch (err) {

    console.error(err);

  }

  setLoading(false);

}
async function startPayment() {

  if (depositAmount <= 0) {
    alert("Enter a valid amount");
    return;
  }

  try {

    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: depositAmount,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

      amount: data.order.amount,

      currency: data.order.currency,

      name: "Smart Dairy",

      description: "Wallet Recharge",

      order_id: data.order.id,
      

     handler: async function (response: any) {

  try {

    const verifyRes = await fetch("/api/payment/verify", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        amount: depositAmount,
      }),
    });

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok) {
      alert(verifyData.message);
      return;
    }

    alert("✅ Money Added Successfully!");

    setDepositAmount(0);

    await loadWallet();

  } catch (err) {

    console.error(err);

    alert("Payment verification failed.");

  }

},
prefill: {

  name: "Customer",

  email: "customer@test.com",

  contact: "9999999999",

},
notes: {

  project: "Smart Dairy",

},
      theme: {
        color: "#16a34a",
      },
    };

    // @ts-ignore
    const razor = new window.Razorpay(options);

    razor.open();

  } catch (err) {

    console.error(err);

    alert("Something went wrong.");

  }

}
   
  return (
    <main className="min-h-screen bg-black text-white p-10">

      {
transactions.some(
t=>t.type==="Debit" && t.status==="Pending"
) && (

<div
className="
mb-8
bg-yellow-500/20
border
border-yellow-500
rounded-2xl
p-5
text-yellow-300
">

⏳ Your withdrawal request is waiting for Admin approval.

</div>

)
}

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-black mb-12">

          💰 My Wallet

        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-white/5 rounded-3xl p-10 border border-green-700">

            <p className="text-gray-400">

              Available Balance

            </p>

            <h2
className="
text-6xl
font-black
text-green-400
mt-4
"
>
₹{wallet?.balance || 0}
</h2>

<p className="text-gray-400 mt-4">
Available to Withdraw
</p>

          </div>
          <div className="bg-yellow-900/20 rounded-3xl p-10 border border-yellow-600">

<p className="text-gray-400">Pending Withdrawals
</p>
<h2 className="text-5xl font-black text-yellow-400 mt-4">
₹{transactions
.filter(
t=>t.type==="Debit" && t.status==="Pending")

.reduce(
(a,b)=>a+b.amount,
0
)

}

</h2>

</div>
<div className="bg-white/5 rounded-3xl p-10 border border-blue-700">

  <h2 className="text-3xl font-bold mb-6">
    Add Money
  </h2>

  <input
    type="number"
    value={depositAmount}
    onChange={(e) => setDepositAmount(Number(e.target.value))}
    placeholder="Enter Amount"
    className="w-full p-5 rounded-2xl bg-black mb-5"
  />

  <button
    onClick={startPayment}
    className="w-full py-5 rounded-2xl bg-blue-600 text-white font-bold"
  >
    Add ₹{depositAmount}
  </button>

</div>

          <div className="bg-white/5 rounded-3xl p-10 border border-green-700">

            <h2 className="text-3xl font-bold mb-6">

              Withdraw Balance

            </h2>
            <input
                 type="number"
                 value={amount}
                 onChange={(e) => setAmount(Number(e.target.value))}
                 placeholder="Enter Amount"
                 className="w-full p-5 rounded-2xl bg-black mb-5"
                  />

            <input
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="Enter UPI ID"
              className="w-full p-5 rounded-2xl bg-black"
            />

            <button
              onClick={withdrawMoney}
              disabled={
              loading ||
              wallet?.balance<=0 ||
              hasPendingWithdrawal
              
          }
              className="w-full mt-6 py-5 rounded-2xl bg-green-500 text-black font-bold"
            >
              {loading? "Processing...": hasPendingWithdrawal? "Pending Approval": "Withdraw"}
            </button>

          </div>

        </div>
        <div
className="
grid
md:grid-cols-3
gap-6
mb-12
"
>

<div className="bg-white/5 rounded-3xl p-8">

<h2>Total Credits</h2>

<p className="text-4xl font-black text-green-400">

₹{
transactions
.filter(
(t)=>t.type==="Credit"
)
.reduce(
(a,b)=>a+b.amount,
0
)
}

</p>

</div>

<div className="bg-white/5 rounded-3xl p-8">

<h2>Total Withdrawals</h2>

<p className="text-4xl font-black text-red-400">

₹{
transactions
.filter(
(t)=>t.type==="Debit"
)
.reduce(
(a,b)=>a+b.amount,
0
)
}

</p>

</div>

<div className="bg-white/5 rounded-3xl p-8">

<h2>Total Transactions</h2>

<p className="text-4xl font-black">

{transactions.length}

</p>

</div>

</div>

        <div className="mt-14">

          <h2 className="text-4xl font-black mb-8">

           Wallet History

          </h2>

          <div className="space-y-5">

            {sortedTransactions.length===0 ? (

              <div className="bg-white/5 rounded-3xl p-10 text-center">

                No transactions yet.

                Your milk earnings and withdrawals will appear here.

              </div>
) : (

sortedTransactions.map((tx,index)=>(
            
                <div
                  key={tx._id}
                  className="bg-white/5 rounded-3xl p-8 border border-green-700"
                >

                  <div className="flex justify-between">

                    <div>

                      <div>

  <p className="text-gray-500">

    Transaction #{index + 1}

  </p>

  <h2
className={`text-2xl font-bold ${
tx.type==="Credit"
?
"text-green-400"
:
"text-red-400"
}`}
>
₹{tx.amount}
</h2>
  <p
    className={
      tx.type==="Credit"
      ? "text-green-400"
      : "text-red-400"
    }
  >

    {tx.type==="Credit"
      ? "🟢 Credit"
      : "🔴 Withdrawal"}

  </p>

                      <p className="text-gray-400">

                       Reason :{tx.reason}</p>
                       <p className="text-gray-400">
Mode :
{
tx.type==="Credit"
?
" Milk Collection"
:
" UPI Transfer"
}
</p>
                       {
tx.type==="Debit" && tx.upiId && (

<p className="text-gray-400">

UPI :
{tx.upiId}

</p>

)
}

                    </div>
                    </div>

                    <div>

                      <p
className={`
inline-block
px-3
py-1
rounded-full
font-bold
${
tx.status==="Completed"
?
"bg-green-700 text-white"
:
tx.status==="Pending"
?
"bg-yellow-600 text-white"
:
"bg-red-700 text-white"
}
`}
>

{tx.status}

</p>

                      <p>

                        {new Date(tx.createdAt).toLocaleString()}

                      </p>

                    </div>

                  </div>

                </div>

))


            )}

          </div>

        </div>

        <button
          onClick={() => router.back()}
          className="mt-10 px-8 py-4 rounded-2xl border border-green-700"
        >
          ← Back
        </button>
      </div>

    </main>
  );
}