"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function Register(){

const router =
useRouter();

const [name, setName] = useState("");
const [username, setUsername] = useState("");

const [email,
setEmail]=
useState("");

const [password,
setPassword]=
useState("");

const [error,
setError]=
useState("");
const [phone,setPhone]=
useState("");

const [address,setAddress]=
useState("");
const [loading, setLoading] = useState(false);
async function register(){
    setLoading(true);

setError("");

if(
!username.trim()
||
!email.trim()
||
!phone.trim()
||
!address.trim()
||
!password.trim()
){

setError(
"Fill all fields"
);
setLoading(false);
return;

}
if(
username.length<3
){

setError(
"Username must contain at least 3 characters"
);
setLoading(false);
return;

}

if(
!email.includes("@")
){

setError(
"Enter valid email"
);
setLoading(false);
return;

}

if(
password.length<6
){

setError(
"Password must contain at least 6 characters"
);
setLoading(false);
return;

}
if(
phone.length!==10
){

setError(
"Phone number must be 10 digits"
);
setLoading(false);
return;

}

try{

const res = await fetch("/api/auth/register", {
method:"POST",

headers:{
"Content-Type":
"application/json"
},

body: JSON.stringify({
  name,
  username,
  email,
  password,
  phone,
  address,
})


}
);

const data=
await res.json();

if (!res.ok) {  
  setLoading(false);
  setError(data.message);
  return;
}

  setLoading(false);

router.push(
"/customer"
);

}

catch (error) {
  console.error("Register Error:", error);

  setLoading(false);

  if (error instanceof Error) {
    setError(error.message);
  } else {
    setError("Unknown Error");
  }
}
}
return(

<main
className="
min-h-screen
bg-black
text-white
flex
items-center
justify-center
"
>

<div
className="
max-w-xl
w-full
bg-white/5
p-12
rounded-3xl
"
>

<h1 className="text-4xl">

Register

</h1>


<input
value={name}
onChange={(e)=>
setName(
e.target.value
)
}
placeholder="Full Name"
className="
w-full
p-5
mt-8
bg-black
"
/>
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
p-5
mt-5
bg-black
"
/>


<input

value={email}

onChange={(e)=>
setEmail(
e.target.value
)
}

placeholder="Email"

className="
w-full
p-5
mt-5
bg-black
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
p-5
mt-5
bg-black
"
/>
<input

value={phone}

onChange={(e)=>
setPhone(
e.target.value
)
}

placeholder="Phone Number"

className="
w-full
p-5
mt-5
bg-black
"
/>
<input

value={address}

onChange={(e)=>
setAddress(
e.target.value
)
}

placeholder="Address"

className="
w-full
p-5
mt-5
bg-black
"
/>

<button
onClick={register}
disabled={loading}
className="
w-full
mt-8
bg-green-500
p-5
rounded-2xl
disabled:opacity-50
"
>
{loading ? "Creating Account..." : "Create Account"}
</button>

{
error && (

<div className="mt-4">

<p
className="
text-red-400
"
>

{error}

</p>

{
error==="Email already registered"
&&
<Link
href="/customer"
>

<button
className="
mt-4
text-green-400
underline
"

>

Go to Login →

</button>

</Link>

}

</div>

)
}


</div>

</main>

);

}