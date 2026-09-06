"use client";

import { useState } from "react";

type Props={
amount:string;
customer:string;
};

export default function PaymentModal({
amount,
customer
}:Props){

const [
open,
setOpen
]=useState(false);

const [
loading,
setLoading
]=useState(false);

const [
success,
setSuccess
]=useState(false);

async function receivePayment(){

try{

setLoading(true);

/*
BACKEND READY

Later connect:

POST /api/payments
*/

const res=
await fetch(
"/api/payments",
{
method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:JSON.stringify({

customer,

amount,

date:
new Date()
.toISOString(),

status:
"completed"

})

}
);

if(
!res.ok
){

throw new Error();

}

setSuccess(true);

setOpen(true);

}

catch{

alert(
"Payment failed"
);

}

finally{

setLoading(false);

}

}

return(

<>

<button
onClick={receivePayment}

disabled={loading}

className="
mt-10
w-full
bg-green-500
py-4
rounded-2xl
text-black
font-bold
hover:scale-[1.02]
duration-300
disabled:opacity-60
"
>

{

loading

?

"Processing..."

:

"Receive Payment"

}

</button>

{

open && (

<div
className="
fixed
inset-0
bg-black/70
flex
justify-center
items-center
z-50
"
>

<div
className="
bg-green-950
border
border-green-700
p-10
rounded-3xl
text-center
w-[420px]
"
>

<h2
className="
text-3xl
font-bold
"
>

{

success

?

"Payment Successful"

:

"Payment Failed"

}

</h2>

<p
className="
mt-5
text-green-300
"
>

{amount} credited

</p>

<button
onClick={()=>{

setOpen(false);

setSuccess(false);

}}

className="
mt-8
bg-green-500
text-black
px-8
py-3
rounded-xl
font-bold
"
>

Close

</button>

</div>

</div>

)

}

</>

);

}