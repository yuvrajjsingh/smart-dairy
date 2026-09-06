"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import WeeklyMilkChart from "../../components/WeeklyMilkChart";
import FAQs from "../../components/FAQs";
export default function Dashboard(){
    
const router=
useRouter();
async function logout() {

  try {

    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    router.replace("/");

    router.refresh();

  } catch (error) {

    console.error(error);

  }

}
const [language,setLanguage]=
useState("English");
const text={
English:{
welcome:"Welcome",
ai:"AI Recommendations",
milk:"Milk Quality",
condition:"Animal Condition",
feed:"Feed",
water:"Water",
supplements:"Supplements",
growth:"Expected Milk Growth",
excellent:"Excellent",
healthy:"Healthy",
logout:"Logout",
profile:"Profile",
recent:"Recent Scan",
animal:"Animal Recommendation",
notifications:"Notifications",
upcoming:"Upcoming Actions",
scan:`
Fat: 4.8%
Protein: 3.6%
Water: 1.8%
`,
recommend:`
75L water
18kg fodder
Minerals
`,

todayMilk:"Today's Milk",
health:"Animal Health",
payment:"Payment",
pregnancy:"Pregnancy Month",
diet:"Diet Plan",
updated:"Updated"
},
"हिन्दी":{
welcome:"स्वागत",
ai:"AI सुझाव",
milk:"दूध गुणवत्ता",
condition:"पशु स्वास्थ्य",
feed:"चारा",
water:"पानी",
supplements:"सप्लीमेंट",
growth:"दूध वृद्धि",
excellent:"उत्तम",
healthy:"स्वस्थ",
logout:"लॉगआउट",
profile:"प्रोफाइल",
recent:"हालिया स्कैन",
animal:"पशु सुझाव",
notifications:"सूचनाएँ",
upcoming:"आने वाले कार्य",
scan:`
वसा: 4.8%
प्रोटीन: 3.6%
पानी: 1.8%
`,
recommend:`
75L पानी
18kg चारा
खनिज
`,

todayMilk:"आज का दूध",
health:"पशु स्वास्थ्य",
payment:"भुगतान",
pregnancy:"गर्भ महीना",
diet:"आहार योजना",
updated:"अपडेट किया गया"
}
};
const t=
text[
language as keyof typeof text
];
const [openProfile,
setOpenProfile]=
useState(false);

const [user, setUser] = useState<any>(null);
const username = user?.username || "Customer";
const [wallet, setWallet] = useState<any>(null);
const [latestScan, setLatestScan] = useState<any>(null);
const[
transactions,
setTransactions
]=
useState<any[]>([]);
const [mounted,
setMounted]=
useState(false);
useEffect(() => {
  async function loadProfile() {
    try {
      const res = await fetch(
        "/api/customer/profile",
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        router.push("/customer");
        return;
      }
      setUser({
        ...data.user,
        ...data.selectedAnimal,

      });
      const txRes = await fetch(
  "/api/customer/transactions",
  {
    credentials: "include",
  }
);
const txData = await txRes.json();
if (txRes.ok) {
setTransactions(txData.transactions);
}
const walletRes = await fetch(
  "/api/customer/wallet",
  {
    credentials: "include",
  }
);

const walletData = await walletRes.json();

if (walletRes.ok) {

  setWallet(walletData.wallet);

}
      
      setMounted(true);
           
    } catch (err) {

      console.error(err);
    }

  }

  loadProfile();

}, [router]);

if(
!mounted ||
!user
){
return null;
}
const notifications =
language==="हिन्दी"
?
[
`भुगतान जमा: ${user?.payment}`,
`अंतिम स्कैन: ${
user?.lastScan ||
"अभी तक स्कैन नहीं"
}`,
`पशु स्वास्थ्य: ${
user?.health
}`,
`एकत्र दूध: ${
user?.milk
}`
].join("\n")
:
[
`Payment credited: ${
user?.payment}`,
`Last scan: ${
user?.lastScan ||
"No scan yet"
}`,
`Animal health: ${
user?.health
}`,
`Milk collected: ${
user?.milk
}`
].join("\n");
const upcoming =
language==="हिन्दी"
?
`
कल:
पानी बढ़ाकर ${
user?.water ||
"75L प्रतिदिन"
}
3 दिन बाद:
फीड योजना समीक्षा
7 दिन बाद:
स्वास्थ्य निरीक्षण
`
:
`
Tomorrow:
Increase water to ${
user?.water ||
"75L/day"
}
After 3 days:
Review feed plan
After 7 days:
Health inspection
`;
const recentScan = latestScan
? `
Date : ${new Date(latestScan.createdAt).toLocaleString()}

Milk : ${latestScan.milk} L

Fat : ${latestScan.fat}%

Protein : ${latestScan.protein}%

SNF : ${latestScan.snf}%

Water : ${latestScan.waterPercent}%

Quality : ${latestScan.quality}

Payment : ₹${latestScan.payment}
`
: `
No Scan Available
`;
return(
<main
className="
min-h-screen
bg-linear-to-b
from-green-950
to-black
text-white
p-10
animate-[fade_0.8s_ease]
"
>
<div
className="
flex
justify-end
gap-4
mb-8
"
>
    <button

onClick={()=>
router.push(
"/customer/health"
)
}

className="
px-8
py-4

rounded-full

bg-gradient-to-r
from-green-500
to-emerald-600

text-black

font-bold

hover:scale-105

duration-300

shadow-[0_0_40px_rgba(34,197,94,.3)]
"

>

Animal Health AI

</button>
<button
onClick={() => router.push("/customer/wallet")}
className="
px-8
py-4
rounded-full
bg-gradient-to-r
from-yellow-400
to-yellow-600
text-black
font-bold
hover:scale-105
duration-300
shadow-[0_0_40px_rgba(234,179,8,.35)]
"
>
💰 Wallet
</button>
<button
onClick={()=>
setLanguage(
language==="English"
?
"हिन्दी"
:
"English"
)
}
className="
bg-white/5
border
border-green-700
px-5
py-3
rounded-2xl
hover:scale-105
duration-300
"
>
🌐 {language}
</button>
<button
onClick={()=>
setOpenProfile(
!openProfile
)
}
className="
bg-green-900
px-5
py-3
rounded-2xl
hover:scale-105
duration-300
"
>
👤 {t.profile}
</button>
</div>
{
openProfile && (
<div
className="
absolute
top-28
right-10
w-[320px]
bg-black/80
backdrop-blur-2xl
border
border-green-700
rounded-3xl
p-8
z-50
animate-[fade_0.3s_ease]
"
>
<div className="text-5xl">
👤
</div>
<h2
className="
text-2xl
font-bold
mt-4
"
>
{username}
</h2>
<p className="mt-2">
Animal ID:{user.animalId || "Not Added"}
</p>

<p className="mt-2">
Animal:{user.animalName || "Not Added"}
</p>

<p className="mt-2">
Type:{user.animalType || "Not Added"}
</p>

<p className="mt-4">
Milk Supplied:{user.milk}
</p>
<button
onClick={() => router.push("/customer/wallet")}
className="
w-full
mt-6
bg-green-600
p-4
rounded-2xl
"
>
💰 Open Wallet
</button>
<button onClick={logout}
className="
w-full
mt-8
bg-red-500
p-4
rounded-2xl
"
>
{t.logout}
</button>
</div>
)
}
<h1
className="
text-6xl
font-black
"
>
{t.welcome} {username} 👋
</h1>
<div
className="
grid
md:grid-cols-3
gap-8
mt-16
"
>
<Card
title={t.todayMilk}
value={
latestScan
?
`${latestScan.milk} L`
:
"Scan Required"
}
/>
<Card
title={t.milk}
value={
latestScan
?
latestScan.quality
:
"Not Scanned"
}
/>
<Card
title={t.health}
value={
latestScan
? latestScan.quality
: "Healthy"
}
/>

<Card
title={t.pregnancy}
value={
user.pregnancyMonth > 0
? `${user.pregnancyMonth} Month`
: "Not Pregnant"
}
/>
  <Card
title={t.diet}
value={t.updated}
/>
<Card
title={t.payment}
value={
latestScan
?
`₹${latestScan.payment}`
:
"Pending"
}
/>
<Card
title="Wallet Balance"
value={`₹${wallet?.balance ?? 0}`}
/>

<button
onClick={()=>
router.push("/customer/wallet")
}
className="
mt-4
w-full
py-3
rounded-2xl
bg-green-600
font-bold
"
>

Withdraw Money

</button>
</div>
<div
className="
mt-16
space-y-8
"
>
<Panel
title={t.recent}
content={recentScan}
/>

<Panel
  title={t.animal}
  content={`
Animal Name : ${user.animalName}

Animal Type : ${user.animalType}

Age : ${user.age} Years

Pregnancy : ${
  user.pregnancyMonth > 0
    ? `${user.pregnancyMonth} Month`
    : "Not Pregnant"
}
`}
 />
<Panel
title={t.notifications}
content={notifications}
/>
<Panel
title={t.upcoming}
content={upcoming}
/>
<section
className="
mt-20
"
>

<h2
className="
text-5xl
font-black
mb-10
"
>

💰 Transaction History

</h2>

<div
className="
space-y-5
"
>

{

transactions.length===0

?

(

<div
className="
bg-white/5
rounded-3xl
p-10
text-center
"
>

No transactions yet

</div>

)

:

(

transactions.map(
(tx:any)=>(

<div

key={tx.id}

className="
bg-white/5
rounded-3xl
p-8
border
border-green-800
"

>

<div
className="
flex
justify-between
"
>

<div>

<h3
className="
text-2xl
font-bold
"
>
₹{tx.totalAmount}
</h3>

<p>
Animal: {tx.animalType}
</p>

<p>
Milk: {tx.quantity} L
</p>

</div>

<div>

<p>
Fat: {tx.fat}%
</p>

<p>
SNF: {tx.snf}%
</p>

<p>
Status: {tx.paymentStatus}
</p>

<p>
{new Date(tx.transactionDate).toLocaleString()}
</p>

</div>
</div>

</div>

)

)

)

}

</div>

</section>
<WeeklyMilkChart />
<div className="mt-28">
<FAQs language={language}/></div>
<Link href="/main">

<button
className="
group
relative
overflow-hidden
px-10
py-5
rounded-3xl
bg-white/5
backdrop-blur-xl
border
border-white/10
hover:bg-white/10
hover:border-green-500
hover:scale-105
hover:-translate-y-1
duration-500
font-semibold
text-lg
min-w-[300px]
"

>

<span
className="
flex
items-center
justify-center
gap-3
"

>

🚀
Open Main Application

</span>

</button>

</Link>
</div>
</main>
);
}
function Card({
title,
value
}:{
title:string
value:string
}){
return(
<div
className="
bg-white/5
backdrop-blur-xl
rounded-3xl
p-10
border
border-green-900
hover:scale-[1.03]
hover:-translate-y-2
duration-500
cursor-pointer
"
>
<p>
{title}
</p>
<h2
className="
text-5xl
mt-6
transition-all
duration-500
"
>
{value}
</h2>
</div>
);
}
function Panel({
title,
content
}:{
title:string
content:string
}){
return(
<div
className="
bg-white/5
backdrop-blur-xl
rounded-3xl
p-8
border
border-transparent
hover:border-green-500
hover:translate-x-2
duration-500
"
>
<h2
className="
text-3xl
font-bold
"
>
{title}
</h2>
<p
className="
mt-5
whitespace-pre-line
"
>
{content}
</p>
</div>
);
}
