"use client"
import React from 'react'
import '../profile.css'
import { ToastContainer, toast } from 'react-toastify';
function ProfilePage() {

  const [data, setData] = React.useState<any>([]);
  const getdata = async () => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/auth/userdata', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })

      .then(res => res.json())
      .then(d => {
        if (d.ok) {

          setData(d.data);
          console.log(data);
          

        }
        else {
          toast.error('error in retrieving user data')
        }
      })
      .catch(err => {

        toast.error('error in getting user data')

        console.log(err);

      })


  }
  console.log(data);
  React.useEffect(() => {
    getdata();
  }, [data]);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-image">

        </div>
        <div className="profile-info">
          <h1>{data.name}</h1>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>DOB:</strong> {data.dob}</p>
          <p><strong>Gender:</strong> {data.gender}</p>
          {/* <p><strong>Weight:</strong> {parseFloat(data.height[data.height.length - 1].height)}</p> */}
          {/* <p><strong>Height:</strong> {data.height}</p> */}
          <p><strong>Goal:</strong> {data.goal}</p>
          
          
          <p><strong>age:</strong> {data.age}</p>
          <p><strong>activitylevel:</strong> {data.activityLevel}</p>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
