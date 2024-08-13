"use client"
import React , {useState} from 'react'
import '../auth.css';
import { ToastContainer, toast } from 'react-toastify';



function SignupPage() {
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  //const []=useState('');
  const handleSignup=async()=>{
     
   try{
    const response=await  fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({name,email,password}),
      credentials: 'include'
  })
      
const data=await response.json();

          if (data.ok) {
              toast.success('Admin Registration Successfull');

             }

      else {
              toast.error('Admin Reginsration Failed');
          }
        }
        catch(error){
          toast.error('An error occured during registration');
        }
      }
  
  return (
    <div className='formpage'>
      
      <input 
      type="text" 
      placeholder='Name'
      value={name}
      onChange={(e)=> setName(e.target.value)}
      />
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
   <button onClick={handleSignup}>Sign up</button>
    </div>
  )
}

export default SignupPage
