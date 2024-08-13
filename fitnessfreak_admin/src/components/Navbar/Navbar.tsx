"use client"
import React, {useState,useEffect} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import './Navbar.css'
import {  toast } from 'react-toastify';
import logo from './logo.png'
function Navbar() {
     const [isAdminAuthenticated,setisAdminAuthenticated]=useState(false);
   
       const chechAdminAuthenticated=async()=>{

        try{
            const response=await  fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/checklogin', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                
                credentials: 'include'
            });
                    if(response.ok){
                        setisAdminAuthenticated(true);
                    }
                    else{
                        setisAdminAuthenticated(false);
                    }
        }
        catch(err){
            setisAdminAuthenticated(false);
        }
       }
       useEffect(()=>{
        chechAdminAuthenticated();
       }, []);
       
       const handlelogout = async () => {
        fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/logout', {
            method: 'POST',
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.ok) {
                    setisAdminAuthenticated(false);
                    toast('admin logged  out successfully');
                   
                }
                else{
                    
                    toast.error(data.message)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
     return (
    <div className='navbar'>
      <Image src={logo} width={100} className='logo' alt='Logo'/>
      <div className='adminlinks'>
        {
            isAdminAuthenticated?
            (
               <>
                  <Link href='/pages/addworkout'>Add Workout</Link>
                 <button onClick={()=> {
                  handlelogout();
                 
                  }}>Logout</button>
               </>
            ):(
<>

<Link href='/adminauth/login'>Login</Link>
<Link href='/adminauth/register'>Signup</Link>
</>
            )
       }

      </div>
    </div>
  )
}

export default Navbar
