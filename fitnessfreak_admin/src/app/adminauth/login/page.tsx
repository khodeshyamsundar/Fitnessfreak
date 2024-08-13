"use client"
import React, {useState} from 'react'
import '../auth.css';
import { ToastContainer, toast } from 'react-toastify';


function page() {

    const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');


  const handleLogin=async()=>{
     
    try{
     const response=await  fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/login', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify({email,password}),
       credentials: 'include'
   })
       
 const data=await response.json();
 
           if (data.ok) {
               toast.success('Admin login Successfully');
                window.location.href='/pages/addworkout';
              }
 
       else {
               toast.error('Admin login Failed');
           }
         }
         catch(error){
           toast.error('An error occured during login');
         }
       }
  return (
    <div   className='formpage'>
      <input 
      type="email" 
      placeholder='Email'
      value={email}
      onChange={(e)=> setEmail(e.target.value)}
      />
      <input 
      type="password" 
      placeholder='Password'
      value={password}
      onChange={(e)=> setPassword(e.target.value)}
      />
   <button onClick={handleLogin}>Sign up</button>
    </div>
  )
}

export default page
