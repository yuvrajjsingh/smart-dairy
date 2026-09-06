"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin(){

const router=useRouter();

const [username,setUsername]=
useState("");

const [password,setPassword]=
useState("");

const [error,setError]=
useState("");
async function handleLogin() {

  setError("");

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    setError(data.message);
    return;
  }

  if (data.user.role !== "admin") {
    setError("You are not an admin");
    return;
  }

  router.push("/admin");
}

return(

<main
className="
min-h-screen
bg-linear-to-b
from-green-950
to-black
text-white
flex
items-center
justify-center
"
>

<div
className="
w-[500px]
bg-white/5
border
border-green-800
rounded-[40px]
p-12
"
>

<h1
className="
text-5xl
font-black
text-center
"
>

👑 Admin Login

</h1>

<input
value={username}
onChange={(e)=>
setUsername(
e.target.value
)
}
placeholder="Admin Username"
className="
w-full
mt-10
p-5
rounded-2xl
bg-black/30
"
/>

<input
type="password"
value={password}
onChange={(e)=>
setPassword(
e.target.value
)
}
placeholder="Password"
className="
w-full
mt-5
p-5
rounded-2xl
bg-black/30
"
/>

<button

onClick={handleLogin}

className="
w-full
mt-8
bg-green-500
py-5
rounded-2xl
"

>

Login

</button>

{
error && (

<p
className="
mt-5
text-red-400
text-center
"
>

{error}

</p>

)

}

</div>

</main>

);

}