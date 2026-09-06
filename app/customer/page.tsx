"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
type User = {
  id?: string;
  name: string;
  username: string;
  email: string;
  role?: "admin" | "user";
};
export default function Customer(){
const router = useRouter();
const [username,setUsername]=
useState("");
const [password,setPassword]=
useState("");
const [error,setError]=
useState("");
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
px-6
"
>
<div
className="
w-full
max-w-xl
bg-white/5
backdrop-blur-xl
rounded-[40px]
p-12
border
border-green-800
"
>
<h1
className="
text-center
text-5xl
font-black
"
>
🥛 Smart Dairy
</h1>
<p
className="
text-center
mt-6
text-gray-300
"
>

Login to access
your milk reports,
payments and insights.

</p>


<input

value={username}

onChange={(e)=>
setUsername(
e.target.value
)
}

placeholder="Username"

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
onClick={async () => {

  setError("");

  if (!username.trim()) {
    setError("Enter username");
    return;
  }

  if (!password.trim()) {
    setError("Enter password");
    return;
  }

  try {

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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

    

    router.replace("/customer/animal");

  } catch (error) {

    console.error(error);
    setError("Something went wrong");

  }

}}

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
mt-4
text-red-400
text-center
"
>

{error}

</p>

)
}


<p
className="
mt-8
text-center
text-gray-400
"
>

Not registered?

</p>


<Link href="/customer/register">

<button
className="
w-full
mt-4
border
border-green-500
py-5
rounded-2xl
"
>

Register

</button>

</Link>

</div>

</main>

);

}