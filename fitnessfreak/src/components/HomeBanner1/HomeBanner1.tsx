import React from 'react'
import CircularProgress from '@mui/joy/CircularProgress';
import { AiOutlineEye } from 'react-icons/ai'
import './HomeBanner1.css'
import { toast } from 'react-toastify';


function HomeBanner1() {

    const [data, setData] = React.useState<any>(null)
   // const [calorie, setCalorie] = React.useState<any>(0)
   
  //   const goalcalorie=()=>{
  //     fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/getgoalcalorieintake', {
  //      method: 'GET',
  //      headers: {
  //          'Content-Type': 'application/json',
          
  //      },
       
  //      credentials: 'include'
  //  })
   
  //  .then(res => res.json())
  //      .then(data => {
  //        if(data.ok){
         
  //         setCalorie(data.data);
          
  //        }
  //        else{
  //               toast.error('error occured ')
  //        }
  //      })
  //      .catch(err => {
         
  //        toast.error('error in getting goal calorie intake')
          
  //         console.log(err);
          
  //      })
   
   
  //  }
   
  //  React.useEffect(()=> {
  //    goalcalorie();
  //  },[calorie]);

    const getData = async () => {
      
     

      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/report/getreport', {
        method: 'GET',
        credentials: 'include',
      })

      .then(res => res.json())
      .then(data => {
        console.log(data);
        if(data.ok){
          setData(data.data);
        }
        else{
          setData([]);
        }
        
      })

      .catch(err =>{
        console.log(err);
        setData([]);
        
      })
    }
  
    React.useEffect(() => {
      getData()
    }, [])
  
    
  return (
    <div className='meters'>

    {
      data?.length > 0 && data.map((item: any, index: number) => {
        return (
          <div className='card' key={index}>
            <div className='card-header'>
              <div className='card-header-box'>
                <div className='card-header-box-name'>{item.name}</div>
                <div className='card-header-box-value'>{parseInt(item.value)} {item.unit}</div>
              </div>
              <div className='card-header-box'>
                <div className='card-header-box-name'>Target</div>
                <div className='card-header-box-value'>{parseInt(item.goal)} {item.goalUnit}</div>
              </div>
            </div>

            <CircularProgress
              color="neutral"
              determinate
              variant="solid"
              size="lg"
              value={
                (item.value / item.goal) * 100
              }
            >
              <div className='textincircle'>
                <span>{parseInt(item.value)}</span>
                <span className='hrline'></span>
                <span>{parseInt(item.goal)}</span>
              </div>
            </CircularProgress>

            <button
             onClick={() => {
              window.location.href = `/report/${item.name}`
            }}
            >Show Report <AiOutlineEye /></button>

          </div>
        )
      })
    }
  </div>
  )
}

export default HomeBanner1
